<template>
    <div>
        <h5>Tarefa e Métrica</h5>
        <hr>
        <label>Tipo de tarefa de aprendizado de máquina:</label>
        <select v-model.lazy="taskTypeInternal" class="form-select w-50 form-select-sm" data-test="type" @change="changeType">
            <option v-for="opt in evaluator.operation.fieldsMap.get('task_type').values" :key="opt.key" :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <div class="form-text text-danger">
            <font-awesome-icon icon="fa fa-warning" />
            Alterar o tipo de tarefa de um experimento existente pode fazer com que ele pare de funcionar!
        </div>

        <label v-if="taskType" class="mt-3" data-test="metric">Otimizar os
            hiperparâmetros para a métrica:</label> &nbsp;
        <select v-if="taskType === 'binary-classification'" :value="binaryMetric" @change="(e) => $emit('update:binaryMetric', e.target.value)" class="form-select w-50 form-select-sm"
                data-test="bin-classification">
            <option v-for="opt in evaluator.operation.fieldsMap.get('bin_metric').values" :key="opt.key" :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="taskType === 'multiclass-classification'" :value="multiClassMetric" @change="(e) => $emit('update:multiClassMetric', e.target.value)"
                class="form-select w-50 form-select-sm" data-test="multiclass-classification">
            <option v-for="opt in evaluator.operation.fieldsMap.get('multi_metric').values" :key="opt.key" :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="taskType === 'regression'" :value="regressionMetric" @change="(e) => $emit('update:regressionMetric', e.target.value)" class="form-select w-50 form-select-sm"
                data-test="regression">
            <option v-for="opt in evaluator.operation.fieldsMap.get('reg_metric').values" :key="opt.key" :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="taskType === 'clustering'" :value="clusteringMetric" @change="(e) => $emit('update:clusteringMetric', e.target.value)" class="form-select w-50 form-select-sm"
                data-test="clustering">
            <option v-for="opt in evaluator.operation.fieldsMap.get('clust_metric').values" :key="opt.key" :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
    </div>
</template>
<script setup>
import {ref, getCurrentInstance, watch} from 'vue';
import useNotifier from '@/composables/useNotifier.js';

const props = defineProps({
    evaluator: { type: Object, default: () => null },
    taskType: { type: String, default: 'classification' },
    binaryMetric: { type: String, default: '' },
    multiClassMetric: { type: String, default: '' },
    regressionMetric: { type: String, default: '' },
    clusteringMetric: { type: String, default: '' },
});

const emit = defineEmits(['update:taskType', 'update:binaryMetric', 'update:multiClassMetric', 'update:regressionMetric', 'update:clusteringMetric']);

const taskTypeInternal = ref(props.taskType);

const vm = getCurrentInstance();
const { confirm } = useNotifier(vm.proxy);

const changeType = (v) => {
    confirm('Alteração do tipo da tarefa',
        'Alterar esta opção pode fazer com que o experimento pare de funcionar. Continuar?',
        () => {emit('update:taskType', taskTypeInternal.value); });
};
</script>