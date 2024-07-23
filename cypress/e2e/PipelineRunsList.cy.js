describe('Create Template', () => {

    beforeEach(() => {
        cy.login();
        cy.visit('/home');
        cy.url().should('eq', Cypress.config().baseUrl + '/home');

        cy.get('[data-test="pipelines-menu"]').click();
        cy.get('[data-test="pipelineRuns-item"]').click()

    });

    it('filter inputs sending correct requests', () => {
        // test cases in the list above below

        // a better way to do this would be using the 'query' rather than the full url
        // but its not working properly, refact in eventual update in cypress package
        const tests = [ {url: '/pipeline-runs?*name=teste*', value: ['teste', null, null, null]},
                        {url: '/pipeline-runs?*start=2024-07-23*', value: [null, '2024-07-23', null, null]},
                        {url: '/pipeline-runs?*end=2024-08-23*', value: [null, null, '2024-08-23', null]},
                        {url: '/pipeline-runs?*status=PENDING*', value: [null, null, null, 'PENDING']},
                        {url: '/pipeline-runs?*ame=teste*status=PENDING*', value: ['teste', null, null, 'PENDING']},
                        {url: '/pipeline-runs?*start=2024-07-23*end=2024-08-23*', value: [null, '2024-07-23', '2024-08-23', null]},
                        {url: '/pipeline-runs?*name=teste*status=PENDING*start=2024-07-23*end=2024-08-23*',
                             value: ['teste', '2024-07-23', '2024-08-23', 'PENDING']},
        ];

        // clear all fields after a test case
        const clearInputs = () => {
            for (let index = 0; index < tests[0]['value'].length; index++) {
                if (index == 3){
                    cy.get('select').select('');
                    continue;
                }
                cy.get('input').eq(index).clear();
            }
        };

        // trigger one test
        const triggerTest = (test) => {
            cy.intercept('GET', Cypress.config().stand + test['url']).as("getFilteredSearch");
            test['value'].forEach((item, index) => {
                if (item == null){
                    return;
                }
                else if (index == 3){
                    cy.get('select').select(item).should('have.value', item);
                    return;
                }
                cy.get('input').eq(index).type(item).should('have.value', item);
                
            });
            cy.get('button').click();
            cy.wait("@getFilteredSearch");
            clearInputs();
            
        };

        cy.get('[data-test="table-filters"]').within(() => {

            tests.forEach((item, index) => {
                triggerTest(item);
            });

        });
        
    });

    it('id links in table are going to correct pages', () => {
        
        cy.get('[data-test="pipelineRunsList"] tbody tr td a').as('getTableLinks')
        
        cy.get('@getTableLinks').eq(0)
        .then($el => {
            const id = $el.text();
            const url = $el.attr('href');
            expect(url).to.equal(`/pipeline/runs/${id.trim()}`);
        });

        cy.get('@getTableLinks').eq(1)
        .then($el => {
            const id = $el.text();
            const url = $el.attr('href');
            
            expect(url).to.equal(`/pipelines/${id.trim()}`);
        });
        })

});
