<template>
    <div>
        <Plotly :data="data" :layout="layout" :display-mode-bar="true"></Plotly>
    </div>
</template>
<script>
    import VisualizationMixin from "./VisualizationMixin";

    export default {
        mixins: [VisualizationMixin],
        data() {
            return {
                data: this.getData(),
                layout: {
                    title: { text: this.visualizationData.title },
                    xaxis: {
                        type: 'category',
                        title: { text: this.visualizationData.x.title, },
                        ticksuffix: this.visualizationData.x.suffix,
                        tickprefix: this.visualizationData.x.prefix,
                    },
                    yaxis: {
                        title: { text: this.visualizationData.y.title, },
                        ticksuffix: this.visualizationData.y.suffix,
                        tickprefix: this.visualizationData.y.prefix,
                    },
                    barmode: 'group',
                    bargap: 0.15,
                    bargroupgap: 0.05,
                },
            };
        },
        methods: {
            getData() {
                const series = [];
                const colors = [];
                const xValues = this.visualizationData.data.map(item => item.name);
                this.visualizationData.data.forEach(item => {
                    item.values.forEach(value => {
                        const found = series.find((s) => s.name === value.x);
                        if (!found) {
                            series.push({
                                y: [value.y], type: 'bar', name: value.x, 
                                x: xValues,
                            });
                        } else {
                            found.y.push(value.y);
                        }
                    });
                    colors.push(item.color);
                });
                series.forEach((serie, inx) => { serie.marker = {color: colors[inx] }});
                return series;
            }
        },
    }
</script>
