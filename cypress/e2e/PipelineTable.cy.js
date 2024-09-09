describe('Pipeline Table', () => {

    beforeEach(() => {
        cy.login();
        cy.visit('/home');
        cy.url().should('eq', Cypress.config().baseUrl + '/home');
        cy.intercept('GET', Cypress.config().tahiti + '/pipelines*').as("getPipelines");
        cy.get('[data-test="pipelines-menu"]').click();
        cy.get('[data-test="pipelines-item"]').click();
        
    });
    
    it('Sort table columns', () => {

        cy.get(':nth-child(7) > .nav-link').click();
        cy.wait('@getPipelines');
        cy.get('thead > tr > :nth-child(1)').click();
        cy.wait('@getPipelines');
        cy.get('thead > tr > :nth-child(2)').click();
        cy.wait('@getPipelines');
        cy.get('thead > tr > :nth-child(3)').click();
        cy.wait('@getPipelines');
        cy.get('thead > tr > :nth-child(4)').click();
        cy.wait('@getPipelines');
        cy.get('thead > tr > :nth-child(4)').click();
        cy.wait('@getPipelines');
    });

    it('Test pagination buttons', () => {

        cy.get(':nth-child(7) > .nav-link').click();

        cy.get(':nth-child(4) > .page-link').click();

        cy.get('.VuePagination__pagination > :nth-child(5)').click();
        cy.wait('@getPipelines');

        cy.get(':nth-child(2) > .page-link').click();

        cy.get('.VuePagination__pagination-item-next-chunk').click();
        cy.wait('@getPipelines');
        cy.get('.VuePagination__pagination-item-prev-chunk').click();
        cy.wait('@getPipelines');
    });

    it('Test search', () => {

        cy.get(':nth-child(7) > .nav-link').click();

        cy.get('.VueTables__search__input').type('Pipeline').should('have.value', 'Pipeline');
        cy.wait('@getPipelines');
    });

    it('Visit pipeline details page', () => {

        cy.get(':nth-child(7) > .nav-link').click();

        cy.get('thead > tr > :nth-child(1)').click();

        cy.get('tbody > :nth-child(1) > :nth-child(2) > a').click();

        cy.url().should('eq', 'http://localhost:8081/pipelines/1');
    });
});
