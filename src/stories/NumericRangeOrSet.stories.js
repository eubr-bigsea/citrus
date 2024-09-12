import NumericRangeOrSetComponent from '@/components/widgets/NumericRangeOrSet.vue';

const field1 = {
    label: 'Range or set', order: 1, name: 'attribute', required: true,
    suggested_widget: 'integer'
};


export default {
    title: 'Widgets/NumericOrRangeSet',
    component: NumericRangeOrSetComponent,
    argTypes: {
    },
};

const Template = (args) => ({
    data() {
        return { args, result: null };
    },
    components: { NumericRangeOrSetComponent },
    template: `
        <div>
            ||{{result}}||
            <numeric-range-or-set-component 
                v-bind="args"
                v-model="result" 
                />
        </div>`,
});

export const NumericRange = {
    render: (args) => Template(args),
    args: {
        field: field1,
        value: { "distribution": "log_uniform", "list": [1], "max": 100, "min": 1, "quantity": null, "type": "range" },
        readOnly: false,
    }
};
export const NumericSet = {
    render: (args) => Template(args),
    args: {
        field: field1,
        value: { "list": [ 2, 3, 4 ], "type": "list" },
    }
};
