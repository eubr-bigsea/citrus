import TreeviewComponent from '../components/TreeItem';
import { action } from '@storybook/addon-actions';

import functionsHelp from '../i18n/functions.js';

const treeData = {
    name: "My Tree",
    children: [
      { name: "hello" },
      { name: "wat"},
      {
        name: "child folder",  opened: true ,
        children: [
          {
            name: "child folder",
            children: [{ name: "hello" }, { name: "wat" }]
          },
          { name: "hello" },
          { name: "wat" },
          {
            name: "child folder",
            children: [{ name: "hello" }, { name: "wat" }]
          }
        ]
      }
    ]
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
    return { currentValue: null};
  },
  destroy() {
    this.$root.$off('update-form-field-value');
  },
  methods: {
    onUpdateField: onUpdateFieldAction
  },
  template: `<ul><treeview-component :item="item" :opened="true"/></ul>`
});
export const WithValue = Template.bind({});
WithValue.args = {
    item: functionsHelp.pt._tree
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
};
