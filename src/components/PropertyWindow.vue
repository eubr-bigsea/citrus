<template>
    <div class="properties">
        <VuePerfectScrollbar ref="scrollBar" useBothWheelAxes="true">
            <div class="props card text-dark bg-light p0 mb-1">
                <div class="border-bottom card-header special">
                    <strong>{{task.operation.name}}</strong>
                    <br/>
                    <small>
                        {{task.id}}
                        <br/>
                        <em>{{task.operation.description}}</em>
                    </small>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <label>{{$t('property.taskName')}}</label>
                            <input type="text" maxlength="50" v-model="task.name" class="form-control" />
                        </div>
                        <div class="col-md-3">
                            <label type="checkbox">
                                <SwitchComponent v-model="task.enabled" :checked="task.enabled">{{$t('common.enabled')}}</SwitchComponent>
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <form>
                        <b-card no-body>
                            <b-tabs card v-model="tabIndex">
                                <b-tab v-for="(form, index) in forms" v-bind:key="form.id" :active="index === 0" :title="form.name">
                                    <div v-for="field in form.fields" class="mb-2" v-bind:key="task.id + field.name">
                                        <keep-alive>
                                            <component v-if="['expression', 'attribute-function', 'attribute-selector', 'select2', 'checkbox', 'decimal', 'range', 'integer', 'lookup', 'dropdown', 'text' , 'color', 'textarea', 'code'].includes(field.suggested_widget)"
                                                :is="field.suggested_widget + '-component'" :field="field" :value="getValue(field.name)"
                                                :suggestions="suggestions"
                                                language="language" context="context">
                                            </component>
                                            <span v-else>
                                                {{field.name}} {{field.suggested_widget}}
                                            </span>
                                        </keep-alive>
                                    </div>
                                </b-tab>
                            </b-tabs>
                        </b-card>
                        <!--
                        <div class="card text-dark bg-light p0 mb-1" v-for="form in forms" v-bind:key="form.id">
                            <div class="card-header">{{form.name}}</div>
                            <div v-if="!form.fields.length">
                                No parameters to configure.
                            </div>
                            <div class="card-body">
                                <div v-for="field in form.fields" class="mb-2" v-bind:key="field.name">
                                    <component v-if="['checkbox', 'decimal', 'range', 'integer', 'lookup', 'dropdown', 'text' , 'color', 'textarea', 'code'].includes(field.suggested_widget)"
                                        :is="field.suggested_widget + '-component'" :field="field" :value="getValue(field.name)"
                                        language="language" context="context"></component>
                                    <span v-else>{{field.name}} {{field.suggested_widget}} {{['checkbox', 'color', 'textarea', 'code'].includes(field.suggested_widget)}}
                                    </span>
                                    <keep-alive>
                                    </keep-alive>
                                </div>
                            </div>
                        </div>
                        -->
                    </form>
                </div>
                <div v-for="form in task.operation.forms" v-bind:key="form.id">
                    {{form.ca}}
                    <fieldset>
                        <caption>{{form.label}}</caption>
                    </fieldset>
                </div>
            </div>
        </VuePerfectScrollbar>
    </div>
</template>
<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    // import {
    //     // CodeComponent,
    //     CheckboxComponent,
    //     // TextComponent,
    //     // TextAreaComponent
    // } from './Widget.vue'
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
    import RangeComponent from './widgets/Range.vue'
    import Select2Component from './widgets/Select2.vue'
    import SwitchComponent from './widgets/Switch.vue'
    import TextComponent from './widgets/Text.vue'
    import TextAreaComponent from './widgets/TextArea.vue'

    export default {
        name: 'PropertyWindow',
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
            'range-component': RangeComponent,
            'text-component': TextComponent,
            'textarea-component': TextAreaComponent,
            SwitchComponent,
            // 'code-component': CodeComponent,

            // 'color-component': CodeComponent,
            // 'textarea-component': TextAreaComponent,

            // ColorComponent,
            // PropertyDescriptionComponent,
            // DecimalComponent,
            // IntegerComponent,
            // DropDownComponent,
            // TextComponent,
            // RangeComponent,
            // IndeterminatedCheckboxComponent,
            // LookupComponent,
            // AttributeSelectorComponent,
            // PercentageComponent,
            // SortSelectorComponent,
            // ExpressionComponent,
            // AttributeFunctionComponent,
            // MultiSelectDropDownComponent,
            // Select2Component,
            // TagComponent,

            VuePerfectScrollbar,
            
        },
        data() {
            return {
                forms: [],
                filledForm: [],
                tabIndex: 0
            }
        },
        methods: {
            getValue(name) {
                return this.task
                    && this.task.forms
                    && this.task.forms[name]
                    ? this.task.forms[name].value : null;
            },
            update() {
                let self = this;
                let callback = () => {
                    self.filledForm = self.task.forms;
                    self.forms = self.task.operation.forms.sort((a, b) => {
                        return a.order - b.order;
                    });
                    // Reverse association between field and form. Used to retrieve category
                    self.forms.forEach((f, i) => {
                        f.fields.forEach((field, j) => {
                            field.category = f.category;
                        });
                    });
                };
                if (this.$refs.scrollBar) {
                    let container = this.$refs.scrollBar.$el //.querySelector('.ps-container');
                    container.scrollTop = 0;
                }
                this.tabIndex = 0;
                //if (!TahitiAttributeSuggester.processed) {
                if (false) {
                    self.updateAttributeSuggestion(callback);
                } else {
                    callback();
                }
            }
        },
        mounted() {
            this.update()
        },
        props: {
            task: { type: Object, default: {} },
            suggestions: { type: Array, default: [] }
        },
        watch: {
            task() {
                this.update()
            }
        }
    }
</script>
<style scoped>
    .props {
        width: 350px;
        height: calc(79vh + 2px);
    }

    .properties {
        background: #fff;
        border: 1px solid #aaa;
        height: calc(100vh - 114px);
        zoom: 100%;
        font-size: .75rem
    }
</style>
<style>
    .props .card-body {
        flex: inherit
    }

    .props .form-control {
        font-size: .7rem !important;
    }

    .props .card-body,
    .props .card-header.special {
        padding: 5px 15px;
    }

    .props select,
    .props input {
        height: calc(1.6rem + 5px);
    }
</style>