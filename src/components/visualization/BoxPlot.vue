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
                height: this.height,
                zeroline: false,
                boxmode: 'group',

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
            const y = [];
            const x = [];
            const colors = [];

            this.visualizationData.data.map((item) => {
                y.push(item.y);
                x.push(item.x);
                
            });
            return [{
                x, y, marker: {colors}, type: 'box',
                
            }];
        }
    },
}
</script>