<template>
    <div>
        <h5 class="pb-3 mb-3 border-bottom d-flex justify-content-between align-items-end">
            <span>Algoritmos</span>
            <small class="fw-normal" :class="totalCombinations > 100 ? 'text-danger' : 'text-muted'"
                   title="Total de modelos que serão treinados com os algoritmos habilitados">
                {{totalCombinations}} {{totalCombinations === 1 ? 'modelo' : 'modelos'}} no total
            </small>
        </h5>
        <div class="row">
            <div class="col-md-3 border-start border-end">
                <small class="text-muted">Habilite os algoritmos que deseja treinar e comparar.</small>

                <b-list-group class="mb-3 border-bottom">
                    <b-list-group-item v-for="task in algorithms" :key="task.id" class="p-0 ps-2"
                                       :class="{ 'bg-light': selectedAlgorithm === task }">
                        <div class="d-flex w-100 p-1 align-items-center">
                            <b-form-checkbox v-model="task.enabled" switch
                                             :aria-label="`Habilitar ${task.operation?.name || task.name}`" />
                            <button type="button" class="algorithm-name flex-grow-1 text-start"
                                    :aria-current="selectedAlgorithm === task ? 'true' : null"
                                    @click="handleSelectTask(task)">
                                {{task.operation?.name || task.name}}
                            </button>
                            <small v-if="task.enabled" class="text-muted ms-1 text-nowrap">
                                {{combinationsFor(task)}}&times;
                            </small>
                        </div>
                    </b-list-group-item>
                </b-list-group>
            </div>
            <div class="col-md-9 p-3 algorithm scroll-area">
                <div v-if="!selectedAlgorithm?.operation" class="text-center text-secondary mt-5 pt-5">
                    <h4>Selecione um algoritmo à esquerda para editar seus parâmetros.</h4>
                </div>
                <div v-else-if="!selectedAlgorithm.enabled" class="text-center text-secondary mt-5 pt-5">
                    <h4>{{selectedAlgorithm.operation.name}} está desabilitado</h4>
                    <p>
                        Não é possível alterar os parâmetros de um algoritmo desabilitado.
                        Habilite-o no seletor à esquerda para editá-los.
                    </p>
                </div>
                <div v-else>
                    <small class="text-muted">
                        Informe os parâmetros para a execução do algoritmo. Nenhum parâmetro é obrigatório.
                    </small>
                    <ModelBuilderAlgorithm :key="selectedAlgorithm.operation.slug"
                                           :form="selectedAlgorithm.forms"
                                           :operation="selectedAlgorithm.operation"
                                           :name="selectedAlgorithm.name"
                                           :grid-strategy="gridStrategy"
                                           @update:form="(v) => selectedAlgorithm.forms = v" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

import ModelBuilderAlgorithm from './ModelBuilderAlgorithm.vue';

import { ref, onMounted, computed } from 'vue';
import { countCombinations } from './combinations.js';

const props = defineProps({
    tasks: { type: Array, required: true },
    operations: { type: Array, required: true },
    gridStrategy: { type: String, default: 'grid' },
});

const algorithms = ref([]);
const selectedAlgorithm = ref({});

onMounted(() => {
    const tasksLookup = new Map((props.tasks || []).map((task) => [task.operation.slug, task]));

    // Build algorithms list from operations, creating tasks for the missing ones
    algorithms.value = (props.operations || []).map((op) => {
        if (tasksLookup.has(op.slug)) {
            return tasksLookup.get(op.slug);
        }
        const task = op.createTask({ name: op.name });
        task.enabled = false;
        return task;
    });

    // Select first algorithm by default
    if (algorithms.value && algorithms.value.length > 0) {
        selectedAlgorithm.value = algorithms.value[0];
    }
});

const combinationsFor = (task) => countCombinations(task.operation, task.forms);

// Only enabled algorithms are trained, so they are what costs time.
const totalCombinations = computed(() => algorithms.value
    .filter((task) => task.enabled)
    .reduce((total, task) => total + combinationsFor(task), 0));

const handleSelectTask = (task) => {
    selectedAlgorithm.value = task;
};
</script>
<style scoped>
.algorithm {
    height: 75vh;
    overflow: auto;
}

/* Selecting an algorithm is a real button so it is reachable by keyboard,
   but it should read as a list row. */
.algorithm-name {
    background: none;
    border: 0;
    padding: 0 0 0 .25rem;
    color: inherit;
    font: inherit;
}

.algorithm-name:focus-visible {
    outline: 2px solid #86b7fe;
    outline-offset: 2px;
}
</style>
