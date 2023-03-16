<template>
    <highcharts :options="options" />
</template>

<script>
export default {
    name: "CaipirinhaVisualizationSunburst",
    props: {
        visualizationData: {type: Object, default: () => null},
    },
    data: function() {
        const options = {
            chart: {
                type: "sunburst"
            },
            title: {
                text: this.visualizationData.title
            },
            tooltip: {
                pointFormat: "<b>{point.y}</b> ({point.percentage:.1f}%)"
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [
                {
                    name: "Amount", // TODO: Não possui retorno da API (rever essa questão do API)
                    data: this.visualizationData.data.map(serie => ({
                        name: serie.name,
                        y: serie.value
                    }))
                }
            ]
        };
        return { options };
    }
};
</script>