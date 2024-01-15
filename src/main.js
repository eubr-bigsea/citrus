//import Vue from 'vue';
import { configureCompat } from "vue";
configureCompat({
    MODE: 2,
    WATCH_ARRAY: 'suppress-warning',
    //RENDER_FUNCTION: 'suppress-warning',
    INSTANCE_LISTENERS: 'suppress-warning',
    COMPONENT_FUNCTIONAL: 'suppress-warning',
    OPTIONS_BEFORE_DESTROY: 'suppress-warning',
    INSTANCE_SCOPED_SLOTS: 'suppress-warning',
    OPTIONS_DATA_MERGE: 'suppress-warning',
    COMPONENT_V_MODEL: 'suppress-warning',
    CUSTOM_DIR: 'suppress-warning',
    INSTANCE_EVENT_EMITTER: 'suppress-warning',
    ATTR_FALSE_VALUE: 'suppress-warning',
    INSTANCE_ATTRS_CLASS_STYLE: 'suppress-warning',
    GLOBAL_PROTOTYPE: 'suppress-warning',
    GLOBAL_EXTEND: 'suppress-warning',
    GLOBAL_MOUNT: 'suppress-warning',
    OPTIONS_DESTROYED: 'suppress-warning',
    INSTANCE_DESTROY: 'suppress-warning',
    COMPONENT_ASYNC: 'suppress-warning'
    //RENDER_FUNCTION: true,
});

import Vue, { createApp, h } from '@vue/compat';
//import VueProgressBar from "@aacassandra/vue3-progressbar";
//import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router.js';
import store from './store.js';
import { openIdService } from './openid-auth.js';

import 'vue-select/dist/vue-select.css';
import { createI18n } from 'vue-i18n';

import messages from './i18n/messages.js';

//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap-vue/dist/bootstrap-vue.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

import axios from 'axios';
//import VueAxios from 'vue-axios';
import VueTheMask from 'vue-the-mask';

import VServerTable from '@/components/VServerTable.vue';
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
//import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import './fa-icons.js';

Vue.component('FontAwesomeIcon', FontAwesomeIcon);

/* Widgets */

import AttributeFunctionComponent from './components/widgets/AttributeFunction.vue';
import AttributeSelector2Component from './components/widgets/AttributeSelector2.vue';
import AttributeAliasSelectorComponent from './components/widgets/AttributeAliasSelector.vue';
import CheckboxComponent from './components/widgets/Checkbox.vue';
import CastComponent from './components/widgets/Cast.vue';
import CodeComponent from './components/widgets/Code.vue';
import ColorComponent from './components/widgets/Color.vue';
import ColorPaletteComponent from './components/widgets/ColorPalette.vue';
import ColorScaleComponent from './components/widgets/ColorScale.vue';
import DateComponent from './components/widgets/Date.vue';
import DecimalComponent from './components/widgets/Decimal.vue';
import DropDownComponent from './components/widgets/DropDown.vue';
import ExpressionComponent from './components/widgets/ExpressionEditor.vue';
import FilterComponent from './components/widgets/FilterEditor.vue';
import GridCoordinatesComponent from './components/widgets/GridCoordinates.vue';
import IntegerComponent from './components/widgets/Integer.vue';
import JoinComponent from './components/widgets/Join.vue';
import LookupComponent from './components/widgets/Lookup.vue';
import MarkdownEditorComponent from './components/widgets/MarkdownEditor.vue';
import MarkdownComponent from './components/widgets/Markdown.vue';
import PercentageComponent from './components/widgets/Percentage.vue';
import RadioComponent from './components/widgets/Radio.vue';
import RangeComponent from './components/widgets/Range.vue';
import SampleLookupComponent from './components/widgets/SampleLookup.vue';
import Select2Component from './components/widgets/Select2.vue';
import TagComponent from './components/widgets/Tag.vue';
import TextComponent from './components/widgets/Text.vue';
import TextAreaComponent from './components/widgets/TextArea.vue';
import UrlComponent from './components/widgets/Url.vue';
import Plotly from './components/visualization/Plotly.vue';


import vSelect from 'vue-select';
import VueGridLayout from 'vue3-grid-layout-next';



