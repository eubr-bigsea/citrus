import PipelineEdit from "@/views/PipelineEdit.vue";
import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import messages from '@/i18n/messages.js'; 
import VueI18n from 'vue-i18n';
import store from "../../../../src/store.js";
import ModalAddPipelineStep from "@/views/modal/ModalAddPipelineStep.vue";

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

const localVue = createLocalVue();
localVue.use(VueI18n);
localVue.use(VueRouter);

const i18n = new VueI18n({
    locale: 'pt',
    messages,
});

const routes = [
    { path: `/pipeline/34`, component: PipelineEdit },
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
            `${tahitiUrl}/pipelines/34`, 
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

        cy.get('[data-test="pretitle"]').should('contain', 'Pipeline #');
        cy.get('[data-test="input-header"]').should('have.value', '');
        
    });

    it('enables the save button when changes are made', () => {

        cy.get('[data-test="input-header"]').type('New Pipeline Name');
        cy.get('[data-test="save-button"]').should('not.be.disabled');

    });

    it('can toggle the enabled checkbox', () => {

        cy.get('[data-test="enabled-checkbox"]').click();
        cy.get('[data-test="enabled-checkbox"]').should('be.visible');
        cy.get('[data-test="save-button"]').should('not.be.disabled');

    });

    it('allows adding a new step', () => {

        cy.get('[data-test="add-step-button"]').click().then(() => {
            cy.mount(ModalAddPipelineStep, {
                global: {
                    plugins: [store],
                },
                localVue,
                router,
                i18n,
            });
            cy.get('[data-test="step-name-input"]').type('New Step');
            cy.get('[data-test="save-step-button"]').click();
        });
        cy.get('[data-test="steps-list"]').should('contain', 'New Step');
        
    });

    it('updates periodicity settings', () => {

        cy.get('[data-test="periodicity-button"]').click();
        cy.get('[data-test="periodicity-select"]').select('weekly');
        cy.get('#repetir-dias').type('2');
        cy.get('[data-test="save-button"]').should('not.be.disabled');

    });


    it('checks if the header is rendered correctly', () => {

        cy.get('[data-test="header"]').should('be.visible');
        cy.get('[data-test="pretitle"]').should('be.visible');
        cy.get('[data-test="input-header"]').should('be.visible');

        cy.get('[data-test="enabled-checkbox"]').should('be.visible');
        cy.get('[data-test="periodicity-button"]').should('be.visible');
        cy.get('[data-test="history-button"]').should('be.visible');
        cy.get('[data-test="save-button"]').should('be.visible');

    });

    it('checks if each container is rendered correctly', () => {
        
        cy.get('.editPage-body').should('be.visible');
        cy.get('.editPage-container').should('be.visible');

        cy.get('[data-test="left-container"]').should('be.visible');
        cy.get('.editPage-collapse-title').should('be.visible');
        cy.get('.editPage-infos').should('be.visible');

        cy.get('[data-test="right-container"]').should('be.visible');
        cy.get('.editPage-collapse-title').should('be.visible');
        cy.get('.editPage-collapse-div').should('be.visible');

    });

    it('checks some general user actions', () => {

        const pipelineTitle = "Pipeline Teste";
        const pipelineDescription = "Descrição da Pipeline Teste.";
        
        cy.get('[data-test="input-header"]').type(pipelineTitle);
        cy.get('[data-test="textarea-custom"]').type(pipelineDescription);
        
        cy.get('[data-test="enabled-checkbox"]').click();
        cy.get('[data-test="periodicity-button"]').click();
        cy.get('[data-test="periodicity-select"]').select('daily');

        cy.get('[data-test="daily-input"]').type('2024-02-28');
        cy.get('#repetir-dias').type('2');
        cy.get('.editPage-periodicity-x').click();

        cy.get('[data-test="save-button"]').click();

    });
});