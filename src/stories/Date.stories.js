
import DateComponent from '@/components/widgets/Date.vue';

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
    methdos: {
        handleUpdate(a, b, c, d){
            //console.debug(field, value);
            console.debug(a, b, c, d);
        }
    },
    template: `<date-component v-bind="$props" @update-form-field-value="handleUpdate"/>`,
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