<template>
    <b-modal ref="preview" size="xl" :title="$t('common.preview')" ok-only no-stacking button-size="sm"
        header-bg-variant="dark" header-text-variant="light">
        <small><strong>*{{ $t('dataSource.previewExplanation', { amount: 40 }) }}</strong></small>

        <v-server-table v-if="loaded" :columns="attributes" :options="options">
        </v-server-table>
    </b-modal>
</template>
<script>
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

import axios from 'axios';
import Notifier from '../../mixins/Notifier.js';
export default {
    mixins: [Notifier],
    data() {
        const self = this;
        return {
            loaded: false,
            samples: { type: Array, default: () => [] },
            attributes: { type: Array, default: () => [] },
            options: {
                perPage: 10,
                perPageValues: [],
                skin: 'table-smallest table-sm table table-striped mt-1',
                filterable: false,
                texts: {
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                },
                requestFunction: async function (data) {
                    const { page, limit } = data;
                    return {
                        data: self.samples.slice((page - 1) * limit, page * limit),
                        count: self.samples.length
                    }
                }
            }
        };
    },
    methods: {
        async show(dataSourceId) {
            try {
                const resp = await axios.get(`${limoneroUrl}/datasources/sample/${dataSourceId}?limit=40`, {});
                this.samples = resp.data.data;
                if (this.samples.length > 0) {
                    this.attributes = Object.keys(this.samples[0]);
                } else {
                    this.attributes = [];
                }
                this.$nextTick(() => {
                    this.loaded = true;
                    this.$refs.preview.show();
                })
            }
            catch (e) {
                this.error(e);
            }
        },
    }
};
</script>