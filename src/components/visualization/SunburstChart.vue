<template>
    <div>
        <Plotly ref="plotly"
                :data="data"
                :layout="layout"
                :display-mode-bar="true"
                :auto-resize="true" />
    </div>
</template>
<script>
import VisualizationMixin from "./VisualizationMixin.vue";
import {debounce} from "../../util.js";
export default {
    mixins: [VisualizationMixin],
    data() {
        return {
            data: this.getData(),
            layout: {
                ... this.visualizationData.layout,
                title: { text: this.visualizationData.title },
                autosize: true,
                margin: {"l": 0, "r": 0, "b": 0, "t": 0},
                width: this.width,
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
    beforeUnmount() {
        window.removeEventListener('resize', this.__resizeListener)
    },
    methods: {
        getData() {
            const values = [];
            const labels = [];
            const colors = [];
            const parents = [];

            this.visualizationData.data.map((item) => {
                values.push(item.value);
                labels.push(item.label);
                colors.push(item.color);
                parents.push(item.parent)
            });
            return [{
                values, labels, marker: {colors}, parents, type: 'sunburst'
            }];
        }
    },
}
</script>