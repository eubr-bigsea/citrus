
import LineChart from '../../components/visualization/LineChart.vue';

const chart1 = {
    "title": "Line chart 1",
    "legend": {
        "isVisible": true,
        "text": "{{name}}"
    },
    "tooltip": {
        "title": ["{{name}}"],
        "body": ["<span class='metric'>{{x}}</span><span class='number'>{{y}}</span>"]
    },
    "y": {
        "title": "Totals",
        "prefix": null,
        "suffix": null,
        "format": null
    },
    "x": {
        "title": "Dates",
        "type": "time",
        "prefix": null,
        "suffix": null,
        "inFormat": "%Y-%m-%dT%H:%M:%S",
        "outFormat": "%Y-%m-%d"
    },
    "data": [{
        "id": "Serie 1",
        "name": "Serie 1",
        "color": "#506FBB",
        "pointColor": "#506FBB",
        "pointShape": "diamond",
        "pointSize": 3,
        "values": [{
            "x": "2009-01-19T00:00:00",
            "y": 7
        }, {
            "x": "2010-12-01T00:00:00",
            "y": 9
        }, {
            "x": "2016-09-07T00:00:00",
            "y": 20
        }, {
            "x": "2008-11-19T00:00:00",
            "y": 10
        }, {
            "x": "2010-08-25T00:00:00",
            "y": 10
        }, {
            "x": "2014-09-07T00:00:00",
            "y": 8
        }, {
            "x": "2007-01-19T00:00:00",
            "y": 19
        }, {
            "x": "2010-02-25T00:00:00",
            "y": 11
        }, {
            "x": "2011-09-07T00:00:00",
            "y": 12
        }]
    }, {
        "id": "Serie 2",
        "name": "Serie 2",
        "color": "#3FA8AD",
        "pointColor": "#3FA8AD",
        "pointShape": "point",
        "pointSize": 3,
        "values": [{
            "x": "2009-01-19T00:00:00",
            "y": 22
        }, {
            "x": "2010-02-25T00:00:00",
            "y": 13
        }, {
            "x": "2014-09-07T00:00:00",
            "y": 15
        }, {
            "x": "2008-01-19T00:00:00",
            "y": 18
        }, {
            "x": "2010-08-25T00:00:00",
            "y": 20
        }, {
            "x": "2016-09-07T00:00:00",
            "y": 5
        }, {
            "x": "2007-01-19T00:00:00",
            "y": 15
        }, {
            "x": "2010-12-25T00:00:00",
            "y": 15
        }, {
            "x": "2011-09-07T00:00:00",
            "y": 12
        }]
    }, {
        "id": "Serie 3",
        "name": "Serie 3",
        "color": "#71AD3F",
        "pointColor": "#71AD3F",
        "pointShape": "circle",
        "pointSize": 3,
        "values": [{
            "x": "2009-01-19T00:00:00",
            "y": 7
        }, {
            "x": "2013-12-25T00:00:00",
            "y": 3
        }, {
            "x": "2014-09-07T00:00:00",
            "y": 4
        }, {
            "x": "2008-01-19T00:00:00",
            "y": 1
        }, {
            "x": "2010-12-25T00:00:00",
            "y": 5
        }, {
            "x": "2016-09-07T00:00:00",
            "y": 7
        }, {
            "x": "2007-01-19T00:00:00",
            "y": 7
        }, {
            "x": "2015-12-25T00:00:00",
            "y": 10
        }, {
            "x": "2011-09-07T00:00:00",
            "y": 3
        }]
    }],
    "using_date": true
};

const chart2 = {
    "title": "Line chart 2",
    "legend": {
        "isVisible": false,
        "text": "{{name}}"
    },
    "tooltip": {
        "title": ["{{name}}"],
        "body": ["<span class='metric'>{{x}}</span><span class='number'>{{y}}</span>"]
    },
    "y": {
        "title": "Totals",
        "prefix": '[',
        "suffix": ']',
        "format": '%'
    },
    "x": {
        "title": "Values",
        "type": "number",
        "prefix": '{',
        "suffix": '}'
    },
    "data": [{
        "id": "Serie 1",
        "name": "Serie 1",
        "color": "red",
        "pointColor": "#3D9970",
        "pointShape": "diamond",
        "pointSize": 3,
        "values": [...Array(50).keys()].map((x) => ({
            x, y: Math.random() * 20
        }))
    },
    {
        "id": "Serie 2",
        "name": "Serie 2",
        "color": "green",
        "pointColor": "#FF4136",
        "pointShape": "point",
        "pointSize": 3,
        "values": [...Array(50).keys()].map((x) => ({
            x, y: Math.random() * 10
        }))
    }],
    "using_date": false
};

export default {
    title: 'Visualization/LineChart',
    component: LineChart,
    argTypes: {
        mode: { control: { type: 'select', options: ['markers', 'lines', 'lines+markers'] } },
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { LineChart },
    template: `<div class="row"><div class="col-md-8 offset-md-2"><line-chart v-bind="$props" /></div></div>`,
});

export const LineWithMultipleTemporalSeries = Template.bind({});
LineWithMultipleTemporalSeries.args = {
    visualizationData: chart1,
    height: 500
};

export const LineUsingNumbers = Template.bind({});
LineUsingNumbers.args = {
    visualizationData: chart2,
    height: 500
};

const chart3 = JSON.parse(JSON.stringify(chart2));
chart3['mode'] = 'markers';
export const LineModeMarkers = Template.bind({});
LineModeMarkers.args = {
    visualizationData: chart3,
    height: 500
};

const chart4 = JSON.parse(JSON.stringify(chart2));
chart4['mode'] = 'lines+markers';
export const LineModeLineAndMarkers = Template.bind({});
LineModeLineAndMarkers.args = {
    visualizationData: chart4,
    height: 500
};
