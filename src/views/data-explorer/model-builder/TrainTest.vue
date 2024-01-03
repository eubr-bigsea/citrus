<template lang="">
    <div class="row">
        <div class="col-12">
            <h5>Divisão entre treino e teste</h5>
            <hr>
        </div>
        <div class="col-6">
            <label for="">Estratégia de particionamento:</label> &nbsp;
            <select v-model="copy.forms.strategy.value"
                    class="form-control w-75 form-control-sm">
                <option v-for="opt in split.operation.fieldsMap.get('strategy').values"
                        :key="opt.key"
                        :value="opt.key">
                    {{opt.pt}}
                </option>
            </select>
            <small class="form-text text-muted mb-3">
                Como dividir os dados de entrada entre treino e teste.
            </small>

            <template v-if="copy.forms.strategy.value === 'split'">
                <label for="ratio">Razão treino/teste:</label> &nbsp;
                <input v-model="copy.forms.ratio.value"
                       type="number"
                       class="form-control form-control-sm w-25"
                       min="0.01"
                       max="0.99"
                       step="0.01"
                       data-test="ratio"
                       name="ratio">
                <small class="form-text text-muted mb-3">
                    Entre 0,01 e 0,99 (1% e 99%). Por exemplo, 0,8 significa 80% dos
                    dados destinados ao treino e 20% ao teste.
                </small>
            </template>
            <template v-if="copy.forms.strategy.value === 'cross_validation'">
                <label for="folds">Número de <em>folds</em> para a validação cruzada:</label> &nbsp;
                <input v-model.number="copy.forms.folds.value"
                       type="number"
                       class="form-control form-control-sm w-25"
                       min="2"
                       max="100"
                       step="1"
                       maxlength="2"
                       data-test="folds"
                       name="folds">
                <small class="form-text text-muted mb-3">
                    Em quantas partes os dados de entrada serão divididos.
                </small>
            </template>
            <template v-if="copy.forms.strategy.value">
                <label for="seed">Semente para números aleatórios (seed):</label> &nbsp;
                <input v-model.number="copy.forms.seed.value"
                       type="number"
                       class="form-control form-control-sm w-25"
                       min="0"
                       maxlength="15"
                       data-test="seed"
                       name="seed">
                <small class="form-text text-muted mb-3">
                    Semente usada para poder repetir o experimento.
                </small>
            </template>
        </div>
        <div class="col-6">
            <div v-if="copy.forms.strategy.value === 'cross_validation' && folds >= 1 && folds <= 20"
                 class="ml-5 mb-1"
                 data-test="example">
                <label>Como ficará a divisão</label>
                <div v-for="row in folds"
                     :key="row"
                     class="row">
                    <div v-if="row === (folds - 1) && folds > 3"
                         class="w-100 text-center">
                        ...
                    </div>
                    <template v-for="col in folds">
                        <div v-if="row < 4 || row > folds - 2"
                             :key="col"
                             class="text-center border"
                             :class="row === col ? 'bg-success text-white': 'bg-light'"
                             :style="{width: 'calc(100% / ' + folds + ')'}">
                            {{col}}
                        </div>
                    </template>
                </div>
                <div class="mt-3">
                    <div class="badge p-1 mt-2 mr-1 badge-light border text-dark">
                        treino
                    </div>
                    <div class="badge p-1 mt-2 badge-success border">
                        teste
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        split: { type: Object, required: true },
    },
    emits: ['update-value'],
    data() {
        return {
            copy: { ... this.split }
        };
    },
    computed: {
        folds() {
            return parseInt(this.copy.forms.folds.value || 0);
        },
    },
    watch: {
        copy: {
            deep: true,
            handler(newValues) {
                this.$emit('update-value', newValues);
            }
        }
    }
};
</script>