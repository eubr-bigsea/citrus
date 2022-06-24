<template>
    <div class="text-center">
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
        mixins: [VisualizationMixin],
        data() {
            return {
                data: [this.getData()],
                layout: {
                    autosize: true,
                    title: this.visualizationData.title,
                    xaxis: {
                        title: {
                            text: this.visualizationData.data.x_title,
                        }
                    },
                    yaxis: {
                        title: {
                            text: this.visualizationData.data.y_title,
                        }
                    }
                }
            };
        },
        mounted() {
            const self = this;
            this.__resizeListener = debounce(() => {
                self.$refs.plotly.relayout({
                    width: self.$el.clientWidth,
                    height: self.$el.parentElement.parentElement.clientHeight,
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
                const data = this.visualizationData.data;
                const sizes = data.sizes || [];
                const result = {
                    type: 'scatter',
                    mode: 'markers',
                    x: data.x,
                    y: data.y,
                    text: data.texts || [],
                    marker: {
                        size: sizes,
                        color: data.color || []
                    }
                };
                return result;
            }
        },
    }
</script>
