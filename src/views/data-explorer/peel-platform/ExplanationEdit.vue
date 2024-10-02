<template>

<div>
    <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="mt-2">
            <h6 class="header-pretitle">
                Explicação #{{ explanation.id }}
            </h6>
            <h1>
                <InputHeader v-model="explanation.name" @input="isDirty = true"
                    :maxlength="50"/>
            </h1>
        </div>
        <div class="btn-group">
            <router-link :to="{ name: 'index-explorer' }"
                class="btn btn-outline-secondary d-print-none float-left btn-sm">
                <font-awesome-icon icon="fa-chevron-right" />
                {{ $t('actions.back') }}
            </router-link>
            <button class="btn btn-sm btn-outline-secondary float-left" @click="()=>{}">
                <font-awesome-icon icon="fa fa-eye" /> Visualizar
            </button>
            <button class="btn btn-sm btn-outline-primary float-left" @click="()=>{}">
                <font-awesome-icon icon="fa-solid fa-play" /> Gerar
            </button>
            <button class="btn btn-sm btn-success" :disabled="!isDirty" @click="()=>{}">
                <font-awesome-icon icon="fa fa-save" class="mr-1" /> {{ $tc('actions.save') }}
            </button>

        </div>
    </div>
    <div>
        <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block v-b-toggle.accordion-1 variant="secondary">Marginal Local</b-button>
                </b-card-header>
                <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                    <b-card-body class="scrollable row">
                        <div v-for="(feature, index) in explanation.config.marginalLocal.features"
                            :key="index"
                            class="bg-light col-3 mx-2 pd-2">

                            <b-form @submit.prevent="onSubmit">
                                <b-form-group label="Classe de Interesse:" label-for="input-model">
                                    <b-form-select
                                    id="input-model"
                                    v-model="feature.interestClass"
                                    :options="mockInfo"
                                    required/>
                                </b-form-group>
                                <b-form-group label="Instância de Interesse:" label-for="input-model">
                                    <b-form-select
                                    id="input-model"
                                    v-model="feature.interestInstance"
                                    :options="mockInfo"
                                    required/>
                                </b-form-group>
                                <b-form-group label="Conjunto Ruído:" label-for="input-model">
                                    <b-form-select
                                    id="input-model"
                                    v-model="feature.noiseSet"
                                    :options="mockInfo"
                                    required/>
                                </b-form-group>
                                <b-form-group label="Margem de x:" label-for="input-name">
                                    <b-form-input
                                    id="input-name"
                                    v-model="feature.horizontalMargin"
                                    required
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group label="Amostragem:" label-for="input-name">
                                    <b-form-input
                                    id="input-name"
                                    v-model="feature.sampling"
                                    required
                                    ></b-form-input>
                                </b-form-group>
                                
                                <b-form-group label="Algoritmo:" label-for="checkboxes-explainers">
                                    <b-form-checkbox-group
                                        v-model="feature.algorithm"
                                        id="checkbox-local-explainers"
                                        required
                                        >
                                        <b-form-checkbox value="partial-dependence-plot">
                                            Partial Dependence Plot</b-form-checkbox>
                                        <b-form-checkbox value="individual-conditional-expectation">
                                            Individual Conditional Expectation</b-form-checkbox>
                                        <b-form-checkbox value="accumulated-local-effects">
                                            Accumulated Local Effects</b-form-checkbox>
                                    </b-form-checkbox-group>
                                </b-form-group>
                            </b-form>

                            <div>
                                <button class="ml-1 btn btn-sm btn-danger" title="Excluir etapa"
                                    @click="deleteFeature('marginalLocal',index)"
                                    :disabled="explanation.config.marginalLocal.features.length == 1">
                                    <font-awesome-icon icon="trash" />
                                </button>
                                <button class="ml-1 btn btn-sm btn-primary" title="Adicionar etapa"
                                    @click="addFeature('marginalLocal')">
                                    <font-awesome-icon icon="plus" />
                                </button>
                            </div>
                        </div>
                    </b-card-body>
                </b-collapse>
                </b-card>

                <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block v-b-toggle.accordion-2 variant="secondary">SKL Local</b-button>
                </b-card-header>
                <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                    <b-card-body class="scrollable row">
                        <div v-for="(feature, index) in explanation.config.sklLocal.features"
                            :key="index"
                            class="bg-light col-3 mx-2 pd-2">

                            <b-form @submit.prevent="onSubmit">
                                <b-form-group label="Classe de Interesse:" label-for="input-model">
                                    <b-form-select
                                    id="input-model"
                                    v-model="feature.interestClass"
                                    :options="mockInfo"
                                    required/>
                                </b-form-group>
                                <b-form-group label="Instância de Interesse:" label-for="input-model">
                                    <b-form-select
                                    id="input-model"
                                    v-model="feature.interestInstance"
                                    :options="mockInfo"
                                    required/>
                                </b-form-group>
                                <b-form-group label="Conjunto Ruído:" label-for="input-model">
                                    <b-form-select
                                    id="input-model"
                                    v-model="feature.noiseSet"
                                    :options="mockInfo"
                                    required/>
                                </b-form-group>
                                <b-form-group label="Margem de x:" label-for="input-name">
                                    <b-form-input
                                    id="input-name"
                                    v-model="feature.horizontalMargin"
                                    required
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group label="Amostragem:" label-for="input-name">
                                    <b-form-input
                                    id="input-name"
                                    v-model="feature.sampling"
                                    required
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group label="Métrica:" label-for="input-model">
                                    <b-form-select
                                    id="input-model"
                                    v-model="feature.metrics"
                                    :options="mockInfo"
                                    required/>
                                </b-form-group>
                                <b-form-group label="Tolerância:" label-for="input-name">
                                    <b-form-input
                                    id="input-name"
                                    v-model="feature.tolerance"
                                    required
                                    ></b-form-input>
                                </b-form-group>
                                

                            </b-form>

                            <div>
                                <button class="ml-1 btn btn-sm btn-danger" title="Excluir etapa"
                                    @click="deleteFeature('sklLocal',index)"
                                    :disabled="explanation.config.sklLocal.features.length == 1">
                                    <font-awesome-icon icon="trash" />
                                </button>
                                <button class="ml-1 btn btn-sm btn-primary" title="Adicionar etapa"
                                    @click="addFeature('sklLocal')">
                                    <font-awesome-icon icon="plus" />
                                </button>
                            </div>
                        </div>
                    </b-card-body>
                </b-collapse>
                </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block v-b-toggle.accordion-3 variant="secondary">Marginal Global</b-button>
                </b-card-header>
                <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                    a
                    </b-card-body>
                </b-collapse>
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
            explanation: {config:{interestClass:'a', 
                marginalLocal: {features: [{}]}, 
                sklLocal: {features: [{}]}}
            },
            isDirty: false,
            mockInfo: ['batata','feijao','arroz','farofa'],
            features: [1,2]
        }
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
                setTimeout(1000)
                //const resp = await axios.get(`${tahitiUrl}/pipelines/${this.$route.params.id}`);
                this.$Progress.finish();
                this.explanation = {
                    id:2, 
                    name:'myModel', 
                    description:'model de teste', modelId:5,
                    config: {
                        interestClass: 'a', 
                        marginalLocal: {
                            features: [{}]
                        },
                        sklLocal: {
                            features: [{}]
                        },
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
        addFeature(model){
            this.explanation.config[model].features.push({});
        },
    }
}


</script>
<style>
.scrollable {
   overflow-x: scroll;
}
</style>