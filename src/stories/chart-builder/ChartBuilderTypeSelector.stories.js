import ChartBuilderTypeSelector from '../../components/chart-builder/ChartBuilderTypeSelector.vue';

export default {
    title: 'Chart Builder/Type Selector',
    components: {
        ChartBuilderTypeSelector
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChartBuilderTypeSelector },
    template: '<chart-builder-type-selector />',
});

export const Primary = Template.bind({});
Primary.args = {};