<template>
    <div class="properties">
        <VuePerfectScrollbar ref="scrollBar" useBothWheelAxes="true">
            <div class="props text-dark bg-light p0 mb-1">
                <div class="border-bottom card-header special">
                    <strong>{{task.operation.name}}</strong>
                    <br />
                    <small>
                        <div class="property-description">{{task.operation.description}}</div>
                        <a class="property-help" :href="docReferenceUrl"><span class="fa fa-question-circle"></span>
                            {{$t('property.help')}}</a>
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
                                <SwitchComponent v-model="task.enabled" :checked="task.enabled">{{$t('common.enabled')}}
                                </SwitchComponent>
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
                                                :value="getValue(field.name)" :suggestionEvent="suggestionEvent"
                                                :programmingLanguage="task.operation.slug === 'execute-python'? 'python': (task.operation.slug === 'execute-sql'? 'sql': '') "
                                                :language="$root.$i18n.locale" :type="field.suggested_widget"
                                                :lookups-method="getLookups" :lookups="lookups"
                                                context="context">
                                            </component>
                                        </keep-alive>

                                    </div>
                                </b-tab>
                                <b-tab v-if="publishingEnabled" :title="$tc('titles.publication')"
                                    :title-link-class="'small-nav-link'">
                                    <div class="alert alert-info p-2 mt-1 mb-1">
                                        {{$t('workflow.publishingSelect')}}
                                    </div>
                                    <button class="btn btn-success btn-sm" @click.prevent="showPublishingModal()">{{$t('actions.editValue')}}</button>
                                </b-tab>
                            </b-tabs>
                        </b-card>
                    </form>
                    <div class="card-body">
                        {{task.id}}
                    </div>
                </div>
                <b-modal size="lg" ref="publishingModal" :title="$tc('titles.publication')" :ok-only="true">
                    <div class="mt-2 p-2 border">
                        <table class="table table-sm table-striped table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th class="text-center" style="width: 5%"></th>
                                    <th class="text-center" style="width: 25%">{{$tc('titles.property')}}</th>
                                    <th class="text-center" style="width: 15%">{{$tc('titles.actualValue')}}</th>
                                    <th class="text-center" style="width: 25%">{{$tc('variables.associateTo')}}</th>
                                    <th class="text-center" style="width: 30%">{{$tc('variables.associateToLookup')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(form, index) in forms">
                                    <tr v-for="field in form.fields" :key="field.name"
                                        v-if="form.category === 'execution' && field.enabled">
                                        <td>
                                            <b-checkbox v-model="task.forms[field.name] && task.forms[field.name].publishing_enabled">
                                            </b-checkbox>
                                        </td>
                                        <td>{{field.label}}</td>
                                        <td>
                                            <component :is="field.suggested_widget + '-component'"
                                                :field="field" :value="getValue(field.name)"
                                                :type="field.suggested_widget" context="context"
                                                :read-only="true">
                                            </component>
                                        </td>
                                        <td>
                                            <v-select v-if="task.forms[field.name]" :options="variableNames" :multiple="false" 
                                                    v-model="task.forms[field.name].variable" 
                                                    value="name"
                                                    label="name" :taggable="true" :close-on-select="true">
                                                <div slot="no-options"></div>
                                            </v-select>
                                        </td>
                                        <td>
                                            <v-select v-if="task.forms[field.name]" :options="lookups" :multiple="false" 
                                                    v-model="task.forms[field.name].lookup" 
                                                    :create-option="ds => ({ ds, id: null })"
                                                          :reduce="option => option.id"
                                                    label="name" :taggable="true" :close-on-select="true">
                                                <div slot="no-options"></div>
                                            </v-select>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </b-modal>
            </div>
        </VuePerfectScrollbar>
    </div>
</template>
<script>
    import Vue from 'vue';
    import axios from 'axios';
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import SwitchComponent from './widgets/Switch.vue'
    import Notifier from '../mixins/Notifier';

    const referenceUrl = process.env.VUE_APP_REFERENCE_BASE_URL;

    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    export default {
        mixins: [Notifier],
        name: 'PropertyWindow',
        computed: {
            docReferenceUrl() {
                return `${referenceUrl}/${this.task.operation.slug}`;
            },
            propertiesForPublishing() {
                return Object.keys(this.task.forms).sort((a, b) => a.localeCompare(b));
            },
            variableNames(){
                return this.variables.map((v) => v.name);
            }
        },
        components: {
            SwitchComponent,
            VuePerfectScrollbar,
        },
        data() {
            return {
                allFields: new Map(),
                conditionalFields: new Map(),
                forms: [],
                filledForm: [],
                lookups: [],
                tabIndex: 0,
            }
        },
        methods: {
            showPublishingModal(){
                this.getLookups();
                this.$refs.publishingModal.show();
            },
            getLookups(){
                if (this.lookups === undefined || this.lookups.length === 0){
                    const self = this;
                    const params = {
                        lookup: true,
                        fields: 'id,name,attributes.id,attributes.name',
                    };
                    axios
                        .get(`${limoneroUrl}/datasources`, {params})
                        .then(resp => {
                            self.lookups = resp.data.data;
                        })
                        .catch(function (e) {
                            self.error(e);
                        });
                }
            },
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
                const self = this;
                const callback = () => {
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
                callback();
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
            suggestionEvent: null,
            publishingEnabled: false,
            variables: {type: Array, default: () => []}
        },
        watch: {
            task() {
                this.update()
            }
        }
    }
</script>
<style scoped>
    .table-sm {
        font-size: .8em;
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
        height: calc(100vh - 200px);
    }

    .properties {
        background: #fff;
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
        padding: 5px 8px !important;
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
