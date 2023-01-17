<template>
    <div>
        <div class="properties">
            <div class="props text-dark bg-light p0 mb-1">
                <div class="border-bottom card-header special">
                    <strong>{{task.operation.name}}</strong>
                    <br>
                    <small>
                        <div class="property-description">{{task.operation.description}}</div>
                        <a class="property-help"
                           :href="docReferenceUrl"><font-awesome-icon icon="fa fa-question-circle" />
                            {{$t('property.help')}}</a>
                    </small>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <label>{{$t('property.taskName')}}</label>
                            <input v-model="task.name"
                                   type="text"
                                   maxlength="50"
                                   class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label type="checkbox">
                                <SwitchComponent v-model="task.enabled"
                                                 :checked="task.enabled">
                                    {{$t('common.enabled')}}
                                </SwitchComponent>
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <form>
                        <b-card no-body
                                class="scrollable">
                            <VuePerfectScrollbar ref="scrollBar"
                                                 use-both-wheel-axes="true">
                                <b-tabs v-model="tabIndex"
                                        card>
                                    <b-tab v-for="(form, index) in forms"
                                           :key="form.id"
                                           :active="index === 0"
                                           :title="form.name"
                                           :title-link-class="'small-nav-link'">
                                        <div v-for="field in form.fields"
                                             v-if="field.enabled"
                                             :key="task.id + field.name"
                                             class="mb-2 property clearfix"
                                             :data-name="field.name">
                                            <keep-alive>
                                                <component :is="getWidget(field)"
                                                           :field="field"
                                                           :value="getValue(field.name)"
                                                           :suggestion-event="suggestionEvent"
                                                           :extended-suggestion-event="extendedSuggestionEvent"
                                                           :programming-language="task.operation.slug === 'execute-python'? 'python': (task.operation.slug === 'execute-sql'? 'sql': '') "
                                                           :language="$root.$i18n.locale"
                                                           :type="field.suggested_widget"
                                                           :read-only="!field.editable"
                                                           :lookups-method="getLookups"
                                                           :lookups="lookups"
                                                           context="context" />
                                            </keep-alive>
                                        </div>
                                    </b-tab>
                                    <b-tab v-if="publishingEnabled"
                                           :title="$tc('titles.publication')"
                                           :title-link-class="'small-nav-link'">
                                        <div class="alert alert-info p-2 mt-1 mb-1">
                                            {{$t('workflow.publishingSelect')}}
                                        </div>
                                        <button class="btn btn-success btn-sm"
                                                @click.prevent="showPublishingModal()">
                                            {{$t('actions.editValue')}}
                                        </button>
                                    </b-tab>
                                </b-tabs>
                            </VuePerfectScrollbar>
                        </b-card>
                    </form>
                    <div class="card-body">
                        {{task.id}}
                    </div>
                </div>
                <b-modal ref="publishingModal"
                         size="xl"
                         :title="$tc('titles.publication')"
                         :ok-only="true">
                    <div class="mt-2 p-2 border">
                        <table class="table table-sm table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th class="text-center"
                                        style="width: 1%" />
                                    <th class="text-center"
                                        style="width: 14%">
                                        {{$tc('titles.property')}}
                                    </th>
                                    <th class="text-center"
                                        style="width: 20%">
                                        {{$tc('variables.label')}}
                                    </th>
                                    <th class="text-center"
                                        style="width: 15%">
                                        {{$tc('titles.actualValue')}}
                                    </th>
                                    <th class="text-center"
                                        style="width: 8%">
                                        {{$tc('variables.index')}}
                                    </th>
                                    <th class="text-center"
                                        style="width: 15%">
                                        {{$tc('variables.associateTo')}}
                                    </th>
                                    <th class="text-center"
                                        style="width: 30%">
                                        {{$tc('variables.associateToLookup')}}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(form) in forms">
                                    <tr v-for="field in form.fields"
                                        v-if="form.category === 'execution' && field.enabled && task.forms[field.name]"
                                        :key="field.name">
                                        <td>
                                            <b-checkbox v-if="task.forms[field.name]"
                                                        v-model="task.forms[field.name].publishing_enabled" />
                                        </td>
                                        <td>{{field.label}}</td>
                                        <td>
                                            <input v-model="task.forms[field.name].new_label"
                                                   type="text"
                                                   class="form-control form-control-sm"
                                                   maxlength="100">
                                        </td>
                                        <td>
                                            <component :is="field.suggested_widget + '-component'"
                                                       :field="field"
                                                       :value="getValue(field.name)"
                                                       :type="field.suggested_widget"
                                                       context="context"
                                                       :read-only="true" />
                                        </td>
                                        <td>
                                            <input v-model="task.forms[field.name].display_index"
                                                   maxlength="4"
                                                   autocomplete="off"
                                                   class="form-control form-control-sm"
                                                   type="number"
                                                   min="0"
                                                   max="100">
                                        </td>
                                        <td>
                                            <v-select v-model="task.forms[field.name].variable"
                                                      :options="variableNames"
                                                      :multiple="false"
                                                      value="name"
                                                      label="name"
                                                      :taggable="true"
                                                      :close-on-select="true">
                                                <template #no-options />
                                            </v-select>
                                        </td>
                                        <td>
                                            <v-select v-model="task.forms[field.name].lookup"
                                                      :options="lookups"
                                                      :multiple="false"
                                                      :create-option="ds => ({ ds, id: null })"
                                                      :reduce="option => option.id"
                                                      label="name"
                                                      :taggable="true"
                                                      :close-on-select="true">
                                                <template #no-options />
                                            </v-select>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </b-modal>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import SwitchComponent from './widgets/Switch.vue'
