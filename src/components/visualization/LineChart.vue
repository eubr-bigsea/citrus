<template>
    <div>
        <Plotly ref="plotly"
                :data="data"
                :layout="layout"
                :display-mode-bar="true"
                :options="options" />
    </div>
</template>
<script>
import VisualizationMixin from "./VisualizationMixin.vue";
import { debounce } from "../../util.js";

export default {
    mixins: [VisualizationMixin],
    data() {
        const showlegend = !this.visualizationData.legend
                || this.visualizationData.legend.isVisible !== false;

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
                legend: {
                    "orientation": "h", "x": 0, "y": 4
                },
                showlegend,
                autosize: true,
                automargin: true,
                height: this.height
            },
            options: { responsive: true },
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
        window.removeEventListener('resize', this.__resizeListener);
    },
    methods: {
        getData() {
            const series = [];
            this.visualizationData.data.forEach(serie => {
                const xValues = [];
                const yValues = [];
                series.push({
                    y: yValues, mode: this.visualizationData.mode || 'lines',
                    x: xValues,
                    name: serie.name,
                    marker: {
                        color: serie.color,
                        // symbol: "diamond-open"
                    },
                    type: 'scatter'
                });
                let xTransform;
                if (this.visualizationData.using_date) {
                    xTransform = (d) => new Date(d);
                } else {
                    xTransform = (d) => d;
                }
                serie.values.sort((a, b) => xTransform(a.x) - xTransform(b.x))
                    .forEach(value => {
                        xValues.push(xTransform(value.x));
                        yValues.push(value.y);
                    });
            });
            console.debug(series);
            return series;
        }
    },
};
</script>
