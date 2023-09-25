Cypress.Commands.add('login', (username, password) => {
    cy.visit('/auth/login')

    cy.get('[data-test="email"]').type('waltersf@gmail.com').should('have.value', 'waltersf@gmail.com');
    cy.get('[data-test="password"]').type('zooropa').should('have.value', 'zooropa');
    cy.get('[data-test="login"]').click()
    
    // we should be redirected to /dashboard
    cy.url().should('include', '/') // FIXME

    // our auth cookie should be present
    //cy.getCookie('your-session-cookie').should('exist')

    // UI should reflect this user being logged in
    //cy.get('h1').should('contain', username)
})