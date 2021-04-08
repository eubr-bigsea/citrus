<template>
    <div class="chart-builder-type-selector">
        <div class="current-chart" :style="{backgroundImage: 'url('+getCurrentChart().image+')'}">
			<ul>
				<li @click="setCurrentChart(item)" v-for="item in chartTypes" :key="item.name" :class="{selected: getCurrentChart().name==item.name}">
					<div class="chart-thumb" :style="{backgroundImage: 'url('+item.image+')'}">
					</div>

					<div class="chart-label">
						{{ item.label }}
					</div>
				</li>
			</ul>
        </div>
    </div>
</template>
<script>

  export default {
    components: {},
    props: {},
    data() {
    	return {
			currentChart: null,
            chartTypes: [
                {
                    name: "bar",
                    label: "Gráfico de Barras",
                    image: "https://images.plot.ly/plotly-documentation/thumbnail/bar.jpg"
                },
                {
                    name: "pie",
                    label: "Gráfico de Pizza",
                    image: "https://images.plot.ly/plotly-documentation/thumbnail/pie-chart.jpg"
                },
                {
                    name: "line",
                    label: "Gráfico de Linhas",
                    image: "https://images.plot.ly/plotly-documentation/thumbnail/line-plots.jpg"
                },
                {
                    name: "bubble",
                    label: "Gráfico de Bolhas",
                    image: "https://images.plot.ly/plotly-documentation/thumbnail/bubble.jpg"
                },
                {
                    name: "scatter",
                    label: "Gráfico de Dispersão",
                    image: "https://images.plot.ly/plotly-documentation/thumbnail/line-and-scatter.jpg"
                },
                {
                    name: "dots",
                    label: "Gráfico de Pontos",
                    image: "https://images.plot.ly/plotly-documentation/thumbnail/dot-plot.jpg"
                },
                {
                    name: "filled-area",
                    label: "Gráfico de Área",
                    image: "https://images.plot.ly/plotly-documentation/thumbnail/area1.jpg"
                }
        	]
    	}
    },
    computed: {
        
    },
    methods: {
		setCurrentChart: function(chartType) { 
            this.currentChart = chartType;
            this.$root.$emit('chartBuilderUpdateChart', {
                type: "type", 
                value: this.currentChart.name
            });
        },
		getCurrentChart: function() { return this.currentChart || this.chartTypes[0] }
    }
  }
  </script>
  <style scoped lang="scss">

	.chart-thumb {
        width: 2rem;
        height: 2rem;
        border: 1px solid rgba(#000, .08);
        background-color: #fff;
		background-size: cover;
	}

    .current-chart  {
		@extend .chart-thumb;
		width: 4rem;
        height: 4rem;
		cursor: pointer;
		position: relative;

		ul {
			display: none;
			list-style-type: none;
			margin: 0;
			padding: 0;
			position: absolute;
			width: 300px;
			background-color: #fff;
			border: 1px solid rgba(#000, .08);
			left: 4rem;
            z-index: 1;

			li {
				padding: .75rem;
				border-bottom: 1px solid rgba(#000, .08);
				display: flex;
				font-size: 1.25rem;
				line-height: 2rem;
				font-weight: bold;
				color: rgba(#000, .5);

				.chart-label {
					margin-left: .5rem;
				}

				&:hover, &.selected {
					background-color: rgba(#000, .04);
					color: rgba(#000, .85);
				}

			}
		}

		&:hover {
			ul {
				display: block;
			}
		}
    }

  </style>
  