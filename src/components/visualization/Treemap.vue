<template>
    <div class="text-center" style="min-height: 500px;">
        <Plotly ref="plotly" :data="data" :layout="layout" :display-mode-bar="true" :auto-resize="true"></Plotly>
        <small v-if="visualizationData.data.footer">
            {{visualizationData.data.footer}}
        </small>
    </div>
</template>
<script>
    import { debounce } from "../../util.js";
    import VisualizationMixin from "./VisualizationMixin";
    export default {
        name: 'TreemapVisualization',
        mixins: [VisualizationMixin],
        data() {
            return {
                data: this.getData(),
                layout: {
                    autosize: true,
                    margin: { l: 10, r: 10, t: 50, b: 10 },
                    title: this.visualizationData.title,
                }
            };
        },
        mounted() {
            const self = this;
            this.__resizeListener = debounce(() => {
                self.$refs.plotly.relayout({
                    width: self.$el.clientWidth,
                    height: self.$el.parentElement.parentElement.clientHeight - 50,
                });
            }, 100);
            window.addEventListener('resize', this.__resizeListener);
            this.__resizeListener();
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.__resizeListener)
        },
        methods: {
            getData() {
                const result = this.visualizationData.data;
                result['marker'] = { colors: result['colors'] }
                result['texttemplate'] = '%{label}<br>%{value}'
                if (result.textinfo && result.textinfo.indexOf('percent entry') > -1) {
                    result['texttemplate'] += '<br>%{percentEntry} ' + this.$t('visualization.ofEntry');
                }
                if (result.textinfo && result.textinfo.indexOf('percent parent') > -1) {
                    result['texttemplate'] += '<br>%{percentParent} ' + this.$t('visualization.ofParent');
                }
                return [result];
            }
        },
    }
</script>