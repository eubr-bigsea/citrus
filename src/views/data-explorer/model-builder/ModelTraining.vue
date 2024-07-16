<template>
    <main role="main">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h1>Escolha como parametrizar o modelo de {{ $t('dataExplorer.task.' + taskType).toLowerCase() }}</h1>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-3">
                    <b-card>
                        <label class="" for="name">Nome do experimento:</label>
                        <input id="name" v-model="name" v-focus type="text" class="form-control" maxlength="100">

                        <label class="mt-2">Escolha a fonte de dados:</label>
                        <vue-select v-model="selectedDataSource" :filterable="false" :options="dataSourceList" label="name"
                            @search="loadDataSourceList" @input="retrieveAttributes">
                            <template #no-options="{}">
                                <small>Digite parte do nome pesquisar ...</small>
                            </template>
                            <template #option="option">
                                <div class="d-center">
                                    <span class="span-id">{{ pad(option.id, 4, '&nbsp;') }}</span> - {{ option.name }}
                                </div>
                            </template>
                            <template #selected-option="option">
                                <div class="selected d-center">
                                    {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                </div>
                            </template>
                        </vue-select>

                        <template v-if="supervised">
                            <label class=" mt-2">Escolha o atributo alvo (rótulo):</label>
                            <vue-select v-model="selectedAttribute" :options="attributes" :searchable="true" />
                        </template>

                        <hr>
                        <router-link :to="{ name: 'choose-task' }" class="btn btn-sm btn-outline-secondary mr-2">
                            {{ $t('actions.back') }}
                        </router-link>
                        <button v-if="valid" class="btn btn-primary btn-sm" @click="create">
                            {{ $t('actions.create', { type: 'experimento' }) }}
                        </button>
                    </b-card>
                </div>
                <div v-if="supervised" class="col-md-9">
                    <div class="card-deck1 text-center">
                        <div class="custom-card">
                            <div class="row">
                                <div class="col-md-4">
                                    <font-awesome-layers class="fa-stack fa-3x text-danger">
                                        <font-awesome-icon icon="circle" class="fa-solid fa-stack-2x" />
                                        <font-awesome-icon icon="fa-robot" inverse />
                                    </font-awesome-layers>
                                    <h6>Automática</h6>
                                    <small>
                                        O modelo será criado automaticamente, sendo escolhido aquele que melhor atender
                                        às metricas de avaliação (experimental).
                                        <br>
                                        <strong>Você ainda terá que escolher os atributos a serem usados no
                                            experimento!</strong>
                                    </small>
                                </div>
                                <div class="col-md-8 text-left">
                                    <b-form-radio v-model="method" name="method" class="font-weight-bold" value="fast">
                                        Protótipo rápido
                                    </b-form-radio>
                                    <div class="description">
                                        Obtenha alguns modelos genéricos rapidamente. Útil para testes.
                                    </div>

                                    <b-form-radio v-model="method" name="method" class="font-weight-bold"
                                        value="performance">
                                        Desempenho
                                    </b-form-radio>
                                    <div class="description">
                                        Crie modelos com as melhores pontuações, mas tenha paciência,
                                        pois pode demorar mais.
                                    </div>

                                    <b-form-radio v-model="method" name="method" class="font-weight-bold"
                                        value="interpretable">
                                        Crie modelos interpretáveis
                                    </b-form-radio>
                                    <div class="description">
                                        Utilize modelos criados a partir de árvores de decisão e modelos
                                        lineares.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="custom-card">
                            <div class="row">
                                <div class="col-md-4">
                                    <font-awesome-layers class="fa-stack fa-3x text-success">
                                        <font-awesome-icon icon="circle" class="fa-solid fa-stack-2x" />
                                        <font-awesome-icon icon="fa-glasses" inverse />
                                    </font-awesome-layers>
                                    <h6>Especialista</h6>
                                    <small>
                                        Você controla como o modelo será criado, podendo escolher os
                                        algoritmos,
                                        parâmetros, métricas e qual será
                                        o modelo a ser salvo.
                                    </small>
                                </div>
                                <div class="col-md-8 pt-5 text-left">
                                    <b-form-radio v-model="method" name="method" class="font-weight-bold" value="custom">
                                        Escolha os
                                        algoritmos
                                    </b-form-radio>
                                    <div class="description">
                                        Escolha algoritmos, hiperparâmetros, amostra e validação cruzada.
                                    </div>
                                    <!--
                                    <b-form-radio name="method" class="font-weight-bold" v-model="method"
                                        value="use-workflow">Use um fluxo de
                                        trabalho
                                    </b-form-radio>
                                    <div class="description">
                                        Use um fluxo de trabalho existente, mas parametrize sua execução.
                                    </div>

                                    <b-form-radio name="method" class="font-weight-bold" v-model="method"
                                        value="use-previous">
                                        Use uma execução
                                        anterior
                                    </b-form-radio>
                                    <div class="description">
                                        EM ANÁLISE
                                    </div>

                                    <b-form-radio name="method" class="font-weight-bold" v-model="method" value="code">
                                        Crie seu próprio avaliador
                                    </b-form-radio>
                                    <div class="description">
                                        EM ANÁLISE
                                    </div>
                                    -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="clustering" class="col-md-9">
                    <div class="card-deck1 text-center">
                        <div class="custom-card">
                            <div class="row">
                                <div class="col-md-4">
                                    <span class="fa-stack fa-3x">
                                        <span class="fas fa-circle text-info fa-stack-2x" />
                                        <span class="fas fa-robot fa-stack-1x fa-inverse" />
                                    </span>
                                    <h6>Automática</h6>
                                    <small>
                                        O modelo será criado automaticamente, sendo escolhido aquele que melhor atender
                                        às metricas de avaliação (experimental).
                                    </small>
                                </div>
                                <div class="col-md-8 text-left">
                                    <b-form-radio v-model="method" name="method" class="font-weight-bold" value="fast">
                                        Protótipo rápido
                                    </b-form-radio>
                                    <div class="description">
                                        Criar um modelo usando o algoritmo K-Means e parametros automáticos.
                                    </div>
                                    <!--
                                    <b-form-radio name="method" class="font-weight-bold" v-model="method"
                                        value="performance">Detecção de anomalia</b-form-radio>
                                    <div class="description">
                                        Usar o Isolation Forest???
                                    </div>
                                    -->
                                </div>
                            </div>
                        </div>
                        <div class="custom-card">
                            <div class="row">
                                <div class="col-md-4">
                                    <span class="fa-stack fa-3x">
                                        <span class="fas fa-circle text- fa-stack-2x" />
                                        <span class="fas fa-glasses fa-stack-1x fa-inverse" />
                                    </span>
                                    <h6>Especialista</h6>
                                    <small>
                                        Você controla como o modelo será criado, podendo {{ $t('common.ok') }} os
                                        algoritmos,
                                        parâmetros, métricas e qual será
                                        o modelo a ser salvo.
                                    </small>
                                </div>
                                <div class="col-md-8 text-left">
                                    <b-form-radio v-model="method" name="method" class="font-weight-bold" value="custom">
                                        Escolha os
                                        algoritmos
                                    </b-form-radio>
                                    <div class="description">
                                        Escolha algoritmos, hiperparâmetros, amostra e validação cruzada.
                                    </div>
                                    <!--
                                    <b-form-radio name="method" class="font-weight-bold" v-model="method"
                                        value="use-workflow">Use um fluxo de
                                        trabalho
                                    </b-form-radio>
                                    <div class="description">
                                        Use um fluxo de trabalho existente, mas parametrize sua execução.
                                    </div>

                                    <b-form-radio name="method" class="font-weight-bold" v-model="method"
                                        value="use-previous">
                                        Use uma execução
                                        anterior
                                    </b-form-radio>
                                    <div class="description">
                                        EM ANÁLISE
                                    </div>

                                    <b-form-radio name="method" class="font-weight-bold" v-model="method" value="code">
                                        Crie seu próprio avaliador
                                    </b-form-radio>
                                    <div class="description">
                                        EM ANÁLISE
                                    </div>
                                    -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import vSelect from 'vue-select';
import Notifier from '../../../mixins/Notifier.js';
import DataSourceMixin from '../DataSourceMixin.js';
import { Workflow } from '../entities.js';

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: { 'vue-select': vSelect },
    mixins: [Notifier, DataSourceMixin],
    data() {
        return {
            name: '',
            method: 'fast',
            selectedDataSource: null,
            selectedAttribute: null,
        };
    },
    computed: {
        valid() {
            return this.selectedDataSource !== null &&
                (this.selectedAttribute !== null || this.clustering) &&
                this.type !== null;
        },
        taskType() {
            return this.$route.params.task;
        },
        supervised() {
            return this.taskType === 'regression' || this.taskType === 'classification';
        },
        clustering() {
            return this.taskType === 'clustering';
        }
    },
    methods: {
        navigate(name) {
            this.$router.push({ name });
        },
        async create() {
            /*
                const params = {
                    name: this.name,
                    label: this.selectedAttribute,
                    dataSource: this.selectedDataSource
                };
                */

            try {
                const ds = { value: this.selectedDataSource.id, labelValue: this.selectedDataSource.name };
                const workflow = Workflow.buildModelBuilder(
                    this.name, ds, this.selectedAttribute, this.method, this.taskType, this);
                const resp = await axios.post(`${tahitiUrl}/workflows`, workflow);
                const workflowResp = resp.data;
                this.$router.push({ name: 'model-design', params: { id: workflowResp.id } });
            } catch (e) {
                this.error(e);
            }
        },
    }
}
</script>
<style scoped>
.custom-card {
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 5px;
}

.description {
    font-size: .85em;
    color: #555;
}

.description:not(:last-child) {
    margin-bottom: 20px;
}

.span-id {
    display: inline-block;
    width: 30px;
    text-align: right;
}
</style>
