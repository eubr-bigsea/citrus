describe('template spec', () => {
    it('Pipeline creation process (without template)', () => {

        cy.visit('http://localhost:8081/auth/login');
        cy.get('[data-test="email"]').type('waltersf@gmail.com').should('have.value', 'waltersf@gmail.com');
        cy.get('[data-test="password"]').type('zooropa').should('have.value', 'zooropa');
        cy.get('[data-test="login"]').click();

        cy.url().should('eq', 'http://localhost:8081/home');

        cy.get(':nth-child(7) > .nav-link').click();
        cy.get('[data-test="addButton"]').click();

        cy.get('[data-test="input"]').type('Pipeline Teste');
        cy.get('[data-test="textarea"]').type('Descrição da Pipeline Teste.');

        cy.get('[data-test="nextButton"]').click();
        
        cy.get('[data-test="finalizeButton"]').click();

        cy.get('[data-test="closeButton"]').click();

    });

    it('Pipeline creation process (with template)', () => {

        cy.visit('http://localhost:8081/auth/login');
        cy.get('[data-test="email"]').type('waltersf@gmail.com').should('have.value', 'waltersf@gmail.com');
        cy.get('[data-test="password"]').type('zooropa').should('have.value', 'zooropa');
        cy.get('[data-test="login"]').click();

        cy.url().should('eq', 'http://localhost:8081/home');

        cy.get(':nth-child(7) > .nav-link').click();
        cy.get('[data-test="addButton"]').click();

        cy.get('[data-test="input"]').type('Pipeline Teste');
        cy.get('[data-test="textarea"]').type('Descrição da Pipeline Teste.');

        cy.get('[data-test="nextButton"]').click();

        cy.get('[data-test="template-select"]').select('Template Teste');
        
        cy.get('[data-test="finalizeButton"]').click();

        cy.get('[data-test="closeButton"]').click();

    });
});