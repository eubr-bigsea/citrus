<template>
  <highcharts :options="options"></highcharts>
</template>

<script>
export default {
  name: "caipirinha-visualization-scatter",
  props: ["visualizationData"],
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
  },
  data: function() {
    const options = {
      chart: {
        type: "scatter"
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

    return { options };
  }
};
</script>