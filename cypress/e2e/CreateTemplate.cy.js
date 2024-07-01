describe('Create Template', () => {

    beforeEach(() => {
        cy.login();
        cy.visit('/home');
        cy.url().should('eq', Cypress.config().baseUrl + '/home');
    });

    it('Pipeline Template creation process', () => {

        cy.get('[data-test="navbar-admin"]').click();
        cy.get('[data-test="navbar-template"]').click();

        cy.get('[data-test="addTemplateBtn"]').click();

        cy.get('[data-test="input"]').type('Modelo Teste');
        cy.get('[data-test="textarea"]').type('Descrição do Modelo Teste.');

        cy.get('[data-test="addStepButton"]').click();

        cy.get('[data-test="stepInput"]').type('Passo Teste');
        cy.get('[data-test="stepTextarea"]').type('Descrição do Passo Teste.');

        cy.intercept('POST', Cypress.config().tahiti + '/pipeline-templates', {
            statusCode: 201,
            body: { message: 'Pipeline Template created successfully' }
        }).as('createTemplate');

        cy.get('.modal-footer .btn-primary').click();

        cy.wait('@createTemplate').its('response.statusCode').should('eq', 201);

    });

});
