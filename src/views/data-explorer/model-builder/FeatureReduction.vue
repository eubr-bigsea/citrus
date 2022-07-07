<template>
    <div>
        <h5>Redução de features</h5>
        <hr />
        <div class="alert alert-info">
            <font-awesome-icon icon="fa fa-exclamation-circle" /> A redução usando PCA aplica-se somente a atributos marcados
            como numéricos.
        </div>
        <label for="">Método de redução:</label>

        <select v-model="reduction.forms.method.value" class="form-control w-50 form-control-sm mb-3">
            <option v-for="opt in reduction.operation.fieldsMap.get('method').values" 
                :key="opt.key"
                :value="opt.key">{{opt.pt}}
            </option>
        </select>

        <template v-if="reduction.forms.method.value === 'pca'">
            <label>Número de componentes principais (k):</label>
            <input v-model="reduction.forms.k.value" type="number" class="form-control form-control-sm w-10"
                maxlength="4" step="1" min="2" />
        </template>
        <!--
        <option value="">Correção com o alvo</option>
        <option value="">Baseado em árvore</option>
        <option value="">Regressão Lasso</option>
        -->
    </div>
</template>
<script>
    export default {
        props: {
            reduction: { type: Object, required: true },
        },
        data() {
            return {
                options: [
                    { value: '', label: 'Sem redução', description: '' },
                    {
                        value: "pca", label: 'Principal Component Analysis - PCA',
                        description: 'Apenas os componentes principais melhor avaliados serão selecionados.',
                        complement: 'Ajuda a gerar modelos com melhor desempenho, mas menos interpretáveis'
                    }
                ]
            }
        }
    }
</script>
