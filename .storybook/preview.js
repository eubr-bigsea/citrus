import Vue from 'vue'
import { addDecorator } from '@storybook/vue';
import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VueTheMask from 'vue-the-mask'
import VueI18n from 'vue-i18n'
import messages from '../src/i18n/messages';
import '../src/assets/main.scss'


import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import Snotify from 'vue-snotify';
import vSelect from 'vue-select'

Vue.use(VueTheMask);
Vue.use(Snotify, {
    toast: {
        titleMaxLength: 100,
        timeout: 5000,
        position: 'centerTop'
    }
});
Vue.directive('focus', {
    inserted: function (el) {
        Vue.nextTick(() => {
            el.focus();
        });
    }
})

Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('v-select', vSelect);
import '../src/fa-icons';

Vue.use(VueI18n);
Vue.use(BootstrapVue)

export const i18n = new VueI18n({
    locale: 'pt',
    messages
});

// Internationalisation
addDecorator(() => ({
    i18n,
    beforeCreate: function () {
        this.$root._i18n = this.$i18n;
    },
    template: "<story/>"
}));

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
}