import PipelineEdit from "@/views/PipelineEdit.vue";
import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import messages from '@/i18n/messages.js'; 
import VueI18n from 'vue-i18n';
import store from "../../../../src/store.js";

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

const localVue = createLocalVue();
localVue.use(VueI18n);
localVue.use(VueRouter);

const i18n = new VueI18n({
    locale: 'pt',
    messages,
});

const routes = [
    { path: `/pipelines/:id`, component: PipelineEdit },
];

const router = new VueRouter({ routes });

const pipeline = {
    id: 34,
    name: "Pipeline Anac",
    description: "Descri\u00e7\u00e3o Pipeline Anac.",
    enabled: true,
    user_id: 1,
    user_login: "waltersf@gmail.com",
    user_name: "Administrador Lemonade",
    created: "2024-01-23T13:25:05",
    updated: "2024-05-07T18:40:09",
    version: 163,
    steps: [
        {
            "id": 99,
            "name": "Raw",
            "order": 1,
            "scheduling": "{\"stepSchedule\":{\"executeImmediately\":false,\"frequency\":\"daily\",\"startDateTime\":\"2024-03-01T09:23:00\",\"intervalDays\":\"4\",\"intervalWeeks\":null,\"weekDays\":[],\"months\":[],\"days\":[]}}",
            "description": "Etapa 1 da pipeline.",
            "enabled": true,
            "workflow": {
                "id": 469,
                "name": "C\u00f3pia de Teste Walter 2",
                "type": "WORKFLOW"
            }
        },
        {
            "id": 100,
            "name": "Stage",
            "order": 2,
            "scheduling": "{\"stepSchedule\":{\"executeImmediately\":false,\"frequency\":\"weekly\",\"startDateTime\":\"2024-02-28T20:02:00\",\"intervalDays\":null,\"intervalWeeks\":\"3\",\"weekDays\":[\"2\",\"4\",\"5\"],\"months\":[],\"days\":[]}}",
            "description": "Etapa 2 da pipeline.",
            "enabled": true,
            "workflow": {
                "id": 79,
                "name": "Histograma",
                "type": "WORKFLOW"
            }
        },
        {
            "id": 102,
            "name": "Dataset",
            "order": 3,
            "scheduling": "{\"stepSchedule\":{\"executeImmediately\":false,\"frequency\":\"once\",\"startDateTime\":\"2024-03-07T18:25:00\",\"intervalDays\":null,\"intervalWeeks\":null,\"weekDays\":[],\"months\":[],\"days\":[]}}",
            "description": "Etapa 3 da pipeline.",
            "enabled": true,
            "workflow": {
                "id": 709,
                "name": "Novo workflow",
                "type": "WORKFLOW"
            }
        },
        {
            "id": 103,
            "name": "MDM",
            "order": 4,
            "scheduling": "{\"stepSchedule\":{\"executeImmediately\":false,\"frequency\":\"user\",\"startDateTime\":null,\"intervalDays\":null,\"intervalWeeks\":null,\"weekDays\":[],\"months\":[],\"days\":[]}}",
            "description": "Etapa 4 da pipeline.",
            "enabled": true,
            "workflow": {
                "id": 709,
                "name": "Novo workflow",
                "type": "WORKFLOW"
            }
        }
    ]
};

