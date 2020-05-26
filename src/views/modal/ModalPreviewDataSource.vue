<template>
    <b-modal ref="preview" size="xl" 
        :title="$t('common.preview')" ok-only no-stacking button-size="sm" header-bg-variant="dark" headerTextVariant="light">
        
        <small><strong>*{{$t('dataSource.previewExplanation', {amount: 40})}}</strong></small>
        
        <v-client-table :columns="attributes" :data="samples"
            :options="{perPage: 10, perPageValues:[5,], skin:'table-smallest table-sm table table-striped mt-1', filterable: false}">
        </v-client-table>
        <div v-if="previewWarnings.length">
            <strong>{{$tc('dataSource.someAttributesMayHaveProblem', previewWarnings.length)}}:</strong>
            {{previewWarnings.join(", ")}}
        </div>
    </b-modal>
</template>
<script>
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;

    import Vue from 'vue';
    import axios from 'axios';
    import Notifier from '../../mixins/Notifier';
    export default {
        mixins: [Notifier],
        data() {
            return {
                samples: {},
                id: {},
                attributes: {},
                previewWarnings: {default: []}
            }
        },
        methods: {
            show(dataSourceId) {
                this.id = dataSourceId;
                const url = `${limoneroUrl}/datasources/sample/${this.id}?limit=40`;
                const self = this;
                axios
                    .get(url, {})
                    .then(resp => {
                        self.samples = resp.data.data;
                        if (self.samples.length > 0){
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
            hide() {
                this.$refs.preview.show();
            }
        }
    }
</script>