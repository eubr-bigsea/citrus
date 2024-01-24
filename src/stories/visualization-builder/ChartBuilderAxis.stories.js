import ChartBuilderAxis from '@/components/chart-builder/ChartBuilderAxis.vue';

const attributes = [
    { name: 'name', type: 'CHARACTER', numeric: false },
    { name: 'age', type: 'INTEGER', numeric: true },
    { name: 'address', type: 'CHARACTER', numeric: false },
    { name: 'postcode', type: 'CHARACTER', numeric: false },
]
const field1 = {
    "type": { value: 'line' },
    x_axis: {
        label: 'X',
        lowerBound: '1',
        upperBound: '10',
        logScale: false,
        display: false,
        displayLabel: false,
        prefix: 'prefix',
        suffix: 'suffix',
    },
    y_axis: {
        label: 'Y',
        lowerBound: '1',
        upperBound: '10',
        logScale: '',
        display: '',
        displayLabel: '',
        prefix: '',
        suffix: '',
    },
    x: [{
        "attribute": 'name', "binning": null, "displayLabel": "First value",
        "sorting": "Y_ASC", "max_displayed": 6,
        "group_others": true, "label_others": "Others", "prefix": "x",
        "suffix": "x"
    }],
    y: [],
};


export default {
    title: 'VisBuilder/Axis',
    component: ChartBuilderAxis,
    argTypes: {
        options: { type: Object, required: true },
        readOnly: false,
        value: '',
        attributes: [{name:'name'}, {name:'age'}]
    },
};

const Template = (args) => ({
    data() {
        return { args, valor: '', rotulo: '' };
    },
    components: { ChartBuilderAxis },
    methods: {
        handleUpdate(field, value) {
            this.valor = value;
        }
    },
    template:
        `<div>x:
        <small><span class="px-1 border me-1 mb-1" v-for="opt,k in args.x_axis">{{k}} == {{opt}}</span></small>
        <br/>y: 
        <small><span class="px-1 border me-1 mb-1" v-for="opt,k in args.y_axis">{{k}} == {{opt}}</span></small>
        <p>
        [x={{args.x}}]
        <br/>
        [y={{args.y}}]
        </p>
        <br/>Geo: {{args.geo}}
        <chart-builder-axis :attributes="args.attributes" 
            :workflow="{}" :value="{x: {value: []}, y: {value: []}}"
            v-model:type="args.type"
            
            v-model:x="args.x"
            v-model:y="args.y"

            v-model:xLabel="args.x_axis.label"
            v-model:xLowerBound="args.x_axis.lowerBound"
            v-model:xUpperBound="args.x_axis.upperBound"
            v-model:xLogScale="args.x_axis.logScale"
            v-model:xDisplay="args.x_axis.display"
            v-model:xDisplayLabel="args.x_axis.displayLabel"
            v-model:xPrefix="args.x_axis.prefix"
            v-model:xSuffix="args.x_axis.suffix"

            v-model:yLabel="args.y_axis.label"
            v-model:yLowerBound="args.y_axis.lowerBound"
            v-model:yUpperBound="args.y_axis.upperBound"
            v-model:yLogScale="args.y_axis.logScale"
            v-model:yDisplay="args.y_axis.display"
            v-model:yDisplayLabel="args.y_axis.displayLabel"
            v-model:yPrefix="args.y_axis.prefix"
            v-model:ySuffix="args.y_axis.suffix"
            
            v-model:latitude="args.geo.latitude"
            v-model:longitude="args.geo.longitude"
            v-model:colorAttribute="args.geo.color_attribute"
            v-model:sizeAttribute="args.geo.size_attribute"
            v-model:textAttribute="args.geo.text_attribute"

            />
    </div>`,
});

export const WithAxis = {
    render: (args) => Template(args),
    args: {
        x_axis: field1.x_axis,
        y_axis: field1.y_axis,
        x: field1.x,
        y: field1.y,
        type: 'line',
        geo: {},
        attributes: attributes
    }
};
export const BarChart = {
    render: (args) => Template(args),
    args: {
        x_axis: field1.x_axis,
        y_axis: field1.y_axis,
        x: field1.x,
        y: field1.y,
        type: 'bar',
        geo: {},
        attributes: attributes
    }
};
export const PieChart = {
    render: (args) => Template(args),
    args: {
        x_axis: field1.x_axis,
        y_axis: field1.y_axis,
        x: field1.x,
        y: field1.y,
        type: 'pie',
        
        geo: {},
        attributes: attributes
    }
};
export const MapChart = {
    render: (args) => Template(args),
    args: {
        x_axis: field1.x_axis,
        y_axis: field1.y_axis,
        x: field1.x,
        y: field1.y,
        type: 'scattermapbox',

        attributes: [
            {name: 'latitude', type: 'FLOAT'}, 
            {name: 'longitude', type: 'FLOAT'}, 
            {name: 'message', type: 'CHARACTER'}, 
            {name: 'value', type: 'FLOAT'}, 
            {name: 'color', type: 'CHARACTER'}
        ],

        geo: {
            latitude: 'latitude',
            longitude: 'longitude',
            color_attribute: 'color',
            size_attribute: 'value',
            text_attribute: 'message',
        }
    }
};
export const LineChart = {
    render: (args) => Template(args),
    args: {
        x_axis: field1.x_axis,
        y_axis: field1.y_axis,
        x: field1.x,
        geo: {}, 
        y: [
            {
                "attribute": "name", "aggregation": "MIN", "compute": null,
                "displayOn": "left", "multiplier": null, "decimal_places": 2,
                "prefix": null, "suffix": null, "label": null, "strokeSize": 0,
                "stroke": null, "color": null, "marker": null, "enabled": true,
                "color": "#1945be", "custom_color": true
            },
            {
                "attribute": "age", "aggregation": "AVG", "compute": null,
                "displayOn": "left", "multiplier": null, "decimal_places": 2,
                "prefix": null, "suffix": null, "label": null, "strokeSize": 0,
                "stroke": null, "color": null, "marker": null, "enabled": false
            },
            {
                "attribute": "postcode", "aggregation": "MAX", "compute": null,
                "displayOn": "left", "multiplier": null, "decimal_places": 2,
                "prefix": null, "suffix": null, "label": null, "strokeSize": 2,
                "stroke": 'longdash', "color": null, "marker": null,
                "enabled": true, "line_color": "#eedd11"
            }
        ],
        type: 'line',

        attributes: attributes
    }
};
/*
export const ReadOnly = {
    render: (args) => Template(args),
    args: {
        options: field1,
        value: 'Apenas leitura',
        readOnly: true,
    }
};

*/