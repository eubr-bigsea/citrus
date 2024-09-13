import { useI18n } from 'vue-i18n';
import { useToast } from "vue-toastification";
import { h } from 'vue';
export default (vm) => {
    const { t } = useI18n();
    // use the root in order to persist the toast between route transitions
    //debugger
    const toaster = { toast: useToast() };
    const modal = vm.$root.$bvModal;
    const router = vm.$router;

    const confirm = (title, question, callback) => {
        modal.msgBoxConfirm(
            question,
            {
                title,
                centered: false,
                buttonSize: 'sm',
                okTitle: t('common.yes'),
                cancelTitle: t('common.no'),
            }
        ).then(value => { callback(value); }).catch(err => { callback(false); });
    };

    const display = (msg, title, variant, autoHideDelay, faIcon, position = 'b-toaster-bottom-right') => {
        const elems = faIcon ? h('div', { style: 'display: flex;align-items: center;flex:1;gap: 10px;' },
            [h('font-awesome-icon',
                { props: { icon: `fa ${faIcon}`, size: '2x', } }),
            msg]) : msg;
        toaster.toast(elems, {
            title,
            type: variant,
            // autoHideDelay, appendToast: true,
            // toaster: position, solid: true, fixed: true, position: 'top'
        });
    };
    const success = (msg, title, autoHideDelay = 5000) => {
        display(msg, title || t('titles.success', 2), 'success', autoHideDelay, 'fa-circle-check');
    };
    const info = (msg, title, autoHideDelay = 5000) => {
        display(msg, title || t('titles.info', 2), 'info', autoHideDelay,
            'fa-circle-info');
    };
    const warning = (msg, title, autoHideDelay = 5000) => {
        display(msg, title || t('titles.warning', 2), 'warning', autoHideDelay,
            'fa-circle-exclamation');
    };
    const html = (msg, title, autoHideDelay = 5000) => {
        display(msg, title, 'secondary', autoHideDelay);
    };
    const error = (e, msg, title, autoHideDelay = 10000, redirect = true) => {
        if (e) {
            if (e.name === 'NetworkError' || e.message == 'Network Error') {
                display(t('errors.disconnected'),
                    title || t('titles.error', 2),
                    'danger', autoHideDelay,
                    'fa-circle-xmark');
            } else if (e.response && e.response.data) {
                const responseData = e.response.data;
                if (responseData.message === 'Invalid data' | responseData.message == 'Validation error') {
                    const h = vm.$createElement;
                    const errorMessage = h('div', {},
                        [
                            h('strong', {}, [t('errors.validation')]),
                            h('div', {}, [JSON.stringify(responseData.errors)])
                        ]);
                    display(errorMessage,
                        title || t('titles.error', 2),
                        'danger', autoHideDelay,
                        'fa-circle-xmark');
                } else if (e.response.status === 404) {
                    display(t('errors.notFound'),
                        title || t('titles.error', 2),
                        'danger', autoHideDelay,
                        'fa-circle-xmark');

                    redirect && router.push({ name: 'home' });
                } else if (e.response.status === 401) {
                    display(t('errors.accessDenied'),
                        title || t('titles.error', 2),
                        'danger', autoHideDelay,
                        'fa-circle-xmark');

                    redirect && router.push({ name: 'login' });
                } else if (e.response.status === 502) {
                    display(t('errors.badGateway'),
                        title || t('titles.error', 2),
                        'danger', autoHideDelay,
                        'fa-circle-xmark');
                    redirect && router.push({ name: 'home' });
                } else {
                    display(e.response.data.message,
                        title || t('titles.error', 2),
                        'danger', autoHideDelay,
                        'fa-circle-xmark');
                }

            } else {
                display(e.message || e,
                    title || t('titles.error', 2),
                    'danger', autoHideDelay,
                    'fa-circle-xmark');
                console.debug(e);
            }
        } else {
            display(msg,
                title || t('titles.error', 2),
                'danger', autoHideDelay,
                'fa-circle-xmark');
        }
    };
    return { confirm, error, warning, info, html, success };
};
