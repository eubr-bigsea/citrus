<template>
    <div class="chart-builder-visualization">
        <div v-show="chartIsVisible()" id="chartViewer" />
        <div v-if="!chartIsVisible()" class="chart-not-available">
            Selecione o tipo de gráfico e configure suas propriedades
        </div>
    </div>
</template>
<script>

import Plotly from 'plotly.js-dist-min'

export default {
    components: {},
    props: {},
    data() {
        return {
            chartData: {
                axis: {
                    x: { data: [] },
                    y: { data: [] },
                    z: { data: [] },
                },
                layout: {
                    title: "",
                    showlegend: false,
                    colorway: []
                },
                type: undefined
            }
        }
    },
    computed: {
    },
    mounted() {
        this.$root.$on('chartBuilderUpdateChart', this.updateChart)
        //Plotly.newPlot('chartViewer', this.getFormatedData(), this.getFormatedLayout(), {responsive: true});
    },
    beforeUnmount() {
        this.$root.$off('chartBuilderUpdateChart');
    },
    methods: {
        updateChart(updatedData) {

            if (updatedData.type == "type") {
                Plotly.purge('chartViewer');
            }

            this.chartData[updatedData.type] = updatedData.value;
            if (this.chartIsVisible())
                Plotly.newPlot('chartViewer', this.getFormatedData(), this.getFormatedLayout(), { responsive: true })
        },

        chartIsVisible() {
            if (['bubble', 'scatter'].includes(this.chartData.type)) {
                return this.chartData.type
                    && this.chartData.axis.x.data.length > 0
                    && this.chartData.axis.y.data.length > 0
                    && this.chartData.axis.z.data.length > 0;
            } else {
                return this.chartData.type
                    && this.chartData.axis.x.data.length > 0
                    && this.chartData.axis.y.data.length > 0;
            }

        },

        getFormatedData() {
            let data = [];

            switch (this.chartData.type) {
                case "pie":
                    data.push({
                        type: this.chartData.type,
                        labels: this.chartData.axis.x.data[0].data,
                        values: this.chartData.axis.y.data[0].data,
                        hole: this.getFormatedLayout().hole
                    });
                    break;

                case "bubble":
                    data.push({
                        mode: 'markers',
                        x: this.chartData.axis.x.data[0].data,
                        y: this.chartData.axis.y.data[0].data,
                        marker: {
                            symbol: this.getFormatedLayout().symbol,
                            size: this.chartData.axis.z.data[0].data,
                        }
                    });
                    break;

                case "scatter":
                    data.push({
                        mode: 'markers',
                        type: this.chartData.type,
                        x: this.chartData.axis.x.data[0].data,
                        y: this.chartData.axis.y.data[0].data,
                        text: this.chartData.axis.z.data[0].data,
                        marker: {
                            size: 12,
                        }
                    });
                    break;

                case "filled-area":

                    for (let y of this.chartData.axis.y.data) {
                        data.push({
                            name: y.label,
                            type: 'scatter',
                            fill: data.length == 0 ? 'tozeroy' : 'tonexty',
                            x: this.chartData.axis.x.data[0].data,
                            y: y.data
                        });
                    }

                    break;

                case "bar":

                    for (let y of this.chartData.axis.y.data) {
                        if (this.getFormatedLayout().orientation == 'h') {
                            data.push({
                                orientation: "h",
                                name: y.label,
                                type: this.chartData.type,
                                y: this.chartData.axis.x.data[0].data,
                                x: y.data
                            });
                        } else {
                            data.push({
                                name: y.label,
                                type: this.chartData.type,
                                x: this.chartData.axis.x.data[0].data,
                                y: y.data
                            });
                        }
                    }

                    break;

                case "line":
                    for (let y of this.chartData.axis.y.data) {
                        data.push({
                            line: this.getFormatedLayout().line,
                            name: y.label,
                            type: this.chartData.type,
                            x: this.chartData.axis.x.data[0].data,
                            y: y.data
                        });
                    }
                    break;

                default:
                    for (let y of this.chartData.axis.y.data) {
                        data.push({
                            name: y.label,
                            type: this.chartData.type,
                            x: this.chartData.axis.x.data[0].data,
                            y: y.data
                        });
                    }
                    break;
            }

            return data;
        },

        getFormatedLayout() {
            let l = { ...this.chartData.layout };

            //Ajusta o tamanho do chart ao div
            let el = document.getElementsByClassName("chart-builder-visualization")[0];
            l.width = el.offsetWidth;
            l.height = el.offsetHeight;

            return l;
        },
    }
}
</script>
<style scoped lang="scss">
.chart-builder-visualization {
    //height: 600px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}

.chart-not-available {
    background-color: #fff;
    border: 1px solid rgba(#000, .08);
    padding: 1rem;
    margin: 0;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: bold;
    color: rgba(#000, .2);
}
</style>
