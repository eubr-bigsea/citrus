import ModelBuilderTrainTest from '@/views/data-explorer/model-builder/ModelBuilderTrainTest.vue';
import { Operation } from '@/views/data-explorer/entities.js';

const attributes = [
    { name: 'name', type: 'CHARACTER', numeric: false },
    { name: 'age', type: 'INTEGER', numeric: true },
    { name: 'address', type: 'CHARACTER', numeric: false },
    { name: 'postcode', type: 'CHARACTER', numeric: false },
];

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
            :split="args.split"
         />
    </div>`,
});

export const Basic = {
    render: (args) => Template(args),
    args: {
        strategy: 'split',
        ratio: 0.6,
        folds: 777,
        seed: 9872,
        split: {
            operation: new Operation({
                forms: [{
                    name: 'Execution',
                    type: 'Execution',
                    fields: [
                        {
                            name: 'strategy',
                            values: JSON.stringify([
                                {key: "split", pt: 'Dividir aleatoriamente entre treino e teste'},
                                {key: "cross_validation", pt: 'Realizar a validação cruzada'},
                            ])
                        }
                    ]
                }]
            })
        },
        attributes: attributes
    }
};
