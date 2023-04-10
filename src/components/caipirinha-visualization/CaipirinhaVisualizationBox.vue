<template>
    <highcharts :options="options" />
</template>

<script>
export default {
    name: "CaipirinhaVisualizationBox",
    props: {
        "visualizationData": {type: Object, default: () => null}
    },
    data: function() {
        const options = {
            chart: {
                type: "boxplot"
            },
            title: {
                text: this.visualizationData.title
            },
            tooltip: {
                pointFormat: "<b>{point.y}</b> ({point.percentage:.1f}%)"
            },
            plotOptions: {
                pie: {
                    innerSize: "50%",
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
                    name: "Amount", // TODO: Não possui retorno da API
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