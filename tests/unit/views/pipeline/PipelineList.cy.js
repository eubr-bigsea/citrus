import PipelineList from "@/views/PipelineList.vue";
import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import messages from '@/i18n/messages.js';
import VueI18n from 'vue-i18n';
import ModalCreatePipeline from "@/views/modal/ModalCreatePipeline.vue";

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

const localVue = createLocalVue();
localVue.use(VueI18n);
localVue.use(VueRouter);

const i18n = new VueI18n({
    locale: 'pt',
    messages,
});

const routes = [
    { path: '/pipelines', component: PipelineList },
];

const router = new VueRouter({ routes });

describe('<PipelineList />', () => {

    beforeEach(() => {
        cy.intercept(
            "GET",
            `${tahitiUrl}/pipelines?*`,
            { 
                fixture: "pipelines.json" 
            }
        ).as("getPipelines");

        cy.mount(PipelineList, {
            components: { 
                ModalCreatePipeline 
            },
            localVue,
            router,
            i18n,
        });
    });

    it('Checks if the request response is correct', () => {

        cy.wait("@getPipelines").then((interception) => {
            assert.isNotNull(interception.response.body, 'Interceptação tem um corpo de resposta');
        });

    });

    it('renders the header correctly', () => {

        cy.get('[data-test="header"]').should('contain', 'Pipelines');
        cy.get('[data-test="runsButton"]').should('be.visible');
        cy.get('[data-test="addButton"]').should('be.visible');

    });

    it('renders the pipelines table correctly', () => {

        cy.get('[data-test="pipelines-table"]').should('be.visible');

    });

    it('sorts the pipelines table', () => {

        cy.get('[data-test="pipelines-table"] th').contains('ID').click();
        cy.wait('@getPipelines');
    });

    it('checks if the header is rendered correctly', () => {

        cy.get('[data-test="header"]').should('be.visible');
        cy.get('.pipelineList-title').should('be.visible');
        cy.get('[data-test="runsButton"]').should('be.visible');
        cy.get('[data-test="addButton"]').should('be.visible');

    });


});