//Vue.use(BootstrapVue);
import { BButton } from "bootstrap-vue-next";
Vue.component('BButton', BButton);

Vue.component('VSelect', vSelect);
Vue.component('GridItem', VueGridLayout.GridItem);
Vue.component('GridLayout', VueGridLayout.GridLayout);

const widgets = new Map([
    ['attribute-function-component', AttributeFunctionComponent],
    ['attribute-selector-component', AttributeSelector2Component],
    ['attribute-alias-selector-component', AttributeAliasSelectorComponent],
    ['cast-component', CastComponent],
    ['checkbox-component', CheckboxComponent],
    ['code-component', CodeComponent],
    ['color-component', ColorComponent],
    ['color-palette-component', ColorPaletteComponent],
    ['color-pallete-component', ColorPaletteComponent], // FIXME: Remove
    ['color-scale-component', ColorScaleComponent],
    ['date-component', DateComponent],
    ['decimal-component', DecimalComponent],
    ['dropdown-component', DropDownComponent],
    ['expression-component', ExpressionComponent],
    ['filter-component', FilterComponent],
    ['grid-coordinates-component', GridCoordinatesComponent],
    ['integer-component', IntegerComponent],
    ['join-component', JoinComponent],
    ['lookup-component', LookupComponent],
    ['markdown-component', MarkdownComponent],
    ['percentage-component', PercentageComponent],
    ['radio-component', RadioComponent],
    ['range-component', RangeComponent],
    ['rich-text-component', MarkdownEditorComponent],
    ['sample-lookup-component', SampleLookupComponent],
    ['select2-component', Select2Component],
    ['single-tag-component', Select2Component],
    ['tag-component', Select2Component],
    ['tag2-component', TagComponent],
    ['text-component', TextComponent],
    ['textarea-component', TextAreaComponent],
    ['url-component', UrlComponent],
]);

widgets.forEach((v, k) => Vue.component(k, v.default || v));

//Vue.component('Plotly', Plotly.default || Plotly);
import './assets/main.scss';
import '~vue-snotify/styles/dark.scss'; //dark or material.css or simple.css

// Snotify
import Snotify from 'vue-snotify';
window.Vue = Vue; // Force Snotify to be installed in window
Vue.use(Snotify, {
    toast: {
        titleMaxLength: 100,
        timeout: 5000,
        xposition: 'centerTop'
    }
});
Vue.directive('focus', {
    inserted: function (el) {
        el.focus();
    }
});
/**
 * Setting this config so that Vue-tables-2 will be able to replace sort icons with chevrons
 * https://fontawesome.com/how-to-use/with-the-api/setup/configuration
 */
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoReplaceSvg = 'nest';

//Vue.use(VueTheMask)

//Vue.use(VueAxios, axios);
//Vue.use(BootstrapVue);
Vue.component('FontAwesomeIcon', FontAwesomeIcon);
Vue.component('FontAwesomeLayers', FontAwesomeLayers);

Vue.config.productionTip = false;


// Date-fns
import { format, formatDistanceStrict, parseISO, fromUnixTime } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { enUS, ptBR } from 'date-fns/locale';

const locales = { en: enUS, pt: ptBR };
/*
const locales = {
    en: require('date-fns/locale/en-US'),
    pt: require('date-fns/locale/pt')
};
*/
Vue.prototype.$filters = {
    formatJsonDate(v) {
        if (v) {
            return format(parseISO(v + '.000Z'), 'dd/MM/yyyy HH:mm');
        }
    },
    formatTimestamp(v) {
        if (v) {
            return format(
                utcToZonedTime(fromUnixTime(v * .000001)),
                'dd/MM/yyyy HH:mm:ss');
        }
    },
    timeFromNow(v, l) {
        return formatDistanceStrict(parseISO(v + '.000Z'), new Date(),
            { addSuffix: true, locale: locales[l] });
    },
    formatJsonHourMinute(v) {
        if (v) {
            return format(parseISO(v + '.000Z'), 'HH:mm:ss');
        }
    }
};
Vue.filter('formatJsonDate', v => {
    if (v) {
        return format(parseISO(v + '.000Z'), 'dd/MM/yyyy HH:mm');
    }
});
Vue.filter('timeFromNow', (v, l) => {
    return formatDistanceStrict(parseISO(v + '.000Z'), new Date(),
        { addSuffix: true, locale: locales[l] });
}
);
Vue.filter('formatJsonHourMinute', v => {
    if (v) {
        return format(parseISO(v + '.000Z'), 'HH:mm:ss');
    }
});

