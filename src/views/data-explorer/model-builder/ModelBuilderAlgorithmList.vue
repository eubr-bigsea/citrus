<template>
    <div>
        <div class="row">
            <div class="col-md-3">
                <h5 class="mb-3 border-bottom">
                    Algoritmos
                </h5>
                <small>Informe os parâmetros para a execução do algoritmo. <u>Nenhum parâmetro é
                    obrigatório.</u></small>

                <b-list-group class="mb-3 border-bottom">
                    <b-list-group-item v-for="task in props.tasks" :key="task.id" class="p-0 ps-2"
                                       :class="{ 'bg-light': selectedAlgorithm === task }">
                        <div class="d-flex w-100 p-1" role="button" @click="handleSelectTask(task)">
                            <b-form-checkbox v-model="task.enabled" switch />
                            {{task.operation.slug}}
                            {{task.name}} | {{task.id}} || {{task.enabled}}
                        </div>
                    </b-list-group-item>
                </b-list-group>
            </div>
            <div class="col-md-9 border p-3 algorithm scroll-area">
                <div v-if="selectedAlgorithm && selectedAlgorithm.operation && selectedAlgorithm.enabled">
                    {{selectedAlgorithm}}
                    <input v-model="selectedAlgorithm.forms.test" class="form-control form-control-sm">
                </div>
                <div v-else class="text-center text-secondary mt-5 pt-5">
                    <h4>Selecione e habilite um algoritmo à esquerda para editar seus parâmetros.</h4>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

//import ModelBuilderAlgorithm from './ModelBuilderAlgorithm.vue';

import { ref, onMounted, reactive } from 'vue';
import { Operation, Task } from '../entities.js';

const conditional = /\bthis\..+?\b/g;

const props = defineProps({
    tasks: { type: Array, required: true },
    operations: { type: Array, required: true },
});

const conditionalFields = new Map();
const selectedAlgorithm = ref({});

const emit = defineEmits(['update:tasks']);

onMounted(() => {
    const tasksLookup = new Map((props.tasks || []).map((task) => [task.operation.slug, task]));
    const operationsLookup = new Map(props.operations.map(op => [op.slug, op]));

    let updatedTasks = [...props.tasks];
    
    /* Remove invalid tasks */
    const before = updatedTasks.length;
    updatedTasks = updatedTasks.filter(t => operationsLookup.has(t.operation.slug));

    let changed = before != updatedTasks.length;

    console.debug(updatedTasks);
    /* Add missing tasks */
    for (let op of props.operations) {
        if (!tasksLookup.has(op.slug)) {
            updatedTasks.push(new Task({
                id: Operation.generateTaskId(),
                name: op.name,
                enabled: true,
                display_order: 1000,
                forms: {},
                operation: op
            }));
            changed = true;
        }
    }
    if (changed) {
        updatedTasks.sort(t => t.operation.slug);
        emit('update:tasks', updatedTasks);
    }
    return;
});

/* Initialization
        if (!this.algorithms.forms) {
            this.algorithms.forms = { algorithms: { value: [] } };
        } else if (!this.algorithms.forms.algorithms) {
            this.algorithms.forms.algorithms = { value: [] };
        } 
    this.algorithms = props.algorithmOperations.map((op) => {
        let task;
        if (tasksLookup.has(op.slug)) {
            task = tasksLookup.get(op.slug);
            task.operation = operationsLookup.get(op.slug);
            task.algorithm = true;
        } else {
            task = this.workflow.addTask(op);
            task.enabled = false;
            task.algorithm = true;
        }
        return task;
    });
*/
const evalInContext = (js, context) => {
    return new Function("return `" + js + "`;").call(context);
};

const handleSelectTask = (task) => {

    selectedAlgorithm.value = task;
    return;
    if (selectedAlgorithm.value.forms === undefined) {
        selectedAlgorithm.value.forms = reactive({}); //Review
    }
    op.forms.forEach(form => {
        form.fields.forEach(field => {
            const formField = selectedAlgorithm.value.forms[field.name];
            if (!formField) {
                formField[field.name] = reactive({});
            }
            formField.internalValue = alg.forms[field.name].value;
            formField.enabled = true;
        });
    });
    op.forms.forEach((f) => {
        f.fields.forEach((field) => {
            alg.forms[field.name].enabled = true;
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
};

const getExecutionForm = () => {
    if (this.selectedAlgorithm && this.selectedAlgorithm.forms) {
        const result = this.selectedAlgorithm.forms.filter(f => f.category === 'execution');
        return result;
    } else {
        console.debug(this.selectedAlgorithm, this.selectedAlgorithm.forms);
        return [];
    }
};

const getWidget = (field) => {
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
};
const getFieldValue = (name, checkboxes) => {

    if (checkboxes) {
        return this.selectedAlgorithm
            && this.selectedAlgorithm?.forms
            && this.selectedAlgorithm?.forms[name]
            && this.selectedAlgorithm?.forms[name]?.value
            ? this.selectedAlgorithm?.forms[name]?.value?.list : null;
    } else {
        return this.selectedAlgorithm
            && this.selectedAlgorithm.forms
            && this.selectedAlgorithm.forms[name]
            ? this.selectedAlgorithm.forms[name].value : null;
    }

};
const handleUpdateField = (field, value, label) => {
    if (['checkbox', 'dropdown'].includes(field.suggested_widget)) {
        const newValue = { list: value, type: 'list' };//{type: 'list', list: value.filter(a => a !== '')};
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
};
const handleCleanAll = () => {
    Object.entries(this.selectedAlgorithm.forms).forEach(([name, value], inx) => { // eslint-disable-line no-unused-vars
        value.value = null;
        value.internalValue = { type: 'list', list: [] };
    });
};
</script>
<style scoped>
.algorithm {
    height: 75vh;
    overflow: auto;
}
</style>
