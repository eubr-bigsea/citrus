const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "http://localhost:8800",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },

    component: {
        devServer: {
            framework: "vue",
            bundler: "vite",
        },
        specPattern: ["**/*.cy.js", "**/*.spec.js"],
        viewportHeight: 700,
        viewportWidth: 1200,
        // chromeWebSecurity: false,
    },

});
