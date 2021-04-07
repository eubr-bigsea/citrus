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
    	}
    },
    mounted() {

        var data = [
            {
                name: "Teste",
                x: ['giraffes', 'orangutans', 'monkeys'],
                y: [20, 14, 23],
                type: 'bar'
            }
        ];

        var layout = {
            title: "Titulo",
            showlegend: true,
        }

        Plotly.newPlot('chartViewer', data, layout);
    },
    computed: {
    },
    methods: {
    }
  }
  </script>
  <style scoped lang="scss">

  </style>
  