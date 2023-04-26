<template>
    <div>
        <div class="row">
            <div class="col-md-3">
                <h5>Algoritmos</h5>
                <small>Informe os parâmetros para a execução do algoritmo. <u>Nenhum parâmetro é
                        obrigatório.</u></small>
                <hr>
                <b-list-group>
                    <b-list-group-item v-for="alg in algorithms" :key="alg.id" class="p-0 pl-2"
                        :class="{ 'bg-light': selectedAlgorithm === alg }">
                        <div class="d-flex w-100 p-1" role="button" @click="handleSelectAlgorithm(alg)">
                            <b-form-checkbox v-model="alg.enabled" switch />
                            {{ alg.operation.name }}
                        </div>
                    </b-list-group-item>
                </b-list-group>
                <hr>
                <div v-if="false && selectedAlgorithm && selectedAlgorithm.operation">
                    {{ selectedAlgorithm.forms }}
                </div>
            </div>
            <div class="col-md-9 border p-3 algorithm scroll-area">
                <div v-if="selectedAlgorithm && selectedAlgorithm.operation && selectedAlgorithm.enabled">
                    <h6>{{ selectedAlgorithm.operation.name }}</h6>
                    <hr>
                    <template v-for="form in selectedAlgorithm.operation.forms">
                        <div v-for="field in form.fields" :key="field.name" class="mb-2 property clearfix"
                            :data-name="field.name">
                            <!--{{field.name}} {{field.enable_conditions}} {{getWidget(field)}}-->
                            {{getFieldValue(field.name)}}
                            <keep-alive>
                                <div v-if="getWidget(field) === 'checkbox-component'">
                                    <checkboxes-component :field="field" :value="(getFieldValue(field.name) || {}).list"
                                        :language="$root.$i18n.locale" :type="field.suggested_widget" :small="true"
                                        :read-only="!field.editable" context="context" @update="handleUpdateField" />
                                </div>
                                <component :is="getWidget(field)"
                                    v-else-if="getWidget(field) !== 'attribute-selector-component' && field.enabled"
                                    visual-style="explorer" :field="field" :value="getFieldValue(field.name)"
                                    :language="$root.$i18n.locale" :type="field.suggested_widget" :small="true"
                                    :read-only="!field.editable" context="context"
                                    :show-quantity="workflow.grid.forms.strategy.value === 'grid'"
                                    @update="handleUpdateField" />
                                <div v-else />
                            </keep-alive>
                        </div>
                        <button :key="form.id" class="btn btn-sm btn-outline-secondary" @click.prevent="handleCleanAll">
                            Limpar
                            parâmetros
                        </button>
                    </template>
                </div>
                <div v-else class="text-center text-secondary mt-5 pt-5">
                    <h4>Selecione e habilite um algoritmo à esquerda para editar seus parâmetros.</h4>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import Checkboxes from '../../../components/widgets/Checkboxes.vue';
import InputTag from '../../../components/widgets/InputTag.vue';
import NumericRangeOrSet from '../../../components/widgets/NumericRangeOrSet.vue';
const conditional = /\bthis\..+?\b/g;
export default {
    name: 'AlgorithmsComponent',
    components: {
        'checkboxes-component': Checkboxes,
        'input-tag-component': InputTag,
        'numeric-range-or-set-component': NumericRangeOrSet
    },
    props: {
        operations: { type: Array, required: true },
        operationMap: { type: Map, required: true },
        workflow: { type: Object, required: true },
    },
    data() {
        return {
            algorithms: [],
            conditionalFields: new Map(),
            selectedAlgorithm: {},
        }
    },
    mounted() {
        const algLookup = new Map((this.workflow.tasks || []).map((alg) => [alg.operation.slug, alg]));
        const operationsLookup = new Map(this.operations.map(op => [op.slug, op]));

        /* Initialization
            if (!this.algorithms.forms) {
                this.algorithms.forms = { algorithms: { value: [] } };
            } else if (!this.algorithms.forms.algorithms) {
                this.algorithms.forms.algorithms = { value: [] };
            } */
        this.algorithms = this.operations.map((op) => {
            let task;
            if (algLookup.has(op.slug)) {
                task = algLookup.get(op.slug);
                task.operation = operationsLookup.get(op.slug);
                task.algorithm = true;
            } else {
                task = this.workflow.addTask(op);
                task.enabled = false;
                task.algorithm = true;
            }
            return task;
        });

    },
    methods: {
        evalInContext(js, context) {
            return new Function("return `" + js + "`;").call(context);
        },
        handleSelectAlgorithm(alg) {
            alg.operation.forms.forEach(form => {
                form.fields.forEach(field => {
                    Vue.set(field, "internalValue", alg.forms[field.name].value);
                    Vue.set(field, "enabled", true);
                })
            });
            const self = this;
            alg.operation.forms.forEach((f) => {
                f.fields.forEach((field) => {
                    Vue.set(alg.forms[field.name], "enabled", true);
                    if (field.enable_conditions) {
                        if (field.enable_conditions === 'false') {
                            alg.forms[field.name].enabled = false;
                        } else {
                            field.enable_conditions.match(conditional).forEach(v => {
                                const key = v.replace('this.', '');
                                if (!self.conditionalFields.has(key)) {
                                    self.conditionalFields.set(key, new Set());
                                }
                                self.conditionalFields.get(key).add(field);

                            });
                        }
                    }

                });
            });
            this.selectedAlgorithm = alg;
        },
        getExecutionForm() {
            if (this.selectedAlgorithm && this.selectedAlgorithm.forms) {
                const result = this.selectedAlgorithm.forms.filter(f => f.category === 'execution');
                return result;
            } else {
                console.debug(this.selectedAlgorithm, this.selectedAlgorithm.forms);
                return [];
            }
        },
        getWidget(field) {
            if (field.suggested_widget.endsWith(':read-only')) {
                const s = field.suggested_widget;
                return s.substring(0, s.length - 10) + '-component';
            } else if (field.suggested_widget === 'dropdown') {
                return 'checkboxes-component';
            } else if (field.suggested_widget === 'integer' || field.suggested_widget === 'decimal') {
                return 'numeric-range-or-set-component';
            } else {
                return field.suggested_widget + '-component';
            }
        },
        getFieldValue(name) {
            return this.selectedAlgorithm
                && this.selectedAlgorithm.forms
                && this.selectedAlgorithm.forms[name]
                ? this.selectedAlgorithm.forms[name].value : null;
        },
        handleUpdateField(field, value, label) {
            if (['checkbox', 'dropdown'].includes(field.suggested_widget)) {
                const newValue = {type: 'list', list: value.filter(a => a !== '')};
                this.selectedAlgorithm.forms[field.name] = { value: newValue, label, internalValue: newValue };
            } else {
                this.selectedAlgorithm.forms[field.name] = { value: value, label, internalValue: value };
            }

            /*if (this.conditionalFields.has(field.name)) {
                    this.conditionalFields.get(field.name).forEach(field => {
                        const result = this.evalInContext()
                        field.enabled =
                    });
                }*/
        },
        handleCleanAll() {
            Object.entries(this.selectedAlgorithm.forms).forEach(([name, value], inx) => { // eslint-disable-line no-unused-vars
                value.value = null;
                value.internalValue = { type: 'list', list: [] };
            });
        }
    },
}
</script>
<style scoped>
.algorithm {
    height: 75vh;
    overflow: auto;
}
</style>
