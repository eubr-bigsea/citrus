import AttributeSelectorComponent from '../components/widgets/AttributeSelector2';
import { action } from '@storybook/addon-actions';
import "vue-select/dist/vue-select.css";

const field1 = {
    label: 'Select an attribute',
    name: 'attribute',
    required: true, 
    values: '{"multiple": false}'
};

const onUpdateFieldAction = action('onUpdateField');
const suggestions = ['id', 'age', 'name', 'gender', 'fair', 'incoming', 'destination', 'home town', 'siblings'];

const suggestionEvent = () => suggestions;

export default {
    title: 'Widgets/AttributeSelector'
};

const Template = (args, { argTypes }) => ({
    components: { AttributeSelectorComponent },
    props: Object.keys(argTypes),
    mounted() {
        this.$root.$on('update-form-field-value', (field, value) => {
            this.currentValue = value;
        });
        this.currentValue = this.value;
    },
    data() {
        return { currentValue: null };
    },
    destroy() {
        this.$root.$off('update-form-field-value');
    },
    methods: {
        onUpdateField: onUpdateFieldAction
    },
    template: `<div><attribute-selector-component :value="value" :field="field"
        :read-only="readOnly" :suggestionEvent="suggestionEvent" :multiple="multiple"
        v-on:update-form-field-value="onUpdateField" /></div>`
});
export const Single = Template.bind({});
Single.args = {
    field: field1,
    readOnly: false,
    value: ["age"],
    multiple: false,
    suggestionEvent,
};

export const Single2 = Template.bind({});
Single2.args = {
    field: field1,
    readOnly: false,
    value: "",
    multiple: false,
};
