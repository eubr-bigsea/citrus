import AutocompleteComponent from '../components/widgets/ExpressionEditor.vue';
import { action } from '@storybook/addon-actions';

const field1 = {
    label: 'Inform an expression',
    name: 'attribute',
    required: true
};

const onUpdateFieldAction = action('onUpdateField');

export default {
    title: 'Widgets/Autocomplete'
};

const Template = (args, { argTypes }) => ({
    components: { AutocompleteComponent },
    props: Object.keys(argTypes),
    mounted() {
        this.$root.$on('update-form-field-value', (field, value) => {
            this.currentValue = value;
        });
        this.currentValue = this.value;
    },
    data() {
        return { currentValue: null};
    },
    destroy() {
        this.$root.$off('update-form-field-value');
    },
    methods: {
        onUpdateField: onUpdateFieldAction
    },
    template: `<div><autocomplete-component :value="currentValue" :field="field"
        :read-only="readOnly" v-on:update-form-field-value="onUpdateField"/></div>`
});
export const WithValue = Template.bind({});
WithValue.args = {
    field: field1,
    readOnly: false,
    value: "Test"
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    field: field1,
    readOnly: true,
    value: ""
};
