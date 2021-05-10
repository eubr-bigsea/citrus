import Vue from 'vue';
import VueProgressBar from 'vue-progressbar';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { openIdService } from './openid-auth';

import VueI18n from 'vue-i18n';
import messages from './i18n/messages';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueTheMask from 'vue-the-mask'

import { ClientTable, ServerTable } from 'vue-tables-2';
import Gravatar from 'vue-gravatar';

import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import './fa-icons';

/* Widgets */
import AttributeFunctionComponent from './components/widgets/AttributeFunction.vue'
import AttributeSelector2Component from './components/widgets/AttributeSelector2.vue'
import CheckboxComponent from './components/widgets/Checkbox.vue'
import CodeComponent from './components/widgets/Code.vue'
import ColorComponent from './components/widgets/Color.vue'
import ColorPaletteComponent from './components/widgets/ColorPalette.vue'
import ColorScaleComponent from './components/widgets/ColorScale.vue'
import DecimalComponent from './components/widgets/Decimal.vue'
import DropDownComponent from './components/widgets/DropDown.vue'
import ExpressionComponent from './components/widgets/ExpressionEditor.vue'
import FilterComponent from './components/widgets/FilterEditor.vue'
import GridCoordinatesComponent from './components/widgets/GridCoordinates.vue'
import IntegerComponent from './components/widgets/Integer.vue'
import JoinComponent from './components/widgets/Join.vue'
import LookupComponent from './components/widgets/Lookup.vue'
import MarkdownEditorComponent from './components/widgets/MarkdownEditor.vue'
import MarkdownComponent from './components/widgets/Markdown.vue'
import RadioComponent from './components/widgets/Radio.vue'
import RangeComponent from './components/widgets/Range.vue'
import SampleLookupComponent from './components/widgets/SampleLookup.vue'
import Select2Component from './components/widgets/Select2.vue'
import TagComponent from './components/widgets/Tag.vue'
import TextComponent from './components/widgets/Text.vue'
import TextAreaComponent from './components/widgets/TextArea.vue'
import UrlComponent from './components/widgets/Url.vue'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.component('v-select', vSelect)

const widgets = new Map([
    ['attribute-function-component', AttributeFunctionComponent],
    ['attribute-selector-component', AttributeSelector2Component],
    ['checkbox-component', CheckboxComponent],
    ['code-component', CodeComponent],
    ['color-component', ColorComponent],
    ['color-palette-component', ColorPaletteComponent],
    ['color-pallete-component', ColorPaletteComponent], // FIXME: Remove
    ['color-scale-component', ColorScaleComponent],
    ['decimal-component', DecimalComponent],
    ['dropdown-component', DropDownComponent],
    ['expression-component', ExpressionComponent],
    ['filter-component', FilterComponent],
    ['grid-coordinates-component', GridCoordinatesComponent],
    ['integer-component', IntegerComponent],
    ['join-component', JoinComponent],
    ['lookup-component', LookupComponent],
    ['markdown-component', MarkdownComponent],
    ['percentage-component', RangeComponent],
    ['radio-component', RadioComponent],
    ['range-component', RangeComponent],
    ['rich-text-component', MarkdownEditorComponent],
    ['sample-lookup-component', SampleLookupComponent],
    ['select2-component', Select2Component],
    ['tag-component', Select2Component],
    ['tag2-component', TagComponent],
    ['text-component', TextComponent],
    ['textarea-component', TextAreaComponent],
    ['url-component', UrlComponent],
])

widgets.forEach((v, k) => Vue.component(k, v.default || v));

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
Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
})
/**
 * Setting this config so that Vue-tables-2 will be able to replace sort icons with chevrons
 * https://fontawesome.com/how-to-use/with-the-api/setup/configuration
 */
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoReplaceSvg = 'nest';

Vue.use(ClientTable, {}, false, 'bootstrap4', 'default');
Vue.use(ServerTable, {}, true, 'bootstrap4', 'default');
Vue.use(VueTheMask)

Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('v-gravatar', Gravatar);

Vue.config.productionTip = false;

const options = {
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
        return format(parse(v), 'DD/MM/YYYY HH:mm');
    }
});
Vue.filter('timeFromNow', (v, l) =>
    distanceInWordsStrict(new Date(), v, { addSuffix: true, locale: locales[l] })
);
Vue.filter('formatJsonHourMinute', v => {
    if (v) {
        return format(parse(v), 'HH:mm:ss');
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
    //axios.defaults.headers.common['Authorization'] = token;
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
        if (to.params.id) {
            title += ' #' + to.params.id;
        }
        document.title = title;
    } else {
        document.title = i18n.tc('titles.lemonade', 2)
    }
    if (to.matched.some(record => record.meta.requiresAuth || record.meta.requiresAuth === undefined)) {
        // If OpenId support is enabled in Thorn, use it. 
        // Otherwise, it uses internal Thorn API.
        if (openIdService.enabled) {
            openIdService.isUserLoggedIn().then(isLoggedIn => {
                //store.setters.isLoggedIn = isLoggedIn;
                console.debug('user is logged ', isLoggedIn)
                if (! isLoggedIn){
                    openIdService.login();
                } else {
                    next();
                    return;
                }
            })
            return
        } else if (store.getters.isLoggedIn) {
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

let newVue = new Vue({
    el: '#app',
    i18n,
    router,
    store,
    render: h => h(App)
});
let requestCounter = 0;
<<<<<<< HEAD
axios.interceptors.request.use(async config => {
=======
axios.interceptors.request.use(config => {
>>>>>>> 6e7050d... Inicial tests
    if (requestCounter === 0) {
        newVue.$Progress.start()
    }
    config.headers['Authorization'] = await openIdService.getAccessToken();
    requestCounter += 1
    return config
})
axios.interceptors.response.use(response => {
    requestCounter -= 1
    if (requestCounter === 0) {
        newVue.$Progress.finish()
    }
    return response
}, (error) => {
    newVue.$Progress.finish()
    throw error
})
