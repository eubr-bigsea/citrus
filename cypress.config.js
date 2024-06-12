const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "http://localhost:8081/",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
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
