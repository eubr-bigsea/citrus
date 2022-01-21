<template>
    <form class="form">
        <h5>Grade de parâmetros</h5>
        <hr />
        <div>
            <label>Estratégia:</label>
            <select class="form-control w-25 form-control-sm" v-model="grid.forms.strategy.value">
                <option v-for="opt in grid.operation.fieldsMap.get('strategy').values" :value="opt.key">{{opt.pt}}
                </option>
            </select>
        </div>
        <ul class="list-unstyled mt-3">
            <li v-if="grid.forms.strategy.value === 'grid' "><strong>Grade (grid): </strong>
                The most classical strategy for optimizing search parameters is called
                “Grid search”. For each hyperparameter, you specify either a list of
                values to test, or a range specification like “5 values equally spaced
                between 30 and 80” or “8 values logarithmically spaced beween 1 and
                1000”.

                DSS tries all combinations of all hyperparameters as discrete “grid
                points”.

                The grid can either be explored in order or in a shuffled order.
                Shuffling the grid tends to find better points earlier on average, which
                is preferable if you want to interrupt search.
            </li>

            <li v-if="grid.forms.strategy.value === 'random' "><strong>Aleatório (random): </strong>
                Instead of exploring discrete points on a grid, random searching
                considers hyperparameters as a continuous spaces and tests
                randomly-chosen points in the hyperparameters space.

                For each hyperparameter, you specify a range to test. DSS will then pick
                random points in the space defined by all parameters and test them.

                A Random search is by nature infinite, so it is mandatory to select a
                maximum number of iterations and/or maximum time before stopping the
                search.
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
        <div v-if="strategy === 'grid' ">
            <b-checkbox v-model="grid.forms.random_grid.value">Randomize grid search</b-checkbox>
            <small>Shuffle the grid before doing the search (using the random state)</small>
            <br />
        </div>
        <div class="row">
            <div class="col-6">
                <label>Semente para números aleatórios (seed):</label>
                <input class="form-control form-control-sm w-25" type="number" min="0" maxlength="12"
                    v-model="grid.forms.seed.value" />
                <small>grid.forms.strategy.value
                    Modify the seed to change hyperparameters sampling
                </small>
                <br />
                <label>Max number of iterations:</label>
                <input class="form-control form-control-sm w-25" type="number" min="0" 
                    maxlength="4" max="9999" v-model="grid.forms.max_iterations.value" />
                <small>
                    Maximum number of iterations for the grid search. 0 means unlimited.
                </small>
            </div>
            <div class="col-6">
                <label>Max search time:</label>
                <input class="form-control form-control-sm w-25" type="number" min="0" maxlength="10"
                    v-model="grid.forms.max_search_time.value" />
                <small>
                    Maximum number of minutes for the grid search. 0 means unlimited.
                </small>
                <br />
                <label>Parallelism:</label>
                <input class="form-control form-control-sm w-25" type="number" min="0" max="999" maxlength="3"
                    v-model="grid.forms.parallelism.value"/>
                <small>
                    0 means auto.
                </small>
            </div>
        </div>
    </form>
</template>
<script>
    export default {
        props: {
            grid: { type: Object, required: true }
        },
        data() {
            return {
                strategy: 'grid',
                seed: null,
                iterations: 0,
                parallelism: 0,
                timeout: 0,
            }
        }
    }
</script>
<style scoped>
    .form>>>label {
        margin-top: 10px
    }
</style>