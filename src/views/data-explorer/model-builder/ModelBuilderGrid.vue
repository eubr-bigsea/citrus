<template>
    <div>
        <h5 class="mb-3 border-bottom pb-3">
            Grade de parâmetros
        </h5>
        <div class="row">
            <div class="col-6">
                <form class="form">
                    <div class="mb-3 mt-2">
                        <b-form-group label="Estratégia:">
                            <select v-model="strategy" class="form-select form-select-sm">
                                <option v-for="opt in grid.operation.fieldsMap.get('strategy').values" :key="opt.key"
                                        :value="opt.key">
                                    {{opt.pt}}
                                </option>
                            </select>
                        </b-form-group>
                    </div>

                    <div v-if="strategy === 'grid'">
                        <b-form-checkbox v-model="random_grid">
                            Aleatorizar a busca na grade
                        </b-form-checkbox>
                        <div class="form-text">
                            Aleatoriza a grade antes de realizar a busca
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 mt-2">
                            <b-form-group label="Número máximo de iterações:">
                                <input v-model.number="max_iterations"
                                       class="form-control form-control-sm w-25" type="number" min="0" maxlength="4"
                                       max="9999">
                                <div class="form-text">
                                    Número máximo de iterações (buscas na grade). 0 significa ilimitado para estratégia de grade
                                    e 20
                                    para estratégia aleatória.
                                </div>
                            </b-form-group>
                        </div>
                        <div class="col-12 mt-2">
                            <b-form-group label="Semente para números aleatórios (seed):">
                                <input v-model.number="seed" class="form-control form-control-sm w-25"
                                       type="number" min="0" maxlength="12">
                                <div class="form-text">
                                    Semente usada para aleatorizar a grade, permitindo repetir experimentos.
                                    Se vazio, usa uma semente definida durante a execução.
                                </div>
                            </b-form-group>
                        </div>
                        <div v-if="false" class="col-6">
                            <b-form-group label="Max search time:">
                                <input v-model.number="max_search_time"
                                       class="form-control form-control-sm w-25" type="number" min="0" maxlength="10">
                                <div class="form-text">
                                    Maximum number of minutes for the grid search. 0 means unlimited.
                                </div>
                                <br>
                            </b-form-group>
                            <b-form-group label="Paralelismo:">
                                <input v-model="parallelism" class="form-control form-control-sm w-25"
                                       type="number" min="0" max="999" maxlength="3">
                                <div class="form-text">
                                    0 significa 'auto'.
                                </div>
                            </b-form-group>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-6">
                <ul class="list-unstyled mt-3">
                    <li v-if="strategy === 'grid'">
                        <strong>Grade (grid): </strong>
                        Estratégia de otimização de parâmetros onde, para cada hiperparâmetro,
                        é especificada um conjunto ou faixa de valores a serem testados (veja a seção de parâmetros para
                        os
                        algoritmos).
                        Por exemplo, pode ser um conjunto como
                        <code>{2, 4, 8, 16, 20}</code>, ou uma faixa, como valores entre <code>[0.0, 1.0]</code>. Neste
                        caso,
                        também é necessário
                        informar a quantidade de valores a serem gerados e qual a função a ser usada (linear,
                        logaritmica, etc).
                        Os valores gerados por faixas são igualmente espaçados.
                        <br>
                        Uma vez definidos os valores, serão testadas todas as suas possíveis combinações, em uma grade
                        discreta
                        de pontos.
                        A grade pode ser explorada em ordem, ou aleatorizada (veja parâmetro abaixo).
                        Em geral, aleatorizar a grade, em média, tende a encontrar os melhores pontos mais cedo, o que é
                        interessante
                        quando você quer interromper a busca (seja por limite de iterações ou por tempo).
                    </li>

                    <li v-if="strategy === 'random'">
                        <strong>Aleatório (random): </strong>
                        <div class="alert alert-danger">
                            <font-awesome-icon icon="fa fa-info-circle" /> Esta opção está em estágio de testes nesta
                            implementação do Lemonade.
                        </div>
                        Busca pontos na grade, considerando a faixa dos hiperparâmetros como espaços
                        contínuos (você deve especificar uma faixa de valores).
                        Um ponto nesse espaço de hiperparâmetros é sorteado aleatoriamente e então
                        testado.
                        A busca aleatória por definição é infinita, portanto é obrigatório selecionar o
                        número máximo de iterações a fim de interromper a busca.
                    </li>
                    <!--
                    <li>
                        <strong>Bayesiano (Bayesian): </strong>
                        Bayesian search starts like a Random search, but as new points in the
                        hyperparameters space are tried, a predictive model is trained in order
                        to model the search space. This predictive model is used to refine the
                        search in order to focus on the most promising parts of the
                        hyperparameters search, in order to reach a good set of hyperparameters
                        faster.

                        DSS bayesian search leverages a dedicated python package,
                        scikit-optimize, and therefore requires to run on a code-env, with the
                        appropriate packages installed. To do so, you need to:

                        Create a new code environment

                        Go to the “Packages to install” tab of this code-env and click on “Add
                        sets of packages”

                        Select “Visual Machine Learning with Bayesian search (scikit-learn,
                        XGBoost, scikit-optimize)” and click “Add”

                        Update your code-env
                    </li>
                    -->
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';

const strategy = defineModel('strategy');
const random_grid = defineModel('random_grid');
const max_iterations = defineModel('max_iterations');
const max_search_time = defineModel('max_search_time');
const parallelism = defineModel('parallelism');
const seed = defineModel('seed');

const props = defineProps({
    grid: { type: Object, required: true }
});
const emit = defineEmits(['update-value']);
const errors = {};

const validation = computed(() => this.errors);
/*watch: {
    copy: {
        deep: true,
            handler(newValues) {
            this.$emit('update-value', newValues);
        }
    },
    'seed'() {
        if (!this.seed) {
            this.errors['seed'] = { error: 'required' };
        } else {
            delete this.errors['seed'];
        }
    }
}*/

</script>
