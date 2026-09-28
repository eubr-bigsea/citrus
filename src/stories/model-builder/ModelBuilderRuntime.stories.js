import ModelBuilderRuntime from '@/views/data-explorer/model-builder/ModelBuilderRuntime.vue';

export default {
    title: 'ModelBuilder/Runtime',
    argTypes: {
    },
};

const Template = (args) => ({
    data() {
        return {
            args,
        };
    },
    components: { ModelBuilderRuntime },
    methods: {
    },
    template:
        `<div>
        preferred_cluster_id = {{args.preferred_cluster_id}}

        <model-builder-runtime 
            :clusters="args.clusters"
            v-model:preferred_cluster_id="args.preferred_cluster_id"
         />
    </div>`,
});

export const Basic = {
    render: (args) => Template(args),
    args: {
        preferred_cluster_id: 1,
        clusters: [
            { id: 1, name: 'Default cluster' },
            { id: 2, name: 'Secondary cluster' },
            { id: 3, name: 'Test cluster' },
            { id: 4, name: 'Homolog cluster' },
        ]
    }
};
