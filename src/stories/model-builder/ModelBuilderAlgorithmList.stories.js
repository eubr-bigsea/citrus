import ModelBuilderAlgorithmList from '@/views/data-explorer/model-builder/ModelBuilderAlgorithmList.vue';
import { Operation, Workflow } from '@/views/data-explorer/entities.js';


export default {
    title: 'ModelBuilder/AlgorithmsList',
    argTypes: {
        supervisioned: { control: 'boolean' },
    },
};

const operations = [
    new Operation({ id: 1, slug: 'data-reader' }),
    new Operation({ id: 2100, slug: 'sample' }),
    new Operation({
        "id": 2359,
        "forms": [
            {
                "name": "Execução",
                "enabled": true,
                "order": 0,
                "category": "execution",
                "fields": [
                    {
                        "name": "model_type",
                        "label": "Tipo de modelo",
                        "help": "Tipo de modelo",
                        "type": "TEXT",
                        "required": false,
                        "order": 1,
                        "suggested_widget": "dropdown",
                        "values": "[{\"en\": \"Multinomial (default)\", \"value\": \"Multinomial (default)\", \"key\": \"multinomial\", \"pt\": \"Multinomial (padr\\u00e3o)\"}, {\"en\": \"Bernoulli\", \"value\": \"Bernoulli\", \"key\": \"bernoulli\", \"pt\": \"Bernoulli\"}]",
                        "scope": "EXECUTION",
                        "editable": true
                    },
                    {
                        "name": "thresholds",
                        "label": "Limiares",
                        "help": "Limiar na classificação de várias classes para ajustar a probabilidade de prever cada classe. A lista deve ter comprimento igual ao número de classes.",
                        "type": "TEXT",
                        "required": false,
                        "order": 3,
                        "suggested_widget": "text",
                        "scope": "EXECUTION",
                        "editable": true
                    },
                    {
                        "name": "smoothing",
                        "label": "Suavização",
                        "help": "Parâmetro de suavização Laplace (0 para não suavização).",
                        "type": "FLOAT",
                        "required": false,
                        "order": 3,
                        "suggested_widget": "decimal",
                        "scope": "EXECUTION",
                        "editable": true
                    },
                    {
                        "name": "weight_attr",
                        "label": "Atributo com os pesos",
                        "help": "Atributo com os pesos",
                        "type": "TEXT",
                        "required": false,
                        "order": 5,
                        "suggested_widget": "attribute-selector",
                        "values": "{\"multiple\": false}",
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
        "name": "Classificador Naive Bayes",
        "slug": "naive-bayes"
    }),
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
];
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
            <div v-if="args.workflow.tasks" class="border p-3">
                <div v-for="t in args.workflow.tasks">
                    <h6>{{t.operation.slug}}</h6>
                    {{t.forms}}
                </div>
            </div>
            <div v-if="args.workflow.tasks.length > 0">
            </div> 
        <model-builder-algorithm-list
            :operations="algorithmOperations"
            v-model:tasks="args.workflow.tasks"
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
            tasks: [
                { id: '000', operation: { slug: 'naive-bayes' } },
                { id: '001', operation: { slug: 'non-existing' } }
            ],
            platform: { id: 1, slug: 'spark', name: 'Spark' },
        }),

    }
};
