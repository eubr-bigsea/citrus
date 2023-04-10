<template>
    <highcharts :options="options" />
</template>

<script>
import { setDatetimeOptions } from './CaipirinhaVisualizationUtils.js';


export default {
    name: "CaipirinhaVisualizationScatter",
    props: {
        visualizationData: {type: Object, default: () => null},
    },
    data: function() {
        let options = {
            chart: {
                type: "scattergeo"
            },
            title: {
                text: this.visualizationData.title
            },
            xAxis: {
                title: {
                    text: this.visualizationData.x.title
                },
                type: this.getType()
            },
            yAxis: {
                title: {
                    text: this.visualizationData.y.title
                }
            },
            series: this.visualizationData.data.map(serie => ({
                name: serie.name,
                data: serie.values
                    .map(value => [value.x, value.y])
                    .sort((a, b) => a[0] - b[0])
            }))
        };

        if (this.visualizationData.x.type == 'time')
            options = setDatetimeOptions(options);

        return { options };
    },
    methods: {
        getType() {
            let sample;

            try {
                sample = this.visualizationData.data[0].values[0].x;
            } catch(e) {
                return 'linear';
            }

            if (isNaN(sample) && !isNaN(Date.parse(sample)))
                return 'datetime';

            if (typeof sample == 'string')
                return 'category';

            return 'linear';
        }
    }
};
</script>