<template>
    <div>
        <highcharts :options="options" />
    </div>
</template>

<script>
export default {
    name: "CaipirinhaVisualizationBoxplot",
    props: {
        "visualizationData": {type: Object, default: () => null}
    },
    computed: {
        options() {
            const result = this.visualizationData.data[0];
            result['chart']['height'] = 600;
            result['chart']['zoomType'] = 'Xy';
            result['chart']['panning'] = true;
            result['chart']['panKey'] = 'ctrl';
            result['legend']['enabled'] = true;
            // result['chart']['width'] = 400;
            result['series'][0]['pointWidth'] = 30;
            result['series'][0]['tooltip']['pointFormat'] = `
                    <br/>
                    ${this.$t('visualization.maximum')}: <b>{point.high}</b><br/>
                    ${this.$t('visualization.upperQuartile')}: <b>{point.q3}</b><br/>
                    ${this.$t('visualization.median')}: <b>{point.median}</b><br/>
                    ${this.$t('visualization.lowerQuartile')}: <b>{point.q1}</b><br/>
                    ${this.$t('visualization.minimum')}: <b>{point.low}</b> `;
            if (result['series'].length > 1){
                result['series'][1]['name'] = this.$t('visualization.outlier', 2);
                result['series'][1]['tooltip']['headerFormat'] = `<b>${this.$t('visualization.outlier', 1)}</b><br/>`;
                result['series'][1]['marker']['lineColor'] = '#888';
            }

            return result;
        }
    }
};
</script>
