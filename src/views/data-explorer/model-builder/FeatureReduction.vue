<template>
    <div>
        <h5>Redução de features</h5>
        <hr />
        <label for="">Método de redução:</label> &nbsp;
        <select name="" id="" class="form-control w-50 form-control-sm">
            <option>Sem redução</option>
            <option>Principal Component Analysis - PCA</option>
            <option value="">Correção com o alvo</option>
            <option value="">Baseado em árvore</option>
            <option value="">Regressão Lasso</option>
        </select>

        <div ng-switch-when="CORRELATION" class="ng-scope">
            <div class="alert alert-info">
                Only the features most correlated (Pearson) with the target will be
                selected. A threshold for
                minimum and maximum absolute correlation can be set.
            </div>
            <!-- ngIf: isRegression() -->
            <div ng-if="isRegression()" class="ng-scope">
                <label for="" class="control-label">Minimum absolute correlation</label>
                <div class="controls">
                    <input type="number" ng-model="params.correlation_params.min_abs_correlation" min="0" max="1"
                        class="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-min ng-valid-max">
                </div>
            </div><!-- end ngIf: isRegression() -->
            <!-- ngIf: isRegression() -->
            <div ng-if="isRegression()" class="ng-scope">
                <label for="" class="control-label">Maximum absolute correlation</label>
                <div class="controls">
                    <input type="number" ng-model="params.correlation_params.max_abs_correlation" min="0" max="1"
                        class="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-min ng-valid-max">
                </div>
            </div><!-- end ngIf: isRegression() -->
            <label for="" class="control-label">Number of features to keep</label>
            <div class="controls">
                <input type="number" force-integer="" ng-model="params.correlation_params.n_features" min="1"
                    class="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-min">
            </div>


            <div ng-switch-when="RANDOM_FOREST" class="ng-scope">
                <div class="alert alert-info">
                    This creates a Random Forest model to predict the target. Only
                    the top features according to the feature importances computed by
                    the algorithm will be selected.
                </div>
                <div class="control-group">
                    <label for="" class="control-label">Number of features to
                        keep</label>
                    <div class="controls">
                        <input type="number" force-integer="" ng-model="params.random_forest_params.n_features" min="1"
                            class="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-min">
                    </div>
                </div>

                <div class="control-group">
                    <label for="" class="control-label">Number of trees</label>
                    <div class="controls">
                        <input type="number" force-integer="" ng-model="params.random_forest_params.n_trees" min="1"
                            class="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-min">
                    </div>
                </div>

                <div class="control-group">
                    <label for="" class="control-label">Depth of trees</label>
                    <div class="controls">
                        <input type="number" force-integer="" ng-model="params.random_forest_params.depth" min="1"
                            class="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-min">
                    </div>
                </div>
            </div>

            <div ng-switch-when="LASSO" class="ng-scope">
                <div class="alert alert-info">
                    This creates a LASSO model to predict the target, using 3-fold
                    cross-validation to select the
                    best value of the regularization term. Only the features with
                    nonzero coefficients will be selected.
                </div>
                <label for="" class="control-label">Regularization</label>
                <div class="controls">
                    <input type="text" comma-separated-float-view="" ng-model="params.lasso_params.alpha"
                        class="ng-pristine ng-untouched ng-valid ng-not-empty">
                    <span class="multi-valued-field-marker icon-list-ol" toggle="tooltip" title=""
                        data-original-title="You can specify several values separated by commas (slower)"></span>
                </div>
            </div>
        </div>

        <small class="form-text text-muted">
            Explicação
        </small>
        Parametrizar o método
    </div>
</template>
<script>
    export default {

    }
</script>