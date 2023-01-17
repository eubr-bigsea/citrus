<template>
    <div>
        <h5>Tarefa e Métrica</h5>
        <hr>
        <label>Tipo de tarefa de aprendizado de máquina:</label>
        <select v-model="evaluator.forms.task_type.value"
                class="form-control w-50 form-control-sm"
                data-test="type">
            <option v-for="opt in evaluator.operation.fieldsMap.get('task_type').values"
                    :key="opt.key"
                    :value="opt.key">
                {{opt.pt}}
            </option>
        </select>

        <label v-if="evaluator.forms.task_type.value"
               class="mt-3"
               data-test="metric">Otimizar os
            hiperparâmetros para a métrica:</label> &nbsp;
        <select v-if="evaluator.forms.task_type.value === 'binary-classification'"
                v-model="evaluator.forms.bin_metric.value"
                class="form-control w-50 form-control-sm"
                data-test="bin-classification">
            <option v-for="opt in evaluator.operation.fieldsMap.get('bin_metric').values"
                    :key="opt.key"
                    :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="evaluator.forms.task_type.value === 'multiclass-classification'"
                v-model="evaluator.forms.multi_metric.value"
                class="form-control w-50 form-control-sm"
                data-test="multiclass-classification">
            <option v-for="opt in evaluator.operation.fieldsMap.get('multi_metric').values"
                    :key="opt.key"
                    :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="evaluator.forms.task_type.value === 'regression'"
                v-model="evaluator.forms.reg_metric.value"
                class="form-control w-50 form-control-sm"
                data-test="regression">
            <option v-for="opt in evaluator.operation.fieldsMap.get('reg_metric').values"
                    :key="opt.key"
                    :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="evaluator.forms.task_type.value === 'clustering'"
                v-model="evaluator.forms.clust_metric.value"
                class="form-control w-50 form-control-sm"
                data-test="clustering">
            <option v-for="opt in evaluator.operation.fieldsMap.get('clust_metric').values"
                    :key="opt.key"
                    :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
    </div>
</template>
<script>
export default {
    name: 'MetricComponent',
    props: {
        evaluator: { type: Object, default: () => null }
    }
}
</script>