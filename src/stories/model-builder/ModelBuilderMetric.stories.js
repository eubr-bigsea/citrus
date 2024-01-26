import ModelBuilderTrainTest from '@/views/data-explorer/model-builder/ModelBuilderTrainTest.vue';
import { Operation } from '@/views/data-explorer/entities.js';


export default {
    title: 'ModelBuilder/TrainTest',
    argTypes: {
        attributes: [{ name: 'name' }, { name: 'age' }]
    },
};

const Template = (args) => ({
    data() {
        return {
            args,
        };
    },
    components: { ModelBuilderTrainTest },
    methods: {
    },
    template:
        `<div>
            strategy = {{args.strategy}}
            ratio = {{args.ratio}}
            folds = {{args.folds}}
            seed = {{args.seed}}
        <model-builder-train-test 
            :grid="args.grid"
            v-model:strategy="args.strategy"
            v-model:ratio="args.ratio"
            v-model:folds="args.folds"
            v-model:seed="args.seed"
            :evaluate="args.evaluate"
        
         />
    </div>`,
});

export const Regression = {
    render: (args) => Template(args),
    args: {
        task_type: 'regression',
        bin_metric: '',
        multi_metric: '',
        reg_metric: 'rmse',
        clust_metric: '',
        evaluate: {
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
                            name: 'reg_metric',
                            values: JSON.stringify([
                                { key: "grid", pt: "Grid" },
                                { key: "random", pt: "Random" },
                            ])
                        }
                    ]
                }]
            })
        },

    }
};
