
import JoinComponent from '../components/widgets/Join';

const field = { label: 'Join', order: 1, name: 'attribute', required: true };
const suggestions1 = ['id', 'name', 'state', 'field_with_long_name', 'c5'];
const suggestions2 = ['id', 'age', 'name', 'gender', 'fair', 'incoming', 'destination', 'home town', 'siblings'];

const value = {
    conditions: [{ left: 'id', right: 'id' }, { left: 'name', right: 'name' }],
    leftSelect: [
        { attribute: 'id', alias: 'id1', select: true },
        { attribute: 'name', alias: 'user_name', select: false },
        { attribute: 'state', alias: 'state', select: true },
    ],
    rightSelect: [
        { attribute: 'id', alias: 'id2', select: true },
        { attribute: 'name', alias: 'full_user_name', select: false },
        { attribute: 'state', alias: 'state', select: true },
        { attribute: 'wrong', alias: 'does_not_exist', select: true },
    ]

};

export default {
    title: 'Widgets/Join',
    component: JoinComponent,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { JoinComponent },
    mounted() {
        this.$root.$on('update-form-field-value', (field, value) => {
            console.debug('=============');
            console.debug(JSON.stringify(field));
            console.debug(JSON.stringify(value));
            console.debug('=============');
        });
    },
    template: `<join-component v-bind="$props" />`,
});

export const Simple = Template.bind({});
const suggestions = {inputs: [
    {attributes: suggestions1},
    {attributes: suggestions2},
]};
Simple.args = {
    field,
    extendedSuggestionEvent: () => suggestions
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    field,
    extendedSuggestionEvent: () => suggestions,
    readOnly: true,
};


export const WithValuesOpened = Template.bind({});
WithValuesOpened.args = {
    extendedSuggestionEvent: () => suggestions,
    field,
    modalOpened: true,
    value,
};
export const WithValues = Template.bind({});
WithValues.args = {
    extendedSuggestionEvent: () => suggestions,
    field,
    value,
};