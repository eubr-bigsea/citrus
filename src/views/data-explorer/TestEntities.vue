<template>
    <div>
        <button class="btn btn-primary btn-sm" @click="save">Salvar</button>
        <hr>
        {{workflow.flows}}
        <hr />
        <div v-for="attr in dataSource.attributes" :key="attr.id">
            {{attr}}
        </div>
        <hr />
    </div>
</template>
<script>
    import axios from 'axios';
    import { Workflow, Platform, OperationList } from "./entities";
    import Notifier from '../../mixins/Notifier';

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;

    export default {
        mixins: [Notifier],
        data() {
            return {
                dataSource: {},
                operations: [],
                tasks: [],
                platform: {},
                workflow: { name: null, history: 0 }
            };
        },
        mounted() {
            this.load();
        },
        methods: {
            async save() {
                try {
                    await axios.patch(`${tahitiUrl}/workflows/35`,
                        this.workflow);
                } catch (e) {
                    this.error(e);
                }
            },
            async load() {
                const defaultStorage = 1;
                const idsClassification = [17, 18, 21, 28, 39, 40, 41, 90, 106, 107, 121];
                const idsRegression = [17, 18, 21, 28, 39, 40, 41, 90, 115, 117, 121];
                const params = {
                    platform: 1,
                    lang: this.$root.$i18n.locale,
                    disabled: false,
                    ids: idsClassification.concat(idsRegression)
                }
                const resp = await axios.get(`${tahitiUrl}/operations`,
                    { params });
                this.operations = new OperationList(resp.data);
                const platform = new Platform(resp.data[0].platforms[0]);
                this.platform = platform;

                const flows = [];
                const tasks = [];
                const dataSourceId = 15;

                const respDs = await axios.get(`${limoneroUrl}/datasources/${dataSourceId}`);
                const dataSource = respDs.data;

                /* Features and Label */
                const label = 'Species';
                const numericTypes = ['DECIMAL', 'INTEGER', 'DOUBLE', 'FLOAT'];
                const textTypes = ['TEXT'];
                const numericFeatures = [];
                const textFeatures = [];
                const categoricalFeatures = [];
                let features = [];
                dataSource.attributes.forEach((attr) => {
                    if (attr.name !== label) {
                        if (numericTypes.indexOf(attr.type) > -1) {
                            numericFeatures.push(attr.name);
                        } else if (textTypes.indexOf(attr.type) > -1) {
                            textFeatures.push(attr.name);
                        } else {
                            categoricalFeatures.push(attr.name);
                        }
                        features.push(attr.name);
                    }
                });


                this.dataSource = dataSource;

                const dataReader = this.operations.getOperationBySlug('data-reader')
                    .createTask({ name: 'Ler dados' });
                dataReader.setProperty('data_source', dataSourceId);
                tasks.push(dataReader);

                const sample = this.operations.getOperationBySlug('sample')
                    .createTask({ name: 'Amostrar' });
                sample.setProperty('type', 'head');
                //sample.setProperty('seed', Math.round(Math.random() * 1000))
                sample.setProperty('value', 10000);
                tasks.push(sample);

                flows.push(sample.inputFrom(dataReader, 'input data', 'output data'))

                /*
                const missingCategorical = this.operations.getOperationBySlug('clean-missing')
                    .createTask({name: 'Limpar ausentes'});
                missingCategorical.move(650, 80);

                flows.push(missingCategorical.inputFrom(sample, 'input data', 'sampled data'));
                */
                let next = sample;
                let nextPort = 'sampled data';
                if (numericFeatures.length) {
                    const missingNumeric = this.operations.getOperationBySlug('clean-missing')
                        .createTask({ name: 'Usar mediana se número ausente' });
                    missingNumeric.setProperty('attributes', numericFeatures);
                    missingNumeric.setProperty('cleaning_mode', 'MEDIAN');

                    tasks.push(missingNumeric);
                    flows.push(missingNumeric.inputFrom(next, 'input data', nextPort));
                    next = missingNumeric;
                    nextPort = 'output result'
                }



                //const split = this.operations.getOperationBySlug('split')
                //    .createTask();

                if (categoricalFeatures.length > 0) {
                    let dummyEncoding = this.operations.getOperationBySlug('feature-indexer')
                        .createTask({ name: 'Indexar categóricos' });
                    dummyEncoding.setProperty('attributes', categoricalFeatures);
                    dummyEncoding.setProperty('alias', categoricalFeatures.map(c => c + '_inx'));

                    tasks.push(dummyEncoding);
                    flows.push(dummyEncoding.inputFrom(next, 'input data', nextPort));

                    //dummyEncoding = missingNumeric;
                    next = dummyEncoding;
                    nextPort = 'output data';
                }

                // TODO: Juicer: substituir valores in place (na própria coluna)
                // Rever esses Scalers para suportarem múltiplos atributos
                if (numericFeatures.length) {
                    const stdScaler = this.operations.getOperationBySlug('standard-scaler')
                        .createTask({ name: 'Normalizar números (z-score)' });

                    stdScaler.setProperty('attribute', numericFeatures);
                    stdScaler.setProperty('alias', 'feat_num_normalizadas') //numericFeatures.map((n) => n + '_normalized').join(', '));
                    features = features.filter(f => numericFeatures.indexOf(f) === -1);
                    features.push('feat_num_normalizadas');
                    stdScaler.setProperty('with_mean', '1');
                    stdScaler.setProperty('with_std', '1');

                    tasks.push(stdScaler);
                    flows.push(stdScaler.inputFrom(next, 'input data', nextPort));
                    next = stdScaler;
                    nextPort = 'output data'
                }

                const splitKFold = this.operations.getOperationBySlug('split-k-fold')
                    .createTask({ name: 'Divisão em K partições' });
                splitKFold.setProperty('k_fold', 10);
                splitKFold.setProperty('type', 'random'); //random, random_exact, stratified, stratified_exact
                splitKFold.setProperty('label', [label]);
                splitKFold.setProperty('alias_fold', 'fold');
                splitKFold.setProperty('seed', Math.round(Math.random() * 1000));
                tasks.push(splitKFold);
                flows.push(splitKFold.inputFrom(next, 'input data', nextPort));

                // FIXME: Talvez não precise
                const featureAssembler = this.operations.getOperationBySlug('feature-assembler')
                    .createTask({ name: 'Agrupar atributos em um vetor' });
                featureAssembler.setProperty('attributes', features); //FIXME
                featureAssembler.setProperty('alias', 'features');
                tasks.push(featureAssembler);
                flows.push(featureAssembler.inputFrom(splitKFold, 'input data', 'output data'));

                const regression = false;

                if (regression) {
                    const randomForestRegressor = this.operations.getOperationBySlug('random-forest-regressor-model')
                        .createTask({ name: 'Regressão usando Random Forest' });
                    randomForestRegressor.setProperty('features', ['features']);
                    randomForestRegressor.setProperty('label', [label]);
                    randomForestRegressor.setProperty('prediction', 'prediction');
                    //randomForestRegressor.setProperty('elastic_net', '1.0'); //FIXME: retirar esse parâmetro
                    randomForestRegressor.setProperty('num_trees', 100);
                    randomForestRegressor.setProperty('max_depth', 12);
                    randomForestRegressor.setProperty('perform_cross_validation', 1);
                    tasks.push(randomForestRegressor);
                    flows.push(randomForestRegressor.inputFrom(featureAssembler, 'train input data', 'output data'));

                    const linearRegressor = this.operations.getOperationBySlug('linear-regression-model')
                        .createTask({ name: 'Regressão linear (regularização R2 - Ridge)' });
                    linearRegressor.setProperty('features', ['features'])
                    linearRegressor.setProperty('label', [label]);
                    linearRegressor.setProperty('prediction', 'prediction');
                    linearRegressor.setProperty('elastic_net', '1.0');
                    linearRegressor.setProperty('perform_cross_validation', 1);
                    linearRegressor.setProperty('solver', 'auto'); // Está com problema
                    tasks.push(linearRegressor);
                    flows.push(linearRegressor.inputFrom(featureAssembler, 'train input data', 'output data'));

                    const saveRandomForestRegressor = this.operations.getOperationBySlug('save-model')
                        .createTask({ name: 'Salvar modelo random forest regressor' });
                    saveRandomForestRegressor.setProperty('storage', defaultStorage);
                    saveRandomForestRegressor.setProperty('name', `random_forest_regressor_35.model`);
                    saveRandomForestRegressor.setProperty('write_mode', 'OVERWRITE')
                    tasks.push(saveRandomForestRegressor);
                    flows.push(saveRandomForestRegressor.inputFrom(randomForestRegressor, 'models', 'model'));

                    const saveLinearRegressor = this.operations.getOperationBySlug('save-model')
                        .createTask({ name: 'Salvar modelo de regressão linear' });
                    saveLinearRegressor.setProperty('storage', defaultStorage);
                    saveLinearRegressor.setProperty('name', `linear_regressor_35.model`);
                    saveLinearRegressor.setProperty('write_mode', 'OVERWRITE')
                    tasks.push(saveLinearRegressor);
                    flows.push(saveLinearRegressor.inputFrom(linearRegressor, 'models', 'model'));

                    //FIXME: se regressão, alvo tem que ser numérico!!!!
                } else {
                    const randomForestClassifier = this.operations.getOperationBySlug('random-forest-classifier-model')
                        .createTask({ name: 'Classificação usando Random Forest' });
                    randomForestClassifier.setProperty('features', ['features']);
                    randomForestClassifier.setProperty('label', [label]);
                    randomForestClassifier.setProperty('prediction', 'prediction');
                    randomForestClassifier.setProperty('num_trees', 100);
                    randomForestClassifier.setProperty('max_depth', 12);
                    randomForestClassifier.setProperty('perform_cross_validation', 1);
                    randomForestClassifier.setProperty('attribute_cross_validation', ['fold']);
                    randomForestClassifier.setProperty('cross_validation', 'accuracy');

                    tasks.push(randomForestClassifier);
                    flows.push(randomForestClassifier.inputFrom(featureAssembler, 'train input data', 'output data'));
                    const saveRandomForestClassifier = this.operations.getOperationBySlug('save-model')
                        .createTask({ name: 'Salvar modelo de classificação random forest' });
                    saveRandomForestClassifier.setProperty('storage', defaultStorage);
                    saveRandomForestClassifier.setProperty('name', `logistic_regression_35.model`);
                    saveRandomForestClassifier.setProperty('write_mode', 'OVERWRITE')
                    tasks.push(saveRandomForestClassifier);
                    flows.push(saveRandomForestClassifier.inputFrom(randomForestClassifier, 'models', 'model'));


                    const logisticRegression = this.operations.getOperationBySlug('logistic-regression-classifier-model')
                        .createTask({ name: 'Regressão logística' });
                    logisticRegression.setProperty('features', ['features'])
                    logisticRegression.setProperty('label', [label]);
                    logisticRegression.setProperty('perform_cross_validation', 'true');
                    logisticRegression.setProperty('prediction', 'prediction');
                    logisticRegression.setProperty('family', 'auto');
                    logisticRegression.setProperty('attribute_cross_validation', ['fold']);
                    logisticRegression.setProperty('cross_validation', 'accuracy');
                    tasks.push(logisticRegression);
                    flows.push(logisticRegression.inputFrom(featureAssembler, 'train input data', 'output data'));

                    const saveLogisticRegression = this.operations.getOperationBySlug('save-model')
                        .createTask({ name: 'Salvar modelo de regressão logística' });
                    saveLogisticRegression.setProperty('storage', defaultStorage);
                    saveLogisticRegression.setProperty('name', `logistic_regression_35.model`);
                    saveLogisticRegression.setProperty('write_mode', 'OVERWRITE')
                    tasks.push(saveLogisticRegression);
                    flows.push(saveLogisticRegression.inputFrom(logisticRegression, 'models', 'model'));
                }
                tasks.forEach((task, i) => {
                    let top = 50 + Math.floor(i / 3) * 150;
                    let left = 50 + (i % 3) * 250;
                    task.move(left, top);
                });
                this.workflow = new Workflow({ id: 1, name: 'Teste com Modelos', platform, tasks, flows });
            }
        },
    }
</script>
