/*
import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VueTheMask from 'vue-the-mask'
import VueI18n from 'vue-i18n'
import messages from '../src/i18n/messages';
import '../src/assets/main.scss'
import VueProgressBar from 'vue-progressbar';

import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import Snotify from 'vue-snotify';
import vSelect from 'vue-select'

import TextComponent from '../src/components/widgets/Text.vue';
import ColorComponent from '../src/components/widgets/Color.vue';
import CheckboxComponent from '../src/components/widgets/Checkbox.vue';
import IntegerComponent from '../src/components/widgets/Integer.vue';

Vue.component("TextComponent", TextComponent);
Vue.component("ColorComponent", ColorComponent);
Vue.component("CheckboxComponent", CheckboxComponent);
Vue.component("IntegerComponent", IntegerComponent);


Vue.use(VueI18n)
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

Vue.use(VueProgressBar, {
    color: '#568f32',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
        speed: '0.5s',
        opacity: '0.2s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
});

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
Vue.extend({ i18n });

export const decorators = [(story) => ({
  components: { story },
  i18n, // this is the essential part to have t() and Co. in your components
  template: '<story />'
})];
// Internationalisation
/*addDecorator(() => ({
    i18n,
    beforeCreate: function () {
        this.$root._i18n = this.$i18n;
    },
    template: "<story/>"
}));
*/
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import '@/fa-icons.js';
import { setup } from "@storybook/vue3";
import '@/assets/main.scss';
import messages from '@/i18n/messages.js';
import 'vue-select/dist/vue-select.css';
import { createI18n } from 'vue-i18n';


setup((app) => {

    const i18n = createI18n({
        allowComposition: true,
        globalInjection: true,
        global: true,
        legacy: false,
        locale: 'pt',
        fallbackLocale: 'en',
        messages
    });

    app.component('FontAwesomeIcon', FontAwesomeIcon);
    app.component('FontAwesomeLayers', FontAwesomeLayers);
    app.use(i18n);
    app.directive('focus', {
        inserted: function (el) {
            el.focus();
        }
    });
});

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
}