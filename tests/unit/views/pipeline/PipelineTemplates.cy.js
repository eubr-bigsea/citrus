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
            `${tahitiUrl}/pipeline-templates?*`, 
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

        cy.wait("@getPipelineTemplates");

    });

    it('checks if the header is rendered correctly', () => {
        

        cy.get('[data-test="header"]').should('be.visible');
        cy.get('[data-test="title"]').should('be.visible');
        cy.get('[data-test="addTemplateBtn"]').should('be.visible');
        
    });

    it('checks if the table is rendered correctly', () => {
        
        cy.get('.templatePage-table').should('be.visible');

    });

    it('sorts the templates table', () => {

        cy.wait("@getPipelineTemplates");
        cy.get('.templatePage-table th').contains('ID').click();
        cy.wait("@getPipelineTemplates").then((interception) => {
            const url = interception.request.url;
            expect(url).to.include("orderBy=id");
        });
        
    });
});
