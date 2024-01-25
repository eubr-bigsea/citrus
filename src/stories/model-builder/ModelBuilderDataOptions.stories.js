import DesignData from '@/views/data-explorer/model-builder/DesignData.vue';
import { Operation, Form } from '@/views/data-explorer/entities.js';

const attributes = [
    { name: 'name', type: 'CHARACTER', numeric: false },
    { name: 'age', type: 'INTEGER', numeric: true },
    { name: 'address', type: 'CHARACTER', numeric: false },
    { name: 'postcode', type: 'CHARACTER', numeric: false },
];
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
    title: 'ModelBuilder/Data',
    component: DesignData,
    argTypes: {
        options: { type: Object, required: true },
        readOnly: false,
        value: '',
        attributes: [{ name: 'name' }, { name: 'age' }]
    },
};

const Template = (args) => ({
    data() {
        return {
            args,
            dataSourceList: []
        };
    },
    components: { DesignData },
    methods: {
        searchDataSource(f) {
            this.dataSourceList = [
                { id: 4, name: 'Titanic' },
                { id: 5, name: 'Iris' },
            ];
        }
    },
    template:
        `<div>
            dataSource = {{args.dataSource}}
            type = {{args.type}}
            value = {{args.value}}
            fraction = {{args.fraction}}
            seed = {{args.seed}}
        <design-data 
            :attributes="args.attributes" 
            :operation="args.operation"
            :sample="args.sample"
            :data-source-list="dataSourceList"
            v-model:dataSource="args.dataSource"
            v-model:type="args.type"
            v-model:value="args.value"
            v-model:fraction="args.fraction"
            v-model:seed="args.seed"
            @search-data-source="searchDataSource"
         />
    </div>`,
});

export const Basic = {
    render: (args) => Template(args),
    args: {
        dataSource: 4,
        type: '1',
        value: 100,
        fraction: 0.1,
        seed: 1234,
        operation: { operation: {} },
        sample: {
            forms: {
                type: { value: null },
                value: { value: null },
                fraction: { value: null },
                seed: { value: null },
            },
            operation: new Operation({
                forms: [{
                    name: 'Execution',
                    type: 'Execution',
                    fields: [
                        {
                            name: 'type',
                            values: JSON.stringify([
                                { key: "1", pt: "Sample1" },
                                { key: "2", pt: "Sample2" },
                            ])
                        }
                    ]
                }]
            })
        },
        attributes: attributes
    }
};
