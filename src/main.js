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
    faToggleOn, faObjectGroup, faQuestionCircle, faAsterisk, faSpinner, faDatabase, faSearch, faEye,
    faDownload, faMinusCircle, faChevronCircleDown, faChevronCircleUp, faCheckCircle, faTimesCircle, faHandPaper, faStopCircle, faPauseCircle,
    faSync, faCheckSquare, faSquare, faLightbulb
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


import './assets/main.scss'

// Snotify
import Snotify from 'vue-snotify';
Vue.use(Snotify, {
    toast: {
        titleMaxLength: 100,
        timeout: 5000,
        xposition: 'centerTop'
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
    faToggleOn, faObjectGroup, faQuestionCircle, faAsterisk, faSpinner, faDatabase, faSearch, faEye,
    faDownload, faMinusCircle, faChevronCircleDown, faChevronCircleUp, faTimesCircle, faHandPaper, faStopCircle,
    faCheckCircle, faPauseCircle, faSync, faCheckSquare, faSquare, faLightbulb
),

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

// Date-fns
import { format, parse } from 'date-fns'
Vue.filter('formatJsonDate', (v) => { if (v) { return format(parse(v), 'DD/MM/YYYY HH:MM') } })

// Highcharts
import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import exporting from 'highcharts/modules/exporting'
import exportdata from 'highcharts/modules/export-data'

exporting(Highcharts)
exportdata(Highcharts)

Vue.use(HighchartsVue)

// Leaflet
import { L, LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

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
    locale: 'pt', // set locale
    fallbackLocale: 'en',
    messages
})

Object.defineProperty(Vue.prototype, '$locale', {
    get: function () {
        return i18n.locale
    },
    set: function (locale) {
        i18n.locale = locale
    }
})


let newVue = new Vue({
    el: '#app',
    i18n,
    router,
    store,
    render: h => h(App),
    mounted () {
    }
});
// let requestCounter = 0;
// axios.interceptors.request.use(config => {
//     if (requestCounter === 0){
//         newVue.$Progress.start()
//     }
//     requestCounter += 1
//     return config
// })
// axios.interceptors.response.use(response => {
//     requestCounter -= 1
//     if (requestCounter === 0){
//         newVue.$Progress.finish()
//     }
//     return response
// }, (error) => {
//     newVue.$Progress.finish()
//     throw error
// })
