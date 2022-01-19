<template lang="">
    <div>
        <div>
            <div class="d-flex justify-content-between align-items-center border-bottom">
                <h4>Construção de Modelo de {{$t('dataExplorer.task.' + taskType).toLowerCase()}}</h4>
                <form class="float-right form-inline w-50 d-flex justify-content-end">

                    <label class="sr-only">{{$tc('common.name')}}:</label>
                    <input type="text" class="form-control form-control-sm w-50" :placeholder="$tc('common.name')"
                        v-model="workflowObj.name" maxlength="100">
                    <button class="btn btn-sm btn-outline-success ml-1 float-right"><span class="fa fa-save"></span>
                        {{$t('actions.save')}}</button>
                    <button class="btn btn-sm btn-outline-primary ml-1 float-right"><span class="fa fa-play"></span>
                        {{$t('actions.execute')}}</button>
                </form>
            </div>
            <div class="custom-card">
                <b-tabs class="p-2 custom-tab" align="center">
                    <b-tab title="Parâmetros" class="m-1 parameters">
                        <div class="row size-full">
                            <div class="col-md-3 col-lg-2 border-right">
                                <div class="explorer-nav p-1">
                                    <SideBar :selected="selected" @edit="edit" />
                                </div>
                            </div>
                            <div class="col-md-9 col-lg-10 pl-4 pr-4 bg-white ">
                                <form action="" class="form p-2">
                                    <template v-if="selected === 'target'">
                                        <DesignData :attributes="attributes" :dataSourceList="dataSourceList"
                                            :supervisioned="supervisioned" :label="labelAttribute"
                                            :data-source="dataSource" @search-data-source="loadDataSourceList"
                                            @retrieve-attributes="retrieveAttributes" />

                                        <h5>Dados</h5>
                                        <hr />

                                        <label for="">Fonte de dados:</label> &nbsp;
                                        <vue-select @search="loadDataSourceList" :filterable="false"
                                            :options="dataSourceList" label="name" v-model="dataSource"
                                            @input="retrieveAttributes" class="w-50">
                                            <template v-slot:no-options="{ search, searching }">
                                                <small>Digite parte do nome pesquisar ...</small>
                                            </template>
                                            <template slot="option" slot-scope="option">
                                                <div class="d-center">
                                                    <span class="span-id">{{ pad(option.id, 4, '&nbsp;') }}</span> - {{
                                                    option.name }}
                                                </div>
                                            </template>
                                            <template slot="selected-option" slot-scope="option">
                                                <div class="selected d-center">
                                                    {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                                </div>
                                            </template>
                                        </vue-select>
                                        <small class="form-text text-muted">
                                            Fonte de dados para treino e teste do modelo. Alterar a fonte de dados de um
                                            experimento
                                            existente pode fazer com que ele pare de funcionar!
                                        </small>

                                        <template v-if="supervisioned">
                                            <label class=" mt-2">Escolha o atributo alvo (rótulo):</label>
                                            <vue-select :options="attributes" v-model="labelAttribute"
                                                :searchable="true" class="w-25" />
                                            TODO: adicionar um gráfico com a distribuição dos dados segundo o alvo
                                        </template>


                                    </template>
                                    <template v-if="selected === 'data'">
                                        <TrainTest />
                                    </template>
                                    <template v-if="selected === 'metric'">
                                        <Metric />
                                    </template>
                                    <template v-if="selected === 'adjusts'">
                                        <FeatureSelection :attributes="attributes" />
                                    </template>
                                    <template v-if="selected === 'generation'">
                                        <FeatureGeneration />
                                    </template>
                                    <template v-if="selected === 'reduction'">
                                        <FeatureReduction />
                                    </template>
                                    <template v-if="selected === 'algorithms'">
                                        <Algorithms />
                                    </template>
                                    <template v-if="selected === 'hyperparameters'">
                                        <Grid />
                                    </template>
                                    <template v-if="selected === 'weighting'">
                                        <Weighting />
                                    </template>
                                    <template v-if="selected === 'runtime'">
                                        <Runtime />
                                    </template>
                                </form>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Resultados" class="pt-2">
                        <Result />
                    </b-tab>
                </b-tabs>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import SideBar from './SideBar';
    import DesignData from './DesignData';
    import TrainTest from './TrainTest';
    import Metric from './Metric';
    import FeatureSelection from './FeatureSelection';
    import FeatureGeneration from './FeatureGeneration';
    import FeatureReduction from './FeatureReduction';
    import Algorithms from './Algorithms';
    import Grid from './Grid';
    import Runtime from './Runtime';
    import Result from './result/Result';
    import Weighting from './Weighting';

    import InputHeader from '../../../components/InputHeader.vue';
    import DataSourceMixin from '../DataSourceMixin.js';
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import { debounce } from "../../../util.js";
    import axios from 'axios';
    import vSelect from 'vue-select';
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    export default {
        components: {
            InputHeader, 'vue-select': vSelect,
            SideBar, DesignData, TrainTest, Metric, FeatureSelection, FeatureGeneration,
            FeatureReduction, Algorithms, Grid, Runtime, Weighting, Result
        },
        mixins: [DataSourceMixin],
        computed: {
            dataSourceId() {
                return this.workflowObj.tasks[0].forms.data_source.value;
            },
            labelAttribute: {
                get() { return this.workflowObj.forms.$meta.value.label; },
                set(newValue) {
                    return this.$store.dispatch('dataExplorer/setLabelAttribute', newValue)
                }
            },
            supervisioned() {
                return this.taskType === 'regression' || this.taskType === 'classification';
            },
            taskType: {
                get() { return this.workflowObj.forms.$meta.value.taskType; },
                set(newValue) {
                    return this.$store.dispatch('dataExplorer/setTaskName', newValue)
                }
            }
        },
        data() {
            return {
                algorithms: [],
                internalWorkflowId: null,
                isDirty: false,
                loadingData: false,
                selectedAlgorithm: { forms: [] },
                selected: 'target',
                attributes: [],
                dataSourceOptions: [],
                dataSource: null,
                workflowObj: { forms: { $meta: { value: { taskType: '' } } } },

                //FIXME: hard-coded. It'd be best defined in Tahiti
                unsupportedParameters: new Set(['perform_cross_validation', 'cross_validation', 'one_vs_rest'])
            }
        },
        mounted() {
            this.internalWorkflowId = (this.$route) ? this.$route.params.id : 0;
            this.load();
        },
        methods: {
            async load() {
                this.loadingData = true;
                this.$Progress.start()
                try {
                    let resp = await axios.get(`${tahitiUrl}/workflows/${this.internalWorkflowId}`)
                    this.workflowObj = resp.data;

                    resp = await axios.get(`${limoneroUrl}/datasources/${this.dataSourceId}`);
                    this.dataSource = resp.data;
                    this.attributes = this.dataSource.attributes.map(attr => attr.name).sort();

                } catch (e) {
                    self.error(e);
                    self.$router.push({ name: 'index-explorer' })
                } finally {
                    Vue.nextTick(() => {
                        this.$Progress.finish();
                        this.loadingData = false;
                        this.isDirty = false;
                    });
                }
            },
            edit(option) {
                console.debug(option);
                this.selected = option;
            },
            getWidget(field) {
                if (field.suggested_widget.endsWith(':read-only')) {
                    const s = field.suggested_widget;
                    return s.substring(0, s.length - 10) + '-component';
                } else {
                    return field.suggested_widget + '-component';
                }
            },
            getFieldValue(field) {
                //FIXME
                return null;
            },
            selectAlgorithm(algo) {
                this.selectedAlgorithm = algo;
            }
        },
        watch: {
            async selected() {
                if (this.selected === 'algorithms') {
                    const params = {
                        enabled: 'true',
                        platform: 1, //FIXME
                        category: this.taskType,
                        lang: this.$locale,
                    }
                    const resp = await axios.get(
                        `${tahitiUrl}/operations`, { params });
                    this.algorithms = resp.data;
                    this.selectedAlgorithm = this.algorithms[0];
                }
            }
        }
    }
</script>

<style scoped>
    .explorer-nav>>>.nav-item {
        margin-bottom: 0px;
        padding: 0
    }

    .explorer-nav>>>.nav-item a {
        padding: 6px 0px 1px 10px;
        font-size: .9em;
    }

    .explorer-nav>>>.nav-item.active a {
        border-left: 5px solid green;
        padding-left: 5px !important;
    }

    .explorer-nav>>>.header {
        color: #555;
        font-size: .9em;
        font-weight: bold;
        text-transform: uppercase;
    }

    .custom-card {
        padding: 0 5px;
    }

    h5 {
        font-size: 14pt;
    }

    h5,
    h6 {
        color: #888;
    }

    form {
        font-size: .8em;
    }

    .editor {
        border-bottom: 1px dashed;
        border-color: #888;
    }

    .parameters label {
        margin-top: 10px;
    }

    .scroll-area {
        xborder: 1px solid #ccc;
        max-height: calc(100vh - 320px);
        padding: 10px 15px 10px 10px;
    }

    .active-item {
        background-color: #e7f3ff
    }

    .size-full>div {
        height: calc(100vh - 220px);
    }
</style>