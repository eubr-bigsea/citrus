// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import { createI18n } from 'vue-i18n-bridge'
import router from './../../src/router.js';
import messages from './../../src/i18n/messages.js';

// Import commands.js using ES2015 syntax:
import './commands.js';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/vue2';



Cypress.Commands.add('mount', mount);

// Example use:
// cy.mount(MyComponent)

import './../../src/assets/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import { ClientTable, ServerTable } from 'vue-tables-2';

import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import './../../src/fa-icons.js';

Vue.component('FontAwesomeIcon', FontAwesomeIcon);
Vue.use(BootstrapVue);

Vue.use(ClientTable, {}, false, 'bootstrap4', 'default');
Vue.use(ServerTable, {}, true, 'bootstrap4', 'default');

Vue.use(VueI18n, { bridge: true });
const i18nComposition = createI18n({
    allowComposition: true,
    globalInjection: true,
    global: true,
    legacy: false,
    locale: 'pt',
    fallbackLocale: 'en',
    messages
}, VueI18n);
Vue.use(i18nComposition);

