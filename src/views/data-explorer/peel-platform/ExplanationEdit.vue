<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="mt-2">
                <h6 class="header-pretitle">Explicação #{{ understanding.id }}</h6>
                <h1>
                    <InputHeader v-model="understanding.name" @input="isDirty = true" :maxlength="50" />
                </h1>
            </div>

            <b-dropdown text="Adicionar" variant="primary" class="m-2" boundary="viewport">
                <b-dropdown-item v-for="(item, index) in menuOptions" :key="index" @click="addFeature(item.value)">
                    {{ item.label }}
                </b-dropdown-item>
            </b-dropdown>

            <b-modal v-model="showImageModal" title="Resultado" hide-footer>
                <div v-if="imageUrl">
                    <img :src="imageUrl" class="img-fluid" />
                </div>
                <div v-else>
                    <p>Carregando imagem...</p>
                </div>
            </b-modal>
        </div>

        <div class="table-container ">
            <v-server-table ref="explanationTable" :columns="columns" :options="options" name="explanationTablePell">

                <template #created="props">
                    {{ new Date(props.row.created).toLocaleString("pt-BR") }}
                </template>

                <template #updated="props">
                    {{ new Date(props.row.updated).toLocaleString("pt-BR") }}
                </template>

                <template #executar="props">
                    <b-spinner class="ml-2" v-if="loading" variant="primary" label="Spinning"></b-spinner>
                    <button v-if="!loading" class="btn-sm btn-success" title="Executar"
                        @click.stop="runResult(props.row.id);">
                        <font-awesome-icon icon="play" />
                    </button>
                </template>

                <template #excluir="props">
                    <button class="btn-sm btn-danger" title="Excluir" @click.stop="deleteExplanation(props.row.id)">
                        <font-awesome-icon icon="trash" />
                    </button>
                </template>
            </v-server-table>
        </div>

        <b-modal v-model="showAddModal" :title="`Adicionar ${selectedAlgorithm}`" hide-footer>
            <b-form @submit.prevent="onAddSubmit">
                <div v-if="selectedAlgorithm === 'ale'">
                    <b-form-group label="Nome:" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.metadata.name" type="text" required />
                    </b-form-group>
                    <b-form-group label="Descrição:" label-for="input-feature">
                        <b-form-textarea id="input-x-margin" v-model="newItem.metadata.description" type="text"
                            required />
                    </b-form-group>
                    <b-form-group label="Recurso" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.arguments.which_feature" type="text"
                            required />
                    </b-form-group>
                </div>
                <div v-if="selectedAlgorithm === 'ensemble'">
                    <b-form-group label="Nome:" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.metadata.name" type="text" required />
                    </b-form-group>
                    <b-form-group label="Descrição:" label-for="input-feature">
                        <b-form-textarea id="input-x-margin" v-model="newItem.metadata.description" type="text"
                            required />
                    </b-form-group>
                    <b-form-group label="Numero de recurso" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.arguments.n_feature" type="number"
                            required />
                    </b-form-group>
                </div>
                <div v-if="selectedAlgorithm === 'gpx'">
                    <b-form-group label="Nome:" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.metadata.name" type="text" required />
                    </b-form-group>
                    <b-form-group label="Descrição:" label-for="input-feature">
                        <b-form-textarea id="input-x-margin" v-model="newItem.metadata.description" type="text"
                            required />
                    </b-form-group>
                    <b-form-group label="Instância (valores separados por vírgula):" label-for="input-instance">
                        <b-form-textarea id="input-instance" v-model="instanceInput" type="text" required />
                    </b-form-group>
                </div>
                <div v-if="selectedAlgorithm === 'linear'">
                    <b-form-group label="Nome:" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.metadata.name" type="text" required />
                    </b-form-group>
                    <b-form-group label="Descrição:" label-for="input-feature">
                        <b-form-textarea id="input-x-margin" v-model="newItem.metadata.description" type="text"
                            required />
                    </b-form-group>
                    <b-form-group label="Numero de recurso" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.arguments.n_feature" type="number"
                            required />
                    </b-form-group>
                </div>
                <div v-if="selectedAlgorithm === 'logit'">
                    <b-form-group label="Nome:" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.metadata.name" type="text" required />
                    </b-form-group>
                    <b-form-group label="Descrição:" label-for="input-feature">
                        <b-form-textarea id="input-x-margin" v-model="newItem.metadata.description" type="text"
                            required />
                    </b-form-group>
                    <b-form-group label="Numero de recurso" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.arguments.n_feature" type="number"
                            required />
                    </b-form-group>
                </div>
                <div v-if="selectedAlgorithm === 'shap'">
                    <b-form-group label="Nome:" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.metadata.name" type="text" required />
                    </b-form-group>
                    <b-form-group label="Descrição:" label-for="input-feature">
                        <b-form-textarea id="input-x-margin" v-model="newItem.metadata.description" type="text"
                            required />
                    </b-form-group>
                    <b-form-group label="Forma:" label-for="input-interest-feature">
                        <b-form-select id="input-interest-feature" v-model="newItem.arguments.shap_type_xai" :options="[
                            { value: 'waterfall', text: 'Cascata' },
                            { value: 'bar', text: 'Barra' },
                        ]" required />
                    </b-form-group>
                    <b-form-group label="Instância (valores separados por vírgula):" label-for="input-instance">
                        <b-form-textarea id="input-instance" v-model="instanceInput" type="text" required />
                    </b-form-group>
                </div>
                <div v-if="selectedAlgorithm === 'tree'">
                    <b-form-group label="Nome:" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.metadata.name" type="text" required />
                    </b-form-group>
                    <b-form-group label="Descrição:" label-for="input-feature">
                        <b-form-textarea id="input-x-margin" v-model="newItem.metadata.description" type="text"
                            required />
                    </b-form-group>
                    <b-form-group label="Profundidade máxima" label-for="input-feature">
                        <b-form-input id="input-x-margin" v-model="newItem.arguments.max_depth" type="number"
                            required />
                    </b-form-group>
                </div>

                <b-button type="submit" variant="primary">Adicionar</b-button>
            </b-form>

        </b-modal>
    </div>