describe('<PipelineEdit />', () => {

    beforeEach(() => {

        cy.intercept(
            "GET", 
            `${tahitiUrl}/pipelines/*`, 
            { 
                fixture: "pipeline.json"
            }
        ).as("getPipeline");

        cy.mount(PipelineEdit, {
            global: {
                plugins: [store],
            },
            localVue,
            router,
            i18n,
        });


    });

    it('checks if the request response is correct', () => {

        cy.wait("@getPipeline").then((interception) => {
            assert.isNotNull(interception.response.body, 'Interceptação tem um corpo de resposta');
        });

    });

    it('renders correctly', () => {

        cy.wait("@getPipeline");
        cy.get('[data-test="pretitle"]').should('contain', 'Pipeline #');
        cy.get('[data-test="input-header"]').should('have.value', '');
        
    });

    it('enables the save button when changes are made', () => {

        cy.wait("@getPipeline");
        cy.get('[data-test="input-header"]').type('New Pipeline Name');
        cy.get('[data-test="save-button"]').should('not.be.disabled');

    });

    it('can toggle the enabled checkbox', () => {

        cy.wait("@getPipeline");
        cy.get('[data-test="enabled-checkbox"]').click();
        cy.get('[data-test="enabled-checkbox"]').should('be.visible');
        cy.get('[data-test="save-button"]').should('not.be.disabled');

    });

    it('updates periodicity settings', () => {

        cy.wait("@getPipeline");
        cy.get('[data-test="periodicity-button"]').click();
        cy.get('[data-test="periodicity-select"]').select('weekly');
        cy.get('#repetir-dias').type('2');
        cy.get('[data-test="save-button"]').should('not.be.disabled');

    });


    it('checks if the header is rendered correctly', () => {

        cy.wait("@getPipeline");
        cy.get('[data-test="header"]').should('be.visible');
        cy.get('[data-test="pretitle"]').should('contain', 'Pipeline #');
        cy.get('[data-test="input-header"]').should('have.value', '');

        cy.get('[data-test="enabled-checkbox"]').within(() => {
            cy.get('input[type="checkbox"]').should('be.enabled');
            cy.get('label').should('contain.text', i18n.t('common.enabled'));
        });

        cy.get('[data-test="periodicity-button"]').within(($button) => {
            cy.get('svg').should('have.attr','data-icon').and('equal', 'calendar-days');
            cy.wrap($button).should('contain.text',i18n.t('pipeline.edit.periodicity'));
        });

        cy.get('[data-test="history-button"]').within(($button) => {
            cy.get('svg').should('have.attr','data-icon').and('equal', 'clock-rotate-left');
            cy.wrap($button).should('contain.text',i18n.t('common.history'));
        })

        cy.get('[data-test="save-button"]').within(($button) => {
            cy.get('svg').should('have.attr','data-icon').and('equal', 'floppy-disk');
            cy.wrap($button).should('contain.text',i18n.t('actions.save'));
        })
        

    });

    it('checks if each container is rendered correctly', () => {
        
        cy.wait("@getPipeline");
        cy.get('.editPage-body').should('be.visible');
        cy.get('.editPage-container').should('be.visible');

        cy.get('[data-test="left-container"]').should('be.visible');
        cy.get('.editPage-collapse-title').should('be.visible');
        cy.get('.editPage-infos').should('be.visible');

        cy.get('[data-test="steps-list"]').should('be.visible');
        cy.get('.editPage-collapse-title').should('be.visible');
        cy.get('.editPage-collapse-div').should('be.visible');

    });

    it('checks some general user actions', () => {
        // load infos from pipeline, edit and intercept the PATCH to check whether is ok or not

        // edited values
        const pipelineTitle = "Pipeline Teste";
        const pipelineDescription = "Descrição da Pipeline Teste.";
        
        const updatedPipeline = {
            ...pipeline,
            name: pipelineTitle,
            description: pipelineDescription,
            enabled: false
        };

        // configuration to intercept PATCH and check edited values
        cy.intercept("PATCH", `${Cypress.config().tahiti}/pipelines/*`, (req) => {
            expect(req.body).to.deep.equal(updatedPipeline);
            
            req.reply({
                statusCode: 200,
                body: updatedPipeline
              });
        }).as('patchPipeline');

        cy.wait('@getPipeline');

        // edits through frontend
        cy.get('[data-test="input-header"] > input').clear().type(pipelineTitle);
        cy.get('[data-test="textarea-custom"] > textarea').clear().type(pipelineDescription);
        
        cy.get('[data-test="enabled-checkbox"]').click();
        cy.get('[data-test="periodicity-button"]').click();
        cy.get('[data-test="periodicity-select"]').select('daily');

        cy.get('[data-test="daily-input"]').type('2024-02-28');
        cy.get('#repetir-dias').type('2');
        cy.get('.editPage-periodicity-x').click();

        cy.get('[data-test="save-button"]').click();
        
        cy.wait('@patchPipeline');

    });
});