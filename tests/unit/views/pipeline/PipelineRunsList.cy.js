import PipelineRunsList from "@/views/PipelineRunsList.vue";
import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import messages from '@/i18n/messages.js';
import VueI18n from 'vue-i18n';

const localVue = createLocalVue();
localVue.use(VueI18n);
localVue.use(VueRouter);

const i18n = new VueI18n({
    locale: 'pt',
    messages,
});

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

    });

    it('checks if the header is rendered correctly', () => {

        cy.get('[data-test="header"]').should('be.visible');
        cy.get('.runsList-title').should('be.visible');

    });

    it('checks if the table is rendered correctly', () => {

        //cy.get('.runsList-body').should('be.visible');
        cy.get('[data-test="pipelineRunsList"]').should('be.visible');

    });

    it('should render the runs list table with correct columns', () => {

        cy.get('[data-test="pipelineRunsList"]').within(() => {
            cy.get('thead th').eq(0).should('contain', 'ID');
            cy.get('thead th').eq(1).should('contain', 'Pipeline Id');
            cy.get('thead th').eq(2).should('contain', 'Pipeline');
            cy.get('thead th').eq(3).should('contain', 'Período');
            cy.get('thead th').eq(4).should('contain', 'Atualizado');
            cy.get('thead th').eq(5).should('contain', 'Última Etapa');
            cy.get('thead th').eq(6).should('contain', 'Comentário');
            cy.get('thead th').eq(7).should('contain', 'Status');
        });

    });

    it('checks if the pagination button is working correctly', () => {

        cy.get('.page-link ').contains('2').should('be.visible');
        cy.get('.page-link ').contains('2').click();
        cy.get('.page-link ').contains('1').should('be.visible');
        cy.get('.page-link ').contains('1').click();

    });

});