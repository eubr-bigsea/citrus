<template>
  <highcharts :options="options"></highcharts>
</template>

<script>
import { setDatetimeOptions }  from './CaipirinhaVisualizationUtils.js';


export default {
  name: "CaipirinhaVisualizationArea",
  props: {
      "visualizationData": {type: Object, default: () => null}
  },
  data: function() {
    let options = {
        chart: {
          type: "area"
        },
        plotOptions: {
          area: {
            stacking: "normal",
            marker: {
              enabled: false
            }
          }
        },
        title: {
          text: this.visualizationData.title
        },
        xAxis: {
          title: {
            text: this.visualizationData.x.title
          }
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
  }
};
</script>