// Leaflet
//import { L, LMap, LTileLayer, LMarker } from 'vue2-leaflet';

import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

Vue.component('LMap', LMap);
Vue.component('LTileLayer', LTileLayer);
Vue.component('LMarker', LMarker);


delete L.Icon.Default.prototype._getIconUrl;
/*
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
*/

Vue.prototype.$openIdService = openIdService;
Vue.prototype.$legacyStore = store;
Vue.prototype.$legacyRouter = router;
openIdService.loadConfig(store).then(() => {
    // Auth
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'), '{}');
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.common['X-THORN-ID'] = 'true';
        //axios.defaults.headers.common['X-Authentication'] = token;
        axios.defaults.headers.common['X-User-Id'] = user ? user.id : null;
        axios.defaults.headers.common['Accept'] = 'application/json; charset=utf-8';
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        axios.defaults.headers.common['Access-Control-Allow-Headers'] =
            'Origin, X-Requested-With, Content-Type, Accept';
        axios.defaults.headers.common['Access-Control-Allow-Methods'] =
            'POST, GET, PUT, DELETE, OPTIONS';
    }

    // i18n
    const i18n = createI18n({
        allowComposition: true,
        globalInjection: true,
        global: true,
        legacy: false,
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
            let title = i18n.global.t('titles.lemonade') + ' :: ' +
                i18n.global.t(to.meta.title[0], to.meta.title[1]);
            if (to.params.id) {
                title += ' #' + to.params.id;
            }
            document.title = title;
        } else {
            document.title = i18n.global.t('titles.lemonade', 2);
        }
        if (to.matched.some(record => record.meta.requiresAuth || record.meta.requiresAuth === undefined)) {
            // If OpenId support is enabled in Thorn, use it.
            // Otherwise, it uses internal Thorn API.

            if (openIdService.enabled) {
                openIdService.isUserLoggedIn().then(isLoggedIn => {
                    //store.setters.isLoggedIn = isLoggedIn;
                    console.debug('Using OpenID. Status: ', isLoggedIn);
                    if (!isLoggedIn) {
                        openIdService.login();
                    } else {
                        next();
                    }
                });
                return;
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
            next('/auth/login');
        } else {
            next();
        }
    });

    /*
    let newVue = new Vue({
        el: '#app',
        i18n,
        i18nComposition,
        router,
        store,
        render: h => h(App)
    });
    */
    const app = createApp(App);
    /*
    app.provide('$Progress', {
        start: () => { },
        finish: () => { },
    });
    app.config.globalProperties.$Progress = {
        start: () => { },
        finish: () => { },
    };
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
    */
    app.use(store);
    app.use(i18n);
    app.use(router);
    app.component('VServerTable', VServerTable);
    app.mount('#app');

    let requestCounter = 0;
    axios.interceptors.request.use(async config => {
        if (requestCounter === 0) {
            //newVue.$Progress.start();
        }
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = token;
            config.headers['X-THORN-ID'] = 'true';
        } else {
            let accessToken = await openIdService.getAccessToken();
            accessToken && (config.headers['Authorization'] = accessToken);
        }
        requestCounter += 1;
        return config;
    });
    axios.interceptors.response.use(response => {
        requestCounter -= 1;
        if (requestCounter === 0) {
            //newVue.$Progress.finish();
        }
        return response;
    }, (error) => {
        if (error.response.status === 401) {
            //newVue.$snotify.error(i18n.global.t('errors.accessDenied'));
            alert(i18n.global.t('errors.accessDenied'));
            if (openIdService.enabled) {
                openIdService.logout();
            } else {
                store.dispatch('logout');
            }
            router.push({ name: 'logout' });
        }
        //newVue.$Progress.finish();
        throw error;
    });
}).catch((e) => {
    console.debug(e);
    alert(e);
});
