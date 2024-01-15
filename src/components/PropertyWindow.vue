<template>
    <div>
        <div class="properties">
            <div class="props text-dark bg-light p0 mb-1">
                <div class="border-bottom card-header special">
                    <strong>{{taskCopy.operation.name}}</strong>
                    <br>
                    <small>
                        <div class="property-description">{{taskCopy.operation.description}}</div>
                        <a class="property-help" :href="docReferenceUrl"><font-awesome-icon icon="fa fa-question-circle" />
                            {{$t('property.help')}}</a>
                    </small>
                </div>
                
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <label>{{$t('property.taskName')}}</label>
                            <input v-model="taskCopy.name" type="text" maxlength="50" class="form-control"
                                   @input="$emit('update-task-name', $event.target.value)">
                        </div>
                        <div class="col-md-3">
                            <label type="checkbox">
                                <SwitchComponent v-model="taskCopy.enabled" :checked="taskCopy.enabled" 
                                                 @input="$emit('toggle-task', taskCopy.enabled)">
                                    {{$t('common.enabled')}}
                                </SwitchComponent>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div>
                    <form>
                        <b-card no-body class="scroll-area scrollable">
                            <b-tabs v-model="tabIndex" card>
                                <b-tab v-for="(form, index) in forms" :key="form.id" :active="index === 0"
                                       :title="form.name" :title-link-class="'small-nav-link'">
                                    <div v-for="field in form.fields.filter(f => f.enabled)" :key="taskCopy.id + field.name"
                                         class="mb-2 property clearfix" :data-name="field.name">
                                        <keep-alive>
                                            <component :is="getWidget(field)" :field="field" :value="getValue(field.name)"
                                                       :suggestion-event="suggestionEvent"
                                                       :extended-suggestion-event="extendedSuggestionEvent"
                                                       :programming-language="taskCopy.operation.slug === 'execute-python' ? 'python' : (taskCopy.operation.slug === 'execute-sql' ? 'sql' : '')"
                                                       :language="$root.$i18n.locale" :type="field.suggested_widget"
                                                       :read-only="!field.editable" :lookups-method="getLookups" :lookups="lookups"
                                                       context="context" @update-form-field-value="updateField" />
                                        </keep-alive>
                                    </div>
                                </b-tab>
                            
                                <b-tab v-if="publishingEnabled" :title="$t('titles.publication')"
                                       :title-link-class="'small-nav-link'">
                                    <div class="alert alert-info p-2 mt-1 mb-1">
                                        {{$t('workflow.publishingSelect')}}
                                    </div>
                                    <button class="btn btn-success btn-sm" @click.prevent="showPublishingModal()">
                                        {{$t('actions.editValue')}}
                                    </button>
                                </b-tab>
                            </b-tabs>
                        </b-card>
                    </form>
                    <div class="card-body">
                        {{taskCopy.id}}
                    </div>
                </div>
            
                <b-modal ref="publishingModal" size="xl" :title="$t('titles.publication')" :ok-only="true">
                    <div class="mt-2 p-2 border">
                        <table class="table table-sm table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th class="text-center" style="width: 1%" />
                                    <th class="text-center" style="width: 14%">
                                        {{$t('titles.property')}}
                                    </th>
                                    <th class="text-center" style="width: 20%">
                                        {{$t('variables.label')}}
                                    </th>
                                    <th class="text-center" style="width: 15%">
                                        {{$t('titles.actualValue')}}
                                    </th>
                                    <th class="text-center" style="width: 8%">
                                        {{$t('variables.index')}}
                                    </th>
                                    <th class="text-center" style="width: 15%">
                                        {{$t('variables.associateTo')}}
                                    </th>
                                    <th class="text-center" style="width: 30%">
                                        {{$t('variables.associateToLookup')}}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="form in forms">
                                    <tr v-for="field in getExecutionFields(form, taskCopy)" :key="field.name">
                                        <td>
                                            <b-form-checkbox v-if="taskCopy.forms[field.name]"
                                                        v-model="taskCopy.forms[field.name].publishing_enabled" />
                                        </td>
                                        <td>{{field.label}}</td>
                                        <td>
                                            <input v-model="taskCopy.forms[field.name].new_label" type="text"
                                                   class="form-control form-control-sm" maxlength="100">
                                        </td>
                                        <td>
                                            <component :is="field.suggested_widget + '-component'" :field="field"
                                                       :value="getValue(field.name)" :type="field.suggested_widget"
                                                       context="context" :read-only="true" />
                                        </td>
                                        <td>
                                            <input v-model="taskCopy.forms[field.name].display_index" maxlength="4"
                                                   autocomplete="off" class="form-control form-control-sm" type="number"
                                                   min="0" max="100">
                                        </td>
                                        <td>
                                            <v-select v-model="taskCopy.forms[field.name].variable" :options="variableNames"
                                                      :multiple="false" value="name" label="name" :taggable="true"
                                                      :close-on-select="true">
                                                <template #no-options />
                                            </v-select>
                                        </td>
                                        <td>
                                            <v-select v-model="taskCopy.forms[field.name].lookup" :options="lookups"
                                                      :multiple="false" :create-option="ds => ({ ds, id: null })"
                                                      :reduce="option => option.id" label="name" :taggable="true"
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
;
import axios from 'axios';
import SwitchComponent from './widgets/Switch.vue';
import Notifier from '../mixins/Notifier.js';

