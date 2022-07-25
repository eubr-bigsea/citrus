<template>
    <div class="text-center">
        <Plotly ref="plotly" :data="data" :layout="layout" :display-mode-bar="true" :auto-resize="true"></Plotly>
        <small v-if="visualizationData.data && visualizationData.data.footer">
            {{visualizationData.data.footer}}
        </small>
    </div>
</template>
<script>
    import VisualizationMixin from "./VisualizationMixin";
    import {debounce} from "../../util.js";

    export default {
        name: 'IndicatorVisualization',
        mixins: [VisualizationMixin],
        data() {
            return {
                data: [this.getData()],
                layout: {
                    autosize: true,
                    height: this.height,
                    margin: { t: 55, b: 5, l: 25, r: 25 },
                },
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
                const data = this.visualizationData.data || {value: 0, mode: 'number', title: 'Indicator'};
                const result = {
                    type: "indicator", value: data.value,
                    mode: data.mode,
                    title: this.visualizationData.title
                };
                if (data.delta) {
                    result['delta'] = data.delta;
                }
                return result;
            }
        },
    }
</script>
