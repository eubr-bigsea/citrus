<template>
    <main role="main">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h1>Informe os detalhes da visualização</h1>
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
                        <hr>
                        <router-link :to="{ name: 'index-explorer' }" class="btn btn-sm btn-outline-secondary mr-2">
                            {{ $t('actions.back') }}
                        </router-link>
                        <button v-if="valid" class="btn btn-primary btn-sm" @click="create">
                            {{ $t('actions.create', { type: 'experimento' }) }}
                        </button>
                    </b-card>
                </div>
                <div class="col-md-9">
                    <div class="card-deck1 text-center">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="custom-card" role="button" @click="create">

                                    <font-awesome-layers class="fa-stack fa-3x text-success">
                                        <font-awesome-icon icon="circle" class="fa-solid fa-stack-2x" />
                                        <font-awesome-icon icon="glasses" inverse />
                                    </font-awesome-layers>
                                    <h6>Especialista</h6>
                                    <small>
                                        Você controla como a visualização será criada, podendo escolher o tipo do
                                        gráfico e detalhes de apresentação.
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="custom-card" role="button">
                                    <font-awesome-layers class="fa-stack fa-3x text-primary">
                                        <font-awesome-icon icon="circle" class="fa-solid fa-stack-2x" />
                                        <font-awesome-icon icon="hat-wizard" inverse />
                                    </font-awesome-layers>
                                    <h6>Usando assistente</h6>
                                    <small>
                                        Você será orientado por meio de perguntas a escolher o melhor tipo de gráfico para o
                                        seu propósito.
                                        Claro, você poderá alterar o tipo de gráfico posteriormente, caso seja necessário.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">

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
            method: 'custom',
            selectedDataSource: null,
        };
    },
    computed: {
        valid() {
            return this.selectedDataSource !== null && this.name;
        },
    },
    methods: {
        navigate(name) {
            this.$router.push({ name });
        },
        async create() {
            try {
                const ds = { value: this.selectedDataSource.id, labelValue: this.selectedDataSource.name };
                const workflow = Workflow.buildVisualizationBuilder(
                    this.name, ds, this.method, this);
                const resp = await axios.post(`${tahitiUrl}/workflows`, workflow);
                const workflowResp = resp.data;
                this.$router.push({ name: 'visualization-design', params: { id: workflowResp.id } });
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
</style>
