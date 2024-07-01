describe('Pipeline Edit', () => {

    beforeEach(() => {
        cy.login();
        cy.visit('/home');
        cy.url().should('eq', Cypress.config().baseUrl + '/home');

        cy.get(':nth-child(7) > .nav-link').click();
        cy.get('thead > tr > :nth-child(1)').click().click();
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

});
