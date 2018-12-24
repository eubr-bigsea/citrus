<template>
  <highcharts :options="options"></highcharts>
</template>

<script>
export default {
  name: "caipirinha-visualization-line",
  props: ["visualizationData"],
  data: function() {
    const options = {
      chart: {
        type: "line"
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

    return { options };
  }
};
</script>