import ModelBuilderFeatureSelection from '@/views/data-explorer/model-builder/ModelBuilderFeatureSelection.vue';
import { Operation } from '@/views/data-explorer/entities.js';


const attributes = [
    { name: 'name', type: 'CHARACTER', numeric: false },
    { name: 'age', type: 'INTEGER', numeric: true },
    { name: 'address', type: 'CHARACTER', numeric: false },
    { name: 'postcode', type: 'CHARACTER', numeric: false },
];

export default {
    title: 'ModelBuilder/FeatureSelection',
    argTypes: {
        supervisioned: { control: 'boolean' },
    },
};

const Template = (args) => ({
    data() {
        return {
            args,
        };
    },
    components: { ModelBuilderFeatureSelection },
    methods: {
    },
    template:
        `<div>
            {{args.features.forms.features.value}}  
        <model-builder-feature-selection 
            :features="args.features.forms.features.value"
            :attributes="args.attributes"
            :supervisioned="args.supervisioned"
            
         />
    </div>`,
});

export const Supervisioned = {
    render: (args) => Template(args),
    args: {
        attributes,
        supervisioned: true,
        features: {
            forms: {
                features: {
                    value: [{name: 'postcode'}],
                    valuex: [
                        {
                            "name": "name", "type": "CHARACTER", "numeric": false, "usage": "feature", "enable": false,
                            "quantis": 10, "binarize_trasholder": 0.5, "feature_type": "categorical",
                            "transform": "string_indexer", "missing_data": "constant"
                        },
                        {
                            "name": "age", "type": "INTEGER", "numeric": true, "usage": "label", "enable": false,
                            "quantis": 10, "binarize_trasholder": 0.5, "feature_type": "numerical", "transform": "keep",
                            "scale": "max_abs", "missing_data": "median"
                        },
                        {
                            "name": "address", "type": "CHARACTER", "numeric": false, "usage": "feature",
                            "enable": false, "quantis": 10, "binarize_trasholder": 0.5, "feature_type": "categorical",
                            "transform": "string_indexer"
                        }, 
                        {
                            "name": "postcode", "type": "CHARACTER", "numeric": false,
                            "usage": "feature", "enable": false, "quantis": 10, "binarize_trasholder": 0.5,
                            "feature_type": "categorical", "transform": "one_hot_encoder", "missing_data": "remove"
                        }
                    ],
                }
            }
        },
        featuresOp: {
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
                            name: 'method',
                            values: JSON.stringify([
                                { key: "disabled", pt: "No selection" },
                                { key: "pca", pt: "Principal Component Analysis - PCA" },
                            ])
                        }
                    ]
                }]
            })
        },
    }
};
