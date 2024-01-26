import ModelBuilderFeatureReduction from '@/views/data-explorer/model-builder/ModelBuilderFeatureReduction.vue';
import { Operation } from '@/views/data-explorer/entities.js';

export default {
    title: 'ModelBuilder/FeatureReduction',
    argTypes: {
    },
};

const Template = (args) => ({
    data() {
        return {
            args,
        };
    },
    components: { ModelBuilderFeatureReduction },
    methods: {
    },
    template:
        `<div>
        method = {{args.method}}
        k = {{args.k}}

        <model-builder-feature-reduction 
            :reduction="args.reduction"
            
            v-model:method="args.method"
            v-model:k="args.k"
         />
    </div>`,
});

export const Basic = {
    render: (args) => Template(args),
    args: {
        random_grid: true,
        max_iterations: 123,
        max_search_time: 292,
        parallelism: 23,
        strategy: 'grid',
        seed: 56789,

        reduction: {
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
                                { key: "disabled", pt: "No reduction" },
                                { key: "pca", pt: "Principal Component Analysis - PCA" },
                            ])
                        }
                    ]
                }]
            })
        },
    }
};
