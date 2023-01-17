<template>
    <div>
        <a v-if="isFullHtml"
           :href="link"
           target="_blank">{{$t('actions.show')}} <font-awesome-icon icon="fa fa-external-link-alt" /></a>
        <div v-else
             :html="data" />
    </div>
</template>
<script>
import VisualizationMixin from "./VisualizationMixin.vue";
export default {
    name: 'HtmlVisualization',
    mixins: [VisualizationMixin],
    data() {
        return {
            data: this.getData(),
        };
    },
    computed: {
        isFullHtml() {
            return this.visualizationData.data
                .substring(0, 100).toLowerCase().indexOf('<html>') > -1;
        },
        link(){
            let routeData = this.$router.resolve({name: 'displayHtml', params: {id: this.visualizationData.id}});
            return routeData.href;
        }
    },

    mounted() {
        /*if (this.isFullHtml) {
                var doc = this.$refs.iframe.contentWindow.document;
                doc.open();
                doc.write(this.data);
                doc.close();
            }*/
    },
    methods: {
        getData() {
            return this.visualizationData.data;
        },
    }
}
</script>
