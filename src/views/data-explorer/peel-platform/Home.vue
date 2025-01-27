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
                    <div class="p-3">
                        <b-form @submit.prevent="onSubmit">
                            <b-form-group id="input-group-1" label="Nome da Explicação:" label-for="input-name">
                                <b-form-input id="input-name" v-model="explanation.name" placeholder="Preencha o nome"
                                    required></b-form-input>
                            </b-form-group>

                            <b-form-group id="input-group-1" label="Descrição:" label-for="input-name">
                                <b-form-textarea id="input-name" v-model="explanation.description"
                                    placeholder="Preencha a descrição" required></b-form-textarea>
                            </b-form-group>

                            <b-form-group id="input-group-2" label="Modelo:" label-for="input-model">

                                <vue-select v-model="explanation.selectedModel" :filterable="false" :options="modelList"
                                    label="name" class="w-100" @search="onSearchModel">
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

                            <b-form-group label="Fonte de Dados:" label-for="input-datasource">
                                <vue-select v-model="explanation.selectedDatasource" :filterable="false"
                                    :options="datasourceList" label="name" class="w-100" @search="onSearchDatasource">
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

                    <b-modal id="upload-modal" ref="modelModal" title="Fazer Upload do Modelo" @ok="submitModel">
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
                                <b-form-input id="input-description" v-model="explanation.model.description" required />
                            </b-form-group>

                            <b-form-group label="Tipo:" label-for="input-type">
                                <b-form-input id="input-type" v-model="explanation.model.model_type" required />
                            </b-form-group>

                            <b-form-group label="Classe:" label-for="input-class">
                                <b-form-input id="input-class" v-model="explanation.model.class_name" required />
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

                    <b-modal id="upload-datasource-modal" ref="datasourceModal" title="Fazer Upload da Fonte de Dados"
                        @ok="submitDatasource">
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
                                <b-form-input id="input-description" v-model="explanation.datasource.description"
                                    required />
                            </b-form-group>

                            <b-form-group label="Delimitador de Atributo:" label-for="input-attributed-delimiter">
                                <b-form-input id="input-attributed-delimiter"
                                    v-model="explanation.datasource.attributed_delimiter" required></b-form-input>
                            </b-form-group>

                            <b-form-group label="Delimitador de Registro:" label-for="input-record-delimiter">
                                <b-form-input id="input-record-delimiter"
                                    v-model="explanation.datasource.record_delimiter" required></b-form-input>
                            </b-form-group>

                            <b-form-group label="Encoding:" label-for="input-encoding">
                                <b-form-input id="input-encoding" v-model="explanation.datasource.encoding" required />
                            </b-form-group>
                        </b-form>
                        <template #modal-footer>
                            <b-button variant="secondary" @click="handleCloseDataSourceModal">Cancelar</b-button>
                            <b-button variant="primary" @click="submitDatasource">Enviar</b-button>
                        </template>
                    </b-modal>
                </b-card>
                <div class="mt-2 d-flex justify-content-end">
                    <b-link :to="{ name: 'index-explorer' }" class="btn btn-secondary btn-sm mr-1">
                        {{ $t('actions.cancel') }}
                    </b-link>
                    <b-button @click="onSubmit()" variant="primary" class="btn btn-sm btn-primary pr-4 pl-4">
                        {{ $tc('actions.create2') }}
                    </b-button>
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
const API_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
};

export default {
    name: "ExplanationCreate",
    components: {
        "vue-select": vSelect,
    },
    mixins: [ExplanationModel, Notifier],
    data() {
        return {
            explanation: {
                name: "",
                description: "",
                selectedModel: null,
                selectedDatasource: null,
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
                    attributed_delimiter: "",
                    record_delimiter: "",
                    encoding: "",
                    file: null,
                },
            },
            modelList: [],
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

        resetForm(formType) {
            const formData = {
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
                    attributed_delimiter: "",
                    record_delimiter: "",
                    encoding: "",
                    file: null,
                },
            };
            this.explanation[formType] = formData[formType];
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
                const formData = new FormData();
                formData.append("file", file);

                const response = await axios.post(url, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                return response.data.uri;
            } catch (error) {
                console.error("Erro ao enviar o arquivo:", error.response?.data || error.message);
                return null;
            }
        },

        async submitModel() {
            try {
                const uri = await this.uploadFile(this.explanation.model.file, "model");
                if (!uri) throw new Error("URI não gerada.");

                const url = `${peelUrl}/model/`;
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

                await axios.post(url, data, { headers: API_HEADERS });
                this.closeModal("modelModal");
                this.resetForm("model");
            } catch (error) {
                console.error("Erro ao enviar o modelo:", error.response?.data || error.message);
            }
        },

        async submitDatasource() {
            try {
                const uri = await this.uploadFile(this.explanation.datasource.file, "datasource");
                if (!uri) throw new Error("URI não gerada.");

                const url = `${peelUrl}/datasource/`;
                const data = {
                    name: this.explanation.datasource.name,
                    description: this.explanation.datasource.description,
                    enabled: true,
                    uri,
                    data_format: "csv",
                    attributed_delimiter: this.explanation.datasource.attributed_delimiter,
                    record_delimiter: this.explanation.datasource.record_delimiter,
                    encoding: this.explanation.datasource.encoding,
                };

                await axios.post(url, data, { headers: API_HEADERS });
                this.closeModal("datasourceModal");
                this.resetForm("datasource");
            } catch (error) {
                console.error("Erro ao enviar a fonte de dados:", error.response?.data || error.message);
            }
        },

        async onSearchModel(searchQuery) {
            await this.loadList("model", searchQuery);
        },

        async onSearchDatasource(searchQuery) {
            await this.loadList("datasource", searchQuery);
        },

        async loadList(type, searchQuery) {
            try {
                const url = `${peelUrl}/${type}/list`;
                const params = {
                    enabled: true,
                    name: searchQuery,
                    limit: 10,
                    page: 0,
                    sort: 'name',
                };

                const response = await axios.get(url, { params });
                this[`${type}List`] = response.data.data;
            } catch (error) {
                console.error(`Erro ao carregar ${type}:`, error.response?.data || error.message);
            }
        },

        async onSubmit() {
            try {
                const url = `${peelUrl}/understanding/`;
                const params = {
                    id_datasource: this.explanation.selectedDatasource.id,
                    id_model: this.explanation.selectedModel.id,
                    name: this.explanation.name,
                    description: this.explanation.description,
                    enabled: true,
                };

                const response = await axios.post(url, params, { headers: API_HEADERS });
                this.$router.push({ name: 'explanationEdit', params: { id: response.data.id } });
            } catch (error) {
                console.error("Erro ao criar explicação:", error.response?.data || error.message);
            }
        },
    },
};
</script>
