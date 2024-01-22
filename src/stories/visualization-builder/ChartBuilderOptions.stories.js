import ChartBuilderOptions from '@/components/chart-builder/ChartBuilderOptions.vue';

const field1 = {
    "display_legend": false,
    "label": "Text",
    "order": 1,
    "name": "attribute",
    "required": true,
    "title": {value: "testando"},
    "display_legend": {
        "value": "HIDE"
    },
    "color_scale": {
        "value": null
    },
    "hole": {
        "value": null
    },
    "text_info": {
        "value": null
    },
    "text_position": {
        "value": null
    },
    "left_margin": {
        "value": null
    },
    "right_margin": {
        "value": null
    },
    "top_margin": {
        "value": null
    },
    "bottom_margin": {
        "value": null
    },
    "auto_margin": {
        "value": null
    },
    "subgraph": {
        "value": null
    },
    "animation": {
        "value": null
    },
    "limit": {
        "value": null
    },
    "type": {
        "value": null
    },
    "template": {
        "value": null
    },
    "palette": {
        "value": null
    },
    "fill_opacity": {
        "value": null
    },
    "number_format": {
        "value": null
    },
    "height": {
        "value": null
    },
    "filter": {
        "value": null
    },
    "animation": {
        "value": null
    },
    "opacity": {
        "value": null
    },
    "smoothing": {
        "value": null
    },
    "width": {
        "value": null
    },
};


export default {
    title: 'VisBuilder/Options',
    component: ChartBuilderOptions,
    argTypes: {
        options: { type: Object, required: true },
        readOnly: false,
        value: '',
        attributes: ['name', 'age']
    },
};

const Template = (args) => ({
    data() {
        return { args, valor: '', rotulo: '' };
    },
    components: { ChartBuilderOptions },
    methods: {
        handleUpdate(field, value) {
            this.valor = value;
        }
    },
    template: 
    `<div>
        <chart-builder-options 
            v-model="args.options" :attributes="args.attributes" v-model:title="args.options.title.value"/>
    </div>`,
});

export const WithValue = {
    render: (args) => Template(args),
    args: {
        options: field1,
        value: 'Text number 1',
        readOnly: false,
        attributes: ['name', 'age']
    }
};
/*
export const ReadOnly = {
    render: (args) => Template(args),
    args: {
        options: field1,
        value: 'Apenas leitura',
        readOnly: true,
    }
};

*/