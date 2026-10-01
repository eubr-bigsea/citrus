<template>
    <div>
        <h5 class="pb-3 mb-3 border-bottom">
            Algoritmos
        </h5>
        <div class="row">
            <div class="col-md-3 border-start border-end">
                <small>Informe os parâmetros para a execução do algoritmo. <u>Nenhum parâmetro é
                    obrigatório.</u></small>

                <b-list-group class="mb-3 border-bottom">
                    <b-list-group-item v-for="task in algorithms" :key="task.id" class="p-0 ps-2"
                                       :class="{ 'bg-light': selectedAlgorithm === task }">
                        <div class="d-flex w-100 p-1" role="button" @click="handleSelectTask(task)">
                            <b-form-checkbox v-model="task.enabled" switch />
                            {{task.operation?.name || task.name}}
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
                    <p>Não é possível alterar os parâmetros de um algoritmo desabilitado.
                        Habilite-o no seletor à esquerda para editá-los.</p>
                </div>
                <div v-else>
                    <ModelBuilderAlgorithm :key="selectedAlgorithm.operation.slug"
                                           :form="selectedAlgorithm.forms"
                                           @update:form="(v) => selectedAlgorithm.forms = v"
                                           :operation="selectedAlgorithm.operation"
                                           :name="selectedAlgorithm.name"
                                           :grid-strategy="'grid'" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

import ModelBuilderAlgorithm from './ModelBuilderAlgorithm.vue';

import { ref, onMounted, computed } from 'vue';

const props = defineProps({
    tasks: { type: Array, required: true },
    operations: { type: Array, required: true },
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

const handleSelectTask = (task) => {
    selectedAlgorithm.value = task;
};
</script>
<style scoped>
.algorithm {
    height: 75vh;
    overflow: auto;
}
</style>
