<template>
    <div class="text-center">
        <Plotly ref="plotly" :data="data" :layout="layout" :display-mode-bar="true" :auto-resize="true"></Plotly>
		<small v-if="visualizationData.data.footer">
			{{visualizationData.data.footer}}
		</small>
    </div>
</template>
<script>
    import VisualizationMixin from "./VisualizationMixin";
    export default {
        mixins: [VisualizationMixin],
        data() {
            return {
                data: [this.getData()],
                layout: {
                    autosize:true,
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
        mounted(){
            const self = this;
            this.__resizeListener = _.debounce(() => {
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
				const data = this.visualizationData.data;
                const result = { 
					type: 'scatter', 
					mode: 'markers',
					x: this.visualizationData.data.x,
					y: this.visualizationData.data.y,
					text: this.visualizationData.data.texts || [],
					marker: {
						size: this.visualizationData.data.sizes.map(s => s * 5),
						color: this.visualizationData.data.colors || []
					}
				};
				return result;
            }
        },
    }
</script>
