<template>
    <div>
        <h5>Tarefa e Métrica</h5>
        <hr>
        <label>Tipo de tarefa de aprendizado de máquina:</label>
        <select v-model="task_type" class="form-control w-50 form-control-sm" data-test="type">
            <option v-for="opt in copy.operation.fieldsMap.get('task_type').values" :key="opt.key" :value="opt.key">
                {{ opt.pt }}
            </option>
        </select>

        <label v-if="task_type" class="mt-3" data-test="metric">Otimizar os
            hiperparâmetros para a métrica:</label> &nbsp;
        <select v-if="task_type === 'binary-classification'" v-model="bin_metric" class="form-control w-50 form-control-sm"
            data-test="bin-classification">
            <option v-for="opt in copy.operation.fieldsMap.get('bin_metric').values" :key="opt.key" :value="opt.key">
                {{ opt.pt }}
            </option>
        </select>
        <select v-else-if="task_type === 'multiclass-classification'" v-model="multi_metric"
            class="form-control w-50 form-control-sm" data-test="multiclass-classification">
            <option v-for="opt in copy.operation.fieldsMap.get('multi_metric').values" :key="opt.key" :value="opt.key">
                {{ opt.pt }}
            </option>
        </select>
        <select v-else-if="task_type === 'regression'" v-model="reg_metric" class="form-control w-50 form-control-sm"
            data-test="regression">
            <option v-for="opt in copy.operation.fieldsMap.get('reg_metric').values" :key="opt.key" :value="opt.key">
                {{ opt.pt }}
            </option>
        </select>
        <select v-else-if="task_type === 'clustering'" v-model="clust_metric" class="form-control w-50 form-control-sm"
            data-test="clustering">
            <option v-for="opt in copy.operation.fieldsMap.get('clust_metric').values" :key="opt.key" :value="opt.key">
                {{ opt.pt }}
            </option>
        </select>
    </div>
</template>
<script setup>

const task_type = defineModel('task_type');
const bin_metric = defineModel('bin_metric');
const multi_metric = defineModel('multi_metric');
const reg_metric = defineModel('reg_metric');
const clust_metric = defineModel('clust_metric');

const props = defineProps({
    evaluator: { type: Object, default: () => null }
});
</script>