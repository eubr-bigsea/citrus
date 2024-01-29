import ModelBuilderAlgorithmList from '@/views/data-explorer/model-builder/ModelBuilderAlgorithmList.vue';
import { Operation, Workflow } from '@/views/data-explorer/entities.js';


export default {
    title: 'ModelBuilder/Algorithms',
    argTypes: {
        supervisioned: { control: 'boolean' },
    },
};

const operations = [
    new Operation({ id: 1, slug: 'data-reader' }),
    new Operation({ id: 2100, slug: 'sample' }),
    new Operation({
        "id": 2357,
        "forms": [
            {
                "name": "Execução",
                "category": "execution",
                "fields": [
                    {
                        "name": "cache_node_ids",
                        "label": "Manter identificadores dos nós em cache",
                        "help": "Manter identificadores dos nós em cache",
                        "type": "INTEGER",
                        "required": false,
                        "order": 1,
                        "default": "1",
                        "suggested_widget": "checkbox",
                        "scope": "EXECUTION",
                        "editable": true
                    },
                    {
                        "name": "check_point_interval",
                        "label": "Intervalo para checkpoint (cache)",
                        "help": "Intervalo para checkpoint (cache)",
                        "type": "INTEGER",
                        "required": false,
                        "order": 2,
                        "suggested_widget": "integer",
                        "scope": "EXECUTION",
                        "editable": true
                    },
                    {
                        "name": "impurity",
                        "label": "Impureza",
                        "help": "Impureza",
                        "type": "TEXT",
                        "required": false,
                        "order": 2,
                        "suggested_widget": "dropdown",
                        "values": "[{\"en\": \"Entropy\", \"value\": \"Entropy\", \"key\": \"entropy\", \"pt\": \"Entropia\"}, {\"en\": \"Gini\", \"value\": \"Gini\", \"key\": \"gini\", \"pt\": \"Impureza Gini\"}]",
                        "scope": "EXECUTION",
                        "editable": true
                    },
                    {
                        "name": "max_bins",
                        "label": "No. máximo de bins",
                        "help": "No. máximo de bins",
                        "type": "INTEGER",
                        "required": false,
                        "order": 3,
                        "suggested_widget": "integer",
                        "scope": "EXECUTION",
                        "editable": true
                    },
                    {
                        "name": "max_depth",
                        "label": "Profundidade máxima",
                        "help": "Profundidade máxima",
                        "type": "INTEGER",
                        "required": false,
                        "order": 4,
                        "suggested_widget": "integer",
                        "scope": "EXECUTION",
                        "editable": true
                    },
                    {
                        "name": "min_info_gain",
                        "label": "Ganho mínimo de informação",
                        "help": "Ganho mínimo de informação",
                        "type": "FLOAT",
                        "required": false,
                        "order": 5,
                        "suggested_widget": "decimal",
                        "scope": "EXECUTION",
                        "editable": true
                    },
                    {
                        "name": "min_instances_per_node",
                        "label": "Mínimo de instâncias por nó",
                        "help": "Mínimo de instâncias por nó",
                        "type": "INTEGER",
                        "required": false,
                        "order": 6,
                        "default": "1",
                        "suggested_widget": "integer",
                        "scope": "EXECUTION",
                        "editable": true
                    }
                ]
            }
        ],
        "categories": [
            {
                "id": 2113,
                "name": "Construtor de modelos",
                "type": "model-builder",
                "order": 1,
                "default_order": 1
            },
            {
                "id": 4,
                "name": "Classification algorithm",
                "type": "algorithm",
                "subtype": "classification",
                "order": 0,
                "default_order": 0
            }
        ],
        "name": "Classificador Árvore de Decisão",
        "slug": "decision-tree-classifier"
    }),
]
const operationMap = new Map(operations.map((op) => [op.id, op]));

const Template = (args) => ({
    data() {
        return {
            args,
        };
    },
    components: { ModelBuilderAlgorithmList },
    methods: {
    },
    computed: {
        algorithmOperations() {
            return this.args.operations.filter(op => 
                op.categories && op.categories.find(cat => cat.type === 'model-builder')
            );
        }
    },
    template:
        `<div>
            <div v-if="args.workflow.tasks.length > 0">
            </div> 
        <model-builder-algorithm-list
            :operations="args.operations"
            :algorithmOperations="algorithmOperations"
            :operationMap="args.operationMap"
            :workflow="args.workflow"
            :grid-strategy="args.gridStrategy"
         />
    </div>`,
});

export const Classification = {
    render: (args) => Template(args),
    args: {
        supervisioned: true,
        operations,
        operationMap,
        gridStrategy: 'grid',
        workflow: new Workflow({
            tasks: [], platform: { id: 1, slug: 'spark', name: 'Spark' },
        }),

    }
};
