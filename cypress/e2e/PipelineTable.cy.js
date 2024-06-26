describe('Pipeline Table', () => {

    beforeEach(() => {
        cy.session('Login', () => {
            cy.visit('http://localhost:8081/auth/login');

            cy.get('[data-test="email"]').type('waltersf@gmail.com').should('have.value', 'waltersf@gmail.com');
            cy.get('[data-test="password"]').type('zooropa').should('have.value', 'zooropa');
            cy.get('[data-test="login"]').click();

            cy.url().should('eq', 'http://localhost:8081/home');
        });
    });
    
    it('Sort table columns', () => {
        cy.visit('http://localhost:8081/home');

        cy.url().should('eq', 'http://localhost:8081/home');

        cy.get(':nth-child(7) > .nav-link').click();

        cy.get('thead > tr > :nth-child(1)').click();

        cy.get('thead > tr > :nth-child(2)').click();

        cy.get('thead > tr > :nth-child(3)').click();

        cy.get('thead > tr > :nth-child(4)').click();
        cy.get('thead > tr > :nth-child(4)').click();
    });

    it('Test pagination buttons', () => {
        cy.visit('http://localhost:8081/home');
        
        cy.url().should('eq', 'http://localhost:8081/home');

        cy.get(':nth-child(7) > .nav-link').click();

        cy.get(':nth-child(4) > .page-link').click();

        cy.get('.VuePagination__pagination > :nth-child(5)').click();

        cy.get(':nth-child(2) > .page-link').click();

        cy.get('.VuePagination__pagination-item-next-chunk').click();
        cy.get('.VuePagination__pagination-item-prev-chunk').click();
    });

    it('Test search', () => {
        cy.visit('http://localhost:8081/home');

        cy.url().should('eq', 'http://localhost:8081/home');

        cy.get(':nth-child(7) > .nav-link').click();

        cy.get('.VueTables__search__input').type('Pipeline').should('have.value', 'Pipeline');
    });

    it('Visit pipeline details page', () => {
        cy.visit('http://localhost:8081/home');

        cy.url().should('eq', 'http://localhost:8081/home');

        cy.get(':nth-child(7) > .nav-link').click();

        cy.get('thead > tr > :nth-child(1)').click();

        cy.get('tbody > :nth-child(1) > :nth-child(2) > a').click();

        cy.url().should('eq', 'http://localhost:8081/pipelines/1');
    });
});
