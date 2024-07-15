Cypress.Commands.add('login', () => {
    cy.session('Login', () => {
        cy.visit('/auth/login')

        cy.get('[data-test="email"]').type('waltersf@gmail.com');
        cy.get('[data-test="password"]').type('zooropa');
        cy.get('[data-test="login"]').click();
        
        cy.url().should('eq', Cypress.config().baseUrl + '/home');
        cy.getAllLocalStorage().then((result) => {
            const {token, user} = result[Cypress.config().baseUrl]
            expect(user).to.include('waltersf@gmail.com');
            expect(token).to.exist;
        });
    });
})