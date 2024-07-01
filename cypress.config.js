const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "http://localhost:8081",
        supportFile: 'cypress/support/e2e.js',
        tahiti: "https://dev.lemonade.org.br/api/v1/tahiti",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        viewportHeight: 700,
        viewportWidth: 1200,
    },
    chromeWebSecurity: false,
    component: {
        devServer: {
            framework: "vue",
            bundler: "vite",
        },
        specPattern: ["**/*.cy.js", "**/*.spec.js"],
        viewportHeight: 700,
        viewportWidth: 1200,
    },

});
