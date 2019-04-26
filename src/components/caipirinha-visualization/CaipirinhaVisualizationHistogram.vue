<template>
    <div>
        <div v-for="hist in options" :key="hist.index">
            <highcharts :options="hist"></highcharts>
        </div>
    </div>
</template>

<script>
    export default {
        name: "caipirinha-visualization-histogram",
        props: ["visualizationData"],
        computed: {
            options() {
                this.visualizationData.data.forEach((result, index) => {
                    // workaround in order to display the last point
                    result["xAxis"]["tickmarkPlacement"] = 'on'
                    result["xAxis"]["tickWidth"] = 1;
                    
                    result["xAxis"]["categories"].push('');
                    result["series"][0]["data"].push(0);
                    result['plotOptions']['column']['pointPlacement'] = 0.5;
                    result['plotOptions']['column']['borderColor'] = '#55f';
                    result['index'] = index;
                });
                return this.visualizationData.data;
            }
        }
    };
</script>