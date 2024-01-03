<template>
    <div>
        <h5>Tarefa e Métrica</h5>
        <hr>
        <label>Tipo de tarefa de aprendizado de máquina:</label>
        <select v-model="copy.forms.task_type.value"
                class="form-control w-50 form-control-sm"
                data-test="type">
            <option v-for="opt in copy.operation.fieldsMap.get('task_type').values"
                    :key="opt.key"
                    :value="opt.key">
                {{opt.pt}}
            </option>
        </select>

        <label v-if="copy.forms.task_type.value"
               class="mt-3"
               data-test="metric">Otimizar os
            hiperparâmetros para a métrica:</label> &nbsp;
        <select v-if="copy.forms.task_type.value === 'binary-classification'"
                v-model="copy.forms.bin_metric.value"
                class="form-control w-50 form-control-sm"
                data-test="bin-classification">
            <option v-for="opt in copy.operation.fieldsMap.get('bin_metric').values"
                    :key="opt.key"
                    :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="copy.forms.task_type.value === 'multiclass-classification'"
                v-model="copy.forms.multi_metric.value"
                class="form-control w-50 form-control-sm"
                data-test="multiclass-classification">
            <option v-for="opt in copy.operation.fieldsMap.get('multi_metric').values"
                    :key="opt.key"
                    :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="copy.forms.task_type.value === 'regression'"
                v-model="copy.forms.reg_metric.value"
                class="form-control w-50 form-control-sm"
                data-test="regression">
            <option v-for="opt in copy.operation.fieldsMap.get('reg_metric').values"
                    :key="opt.key"
                    :value="opt.key">
                {{opt.pt}}
            </option>
        </select>
        <select v-else-if="copy.forms.task_type.value === 'clustering'"
                v-model="copy.forms.clust_metric.value"
                class="form-control w-50 form-control-sm"
                data-test="clustering">
            <option v-for="opt in copy.operation.fieldsMap.get('clust_metric').values"
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
    },
    emits: ['update-value'], 
    data() {
        return {copy: {...this.evaluator}};
    },
    watch: {
        copy: {
            deep: true,
            handler(newValues) {
                this.$emit('update-value', newValues);
            }
        }
    },
};
</script>