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
                                    <b-form-group id="input-group-2" label="Modelo:" label-for="input-model">

                                        <vue-select v-model="explanation.model.model" :filterable="false"
                                            :options="modelList" label="name" class="w-100" @search="loadModelList">
                                            <template #no-options="{}">
                                                <small>Digite parte do nome para pesquisar...</small>
                                            </template>
                                            <template #option="option">
                                                <b-container>
                                                    <b-row class="align-items-center">
                                                        {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                                    </b-row>
                                                </b-container>
                                            </template>
                                            <template #default="option">
                                                {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                            </template>
                                            <template #selected-option="option">
                                                <div class="selected d-center">
                                                    {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                                </div>
                                            </template>
                                        </vue-select>

                                        <small class="text-muted">
                                            Não encontrou o modelo?
                                            <b-button variant="link" @click="showModal('modelModal')">Faça o upload
                                                aqui</b-button>
                                        </small>
                                    </b-form-group>
                                </b-form>
                            </div>

                            <b-modal id="upload-modal" ref="modelModal" title="Fazer Upload do Modelo"
                                @ok="submitModel">
                                <b-form>
                                    <b-form-group label="Arquivo:" label-for="input-upload">
                                        <b-form-file id="input-upload" v-model="explanation.model.file"
                                            @change="handleFileUpload($event, 'model')" accept=".pkl"
                                            placeholder="Selecione um arquivo"></b-form-file>
                                    </b-form-group>

                                    <b-form-group label="Nome:" label-for="input-name">
                                        <b-form-input id="input-name" v-model="explanation.model.name" required />
                                    </b-form-group>

                                    <b-form-group label="Descrição:" label-for="input-description">
                                        <b-form-input id="input-description" v-model="explanation.model.description"
                                            required />
                                    </b-form-group>

                                    <b-form-group label="Tipo:" label-for="input-type">
                                        <b-form-input id="input-type" v-model="explanation.model.model_type" required />
                                    </b-form-group>

                                    <b-form-group label="Classe:" label-for="input-class">
                                        <b-form-input id="input-class" v-model="explanation.model.class_name"
                                            required />
                                    </b-form-group>

                                    <b-form-group label="Versão:" label-for="input-version">
                                        <b-form-input id="input-version" v-model="explanation.model.version" required />
                                    </b-form-group>

                                    <b-form-group label="Digest:" label-for="input-digest">
                                        <b-form-input id="input-digest" v-model="explanation.model.digest" required />
                                    </b-form-group>
                                </b-form>
                                <template #modal-footer>
                                    <b-button variant="secondary" @click="handleCloseModelModal">Cancelar</b-button>
                                    <b-button variant="primary" @click="submitModel">Enviar</b-button>
                                </template>
                            </b-modal>
                        </b-tab>



                        <b-tab title="Fonte de Dados">
                            <div class="p-3">
                                <b-form @submit.prevent="onSubmit">
                                    <b-form-group label="Fonte de Dados:" label-for="input-datasource">
                                        <vue-select v-model="explanation.datasource.datasource" :filterable="false"
                                            :options="datasourceList" label="name" class="w-100" @search="loadDatasourceList">
                                            <template #no-options="{}">
                                                <small>Digite parte do nome para pesquisar...</small>
                                            </template>
                                            <template #option="option">
                                                <b-container>
                                                    <b-row class="align-items-center">
                                                        {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                                    </b-row>
                                                </b-container>
                                            </template>
                                            <template #default="option">
                                                {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                            </template>
                                            <template #selected-option="option">
                                                <div class="selected d-center">
                                                    {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                                </div>
                                            </template>
                                        </vue-select>

                                        <small class="text-muted">
                                            Não encontrou a fonte de dados?
                                            <b-button variant="link" @click="showModal('datasourceModal')">Faça o upload
                                                aqui</b-button>
                                        </small>
                                    </b-form-group>
                                </b-form>
                            </div>

                            <b-modal id="upload-datasource-modal" ref="datasourceModal"
                                title="Fazer Upload da Fonte de Dados" @ok="submitDatasource">
                                <b-form>
                                    <b-form-group label="Arquivo:" label-for="input-upload-file">
                                        <b-form-file id="input-upload-file" v-model="explanation.datasource.file"
                                            @change="handleFileUpload($event, 'datasource')" accept=".csv"
                                            placeholder="Selecione um arquivo"></b-form-file>
                                    </b-form-group>

                                    <b-form-group label="Nome:" label-for="input-name">
                                        <b-form-input id="input-name" v-model="explanation.datasource.name" required />
                                    </b-form-group>

                                    <b-form-group label="Descrição:" label-for="input-description">
                                        <b-form-input id="input-description"
                                            v-model="explanation.datasource.description" required />
                                    </b-form-group>

                                    <b-form-group label="Delimitador de Atributo:"
                                        label-for="input-attributed-delimiter">
                                        <b-form-input id="input-attributed-delimiter"
                                            v-model="explanation.datasource.attributed_delimiter"
                                            required></b-form-input>
                                    </b-form-group>

                                    <b-form-group label="Delimitador de Registro:" label-for="input-record-delimiter">
                                        <b-form-input id="input-record-delimiter"
                                            v-model="explanation.datasource.record_delimiter" required></b-form-input>
                                    </b-form-group>

                                    <b-form-group label="Encoding:" label-for="input-encoding">
                                        <b-form-input id="input-encoding" v-model="explanation.datasource.encoding"
                                            required />
                                    </b-form-group>
                                </b-form>
                                <template #modal-footer>
                                    <b-button variant="secondary"
                                        @click="handleCloseDataSourceModal">Cancelar</b-button>
                                    <b-button variant="primary" @click="submitDatasource">Enviar</b-button>
                                </template>
                            </b-modal>
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
import Notifier from "../../../mixins/Notifier.js";
import ExplanationModel from "../../../mixins/ExplanationModel.js";
import vSelect from "vue-select";
import axios from "axios";

const peelUrl = import.meta.env.VITE_PELL_URL;

export default {
    name: "ExplanationCreate",
    components: {
        "vue-select": vSelect,
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
                    modelType: "",
                    version: "",
                    className: "",
                    digest: "",
                    file: null,
                },
                datasource: {
                    name: "",
                    description: "",
                    file: null,
                },
            },
            modelsList: [],
            datasourceList: [],
        };
    },
    methods: {
        pad(num, places, ch = "0") {
            return String(num).padStart(places, ch);
        },

        showModal(ref) {
            this.$refs[ref]?.show();
        },

        closeModal(ref) {
            this.$refs[ref]?.hide();
        },
        resetModelForm() {
            this.explanation.model = {
                name: "",
                description: "",
                model: null,
                file: null,
                isUpload: false,
                modelType: "",
                version: "",
                className: "",
                digest: "",
            };
        },
        resetDatasourceForm() {
            this.explanation.datasource = {
                name: "",
                description: "",
                file: null,
                isUpload: false,
                enabled: true,
                attributed_delimiter: "",
                record_delimiter: "",
                encoding: "",
            };
        },
        handleCloseModelModal() {
            this.closeModal("modelModal");
            this.resetModelForm();
        },
        handleCloseDataSourceModal() {
            this.closeModal("datasourceModal");
            this.resetDatasourceForm();
        },

        handleFileUpload(event, type) {
            const file = event.target.files[0];
            if (file) {
                this.explanation[type].file = file;
            }
        },

        async uploadFile(file, type) {
            if (!file) return null;

            try {
                const url = `${peelUrl}/upload/?type=${type}`;
                const headers = {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                };

                const formData = new FormData();
                formData.append("file", file);

                const response = await axios.post(url, formData, { headers });
                return response.data.uri;
            } catch (error) {
                console.error("Erro ao enviar o arquivo:", error.response?.data || error.message);
                return null;
            }
        },

        async submitModel() {
            try {
                const uri = await this.uploadFile(this.explanation.model.file, "model");
                if (!uri) {
                    console.error("URI  não gerada.");
                    return;
                }

                const url = `${peelUrl}/model/`;
                const headers = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };

                const data = {
                    name: this.explanation.model.name,
                    description: this.explanation.model.description,
                    enabled: true,
                    uri,
                    model_type: this.explanation.model.modelType,
                    version: this.explanation.model.version,
                    class_name: this.explanation.model.className,
                    digest: this.explanation.model.digest,
                };

                const response = await axios.post(url, data, { headers });
                this.closeModal("modelModal");
                this.resetModelForm();
            } catch (error) {
                console.error("Erro ao enviar o modelo:", error.response?.data || error.message);
            }
        },

        async submitDatasource() {
            try {
                const uri = await this.uploadFile(this.explanation.datasource.file, "datasource");
                if (!uri) {
                    console.error("URI não gerada.");
                    return;
                }

                const url = peelUrl + "/datasource/";
                const headers = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };

                const data = {
                    name: this.explanation.datasource.name,
                    description: this.explanation.datasource.description,
                    enabled: true,
                    uri,
                    data_format: "csv",
                    attributed_delimiter: this.explanation.datasource.attributed_delimiter,
                    record_delimiter: this.explanation.datasource.record_delimiter,
                    encoding: this.explanation.datasource.encoding
                };

                const response = await axios.post(url, data, { headers });
                this.closeModal("datasourceModal");
                this.resetDatasourceForm();
            } catch (error) {
                console.error("Erro ao enviar a fonte de dados:", error.response?.data || error.message);
            }
        },

        async loadModelList(searchQuery) {
            try {
                const url = peelUrl + "/model/list"
                const params = {
                    enabled: true,
                    name: searchQuery,
                    limit: 10,
                    page: 0,
                    sort: 'name',
                };
                const response = await axios.get(url, { params });                
                this.modelList = response.data.data;
            } catch (error) {
                console.error("Erro ao carregar os modelos:", error.response?.data || error.message);
            }
        },

        async loadDatasourceList(searchQuery) {
            try {
                const url = peelUrl + "/datasource/list"
                const params = {
                    enabled: true,
                    name: searchQuery,
                    limit: 10,
                    page: 0,
                    sort: 'name',
                };
                const response = await axios.get(url, { params });
                this.datasourceList = response.data.data;
            } catch (error) {
                console.error("Erro ao carregar os fonte de dados:", error.response?.data || error.message);
            }
        },

        onSubmit() {
            console.log("Dados da explicação enviados:", this.explanation);
        },
    },
};
</script>
