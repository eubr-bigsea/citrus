<template lang="">
    <div>
        <div>
            <div class="d-flex justify-content-between align-items-center border-bottom">
                <div class="title">
                    <h1>Construção de Modelos</h1>
                </div>

                <form class="float-right form-inline w-50 d-flex justify-content-end">

                    <label class="sr-only">{{$tc('common.name')}}:</label>
                    <input type="text" class="form-control form-control-sm w-50" :placeholder="$tc('common.name')"
                        v-model="workflowObj.name" maxlength="100">
                    <button class="btn btn-sm btn-outline-success ml-1 float-right" @click.prevent="saveWorkflow"><span
                            class="fa fa-save"></span>
                        {{$t('actions.save')}}</button>
                    <button class="btn btn-sm btn-outline-primary ml-1 float-right"><span class="fa fa-play"></span>
                        {{$t('actions.train')}}</button>
                </form>
            </div>
            <div class="custom-card">
                <b-tabs v-if="loaded" class="p-2 custom-tab bg-white" align="center">
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
                                            :data-source="dataSource" :sample="workflowObj.sample"
                                            @search-data-source="loadDataSourceList"
                                            @retrieve-attributes="handleRetrieveAttributes" />
                                    </template>
                                    <template v-if="selected === 'data'">
                                        <TrainTest :split="workflowObj.split" />
                                    </template>
                                    <template v-if="selected === 'metric'">
                                        <Metric :evaluator="workflowObj.evaluator" :attributes="attributes" />
                                    </template>
                                    <template v-if="selected === 'adjusts'">
                                        <FeatureSelection :attributes="attributes" :features="workflowObj.features"
                                            :target="workflowObj.forms.$meta.value.target"
                                            @update-target="handleUpdateTarget" />
                                    </template>
                                    <template v-if="selected === 'generation'">
                                        <FeatureGeneration />
                                    </template>
                                    <template v-if="selected === 'reduction'">
                                        <FeatureReduction :reduction="workflowObj.reduction" />
                                    </template>
                                    <template v-if="selected === 'algorithms'">
                                        <Algorithms :operations="algorithmOperation" 
                                            :workflow="workflowObj" :operation-map="operationsMap"/>
                                    </template>
                                    <template v-if="selected === 'grid'">
                                        <Grid :grid="workflowObj.grid" />
                                    </template>
                                    <template v-if="selected === 'weighting'">
                                        <Weighting />
                                    </template>
                                    <template v-if="selected === 'runtime'">
                                        <Runtime :clusters="clusters" />
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
    import Notifier from '../../../mixins/Notifier.js';

    import { ModelBuilderWorkflow, Operation } from '../entities.js';

    import axios from 'axios';
    import vSelect from 'vue-select';
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    const standUrl = process.env.VUE_APP_STAND_URL;
    const META_PLATFORM_ID = 1000;

    export default {
        components: {
            InputHeader, 'vue-select': vSelect,
            SideBar, DesignData, TrainTest, Metric, FeatureSelection, FeatureGeneration,
            FeatureReduction, Algorithms, Grid, Runtime, Weighting, Result
        },
        mixins: [DataSourceMixin, Notifier],
        computed: {
            algorithmOperation(){
                const taskType = this.workflowObj.forms.$meta.value.taskType || 'classification';
                return Array.from(this.operationsMap.values()).filter((op) => op.categories.find(cat => cat.subtype === taskType));
            },
            dataSourceId: {
                get() { return this.workflowObj.tasks[0].forms.data_source.value; },
                set(newValue) { this.workflowObj.tasks[0].forms.data_source.value = newValue }
            },
            xlabelAttribute: {
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
                //algorithms: [],
                clusters: [],
                internalWorkflowId: null,
                isDirty: false,
                labelAttribute: '',
                loaded: false,
                loadingData: false,
                operationsMap: new Map(),
                selectedAlgorithm: { forms: [] },
                selected: 'target',
                attributes: [],
                dataSourceOptions: [],
                dataSource: null,
                targetPlatform: 1,
                workflowObj: { forms: { $meta: { value: { target: '', taskType: '' } } } },

                //FIXME: hard-coded. It'd be best defined in Tahiti
                unsupportedParameters: new Set(['perform_cross_validation', 'cross_validation', 'one_vs_rest'])
            }
        },
        async created() {
            this.internalWorkflowId = (this.$route) ? this.$route.params.id : 0;
            await this.load();
        },
        methods: {
            async load() {
                this.loadingData = true;
                this.$Progress.start()
                try {
                    await this.loadOperations();
                    let resp = await axios.get(`${tahitiUrl}/workflows/${this.internalWorkflowId}`)
                    this.workflowObj = new ModelBuilderWorkflow(resp.data, this.operationsMap);
                    if (this.workflowObj.type !== 'MODEL_BUILDER') {
                        this.error(null, this.$tc('modelBuilder.invalidType'));
                        this.$router.push({ name: 'index-explorer' })
                        return;
                    }
                    await this.loadDataSource(this.dataSourceId);
                    this.labelAttribute = this.workflowObj.forms.$meta.value.label;

                    this.loadClusters();

                    this.loaded = true;
                } catch (e) {
                    this.error(e);
                    this.$router.push({ name: 'index-explorer' })
                } finally {
                    Vue.nextTick(() => {
                        this.$Progress.finish();
                        this.loadingData = false;
                        this.isDirty = false;
                    });
                }
            },
            async loadOperations() {
                const params = { category: 'model-builder', platform: META_PLATFORM_ID, 
                    fields: 'id,forms,categories,name,slug'};

                const resp = await axios.get(`${tahitiUrl}/operations`, { params });
                resp.data.data.forEach(op => this.operationsMap.set(op.slug, new Operation(op)));
            },
            async loadDataSource(id) {
                const resp = await axios.get(`${limoneroUrl}/datasources/${id}`);
                this.dataSource = resp.data;
                this.attributes = this.dataSource.attributes; //.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            },
            async loadClusters() {
                try {
                    const resp = await axios.get(`${standUrl}/clusters?enabled=true&platform=${this.targetPlatform}`)
                    this.clusters = resp.data.data;
                } catch (ex) {
                    this.error(ex);
                }
            },
            edit(option) {
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
            async saveWorkflow() {
                let cloned = JSON.parse(JSON.stringify(this.workflowObj));
                let url = `${tahitiUrl}/workflows/${cloned.id}`;

                cloned.preferred_cluster_id = 1; //FIXME! 
                cloned.platform_id = META_PLATFORM_ID;

                cloned.tasks.forEach((task) => {
                    task.operation = { id: task.operation.id };
                    delete task.version;
                    delete task.step;
                    delete task.status;
                });
                try {
                    const resp = await axios.patch(url, cloned, { headers: { 'Content-Type': 'application/json' } });
                    this.isDirty = false;
                    this.success(this.$t('messages.savedWithSuccess', { what: this.$tc('titles.workflow') }));
                } catch (e) {
                    this.error(e);
                }
            },
            getFieldValue(field) {
                //FIXME
                return null;
            },
            selectAlgorithm(algo) {
                this.selectedAlgorithm = algo;
            },
            handleRetrieveAttributes(ds) {
                this.dataSourceId = ds.id;
                this.loadDataSource(ds.id);
            },
            handleUpdateTarget(target) {
                this.workflowObj.forms.$meta.value.target = target;
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
                    //this.algorithms = resp.data;
                    //this.selectedAlgorithm = this.algorithms[0];
                }
            }
        }
    }
</script>

<style scoped>
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
        font-size: 11pt;
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