import Notifier from '../mixins/Notifier.js';

const referenceUrl = import.meta.env.VITE_REFERENCE_BASE_URL;

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
export default {
    name: 'PropertyWindow',
    components: {
        SwitchComponent,
        VuePerfectScrollbar,
    },
    mixins: [Notifier],
    props: {
        task: { type: Object, default: () => {} },
        suggestionEvent: {type: Function, default: () => null},
        extendedSuggestionEvent: { type: Function, default: () => null },
        publishingEnabled: {type: Boolean, default: () => false},
        variables: { type: Array, default: () => [] }
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
    computed: {
        docReferenceUrl() {
            return `${referenceUrl}/${this.task.operation.slug}`;
        },
        propertiesForPublishing() {
            return Object.keys(this.task.forms).sort((a, b) => a.localeCompare(b));
        },
        variableNames() {
            return this.variables.map((v) => v.name);
        }
    },
    watch: {
        task() {
            this.update()
        }
    },
    mounted() {
        const self = this;
        this.update();
        self.$root.$on('update-form-field-value', this.toggleFields);
    },
    methods: {
        getWidget(field) {
            if (field.suggested_widget.endsWith(':read-only')) {
                const s = field.suggested_widget;
                return s.substring(0, s.length - 10) + '-component';
            } else {
                return field.suggested_widget + '-component';
            }
        },
        showPublishingModal() {
            this.getLookups();
            this.$refs.publishingModal.show();
        },
        async getLookups() {
            if (this.lookups === undefined || this.lookups.length === 0) {
                const self = this;
                const params = {
                    lookup: true,
                    fields: 'id,name,attributes.id,attributes.name',
                };
                const resp = await axios.get(`${limoneroUrl}/datasources`, { params });
                self.lookups = resp.data.data;
                return self.lookups;
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
            return function () {
                try{
                    return eval(js);
                } catch(pass){
                    return false;
                }
            }.call(context);
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
                self.forms.forEach((f) => {
                    f.fields.forEach((field) => {
                        if (self.task && self.task.forms[field.name]) {
                            Vue.set(field, "internalValue", self.task.forms[field.name].value);
                            const f = self.task.forms[field.name];
                            if (!f['new_label']) {
                                Vue.set(self.task.forms[field.name], "new_label",
                                    self.task.forms[field.name].label);
                            }
                            if (!f['publishing_enabled']) {
                                delete f['new_label'];
                                delete f['display_index'];
                                delete f['suggested_widget'];
                                delete f['lookup'];
                                delete f['variable'];
                            }
                        }
                    });
                });
                self.forms.forEach((f) => {
                    f.fields.forEach((field) => {
                        self.allFields[field.name] = field;
                    });
                    f.fields.forEach((field) => {
                        field.category = f.category;
                        Vue.set(field, "enabled", true);
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
        toggleFields(field, value){
            const self = this;
            field.internalValue = value;
            const f = self.allFields[field.name];
            if (f){
                f.internalValue = value
            }
            if (self.conditionalFields.has(field.name)) {
                const fieldsToCheck = self.conditionalFields.get(field.name);
                //console.debug(self.allFields['validation']?.internalValue)
                fieldsToCheck.forEach(fieldToCheck => {
                    try {
                        fieldToCheck.enabled = self.evalInContext(fieldToCheck.enable_conditions, self.allFields);
                    } catch (e) {
                        console.debug(e)
                    }
                });
                if (fieldsToCheck?.length){
                    [...new Set(fieldsToCheck.map(item => item.name))].forEach(item => {
                        self.toggleFields(self.allFields[item], self.allFields[item].internalValue)
                    });
                }
            }
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
        height: calc(100vh - 100px);
    }

    .properties {
        background: #fff;
        max-height: calc(100vh - 300px);
        zoom: 100%;
        font-size: .75rem
    }
    .scrollable {
        max-height: calc(100vh - 420px);
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
