import ChartBuilderVisualization from '../../components/chart-builder/ChartBuilderVisualization.vue';
import ChartBuilderAxis from '../../components/chart-builder/ChartBuilderAxis.vue';
import ChartBuilderOptions from '../../components/chart-builder/ChartBuilderOptions.vue';
import ChartBuilderDatasource from '../../components/chart-builder/ChartBuilderDatasource.vue';
import ChartBuilderTypeSelector from '../../components/chart-builder/ChartBuilderTypeSelector.vue';


const data = [
    {name: "date", label: "Data", type: "date", data: ['1976-11-01', '1952-07-14', '1981-05-04']},
    {name: "name", label: "Nome", type: "string", data: ["José", "Maria", "João"]},
    {name: "age", label: "Idade", type: "int", data: [72, 57, 38]},
    {name: "childs", label: "Filhos", type: "int", data: [3, 5, 2]},
]

export default {
    title: 'Chart Builder/Visualization',
    components: {
        ChartBuilderVisualization,
        ChartBuilderAxis,
        ChartBuilderOptions,
        ChartBuilderDatasource,
        ChartBuilderTypeSelector
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { 
        ChartBuilderVisualization,
        ChartBuilderAxis,
        ChartBuilderOptions,
        ChartBuilderDatasource,
        ChartBuilderTypeSelector
    },
    template: '<div><div class="row"><div class="col-md-3"><chart-builder-datasource v-bind="$props" /></div><div class="col-md-9"><div class="row"><div class="col-xs-12 col-md-3"><chart-builder-type-selector /></div><div class="col-xs-12 col-md-9"><chart-builder-axis /></div></div><div class="row"><div class="col-xs-12 col-md-3"><chart-builder-options /></div><div class="col-xs-12 col-md-9"><chart-builder-visualization /></div></div></div></div></div>',
});

export const Primary = Template.bind({});
Primary.args = {
    columns: data
};