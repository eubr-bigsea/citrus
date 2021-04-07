import ChartBuilderVisualization from '../../components/chart-builder/ChartBuilderVisualization.vue';
import ChartBuilderAxis from '../../components/chart-builder/ChartBuilderAxis.vue';
import ChartBuilderOptions from '../../components/chart-builder/ChartBuilderOptions.vue';

export default {
    title: 'Chart Builder/Visualization',
    components: {
        ChartBuilderVisualization,
        ChartBuilderAxis,
        ChartBuilderOptions
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { 
        ChartBuilderVisualization,
        ChartBuilderAxis,
        ChartBuilderOptions
    },
    template: '<div><div class="row"><div class="col-xs-12 col-md-3"></div><div class="col-xs-12 col-md-9"><chart-builder-axis /></div></div><div class="row"><div class="col-xs-12 col-md-3"><chart-builder-options /></div><div class="col-xs-12 col-md-9"><chart-builder-visualization /></div></div></div>',
});

export const Primary = Template.bind({});
Primary.args = {};