describe('template spec', () => {
    it('Pipeline Template creation process', () => {

        cy.visit('http://localhost:8081/auth/login');
        cy.get('[data-test="email"]').type('waltersf@gmail.com').should('have.value', 'waltersf@gmail.com');
        cy.get('[data-test="password"]').type('zooropa').should('have.value', 'zooropa');
        cy.get('[data-test="login"]').click();

        cy.url().should('eq', 'http://localhost:8081/home');

        cy.get('#__BVID__39__BV_toggle_').click();
        cy.get(':nth-child(15) > .dropdown-item').click();

        cy.get('[data-test="addTemplateBtn"]').click();

        cy.get('[data-test="input"]').type('Modelo Teste');
        cy.get('[data-test="textarea"]').type('Descrição do Modelo Teste.');

        cy.get('[data-test="addStepButton"]').click();

        cy.get('[data-test="stepInput"]').type('Passo Teste');
        cy.get('[data-test="stepTextarea"]').type('Descrição do Passo Teste.');

        cy.get('.btn btn-primary').click();

    });
});