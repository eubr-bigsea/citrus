<template lang="">
    <div>
        <h5 class="border-bottom pb-3">
            Divisão entre treino e teste
        </h5>
        <div class="row">
            <div class="col-6">
                <b-form-group label="Estratégia de particionamento:" class="mb-3">
                    <select v-model="strategy"
                            class="form-select w-75 form-select-sm">
                        <option v-for="opt in split.operation.fieldsMap.get('strategy').values"
                                :key="opt.key"
                                :value="opt.key">
                            {{opt.pt}}
                        </option>
                    </select>
                    <div class="form-text">
                        Como dividir os dados de entrada entre treino e teste.
                    </div>
                </b-form-group>

                <b-form-group v-if="strategy === 'split'" label="Razão treino/teste:" class="mb-3">
                    <input v-model="ratio"
                           type="number"
                           class="form-control form-control-sm w-25"
                           min="0.01"
                           max="0.99"
                           step="0.01"
                           data-test="ratio"
                           name="ratio">
                    <div class="form-text">
                        Entre 0,01 e 0,99 (1% e 99%). Por exemplo, 0,8 significa 80% dos
                        dados destinados ao treino e 20% ao teste.
                    </div>
                </b-form-group>
                <b-form-group v-if="strategy === 'cross_validation'" label="Número de folds para a validação cruzada:" class="mb-3">
                    <input v-model.number="folds"
                           type="number"
                           class="form-control form-control-sm w-25"
                           min="2"
                           max="100"
                           step="1"
                           maxlength="2"
                           data-test="folds"
                           name="folds">
                    <div class="form-text">
                        Em quantas partes os dados de entrada serão divididos.
                    </div>
                </b-form-group>
                <b-form-group v-if="strategy" label="Semente para números aleatórios (seed):" class="mb-3">
                    <input v-model.number="seed"
                           type="number"
                           class="form-control form-control-sm w-25"
                           min="0"
                           maxlength="15"
                           data-test="seed"
                           name="seed">
                    <div class="form-text">
                        Semente usada para poder repetir o experimento.
                    </div>
                </b-form-group>
            </div>
            <div class="col-6">
                <div v-if="strategy === 'cross_validation' && folds >= 1 && folds <= 20"
                     class="ms-5 mb-1"
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
                                 class="text-center border small"
                                 :class="row === col ? 'bg-success text-white': 'bg-light'"
                                 :style="{width: 'calc(100% / ' + folds + ')'}">
                                {{col}}
                            </div>
                        </template>
                    </div>
                    <div class="mt-3">
                        <div class="badge px-3 p-1 mt-2 me-1 bg-light border text-dark">
                            treino
                        </div>
                        <div class="badge px-3 p-1 mt-2 bg-success border">
                            teste
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const strategy = defineModel('strategy');
const ratio = defineModel('ratio');
const folds = defineModel('folds');
const seed = defineModel('seed');

const props = defineProps({
    split: { type: Object, required: true },
});
const emit = defineEmits(['update-value']);

</script>