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
                        { text: this.$t('common.yes'), action: (toast) => { callback(); this.$snotify.remove(toast.id) } },
                        { text: this.$t('common.no'), action: (toast) => { console.log('Clicked: No'); this.$snotify.remove(toast.id); } },
                    ]
                }
            )
        },
        success(msg) {
            this.$snotify.success(
                msg,
                this.$t('titles.success'),
            );
        },
        warning(msg) {
            this.$snotify.warning(
                msg,
                this.$t('titles.warning'),
            );
        },
        error(e, msg) {
            if (e) {
                if (e.name === 'NetworkError') {
                    this.$snotify.error(
                        this.$t('errors.disconnected'), this.$t('titles.error'),
                    );
                } else if (e.response && e.response.data) {
                    this.$snotify.error(
                        e.response.data.message, this.$t('titles.error'),
                    );
                } else {
                    this.$snotify.error(
                        e.message, this.$t('titles.error'),
                    );
                }
            } else {
                this.$snotify.error(msg, this.$t('titles.error'));
            }
        }
    }
}