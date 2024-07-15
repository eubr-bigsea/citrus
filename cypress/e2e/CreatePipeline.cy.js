describe('Create Pipeline', () => {
    
    beforeEach(() => {
        cy.login();
        cy.visit('/home');
        cy.url().should('eq', Cypress.config().baseUrl + '/home');

        // all tests already start in the pipeline creation modal
        cy.get('[data-test="pipelines-menu"]').click();
        cy.get('[data-test="addButton"]').click();
    });

    it('Pipeline creation process (without template)', () => {

        cy.get('[data-test="input"]').type('Pipeline Teste').should('have.value', 'Pipeline Teste');
        cy.get('[data-test="textarea"]').type('Descrição da Pipeline Teste.').should('have.value', 'Descrição da Pipeline Teste.');

        cy.get('[data-test="nextButton"]').click();

        cy.intercept('POST', Cypress.config().tahiti + '/pipelines', {
            statusCode: 201,
            body: { message: 'Pipeline created successfully' }
        }).as('createPipeline');
        
        cy.get('[data-test="finalizeButton"]').click();

        cy.wait('@createPipeline').its('response.statusCode').should('eq', 201);

        cy.get('[data-test="closeButton"]').click();
    });

    it('Pipeline creation process (with template)', () => {

        cy.get('[data-test="input"]').type('Pipeline Teste').should('have.value', 'Pipeline Teste');
        cy.get('[data-test="textarea"]').type('Descrição da Pipeline Teste.').should('have.value', 'Descrição da Pipeline Teste.');

        cy.get('[data-test="nextButton"]').click();

        cy.get('[data-test="template-select"]').select('Template para testes');

        cy.intercept('POST', Cypress.config().tahiti + '/pipelines', {
            statusCode: 201,
            body: { message: 'Pipeline created successfully' }
        }).as('createPipeline');
        
        cy.get('[data-test="finalizeButton"]').click();

        cy.wait('@createPipeline').its('response.statusCode').should('eq', 201);

        cy.get('[data-test="closeButton"]').click();
    });

    it('Try to create pipeline with name less than 3 characters', () => {

        cy.get('[data-test="input"]').type('Aa').should('have.value', 'Aa');
        cy.get('[data-test="textarea"]').type('Descrição da Pipeline Teste.');

        // tests whether minimum input warning is shown 
        cy.get('[data-test="invalidInputLength"]').should('be.visible');

        // tests if clicking next button is not advancing to next modal step
        cy.get('[data-test="nextButton"]').click();
        cy.get('[data-test="template-select"]').should('not.exist');

    });
});