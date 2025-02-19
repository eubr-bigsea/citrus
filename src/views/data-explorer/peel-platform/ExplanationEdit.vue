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
                    {{new Date(props.row.created).toLocaleString("pt-BR")}}
                </template>

                <template #updated="props">
                    {{new Date(props.row.updated).toLocaleString("pt-BR")}}
                </template>
                
                <template #editar="props">
                    <button class="btn-sm btn-primary" title="Editar" @click.stop="openEditModal(props.row)">
                        <font-awesome-icon icon="edit" />
                    </button>
                </template>

                <template #executar="props">
                    <b-spinner class="ml-2" v-if="loading" variant="primary" label="Spinning"></b-spinner>
                    <button v-if="!loading" class="btn-sm btn-success" title="Executar"
                        @click.stop="runExplanation(props.row.id)">
                        <font-awesome-icon icon="play" />
                    </button>
                </template>

                <!-- Slot para personalizar a coluna "excluir" -->
                <template #excluir="props">
                    <button class="btn-sm btn-danger" title="Excluir" @click.stop="deleteExplanation(props.row.id)">
                        <font-awesome-icon icon="trash" />
                    </button>
                </template>
            </v-server-table>
        </div>

        <b-modal v-model="showEditModal" :title="`Editar ${selectedItem?.algorithm}`" hide-footer>
            <b-form @submit.prevent="onSubmit">

                <!-- Marginal Local -->
                <div v-if="selectedItem?.algorithm === 'marginalLocal'">
                    <b-form-group label="Classe de Interesse:" label-for="input-model">
                        <b-form-select id="input-model" v-model="selectedItem.feature.interestClass" :options="mockInfo"
                            required />
                    </b-form-group>
                    <b-form-group label="Instância de Interesse:" label-for="input-model">
                        <b-form-select id="input-model" v-model="selectedItem.feature.interestInstance"
                            :options="mockInfo" required />
                    </b-form-group>
                    <b-form-group label="Conjunto Ruído:" label-for="input-model">
                        <b-form-select id="input-model" v-model="selectedItem.feature.noiseSet" :options="mockInfo"
                            required />
                    </b-form-group>
                    <b-form-group label="Margem de x:" label-for="input-name">
                        <b-form-input id="input-name" v-model="selectedItem.feature.horizontalMargin" required />
                    </b-form-group>
                    <b-form-group label="Amostragem:" label-for="input-name">
                        <b-form-input id="input-name" v-model="selectedItem.feature.sampling" required />
                    </b-form-group>
                    <b-form-group label="Algoritmo:" label-for="checkboxes-explainers">
                        <b-form-checkbox-group v-model="selectedItem.feature.algorithm" id="checkbox-local-explainers"
                            required>
                            <b-form-checkbox value="partial-dependence-plot">Partial Dependence Plot</b-form-checkbox>
                            <b-form-checkbox value="individual-conditional-expectation">Individual Conditional
                                Expectation</b-form-checkbox>
                            <b-form-checkbox value="accumulated-local-effects">Accumulated Local
                                Effects</b-form-checkbox>
                        </b-form-checkbox-group>
                    </b-form-group>
                </div>

                <!-- SQL Local -->
                <div v-if="selectedItem?.algorithm === 'sklLocal'">
                    <b-form-group label="Classe de Interesse:" label-for="input-model">
                        <b-form-select id="input-model" v-model="selectedItem.feature.interestClass" :options="mockInfo"
                            required />
                    </b-form-group>
                    <b-form-group label="Instância de Interesse:" label-for="input-model">
                        <b-form-select id="input-model" v-model="selectedItem.feature.interestInstance"
                            :options="mockInfo" required />
                    </b-form-group>
                    <b-form-group label="Conjunto Ruído:" label-for="input-model">
                        <b-form-select id="input-model" v-model="selectedItem.feature.noiseSet" :options="mockInfo"
                            required />
                    </b-form-group>
                    <b-form-group label="Margem de x:" label-for="input-name">
                        <b-form-input id="input-name" v-model="selectedItem.feature.horizontalMargin" required />
                    </b-form-group>
                    <b-form-group label="Amostragem:" label-for="input-name">
                        <b-form-input id="input-name" v-model="selectedItem.feature.sampling" required />
                    </b-form-group>
                    <b-form-group label="Métrica:" label-for="input-model">
                        <b-form-select id="input-model" v-model="selectedItem.feature.metrics" :options="mockInfo"
                            required />
                    </b-form-group>
                    <b-form-group label="Tolerância:" label-for="input-name">
                        <b-form-input id="input-name" v-model="selectedItem.feature.tolerance" required />
                    </b-form-group>
                </div>

                <!-- Marginal Global -->
                <div v-if="selectedItem?.algorithm === 'marginalGlobal'">
                    <b-form-group label="Classe de Interesse:" label-for="input-model">
                        <b-form-select id="input-model" v-model="selectedItem.feature.interestClass" :options="mockInfo"
                            required />
                    </b-form-group>
                    <b-form-group label="Algoritmo:" label-for="checkboxes-explainers">
                        <b-form-checkbox-group v-model="selectedItem.feature.algorithm" id="checkbox-global-explainers"
                            required>
                            <b-form-checkbox value="partial-dependence-plot">Partial Dependence Plot</b-form-checkbox>
                            <b-form-checkbox value="individual-conditional-expectation">Individual Conditional
                                Expectation</b-form-checkbox>
                            <b-form-checkbox value="accumulated-local-effects">Accumulated Local
                                Effects</b-form-checkbox>
                        </b-form-checkbox-group>
                    </b-form-group>
                </div>

                <!-- SHAP -->
                <div v-if="selectedItem?.algorithm === 'shap'">
                    <b-form-group label="Classe de Interesse:" label-for="input-feature">
                        <b-form-select id="input-feature" v-model="selectedItem.feature.featureInterest"
                            :options="mockInfo" required />
                    </b-form-group>
                    <b-form-group label="Tipo de Modelo:" label-for="input-model-type">
                        <b-form-select id="input-model-type" v-model="selectedItem.feature.modelType"
                            :options="mockInfo" required />
                    </b-form-group>
                    <b-form-group label="Tipo de Explicação:" label-for="input-explanation-type">
                        <b-form-select id="input-explanation-type" v-model="selectedItem.feature.explanationType"
                            :options="mockInfo" required />
                    </b-form-group>
                    <b-form-group label="Máscara:" label-for="input-mask">
                        <b-form-select id="input-mask" v-model="selectedItem.feature.mask" :options="mockInfo"
                            required />
                    </b-form-group>
                    <b-form-group label="Amostragem:" label-for="input-sampling">
                        <b-form-input id="input-sampling" v-model="selectedItem.feature.sampling" type="text"
                            required />
                    </b-form-group>
                </div>

                <!-- LIME -->
                <div v-if="selectedItem?.algorithm === 'lime'">
                    <b-form-group label="Tipo de tarefa:" label-for="input-lime-class">
                        <b-form-select id="input-lime-class" v-model="selectedItem.feature.taskType" :options="mockInfo"
                            required />
                    </b-form-group>
                    <b-form-group label="Instância de Interesse:" label-for="input-lime-instance">
                        <b-form-select id="input-lime-instance" v-model="selectedItem.feature.interestInstance"
                            :options="mockInfo" required />
                    </b-form-group>
                    <b-form-group label="Número de Amostras:" label-for="input-lime-samples">
                        <b-form-input id="input-lime-samples" v-model="selectedItem.feature.numSamples" type="number"
                            min="1" required />
                    </b-form-group>
                    <b-form-group label="Features categóricas:" label-for="input-lime-samples">
                        <b-form-input id="input-lime-samples" v-model="selectedItem.feature.catFeat" type="number"
                            min="1" required />
                    </b-form-group>
                    <b-form-group label="Número de features:" label-for="input-lime-samples">
                        <b-form-input id="input-lime-samples" v-model="selectedItem.feature.numFeat" type="number"
                            min="1" required />
                    </b-form-group>
                    <b-form-group label="Métrica:" label-for="input-lime-explanation-type">
                        <b-form-select id="input-lime-explanation-type" v-model="selectedItem.feature.metric"
                            :options="mockInfo" required />
                    </b-form-group>
                    <b-form-group label="Tolerância:" label-for="input-lime-explanation-type">
                        <b-form-select id="input-lime-explanation-type" v-model="selectedItem.feature.tolerances"
                            :options="mockInfo" required />
                    </b-form-group>
                </div>

                <!-- GPX -->
                <div v-if="selectedItem?.algorithm === 'gpx'">
                    <b-form-group label="Classe de Interesse:" label-for="input-interest-feature">
                        <b-form-select id="input-interest-feature" v-model="selectedItem.feature.interestFeature"
                            :options="mockInfo" required />
                    </b-form-group>
                    <b-form-group label="Programação Genética:" label-for="input-genetic-programming">
                        <b-form-select id="input-genetic-programming" v-model="selectedItem.feature.geneticProgramming"
                            :options="mockInfo" required />
                    </b-form-group>
                    <b-form-group label="Tipo de Explicação:" label-for="input-explanation-type">
                        <b-form-select id="input-explanation-type" v-model="selectedItem.feature.explanationType"
                            :options="mockInfo" required />
                    </b-form-group>
                    <b-form-group label="Conjunto Ruído:" label-for="input-noise-set">
                        <b-form-select id="input-noise-set" v-model="selectedItem.feature.noiseSet" :options="mockInfo"
                            required />
                    </b-form-group>
                    <b-form-group label="Margem de x:" label-for="input-x-margin">
                        <b-form-input id="input-x-margin" v-model="selectedItem.feature.xMargin" type="text" required />
                    </b-form-group>
                    <b-form-group label="Amostragem:" label-for="input-sampling">
                        <b-form-input id="input-sampling" v-model="selectedItem.feature.sampling" type="text"
                            required />
                    </b-form-group>
                </div>
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
            explanations: [],
            understanding: {},
            loading: false,
            explanation: {
                config: {
                    interestClass: 'a',
                    sklLocal: { features: [] },
                    marginalLocal: { features: [] },
                    marginalGlobal: { features: [] },
                    shap: { features: [] },
                    lime: { features: [] },
                    gpx: { features: [] }
                }
            },
            isDirty: false,
            mockInfo: ['batata', 'feijao', 'arroz', 'farofa'],
            menuOptions: [
                { label: 'SKL Local', value: 'sklLocal' },
                { label: 'Marginal Local', value: 'marginalLocal' },
                { label: 'Marginal Global', value: 'marginalGlobal' },
                { label: 'SHAP', value: 'shap' },
                { label: 'LIME', value: 'lime' },
                { label: 'GPX', value: 'gpx' }
            ],
            imageUrl: "",
            showImageModal: false,
            showEditModal: false,
            selectedItem: null,
            columns: ['name', 'algorithm', 'description', 'created', 'updated', 'editar', 'executar', 'excluir'],
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
    watch: {
        explanation: {
            handler(val) {
                console.log(val);
                this.isDirty = true;
            },
            deep: true
        },
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
        onSubmit() {
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
        async addFeature(model) {
            await this.runAlgorithm(model);
            this.$refs.explanationTable.refresh()
        },
        openEditModal(item) {
            this.selectedItem = item;
            this.showEditModal = true;
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
        async listExplanations() {
            try {
                const response = await this.makeRequest(
                    'get',
                    `${peelUrl}/explanation/${this.$route.params.id}/list?enabled=true&limit=${this.perPage}&page=${this.currentPage - 1}&sort=name&sort=id`
                );
                this.explanations = response.data;
                this.totalRows = response.totalRows;
            } catch (error) {
                console.error('Erro ao listar explicações:', error);
            }
        },
        async runAlgorithm(algorithmName) {
            if (algorithmName !== 'shap') return;

            const shapRequest = {
                arguments: {
                    shap_type_xai: "waterfall",
                    instance: [0.012723853338673763, 0.273891752138409, 0.6372544571103208, 0.5043717331554985, 0.32511216028381984, 0.9160181713764346, 0.42194196268285955, 0.24472048571917204, 0.18083637327344637, 0.34827026932718685]
                },
                metadata: {
                    name: "meu explicador shap",
                    description: "explicar com shap",
                    enabled: true
                }
            };

            try {
                const response = await this.makeRequest('post', `${peelUrl}/algorithms/${this.understanding.id}/algorithm/shap`, shapRequest, { 'Content-Type': 'application/json' });
                this.$refs.explanationTable.refresh()
            } catch (error) {
                console.error('Erro na execução do algoritmo SHAP:', error);
            }
        },
        async runExplanation(explanationId) {
            try {
                this.loading = true;
                await this.makeRequest('get', `${peelUrl}/explanation/${explanationId}/run`);
                await this.runResult(explanationId);
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
.table-responsive {
    overflow-x: auto;
}

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