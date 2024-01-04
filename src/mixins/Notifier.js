export default {
    methods: {
        confirm(title, question, callback) {
            this.$snotify.confirm(
                question, title,
                {
                    position: 'centerTop',
                    xbuttons: {
                        text: 'Yes', action: () => callback()
                    },
                    buttons: [
                        { text: this.$t('common.yes'), action: (toast) => { callback(); this.$snotify.remove(toast.id); }, },
                        { text: this.$t('common.no'), action: (toast) => { console.log('Clicked: No'); this.$snotify.remove(toast.id); }, bold: true },
                    ],
                    closeOnClick: true
                }
            );
        },
        success(msg, timeout, bodyMaxLength) {
            this.$snotify.success(
                msg,
                this.$t('titles.success'),
                { timeout: timeout || 2000, bodyMaxLength: bodyMaxLength || 150 }
            );
        },
        info(msg, timeout, bodyMaxLength) {
            this.$snotify.info(
                msg,
                this.$tc('titles.info', 2),
                { timeout: timeout || 2000, bodyMaxLength: bodyMaxLength || 150 }
            );
        },
        warning(msg, timeout, bodyMaxLength) {
            this.$snotify.warning(
                msg,
                this.$t('titles.warning'),
                { timeout: timeout || 2000, bodyMaxLength: bodyMaxLength || 150 }
            );
        },
        html(msg, title, timeout, bodyMaxLength) {
            this.$snotify.html(
                `<div class="snotifyToast__title">${title}</div>
                 <div class="snotifyToast__body">${msg}</div>`,
                { timeout: timeout || 2000, bodyMaxLength: bodyMaxLength || 150 }
            );
        },
        error(e, msg, timeout, bodyMaxLength) {
            if (e) {
                if (e.name === 'NetworkError' || e.message == 'Network Error') {
                    this.$snotify.error(
                        this.$t('errors.disconnected'), this.$t('titles.error'),
                        { timeout: timeout || 20000, bodyMaxLength: bodyMaxLength || 150 }
                    );
                } else if (e.response && e.response.data){
                    let responseData = e.response.data;
                    if (responseData.message === 'Invalid data') {
                        let errorMessage = `<strong>${this.$t('errors.validation')}</strong><br/>`
                                    + JSON.stringify(responseData.errors);
                        this.$snotify.html( errorMessage,
                            { timeout: timeout || 15000, bodyMaxLength: bodyMaxLength || 150 }
                        );
                    } else if (e.response.status === 404) {
                        this.$snotify.error(
                            this.$t('errors.notFound'), this.$t('titles.error'),
                            { timeout: timeout || 5000, bodyMaxLength: bodyMaxLength || 150 }
                        );
                        //this.$router.push({name: 'home'});
                    } else if (e.response.status === 401) {
                        this.$snotify.error(
                            this.$t('errors.accessDenied'), this.$t('titles.error'),
                            { timeout: timeout || 5000, bodyMaxLength: bodyMaxLength || 150 }
                        );
                        this.$router.push({name: 'home'});
                    } else if (e.response.status === 502) {
                        this.$snotify.error(
                            this.$t('errors.badGateway'), this.$t('titles.error'),
                            { timeout: timeout || 5000, bodyMaxLength: bodyMaxLength || 150 }
                        );
                        this.$router.push({name: 'home'});
                    } else {
                        this.$snotify.error(
                            e.response.data.message, this.$t('titles.error'),
                            { timeout: timeout || 5000, bodyMaxLength: bodyMaxLength || 150 }
                        );
                    }
                } else {
                    this.$snotify.error(
                        e.message || e, this.$t('titles.error'),
                        { timeout: timeout || 5000, bodyMaxLength: bodyMaxLength || 150 }
                    );
                    console.debug(e);
                }
            } else {
                this.$snotify.error(msg, this.$t('titles.error'),
                    { timeout: timeout || 5000, bodyMaxLength: bodyMaxLength || 150 });
            }
        }
    }
};
