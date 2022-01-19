<template>
    <div>
        <h5>Grade de parâmetros</h5>
        <hr />
        <ul class="list-unstyled">
            <li><strong>Grade (grid): </strong>
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

            <li><strong>Aleatório (random): </strong>
                Instead of exploring discrete points on a grid, random searching
                considers hyperparameters as a continuous spaces and tests
                randomly-chosen points in the hyperparameters space.

                For each hyperparameter, you specify a range to test. DSS will then pick
                random points in the space defined by all parameters and test them.

                A Random search is by nature infinite, so it is mandatory to select a
                maximum number of iterations and/or maximum time before stopping the
                search.
            </li>
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

        </ul>
        ???
        Tempo máximo, número máximo de combinações para random e bayesian

    </div>
</template>
<script>
    export default {

    }
</script>