import PipelineRunDetail from "@/views/PipelineRunDetail.vue";
import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import messages from '@/i18n/messages.js';
import VueI18n from 'vue-i18n';
import { format, parseISO } from 'date-fns';


const localVue = createLocalVue();
localVue.use(VueI18n);
localVue.use(VueRouter);

const i18n = new VueI18n({
    locale: 'pt',
    messages,
});

const t = i18n.t.bind(i18n);
const tc = i18n.tc.bind(i18n);

const routes = [
    { path: '/pipeline/runs/:id', component: PipelineRunDetail },
];

const router = new VueRouter({ routes });

const formatJsonDate = (v, fmt) => {
    if (v) {
        if (fmt === undefined) {
            fmt = 'dd/MM/yyyy HH:mm';
        }
        return format(parseISO(v + '.000Z'), fmt);
    }
};

describe('<PipelineRunsList />', () => {

    beforeEach(() => {

        cy.intercept(
            'GET', 
            Cypress.config().stand + '/pipeline-runs/*', 
            {
                fixture: "pipelineRunDetail.json"
            }
        ).as("getPipelineRunDetail");

        cy.mount(PipelineRunDetail, {
            localVue,
            router,
            i18n,
        });

        cy.wait("@getPipelineRunDetail");
    });

    it('header renders correctly', () => {

        cy.fixture('pipelineRunDetail.json').then((mockedData) => {
            const pipelineRunsDetail = mockedData['data'][0];

            cy.get('[data-test=header] div').first().within(() => {
                cy.get('h6').should('contain.text', `${tc('titles.job', 1)} #${ pipelineRunsDetail['id'] }`);
                cy.get('h1').should('contain.text', pipelineRunsDetail['pipeline_name']);
            });

            cy.get('[data-test=header] div').last().within(() => {
                cy.get('a').should('contain.text', `${ t('actions.back') } - ${ tc('titles.pipelineRuns', 2) }`)
                .should('have.class', 'btn-outline-primary');
                cy.get('button').should('contain.text', t('actions.cancel'))
                .should('have.class', 'btn-outline-danger');
            });
        });
        
    });

    it('execution informations box correctly rendered', () => {

        cy.fixture('pipelineRunDetail.json').then((mockedData) => {
            const pipelineRunsDetail = mockedData['data'][0];

            // checks execution informations title
            cy.get('[data-test=executionInformations] div').first()
            .should('contain.text', t('pipeline.execution.informationTitle'))
            .should('have.class', 'collapse-title');

            // checks different infos
            cy.get('[data-test=executionInformations] .infos-container').within(() => {
                
                cy.get('div').eq(1).should('contain.text', tc('common.period'));
                cy.get('div').eq(2).should('contain.text', 
                    `${ formatJsonDate(pipelineRunsDetail['start'], 'dd/MM/yyyy') } ${ t('common.until').toLowerCase() }`);
                cy.get('div').eq(2).should('contain.text', 
                    `${ formatJsonDate(pipelineRunsDetail['finish'], 'dd/MM/yyyy') }`);

                cy.get('div').eq(4).should('contain.text', tc('common.updated'));
                cy.get('div').eq(5).should('contain.text', formatJsonDate(pipelineRunsDetail['updated']));
    
                cy.get('div').eq(7).should('contain.text', tc('common.status'));
                cy.get('div').eq(9).should('contain.text', t(`status.${pipelineRunsDetail['status']}`).toUpperCase())
                .should('have.class', `runDetail-status status-small ${pipelineRunsDetail['status'].toLowerCase()}`);
            });
        });

    });

    it('steps table correctly rendered', () => {
        // checks steps title
        cy.get('[data-test=steps] div').first().should('contain.text', tc('titles.step', 2));
        
        // checks columns names
        cy.get('[data-test="steps"] .steps-header').within(() => {
            cy.get('button').should('have.class','tab-button');
            cy.get('div').eq(0).should('contain.text', t('titles.order'));
            cy.get('div').eq(1).should('contain.text', tc('common.name'));
            cy.get('div').eq(2).should('contain.text', tc('titles.attempts', 2));
            cy.get('div').eq(3).should('contain.text', t('common.status'));
            cy.get('div').eq(4).should('contain.text', tc('common.action', 2));
        });

        // checks table contents
        cy.fixture('pipelineRunDetail.json').then((mockedData) => {
            
            cy.get('[data-test="steps"] .steps-body').each(($row, index) => {
                const step = mockedData['data'][0]['steps'][index];
                cy.wrap($row).within(() => {
                    cy.get('div').eq(0).should('contain.text', `# ${index+1}`);
                    cy.get('div').eq(1).should('contain.text', step['name']);
                    cy.get('div').eq(2).should('contain.text', step['retries']);
                    cy.get('div div div').first().should('contain.text', t(`status.${step['status']}`).toUpperCase())
                    .should('have.class', `runDetail-status status-small ${step['status'].toLowerCase()}`);
                    cy.get('div div button').first().should('have.attr', 'title', t('actions.execute'));
                });
                    
            });
        });
        
    });

    it('execution report box correctly rendered', () => {
        cy.get('[data-test=executionReport] div').first().within(() => {
            cy.get('div').first().should('contain.text', t('pipeline.execution.reportTitle'));
            
            // write here the box output tests
            // 
            cy.get('.log-div-container').children().should('have.length', 2);
            cy.fixture('pipelineRunDetail.json').then((mockedData) => {
                const lastStepJobs = mockedData['data'][0]['steps'][4]['jobs'];
                const numberStepJobs = lastStepJobs.length;
                const lastStepJob = lastStepJobs[numberStepJobs-1];
                // access opened log details
                cy.get('.log-div-container div div div').first().within(() => {
                    cy.get('[header-tag=header]').first().should('have.class', 'collapse-header')
                    .within(() => {
                        cy.get('div').should('contain.text', `${tc('titles.attempts', 1)} #${numberStepJobs}`);
                        cy.get('div div div').first().should('contain.text', t(`status.${lastStepJob['status']}`).toUpperCase());
                        cy.get('div div button').first().should('exist');
                        cy.get('.p-2').first().should('contain.text', `${tc('titles.start', 1)}: ${formatJsonDate(lastStepJob['started'])}`);
                        cy.get('.p-2').first().should('contain.text', `${t('common.end')}: ${formatJsonDate(lastStepJob['finished'])}`);
                        
                    });
                    // verify the messages log is printing is correct
                    cy.get('.card-body').first().within(() => {
                        lastStepJob['steps'].forEach((step, index)=>{
                            const printedStatus = `${step['status']} ${step['operation']['name']}`;
                            cy.get('.border-bottom').eq(index).should('contain.text', printedStatus);

                            step['logs'].forEach((log, indexLog) => {
                                if (log['type'] !== 'STATUS'){
                                    cy.get('.border-bottom').eq(index).children().eq(indexLog).should('contain.html', log['message']);
                                }

                            });
                        });
                    });
                });

            });
        });
    });

});