<template>
    <div>
        <h5 class="pb-3 border-bottom">
            Redução de features
        </h5>
        <div class="row">
            <div class="col-4">
                <b-form-group label="Método de redução:">
                    <select v-model="method" class="form-select form-select-sm mb-3" data-test="reduction">
                        <option v-for="opt in reduction.operation.fieldsMap.get('method').values" :key="opt.key"
                                :value="opt.key">
                            {{opt.pt}}
                        </option>
                    </select>
                </b-form-group>

                <b-form-group v-if="method === 'pca'" label="Número de componentes principais (k):">
                    <input v-model.number="k" type="number" class="form-control form-control-sm w-25" maxlength="4"
                           step="1"
                           min="2">
                </b-form-group>
            </div>
            <div class="col-8">
                <div v-if="method !== 'disabled' && selected !== undefined">
                    <h5>{{selected.label}}</h5>
                    {{selected.description}}
                    {{selected.complement}}
                </div>
            </div>
        </div>
        <!--
        <option value="">Correção com o alvo</option>
        <option value="">Baseado em árvore</option>
        <option value="">Regressão Lasso</option>
        -->
    </div>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({
    reduction: { type: Object, required: true },
});

// A workflow saved before a field was introduced has no entry for it in forms.
const field = (name) => computed({
    get: () => props.reduction.forms[name]?.value,
    set: (value) => {
        if (props.reduction.forms[name]) {
            props.reduction.forms[name].value = value;
        } else {
            props.reduction.forms[name] = { value };
        }
    }
});

const method = field('method');
const k = field('k');

const options = [
    { value: '', label: 'Sem redução', description: '' },
    {
        value: "pca", label: 'Principal Component Analysis - PCA',
        description: 'Apenas os componentes principais melhor avaliados serão selecionados.',
        complement: 'Ajuda a gerar modelos com melhor desempenho, mas menos interpretáveis. ' +
            'A redução usando PCA aplica-se somente a atributos marcados como numéricos.'
    }
];
const selected = computed(() =>
    options.find((opt) => opt.value === method.value)
);
</script>