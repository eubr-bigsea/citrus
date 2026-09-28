
import BarChart from '@/components/visualization/BarChart.vue';

const chart1 = {
    "orientation": "v",
    "title": "Test Bar chart",
    "y": {
        "prefix": "* ",
        "format": null,
        "suffix": " #",
        "equal": true,
        "title": "Y Axis"
    },
    "x": {
        "outFormat": null,
        "suffix": " ]",
        "title": "X Axis",
        "inFormat": null,
        "prefix": "[ ",
        "type": "string"
    },
    "data": [{
        "values": [{
            "y": "21.17919641949",
            "x": "avg_fare",
            "name": "avg_fare"
        }, {
            "y": "73.5",
            "x": "max_fare",
            "name": "max_fare"
        },
        {
            "y": "4",
            "x": "min_fare",
            "name": "min_fare"
        }
        ],
        "name": "2nd"
    }, {
        "values": [{
            "y": "50.19",
            "x": "avg_fare",
            "name": "avg_fare"
        }, {
            "y": "93.5",
            "x": "max_fare",
            "name": "max_fare"
        },
        {
            "y": "3",
            "x": "min_fare",
            "name": "min_fare"
        }
        ],
        "name": "1st"
    },
    {
        "values": [{
            "y": "13.30288881186",
            "x": "avg_fare",
            "name": "avg_fare"
        }, {
            "y": "69.5500031",
            "x": "max_fare",
            "name": "max_fare"
        }, {
            "y": "3",
            "x": "min_fare",
            "name": "min_fare"
        }],
        "name": "3rd"
    }
    ],
    "legend": {
        "text": "{{name}}",
        "isVisible": true
    },
    "tooltip": {
        "body": ["<span class='metric'>FIXME</span><span class='number'>{{name}}</span>"],
        "title": ["{ { name } } "]
    }
};


export default {
    title: 'Visualization/BarChart',
    component: BarChart,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { BarChart },
    template: `<div class="row"><div class="col-md-8 offset-md-2"><bar-chart v-bind="$props" /></div></div>`,
});

export const VerticalBarWithAllElements = Template.bind({});
VerticalBarWithAllElements.args = {
    visualizationData: chart1,
};

const horizontalChart1 = JSON.parse(JSON.stringify(chart1));
horizontalChart1['orientation'] = 'h';
horizontalChart1.data.forEach(d => {
    d.values.forEach(v => {
        let tmp = v['x'];
        // v['x'] = v['y'];
        v['name'] = v['y'];
        v['y'] = tmp;
    });
});
/*
const chart2 = {
    "orientation": "h",
    "title": "Test Bar chart",
    "y": {
        "prefix": "* ",
        "format": null,
        "suffix": " #",
        "equal": true,
        "title": "Y Axis"
    },
    "x": {
        "outFormat": null,
        "suffix": " ]",
        "title": "X Axis",
        "inFormat": null,
        "prefix": "[ ",
        "type": "string"
    },
    "data": [{
        "values": [{
            "y": "21.17919641949",
            "x": "avg_fare",
            "name": "avg_fare"
        }, {
            "y": "73.5",
            "x": "max_fare",
            "name": "max_fare"
        },
        {
            "y": "4",
            "x": "min_fare",
            "name": "min_fare"
        }
        ],
        "name": "2nd"
    }]
};
*/
export const HorizontalBarWithAllElements = Template.bind({});
HorizontalBarWithAllElements.args = {
    visualizationData: horizontalChart1,
};
