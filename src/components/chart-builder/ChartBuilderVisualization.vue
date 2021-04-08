<template>
    <div class="chart-builder-visualization">
        <div id="chartViewer"></div>
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
                data: {
                    x: [],
                    y: []
                },
                layout: {
                    title: "",
                    showlegend: false,
                },
                type: "bar"
            }
    	}
    },
    mounted() {

        this.$root.$on('chartBuilderUpdateChart', this.updateChart)

        Plotly.newPlot('chartViewer', this.getFormatedData(), this.chartData.layout);
    },
    beforeDestroy() {
        this.$root.$off('chartBuilderUpdateChart');
    },
    computed: {
    },
    methods: {
        updateChart(updatedData) {
            this.chartData[updatedData.type] = updatedData.value;
            Plotly.react('chartViewer', this.getFormatedData(), this.chartData.layout)
        },
        
        getFormatedData() {
            let data = [];
            for(let y of this.chartData.data.y) {
                data.push(
                    {
                        name: y.label,
                        x: this.chartData.data.x[0].data,
                        y: y.data,
                        type: this.chartData.type
                    }
                )
            }
           return data;
        }
    }
  }
  </script>
  <style scoped lang="scss">

  </style>
  