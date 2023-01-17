<template>
    <highcharts :options="options" />
</template>

<script>
export default {
    name: "CaipirinhaVisualizationBar",
    props: {
        "visualizationData": {type: Object, default: () => null}
    },
    data: function() {
        const getBarData = function(data) {
            const series = {};

            data.data.forEach(item => {
                item.values.forEach(value => {
                    const name = value.x;

                    if (Object.prototype.hasOwnProperty.call(series, name) == false) series[name] = [];

                    series[name].push(value.y);
                });
            });

            return Object.keys(series).map(key => ({
                name: key,
                data: series[key]
            }));
        };

        const options = {
            chart: {
                type: "column"
            },
            title: {
                text: this.visualizationData.title
            },
            yAxis: {
                title: {
                    text: this.visualizationData.y.title || 'Y'
                }
            },
            xAxis: {
                categories: this.visualizationData.data.map(item => item.name),
                title: {
                    text: this.visualizationData.x.title || 'X'
                }
            },
            series: getBarData(this.visualizationData)
        };
        return { options };
    }
};
</script>
