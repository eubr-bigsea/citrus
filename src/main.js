import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import router from './router'
import store from './store'

import VueI18n from 'vue-i18n'
import messages from './i18n/messages'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import axios from 'axios'
import VueAxios from 'vue-axios'
import { ClientTable, ServerTable } from 'vue-tables-2'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faCoffee, faCopy, faCogs, faHistory, faImage, faLayerGroup, faArrowsAltV, faArrowsAltH,
    faHome, faUser, faPlay, faPlus, faSortAmountUp, faSort, faSortAmountDown, faSave, faEdit, faTrash,
    faToggleOn, faObjectGroup, faQuestionCircle, faAsterisk, faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


import './assets/main.scss'

// Snotify
import Snotify from 'vue-snotify';
Vue.use(Snotify, {
    toast: {
        titleMaxLength: 100,
        timeout: 5000,
        position: 'centerTop'
    }
});

/**
 * Setting this config so that Vue-tables-2 will be able to replace sort icons with chevrons
 * https://fontawesome.com/how-to-use/with-the-api/setup/configuration
 */
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoReplaceSvg = "nest";

/**
 * Allows DOM to change <i> tags to SVG for more features like layering
 * https://fontawesome.com/how-to-use/on-the-web/styling/layering
 */
import { dom } from '@fortawesome/fontawesome-svg-core'
dom.watch();

library.add(faCoffee, faCopy, faCogs, faHistory, faPlay, faImage, faLayerGroup, faArrowsAltH, faArrowsAltV,
    faHome, faUser, faPlus, faSortAmountUp, faSort, faSortAmountDown, faSave, faEdit, faTrash,
    faToggleOn, faObjectGroup, faQuestionCircle, faAsterisk, faSpinner),

    Vue.use(ClientTable);
Vue.use(ServerTable, { useVuex: true, theme: 'bootstrap4' });

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false


const options = {
    color: '#ed8',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
        speed: '0.2s',
        opacity: '0.2s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
}
Vue.use(VueI18n)
Vue.use(VueProgressBar, options)

// Auth
const token = localStorage.getItem("token")
const user = JSON.parse(localStorage.getItem('user'), '{}')
if (token) {
    axios.defaults.headers.common['Authorization'] = token
    axios.defaults.headers.common['X-Authentication'] = token
    axios.defaults.headers.common['X-User-Id'] = user['id']
    axios.defaults.headers.common['Accept'] = 'application/json; charset=utf-8'
}

// i18n
const i18n = new VueI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en',
    messages
})

let newVue = new Vue({
    el: '#app',
    i18n,
    router,
    store,
    render: h => h(App),
    mounted() {
    }
});

axios.interceptors.request.use(config => {
    newVue.$Progress.start()
    return config
})
axios.interceptors.response.use(response => {
    newVue.$Progress.finish()
    return response
}, (error) => {
    newVue.$Progress.finish()
    throw error
})