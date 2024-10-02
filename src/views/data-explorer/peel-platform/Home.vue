<template>
    <main role="main">
            <div class="d-flex justify-content-between align-items-center">
                <h1>Plataforma Peel</h1>
            </div>
            <hr>
            <!-- <div class="d-flex justify-content-md-center">
            <div class="card-deck w-50"> -->
            <div class="d-flex">
                <div class="card-deck">
                <b-card>
                    <h6>Criar Explicação</h6>
                    <p>
                        Preencha os dados abaixos para iniciar o processo de criação de uma 
                        nova explicação e importe um modelo como base de análises.
                    </p>

                    <hr class="mt-4 mb-4">
                    <b-form @submit.prevent="onSubmit" v-if="show">

                        <b-form-group id="input-group-1" label="Nome da Explicação:" label-for="input-name">
                            <b-form-input
                            id="input-name"
                            v-model="explanation.name"
                            placeholder="Preencha o nome"
                            required
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group id="input-group-2" label="Modelo:" label-for="input-model">
                            <vue-select v-model="explanation.model" :filterable="false" :options="modelList" label="name"
                                    class="w-100" @search="loadModelList" >
                                <template #no-options="{ }">
                                    <small>Digite parte do nome para pesquisar...</small>
                                </template>
                                <template #option="option">
                                    <b-container>
                                        <b-row class="align-items-center">
                                            <!-- <font-awesome-icon icon="fa fa-flask" /> -->
                                            <b-col cols="9">
                                                {{pad(option.id, 4, '&nbsp;')}} - {{option.name}}
                                            </b-col>
                                            <b-col cols="2">
                                                {{option.type}}
                                            </b-col>
                                        </b-row>
                                    </b-container>
                                </template>
                                <template #default="option">
                                    {{pad(option.id, 4, '&nbsp;')}} - {{option.name}} - {{option.type}}
                                </template>
                                <template #selected-option="option">
                                    <div class="selected d-center">
                                        <!-- <font-awesome-icon icon="fa fa-flask" class="mr-2" /> -->
                                        {{pad(option.id, 4, '&nbsp;')}} - {{option.name}} | {{option.type}}
                                    </div>
                                </template>
                            </vue-select>
                        </b-form-group>

                        <b-form-group id="input-group-3" label="Escopo de Análise:" label-for="checkboxes-scope">
                            <b-form-checkbox-group
                            v-model="explanation.scope"
                            id="checkbox-scope"
                            required
                            >
                            <b-form-checkbox value="local">Local</b-form-checkbox>
                            <b-form-checkbox value="global">Global</b-form-checkbox>
                            </b-form-checkbox-group>
                        </b-form-group>
                        
                        <div class="bg-light p-3 my-1" v-if="explanation.scope.includes('local')">
                            <b-form-group id="input-group-4-1" label="Classe de Interesse:" label-for="input-model">
                                <b-form-select
                                id="input-model"
                                v-model="explanation.config.interestClass"
                                :options="modelsList"
                                required/>
                            </b-form-group>
                            <b-form-group id="input-group-4-2" label="Explicador:" label-for="checkboxes-explainers">
                                <b-form-checkbox-group
                                    v-model="explanation.config.explainer"
                                    id="checkbox-local-explainers"
                                    required
                                    >
                                    <b-form-checkbox value="local-skl">Skl Local</b-form-checkbox>
                                    <b-form-checkbox value="local-marginal">Marginal</b-form-checkbox>
                                    <b-form-checkbox value="local-shap">SHAP</b-form-checkbox>
                                    <b-form-checkbox value="local-lime">LIME</b-form-checkbox>
                                    <b-form-checkbox value="local-gpx">GPX</b-form-checkbox>
                                </b-form-checkbox-group>
                            </b-form-group>
                        </div>
                        <div class="bg-light p-3 my-1" v-if="explanation.scope.includes('global')">
                            <b-form-group id="input-group-5-1" label="Explicador:" label-for="checkboxes-global-explainers">
                                <b-form-checkbox-group
                                    v-model="explanation.config.explainer"
                                    id="checkbox-global-explainers"
                                    required
                                    >
                                    <b-form-checkbox value="global-model">Modelo Global</b-form-checkbox>
                                    <b-form-checkbox value="global-marginal">Marginal Global</b-form-checkbox>
                                    <b-form-checkbox value="global-shap">SHAP Global</b-form-checkbox>
                                </b-form-checkbox-group>
                            </b-form-group>

                        </div>
                        <hr>
                        <router-link :to="{name: 'explanationEdit', params: {id: 1}}" class="btn btn-sm btn-primary pr-4 pl-4">
                            {{$tc('actions.create2')}}
                        </router-link>
                        <!-- <button type="submit" class="btn btn-sm btn-primary pr-4 pl-4">
                            {{ $t('actions.create2') }}
                        </button> -->
                        <b-link :to="{ name: 'index-explorer' }" class="btn btn-secondary btn-sm ml-1">
                            {{ $t('actions.cancel') }}
                        </b-link>
                    </b-form>
                </b-card>
            </div>
            </div>
    </main>

</template>

<script>
import Notifier from '../../../mixins/Notifier.js';
import vSelect from 'vue-select';
import { debounce } from "../../../util.js";
import ExplanationModel from '../../../mixins/ExplanationModel.js';

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        'vue-select': vSelect,
    },
    mixins: [ExplanationModel, Notifier],
    data() {
        return {
            modelList: [],
            explanation: {
                name: null,
                modelId: null,
                model: null,
                scope: [],
                config: {},
            },
            modelsList: ['teste','teste2','lalaal']
        }
    },
    watch: {
        explanation: {
        handler(newValue, oldValue) {
            console.log(newValue);
        },
        deep: true // Usado para observar mudanças dentro de objetos aninhados
        }
    },
    methods: {
        searchModelList(search, loading){
            const lowerCaseSearchText = search.toLowerCase();
            return this.modelList.filter(item => item.name.toLowerCase().includes(lowerCaseSearchText));
        },
        pad (num, places, ch){ 
            return String(num).padStart(places, ch)
        },
        show() {
            this.$refs.scheduleModal.show();
        },
        confirm() {
            console.log(':P');
        },
        onSubmit() {
            console.log(this.explanation);
        },
        onReset() {}
    }
}
</script>