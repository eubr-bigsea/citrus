import Vue from 'vue';
import VueProgressBar from 'vue-progressbar';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';

import VueI18n from 'vue-i18n';
import messages from './i18n/messages';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { ClientTable, ServerTable } from 'vue-tables-2';
import { library } from '@fortawesome/fontawesome-svg-core';
import Gravatar from 'vue-gravatar';

import {
    faChartLine,
    faCheck,
    faCheckDouble,
    faCoffee,
    faCopy,
    faCogs,
    faDownload,
    faFlask,
    faTasks,
    faUpload,
    faHistory,
    faImage,
    faLayerGroup,
    faArrowsAltV,
    faArrowsAltH,
    faHome,
    faLink,
    faUser,
    faUserEdit,
    faPlay,
    faPlus,
    faSortAmountUp,
    faSort,
    faSortAmountDown,
    faSave,
    faEdit,
    faTrash,
    faToggleOn,
    faObjectGroup,
    faQuestionCircle,
    faAsterisk,
    faSpinner,
    faDatabase,
    faSearch,
    faEye,
    faMinusCircle,
    faChevronCircleDown,
    faChevronCircleUp,
    faCheckCircle,
    faTimesCircle,
    faHandPaper,
    faStopCircle,
    faPauseCircle,
    faSync,
    faCheckSquare,
    faSquare,
    faLightbulb,
    faAngleDown,
    faAngleRight,
    faExclamationTriangle,
    faExclamationCircle,
    faChevronLeft,
    faStop,
    faShareAlt,
    faUserLock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import './assets/main.scss';

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
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoReplaceSvg = 'nest';

/**
 * Allows DOM to change <i> tags to SVG for more features like layering
 * https://fontawesome.com/how-to-use/on-the-web/styling/layering
 */
import { dom } from '@fortawesome/fontawesome-svg-core';
dom.watch();

library.add(
    faChartLine,
    faCheck,
    faCheckDouble,
    faCoffee,
    faCopy,
    faCogs,
    faDownload,
    faFlask,
    faTasks,
    faUpload,
    faHistory,
    faPlay,
    faImage,
    faLayerGroup,
    faArrowsAltH,
    faArrowsAltV,
    faHome,
    faLink,
    faUser,
    faPlus,
    faSortAmountUp,
    faSort,
    faSortAmountDown,
    faSave,
    faEdit,
    faUserEdit,
    faTrash,
    faToggleOn,
    faObjectGroup,
    faQuestionCircle,
    faAsterisk,
    faSpinner,
    faDatabase,
    faSearch,
    faEye,
    faDownload,
    faMinusCircle,
    faChevronCircleDown,
    faChevronCircleUp,
    faTimesCircle,
    faHandPaper,
    faStopCircle,
    faCheckCircle,
    faPauseCircle,
    faSync,
    faCheckSquare,
    faSquare,
    faLightbulb,
    faAngleDown,
    faAngleRight,
    faExclamationTriangle,
    faExclamationCircle,
    faChevronLeft,
    faStop,
    faShareAlt,
    faUserLock,
);

import {
    faSave as farSave,
    faCopy as farCopy
} from '@fortawesome/free-regular-svg-icons';

library.add(farSave, farCopy);

Vue.use(ClientTable, {}, false, 'bootstrap4', 'default');
Vue.use(ServerTable, {}, true, 'bootstrap4', 'default');

Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('v-gravatar', Gravatar);

Vue.config.productionTip = false;

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
};
Vue.use(VueI18n);
Vue.use(VueProgressBar, options);

// Date-fns
import { distanceInWordsStrict, format, parse } from 'date-fns';

const locales = {
    en: require('date-fns/locale/en'),
    pt: require('date-fns/locale/pt')
};

Vue.filter('formatJsonDate', v => {
    if (v) {
        return format(parse(v), 'DD/MM/YYYY HH:MM');
    }
});
Vue.filter('timeFromNow', (v, l) =>
    distanceInWordsStrict(new Date(), v, { addSuffix: true, locale: locales[l] })
);
Vue.filter('formatJsonHourMinute', v => {
    if (v) {
        return format(parse(v), 'HH:MM:ss');
    }
});

// Highcharts
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import exporting from 'highcharts/modules/exporting';
import offlineExporting from 'highcharts/modules/offline-exporting';
import exportdata from 'highcharts/modules/export-data';
import highchartsMore from 'highcharts/highcharts-more';

exporting(Highcharts);
exportdata(Highcharts);
offlineExporting(Highcharts);
highchartsMore(Highcharts);

Vue.use(HighchartsVue);

// Leaflet
import { L, LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

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
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'), '{}');
if (token) {
    axios.defaults.headers.common['Authorization'] = token;
    axios.defaults.headers.common['X-Authentication'] = token;
    axios.defaults.headers.common['X-User-Id'] = user ? user.id : null;
    axios.defaults.headers.common['Accept'] = 'application/json; charset=utf-8';
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.common['Access-Control-Allow-Headers'] =
        'Origin, X-Requested-With, Content-Type, Accept';
    axios.defaults.headers.common['Access-Control-Allow-Methods'] =
        'POST, GET, PUT, DELETE, OPTIONS';
}

// i18n
const i18n = new VueI18n({
    locale: user ? user.locale : 'pt',
    fallbackLocale: 'en',
    messages
});

Object.defineProperty(Vue.prototype, '$locale', {
    get: function () {
        return i18n.locale;
    },
    set: function (locale) {
        i18n.locale = locale;
    }
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        let title = i18n.tc('titles.lemonade') + ' :: ' + 
            i18n.tc(to.meta.title[0], to.meta.title[1]);
        if (to.params.id){
            title += ' #' + to.params.id;
        }
        document.title = title;
    } else {
        document.title = i18n.tc('titles.lemonade', 2)
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            if (to.matched.some(record => record.meta.requiresRole)) {
                if (store.getters.hasRoles) {
                    next();
                    return;
                } else {
                    next('/');
                }
            }
            next();
            return;
        }
        next('/login');
    } else {
        next();
    }
});
new Vue({
    el: '#app',
    i18n,
    router,
    store,
    render: h => h(App)
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
