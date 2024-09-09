describe('Pipeline Run Detail', () => {
    let responseBody;

    beforeEach(() => {
        cy.login();
        cy.visit('/home');
        cy.url().should('eq', Cypress.config().baseUrl + '/home');

        cy.intercept('GET', Cypress.config().stand + '/pipeline-runs/*').as('getPipelineRun');

        cy.get('[data-test="pipelines-menu"]').click();
        cy.get('[data-test="pipelineRuns-item"]').click();
        cy.get('[data-test="pipelineRunsList"] tbody tr td a').eq(6).click();

    });

    it('get back to the list via header button', () => {
        
        cy.get('[data-test=header] div a')
        .should('have.attr', 'href', '/pipeline/runs')
        .should('have.class', 'btn btn-outline-primary d-print-none float-left btn-sm router-link-active')
        .click();
        
        cy.url().should('eq', Cypress.config().baseUrl + '/pipeline/runs');

    });

    it('steps list clicking is changing execution report', () => {
        
        cy.wait('@getPipelineRun').then((interception) => {
            responseBody = interception.response.body.data[0];
            expect(responseBody).to.exist;
            console.log(responseBody);
        }).then(() => {
            console.log(responseBody);
            
            cy.get('[data-test=steps] .steps-div-container').as('stepsList');
            cy.get('[data-test=executionReport] .log-div-container [header-tag=header]').as('logsList');
            responseBody['steps'].forEach((step, index) => {
                // select some step and check the infos in the report table
                const numberJobs = step['jobs'].length
                cy.get('@stepsList').children().eq(index+1).click();
                cy.get('@logsList').children().should('have.length', numberJobs*2);

            });
        });
        

    });

});
