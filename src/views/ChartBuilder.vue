<template>

    <div id="chart-builder">

        <div class="datasource">
            <chart-builder-datasource :columns="columns" />
        </div>

        <div class="options">
            <div class="type-selector">
                <chart-builder-type-selector />
            </div>
            <div>
                <chart-builder-options />
            </div>
        </div>

        <div class="visualization">
            <div class="axis">
                <chart-builder-axis />
            </div>
            <div class="chart">
                <chart-builder-visualization />
            </div>
        </div>
    </div>
    
</template>

<script>

    import ChartBuilderVisualization from '../components/chart-builder/ChartBuilderVisualization.vue';
    import ChartBuilderAxis from '../components/chart-builder/ChartBuilderAxis.vue';
    import ChartBuilderOptions from '../components/chart-builder/ChartBuilderOptions.vue';
    import ChartBuilderDatasource from '../components/chart-builder/ChartBuilderDatasource.vue';
    import ChartBuilderTypeSelector from '../components/chart-builder/ChartBuilderTypeSelector.vue';


    export default {

        components: { 
            ChartBuilderVisualization,
            ChartBuilderAxis,
            ChartBuilderOptions,
            ChartBuilderDatasource,
            ChartBuilderTypeSelector
        },
        
        data() {
            return {
                columns: [
                    {name: "date", label: "Data", type: "date", data: ['1976-11-01', '1952-07-14', '1981-05-04']},
                    {name: "name", label: "Nome", type: "string", data: ["José", "Maria", "João"]},
                    {name: "age", label: "Idade", type: "int", data: [72, 57, 38]},
                    {name: "childs", label: "Filhos", type: "int", data: [3, 5, 2]},
                ]
            }
        },
        /* Methods */
        methods: {
            
        }
    };
</script>

<style scoped lang="scss">

    #chart-builder {
        width: 100%;
        height: calc(100vh - 110px);
        display: flex;

        .datasource {
            overflow: auto;
            width: 250px;
            padding-right: 1rem;
            border-right: 1px solid rgba(black, .08);
        }

        .options {
            width: 300px;
            padding: 0 2rem;

            .type-selector {
                margin-bottom: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(black, .08);
            }
        }

        .visualization {
            width: 100%;
            display: flex;
            flex-direction: column;

            div {
                width: 100%;
            }

            .chart {
                height: 100%;
            }
        }
    }

</style>