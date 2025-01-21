<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="mt-2">
                <h6 class="header-pretitle">Explicação #{{ explanation.id }}</h6>
                <h1>
                    <InputHeader v-model="explanation.name" @input="isDirty = true" :maxlength="50" />
                </h1>
            </div>

        </div>

        <div class="row">
            <div class="col-2">
                <b-list-group>
                    <b-list-group-item v-for="(item, index) in menuOptions" :key="index" @click="currentOption = item"
                        :class="{ 'active-option': currentOption === item }" style="cursor: pointer;">
                        {{ item }}
                    </b-list-group-item>
                </b-list-group>
            </div>

            <div class="col-10">
                <b-card no-body>
                    <div v-if="currentOption === 'Marginal Local'">
                        <b-card class="mb-1">
                            <b-card-body class="scrollable row">
                                <div v-for="(feature, index) in explanation.config.marginalLocal.features" :key="index"
                                    class="bg-light col-3 mx-2 pd-2">
                                    <b-form @submit.prevent="onSubmit">
                                        <b-form-group label="Classe de Interesse:" label-for="input-model">
                                            <b-form-select id="input-model" v-model="feature.interestClass"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                        <b-form-group label="Instância de Interesse:" label-for="input-model">
                                            <b-form-select id="input-model" v-model="feature.interestInstance"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                        <b-form-group label="Conjunto Ruído:" label-for="input-model">
                                            <b-form-select id="input-model" v-model="feature.noiseSet"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                        <b-form-group label="Margem de x:" label-for="input-name">
                                            <b-form-input id="input-name" v-model="feature.horizontalMargin"
                                                required></b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Amostragem:" label-for="input-name">
                                            <b-form-input id="input-name" v-model="feature.sampling"
                                                required></b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Algoritmo:" label-for="checkboxes-explainers">
                                            <b-form-checkbox-group v-model="feature.algorithm"
                                                id="checkbox-local-explainers" required>
                                                <b-form-checkbox value="partial-dependence-plot">Partial
                                                    Dependence Plot</b-form-checkbox>
                                                <b-form-checkbox value="individual-conditional-expectation">Individual
                                                    Conditional Expectation</b-form-checkbox>
                                                <b-form-checkbox value="accumulated-local-effects">Accumulated
                                                    Local Effects</b-form-checkbox>
                                            </b-form-checkbox-group>
                                        </b-form-group>
                                    </b-form>
                                    <div>
                                        <button class="ml-1 btn btn-sm btn-danger" title="Excluir etapa"
                                            @click="deleteFeature('marginalLocal', index)"
                                            :disabled="explanation.config.marginalLocal.features.length == 1">
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-primary" title="Adicionar etapa"
                                            @click="addFeature('marginalLocal')">
                                            <font-awesome-icon icon="plus" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-success" title="Adicionar campo GPX"
                                            @click="() => { }">
                                            <font-awesome-icon icon="play" />
                                        </button>
                                    </div>
                                </div>
                            </b-card-body>
                        </b-card>
                    </div>

                    <div v-else-if="currentOption === 'SQL Local'">
                        <b-card class="mb-1">
                            <b-card-body class="scrollable row">
                                <div v-for="(feature, index) in explanation.config.sklLocal.features" :key="index"
                                    class="bg-light col-3 mx-2 pd-2">
                                    <b-form @submit.prevent="onSubmit">
                                        <b-form-group label="Classe de Interesse:" label-for="input-model">
                                            <b-form-select id="input-model" v-model="feature.interestClass"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                        <b-form-group label="Instância de Interesse:" label-for="input-model">
                                            <b-form-select id="input-model" v-model="feature.interestInstance"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                        <b-form-group label="Conjunto Ruído:" label-for="input-model">
                                            <b-form-select id="input-model" v-model="feature.noiseSet"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                        <b-form-group label="Margem de x:" label-for="input-name">
                                            <b-form-input id="input-name" v-model="feature.horizontalMargin"
                                                required></b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Amostragem:" label-for="input-name">
                                            <b-form-input id="input-name" v-model="feature.sampling"
                                                required></b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Métrica:" label-for="input-model">
                                            <b-form-select id="input-model" v-model="feature.metrics"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                        <b-form-group label="Tolerância:" label-for="input-name">
                                            <b-form-input id="input-name" v-model="feature.tolerance"
                                                required></b-form-input>
                                        </b-form-group>
                                    </b-form>
                                    <div>
                                        <button class="ml-1 btn btn-sm btn-danger" title="Excluir etapa"
                                            @click="deleteFeature('sklLocal', index)"
                                            :disabled="explanation.config.sklLocal.features.length == 1">
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-primary" title="Adicionar etapa"
                                            @click="addFeature('sklLocal')">
                                            <font-awesome-icon icon="plus" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-success" title="Adicionar campo GPX"
                                            @click="() => { }">
                                            <font-awesome-icon icon="play" />
                                        </button>
                                    </div>
                                </div>
                            </b-card-body>
                        </b-card>
                    </div>

                    <div v-else-if="currentOption === 'Marginal Global'">
                        <b-card class="mb-1">
                            <b-card-body class="scrollable row">
                                <div v-for="(feature, index) in explanation.config.marginalGlobal.features" :key="index"
                                    class="bg-light col-3 mx-2 pd-2">
                                    <b-form @submit.prevent="onSubmit">
                                        <b-form-group label="Classe de Interesse:" label-for="input-model">
                                            <b-form-select id="input-model" v-model="feature.interestClass"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                        <b-form-group label="Algoritmo:" label-for="checkboxes-explainers">
                                            <b-form-checkbox-group v-model="feature.algorithm"
                                                id="checkbox-local-explainers" required>
                                                <b-form-checkbox value="partial-dependence-plot">Partial
                                                    Dependence Plot</b-form-checkbox>
                                                <b-form-checkbox value="individual-conditional-expectation">Individual
                                                    Conditional Expectation</b-form-checkbox>
                                                <b-form-checkbox value="accumulated-local-effects">Accumulated
                                                    Local Effects</b-form-checkbox>
                                            </b-form-checkbox-group>
                                        </b-form-group>
                                    </b-form>
                                    <div>
                                        <button class="ml-1 btn btn-sm btn-danger" title="Excluir etapa"
                                            @click="deleteFeature('marginalGlobal', index)"
                                            :disabled="explanation.config.marginalGlobal.features.length == 1">
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-primary" title="Adicionar etapa"
                                            @click="addFeature('marginalGlobal')">
                                            <font-awesome-icon icon="plus" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-success" title="Adicionar campo GPX"
                                            @click="() => { }">
                                            <font-awesome-icon icon="play" />
                                        </button>
                                    </div>
                                </div>
                            </b-card-body>
                        </b-card>
                    </div>

                    <div v-else-if="currentOption === 'SHAP'">
                        <b-card class="mb-1">
                            <b-card-body class="scrollable row">
                                <div v-for="(feature, index) in explanation.config.shap.features" :key="index"
                                    class="bg-light col-3 mx-2 pd-2">
                                    <b-form @submit.prevent="onSubmit">
                                        <b-form-group label="Classe de Interesse:" label-for="input-feature">
                                            <b-form-select id="input-feature" v-model="feature.featureInterest"
                                                :options="mockInfo" required />
                                        </b-form-group>

                                        <b-form-group label="Tipo de Modelo:" label-for="input-model-type">
                                            <b-form-select id="input-model-type" v-model="feature.modelType"
                                                :options="mockInfo" required />
                                        </b-form-group>

                                        <b-form-group label="Tipo de Explicação:" label-for="input-explanation-type">
                                            <b-form-select id="input-explanation-type" v-model="feature.explanationType"
                                                :options="mockInfo" required />
                                        </b-form-group>

                                        <b-form-group label="Máscara:" label-for="input-mask">
                                            <b-form-select id="input-mask" v-model="feature.mask" :options="mockInfo"
                                                required />
                                        </b-form-group>

                                        <b-form-group label="Amostragem:" label-for="input-sampling">
                                            <b-form-input id="input-sampling" v-model="feature.sampling" type="text"
                                                required />
                                        </b-form-group>
                                    </b-form>
                                    <div>
                                        <button class="ml-1 btn btn-sm btn-danger" title="Excluir campo SHAP"
                                            @click="deleteFeature('shap', index)"
                                            :disabled="explanation.config.shap.features.length == 1">
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-primary" title="Adicionar campo SHAP"
                                            @click="addFeature('shap')">
                                            <font-awesome-icon icon="plus" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-success" title="Adicionar campo GPX"
                                            @click="() => { }">
                                            <font-awesome-icon icon="play" />
                                        </button>
                                    </div>
                                </div>
                            </b-card-body>
                        </b-card>
                    </div>


                    <div v-else-if="currentOption === 'LIME'">
                        <b-card class="mb-1">
                            <b-card-body class="scrollable row">
                                <div v-for="(feature, index) in explanation.config.lime.features" :key="index"
                                    class="bg-light col-3 mx-2 pd-2">
                                    <b-form @submit.prevent="onSubmit">
                                        <b-form-group label="Tipo de tarefa:" label-for="input-lime-class">
                                            <b-form-select id="input-lime-class" v-model="feature.taskType"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                        <b-form-group label="Instância de Interesse:" label-for="input-lime-instance">
                                            <b-form-select id="input-lime-instance" v-model="feature.interestInstance"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                        <b-form-group label="Número de Amostras:" label-for="input-lime-samples">
                                            <b-form-input id="input-lime-samples" v-model="feature.numSamples"
                                                type="number" min="1" required />
                                        </b-form-group>
                                        <b-form-group label="Features categóricas:" label-for="input-lime-samples">
                                            <b-form-input id="input-lime-samples" v-model="feature.catFeat"
                                                type="number" min="1" required />
                                        </b-form-group>
                                        <b-form-group label="Número de features:" label-for="input-lime-samples">
                                            <b-form-input id="input-lime-samples" v-model="feature.numFeat"
                                                type="number" min="1" required />
                                        </b-form-group>
                                        <b-form-group label="Métrica:" label-for="input-lime-explanation-type">
                                            <b-form-select id="input-lime-explanation-type" v-model="feature.metric"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                        <b-form-group label="Tolerância:" label-for="input-lime-explanation-type">
                                            <b-form-select id="input-lime-explanation-type" v-model="feature.tolerances"
                                                :options="mockInfo" required />
                                        </b-form-group>
                                    </b-form>
                                    <div>
                                        <button class="ml-1 btn btn-sm btn-danger" title="Excluir campo LIME"
                                            @click="deleteFeature('lime', index)"
                                            :disabled="explanation.config.lime.features.length == 1">
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-primary" title="Adicionar campo LIME"
                                            @click="addFeature('lime')">
                                            <font-awesome-icon icon="plus" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-success" title="Adicionar campo GPX"
                                            @click="() => { }">
                                            <font-awesome-icon icon="play" />
                                        </button>
                                    </div>
                                </div>
                            </b-card-body>
                        </b-card>
                    </div>

                    <div v-else-if="currentOption === 'GPX'">
                        <b-card class="mb-1">
                            <b-card-body class="scrollable row">
                                <div v-for="(feature, index) in explanation.config.gpx.features" :key="index"
                                    class="bg-light col-3 mx-2 pd-2">
                                    <b-form @submit.prevent="onSubmit">
                                        <b-form-group label="Classe de Interesse:" label-for="input-interest-feature">
                                            <b-form-select id="input-interest-feature" v-model="feature.interestFeature"
                                                :options="mockInfo" required />
                                        </b-form-group>

                                        <b-form-group label="Programação Genética:"
                                            label-for="input-genetic-programming">
                                            <b-form-select id="input-genetic-programming"
                                                v-model="feature.geneticProgramming" :options="mockInfo" required />
                                        </b-form-group>

                                        <b-form-group label="Tipo de Explicação:" label-for="input-explanation-type">
                                            <b-form-select id="input-explanation-type" v-model="feature.explanationType"
                                                :options="mockInfo" required />
                                        </b-form-group>

                                        <b-form-group label="Conjunto Ruído:" label-for="input-noise-set">
                                            <b-form-select id="input-noise-set" v-model="feature.noiseSet"
                                                :options="mockInfo" required />
                                        </b-form-group>

                                        <b-form-group label="Margem de x:" label-for="input-x-margin">
                                            <b-form-input id="input-x-margin" v-model="feature.xMargin" type="text"
                                                required />
                                        </b-form-group>

                                        <b-form-group label="Amostragem:" label-for="input-sampling">
                                            <b-form-input id="input-sampling" v-model="feature.sampling" type="text"
                                                required />
                                        </b-form-group>
                                    </b-form>

                                    <div>
                                        <button class="ml-1 btn btn-sm btn-danger" title="Excluir campo GPX"
                                            @click="deleteFeature('gpx', index)"
                                            :disabled="explanation.config.gpx.features.length == 1">
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-primary" title="Adicionar campo GPX"
                                            @click="addFeature('gpx')">
                                            <font-awesome-icon icon="plus" />
                                        </button>
                                        <button class="ml-1 btn btn-sm btn-success" title="Adicionar campo GPX"
                                            @click="() => { }">
                                            <font-awesome-icon icon="play" />
                                        </button>
                                    </div>
                                </div>
                            </b-card-body>
                        </b-card>
                    </div>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
