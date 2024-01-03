import TreeviewComponent from '../components/Tree.vue';
import { action } from '@storybook/addon-actions';
import functionsHelp from '../i18n/functions.js';
const treeData = {
    name: "My Tree 1", selected: false,
    children: [
        { name: "hello", selected: false },
        { name: "wat", selected: false },
        {
            name: "child folder", selected: false, opened: false,
            children: [
                {
                    name: "child folder", selected: false,
                    children: [{ name: "hello", selected: false }, { name: "wat", selected: false }]
                },
                { name: "hello", selected: false },
                { name: "wat", selected: false },
                {
                    name: "child folder", selected: false,
                    children: [{ name: "hello", selected: false }, { name: "wat", selected: false }]
                }
            ]
        }
    ]
};
const langFunctions = functionsHelp.en;
const functionsTree = {
    name: 'Functions',
    children: langFunctions.tree.functions.map((f) => {
        const children = f.children.map(ch => ({
            name: ch, data: langFunctions.functions[ch], opened: true
        }));
        return {name: f.name, opened: false, children};
    })
};

const onUpdateFieldAction = action('onUpdateField');

export default {
    title: 'Components/Treeview'
};
const Template = (args, { argTypes }) => ({
    components: { TreeviewComponent },
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
        selected(item) {
            console.debug(item);
            action("click")(item);
        },
        onUpdateField: onUpdateFieldAction
    },
    template: `<ul><treeview-component :tree="tree" :opened="true" v-on:selected="selected"/></ul>`,
});
export const WithValue = Template.bind({});
WithValue.args = {
    tree: treeData, //functionsHelp.pt._tree
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    tree: treeData,
};

export const Functions = Template.bind({});
Functions.args = {
    tree: functionsTree,
};
