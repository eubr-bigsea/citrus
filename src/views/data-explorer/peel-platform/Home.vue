<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center">
            <h1>Plataforma Peel</h1>
        </div>
        <hr>
        <h6>Criar Explicação</h6>
        <p>
            Preencha os dados abaixo para iniciar o processo de criação de uma nova explicação e importe um modelo como
            base de análises.
        </p>

        <div class="row">
            <div class="col-12">
                <b-card no-body>
                    <b-tabs card>
                        <b-tab title="Explicação">
                            <div class="p-3">
                                <b-form @submit.prevent="onSubmit">
                                    <b-form-group id="input-group-1" label="Nome da Explicação:" label-for="input-name">
                                        <b-form-input id="input-name" v-model="explanation.name"
                                            placeholder="Preencha o nome" required></b-form-input>
                                    </b-form-group>

                                    <b-form-group id="input-group-3" label="Escopo de Análise:"
                                        label-for="checkboxes-scope">
                                        <b-form-checkbox-group v-model="explanation.scope" id="checkbox-scope" required>
                                            <b-form-checkbox value="local">Local</b-form-checkbox>
                                            <b-form-checkbox value="global">Global</b-form-checkbox>
                                        </b-form-checkbox-group>
                                    </b-form-group>

                                    <div class="bg-light p-3 my-1" v-if="explanation.scope.includes('local')">
                                        <b-form-group id="input-group-4-1" label="Classe de Interesse:"
                                            label-for="input-class">
                                            <b-form-select id="input-class" v-model="explanation.config.interestClass"
                                                :options="modelsList" required />
                                        </b-form-group>
                                        <b-form-group id="input-group-4-2" label="Explicador:"
                                            label-for="checkboxes-explainers">
                                            <b-form-checkbox-group v-model="explanation.config.explainer"
                                                id="checkbox-local-explainers" required>
                                                <b-form-checkbox value="local-skl">Skl Local</b-form-checkbox>
                                                <b-form-checkbox value="local-marginal">Marginal</b-form-checkbox>
                                                <b-form-checkbox value="local-shap">SHAP</b-form-checkbox>
                                                <b-form-checkbox value="local-lime">LIME</b-form-checkbox>
                                                <b-form-checkbox value="local-gpx">GPX</b-form-checkbox>
                                            </b-form-checkbox-group>
                                        </b-form-group>
                                    </div>
                                </b-form>
                            </div>
                        </b-tab>
                        <b-tab title="Modelo">
                            <div class="p-3">
                                <b-form @submit.prevent="onSubmit">
                                    <b-form-checkbox v-model="explanation.model.isUpload" id="input-enabled"
                                        class="mb-1">
                                        Fazer upload do modelo
                                    </b-form-checkbox>
                                    <b-form-group v-if="!explanation.model.isUpload" id="input-group-2" label="Modelo:"
                                        label-for="input-model">
                                        <vue-select v-model="explanation.model.model" :filterable="false"
                                            :options="modelList" label="name" class="w-100" @search="loadModelList">
                                            <template #no-options="{}">
                                                <small>Digite parte do nome para pesquisar...</small>
                                            </template>
                                            <template #option="option">
                                                <b-container>
                                                    <b-row class="align-items-center">
                                                        <!-- <font-awesome-icon icon="fa fa-flask" /> -->
                                                        <b-col cols="9">
                                                            {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                                        </b-col>
                                                        <b-col cols="2">
                                                            {{ option.type }}
                                                        </b-col>
                                                    </b-row>
                                                </b-container>
                                            </template>
                                            <template #default="option">
                                                {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }} - {{ option.type
                                                }}
                                            </template>
                                            <template #selected-option="option">
                                                <div class="selected d-center">
                                                    {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }} | {{
                                                        option.type }}
                                                </div>
                                            </template>
                                        </vue-select>
                                    </b-form-group>

                                    <b-form-group v-if="explanation.model.isUpload" id="input-group-8" label="Modelo:"
                                        label-for="input-upload">
                                        <b-form-file id="input-upload" v-model="explanation.model.file"
                                            @change="handleFileUpload" accept=".pkl"
                                            placeholder="Selecione um arquivo"></b-form-file>
                                    </b-form-group>

                                    <b-form-group v-if="explanation.model.isUpload" id="input-group-4"
                                        label="URI do Modelo:" label-for="input-uri">
                                        <b-form-input id="input-uri" v-model="explanation.model.uri" readonly />
                                    </b-form-group>

                                    <b-form-group v-if="explanation.model.isUpload" id="input-group-2"
                                        label="Nome do Modelo:" label-for="input-description">
                                        <b-form-input id="input-description" v-model="explanation.model.name"
                                            required />
                                    </b-form-group>

                                    <b-form-group v-if="explanation.model.isUpload" id="input-group-2" label="Descrição do Modelo:"
                                        label-for="input-description">
                                        <b-form-input id="input-description" v-model="explanation.model.description"
                                            required />
                                    </b-form-group>

                                    <b-form-group v-if="explanation.model.isUpload" id="input-group-3" label="Modelo Habilitado:"
                                        label-for="input-enabled">
                                        <b-form-checkbox v-model="explanation.model.enabled" id="input-enabled">
                                            Modelo habilitado
                                        </b-form-checkbox>
                                    </b-form-group>

                                    <b-form-group v-if="explanation.model.isUpload" id="input-group-5" label="Tipo do Modelo:" label-for="input-type">
                                        <b-form-input id="input-type" v-model="explanation.model.model_type" required />
                                    </b-form-group>

                                    <b-form-group v-if="explanation.model.isUpload" id="input-group-6" label="Classe do Modelo:" label-for="input-class">
                                        <b-form-input id="input-class" v-model="explanation.model.class_name"
                                            required />
                                    </b-form-group>

                                    <b-form-group v-if="explanation.model.isUpload" id="input-group-7" label="Digest do Modelo:" label-for="input-digest">
                                        <b-form-input id="input-digest" v-model="explanation.model.digest" required />
                                    </b-form-group>


                                </b-form>
                            </div>
                        </b-tab>


                        <b-tab title="Fonte de Dados">
                            <div class="p-3">
                                <b-form @submit.prevent="onSubmit">

                                    <b-form-checkbox v-model="explanation.datasource.isUpload" id="input-enabled-upload"
                                        class="mb-1">
                                        Fazer upload da fonte de dados
                                    </b-form-checkbox>

                                    <b-form-group v-if="!explanation.datasource.isUpload" id="input-group-2" label="Fonte de Dados:"
                                        label-for="input-model">
                                        <vue-select v-model="explanation.model.model" :filterable="false"
                                            :options="modelList" label="name" class="w-100" @search="loadModelList">
                                            <template #no-options="{}">
                                                <small>Digite parte do nome para pesquisar...</small>
                                            </template>
                                            <template #option="option">
                                                <b-container>
                                                    <b-row class="align-items-center">
                                                        <!-- <font-awesome-icon icon="fa fa-flask" /> -->
                                                        <b-col cols="9">
                                                            {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                                        </b-col>
                                                        <b-col cols="2">
                                                            {{ option.type }}
                                                        </b-col>
                                                    </b-row>
                                                </b-container>
                                            </template>
                                            <template #default="option">
                                                {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }} - {{ option.type
                                                }}
                                            </template>
                                            <template #selected-option="option">
                                                <div class="selected d-center">
                                                    {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }} | {{
                                                        option.type }}
                                                </div>
                                            </template>
                                        </vue-select>
                                    </b-form-group>

                                    <b-form-group v-if="explanation.datasource.isUpload" id="input-group-upload-file"
                                        label="Fonte de Dados:" label-for="input-upload-file">
                                        <b-form-file id="input-upload-file" v-model="explanation.datasource.file"
                                            @change="handleDatasourceUpload" accept=".csv"
                                            placeholder="Selecione um arquivo"></b-form-file>
                                    </b-form-group>

                                    <b-form-group v-if="explanation.datasource.isUpload" id="input-group-upload-uri"
                                        label="URI da Fonte de Dados:" label-for="input-upload-uri">
                                        <b-form-input id="input-upload-uri" v-model="explanation.datasource.uri"
                                            readonly />
                                    </b-form-group>

                                    <b-form-group v-if="explanation.datasource.isUpload" id="input-group-1" label="Nome da Fonte de Dados:"
                                        label-for="input-name">
                                        <b-form-input id="input-name" v-model="explanation.datasource.name" required />
                                    </b-form-group>
                                    <b-form-group v-if="explanation.datasource.isUpload" id="input-group-2" label="Descrição da Fonte de Dados:"
                                        label-for="input-description">
                                        <b-form-input id="input-description"
                                            v-model="explanation.datasource.description" required />
                                    </b-form-group>

                                    <b-form-group v-if="explanation.datasource.isUpload" id="input-group-3" label="Fonte de Dados Habilitada:"
                                        label-for="input-enabled">
                                        <b-form-checkbox v-model="explanation.datasource.enabled" id="input-enabled">
                                            Fonte de dados habilitada
                                        </b-form-checkbox>
                                    </b-form-group>

                                    <b-form-group v-if="explanation.datasource.isUpload" id="input-group-5" label="Delimitador de Atributo:"
                                        label-for="input-attributed-delimiter">
                                        <b-form-input id="input-attributed-delimiter"
                                            v-model="explanation.datasource.attributed_delimiter"
                                            required></b-form-input>
                                    </b-form-group>

                                    <b-form-group v-if="explanation.datasource.isUpload" id="input-group-6" label="Delimitador de Registro:"
                                        label-for="input-record-delimiter">
                                        <b-form-input id="input-record-delimiter"
                                            v-model="explanation.datasource.record_delimiter" required></b-form-input>
                                    </b-form-group>
                                </b-form>
                            </div>
                        </b-tab>
                    </b-tabs>
                </b-card>
                <div class="mt-2 d-flex justify-content-end">
                    <b-link :to="{ name: 'index-explorer' }" class="btn btn-secondary btn-sm mr-1">
                        {{ $t('actions.cancel') }}
                    </b-link>
                    <router-link :to="{ name: 'explanationEdit', params: { id: 1 } }"
                        class="btn btn-sm btn-primary pr-4 pl-4">
                        {{ $tc('actions.create2') }}
                    </router-link>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import Notifier from '../../../mixins/Notifier.js';
