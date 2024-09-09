const { defineConfig } = require("cypress");

const baseUrl = "http://localhost:8081";
const tahiti = "https://dev.lemonade.org.br/api/v1/tahiti";
const stand = "https://dev.lemonade.org.br/api/v1/stand";

module.exports = defineConfig({
    e2e: {
        baseUrl,
        tahiti,
        stand,
        supportFile: 'cypress/support/e2e.js',
        thorn: "https://dev.lemonade.org.br/api/v1/thorn",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        viewportHeight: 700,
        viewportWidth: 1200,
    },
    chromeWebSecurity: false,
    component: {
        tahiti,
        stand,
        devServer: {
            framework: "vue",
            bundler: "vite",
        },
        specPattern: ["**/*.cy.js", "**/*.spec.js"],
        viewportHeight: 700,
        viewportWidth: 1200,
    },

});
