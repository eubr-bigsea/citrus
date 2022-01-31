<template>
    <div>
        <h5>Tarefa e Métrica</h5>
        <hr />
        <label>Tipo de tarefa de aprendizado de máquina:</label>
        <select name="" id="" class="form-control w-25 form-control-sm" v-model="evaluator.forms.task_type.value">
            <option v-for="opt in evaluator.operation.fieldsMap.get('task_type').values" :value="opt.key">{{opt.pt}}</option>
        </select>

        <label class="mt-3" v-if="evaluator.forms.task_type.value && evaluator.forms.task_type.value !== 'clustering'">Otimizar os
            hiperparâmetros para a métrica:</label> &nbsp;
        <select v-if="evaluator.forms.task_type.value === 'binary-classification'" class="form-control w-50 form-control-sm"
            v-model="evaluator.forms.bin_metric.value">
            <option v-for="opt in evaluator.operation.fieldsMap.get('bin_metric').values" :value="opt.key">{{opt.pt}}
            </option>
        </select>
        <select v-if="evaluator.forms.task_type.value === 'multiclass-classification'"
            class="form-control w-50 form-control-sm" v-model="evaluator.forms.multi_metric.value">
            <option v-for="opt in evaluator.operation.fieldsMap.get('multi_metric').values" :value="opt.key">{{opt.pt}}
            </option>
        </select>
        <select v-if="evaluator.forms.task_type.value === 'regression'" class="form-control w-50 form-control-sm"
            v-model="evaluator.forms.reg_metric.value">
            <option v-for="opt in evaluator.operation.fieldsMap.get('reg_metric').values" :value="opt.key">{{opt.pt}}
            </option>
        </select>
    </div>
</template>
<script>
    export default {
        props: {
            taskType: { type: String },
            evaluator: { type: Object }
        },
        data() {
            return {
                metric: null,
            }
        }
    }
</script>