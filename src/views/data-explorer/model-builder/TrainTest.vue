<template lang="">
    <div>
        <h5>Divisão entre treino e teste</h5>
        <hr />
        <label for="">Estratégia de particionamento:</label> &nbsp;
        <select id="" v-model="split.forms.strategy.value" name="" class="form-control w-50 form-control-sm">
            <option></option>
            <option v-for="opt in split.operation.fieldsMap.get('strategy').values" 
                :key="opt.key" :value="opt.key">{{opt.pt}}</option>
        </select>
        <small class="form-text text-muted mb-3">
            Como dividir os dados de entrada entre treino e teste.
        </small>

        <template v-if="split.forms.strategy.value === 'split'">

            <label for="">Razão treino/teste:</label> &nbsp;
            <input v-model="split.forms.ratio.value" type="number" class="form-control form-control-sm w-10" min="0.01" max="0.99"
                step="0.01">
            <small class="form-text text-muted mb-3">
                Entre 0,01 e 0,99 (1% e 99%). Por exemplo, 0,8 significa 80% dos
                dados destinados ao treino e 20% ao teste.
            </small>

        </template>
        <template v-if="split.forms.strategy.value === 'cross_validation'">
            <label for="">Número de <em>folds</em> para a validação cruzada:</label> &nbsp;
            <input v-model="split.forms.folds.value" type="number" class="form-control form-control-sm w-10" min="2" max="100" step="1"
                maxlength="2">
            <small class="form-text text-muted mb-3">
                Em quantas partes os dados de entrada serão divididos.
            </small>
            <!-- TODO component showing cross-validation -->
        </template>
        <template v-if="split.forms.strategy.value">
            <label for="">Semente para números aleatórios (seed):</label> &nbsp;
            <input v-model="split.forms.seed.value" type="number" class="form-control form-control-sm w-25" min="0"
                maxlength="15">
            <small class="form-text text-muted mb-3">
                Semente usada para poder repetir o experimento.
            </small>
        </template>
    </div>
</template>
<script>
    export default {
        props: {
            split: { type: Object, required: true }
        },
        data() {
            return {
                strategy: 'split',
                folds: 10,
            }
        }
    }
</script>
