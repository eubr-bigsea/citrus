describe('Create Template', () => {

    beforeEach(() => {
        cy.login();
        cy.visit('/home');
        cy.url().should('eq', Cypress.config().baseUrl + '/home');

        // all tests already start in the template pipeline creation modal
        cy.get('[data-test="admin-menu"]').click();
        cy.get('[data-test="navbar-template"]').click();
        cy.get('[data-test="addTemplateBtn"]').click();

    });

    it('Pipeline Template creation process', () => {

        const pipelineTemplate = {
            id:1, 
            name: "Modelo Teste", 
            description: "Descrição do Modelo Teste.",
            steps: [{
                id:1,
                name: "Passo Teste",
                order: 1,
                description: "Descrição do Passo Teste.",
                enabled: true
            }]    
        };
        
        cy.intercept('GET', Cypress.config().tahiti + '/pipeline-templates?*', (req) => {
            req.continue((res) => {
                res.body.data.unshift(pipelineTemplate);
            })
        }).as('getPipelineTemplateList');


        cy.get('[data-test="input"]').type('Modelo Teste').should('have.value', 'Modelo Teste');
        cy.get('[data-test="textarea"]').type('Descrição do Modelo Teste.').should('have.value', 'Descrição do Modelo Teste.');

        cy.get('[data-test="addStepButton"]').click();

        cy.get('[data-test="stepInput"]').type('Passo Teste').should('have.value', 'Passo Teste');
        cy.get('[data-test="stepTextarea"]').type('Descrição do Passo Teste.').should('have.value', 'Descrição do Passo Teste.');

        cy.intercept('POST', Cypress.config().tahiti + '/pipeline-templates', {
            statusCode: 201,
            body: { message: 'Pipeline Template created successfully' }
        }).as('createTemplate');

        cy.get('.modal-footer .btn-primary').click();

        cy.wait('@createTemplate').its('response.statusCode').should('eq', 201);
    
        cy.wait('@getPipelineTemplateList');
        
        cy.get('[data-test="templatePipelineTable"] tbody tr').first().should('contain', 'Modelo Teste');

        cy.get('[data-test="templatePipelineTable"] tbody tr .btn').first().trigger('mouseenter');

        cy.get('[data-test="templatePipelineStepsInfo"]').should('contain', 'Passo Teste');
        
    });

    it('Try to create pipeline template with name less than 3 characters', () => {

        cy.get('[data-test="input"]').type('Aa').should('have.value', 'Aa');
        cy.get('[data-test="textarea"]').type('Descrição do Modelo Teste.').should('have.value', 'Descrição do Modelo Teste.');
        
        cy.get('[data-test="invalidInputLength"]').should('be.visible');
    });

});
