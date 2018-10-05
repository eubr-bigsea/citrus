<template>
    <div class="properties">
        <VuePerfectScrollbar>
            <div class="props">
                <div class="border-bottom mb-2">
                    <strong>{{task.operation.name}}</strong>
                    <br/>
                    <small>
                        {{task.id}}
                        <br/>
                        <em>{{task.operation.description}}</em>
                    </small>
                </div>
                <div class="mb-2">
                    <label>{{$t('property.taskName')}}</label>
                    <input type="text" maxlength="50" v-model="task.name" class="form-control" />
                    <div class="checkbox">
                        <label type="checkbox">
                            <input type="checkbox" v-model="task.enabled" /> {{$t('common.enabled')}}
                        </label>
                    </div>
                </div>
                <div>
                    <form>
                        <div class="cart text-dark bg-light p0 mb-1" v-for="form in forms">
                            <div class="card-header">{{form.name}}</div>
                            <div v-if="!form.fields.length">
                                No parameters to configure.
                            </div>
                            <div class="card-body">
                                <div v-for="field in form.fields" class="mb-2">
                                    <component v-if="['checkbox', 'range', 'integer', 'lookup', 'dropdown', 'text' , 'color', 'textarea', 'code'].includes(field.suggested_widget)"
                                        :is="field.suggested_widget + '-component'" :field="field" :value="getValue(field.name)"
                                        language="language" context="context"></component>
                                    <span v-else>{{field.name}} {{field.suggested_widget}} {{['checkbox', 'color', 'textarea', 'code'].includes(field.suggested_widget)}}
                                    </span>
                                    <keep-alive>
                                        <!-- component :is="field.suggested_widget + '-component'" :field="field" value="getValue(field.name)" language="language"
                                suggestions="getSuggestions(task.id)" context="context" /-->
                                    </keep-alive>

                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                </form>
                <div v-for="form in task.operation.forms">
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

    import CheckboxComponent from './widgets/Checkbox.vue'
    import CodeComponent from './widgets/Code.vue'
    import ColorComponent from './widgets/Color.vue'
    import DropDownComponent from './widgets/DropDown.vue'
    import IntegerComponent from './widgets/Integer.vue'
    import LookupComponent from './widgets/Lookup.vue'
    import RangeComponent from './widgets/Range.vue'
    import TextComponent from './widgets/Text.vue'
    import TextAreaComponent from './widgets/TextArea.vue'
    export default {
        name: 'PropertyWindow',
        components: {
            'checkbox-component': CheckboxComponent,
            'code-component': CodeComponent,
            'color-component': ColorComponent,
            'dropdown-component': DropDownComponent,
            'integer-component': IntegerComponent,
            'lookup-component': LookupComponent,
            'range-component': RangeComponent,
            'text-component': TextComponent,
            'textarea-component': TextAreaComponent,
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

            VuePerfectScrollbar
        },
        data() {
            return {
                forms: [],
                filledForm: [],
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
            task: { type: Object, default: {} }
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
        height: calc(80vh + 20px);
        zoom: 100%;
        font-size: .75rem
    }
</style>
<style>
    .props .form-control {
        font-size: .7rem !important;
    }

    .props select,
    .props input {
        height: calc(1.6rem + 2px);
    }
</style>