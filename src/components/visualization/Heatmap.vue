<template>
    <div class="text-center">
        <Plotly ref="plotly" :data="data" :layout="layout" :display-mode-bar="true" :auto-resize="true"></Plotly>
        <small v-if="visualizationData.data.footer">
            {{visualizationData.data.footer}}
        </small>
        <div v-for="c in colorScale" :key="c" 
                style="height: 20px; widht:20px; float: left" :style="{background: c[1]}">
            {{c}}
        </div>
    </div>
</template>
<script>
    import VisualizationMixin from "./VisualizationMixin";
    import { debounce } from '../../util.js';
    export default {
        mixins: [VisualizationMixin],
        data() {
            return {
                colorScale: this._getColorScale(),
                data: this.getData(),
                layout: {
                    autosize:true,
                    title: this.visualizationData.title,
                    xaxis: {
                        title: {
                          text: this.visualizationData.data.column_title,
                        },
                    },
                    yaxis: {
                        title: {
                          text: this.visualizationData.data.row_title,
                        },
                    }
                }
            };
        },
        mounted(){
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
            _getColorScale(){
                const colors = this.visualizationData.data.colors;
                const numColors = colors.length;
                const ratio = 1.0 / (numColors - 1);
                let colorScale = 'Viridis';
                if (numColors > 0){
                    colorScale = colors.map((c, inx) => [Math.round(inx*ratio*100)/100 , c])
                }
                return colorScale;
            },
            getData() {
                const colorScale = this._getColorScale();
                const result = { 
                    type: 'heatmap', 
                    hoverongaps: false,
                    colorscale: colorScale,
                    x: this.visualizationData.data.cols,
                    y: this.visualizationData.data.rows,
                    z: this.visualizationData.data.values,
                };
                return [result];
            }
        },
    }
</script>
