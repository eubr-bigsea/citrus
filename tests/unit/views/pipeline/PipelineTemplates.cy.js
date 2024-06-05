import PipelineTemplates from "@/views/PipelineTemplates.vue";
import { createLocalVue } from '@vue/test-utils';
import messages from '@/i18n/messages.js';
import VueI18n from 'vue-i18n';
import ModalCreateTemplate from "@/views/modal/ModalCreateTemplate.vue";
import ModalEditTemplate from "@/views/modal/ModalEditTemplate.vue";

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

const localVue = createLocalVue();
localVue.use(VueI18n);

const i18n = new VueI18n({
    locale: 'pt', 
    messages,
});

describe('<PipelineTemplates />', () => {

    beforeEach(() => {
        cy.intercept(
            "GET", 
            `${tahitiUrl}/pipeline-templates`, 
            { 
                fixture: "pipelineTemplates.json"
            }
        ).as("getPipelineTemplates");

        cy.mount(PipelineTemplates, {
            components: {
                ModalCreateTemplate,
                ModalEditTemplate
            },
            localVue,
            i18n,
        });
    });

    it('Checks if the request response is correct', () => {

        cy.wait("@getPipelineTemplates").then((interception) => {
            assert.isNotNull(interception.response.body, 'Interceptação tem um corpo de resposta');
        });

    });

    it('checks if the header is rendered correctly', () => {
        

        cy.get('[data-test="header"]').should('be.visible');
        cy.get('[data-test="title"]').should('be.visible');
        cy.get('[data-test="addTemplateBtn"]').should('be.visible');
        
    });

    it('opens the add template modal when clicking the add button', () => {

        cy.get('[data-test="addTemplateBtn"]').click();
        cy.get('[data-test="addTemplateModal"]').should('be.visible');

    });

    it('checks if the table is rendered correctly', () => {

        cy.get('.templatePage-table').should('be.visible');

    });

    it('opens the edit template modal when clicking the edit button', () => {

        cy.get('.templatePage-table tbody tr').first().find('button[title*="edit"]').click();
        cy.get('.modal').should('be.visible');

    });

    it('can delete a template', () => {

        cy.get('.templatePage-table tbody tr').first().find('button[title*="delete"]').click();
        cy.on('window:confirm', () => true);
        cy.get('.templatePage-table tbody tr').should('have.length.lessThan', 1);

    });

    it('sorts the templates table', () => {

        cy.get('.templatePage-table th').contains('ID').click();
        
    });

    it('Checks if the template creation process is working correctly', () => {

        const templateTitle = "Template Teste";
        const templateDescription = "Descrição do Template Teste.";

        const stepName = "Etapa Teste";
        const stepDescription = "Descrição da Etapa Teste.";

        cy.get('[data-test="addTemplateBtn"]').click();
        cy.get('[data-test="addTemplateModal"]').should('be.visible');
        cy.get('[data-test="input"]').type(templateTitle);
        cy.get('[data-test="textarea"]').type(templateDescription);
        cy.get('[data-test="addStepButton"]').click();
        cy.get('[data-test="stepInput"]').type(stepName);
        cy.get('[data-test="stepTextarea"]').type(stepDescription);
        cy.get('[data-test="closeButton"]').click();

    });
});
