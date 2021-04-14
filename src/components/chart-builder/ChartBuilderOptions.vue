<template>
    <div class="chart-builder-options">
        <h4>Opções</h4>

        <b-form>
            <b-form-group
              id="title"
              label="Título"
              label-for="title"
            >
                <b-form-input
                    id="title"
                    v-model="form.title.text"
                    type="text"
                ></b-form-input>
            </b-form-group>

            <b-form-group>
                <b-form-checkbox v-model="form.showlegend">Exibir legenda</b-form-checkbox>
            </b-form-group>

            <template v-if="chartType=='bar'">
                <b-form-group>
                    <b-form-checkbox v-model="chartCustomOptions.barOptions.horizontal">Horizontal</b-form-checkbox>
                </b-form-group>

                <b-form-group>
                    <b-form-checkbox v-model="chartCustomOptions.barOptions.stacked">Empilhado</b-form-checkbox>
                </b-form-group>
            </template> 

            <template v-if="chartType=='pie'">
                <b-form-group
                    label="Preenchimento"
                    label-for="pie-fill"
                    >
                    <b-form-input
                        id="title"
                        v-model="chartCustomOptions.pieOptions.hole"
                        type="range"
                        min=".05"
                        max="1"
                        step=".05"
                    ></b-form-input>
                    
                </b-form-group>
            </template> 

            <template v-if="chartType=='line'">

                <b-form-group
                    label="Espessura da Linha"
                    label-for="line-width"
                    >
                    <b-form-input
                        id="title"
                        v-model="chartCustomOptions.lineOptions.line.width"
                        type="range"
                        min=".5"
                        max="5"
                        step=".05"
                    ></b-form-input>
                    
                </b-form-group>

                <b-form-group
                    label="Tipo de Linha"
                    label-for="line-width"
                    >
                    <b-form-select v-model="chartCustomOptions.lineOptions.line.dash" :options="[
                        {value: 'solid', text: 'Sólido'},
                        {value: 'dot', text: 'Ponto'},
                        {value: 'dashdot', text: 'Tracejado'},
                    ]"></b-form-select>
                    
                </b-form-group>

                <b-form-group
                    label="Formato"
                    label-for="line-width"
                    >
                    <b-form-select v-model="chartCustomOptions.lineOptions.line.shape" :options="[
                        {value: 'linear', text: 'Linear'},
                        {value: 'splice', text: 'Spline'},
                        {value: 'vhv', text: 'vhv'},
                        {value: 'hvh', text: 'vhv'},
                        {value: 'vh', text: 'vh'},
                        {value: 'hv', text: 'hv'},
                    ]"></b-form-select>
                    
                </b-form-group>
                
            </template> 

            <template v-if="chartType=='bubble'">

                <b-form-group
                    label="Símbolo"
                    label-for="line-width"
                    >
                    <b-form-select v-model="chartCustomOptions.bubbleChart.symbol" :options="[
                        {value: 'circle', text: 'Círculo'},
                        {value: 'square', text: 'Quadrado'},
                        {value: 'diamond', text: 'Diamante'},
                        {value: 'cross', text: 'Cruz'},
                    ]"></b-form-select>
                    
                </b-form-group>
                
            </template> 

        </b-form>
    </div>
</template>
<script>

  export default {
    components: {},
    props: {},
    data() {
    	return {
            form: {
                title: {
                    text: ""
                },
                showlegend: false,
            },
            chartType: "bar",

            chartCustomOptions: {
                barOptions: {
                    stacked: false,
                    horizontal: false
                },
                pieOptions: {
                    hole: 1
                },
                lineOptions: {
                    line: {
                        dash: 'solid',
                        width: 1,
                        shape: 'linear'
                    }
                },
                bubbleChart: {
                    symbol: 'circle'
                }
            }
    	}
    },
    watch: {
        form: {
            handler: 'changeOptions',
            deep: true
        },
        chartCustomOptions: {
            handler: 'changeOptions',
            deep: true
        }
    },
    computed: {
    },
    mounted() {
        this.$root.$on('chartBuilderUpdateChart', this.updateChart)
        
    },
    methods: {
        changeOptions() {

            let options = {...this.form};

            switch(this.chartType) {
                case "bar": 
                    if(this.chartCustomOptions.barOptions.stacked) options.barmode = 'stack';
                    if(this.chartCustomOptions.barOptions.horizontal) options.orientation = 'h';
                    break;
                case "pie":
                    options.hole = 1-this.chartCustomOptions.pieOptions.hole;
                    break;
                case "line":
                    options.line = this.chartCustomOptions.lineOptions.line;
                    break;
                case "bubble":
                    options.symbol = this.chartCustomOptions.bubbleChart.symbol;
                    break;
            }

            console.log(options);

            this.$root.$emit('chartBuilderUpdateChart', {
                type: "layout", 
                value: options
            });
        },
        updateChart(data) {
            if(data.type=="type") {
                this.chartType = data.value;
            }
        }
    }
  }
  </script>
  <style scoped lang="scss">

  </style>
  