</template>

<script>
import Notifier from '../../../mixins/Notifier.js';
import InputHeader from '../../../components/InputHeader.vue';
import axios from "axios";

const peelUrl = import.meta.env.VITE_PELL_URL;

export default {
    components: {
        InputHeader,
    },
    mixins: [Notifier],
    data() {
        return {
            showAddModal: false,
            selectedAlgorithm: null,
            newItem: {
                metadata: { enabled: true },
                arguments: {}
            },
            instanceInput: "",
            explanations: [],
            understanding: {},
            loading: false,
            menuOptions: [
                { label: 'ALE', value: 'ale' },
                { label: 'Ensemble', value: 'ensemble' },
                { label: 'GPX', value: 'gpx' },
                { label: 'Linear', value: 'linear' },
                { label: 'Logit', value: 'logit' },
                { label: 'Shap', value: 'shap' },
                { label: 'Tree', value: 'tree' }
            ],
            imageUrl: "",
            showImageModal: false,
            columns: ['name', 'algorithm', 'description', 'created', 'updated', 'executar', 'excluir'],
            options: {
                perPage: 5,
                skin: 'table-sm table table-hover',
                filterable: false,
                preserveState: true,
                saveState: true,
                headings: {
                    id: 'ID',
                    name: "Nome",
                    algorithm: "Algoritmo",
                    description: "Descrição",
                    created: "Criado",
                    updated: "Atualizado",
                },
                requestFunction: function (data) {
                    const self = this;
                    const limit = data.limit;
                    const page = data.page - 1;
                    self.$Progress.start();
                    return axios
                        .get(`${peelUrl}/explanation/${self.$route.params.id}/list`, {
                            params: {
                                enabled: true,
                                limit: limit,
                                page: page,
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
        };
    },
    async mounted() {
        this.load();
        await this.getUnderstanding();
    },
    methods: {
        async load() {
            this.$Progress.start();
            try {
                setTimeout(1000);
                this.$Progress.finish();
                this.understanding = { id: '', name: '' };
            } catch (e) {
                this.$Progress.finish();
                this.error(e);
            }
        },
        async deleteExplanation(id) {
            try {
                await this.makeRequest('delete', `${peelUrl}/explanation/${id}`);
            } catch (error) {
                console.error('Erro ao excluir explicação:', error);
            } finally {
                this.$refs.explanationTable.refresh()
            }
        },
        async addFeature(algorithm) {
            this.selectedAlgorithm = algorithm;
            this.newItem = {
                metadata: { enabled: true },
                arguments: {},
            };
            this.showAddModal = true;
        },
        onAddSubmit() {
            if (this.selectedAlgorithm == 'shap' || this.selectedAlgorithm == 'gpx') {
                this.newItem.arguments.instance = this.instanceInput
                    .split(",")
                    .map(value => parseFloat(value.trim()))
                    .filter(value => !isNaN(value));

                if (this.newItem.arguments.instance.length === 0) {
                    alert("Por favor, insira valores numéricos válidos para a instância.");
                    return;
                }
            } else if (this.selectedAlgorithm == 'ensemble' || this.selectedAlgorithm == 'linear' || this.selectedAlgorithm == 'logit') {
                this.newItem.arguments.n_feature = + this.newItem.arguments.n_feature
            }else if (this.selectedAlgorithm == 'tree'){
                this.newItem.arguments.max_depth = + this.newItem.arguments.max_depth
            }
            this.addAlgorithm();
        },
        async addAlgorithm() {
            try {
                const response = await this.makeRequest(
                    'post',
                    `${peelUrl}/algorithms/${this.understanding.id}/algorithm/${this.selectedAlgorithm}`,
                    this.newItem,
                    { 'Content-Type': 'application/json' }
                );
                await this.runExplanation(response.id);
                this.$refs.explanationTable.refresh();
                this.showAddModal = false;
                this.instanceInput = ''
            } catch (error) {
                console.error('Erro ao adicionar algoritmo:', error);
            }
        },
        async getUnderstanding() {
            try {
                const response = await this.makeRequest('get', `${peelUrl}/understanding/${this.$route.params.id}`);
                this.understanding.id = response.id
                this.understanding.name = response.name
            } catch (error) {
                console.error('Erro ao listar explicações:', error);
            }
        },
        async runExplanation(explanationId) {
            try {
                this.loading = true;
                await this.makeRequest('get', `${peelUrl}/explanation/${explanationId}/run`);
            } catch (error) {
                console.error('Erro ao executar a explicação:', error);
            } finally {
                this.loading = false;
            }
        },
        async runResult(explanationId) {
            let attempts = 0;
            const maxAttempts = 10;
            const delay = 3000;

            while (attempts < maxAttempts) {
                try {
                    const response = await axios.get(
                        `${peelUrl}/explanation/${explanationId}/result?type=image`,
                        {
                            headers: { accept: "application/json" },
                            responseType: "blob",
                        }
                    );

                    if (response.data.status === "PROCESSING") {
                    } else if (response.headers["content-type"].startsWith("image/")) {
                        this.imageUrl = URL.createObjectURL(response.data);
                        this.showImageModal = true;
                        return;
                    }
                } catch (error) {
                    console.error("Erro ao buscar resultado da explicação:", error);
                }
                attempts++;
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            console.error("Tempo limite atingido. A tarefa não foi processada.");
            this.showImageModal = false;
            this.imageUrl = null;
        },
        async makeRequest(method, url, data = null, headers = {}) {
            try {
                const response = await axios({
                    method,
                    url,
                    data,
                    headers: { 'accept': 'application/json', ...headers }
                });
                return response.data;
            } catch (error) {
                console.error(`Erro na requisição ${method.toUpperCase()} para ${url}:`, error);
                throw error;
            }
        },
    }

};
</script>

<style>
.btn {
    margin-right: 5px;
}
.table-container {
    justify-content: center;
    align-items: center;
    width: 90%;
    margin: 0 auto;
}
.table-container table {
    width: 100%;
}
</style>