import Notifier from '../../../mixins/Notifier.js';
import InputHeader from '../../../components/InputHeader.vue';

export default {
    components: {
        InputHeader,
    },
    mixins: [Notifier],
    data() {
        return {
            explanation: {
                config: {
                    interestClass: 'a',
                    sklLocal: { features: [{}] },
                    marginalLocal: { features: [{}] },
                    marginalGlobal: { features: [{}] },
                    shap: { features: [{}] },
                    lime: { features: [{}] },
                    gpx: { features: [{}] }
                }
            },
            isDirty: false,
            mockInfo: ['batata', 'feijao', 'arroz', 'farofa'],
            currentOption: 'Marginal Local',
            menuOptions: ['SQL Local', 'Marginal Local', 'Marginal Global', 'SHAP', 'LIME', 'GPX']
        };
    },
    watch: {
        explanation: {
            handler(val) {
                console.log(val);
                this.isDirty = true;
            },
            deep: true
        }
    },
    async mounted() {
        this.load();
    },
    methods: {
        async load() {
            this.$Progress.start();
            try {
                setTimeout(1000);
                this.$Progress.finish();
                this.explanation = {
                    id: 2,
                    name: 'myModel',
                    description: 'model de teste',
                    modelId: 5,
                    config: {
                        interestClass: 'a',
                        sklLocal: {
                            features: [{}]
                        },
                        marginalLocal: {
                            features: [{}]
                        },
                        marginalGlobal: {
                            features: [{}]
                        },
                        shap: {
                            features: [{}]
                        },
                        lime: {
                            features: [{}]
                        },
                        gpx: {
                            features: [{}]
                        }
                    }
                };
                console.log(this.explanation);
            } catch (e) {
                this.$Progress.finish();
                this.error(e);
            }
        },
        onSubmit() {
            console.log(this.explanation);
        },
        deleteFeature(model, index) {
            this.explanation.config[model].features.splice(index, 1);
        },
        addFeature(model) {
            this.explanation.config[model].features.push({});
        },
    }
};
</script>

<style>
.scrollable {
    overflow-x: scroll;
}

.active-option {
    background-color: #007bff;
    color: white;
}
</style>