
import JoinSelectComponent from '../components/widgets/JoinSelect';

const suggestions1 = ['id', 'name', 'state', 'field_with_long_name', 'c5'];

export default {
    title: 'Widgets/JoinSelect',
    component: JoinSelectComponent,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { JoinSelectComponent },
    mounted() {
        this.$root.$on('update-form-field-value', (field, value) => {
            console.debug(field, value);
        });
    },
    template: `<join-select-component v-bind="$props" />`,
});

export const Simple = Template.bind({});
Simple.args = {
    label: 'Please, select fields',
    value: '2010-12-12',
    suggestions: suggestions1,
};

export const WithValues = Template.bind({});
WithValues.args = {
    label: 'Please, select fields',
    suggestions: suggestions1,
    selected: [
        { attribute: 'id', alias: 'identifier', select: true },
        { attribute: 'name', alias: 'user_name', select: false },
        { attribute: 'state', alias: 'state', select: true },
    ]
};