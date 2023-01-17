import FilterEditorComponent from '../components/widgets/FilterEditor.vue';
import { action } from '@storybook/addon-actions';

const field1 = {
    label: 'Inform an Filter',
    name: 'attribute',
    required: true
};

const onUpdateFieldAction = action('onUpdateField');
const suggestions = ['id', 'age', 'name', 'gender', 'fair', 'incoming', 'destination', 'home town', 'siblings'];

const suggestionEvent = () => suggestions;
const lookupsMethod = () => [{'id': 1, name: 'Sales'}];

export default {
    title: 'Widgets/FilterEditor'
};

const Template = (args, { argTypes }) => ({
    components: { FilterEditorComponent },
    props: Object.keys(argTypes),
    mounted() {
        this.$root.$on('update-form-field-value', (field, value) => {
            this.currentValue = value;
        });
        this.currentValue = this.value;
    },
    data() {
        return {
            currentValue: null,
        };
    },
    destroy() {
        this.$root.$off('update-form-field-value');
    },
    methods: {
        onUpdateField(field, value) {
            onUpdateFieldAction(field, value);
        }
    },
    template: `<div><filter-editor-component :value="currentValue" :field="field"
        :suggestionEvent="suggestionEvent" :lookupsMethod="lookupsMethod"
        :read-only="readOnly" v-on:update-form-field-value="onUpdateField"/></div>`
});
export const WithValue = Template.bind({});
WithValue.args = {
    field: field1,
    readOnly: false,
    suggestionEvent,
    lookupsMethod,
    value: ''
};
export const Empty = Template.bind({});
Empty.args = {
    field: field1,
    readOnly: false,
    suggestionEvent,
    lookupsMethod,
    value: null
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    field: field1,
    readOnly: true,
    lookupsMethod,
    suggestionEvent,
    value: null
};
