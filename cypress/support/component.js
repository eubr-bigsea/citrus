import { mount } from 'cypress/vue2';
import store from '@/store.js';
import '../../src/main.js';
import { BModal } from 'bootstrap-vue';
import ModalCreatePipeline from '@/views/modal/ModalCreatePipeline.vue';
import 'bootstrap-vue/src/components';


Cypress.Commands.add('mount', (component, options = {}) => {

    // Setup options object
    options.global = options.global || {};
    options.global.stubs = options.global.stubs || {};
    options.global.stubs.transition = false;
    options.global.plugins = options.global.plugins || [];
    options.global.components = options.global.components || {};

    /* Add any global plugins */
    options.global.plugins.push({
        install(app) {
            app.use(i18n);
        },
    });


    /* Add any global components */
    options.global.components['BModal'] = BModal;
    options.global.components['ModalCreatePipeline'] = ModalCreatePipeline;

    return mount(component, { ...options, store });
});

Cypress.on('uncaught:exception', (err, runnable, promise) => {
    // when the exception originated from an unhandled promise
    // rejection, the promise is provided as a third argument
    // you can turn off failing the test in this case
    if (promise) {
        return false;
    }
    // we still want to ensure there are no other unexpected
    // errors, so we let them fail the test
});
