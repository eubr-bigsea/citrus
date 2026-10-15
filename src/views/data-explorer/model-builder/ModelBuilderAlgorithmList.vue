<template>
    <div>
        <h5 class="pb-3 mb-3 border-bottom d-flex justify-content-between align-items-end">
            <span>Algoritmos</span>
            <span class="model-count badge rounded-pill fw-normal"
                  :class="totalCombinations > 100 ? 'text-bg-danger' : 'bg-body-secondary text-body-secondary'"
                  title="Total de modelos que serão treinados com os algoritmos habilitados">
                {{totalCombinations}} {{totalCombinations === 1 ? 'modelo' : 'modelos'}}
            </span>
        </h5>
        <div class="row">
            <div class="col-md-3 algorithm-list p-2 rounded">
                <small class="text-muted">Habilite os algoritmos que deseja treinar e comparar.</small>

                <b-list-group flush class="mb-3">
                    <b-list-group-item v-for="task in algorithms" :key="task.id" class="p-0 ps-2 border-0 bg-transparent"
                                       :class="{ 'algorithm-selected': selectedAlgorithm === task }">
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
            <div class="col-md-9 p-3">
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
                <div v-else class="algorithm d-flex flex-column">
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
/* Only this panel scrolls: the same budget the other steps of the screen
   use, so the page itself does not get a second scrollbar. */
/* A count, not a heading: it should not inherit the h5 size. */
.model-count {
    font-size: .75rem;
}

/* Height budget of the step. Only the field list inside the panel scrolls,
   so the hint and the algorithm name stay in place. */
.algorithm {
    max-height: calc(100vh - 320px);
}

/* Separated from the parameter panel by background, not by a border. */
.algorithm-list {
    background-color: #f8f9fa;
}

/* The list is tinted, so the selected row stands out by going back to white. */
.algorithm-selected {
    background-color: #fff;
    border-radius: 4px;
}

.algorithm-selected .algorithm-name {
    font-weight: 600;
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
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}
</style>
