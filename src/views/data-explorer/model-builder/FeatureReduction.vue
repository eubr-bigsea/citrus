<template>
    <div>
        <h5>Redução de features</h5>
        <hr />
        <label for="">Método de redução:</label>

        <select class="form-control w-50 form-control-sm" v-model="reduction.forms.method.value">
            <option v-for="opt in reduction.operation.fieldsMap.get('method').values" :value="opt.key">{{opt.pt}}</option>
        </select>
        <!--
        <option value="">Correção com o alvo</option>
        <option value="">Baseado em árvore</option>
        <option value="">Regressão Lasso</option>
        -->
    </div>
</template>
<script>
    import VueSelect from 'vue-select';
    export default {
        components: { 'v-select': VueSelect, },
        props:{
            reduction: {type: Object, required: true},
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