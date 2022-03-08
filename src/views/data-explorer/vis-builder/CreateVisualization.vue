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
                        <input type="text" class="form-control" maxlength="100" id="name" v-focus v-model="name">

                        <label class="mt-2">Escolha a fonte de dados:</label>
                        <vue-select @search="loadDataSourceList" :filterable="false" :options="dataSourceList"
                            label="name" v-model="selectedDataSource" @input="retrieveAttributes">
                            <template v-slot:no-options="{ search, searching }">
                                <small>Digite parte do nome pesquisar ...</small>
                            </template>
                            <template slot="option" slot-scope="option">
                                <div class="d-center">
                                    <span class="span-id">{{ pad(option.id, 4, '&nbsp;') }}</span> - {{ option.name }}
                                </div>
                            </template>
                            <template slot="selected-option" slot-scope="option">
                                <div class="selected d-center">
                                    {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                </div>
                            </template>
                        </vue-select>
                        <hr />
                        <router-link :to="{name: 'index-explorer'}" class="btn btn-sm btn-outline-secondary mr-2">
                            {{$t('actions.back')}}
                        </router-link>
                        <button v-if="valid" class="btn btn-primary btn-sm" @click="create">
                            {{$t('actions.create', {type: 'experimento'})}}</button>
                    </b-card>
                </div>
                <div class="col-md-9">
                    <div class="card-deck1 text-center">
                        <div class="custom-card">
                            <div class="row">
                                <div class="col-md-4">
                                    <span class="fa-stack fa-3x">
                                        <span class="fas fa-circle text- fa-stack-2x"></span>
                                        <span class="fas fa-glasses fa-stack-1x fa-inverse"></span>
                                    </span>
                                    <h6>Especialista</h6>
                                    <small>
                                        Você controla como a visualização será criada, podendo escolher o tipo do
                                        gráfico e detalhes de apresentação.
                                    </small>
                                </div>
                                <div class="col-md-8 text-left">
                                    <b-form-radio name="method" class="font-weight-bold" v-model="method"
                                        value="custom">Configurar visualização
                                    </b-form-radio>
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
    import Notifier from '../../../mixins/Notifier';
    import DataSourceMixin from '../DataSourceMixin.js';
    import { debounce } from "../../../util.js";
    import { Workflow } from '../entities.js';

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;

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
                const params = {
                    name: this.name,
                    label: this.selectedAttribute,
                    dataSource: this.selectedDataSource
                };

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