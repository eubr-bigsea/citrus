describe('Create Template', () => {

    beforeEach(() => {
        cy.session('Login', () => {

            cy.visit('http://localhost:8081/auth/login');

            cy.get('[data-test="email"]').type('waltersf@gmail.com').should('have.value', 'waltersf@gmail.com');
            cy.get('[data-test="password"]').type('zooropa').should('have.value', 'zooropa');
            cy.get('[data-test="login"]').click();

            cy.url().should('eq', 'http://localhost:8081/home');

        });
    });

    it('Pipeline Template creation process', () => {
        cy.visit('http://localhost:8081/home');

        cy.url().should('eq', 'http://localhost:8081/home');

        cy.get('[data-test="admin-menu"]').click();
        cy.get(':nth-child(15) > .dropdown-item').click();

        cy.get('[data-test="addTemplateBtn"]').click();

        cy.get('[data-test="input"]').type('Modelo Teste').should('have.value', 'Modelo Teste');
        cy.get('[data-test="textarea"]').type('Descrição do Modelo Teste.').should('have.value', 'Descrição do Modelo Teste.');

        cy.get('[data-test="addStepButton"]').click();

        cy.get('[data-test="stepInput"]').type('Passo Teste').should('have.value', 'Passo Teste');
        cy.get('[data-test="stepTextarea"]').type('Descrição do Passo Teste.').should('have.value', 'Descrição do Passo Teste.');

        cy.intercept('POST', 'https://dev.lemonade.org.br/api/v1/tahiti/pipeline-templates', {
            statusCode: 201,
            body: { message: 'Pipeline Template created successfully' }
        }).as('createTemplate');

        cy.get('.modal-footer .btn-primary').click();

        cy.wait('@createTemplate').its('response.statusCode').should('eq', 201);
    });

    it('Try to create pipeline template with name less than 3 characters', () => {
        cy.visit('http://localhost:8081/home');

        cy.url().should('eq', 'http://localhost:8081/home');

        cy.get('[data-test="admin-menu"]').click();
        cy.get(':nth-child(15) > .dropdown-item').click();

        cy.get('[data-test="addTemplateBtn"]').click();

        cy.get('[data-test="input"]').type('Aa').should('have.value', 'Aa');
        cy.get('[data-test="textarea"]').type('Descrição do Modelo Teste.').should('have.value', 'Descrição do Modelo Teste.');
        
        cy.get('[data-test="invalidInputLength"]').should('be.visible');
    });

});
