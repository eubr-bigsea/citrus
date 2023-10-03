const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
<<<<<<< HEAD
        baseUrl: "http://localhost:8081",
=======
        baseUrl: "http://localhost:8800",
>>>>>>> 4606f7434d675a736e564ef7405a50db67455518
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },

    component: {
        devServer: {
            framework: "vue",
            bundler: "vite",
        },
    },
});
