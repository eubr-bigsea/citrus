import PipelineRunsList from "@/views/PipelineRunsList.vue";
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
    { path: '/pipeline/runs', component: PipelineRunsList },
];

const router = new VueRouter({ routes });

describe('<PipelineRunsList />', () => {

    beforeEach(() => {

        cy.intercept(
            'GET', 
            Cypress.config().stand + '/pipeline-runs?*', 
            {
                fixture: "pipelineRuns.json"
            }
        ).as("getPipelineRuns");

        cy.mount(PipelineRunsList, {
            localVue,
            router,
            i18n,
        });

        cy.wait("@getPipelineRuns");
    });

    it('header renders correctly', () => {

        cy.get('[data-test="header"]').should('contain', tc('titles.pipelineRuns', 0));
        cy.get('[data-test="header"] h1').should('have.class', 'runsList-title');

    });

    it('all columns in the table in correct order', () => {

        cy.get('[data-test="pipelineRunsList"] thead').within(() => {

            cy.get('th').eq(0).should('contain', 'ID');
            cy.get('th').eq(1).should('contain',tc('titles.pipeline') + ' ID');
            cy.get('th').eq(2).should('contain',tc('titles.pipeline'));
            cy.get('th').eq(3).should('contain',tc('common.period'));
            cy.get('th').eq(4).should('contain',tc('common.updated'));
            cy.get('th').eq(5).should('contain',t('common.last') + ' ' + tc('dataExplorer.step',1));
            cy.get('th').eq(6).should('contain',tc('titles.comment', 2));
            cy.get('th').eq(7).should('contain',tc('common.status'));

        });
    });

    it('all rows in the table with right info', () => {

        const formatJsonDate = (v, fmt) => {
            if (v) {
                if (fmt === undefined) {
                    fmt = 'dd/MM/yyyy HH:mm';
                }
                return format(parseISO(v + '.000Z'), fmt);
            }
        };

        cy.fixture('pipelineRuns.json').then((mockedData) => {
            cy.get('[data-test="pipelineRunsList"] tbody tr').each(($row, index) => {
                const mockedRow = mockedData['data'][index];

                cy.wrap($row).within(() => {
                    cy.get('td a').eq(0).should('have.text', ` ${mockedRow.id} `);
                    cy.get('td').eq(1).should('have.text', ` ${mockedRow.pipeline_id} `);
                    cy.get('td').eq(2).should('have.text', ` ${mockedRow.pipeline_name} `);
                    cy.get('td').eq(3).should('have.text', ` ${formatJsonDate(mockedRow.start,'dd/MM/yyyy')} ${t('common.until').toLowerCase()} ${formatJsonDate(mockedRow.finish,'dd/MM/yyyy')} `);
                    cy.get('td').eq(4).should('have.text', ` ${formatJsonDate(mockedRow.updated,'dd/MM/yyyy HH:MM:SS')} `);
                    cy.get('td').eq(5).should('have.text', mockedRow.last_executed_step);
                    cy.get('td').eq(6).should('have.text', mockedRow.comment || '');
                    cy.get('td').eq(7).within(($status) => {
                        cy.wrap($status).should('have.text', ` ${t("status."+mockedRow.status).toUpperCase()} `);
                        cy.get('div').should('have.class', mockedRow.status.toLowerCase());
                    });
                });
            });
        });
    })

    it('table filters with correct inputs', () => {

        cy.get('[data-test="table-filters"]').within(() => {
            
            cy.get('div').eq(0).within(() => {
                cy.get('label').should('have.attr', 'for', 'search')
                .should('have.text', t('pipeline.list.pipelineName')+':');
                cy.get('input').should('have.attr', 'type', 'text')
                .should('have.attr', 'placeholder', tc('common.name', 1))
                .should('have.text', '');
            });

            cy.get('div').eq(1).within(() => {
                cy.get('label').should('have.attr', 'for', 'range')
                .should('have.text', t('pipeline.list.periodStart')+': ');
                cy.get('input').should('have.attr', 'type', 'date');
            });

            cy.get('div').eq(2).within(() => {
                cy.get('label').should('have.attr', 'for', 'range')
                .should('have.text', t('pipeline.list.periodFinish')+': ');
                cy.get('input').should('have.attr', 'type', 'date');
            });

            cy.get('div').eq(3).within(() => {
                cy.get('label').should('have.attr', 'for', 'status')
                .should('have.text', tc('common.status')+': ');

                cy.get('select').should('exist');
                
                const statuses = ['', 'COMPLETED', 'CANCELED', 'ERROR',
                     'INTERRUPTED', 'PENDING', 'RUNNING', 'WAITING',];

                cy.get('select option').then(options => {
                    const selectOptions = [...options].map(option => option.value);
                    console.log(selectOptions);
                    expect(selectOptions).to.have.members(statuses);
                })
            });

            cy.get('div button').should('have.class', 'btn')
            .should('have.text', ` ${t('actions.search')} `);
        });
    });
    
    it('render right number of pages to select', () => {
        cy.fixture('pipelineRuns.json').then((mockedData) => {
            const numberPages = mockedData['pagination']['pages'];
            cy.get('[data-test=pipelineRunsList] div nav .page-item')
            .should('have.length', 4+numberPages)
        });
    });

});