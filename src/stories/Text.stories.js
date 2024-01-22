import TextComponent from '@/components/widgets/TextComponent.vue';

const field1 = { label: 'Text', order: 1, name: 'attribute', required: true };


export default {
    title: 'Widgets/Text',
    component: TextComponent,
    argTypes: {
        field: {type: Object, required: true},
        readOnly: false,
        value: ''
    },
};

const Template = (args) => ({
    data() {
        return { args, valor: '', rotulo: '' };
    },
    components: { TextComponent },
    methods: {
        handleUpdate(field, value) {
            this.valor = value;
        }
    },
    template: `<div>|Valor: {{valor}}|rotulo: {{rotulo}}|<text-component v-bind="args"  v-model="valor" v-model:label="rotulo" @update-form-field-value="handleUpdate"/></div>`,
});

export const WithValue = {
    render: (args) => Template(args),
    args: {
        field: field1,
        value: 'Text number 1',
        readOnly: false,
    }
};
export const ReadOnly = {
    render: (args) => Template(args),
    args: {
        field: field1,
        value: 'Apenas leitura',
        readOnly: true,
    }
};

/*

export const WithValue = Template.bind({});
WithValue.args = {
    field: field1,
    value: 'Text number 1',
    readOnly: false,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    field: field1,
    readOnly: true,
    value: 'Text number 2'
};
*/