import { debounce } from "../../../util.js";
import ExplanationModel from '../../../mixins/ExplanationModel.js';
import vSelect from 'vue-select';

export default {
    name: "ExplanationCreate",
    components: {
        'vue-select': vSelect,
    },
    mixins: [ExplanationModel, Notifier],
    data() {
        return {
            modelList: [],
            explanation: {
                name: "",
                scope: [],
                config: {
                    interestClass: null,
                    explainer: [],
                },
                model: {
                    name: "",
                    description: "",
                    model: null,
                    file: null,
                    isUpload: false
                },
                datasource: {
                    name: "",
                    description: "",
                    file: null,
                    isUpload: false
                },
            },
            modelsList: ['teste', 'teste2', 'lalaal']
        };
    },
    methods: {
        searchModelList(search, loading) {
            const lowerCaseSearchText = search.toLowerCase();
            return this.modelList.filter(item => item.name.toLowerCase().includes(lowerCaseSearchText));
        },
        pad(num, places, ch) {
            return String(num).padStart(places, ch)
        },
        show() {
            this.$refs.scheduleModal.show();
        },
        confirm() {
            console.log(':P');
        },
        onReset() { },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.explanation.model.uri = URL.createObjectURL(file);
            }
        },
        handleDatasourceUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.explanation.datasource.uri = URL.createObjectURL(file);
            }
        },
        onSubmit() {
            console.log(this.explanation);
        },
    },
};
</script>
