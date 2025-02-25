<template>
    <div>
        <div class="mt-2">
            <div>
                <div class="d-flex flex-column ">
                    <h6 class="header-pretitle">Explicação #{{ understanding.id }}</h6>
                    <h1>
                        <h1>{{ understanding.name }}</h1>
                    </h1>
                </div>
                <hr>
            </div>

            <b-modal v-model="showImageModal" title="Resultado" hide-footer size="lg" centered>
                <div v-if="imageUrl" class="text-center">
                    <div class="mb-1 text-right">
                        <b-button variant="success" @click="downloadImage(imageUrl)">
                            <font-awesome-icon icon="download" class="mr-2" />
                        </b-button>
                    </div>
                    <img :src="imageUrl" class="img-fluid rounded shadow" alt="Resultado da Explicação" />
                </div>
                <div v-else-if="jsonResult" class="json-result-container">
                    <div class="mb-1 text-right">
                        <b-button variant="primary" @click="copyJson(jsonResult)">
                            <font-awesome-icon icon="copy" class="mr-2" />
                        </b-button>
                    </div>
                    <pre class="json-result">{{ jsonResult }}</pre>
                </div>
                <div v-else class="text-center">
                    <b-spinner variant="primary" label="Carregando..."></b-spinner>
                    <p class="mt-2">Carregando resultado...</p>
                </div>
            </b-modal>

            <b-modal v-model="showDeleteConfirmation" title="Confirmar Exclusão" @ok="confirmDelete" ok-title="Excluir"
                cancel-title="Cancelar" ok-variant="danger">
                <p>Tem certeza de que deseja excluir este algoritimo?</p>
            </b-modal>
        </div>

        <div class="card shadow-sm">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Algoritmos</h5>
                    <b-dropdown text="Adicionar" variant="success" class="m-2" boundary="viewport">
                        <b-dropdown-item v-for="(item, index) in menuOptions" :key="index"
                            @click="addFeature(item.value)">
                            {{ item.label }}
                        </b-dropdown-item>
                    </b-dropdown>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <v-server-table ref="explanationTable" :columns="columns" :options="options"
                        name="explanationTablePell">

                        <template #created="props">
                            {{ new Date(props.row.created).toLocaleString("pt-BR") }}
                        </template>

                        <template #updated="props">
                            {{ new Date(props.row.updated).toLocaleString("pt-BR") }}
                        </template>

                        <template #executar="props">
                            <div class="d-flex align-items-center mb-4">
                                <b-spinner class="ml-2" v-if="loading" variant="primary" label="Spinning"></b-spinner>
                                <template v-if="props.row.algorithm == 'shap'">
                                    <b-dropdown variant="link" toggle-class="text-decoration-none p-0" no-caret>
                                        <template #button-content class="mt-2">
                                            <button v-if="!loading" class="btn-sm btn-success" title="Executar">
                                                <font-awesome-icon icon="play" />
                                            </button>
                                        </template>
                                        <b-dropdown-item @click="runResult(props.row.id, 'image')">
                                            <span class="ml-2">Imagem</span>
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="runResult(props.row.id, 'raw')">
                                            <font-awesome-icon icon="file-alt" />
                                            <span class="ml-2">Texto</span>
                                        </b-dropdown-item>
                                    </b-dropdown>
                                </template>
                                <template v-else-if="props.row.algorithm == 'ale'">
                                    <button @click="runResult(props.row.id, 'image')" v-if="!loading"
                                        class="btn-sm btn-success" title="Executar">
                                        <font-awesome-icon icon="play" />
                                    </button>
                                </template>
                                <template v-else>
                                    <button @click="runResult(props.row.id, 'raw')" v-if="!loading"
                                        class="btn-sm btn-success" title="Executar">
                                        <font-awesome-icon icon="play" />
                                    </button>
                                </template>
                            </div>
                        </template>

                        <template #excluir="props">
                            <div class="d-flex align-items-center">
                                <button class="btn-sm btn-danger" title="Excluir"
                                    @click.stop="deleteExplanation(props.row.id)">
                                    <font-awesome-icon icon="trash" />
                                </button>
                            </div>
                        </template>
                    </v-server-table>
                </div>
            </div>
        </div>

        <b-button :to="{ name: 'peel-home'}" class="mt-3">Voltar</b-button>

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

                <b-button type="submit" variant="primary" class="float-right">Adicionar</b-button>
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
            showDeleteConfirmation: false,
            explanationToDelete: null,
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
            jsonResult: null,
            showImageModal: false,
            columns: ['id','name', 'algorithm', 'description', 'created', 'updated', 'executar', 'excluir'],
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
                requestFunction: async function (data) {
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
        deleteExplanation(id) {
            this.explanationToDelete = id;
            this.showDeleteConfirmation = true;
        },
        async confirmDelete() {
            if (this.explanationToDelete) {
                try {
                    await this.makeRequest('delete', `${peelUrl}/explanation/${this.explanationToDelete}`);
                } catch (error) {
                    console.error('Erro ao excluir explicação:', error);
                } finally {
                    this.$refs.explanationTable.refresh();
                    this.explanationToDelete = null; // Limpa o ID após a exclusão
                }
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
            } else if (this.selectedAlgorithm == 'tree') {
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

                this.$bvToast.toast('Algoritmo adicionado com sucesso!', {
                    title: 'Sucesso',
                    variant: 'success',
                    solid: true,
                });
            } catch (error) {
                console.error('Erro ao adicionar algoritmo:', error);
                this.$bvToast.toast('Erro ao adicionar algoritmo.', {
                    title: 'Erro',
                    variant: 'danger',
                    solid: true,
                });
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
        async runResult(explanationId, resultType = "raw") {
            let attempts = 0;
            const maxAttempts = 10;
            const delay = 3000;

            while (attempts < maxAttempts) {
                try {
                    const response = await axios.get(
                        `${peelUrl}/explanation/${explanationId}/result?type=${resultType}`,
                        {
                            headers: { accept: "application/json" },
                            responseType: resultType === "image" ? "blob" : "json",
                        }
                    );

                    if (response.data.status === "PROCESSING") {
                    } else if (resultType === "image" && response.headers["content-type"].startsWith("image/")) {
                        this.imageUrl = URL.createObjectURL(response.data);
                        this.jsonResult = null; // Limpa o resultado JSON
                        this.showImageModal = true;
                        return;
                    } else if (resultType === "raw") {
                        this.jsonResult = JSON.stringify(response.data, null, 2); // Formata o JSON
                        this.imageUrl = null; // Limpa a URL da imagem
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
            this.jsonResult = null;
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
        copyJson(json) {
            navigator.clipboard.writeText(json)
                .then(() => {
                    this.$bvToast.toast('JSON copiado com sucesso!', {
                        title: 'Sucesso',
                        variant: 'success',
                        solid: true,
                    });
                })
                .catch((err) => {
                    console.error('Erro ao copiar JSON:', err);
                    this.$bvToast.toast('Erro ao copiar JSON.', {
                        title: 'Erro',
                        variant: 'danger',
                        solid: true,
                    });
                });
        },
        downloadImage(imageUrl) {
            try {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = `explicacao_${new Date().toISOString()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                this.$bvToast.toast('Imagem baixada com sucesso!', {
                    title: 'Sucesso',
                    variant: 'success',
                    solid: true,
                });
            } catch (error) {
                console.error('Erro ao baixar a imagem:', error);
                this.$bvToast.toast('Erro ao baixar a imagem.', {
                    title: 'Erro',
                    variant: 'danger',
                    solid: true,
                });
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

.table-container .btn {
    vertical-align: middle;
}

.table-container table {
    width: 100%;
}

.modal-content {
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.modal-title {
    font-weight: 600;
    color: #343a40;
}

.modal-body {
    padding: 20px;
}

.img-fluid.rounded {
    max-height: 70vh;
    border: 1px solid #ddd;
}

.json-result-container {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 15px;
    max-height: 60vh;
    overflow-y: auto;
}

.json-result {
    background-color: #fff;
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #ddd;
    font-family: 'Courier New', Courier, monospace;
    font-size: 14px;
    color: #343a40;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 0;
}

.text-center .spinner-border {
    width: 3rem;
    height: 3rem;
}

.text-center p {
    font-size: 16px;
    color: #6c757d;
    margin-top: 10px;
}
</style>