const referenceUrl = import.meta.env.VITE_REFERENCE_BASE_URL;

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
export default {
    name: 'PropertyWindow',
    components: {
        SwitchComponent,
    },
    mixins: [Notifier],
    props: {
        task: { type: Object, default: () => { } },
        suggestionEvent: { type: Function, default: () => null },
        extendedSuggestionEvent: { type: Function, default: () => null },
        publishingEnabled: { type: Boolean, default: () => false },
        variables: { type: Array, default: () => [] }
    },
    emits: ['update-form-field-value', 'update-task-name', 'toggle-task'],
    data() {
        return {
            allFields: new Map(),
            conditionalFields: new Map(),
            forms: [],
            filledForm: [],
            lookups: [],
            tabIndex: 0,
            taskCopy: { ...this.task },
        };
    },
    computed: {
        docReferenceUrl() {
            return `${referenceUrl}/${this.taskCopy.operation.slug}`;
        },
        propertiesForPublishing() {
            return Object.keys(this.taskCopy.forms).sort((a, b) => a.localeCompare(b));
        },
        variableNames() {
            return this.variables.map((v) => v.name);
        }
    },
    watch: {
        task: {
            deep: false,
            handler(newValues){
                this.update();
            }
        },
        taskCopy: {
            deep: true,
            handler(newValues) {

            }
        }
    },
    mounted() {
        const self = this;
        this.update();
        //self.$root.$on('update-form-field-value', this.toggleFields);
    },
    methods: {
        getExecutionFields(form, task) {
            return form.fields.filter(field =>
                form.category === 'execution' && field.enabled
                && task.forms[field.name]);
        },

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
            return this.taskCopy
                && this.taskCopy.forms
                && this.taskCopy.forms[name]
                ? this.taskCopy.forms[name].value : null;
        },
        evalInContext(js, context) {
            //# Return the results of the in-line anonymous function we .call with the passed context
            return function () {
                try {
                    return eval(js);
                    return true;
                } catch (pass) {
                    return false;
                }
            }.call(context);
        },
        update() {
            const self = this;
            this.taskCopy = {... this.task};
            const callback = () => {
                self.filledForm = self.taskCopy.forms;
                self.forms = self.taskCopy.operation.forms.sort((a, b) => {
                    return a.order - b.order;
                });
                // Reverse association between field and form. Used to retrieve category
                const conditional = /\bthis\..+?\b/g;
                self.forms.forEach((f) => {
                    f.fields.forEach((field) => {
                        if (self.taskCopy && self.taskCopy.forms[field.name]) {
                            field.internalValue = self.taskCopy.forms[field.name].value;
                            const f = self.taskCopy.forms[field.name];
                            if (!f['new_label']) {
                                self.taskCopy.forms[field.name].new_label = self.taskCopy.forms[field.name].label;
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
                let container = this.$refs.scrollBar.$el; //.querySelector('.ps-container');
                container.scrollTop = 0;
            }
            this.tabIndex = 0;
            callback();

        },
        updateField(field, value, labelValue) {
            const self = this;
            field.internalValue = value;
            const f = self.allFields[field.name];
            if (f) {
                f.internalValue = value;
            }
            if (self.conditionalFields.has(field.name)) {
                const fieldsToCheck = self.conditionalFields.get(field.name);
                //console.debug(self.allFields['validation']?.internalValue)
                fieldsToCheck.forEach(fieldToCheck => {
                    try {
                        fieldToCheck.enabled = self.evalInContext(fieldToCheck.enable_conditions, self.allFields);
                    } catch (e) {
                        console.debug(e);
                    }
                });
                if (fieldsToCheck?.length) {
                    [...new Set(fieldsToCheck.map(item => item.name))].forEach(item => {
                        self.toggleFields(self.allFields[item], self.allFields[item].internalValue);
                    });
                }
            }
            this.$emit('update-form-field-value', field, value, labelValue);
        }
    }
};
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
    overflow-y: auto;
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
