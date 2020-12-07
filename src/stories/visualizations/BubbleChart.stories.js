
import BubbleChart from '../../components/visualization/BubbleChart';

const chart1 = {
    data: {
        x: [1, 2, 3, 4],
        y: [10, 18, 42, 3],
        sizes: [50, 60, 18, 20],
        color: ['rgb(93, 164, 214)',
            'rgb(255, 144, 14)',
            'rgb(44, 160, 101)',
            'rgb(255, 65, 54)']
    },
    title: 'Bubble chart test'
}
export default {
    title: 'Visualization/BubbleChart',
    component: BubbleChart,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { BubbleChart },
    template: `<div class="row"><div class="col-md-8 offset-md-2"><bubble-chart v-bind="$props" /></div></div>`,
});

export const SimpleBubbleChart = Template.bind({});
SimpleBubbleChart.args = {
    visualizationData: chart1,
};

