export default (vm) => {
    const i18n = vm.$i18n.vm;
    // use the root in order to persist the toast between route transitions
    const toaster = vm.$root.$bvToast;
    const modal = vm.$root.$bvModal;
    const router = vm.$router;

    const confirm = (title, question, callback) => {
        modal.msgBoxConfirm(
            question,
            {
                title,
                centered: true,
                buttonSize: 'sm',
                okTitle: i18n.$t('common.yes'),
                cancelTitle: i18n.$t('common.no'),
            }
        ).then(value => {callback(value)}).catch(err =>{callback(false)});
    };

    const display = (msg, title, variant, autoHideDelay, faIcon, position = 'b-toaster-bottom-right') => {
        const h = vm.$createElement;
        const elems = faIcon ? h('div', { style: 'display: flex;align-items: center;flex:1;gap: 10px;' },
            [h('font-awesome-icon',
                { props: { icon: `fa ${faIcon}`, size: '2x', } }),
                msg]) : msg;
        toaster.toast(elems, {
            title, variant, autoHideDelay, appendToast: false,
            toaster: position, solid: true, fixed: true, position: 'top'
        });
    }
    const success = (msg, title, autoHideDelay = 5000) => {
        display(msg, title || i18n.$t('titles.success', 2), 'success', autoHideDelay, 'fa-circle-check')
    };
    const info = (msg, title, autoHideDelay = 5000) => {
        display(msg, title || i18n.$t('titles.info', 2), 'info', autoHideDelay,
            'fa-circle-info')
    };
    const warning = (msg, title, autoHideDelay = 5000) => {
        display(msg, title || i18n.$t('titles.warning', 2), 'warning', autoHideDelay,
            'fa-circle-exclamation')
    };
    const html = (msg, title, autoHideDelay = 5000) => {
        display(msg, title, 'secondary', autoHideDelay)
    };
    const error = (e, msg, title, autoHideDelay = 10000, redirect=true) => {
        if (e) {
            if (e.name === 'NetworkError' || e.message == 'Network Error') {
                display(i18n.$t('errors.disconnected'),
                    title || i18n.$t('titles.error', 2),
                    'danger', autoHideDelay,
                    'fa-circle-xmark')
            } else if (e.response && e.response.data) {
                const responseData = e.response.data;
                if (responseData.message === 'Invalid data' | responseData.message == 'Validation error') {
                    const h = vm.$createElement;
                    const errorMessage = h('div', {},
                        [
                            h('strong', {}, [i18n.$t('errors.validation')]),
                            h('div', {}, [JSON.stringify(responseData.errors)])
                        ]);
                    display(errorMessage,
                        title || i18n.$t('titles.error', 2),
                        'danger', autoHideDelay,
                        'fa-circle-xmark')
                } else if (e.response.status === 404) {
                    display(i18n.$t('errors.notFound'),
                        title || i18n.$t('titles.error', 2),
                        'danger', autoHideDelay,
                        'fa-circle-xmark')

                    redirect && router.push({ name: 'home' });
                } else if (e.response.status === 401) {
                    display(i18n.$t('errors.accessDenied'),
                        title || i18n.$t('titles.error', 2),
                        'danger', autoHideDelay,
                        'fa-circle-xmark')

                    redirect && router.push({ name: 'login' });
                } else if (e.response.status === 502) {
                    display(i18n.$t('errors.badGateway'),
                        title || i18n.$t('titles.error', 2),
                        'danger', autoHideDelay,
                        'fa-circle-xmark')
                    redirect && router.push({ name: 'home' });
                } else {
                    display(e.response.data.message,
                        title || i18n.$t('titles.error', 2),
                        'danger', autoHideDelay,
                        'fa-circle-xmark')
                }

            } else {
                display(e.message || e,
                    title || i18n.$t('titles.error', 2),
                    'danger', autoHideDelay,
                    'fa-circle-xmark')
                console.debug(e);
            }
        } else {
            display(msg,
                title || i18n.$t('titles.error', 2),
                'danger', autoHideDelay,
                'fa-circle-xmark')
        }
    }
    return { confirm, error, warning, info, html, success };
}
