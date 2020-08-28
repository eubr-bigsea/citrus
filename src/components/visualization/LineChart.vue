<template>
    <div>
        <Plotly ref="plotly" :data="data" :layout="layout" :display-mode-bar="true" :options="options"></Plotly>
        <!--
        <CaipirinhaVisualizationLine :visualization-data="visualizationData" />
        -->
    </div>
</template>
<script>
    import VisualizationMixin from "./VisualizationMixin";
    import CaipirinhaVisualizationLine from "../caipirinha-visualization/CaipirinhaVisualizationLine"
    export default {
        mixins: [VisualizationMixin],
        components: {
            CaipirinhaVisualizationLine
        },
        data() {
            return {
                data: this.getData(),
                layout: {
                    title: { text: this.visualizationData.title },
                    xaxis: {
                        title: { text: this.visualizationData.x.title, },
                        ticksuffix: this.visualizationData.x.suffix,
                        tickprefix: this.visualizationData.x.prefix,
                    },
                    yaxis: {
                        title: { text: this.visualizationData.y.title, },
                        ticksuffix: this.visualizationData.y.suffix,
                        tickprefix: this.visualizationData.y.prefix,
                    },
                    legend: { "orientation": "h", "x": 0, "y": 4 },
                    autosize: true,
                    automargin: true,
                    height: this.height
                },
                options: {responsive: true},
            };
        },
        mounted(){
            const self = this;
            this.__resizeListener = _.debounce(() => {
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
                const series = [];
                this.visualizationData.data.forEach(serie => {
                    const xValues = [];
                    const yValues = [];
                    series.push({
                        y: yValues, mxode: 'lines', name: serie.name,
                        x: xValues, marker: { color: serie.color },
                        type: 'scatter'
                    });
                    const xTransform = this.visualizationData.using_date ?
                        (d) => new Date(d) : (d) => d;
                    serie.values.sort((a, b) => a.x - b.x)
                        .forEach(value => {
                            xValues.push(xTransform(value.x));
                            yValues.push(value.y);
                        });
                });
                console.debug(series)
                return series;
            }
        },
    }
</script>
