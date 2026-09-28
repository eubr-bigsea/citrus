
import MaskComponent from '@/components/widgets/Mask.vue';
const field1 = { label: 'CPF or CNPJ', order: 1, name: 'attribute', required: true };

export default {
    title: 'Widgets/Mask',
    component: MaskComponent,
    argTypes: {
        // backgroundColor: { control: 'color' },
        // size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MaskComponent },
    template: `<mask-component v-bind="$props"/>`,
});

export const Primary = Template.bind({});
Primary.args = {
    field: field1,
    mask: ['###.###.###-##', '##.###.###/####-##'],
    value: '31.986.964/0001-84',
};
