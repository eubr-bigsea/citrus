<template lang="">
    <div>
        <div>
            <div class="d-flex justify-content-between align-items-center border-bottom">
                <h1>Criar modelo de {{$t('dataExplorer.task.' + taskName).toLowerCase()}}</h1>
                <form class="float-right form-inline w-50 d-flex justify-content-end">
                    <label class="sr-only">{{$tc('common.name')}}:</label>
                    <input type="text" class="form-control form-control-sm w-50" :placeholder="$tc('common.name')"
                        v-model="name">
                    <button class="btn btn-sm btn-outline-success ml-1 float-right"><span class="fa fa-save"></span>
                        {{$t('actions.save')}}</button>
                    <button class="btn btn-sm btn-outline-primary ml-1 float-right"><span class="fa fa-play"></span>
                        {{$t('actions.execute')}}</button>
                </form>
            </div>
            <div class="custom-card">
                <b-tabs class="p-2 custom-tab" align="center">
                    <b-tab title="Parâmetros" class="m-1 parameters">
                        <div class="row size-full">
                            <div class="col-md-3 col-lg-2 border-right">
                                <div class="explorer-nav p-1">
                                    <b-nav vertical>
                                        <b-nav-text class="header">Entrada</b-nav-text>
                                        <b-nav-item :class="{active: selected === 'target'}"
                                            @click.prevent="edit('target')">Dados</b-nav-item>
                                        <b-nav-item :class="{active: selected === 'data'}"
                                            @click.prevent="edit('data')">Divisão entre treino e teste</b-nav-item>
                                        <b-nav-item :class="{active: selected === 'metric'}"
                                            @click.prevent="edit('metric')">Métrica</b-nav-item>

                                        <b-nav-text class="header">Atributos (Features)</b-nav-text>
                                        <b-nav-item :class="{active: selected === 'adjusts'}"
                                            @click.prevent="edit('adjusts')">Seleção e ajustes</b-nav-item>
                                        <b-nav-item :class="{active: selected === 'generation'}"
                                            @click.prevent="edit('generation')">Geração</b-nav-item>
                                        <b-nav-item :class="{active: selected === 'reduction'}"
                                            @click.prevent="edit('reduction')">Redução</b-nav-item>

                                        <b-nav-text class="header">Ajustes do Modelo</b-nav-text>
                                        <b-nav-item :class="{active: selected === 'algorithms'}"
                                            @click.prevent="edit('algorithms')">Algoritmos e hiperparâmetros
                                        </b-nav-item>
                                        <b-nav-item :class="{active: selected === 'hyperparameters'}"
                                            @click.prevent="edit('hyperparameters')">Grade de parâmetros</b-nav-item>

                                        <b-nav-text class="header">Avançado</b-nav-text>
                                        <b-nav-item :class="{active: selected === 'weighting'}"
                                            @click.prevent="edit('weighting')">Estratégia de ponderação</b-nav-item>
                                        <b-nav-item :class="{active: selected === 'runtime'}"
                                            @click.prevent="edit('runtime')">Ambiente de processamento</b-nav-item>
                                    </b-nav>
                                </div>
                            </div>
                            <div class="col-md-9 col-lg-10 pl-4 pr-4 bg-white ">
                                <form action="" class="form p-2">
                                    <template v-if="selected === 'target'">
                                        <h5>Dados</h5>
                                        <hr />

                                        <label for="">Fonte de dados:</label> &nbsp;
                                        <vue-select @search="loadDataSourceList" :filterable="false"
                                            :options="dataSourceList" label="name" v-model="dataSource"
                                            @input="retrieveAttributes" class="w-50">
                                            <template v-slot:no-options="{ search, searching }">
                                                <small>Digite parte do nome pesquisar ...</small>
                                            </template>
                                            <template slot="option" slot-scope="option">
                                                <div class="d-center">
                                                    <span class="span-id">{{ pad(option.id, 4, '&nbsp;') }}</span> - {{
                                                    option.name }}
                                                </div>
                                            </template>
                                            <template slot="selected-option" slot-scope="option">
                                                <div class="selected d-center">
                                                    {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                                </div>
                                            </template>
                                        </vue-select>
                                        <small class="form-text text-muted">
                                            Fonte de dados para treino e teste do modelo. Alterar a fonte de dados de um
                                            experimento
                                            existente pode fazer com que ele pare de funcionar!
                                        </small>

                                        <template v-if="supervisioned">
                                            <label class=" mt-2">Escolha o atributo alvo (rótulo):</label>
                                            <vue-select :options="attributes" v-model="labelAttribute"
                                                :searchable="true" />
                                            TODO: adicionar um gráfico com a distribuição dos dados segundo o alvo
                                        </template>

                                        <h6 class="mt-4">Amostragem</h6>

                                        <label for="">Forma de amostragem:</label> &nbsp;
                                        <select name="" id="" class="form-control w-50 form-control-sm">
                                            <option value="">Sem amostragem</option>
                                            <option value="">Primeiros registros</option>
                                            <option value="">X% aproximadamente</option>
                                            <option value="">Classe rebalanceadas (quantidade)</option>
                                            <option value="">Classe rebalanceadas (percentual)</option>
                                        </select>
                                        <small class="form-text text-muted">
                                            Como gerar a amostra dos dados.
                                        </small>

                                        <label for="">Total de registros:</label> &nbsp;
                                        <input type="text" class="form-control form-control-sm w-25">
                                        <small class="form-text text-muted">
                                            Total de registros a serem amostrados.
                                        </small>

                                    </template>
                                    <template v-if="selected === 'data'">
                                        <h5>Divisão entre treino e teste</h5>
                                        <hr />
                                        <label for="">Estratégia de particionamento:</label> &nbsp;
                                        <select name="" id="" class="form-control w-50 form-control-sm">
                                            <option>Dividir aleatoriamente</option>
                                            <option>Dividir estratificado</option>
                                        </select>
                                        <small class="form-text text-muted">
                                            Como dividir os dados de entrada entre treino e teste.
                                        </small>

                                        <label for="">Razão treino/teste:</label> &nbsp;
                                        <input type="number" class="form-control form-control-sm w-10" min="0.01"
                                            max="0.99" step="0.01">
                                        <small class="form-text text-muted">
                                            Entre 0,01 e 0,99 (1% e 99%). Por exemplo, 0,8 significa 80% dos
                                            dados destinados ao treino e 20% ao teste.
                                        </small>

                                        <label for="">Semente para números aleatórios (seed):</label> &nbsp;
                                        <input type="number" class="form-control form-control-sm w-10" min="0">
                                        <small class="form-text text-muted">
                                            Semente usada para poder repetir o experimento.
                                        </small>


                                    </template>
                                    <template v-if="selected === 'metric'">
                                        <h5>Métrica</h5>
                                        <hr />
                                        <label for="">Otimizar os hiperparâmetros para a métrica:</label> &nbsp;
                                        <select name="" id="" class="form-control w-50 form-control-sm">

                                        </select>
                                        <small class="form-text text-muted">
                                            Explicação
                                        </small>

                                    </template>
                                    <template v-if="selected === 'adjusts'">
                                        <h5>Seleção e ajustes</h5>
                                        <hr />
                                        <div class="row">
                                            <div class="col-md-4">
                                                <b-list-group>
                                                    <b-list-group-item v-for="attr in attributes" :key="attr.name"
                                                        class="p-0 pl-2">
                                                        <div class="d-flex w-100 justify-content-between p-1">
                                                            <b-form-checkbox switch>
                                                                {{attr}}
                                                            </b-form-checkbox>
                                                        </div>
                                                    </b-list-group-item>
                                                </b-list-group>

                                            </div>
                                            <div xv-if="selectedAttribute" class="col-md-8 border-right">
                                                <h6>Tratar FIXME_NOME</h6>

                                                <label for="">{{$tc('common.type')}}:</label>
                                                <b-form-radio-group stacked>
                                                    <b-form-radio value="categorical"><span class="fa fa-font"></span>
                                                        Categórico</b-form-radio>
                                                    <b-form-radio value="numeric"># Numérico</b-form-radio>
                                                    <b-form-radio value="text"><span class="fa fa-italic"></span> Text
                                                    </b-form-radio>
                                                    <b-form-radio value="vector">[ ] Vetor</b-form-radio>
                                                </b-form-radio-group>

                                                <label for="">Tratamento para dado categórico:</label>
                                                <select name="" id="" class="form-control form-control-sm">
                                                    <option value="">Dummy encoding</option>
                                                    <option value="">Feature hashing</option>
                                                    <option value="">Usar 0 ou 1 para indicar ausência/presença</option>
                                                </select>

                                                <label for="">Tratamento para dado numérico:</label>
                                                <select name="" id="" class="form-control form-control-sm">
                                                    <option value="">Manter como está</option>
                                                    <option value="">Binarizar baseado em limiar</option>
                                                    <option value="">Usar 0 ou 1 para indicar ausência/presença</option>
                                                    <option value="">Dividir em quantis</option>
                                                </select>

                                                <label for="">Tratamento para valores ausentes:</label>
                                                <select name="" id="" class="form-control form-control-sm">
                                                    <option value="">Média</option>
                                                    <option value="">Mediana</option>
                                                    <option value="">Moda</option>
                                                    <option value="">Valor constante</option>
                                                    <option value="">Ignorar todo o registro (não será usado)</option>
                                                </select>

                                                <label for="">Tratamento para valores textuais:</label>
                                                <select name="" id="" class="form-control form-control-sm">
                                                    <option value="">Tokenizar e hash</option>
                                                    <option value="">Tokenizar e hash e SVD ?</option>
                                                    <option value="">Counts vectorization</option>
                                                    <option value="">Vetorizar usando TF/IDF</option>
                                                </select>
                                                <hr>
                                                FIXME: mostrar distribuições dos dados

                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="selected === 'generation'">
                                        <h5>Geração de features</h5>
                                        <hr />
                                        <hr />
                                        <div class="row">
                                            <div class="col-md-12">
                                                <b-list-group>
                                                    <b-list-group-item class="p-0 pl-2">
                                                        <div class="d-flex w-100 justify-content-between p-1">
                                                            <b-form-checkbox switch>Combinação linear par a par
                                                            </b-form-checkbox>
                                                            This generator generates A+B and A-B features, for each pair
                                                            of
                                                            numerical features.

                                                        </div>
                                                        <div class="d-flex w-100 justify-content-between p-1">
                                                            <b-form-checkbox switch>Combinação polinomial par a par
                                                            </b-form-checkbox>
                                                            This generator generates A*B features, for each pair of
                                                            numerical features.

                                                        </div>
                                                        <div class="d-flex w-100 justify-content-between p-1">
                                                            <b-form-checkbox switch>Combinação explícita par a par
                                                            </b-form-checkbox>
                                                            This generator generates pairwise interactions between
                                                            features:
                                                            <ul>
                                                                <li>Numerical features will be multiplied</li>
                                                                <li>Numerical and categorical features will produce a
                                                                    dummies
                                                                    multiplied by the numerical feature.</li>
                                                                <li>Two categorical features will produce dummies in the
                                                                    cross-product of the two features</li>
                                                            </ul>

                                                        </div>
                                                    </b-list-group-item>
                                                </b-list-group>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="selected === 'reduction'">
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
                                                    <input type="number"
                                                        ng-model="params.correlation_params.min_abs_correlation" min="0"
                                                        max="1"
                                                        class="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-min ng-valid-max">
                                                </div>
                                            </div><!-- end ngIf: isRegression() -->
                                            <!-- ngIf: isRegression() -->
                                            <div ng-if="isRegression()" class="ng-scope">
                                                <label for="" class="control-label">Maximum absolute correlation</label>
                                                <div class="controls">
                                                    <input type="number"
                                                        ng-model="params.correlation_params.max_abs_correlation" min="0"
                                                        max="1"
                                                        class="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-min ng-valid-max">
                                                </div>
                                            </div><!-- end ngIf: isRegression() -->
                                            <label for="" class="control-label">Number of features to keep</label>
                                            <div class="controls">
                                                <input type="number" force-integer=""
                                                    ng-model="params.correlation_params.n_features" min="1"
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
                                                        <input type="number" force-integer=""
                                                            ng-model="params.random_forest_params.n_features" min="1"
                                                            class="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-min">
                                                    </div>
                                                </div>

                                                <div class="control-group">
                                                    <label for="" class="control-label">Number of trees</label>
                                                    <div class="controls">
                                                        <input type="number" force-integer=""
                                                            ng-model="params.random_forest_params.n_trees" min="1"
                                                            class="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-min">
                                                    </div>
                                                </div>

                                                <div class="control-group">
                                                    <label for="" class="control-label">Depth of trees</label>
                                                    <div class="controls">
                                                        <input type="number" force-integer=""
                                                            ng-model="params.random_forest_params.depth" min="1"
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
                                                    <input type="text" comma-separated-float-view=""
                                                        ng-model="params.lasso_params.alpha"
                                                        class="ng-pristine ng-untouched ng-valid ng-not-empty">
                                                    <span class="multi-valued-field-marker icon-list-ol"
                                                        toggle="tooltip" title=""
                                                        data-original-title="You can specify several values separated by commas (slower)"></span>
                                                </div>
                                            </div>
                                        </div>

                                        <small class="form-text text-muted">
                                            Explicação
                                        </small>
                                        Parametrizar o método
                                    </template>
                                    <template v-if="selected === 'algorithms'">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <h5>Algoritmos</h5>
                                                <hr />
                                                <b-list-group>
                                                    <b-list-group-item v-for="op in algorithms" :key="op.id"
                                                        class="p-0 pl-2" :class="{'active-item': selectedAlgorithm === op }">
                                                        <div class="d-flex w-100 p-1" @click="selectAlgorithm(op)"
                                                            role="button">
                                                            <b-form-checkbox switch>
                                                            </b-form-checkbox>
                                                            {{op.name}}
                                                        </div>
                                                    </b-list-group-item>
                                                </b-list-group>

                                            </div>
                                            <div class="col-md-8 col-lg-6 text-justify border-left">
                                                <h6>{{selectedAlgorithm.name}}</h6>
                                                <div class="text-justify border-bottom p-2 mb-2">
                                                    {{selectedAlgorithm.description}}</div>

                                                <!--
                                                <div
                                                    v-for="field in selectedAlgorithm.forms.find(f => f.name === 'Execution').fields">
                                                    {{field.label}} - {{field.type}}
                                                    <small class="form-text text-muted">
                                                        {{field.help}}
                                                    </small>
                                                </div>
                                            -->
                                                <vue-perfect-scrollbar v-if="selectedAlgorithm" ref="scrollBar"
                                                    useBothWheelAxes="true" class="scroll-area">
                                                    <div v-for="(form, index) in getExecutionForm()"
                                                        v-bind:key="form.id">
                                                        <div v-for="field in form.fields" class="mb-2 property clearfix"
                                                            v-bind:key="field.name" :data-name="field.name"
                                                            v-if="getWidget(field) !== 'attribute-selector-component' && !unsupportedParameters.has(field.name) ">
                                                            <keep-alive>
                                                                <component :is="getWidget(field)" :field="field"
                                                                    :value="getFieldValue(field)"
                                                                    :language="$root.$i18n.locale"
                                                                    :type="field.suggested_widget"
                                                                    :small="true"
                                                                    :read-only="!field.editable" context="context">
                                                                </component>
                                                            </keep-alive>

                                                        </div>
                                                    </div>
                                                </vue-perfect-scrollbar>
                                            </div>
                                        </div>

                                    </template>
                                    <template v-if="selected === 'hyperparameters'">
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

                                    </template>
                                    <template v-if="selected === 'weighting'">
                                        <h5>Estratégia de ponderação</h5>
                                        <hr />


                                    </template>
                                    <template v-if="selected === 'runtime'">
                                        <h5>Ambiente de processamento</h5>
                                        <hr />
                                        <label for="">Cluster:</label>
                                        <select name="" id="" class="form-control w-50 form-control-sm">
                                            <option>Principal Component Analysis - PCA</option>
                                        </select>
                                        <small class="form-text text-muted">
                                            Explicação
                                        </small>
                                        Não computar métricas "caras"?

                                    </template>
                                </form>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Resultados" class="pt-2">

                        <div v-if="sessions" class="row">
                            <div class="col-md-4 col-lg-3">
                                <b-list-group>
                                    <b-list-group-item v-for="session in sessions" :key="session.id" href="#"
                                        class="flex-column align-items-start p-0 pl-1">
                                        <div class="d-flex w-100 justify-content-between bg-light p-1">
                                            <b class="mb-1">{{session.name}}</b>
                                            <small>
                                                {{$t('status.' + session.status)}}
                                                <span :class="getClassesForDecor(session.status)"></span>
                                                <button class="btn btn-sm"><span
                                                        class="fa fa-ellipsis-v"></span></button>
                                            </small>
                                        </div>

                                        <p class="mb-1 pr-1 pl-3">
                                            <small>
                                                <b-form-checkbox-group :options="session.runs" stacked
                                                    text-field="name" />
                                            </small>
                                            <!--
                                        <small>{{session.date | timeFromNow($locale)}}</small>
                                        -->
                                        </p>
                                    </b-list-group-item>

                                </b-list-group>
                            </div>
                            <div class="col-md-8 col-lg-9">
                                <b-tabs align="right">
                                    <b-tab title="Sessões">
                                        <div class="bg-white border p-2 mt-1">
                                            <h6>Sessão 1</h6>
                                            <p>
                                                Métrica <span class="fa fa-trophy text-secondary"></span>
                                                4 modelos para treino
                                                20 features
                                                Link para parte de transparency e fairness?
                                            </p>
                                            <img src="https://topepo.github.io/caret/basic/train_plot1-1.svg" alt="">
                                            Gráfico métrica por tempo
                                            <b-list-group>
                                                <b-list-group-item v-for="run in sessions[0].runs" :key="run.id"
                                                    class="p-0 pl-2">
                                                    <div class="d-flex w-100 justify-content-between bg-light p-1">
                                                        <b class="mb-1">{{run.name}}</b>
                                                        <small>
                                                            <button class="btn btn-sm btn-danger"><span
                                                                    class="fa fa-times-circle "></span> </button>
                                                        </small>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-4">
                                                            <ul>
                                                                <li>Grid size: 2</li>
                                                                <li>Trees: 4</li>
                                                                <li>Depth: 3</li>
                                                            </ul>
                                                        </div>
                                                        <div class="col-md-4 text-center">
                                                            Atributos mais importantes
                                                            <img src="https://i2.wp.com/cdn-images-1.medium.com/max/1024/1*XLiG4oyZyrCU5Cyf9LxL6Q.png?w=584&ssl=1"
                                                                alt="" style="width: 100%; height: auto" />
                                                        </div>
                                                        <div class="col-md-4">
                                                            <ul>
                                                                <li>Número de registros para o treino: 2</li>
                                                                <li>Número de registros para o teste: 4</li>
                                                                <li>Duração: 3</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </b-list-group-item>
                                            </b-list-group>
                                        </div>

                                    </b-tab>
                                    <b-tab title="Modelos">

                                    </b-tab>
                                    <b-tab title="Tabela">

                                    </b-tab>
                                </b-tabs>
                            </div>
                        </div>
                        <div v-else class="row text-center">
                            <div class="col-md-12 pt-5">
                                <h4>Nenhum modelo treinado ainda</h4>
                                Revise os parâmetros ou dispare o treino do modelo agora.
                                <ul class="list-unstyled">
                                    <li>Alvo: Nome</li>
                                    <li>2 algoritmos</li>
                                    <li>12 features selecionadas</li>
                                </ul>
                            </div>
                        </div>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
    </div>
</template>
<script>
    import InputHeader from '../../components/InputHeader.vue';
    import DataSourceMixin from './DataSourceMixin.js';
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import { debounce } from "../../util.js";
    import axios from 'axios';
    import vSelect from 'vue-select';
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    export default {
        components: { InputHeader, 'vue-select': vSelect, 'vue-perfect-scrollbar': VuePerfectScrollbar },
        mixins: [DataSourceMixin],
        computed: {
            dataSource: {
                get() { return this.$store.state.dataExplorer.dataSource; },
                set(newValue) {
                    return this.$store.dispatch('dataExplorer/setDataSource', newValue)
                }
            },
            labelAttribute: {
                get() { return this.$store.state.dataExplorer.labelAttribute; },
                set(newValue) {
                    return this.$store.dispatch('dataExplorer/setLabelAttribute', newValue)
                }
            },
            name: {
                get() { return this.$store.state.dataExplorer.name; },
                set(newValue) {
                    return this.$store.dispatch('dataExplorer/setName', newValue)
                }
            },
            supervisioned() {
                return this.taskType === 'regression' || this.taskType === 'classification';
            },
            taskName: {
                get() { return this.$store.state.dataExplorer.taskName; },
                set(newValue) {
                    return this.$store.dispatch('dataExplorer/setTaskName', newValue)
                }
            }
        },
        data() {
            return {
                algorithms: [],
                selectedAlgorithm: { forms: [] },
                selected: 'target',
                sessions: [
                    {
                        name: 'Sessão 1', date: '2021-09-05', id: 1, status: 'RUNNING',
                        runs: [{ id: 1, name: 'Naive Bayes', }, { id: 2, name: 'Decision Tree' },
                        { id: 3, name: 'SVM' }]
                    },
                    {
                        name: 'Sessão 2', date: '2021-08-02', id: 2, status: 'COMPLETED',
                        runs: [{ id: 1, name: 'Naive Bayes', }, { id: 2, name: 'Decision Tree' },
                        { id: 3, name: 'SVM' }]
                    },
                    {
                        name: 'Sessão 3', date: '2020-09-05', id: 3, status: 'ERROR',
                        runs: [{ id: 1, name: 'Naive Bayes', }, { id: 2, name: 'Decision Tree' },
                        { id: 3, name: 'SVM' }]
                    },
                    {
                        name: 'Sessão 4', date: '2020-09-05', id: 4, status: 'CANCELED',
                        runs: [{ id: 1, name: 'Naive Bayes', }, { id: 2, name: 'Decision Tree' },
                        { id: 3, name: 'SVM' }]
                    },
                    {
                        name: 'Sessão 5', date: '2020-09-05', id: 5, status: 'PENDING',
                        runs: [{ id: 1, name: 'Naive Bayes', }, { id: 2, name: 'Decision Tree' },
                        { id: 3, name: 'SVM' }]
                    },
                ],
                attributes: [],
                dataSourceOptions: [],

                //FIXME: hard-coded. It'd be best defined in Tahiti
                unsupportedParameters: new Set(['perform_cross_validation', 'cross_validation', 'one_vs_rest'])
            }
        },
        mounted() {
            this.load();
        },
        methods: {
            async load() {
                const resp = await axios.get(
                    `${limoneroUrl}/datasources/${this.dataSource.id}`);
                const dataSource = resp.data;
                this.dataSourceOptions = dataSource;
                this.attributes = dataSource.attributes.map(attr => attr.name).sort();
            },
            edit(option) {
                this.selected = option;
            },
            getExecutionForm() {
                if (this.selectedAlgorithm && this.selectedAlgorithm.forms) {
                    const result = this.selectedAlgorithm.forms.filter(f => f.category === 'execution');
                    return result;
                } else {
                    console.debug(this.selectedAlgorithm, this.selectedAlgorithm.forms);
                    return [];
                }
            },
            getWidget(field) {
                if (field.suggested_widget.endsWith(':read-only')) {
                    const s = field.suggested_widget;
                    return s.substring(0, s.length - 10) + '-component';
                } else {
                    return field.suggested_widget + '-component';
                }
            },
            getFieldValue(field) {
                //FIXME
                return null;
            },
            getClassesForDecor(value) {
                let result = [];
                switch (value) {
                    case 'ERROR':
                        result.push("fa fa-times-circle text-danger");
                        break;
                    case 'PENDING':
                        result.push("fa fa-pause-circle text-warning");
                        break;
                    case 'CANCELED':
                        result.push("fa fa-stop-circle text-secondary");
                        break;
                    case 'RUNNING':
                        result.push("fa fa-sync fa-spin text-primary");
                        break;
                    case 'COMPLETED':
                        result.push("fa fa-check-circle text-success");
                        break;
                    default:
                }
                result.push(value.toLowerCase());
                return result.join(' ');
            },
            selectAlgorithm(algo) {
                this.selectedAlgorithm = algo;
            }
        },
        watch: {
            async selected() {
                if (this.selected === 'algorithms') {
                    const params = {
                        enabled: 'true',
                        platform: 1, //FIXME
                        category: this.taskName,
                        lang: this.$locale,
                    }
                    const resp = await axios.get(
                        `${tahitiUrl}/operations`, { params });
                    this.algorithms = resp.data;
                    this.selectedAlgorithm = this.algorithms[0];
                }
            }
        }
    }
</script>

<style scoped>
    .explorer-nav>>>.nav-item {
        margin-bottom: 0px;
        padding: 0
    }

    .explorer-nav>>>.nav-item a {
        padding: 6px 0px 1px 10px;
        font-size: .9em;
    }

    .explorer-nav>>>.nav-item.active a {
        border-left: 5px solid green;
        padding-left: 5px !important;
    }

    .explorer-nav>>>.header {
        color: #555;
        font-size: .9em;
        font-weight: bold;
        text-transform: uppercase;
    }

    .custom-card {
        padding: 0 5px;
    }

    h5 {
        font-size: 14pt;
    }

    h5,
    h6 {
        color: #888;
    }

    form {
        font-size: .8em;
    }

    .editor {
        border-bottom: 1px dashed;
        border-color: #888;
    }

    .parameters label {
        margin-top: 10px;
    }

    .scroll-area {
        xborder: 1px solid #ccc;
        max-height: calc(100vh - 320px);
        padding: 10px 15px 10px 10px;
    }
    .active-item {
        background-color: #e7f3ff
    }
    .size-full > div {
        height: calc(100vh - 220px);
    }
</style>