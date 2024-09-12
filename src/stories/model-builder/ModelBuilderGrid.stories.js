import ModelBuilderGrid from '@/views/data-explorer/model-builder/ModelBuilderGrid.vue';
import { Operation } from '@/views/data-explorer/entities.js';

const attributes = [
    { name: 'name', type: 'CHARACTER', numeric: false },
    { name: 'age', type: 'INTEGER', numeric: true },
    { name: 'address', type: 'CHARACTER', numeric: false },
    { name: 'postcode', type: 'CHARACTER', numeric: false },
];

export default {
    title: 'ModelBuilder/Grid',
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
    components: { ModelBuilderGrid },
    methods: {
    },
    template:
        `<div>
        random_grid = {{args.random_grid}}
        max_iterations = {{args.max_iterations}}
        max_search_time = {{args.max_search_time}}
        parallelism = {{args.parallelism}}
        strategy = {{args.strategy}}
        seed = {{args.seed}}

        <model-builder-grid 
            :grid="args.grid"
            v-model:random_grid="args.random_grid"
            v-model:max_iterations="args.max_iterations"
            v-model:max_search_time="args.max_search_time"
            v-model:parallelism="args.parallelism"
            v-model:strategy="args.strategy"
            v-model:seed="args.seed"
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

        grid: {
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
                            name: 'strategy',
                            values: JSON.stringify([
                                { key: "grid", pt: "Grid" },
                                { key: "random", pt: "Random" },
                            ])
                        }
                    ]
                }]
            })
        },
        attributes: attributes
    }
};
