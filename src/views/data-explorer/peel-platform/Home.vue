<template>
    <main role="main">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h1>Plataforma Peel</h1>
            </div>
            <hr>
        </div>
        <div class="card shadow-sm">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Entendimentos</h5>
                    <button class="btn btn-success" @click="createExplanation">
                        <font-awesome-icon icon="plus" />
                        Adicionar
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <v-server-table ref="undestandingTable" :columns="columns" :options="options"
                        name="understandingTablePell" class="table table-striped">

                        <template #created="props">
                            {{ new Date(props.row.created).toLocaleString("pt-BR") }}
                        </template>

                        <template #updated="props">
                            {{ new Date(props.row.updated).toLocaleString("pt-BR") }}
                        </template>

                        <template #view="props">
                            <router-link :to="{ name: 'explanationEdit', params: { id: props.row.id } }">
                                <button class="btn btn-sm btn-primary">
                                    <font-awesome-icon icon="eye" />
                                </button>
                            </router-link>
                        </template>

                        <template #delete="props">
                            <button class="btn btn-sm btn-danger" @click="openDeleteConfirmation(props.row)">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </template>
                    </v-server-table>
                </div>
            </div>
        </div>

        <b-button :to="{ name: 'index-explorer' }" class="mt-3">Voltar</b-button>
        
        <b-modal id="upload-modal" ref="modelModal" title="Fazer Upload do Modelo" @ok="submitModel">
            <b-form>
                <b-form-group label="Arquivo:" label-for="input-upload">
                    <b-form-file id="input-upload" v-model="selectedExplanation.model.file"
                        @change="handleFileUpload($event, 'model')" accept=".pkl"
                        placeholder="Selecione um arquivo"></b-form-file>
                </b-form-group>

                <b-form-group label="Nome:" label-for="input-name">
                    <b-form-input id="input-name" v-model="selectedExplanation.model.name" required />
                </b-form-group>

                <b-form-group label="Descrição:" label-for="input-description">
                    <b-form-input id="input-description" v-model="selectedExplanation.model.description" required />
                </b-form-group>

                <b-form-group label="Tipo:" label-for="input-type">
                    <b-form-input id="input-type" v-model="selectedExplanation.model.model_type" required />
                </b-form-group>

                <b-form-group label="Classe:" label-for="input-class">
                    <b-form-input id="input-class" v-model="selectedExplanation.model.class_name" required />
                </b-form-group>

                <b-form-group label="Versão:" label-for="input-version">
                    <b-form-input id="input-version" v-model="selectedExplanation.model.version" required />
                </b-form-group>

                <b-form-group label="Digest:" label-for="input-digest">
                    <b-form-input id="input-digest" v-model="selectedExplanation.model.digest" required />
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
                    <b-form-file id="input-upload-file" v-model="selectedExplanation.datasource.file"
                        @change="handleFileUpload($event, 'datasource')" accept=".csv"
                        placeholder="Selecione um arquivo"></b-form-file>
                </b-form-group>

                <b-form-group label="Nome:" label-for="input-name">
                    <b-form-input id="input-name" v-model="selectedExplanation.datasource.name" required />
                </b-form-group>

                <b-form-group label="Descrição:" label-for="input-description">
                    <b-form-input id="input-description" v-model="selectedExplanation.datasource.description"
                        required />
                </b-form-group>

                <b-form-group label="Delimitador de Atributo:" label-for="input-attributed-delimiter">
                    <b-form-input id="input-attributed-delimiter"
                        v-model="selectedExplanation.datasource.attributed_delimiter" required></b-form-input>
                </b-form-group>

                <b-form-group label="Delimitador de Registro:" label-for="input-record-delimiter">
                    <b-form-input id="input-record-delimiter" v-model="selectedExplanation.datasource.record_delimiter"
                        required></b-form-input>
                </b-form-group>

                <b-form-group label="Encoding:" label-for="input-encoding">
                    <b-form-input id="input-encoding" v-model="selectedExplanation.datasource.encoding" required />
                </b-form-group>
            </b-form>
            <template #modal-footer>
                <b-button variant="secondary" @click="handleCloseDataSourceModal">Cancelar</b-button>
                <b-button variant="primary" @click="submitDatasource">Enviar</b-button>
            </template>
        </b-modal>

        <b-modal v-model="showDeleteConfirmation" title="Confirmar Exclusão" @ok="confirmDelete" ok-title="Excluir"
            cancel-title="Cancelar" ok-variant="danger">
            <p>Tem certeza de que deseja excluir este algoritmo?</p>
        </b-modal>
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
            showDeleteConfirmation: false,
            explanationToDelete: null,
            columns: ['id', 'name', 'description', 'created', 'updated', 'view', 'delete'],
            options: {
                perPage: 10,
                perPageValues: [10],
                skin: 'table-sm table table-hover',
                preserveState: true,
                saveState: true,
                headings: {
                    id: 'ID',
                    name: "Nome",
                    description: "Descrição",
                    created: "Criado",
                    updated: "Atualizado",
                    view: "Visualizar",
                    edit: "Editar",
                    delete: "Excluir",
                },
                filterable: ['id', 'name'],
                sortable: ['id', 'name', 'description', 'created', 'updated'],
                requestFunction: async function (data) {
                    const self = this;
                    const limit = data.limit;
                    const page = data.page - 1;
                    const filter = data.query || "";
                    const orderBy = data.orderBy || "name";
                
                    self.$Progress.start();
                    return axios
                        .get(`${peelUrl}/understanding/list`, {
                            params: {
                                enabled: true,
                                limit: limit,
                                page: page,
                                name: filter,
                                sort: orderBy,
                            },
                        })
                        .then((response) => {
                            self.$Progress.finish();
                            self.totalRows = response.data.totalRows;
                            return {
                                data: response.data.data,
                                count: response.data.totalRows,
                            };
                        })
                        .catch((error) => {
                            self.$Progress.finish();
                            self.error(error);
                        });
                },
                texts: {
                    filter: this.$tc('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
                },
            },
            showEditPopup: false,
            selectedExplanation: {
                id: null,
                name: "",
                description: "",
                selectedModel: 1,
                selectedDatasource: 1,
                model: {
                    name: "",
                    description: "",
                    model_type: "",
                    version: "",
                    class_name: "",
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
        createExplanation() {
            this.$router.push({ name: "explanationCreate" });
        },
        pad(num, places, ch = "0") {
            return String(num).padStart(places, ch);
        },

        showModal(ref) {
            this.$refs[ref]?.show();
        },

        closeModal(ref) {
            this.$refs[ref]?.hide();
        },
        openDeleteConfirmation(explanation) {
            this.explanationToDelete = explanation;
            this.showDeleteConfirmation = true;
        },
        resetForm(formType) {
            const formData = {
                model: {
                    name: "",
                    description: "",
                    model_type: "",
                    version: "",
                    class_name: "",
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
            this.selectedExplanation[formType] = formData[formType];
        },

        handleFileUpload(event, type) {
            const file = event.target.files[0];
            if (file) {
                this.selectedExplanation[type].file = file;
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
                const uri = await this.uploadFile(this.selectedExplanation.model.file, "model");
                if (!uri) throw new Error("URI não gerada.");

                const url = `${peelUrl}/model/`;
                const data = {
                    name: this.selectedExplanation.model.name,
                    description: this.selectedExplanation.model.description,
                    enabled: true,
                    uri,
                    model_type: this.selectedExplanation.model.model_type,
                    version: this.selectedExplanation.model.version,
                    class_name: this.selectedExplanation.model.class_name,
                    digest: this.selectedExplanation.model.digest,
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
                const uri = await this.uploadFile(this.selectedExplanation.datasource.file, "datasource");
                if (!uri) throw new Error("URI não gerada.");

                const url = `${peelUrl}/datasource/`;
                const data = {
                    name: this.selectedExplanation.datasource.name,
                    description: this.selectedExplanation.datasource.description,
                    enabled: true,
                    uri,
                    data_format: "csv",
                    attributed_delimiter: this.selectedExplanation.datasource.attributed_delimiter,
                    record_delimiter: this.selectedExplanation.datasource.record_delimiter,
                    encoding: this.selectedExplanation.datasource.encoding,
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

        async saveExplanation() {
            try {
                const url = `${peelUrl}/understanding/${this.selectedExplanation.id}`;
                const data = {
                    name: this.selectedExplanation.name,
                    description: this.selectedExplanation.description,
                    id_model: this.selectedExplanation.selectedModel?.id,
                    id_datasource: this.selectedExplanation.selectedDatasource?.id,
                    enabled: true,
                };

                await axios.patch(url, data, { headers: API_HEADERS });
                this.$refs.undestandingTable.refresh();
                this.showEditPopup = false;
            } catch (error) {
            }
        },

        async confirmDelete() {
            if (this.explanationToDelete) {
                try {
                    const url = `${peelUrl}/understanding/${this.explanationToDelete.id}`;
                    const data = {
                        ...this.explanationToDelete,
                        enabled: false,
                    };
                    await axios.patch(url, data, { headers: API_HEADERS });
                    this.$refs.undestandingTable.refresh();
                } catch (error) {
                    console.error("Erro ao excluir entendimento:", error);
                } finally {
                    this.showDeleteConfirmation = false;
                    this.explanationToDelete = null;
                }
            }
        },

        handleCloseDataSourceModal() {
            this.closeModal("datasourceModal");
            this.resetForm("datasource");
        },

        handleCloseModelModal() {
            this.closeModal("modelModal");
            this.resetForm("model");
        },
    },
};
</script>
<style scoped>
.table-container {
    justify-content: center;
    align-items: center;
    width: 90%;
    margin: 0 auto;
}

.table-container .btn {
    vertical-align: middle;
}

.table-container table {
    width: 100%;
}
</style>
