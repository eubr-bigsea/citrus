<template>
    <b-modal ref="preview" size="xl" :title="$t('common.preview')" ok-only
             no-stacking button-size="sm"
             header-bg-variant="dark" header-text-variant="light">
        <small><strong>*{{$t('dataSource.previewExplanation', {amount: 40})}}</strong></small>

        <v-client-table :columns="attributes" :data="samples"
                        :options="{perPage: 10, perPageValues:[5,], skin:'table-smallest table-sm table table-striped mt-1', filterable: false}" />
    </b-modal>
</template>
<script>
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

import axios from 'axios';
import Notifier from '../../mixins/Notifier.js';
export default {
    mixins: [Notifier],
    data() {
        return {
            samples: { type: Array, default: () => [] },
            attributes: { type: Array, default: () => [] }
        }
    },
    methods: {
        show(dataSourceId) {
            const self = this;
            axios.get(`${limoneroUrl}/datasources/sample/${dataSourceId}?limit=40`, {})
                .then(resp => {
                    self.samples = resp.data.data;
                    if (self.samples.length > 0) {
                        self.attributes = Object.keys(self.samples[0]);
                    } else {
                        self.attributes = [];
                    }
                    self.$refs.preview.show();
                })
                .catch(e => {
                    self.error(e);
                });
        },
    }
}
</script>