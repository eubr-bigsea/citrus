<template>
    <div class="row">
        <div class="col-md-6 xoffset-md-4">
            <div v-for="(field, index2) in form.fields" class="mb-2 property" v-bind:key="index2">
                <component v-if="['percentage', 'tag', 'expression', 'attribute-function', 'attribute-selector', 'select2', 'checkbox', 'decimal', 'range', 'integer', 'lookup', 'dropdown', 'text' , 'color', 'textarea', 'code'].includes(field.suggested_widget)"
                    :is="field.suggested_widget + '-component'" :field="field" :value="getValue(field.name)" language="language"
                    context="context" message="update-workflow-form-field-value">
                </component>
                <span v-else>
                    {{field.name}} {{field.suggested_widget}}
                </span>
            </div>
        </div>
    </div>
</template>
<script>
    import AttributeFunctionComponent from './widgets/AttributeFunction.vue'
    import AttributeSelectorComponent from './widgets/AttributeSelector.vue'
    import CheckboxComponent from './widgets/Checkbox.vue'
    import CodeComponent from './widgets/Code.vue'
    import ColorComponent from './widgets/Color.vue'
    import DecimalComponent from './widgets/Decimal.vue'
    import DropDownComponent from './widgets/DropDown.vue'
    import ExpressionComponent from './widgets/ExpressionEditor.vue'
    import IntegerComponent from './widgets/Integer.vue'
    import LookupComponent from './widgets/Lookup.vue'
    import PercentageComponent from './widgets/Range.vue'
    import RangeComponent from './widgets/Range.vue'
    import Select2Component from './widgets/Select2.vue'
    import SwitchComponent from './widgets/Switch.vue'
    import TagComponent from './widgets/Select2.vue'
    import TextComponent from './widgets/Text.vue'
    import TextAreaComponent from './widgets/TextArea.vue'

    export default {
        components: {
            'attribute-function-component': AttributeFunctionComponent,
            'attribute-selector-component': AttributeSelectorComponent,
            'checkbox-component': CheckboxComponent,
            'code-component': CodeComponent,
            'color-component': ColorComponent,
            'decimal-component': DecimalComponent,
            'dropdown-component': DropDownComponent,
            'expression-component': ExpressionComponent,
            'integer-component': IntegerComponent,
            'lookup-component': LookupComponent,
            'percentage-component': RangeComponent,
            'range-component': RangeComponent,
            'select2-component': Select2Component,
            'tag-component': TagComponent,
            'text-component': TextComponent,
            'textarea-component': TextAreaComponent
        },
        props: {
            form: { type: Object, default: {} },
            workflow: { type: Object, default: {} },
            loaded: false,
        },
        methods: {
            getValue(name) {
                return this.workflow
                    && this.workflow.forms
                    && this.workflow.forms[name]
                    ? this.workflow.forms[name].value : null;
            },
        },
        mounted(){
        }
    }
</script>
<style>
    .property {
        overflow: auto;
    }
</style>