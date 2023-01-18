
import Task from '../components/Task.vue';

const field1 = { label: 'Date', order: 1, name: 'attribute', required: true };


export default {
    title: 'Components/Task',
    component: Task,
    argTypes: {
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Task },
    mounted() {

    },
    // SCSS applies only if task is inside of an element with class 'lemonade'
    template: `<div class="lemonade"><task v-bind="$props" /></div>`,
});

const task = {
    id: '54545454-48787-4545454',
    name: 'Simple task',
    forms: {},
    operation: { id: 1, name: 'Test Operation', ports: [] },
    instance: { repaintEverything: () => { } }
};
const formWithComment = { comment: {value: 'Simple task for testing' }};

export const Simple = Template.bind({});
Simple.args = { task };

export const SimpleNoContextMenu = Template.bind({});
SimpleNoContextMenu.args = { task: { ...task, enableContextMenu: false } };

export const SimpleWithComments = Template.bind({});
SimpleWithComments.args = { task: { ...task, forms: formWithComment, name: 'Test title, hover it' } };
