import ExpressionEditorComponent from '../components/widgets/ExpressionEditor';
import { action } from '@storybook/addon-actions';

const field1 = {
  label: 'Inform an expression',
  name: 'attribute',
  required: true
};

const onUpdateFieldAction = action('onUpdateField');

export default {
  title: 'Widgets/ExpressionEditor'
};

const Template = (args, { argTypes }) => ({
  components: { ExpressionEditorComponent },
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
    onUpdateField(field, value) {
      onUpdateFieldAction(field, value);
    }
  },
  template: `<div><expression-editor-component :value="currentValue" :field="field"
        :read-only="readOnly" v-on:update-form-field-value="onUpdateField"/></div>`
});
export const WithValue = Template.bind({});
WithValue.args = {
  field: field1,
  readOnly: false,
  value: [
    {
      alias: 'asc_str',
      expression: 'asc(col1)',
      error: null,
      tree: {
        type: 'CallExpression',
        arguments: [{ type: 'Literal', value: 'col1', raw: 'col1' }],
        callee: { type: 'Identifier', name: 'asc' }
      }
    }
  ]
};
export const Empty = Template.bind({});
Empty.args = {
    field: field1,
    readOnly: false,
    value: null
  };

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  field: field1,
  readOnly: true,
  value: [
    {
      alias: 'asc_str',
      expression: 'asc(col1)',
      error: null,
      tree: {
        type: 'CallExpression',
        arguments: [{ type: 'Literal', value: 'col1', raw: 'col1' }],
        callee: { type: 'Identifier', name: 'asc' }
      }
    }
  ]
};
