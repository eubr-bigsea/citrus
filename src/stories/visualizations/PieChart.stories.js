
import PieChart from '../@/components/visualization/PieChart.vue';

const chart1 = {
    "title": "Pie Chart",
    "legend": {
        "isVisible": false,
        "text": "{{name}}"
    },
    "tooltip": {
        "title": ["{{name}}"],
        "body": ["<span class='metric'>{{x}}</span><span class='number'>{{y}}</span>"]
    },
    "x": {
        "title": null,
        "value": "sum",
        "color": "#222",
        "prefix": "@",
        "suffix": "#",
        "format": null
    },
    "data": [{
        "x": 9.0,
        "value": 9.0,
        "id": "cod_modalidade_0",
        "name": "cod_modalidade_0",
        "label": "cod_modalidade_0",
        "color": "#506FBB"
    }, {
        "x": 3.0,
        "value": 3.0,
        "id": "cod_modalidade_1",
        "name": "cod_modalidade_1",
        "label": "cod_modalidade_1",
        "color": "#3FA8AD"
    }],
    "pie_type": "pie"
};

export default {
    title: 'Visualization/PieChart',
    component: PieChart,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { PieChart },
    template: `<div class="row"><div class="col-md-4 offset-md-2" style="max-height: 600px"><pie-chart v-bind="$props" /></div></div>`,
});

export const PieChartExample = Template.bind({});
PieChartExample.args = {
    visualizationData: chart1,
};


export const DonutChart = Template.bind({});

const chart2 = JSON.parse(JSON.stringify(chart1));
chart2["pie_type"] = "donut";
DonutChart.args = {
    visualizationData: chart2,
};