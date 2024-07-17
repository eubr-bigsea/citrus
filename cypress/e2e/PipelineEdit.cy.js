describe('Pipeline Edit', () => {

    beforeEach(() => {
        cy.login();
        cy.visit('/home');
        cy.url().should('eq', Cypress.config().baseUrl + '/home');

        cy.intercept('GET', Cypress.config().tahiti + '/pipelines?query=Pipeline+de+teste*').as("getPipelineListFiltered");
        cy.intercept('GET', Cypress.config().tahiti + '/pipelines/*').as("getPipeline");

        cy.get('[data-test="pipelines-menu"]').click();
        cy.get('[data-test="pipelines-item"]').click();
        
        cy.get('[data-test="pipelines-table"] input').type('Pipeline de teste');
        cy.wait('@getPipelineListFiltered');
        
        cy.get('tbody > :nth-child(1) > :nth-child(2) > a').click();
    });
    
    it('Edit pipeline details', () => {
        cy.get('[data-test="input-header"] > input').clear().type('Pipeline Editado').should('have.value', 'Pipeline Editado');
        cy.get('[data-test="enabled-checkbox"] > .d-flex').click();

        cy.get('[data-test="periodicity-button"]').click();
        cy.get('[data-test="periodicity-div"]').should('be.visible');
        cy.get('[data-test="periodicity-select"]').select('daily').should('have.value', 'daily');
        cy.get('[data-test="daily-input"]').type('2024-02-28').should('have.value', '2024-02-28');
        cy.get('#repetir-dias').type('2').should('have.value', '2');
        cy.get('.editPage-periodicity-x').click();

        cy.get('[data-test="pipeline-id"]').invoke('text').then((pipelineId) => {
            cy.intercept('PATCH', Cypress.config().tahiti + `/pipelines/${pipelineId}`, {
                statusCode: 200,
                body: { message: 'Pipeline edited successfully' }
            }).as('editPipeline');

            cy.get('[data-test="save-button"]').click();

            cy.wait('@editPipeline').its('response.statusCode').should('eq', 200);
        });
    });

    it('Edit pipeline steps details', () => {
        cy.get('[data-test="edit-step-tab"]').click();

        cy.get('#nome').clear().type('Etapa editada').should('have.value', 'Etapa editada');
        cy.get('#descricao').clear().type('Descrição da Etapa editada').should('have.value', 'Descrição da Etapa editada');

        cy.get('[data-test="pipeline-id"]').invoke('text').then((pipelineId) => {
            cy.intercept('PATCH', Cypress.config().tahiti + `/pipelines/${pipelineId}`, {
                statusCode: 200,
                body: { message: 'Pipeline edited successfully' }
            }).as('editPipeline');

            cy.get('[data-test="save-button"]').click();

            cy.wait('@editPipeline').its('response.statusCode').should('eq', 200);
        });
    });

    it('Create and delete new pipeline step', () => {
        // add 'New Step'
        cy.get('[data-test="add-step-button"]').first().click();
        cy.get('[data-test="step-name-input"]').type('New Step');
        cy.contains('button','OK').click();

        // verifies existence of 'New Step' in steps list
        cy.get('[data-test="steps-list"]').should('contain', 'New Step');

        // deletes 'New Step' created
        cy.get('[data-test="delete-step-button"]').last().click();
        cy.get('.snotifyToast__buttons > button').first().click();
        cy.get('[data-test="steps-list"]').should('not.contain', 'New Step');
    });

    it('Sets the step schedule (once)', () => {
        cy.get('[data-test="select-frequency"]').select('once').should('have.value', 'once');

        cy.get('#iniciar-data').type('2024-02-28').should('have.value', '2024-02-28');
        cy.get('#iniciar-hora').type('10:00').should('have.value', '10:00');

        cy.get('[data-test="pipeline-id"]').invoke('text').then((pipelineId) => {
            cy.intercept('PATCH', `https://dev.lemonade.org.br/api/v1/tahiti/pipelines/${pipelineId}`, {
                statusCode: 200,
                body: { message: 'Pipeline edited successfully' }
            }).as('editPipeline');

            cy.get('[data-test="save-button"]').click();

            cy.wait('@editPipeline').its('response.statusCode').should('eq', 200);
        });
    });

    it('Sets the step schedule (daily)', () => {
        cy.get('[data-test="select-frequency"]').select('daily').should('have.value', 'daily');

        cy.get('#iniciar-data').type('2024-02-28').should('have.value', '2024-02-28');
        cy.get('#iniciar-hora').type('10:00').should('have.value', '10:00');
        cy.get('#repetir-dias').type('2').should('have.value', '2');

        cy.get('[data-test="pipeline-id"]').invoke('text').then((pipelineId) => {
            cy.intercept('PATCH', `https://dev.lemonade.org.br/api/v1/tahiti/pipelines/${pipelineId}`, {
                statusCode: 200,
                body: { message: 'Pipeline edited successfully' }
            }).as('editPipeline');

            cy.get('[data-test="save-button"]').click();

            cy.wait('@editPipeline').its('response.statusCode').should('eq', 200);
        });
    });

    it('Sets the step schedule (weekly)', () => {
        cy.get('[data-test="select-frequency"]').select('weekly').should('have.value', 'weekly');

        cy.get('#iniciar-data').type('2024-02-28').should('have.value', '2024-02-28');
        cy.get('#iniciar-hora').type('10:00').should('have.value', '10:00');
        cy.get('#repetir-semanas').type('2').should('have.value', '2');

        cy.get(':nth-child(3) > .custom-control-label').click();
        cy.get(':nth-child(4) > .custom-control-label').click();
        cy.get(':nth-child(5) > .custom-control-label').click();

        cy.get('[data-test="pipeline-id"]').invoke('text').then((pipelineId) => {
            cy.intercept('PATCH', `https://dev.lemonade.org.br/api/v1/tahiti/pipelines/${pipelineId}`, {
                statusCode: 200,
                body: { message: 'Pipeline edited successfully' }
            }).as('editPipeline');

            cy.get('[data-test="save-button"]').click();

            cy.wait('@editPipeline').its('response.statusCode').should('eq', 200);
        });
    });

    it('Sets the step schedule (monthly)', () => {
        cy.get('[data-test="select-frequency"]').select('monthly').should('have.value', 'monthly');

        cy.get('#iniciar-data').type('2024-02-28').should('have.value', '2024-02-28');
        cy.get('#iniciar-hora').type('10:00').should('have.value', '10:00');

        cy.get('[data-test="select-all-months"]').click();
        cy.get('[data-test="select-all-days"]').click();

        cy.get('[data-test="pipeline-id"]').invoke('text').then((pipelineId) => {
            cy.intercept('PATCH', Cypress.config().tahiti + `/pipelines/${pipelineId}`, {
                statusCode: 200,
                body: { message: 'Pipeline edited successfully' }
            }).as('editPipeline');

            cy.get('[data-test="save-button"]').click();

            cy.wait('@editPipeline').its('response.statusCode').should('eq', 200);
        });
    });

    it('Sets the step schedule (triggeredByUser)', () => {
        cy.get('[data-test="select-frequency"]').select('user').should('have.value', 'user');

        cy.get('[data-test="pipeline-id"]').invoke('text').then((pipelineId) => {
            cy.intercept('PATCH', `https://dev.lemonade.org.br/api/v1/tahiti/pipelines/${pipelineId}`, {
                statusCode: 200,
                body: { message: 'Pipeline edited successfully' }
            }).as('editPipeline');

            cy.get('[data-test="save-button"]').click();

            cy.wait('@editPipeline').its('response.statusCode').should('eq', 200);
        });
    });

    it('Sets the step schedule (immediately)', () => {
        cy.get('.editPage-left-container > :nth-child(2) > :nth-child(2) > :nth-child(2)').click();

        cy.get('[data-test="select-frequency"]').select('immediately').should('have.value', 'immediately');

        cy.get('[data-test="pipeline-id"]').invoke('text').then((pipelineId) => {
            cy.intercept('PATCH', `https://dev.lemonade.org.br/api/v1/tahiti/pipelines/${pipelineId}`, {
                statusCode: 200,
                body: { message: 'Pipeline edited successfully' }
            }).as('editPipeline');

            cy.get('[data-test="save-button"]').click();

            cy.wait('@editPipeline').its('response.statusCode').should('eq', 200);
        });
    });
});
