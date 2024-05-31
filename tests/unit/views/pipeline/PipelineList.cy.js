import PipelineList from "@/views/PipelineList.vue";
import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import messages from '@/i18n/messages.js';
import VueI18n from 'vue-i18n';
import ModalCreatePipeline from "@/views/modal/ModalCreatePipeline.vue";
import BootstrapVue from 'bootstrap-vue';
import { BModal } from "bootstrap-vue";

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

const localVue = createLocalVue();
localVue.use(VueI18n);
localVue.use(VueRouter);
localVue.use(BootstrapVue);
localVue.component('BModal', BModal);
localVue.component('ModalCreatePipeline', ModalCreatePipeline);

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
        cy.intercept("GET", `${tahitiUrl}/pipelines?query=&limit=10&ascending=0&page=1&byColumn=0&orderBy=created&sort=created&asc=false&size=10&name=&fields=id,name,version,created,updated,user_name`, { fixture: "pipelines.json" }).as("getPipelines");

        cy.mount(PipelineList, {
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

    it('Checks if the header is rendered correctly', () => {
        
        cy.get('[data-test="header"]').should('be.visible');
        cy.get('.pipelineList-title').should('be.visible');
        cy.get('[data-test="runsButton"]').should('be.visible');
        cy.get('[data-test="addButton"]').should('be.visible');

    });

    it('Checks if the table is rendered correctly', () => {

        cy.get('[data-test="pipelines-table"]').should('be.visible');

    });

    it('Checks if the pipeline creation process is working correctly', () => {

        const pipelineTitle = "Pipeline Teste";
        const pipelineDescription = "Descrição da Pipeline Teste.";

        cy.get('[data-test="addButton"]').click();

        cy.get('[data-test="addModal"]').should('be.visible');

        cy.get('[data-test="input"]').type(pipelineTitle);

        cy.get('[data-test="textarea"]').type(pipelineDescription);

        cy.get('[data-test="nextButton"]').click();

        cy.get('[data-test="finalizeButton"]').click();

        cy.get('[data-test="closeButton"]').click();

    });

    it('Type a name with less than 3 characters', () => {

        const pipelineTitle = "Ab";
        const pipelineDescription = "Descrição da Pipeline Teste.";

        cy.get('[data-test="addButton"]').click();

        cy.get('[data-test="addModal"]').should('be.visible');

        cy.get('[data-test="input"]').type(pipelineTitle);

        cy.get('[data-test="textarea"]').type(pipelineDescription);

        cy.get('[data-test="nextButton"]').should('be.disabled');
        
    });

});