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
            const isVertical = this.visualizationData.data[0]?.orientation === 'v';
            return {
                data: this.getData(),
                layout: {
                    title: { text: this.visualizationData.title },
                    xaxis: {
                        type: isVertical ? 'category': '-',
                        title: { text: this.visualizationData.x.title, },
                        ticksuffix: this.visualizationData.x.suffix,
                        tickprefix: this.visualizationData.x.prefix,
                    },
                    yaxis: {
                        title: { text: this.visualizationData.y.title, },
                        ticksuffix: this.visualizationData.y.suffix,
                        tickprefix: this.visualizationData.y.prefix,
                        type: !isVertical ? 'category': '-'
                    },
                    barmode: this.visualizationData.barmode || 'group',
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
                this.visualizationData.data.forEach(dataSerie => {
                    dataSerie.values.forEach(value => {
                        const found = series.find((s) => s.name === value.x);
                        if (!found) {
                            let serie = null;
                            if (dataSerie.orientation === 'h') {
                                //const yValues = dataSerie.values.map(value => value.y);
                                serie = {
                                    x: [value.y],
                                    y: xValues,
                                    orientation: 'h',
                                    type: 'bar',
                                    name: value.x,
                                };
                            } else {
                                serie = {
                                    y: [value.y],
                                    x: xValues,
                                    orientation: 'v',
                                    type: 'bar',
                                    name: value.x,
                                };
                            }
                            series.push(serie);
                        } else if (dataSerie.orientation === 'h'){
                            found.x.push(value.y);
                        } else {
                            found.y.push(value.y);
                        }
                    });
                    colors.push(dataSerie.color);
                });
                series.forEach((serie, inx) => { serie.marker = { color: colors[inx] } });
                console.debug(series)
                console.debug(colors)
                return series;
            }
        },
    }
</script>
