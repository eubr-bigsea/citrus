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
        <select v-if="taskType === 'binary-classification'" v-model="binaryMetric" class="form-select w-50 form-select-sm"
                data-test="bin-classification">
            <option v-for="opt in evaluator.operation.fieldsMap.get('bin_metric').values" :key="opt.key" :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="taskType === 'multiclass-classification'" v-model="multiClassMetric"
                class="form-select w-50 form-select-sm" data-test="multiclass-classification">
            <option v-for="opt in evaluator.operation.fieldsMap.get('multi_metric').values" :key="opt.key" :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="taskType === 'regression'" v-model="regressionMetric" class="form-select w-50 form-select-sm"
                data-test="regression">
            <option v-for="opt in evaluator.operation.fieldsMap.get('reg_metric').values" :key="opt.key" :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="taskType === 'clustering'" v-model="clusteringMetric" class="form-select w-50 form-select-sm"
                data-test="clustering">
            <option v-for="opt in evaluator.operation.fieldsMap.get('clust_metric').values" :key="opt.key" :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
    </div>
</template>
<script setup>
import {ref, inject} from 'vue';
import Notifier from '@/notifier.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const taskType = defineModel('taskType');
const binaryMetric = defineModel('binaryMetric');
const multiClassMetric = defineModel('multiClassMetric');
const regressionMetric = defineModel('regressionMetric');
const clusteringMetric = defineModel('clusteringMetric');

const taskTypeInternal = ref(taskType.value);

const props = defineProps({
    evaluator: { type: Object, default: () => null }
});
const notifier = new Notifier(inject('snotify'), t);

const changeType = (v) => {
    notifier.confirm('Alteração do tipo da tarefa', 
        'Alterar esta opção pode fazer com que o experimento pare de funcionar. Continuar?', 
        () => {taskType.value = taskTypeInternal.value; });   
};
</script>