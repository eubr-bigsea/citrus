
import DateComponent from '../components/widgets/Date.vue';

const field1 = { label: 'Date', order: 1, name: 'attribute', required: true };


export default {
    title: 'Widgets/Date',
    component: DateComponent,
    argTypes: {
        field: field1,
        // backgroundColor: { control: 'color' },
        // size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { DateComponent },
    mounted() {
        this.$root.$on('update-form-field-value', (field, value) => {
            console.debug(field, value);
        });
    },
    template: `<date-component v-bind="$props" />`,
});

export const WithValue = Template.bind({});
WithValue.args = {
    field: field1,
    value: '2015-12-12',
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    field: field1,
    readOnly: true,
    value: '2020-10-12'
};