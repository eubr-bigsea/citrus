describe('template spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:8081/auth/login');
        cy.get('[data-test="email"]').type('waltersf@gmail.com').should('have.value', 'waltersf@gmail.com');
        cy.get('[data-test="password"]').type('zooropa').should('have.value', 'zooropa');
        cy.get('[data-test="login"]').click()

    });
});