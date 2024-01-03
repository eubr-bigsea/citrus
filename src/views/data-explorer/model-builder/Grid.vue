<template>
    <div class="row">
        <div class="col-12 border-bottom">
            <h5>Grade de parâmetros</h5>
        </div>
        <div class="col-6">
            <form class="form">
                <div class="mb-3 mt-2">
                    <label>Estratégia:</label>
                    <select v-model="copy.forms.strategy.value" class="form-control form-control-sm">
                        <option v-for="opt in grid.operation.fieldsMap.get('strategy').values" :key="opt.key"
                                :value="opt.key">
                            {{opt.pt}}
                        </option>
                    </select>
                </div>

                <div v-if="copy.forms.strategy.value === 'grid'">
                    <b-checkbox v-model="copy.forms.random_grid.value">
                        Aleatorizar a busca na grade
                    </b-checkbox>
                    <small>Aleatoriza a grade antes de realizar a busca</small>
                    <br>
                </div>
                <div class="row">
                    <div class="col-12 mt-2">
                        <label>Número máximo de iterações:</label>
                        <input v-model.number="copy.forms.max_iterations.value" class="form-control form-control-sm w-25"
                               type="number" min="0" maxlength="4" max="9999">
                        <small>
                            Número máximo de iterações (buscas na grade). 0 significa ilimitado para estratégia de grade
                            e 20
                            para estratégia aleatória.
                        </small>
                    </div>
                    <div class="col-12 mt-2">
                        <label>Semente para números aleatórios (seed):</label>
                        <input v-model.number="copy.forms.seed.value" class="form-control form-control-sm w-25"
                               type="number" min="0" maxlength="12">
                        <small>Semente usada para aleatorizar a grade, permitindo repetir experimentos.
                            Se vazio, usa uma semente definida durante a execução.</small>
                    </div>
                    <div v-if="false" class="col-6">
                        <label>Max search time:</label>
                        <input v-model.number="copy.forms.max_search_time.value" class="form-control form-control-sm w-25"
                               type="number" min="0" maxlength="10">
                        <small>
                            Maximum number of minutes for the grid search. 0 means unlimited.
                        </small>
                        <br>
                        <label>Parallelism:</label>
                        <input v-model="copy.forms.parallelism.value" class="form-control form-control-sm w-25"
                               type="number" min="0" max="999" maxlength="3">
                        <small>
                            0 means auto.
                        </small>
                    </div>
                </div>
            </form>
        </div>
        <div class="col-6">
            {{errors}}
            <ul class="list-unstyled mt-3">
                <li v-if="copy.forms.strategy.value === 'grid'">
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

                <li v-if="copy.forms.strategy.value === 'random'">
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
</template>
<script>
export default {
    name: 'GridComponent',
    props: {
        grid: { type: Object, required: true }
    },
    emits: ['update-value'],
    data() {
        return {
            errors: {},
            copy: { ... this.grid }
        };
    },

    computed: {
        validation() {
            return this.errors;
        }
    },
    watch: {
        copy: {
            deep: true,
            handler(newValues) {
                this.$emit('update-value', newValues);
            }
        },
        'copy.forms.seed.value'() {
            if (!this.copy.forms.seed.value) {
                this.errors['seed'] = { error: 'required' };
            } else {
                delete this.errors['seed'];
            }
        }
    }
};
</script>
