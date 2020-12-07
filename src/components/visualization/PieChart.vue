<template>
    <div>
        <Plotly ref="plotly" :data="data" :layout="layout" :display-mode-bar="true" :auto-resize="true"></Plotly>
    </div>
</template>
<script>
    import VisualizationMixin from "./VisualizationMixin";
    import {debounce} from "../../util.js";
    export default {
        mixins: [VisualizationMixin],
        data() {
            return {
                data: this.getData(),
                layout: {
                    title: { text: this.visualizationData.title },
                    autosize: true,
                    height: this.height,
                },
            };
        },
        mounted() {
            const self = this;
            this.__resizeListener = debounce(() => {
                self.$refs.plotly.relayout({
                    width: self.$el.clientWidth,
                    height: self.$el.parentElement.parentElement.clientHeight - 20,
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
                const values = [];
                const labels = [];
                const colors = [];

                this.visualizationData.data.map((item) => {
                    values.push(item.value);
                    labels.push(item.label);
                    colors.push(item.color);
                });
                return [{
                    values, labels, marker: {colors}, type: 'pie',
                    hole: this.visualizationData.pie_type === 'donut' ? .60 : null
                }];
            }
        },
    }
</script>