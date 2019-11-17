<template>
    <div class="properties">
        <vue-perfect-scrollbar ref="scrollBar" use-both-wheel-axes="true">
            <div class="props card text-dark bg-light p0 mb-1">
                <div class="border-bottom card-header special">
                    <strong>{{task.operation.name}}</strong>
                    <br />
                    <small>
                        <div class="property-description">{{task.operation.description}}</div>
                        <a class="property-help" :href="docReferenceUrl">
                            <i class="fa fa-question-circle" />
                            {{$t('property.help')}}
                        </a>
                    </small>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8"
                            :class="{ 'col-12': readonly, 'col-md-12': readonly,'col-lg-12': readonly,'col-xl-12': readonly }">
                            <label>{{$t('property.taskName')}}</label>
                            <input type="text" maxlength="50" v-model="task.name" class="form-control"
                                readonly="readonly" />
                        </div>
                        <div class=" col-md-3" v-if="!readonly">
                            <label type="checkbox">
                                <switch-component v-model="task.enabled" :checked="task.enabled">
                                    {{$t('common.enabled')}}
                                </switch-component>
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <form>
                        <b-card no-body>
                            <b-tabs card v-model="tabIndex">
                                <b-tab v-for="(form, index) in forms" v-bind:key="form.id" :active="index === 0"
                                    :title="form.name" :title-link-class="'small-nav-link'">
                                    <div v-for="field in form.fields" class="mb-2 property clearfix"
                                        v-bind:key="task.id + field.name" v-if="field.enabled" :data-name="field.name">
                                        <keep-alive>
                                            <component :is="field.suggested_widget + '-component'" :field="field"
                                                :value="getValue(field.name)" :suggestions="suggestions"
                                                :programming-language="task.operation.slug === 'execute-python'? 'python': (task.operation.slug === 'execute-sql'? 'sql': '') "
                                                :language="$root.$i18n.locale" :type="field.suggested_widget"
                                                context="context" :readonly="readonly">
                                            </component>
                                        </keep-alive>
                                    </div>
                                </b-tab>
                            </b-tabs>
                        </b-card>
                    </form>
                    <div class="card-body">
                        {{task.id}}
                    </div>
                </div>
                <div v-for="form in task.operation.forms" v-bind:key="form.id">
                    {{form.ca}}
                    <fieldset>
                        <caption>{{form.label}}</caption>
                    </fieldset>
                </div>
            </div>
        </vue-perfect-scrollbar>
    </div>
</template>
<script>
    import Vue from 'vue';
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import AttributeFunctionComponent from './widgets/AttributeFunction.vue'
    // import AttributeSelectorComponent from './widgets/AttributeSelector2.vue'
    import AttributeSelector2Component from './widgets/AttributeSelector2.vue'
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
    import TagComponent from './widgets/Select2.vue'
    import TextComponent from './widgets/Text.vue'
    import TextAreaComponent from './widgets/TextArea.vue'

    const referenceUrl = process.env.VUE_APP_REFERENCE_BASE_URL;

    export default {
        name: 'PropertyWindow',
        computed: {
            docReferenceUrl() {
                return `${referenceUrl}/${this.task.operation.slug}`;
            },
            readonly() {
                return this.userPermission == 'READ'
            }
        },
        components: {
            'attribute-function-component': AttributeFunctionComponent,
            // 'attribute-selector-component': AttributeSelectorComponent,
            'attribute-selector-component': AttributeSelector2Component,
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
            'textarea-component': TextAreaComponent,
            'switch-component': SwitchComponent,
            'vue-perfect-scrollbar': VuePerfectScrollbar,
        },
        data() {
            return {
                forms: [],
                filledForm: [],
                tabIndex: 0,
                allFields: new Map(),
                conditionalFields: new Map(),
            }
        },
        methods: {
            getValue(name) {
                return this.task
                    && this.task.forms
                    && this.task.forms[name]
                    ? this.task.forms[name].value : null;
            },
            evalInContext(js, context) {
                //# Return the results of the in-line anonymous function we .call with the passed context
                return function () { return eval(js); }.call(context);
            },
            update() {
                let self = this;
                let callback = () => {
                    self.filledForm = self.task.forms;
                    self.forms = self.task.operation.forms.sort((a, b) => {
                        return a.order - b.order;
                    });
                    // Reverse association between field and form. Used to retrieve category
                    const conditional = /\bthis\..+?\b/g;
                    self.forms.forEach((f, i) => {
                        f.fields.forEach((field) => {
                            if (self.task && self.task.forms[field.name])
                                Vue.set(field, "internalValue", self.task.forms[field.name].value);
                        });
                    });
                    self.forms.forEach((f, i) => {
                        f.fields.forEach((field, j) => {
                            field.category = f.category;
                            Vue.set(field, "enabled", true);
                            self.allFields[field.name] = field;
                            field.enabled = true;
                            if (field.enable_conditions) {
                                if (field.enable_conditions === 'false') {
                                    field.enabled = false;
                                } else {
                                    field.enable_conditions.match(conditional).forEach(v => {
                                        const key = v.replace('this.', '');
                                        if (!self.conditionalFields.has(key)) {
                                            self.conditionalFields.set(key, []);
                                        }
                                        self.conditionalFields.get(key).push(field);
                                        field.enabled = self.evalInContext(field.enable_conditions, self.allFields);
                                    });
                                }
                            }

                        });
                    });
                };
                if (this.$refs.scrollBar) {
                    let container = this.$refs.scrollBar.$el //.querySelector('.ps-container');
                    container.scrollTop = 0;
                }
                this.tabIndex = 0;
                if (false) {
                    self.updateAttributeSuggestion(callback);
                } else {
                    callback();
                }
            },
        },
        mounted() {
            const self = this;
            this.update();
            self.$root.$on('update-form-field-value', (field, value) => {
                field.internalValue = value;
                if (self.conditionalFields.has(field.name)) {
                    self.conditionalFields.get(field.name).forEach(fieldToCheck => {
                        try {
                            fieldToCheck.enabled = self.evalInContext(fieldToCheck.enable_conditions, self.allFields);
                        } catch (e) {
                            // Ignore
                        }
                    });
                }
            });
        },
        props: {
            task: { type: Object, default: {} },
            suggestions: { type: Array, default: () => [] },
            userPermission: { type: String, default: 'READ' },
        },
        watch: {
            task() {
                this.update()
            }
        }
    }
</script>
<style scoped>
    .property {
        padding: 3px 0;
    }

    .property-help {
        font-size: 1.2em;
    }

    .property-description {
        max-height: 50px;
        overflow: auto;
        font-style: italic;
        font-size: 1.1em;
        text-align: justify
    }

    .props {
        width: 350px;
        height: calc(100vh - 300px);
    }

    .properties {
        background: #fff;
        border: 1px solid #aaa;
        height: calc(100vh - 300px);
        zoom: 100%;
        font-size: .75rem
    }
</style>
<style>
    .props .card-body {
        flex: inherit
    }

    .small-nav-link {
        padding: 5px 10px !important;
        margin: 0;
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