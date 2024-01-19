<template>
    <div class="source-code-pro-font">
        <div class="flex_container">
            <div class="flex_item_left noselect step-list p-1">
                <div class="p-2">
                    <h6>{{ $t('dataExplorer.title') }}</h6>
                    <div>
                        <small>{{ $t('common.name') }}</small>
                        <input v-model="workflowObj.name" type="text" class="form-control form-control-sm" maxlength="50">
                    </div>
                    <div class="mb-">
                        <small>{{ $t('titles.cluster') }}</small>
                        <v-select v-model="clusterId" :options="clusters" label="name" :reduce="(opt) => opt.id"
                            :taggable="false" :close-on-select="true" :filterable="false">
                            <template #option="{ description, name }">
                                {{ name }}<br>
                                <small><em>{{ description }}</em></small>
                            </template>
                        </v-select>
                    </div>

                    <!-- FIXME
                    <b-dropdown :disabled="false && loadingData" variant="secondary" size="sm"
                        class="float-end mt-2 ms-1" @click="saveWorkflow">
                        <template #button-content>
                            <font-awesome-icon icon="fa fa-cog" />
                        </template>
                        <b-dropdown-item href="#" @click.prevent="handleExport">
                            {{$t('actions.export')}} ...
                        </b-dropdown-item>
                    </b-dropdown>
                    -->
                    <b-button variant="primary" size="sm" class="float-end mt-2" :disabled="editing" @click="saveWorkflow">
                        <font-awesome-icon icon="fa fa-save" /> {{ $t('actions.save') }}
                    </b-button>
                    <b-button :disabled="loadingData || editing" size="sm" variant="outline-secondary"
                        class="float-end mt-2 me-1" @click="loadData(null, null, false)">
                        <font-awesome-icon icon="fa fa-redo" /> {{ $t('actions.refresh') }}
                    </b-button>
                </div>
                <!-- Steps -->
                <div v-if="workflowObj" class="clearfix mt-2">
                    <step-list ref="stepList" :workflow="workflowObj" language="pt" :attributes="[]"
                        :suggestion-event="getSuggestions" :extended-suggestion-event="getExtendedSuggestions"
                        @toggle="handleToggleStep" @delete="handleDeleteStep" @delete-many="handleDeleteSelected"
                        @duplicate="duplicate" @preview="previewUntilHere" @update="handleUpdateStep"
                        @end-sort-steps="endSortSteps" @duplicate-step="duplicateStep" @select="handleSelectStep"
                        @toggle-selected="handleToggleSelected" />

                    <div class="text-secondary">
                        <small>{{ jobStatus }} (p. {{ page }})</small>
                        <br>
                        <small>Data size: {{ dataSize }} kb.</small>
                        <br>
                        <!--

                            <small v-if="loadedDataSize > 1"
                                class="text-info">
                                {{$t('common.pagerShowing', 0, {from: 1,
                                    to: Math.min(pageSize * page, tableData.total), count: tableData.total
                                })}}.</small>
                            -->
                    </div>
                </div>
            </div>
            <!-- Preview area -->
            <div class="flex_item_right mt-3">
                <PreviewMenu :selected="selected" :menus="menus" @trigger="handleTrigger" @analyse="handleAnalyse" />
                <table v-if="!previewCompleted" class="table b-table table-striped table-bordered">
                    <tbody>
                        <tr>
                            <th v-for="col, i in 10" :key="i">
                                &nbsp;
                            </th>
                        </tr>
                        <tr v-for="row in 10" :key="row">
                            <td v-for="col, i in 10" :key="i">
                                <div class="skeleton skeleton-text skeleton-animate-wave" />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <Preview ref="preview" :attributes="tableData.attributes" :items="rows" :missing="tableData.missing"
                    :invalid="tableData.invalid" :loading="loadingData" :total="tableData.total"
                    @select="handleSelectAttribute" @drop="handleTrigger" @context-menu="handleContextMenu"
                    @scroll="handleScroll" @render-complete="previewCompleted = true" />
            </div>

            <ModalExport v-if="!loadingData" ref="modalExport" :name="workflowObj.name" @ok="handleExport" />

            <b-modal ref="statsModal" button-size="sm" size="xl" :ok-only="true" :hide-header="true" @close="stats = null"
                @ok="stats = null">
                <div class="p-2">
                    <div v-if="stats && stats.attribute === null">
                        <h5>Estatísticas do resultado</h5>
                        <div>
                            <b-form-checkbox v-model="numericOnlyStats" xclass="mt-3 mb-4">
                                Mostrar apenas para atributos numéricos
                            </b-form-checkbox>
                        </div>
                        <b-tabs>
                            <b-tab title="Estatísticas básicas" title-link-class="small-nav-link tab-small">
                                <div class="scrollable stats">
                                    <table class="table table-bordered table-stats table-striped table-sm">
                                        <thead>
                                            <tr v-if="stats.message && stats.message.table" class="text-center">
                                                <td v-for="k in stats.message.table.columns" :key="k.name">
                                                    {{ k.name }}
                                                </td>
                                            </tr>
                                        </thead>
                                        <transition-group name="slide" tag="tbody">
                                            <tr v-for="(v, row) in numericStats" :key="row">
                                                <td v-for="(attr, col) in stats.message.table.columns" :key="col"
                                                    :class="{ 'font-weight-bold': col === 0 }">
                                                    {{ stats.message.table.columns[col].values[row] || '-' }}
                                                </td>
                                            </tr>
                                        </transition-group>
                                    </table>
                                </div>
                            </b-tab>
                            <b-tab title="Correlação" title-link-class="small-nav-link tab-small">
                                <div class="scrollable stats">
                                    <table class="table table-bordered table-stats table-striped table-sm w-auto mt-3">
                                        <thead>
                                            <tr class="text-center correlation">
                                                <td />
                                                <th v-for="v in stats.message.numeric" :key="v">
                                                    {{ v }}
                                                </th>
                                            </tr>
                                        </thead>
                                        <transition-group name="slide" tag="tbody">
                                            <tr v-for="(v, row) in stats.message.correlation" :key="row">
                                                <th>{{ stats.message.numeric[row] }}</th>
                                                <td v-for="(attr, col) in v" :key="col"
                                                    :style="{ backgroundColor: _heatMapColorforValue(attr), color: attr === 1 ? 'white' : 'black' }"
                                                    class="text-center">
                                                    {{ attr }}
                                                </td>
                                            </tr>
                                        </transition-group>
                                    </table>
                                </div>
                            </b-tab>
                        </b-tabs>
                    </div>
                    <div v-else>
                        <span v-if="stats">
                            <select ref="selectAttributeStat" class="form-select-sm mb-2"
                                @change.prevent="handleSelectAttributeStat">
                                <option v-for="name in attributeNames" :key="name" :selected="name === stats.attribute">
                                    {{ name }}</option>
                            </select>
                        </span>
                        <b-tabs>
                            <b-tab title="Estatísticas" title-link-class="small-nav-link">
                                <div v-if="stats && stats.message" class="row">
                                    <div v-if="stats && stats.message.histogram"
                                        :class="stats.message.numeric ? 'col-9' : 'col-12'">
                                        <Plotly v-if="stats" ref="plotly" :auto-resize="true" :layout="{
                                            showlegend: false,
                                            margin: { l: 50, r: 50, b: stats.message.numeric ? 30 : 100, t: 10, pad: 4 },
                                            xaxis: {
                                                tickangle: 45, tickfont: { size: 11 },
                                                type: stats.message.numeric ? null : 'category'
                                            },
                                            yaxis: { domain: [0.2] },
                                            yaxis2: {
                                                domain: [0.8],
                                                visible: false,
                                            },
                                            legend: { traceorder: 'reversed' },
                                            height: stats.message.numeric ? 200 : 300, width: stats.message.numeric ? 600 : 750,
                                            autosize: true,
                                        }" :data="getStatData()" :options="{ displayModeBar: false }" />
                                    </div>
                                    <div v-if="stats.message.numeric" class="col-3">
                                        <div v-if="stats.message.outliers && stats.message.outliers.length">
                                            <span>Valores atípicos (outliers)*</span>
                                            <table class="table table-sm table-stats table-bordered">
                                                <tr v-for="t, i in stats.message.outliers" :key="i">
                                                    <td>{{ t }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div v-else>
                                            Não há valores atípicos (outliers)
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <span>Estatísticas (exclui nulos)</span>
                                        <table class="table table-sm table-stats table-bordered">
                                            <tr v-for="value, stat in stats.message.stats" :key="stat">
                                                <td class="text-capitalize">
                                                    {{ stat }}
                                                </td>
                                                <td>{{ value }}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div v-if="stats.message.top20" class="col-8">
                                        <span>Top valores *</span>
                                        <table class="table table-sm table-stats table-bordered">
                                            <tr v-for="t, i in stats.message.top20.slice(0, 10)" :key="i">
                                                <td class="col-8">
                                                    {{ t[0] }}
                                                    <div class="top-bar"
                                                        :style="{ height: '10px', width: (100 * t[1] / stats.message.stats.count) + '%' }" />
                                                </td>
                                                <td class="col-4 text-end">
                                                    {{ t[1] }}
                                                    ({{ (100 * t[1] / stats.message.stats.count).toFixed(2) }})%
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <div class="col-12 text-end">
                                        <small><em>*limitados a 10</em></small>
                                    </div>
                                </div>
                            </b-tab>
                            <b-tab v-if="selected?.field?.type === 'Text'" title="Agrupar/mesclar" class="pt-4"
                                :title-link-class="'small-nav-link'">
                                <form action="" class="form-inline">
                                    <div class="form-group mb-2">
                                        <label for="similarity">Similaridade:</label> &nbsp;
                                        <select v-model.number="similarity" name="similarity"
                                            class="form-control-sm ms-3 me-3">
                                            <option value="0.5">
                                                0.5 (menos semelhantes)
                                            </option>
                                            <option>0.6</option>
                                            <option>0.7</option>
                                            <option>0.8</option>
                                            <option value="0.9">
                                                0.9 (mais semelhantes)
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form-group mb-2">
                                        <button class="btn btn-secondary btn-sm" @click.prevent="handleComputeCluster">
                                            Computar grupos
                                        </button>
                                        <button class="btn btn-success btn-sm ms-2" @click.prevent="handleComputeCluster">
                                            Mesclar selecionados
                                        </button>
                                    </div>
                                </form>
                                <div style="height: 500px; overflow-y:auto">
                                    <table v-if="valuesClusters && valuesClusters.length > 0"
                                        class="table table-sm table-smallest mt-4">
                                        <tr>
                                            <th />
                                            <th class="col-6">
                                                Grupo
                                            </th>
                                            <th class="col-6">
                                                Substituir por
                                            </th>
                                        </tr>
                                        <tr v-for="values in valuesClusters" :key="values[0]">
                                            <td>
                                                <input type="checkbox" class="checkbox">
                                            </td>
                                            <td>
                                                <span v-for="v, k in values" :key="k" style="white-space: pre"
                                                    :class="{ 'text-secondary': k !== 0 }">{{ v }} <br></span>
                                            </td>
                                            <td>
                                                <input type="text" class="form-control form-control-sm w-100"
                                                    :value="values[0]">
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </b-tab>
                        </b-tabs>
                    </div>
                </div>
            </b-modal>
        </div>
        <modal-save-data v-if="internalWorkflowId" ref="modalSaveData" name="save-data" :workflow-id="internalWorkflowId"
            @confirm="handleConfirmSaveData" />
    </div>
</template>
<script>
;
import jsep from 'jsep';
import io from 'socket.io-client';
import axios from 'axios';
import { debounce, deepToRaw } from '@/util.js';
import Preview from './DataExplorerPreview.vue';
import PreviewMenu from './DataExplorerPreviewMenu.vue';
import StepList from './DataExplorerStepList.vue';
import Notifier from '@/mixins/Notifier.js';
import { Workflow, Operation, Task, Constants } from './entities.js';
import Plotly from '@/components/visualization/Plotly.vue';
import ModalExport from './ModalExport.vue';
import ModalSaveData from './data-explorer/ModalSaveData.vue';
import loadTahitiScript from '@/tahiti.js';

jsep.addBinaryOp(">=", 1);
jsep.removeBinaryOp('^');
const tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
const standUrl = import.meta.env.VITE_STAND_URL;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;

const META_PLATFORM_ID = 1000;
const PAGE_SIZE = 100;
const WORKFLOW_OFFSET = 800000;

const type2Generic = new Map([
    ['Float32', 'Decimal'],
    ['Float64', 'Decimal'],
    ['Int8', 'Integer'],
    ['Int16', 'Integer'],
    ['Int32', 'Integer'],
    ['Int64', 'Integer'],
    ['UInt8', 'Integer'],
    ['UInt16', 'Integer'],
    ['UInt32', 'Integer'],
    ['UInt64', 'Integer'],
    ['Date', 'Date'],
    ['Datetime', 'Date'],
    ['Duration', 'Integer'],
    ['Time', 'Time'],
    ['Boolean', 'Boolean'],
    ['List', 'Array'],
    ['Utf8', 'Text'],
    ['Categorical', 'Text'],
]);

export default {
    name: "DataExplorer",
    components: {
        Plotly,
        Preview,
        StepList, PreviewMenu, ModalExport, ModalSaveData
    },
    mixins: [Notifier],
    beforeRouteLeave(to, from, next) {
        if (!this.isDirty || (confirm(this.$t('warnings.dirtyCheck')))) {
            next();
        }
    },
    props: {
        //attributes: { type: Array, default: () => [] },
        //items: { type: Array },
        //workflowId: { type: Number },
    },
    data() {
        return {
            previewCompleted: false,
            attributeSelection: [], // used to select attributes
            attributes: [],
            attributeNames: [],
            clusters: [],
            clusterId: null,
            dataSource: {}, // current data source
            dataSourceLabel: null,
            dataTypes: Constants.DATA_TYPES,
            internalWorkflowId: null, // workflow id
            isDirty: false,  //check if workflow is dirty before leaving page
            job: null,  //last job details
            jobStatus: null,
            dataSize: 0,
            language: this.$store.getters.user.locale,
            loadingData: true,  //data loading state
            operations: [],
            operationLookup: new Map(),
            schemas: {},
            selected: { field: {} }, // selected attribute in table preview
            socket: null, // used by socketio (web sockets)

            tableData: { attributes: [] }, // data used to render preview table
            workflowObj: { cluster: null },
            //
            menus: [],
            attributeSuggestion: {},
            loadedDataSize: 0,
            page: 1,
            pageSize: PAGE_SIZE,
            rows: [],
            dummyDataOffset: 0,
            stats: null,
            valuesClusters: [],
            similarity: 0.8,

            numericOnlyStats: false,
            suggestion: null,
        };
    },
    computed: {
        editing() {
            return (this.workflowObj && this.workflowObj.tasks &&
                this.workflowObj.tasks.find(t => t.editing) !== undefined);
        },
        pendingSteps() {
            return this.editing
                || (this.workflowObj.tasks && undefined !== this.workflowObj.tasks.find(t => t.hasProblems()));
        },
        numericStats() {
            return this.stats.message.table.columns[0].values.filter((v, inx) =>
                !this.numericOnlyStats || this.stats.message.numeric.includes(v));
        }
    },
    async mounted() {
        this.internalWorkflowId = (this.$route) ? parseInt(this.$route.params.id) : 0;

        const job_id = WORKFLOW_OFFSET + parseInt(this.internalWorkflowId);
        this.job = { id: job_id };

        await this.loadClusters();
        await this.loadOperations();
        const workflowOk = await this.loadWorkflow();

        this.connectWebSocket();
        if (workflowOk) {
            await this.loadData(null, null, false);;
        } else {
            this.loadingData = false;
        }
        await loadTahitiScript(`${tahitiUrl}/public/js/tahiti.js`);
        this.suggestion = TahitiAttributeSuggester;
        this.updateAttributeSuggestion();
    },
    beforeUnmount() {
        this.disconnectWebSocket();
    },
    methods: {
        handleSelectStep(task, value) {
            const found = this.workflowObj.tasks.find((t) => task.id === t.id);
            if (found) {
                found.selected = true;
            }
        },
        addDummyData() {
            /* not working as expected
                return
                if (this.rows.length > 0) {
                    this.dummyDataOffset = this.rows.length;

                    const dummy = Object.getOwnPropertyNames(this.rows[0])
                        .reduce((o, key) => ({ ...o, [key]: '?' }), {})
                    this.rows = this.rows.concat(Array(50).fill(dummy));
                }
                */
        },
        removeDummyData() {
            if (this.dummyDataOffset > 0) {
                this.rows = this.rows.slice(0, this.dummyDataOffset);
                this.dummyDataOffset = 0;
            }
        },
        /**/
        handleScroll: debounce(function (el) {
            if ((el.srcElement.offsetHeight + el.srcElement.scrollTop) >= el.srcElement.scrollHeight) {
                if (this.loadedDataSize < this.tableData?.total) {
                    if (this.socket) {
                        this.$nextTick(() => {
                            // Fill data with dummy values while waits for real ones.
                            this.addDummyData();

                            const workflow_id = this.workflowObj.id;
                            const job_id = WORKFLOW_OFFSET + parseInt(workflow_id);
                            // Get the last visible and enabled task
                            const task_id = [... this.workflowObj.tasks].reverse().find(
                                task => task.enabled && task.previewable)['id'];
                            this.socket.emit("more data", {
                                workflow_id, job_id, room: `${job_id}`, task_id,
                                size: PAGE_SIZE, page: this.page + 1, type: "more data",
                            });
                            this.loadingData = true;
                        });
                    }
                }
            }
        }, 500),
        /* Data loading - Workflow */
        //
        async saveWorkflow() {

            const cloned = structuredClone(deepToRaw(this.workflowObj));
            const url = `${tahitiUrl}/workflows/${cloned.id}`;

            cloned.preferred_cluster_id = this.clusterId;
            cloned.platform_id = META_PLATFORM_ID;
            cloned.tasks.forEach((task) => {
                task.operation = { id: task.operation.id };
                delete task.version;
                delete task.step;
                delete task.status;
            });
            cloned.flows = [];
            try {
                await axios.patch(url, cloned, { headers: { 'Content-Type': 'application/json' } });
                this.isDirty = false;
                this.success(this.$t('messages.savedWithSuccess',
                    { what: this.$t('titles.workflow') }), 2000);
            } catch (e) {
                this.error(e);
            }
        },
        async loadWorkflow() {
            const self = this;
            self.loadingData = true;
            try {
                const resp = await axios.get(`${tahitiUrl}/workflows/${this.internalWorkflowId}?type=DATA_EXPLORER`);
                const workflow = resp.data;
                workflow.tasks = workflow.tasks.sort(
                    (a, b) => { return a.display_order - b.display_order; });
                workflow.tasks.forEach(t => {
                    t.operation = self.operationLookup.get(t.operation.id);
                });

                const user = this.$store.getters.user;
                workflow.user_id = user.id;
                workflow.user_login = user.login;
                workflow.user_name = user.name;
                this.workflowObj = new Workflow(workflow);
                if (this.clusters && this.clusters.length && !this.workflowObj.preferred_cluster_id) {
                    this.workflowObj.preferred_cluster_id = this.clusters[0].id;
                }
                this.clusterId = this.workflowObj.preferred_cluster_id;

                this.workflowObj.tasks.forEach((task) => {
                    task.previewable = task?.forms?.$meta?.value?.previewable != false;
                });

                //To be compatible:
                // 1 - First task must be data reader
                // 2 - Second task must be a sample
                // 3 - Last task must emit samples
                // 4 - No output can be used more than once (?)
                // 5 - Only some operations are supported
                const readerTask = workflow.tasks[0]; //workflow.tasks.find(t => t.operation.slug === 'read-data');
                const sampleTask = workflow.tasks[1];
                this.dataSourceLabel = `${readerTask.forms.data_source.value} - ${readerTask.forms.data_source.labelValue}`;

                const hasUnsupported = workflow.platform.slug !== 'meta'; //tasks.some((t) => !SUPPORTED_OPERATIONS.includes(t.operation.slug));
                let hasProblems = false;
                if (hasUnsupported || readerTask?.operation?.slug !== 'read-data') {
                    self.error(self.$t('dataExplorer.invalidWorkflow'), 10000);
                    self.$router.push({ name: 'index-explorer' });
                    hasProblems = true;
                }
                if (sampleTask?.operation?.slug !== 'sample') {
                    const op = this.operationLookup.get(2110); // FIXME;
                    const sample = Workflow.createSampleTask(1, op, this);
                    self.warning(self.$t('dataExplorer.invalidWorkflow'), 10000);
                    this.workflowObj.tasks.splice(1, 0, sample);
                    hasProblems = true;
                }
                this.workflowObj.tasks.forEach((t, inx) => t.display_order = inx);
                this.loadingData = false;
                return !hasProblems;

            } catch (e) {
                console.debug(e);
                self.error(e);
                self.$router.push({ name: 'index-explorer' });
            } finally {
                this.$nextTick(() => {
                    this.loadingData = false;
                    this.isDirty = false;
                });
            }
            return true;
        },
        async loadData(callback = null, success = null, save = false) {
            if (save) {
                this.saveWorkflow();
            }
            const self = this;
            // if (self.pendingSteps) {
            //     self.warning("Existe(m) etapa(s) com pendências. Faça as correções antes de executar o experimento.", 5000);
            //     return;
            // }
            self.loadingData = true;
            const cloned = JSON.parse(JSON.stringify(this.workflowObj));
            cloned.platform_id = cloned.platform.id; //FIXME: review
            cloned.preferred_cluster_id = self.clusterId;

            cloned.tasks = cloned.tasks.filter(task => task.enabled && task.previewable);
            cloned.tasks.forEach((task) => {
                // Remove unnecessary attributes from operation
                task.operation = { id: task.operation.id };
                delete task.version;
            });
            cloned.flows = [];
            if (callback) {
                callback(cloned);
            }

            const body = {
                workflow: cloned,
                cluster: { id: self.clusterId },
                name: `## explorer ${self.workflowObj.id} ##`,
                user: this.$store.getters.user, //: { id: user.id, login: user.login, name: user.name },
                persist: false, // do not save the job in db.
                app_configs: {
                    verbosity: 0, sample_size: PAGE_SIZE, sample_page: 1,
                    target_platform: 'scikit-learn',
                    variant: 'polars',
                    sample_style: 'DATA_EXPLORER'
                },
            };

            try {
                this.loadingData = true;
                const response = await axios.post(`${standUrl}/jobs`, body,
                    { headers: { 'Locale': self.$root.$i18n.locale, } });
                self.$refs.preview && self.$refs.preview.scroll({ top: 0 });
                self.job = response.data.data;
                self.page = 1;
                self.connectWebSocket();
                this.loadingData = false;
                if (success) {
                    success();
                }
                this.$nextTick(() => {
                    this.$nextTick(() => {
                        this.previewCompleted = true
                    });
                });
            } catch (ex) {
                if (ex.data) {
                    self.error(ex.data.message);
                } else if (ex.status === 0) {
                    self.$root.$refs.toastr.e(`Error connecting to the backend (connection refused).`);
                } else {
                    self.error(`Unhandled error: ${JSON.stringify(ex)}`);
                }
            }
        },
        /* Load auxiliary objects */
        async loadClusters() {
            try {
                const resp = await axios.get(`${standUrl}/clusters?enable=true&fields=id,name,description,type,platforms`);
                this.clusters = resp.data.data;
            } catch (e) {
                this.error(e);
            }
        },
        async loadOperations() {
            const self = this;
            // Platform is always META_OPERATION_ID
            try {
                const resp = await axios.get(
                    `${tahitiUrl}/operations?platform=${META_PLATFORM_ID}&lang=${this.$root.$i18n.locale}`
                );
                const operations = resp.data.data;
                const menuCategories = new Map();
                this.operations = operations;
                operations.forEach(op => {
                    const dataType = op.categories.find(c => c.type === 'data-type');
                    op.dataType = (dataType) ? dataType.name : 'all'; //FIXME
                    const menu = op.categories.find(c => c.type.substring(0, 4) === 'menu');

                    if (menu) {
                        if (!menuCategories.has(menu.id)) {
                            menuCategories.set(menu.id, { operations: [op], menu });
                        } else {
                            menuCategories.get(menu.id).operations.push(op);
                        }
                    }
                    self.operationLookup.set(op.id, new Operation(op));
                });

                this.menus = Array.from(menuCategories.values()).sort((a, b) => a.menu.order - b.menu.order);
                this.menus.forEach(menu => {
                    menu.operations.sort((a, b) => a.id - b.id);
                    // type contains 3 parts: menu/enableCondition/icon
                    const parts = menu.menu.type.split('/');
                    menu.enableCondition = parts[1];
                    menu.icon = parts[2];
                });

            } catch (e) {
                this.error(e);
            }

        },
        handleConfirmSaveData(params) {
            const SAVE_OPERATION_ID = 2164;
            const SAMPLE_OPERATION_ID = 2110;

            const callback = (cloned) => {
                const { name, path, tags, description, storage, data_source_id } = params;
                if (params.complete) {
                    cloned.tasks.every((t) => {
                        if (t.operation.id === SAMPLE_OPERATION_ID) {
                            t.enabled = false;
                            return false;
                        }
                        return true;
                    });
                }
                cloned.tasks.push(
                    {
                        operation: { id: SAVE_OPERATION_ID },
                        display_order: cloned.tasks.length,
                        enabled: true,
                        environment: 'DESIGN',
                        id: Operation.generateTaskId(),
                        name: 'Save data',
                        forms: {
                            data_source_id, name, path, tags, description,
                            format: 'PARQUET',
                            mode: 'error',
                            header: false,
                            storage
                        }
                    }
                );
            };
            const success = () => {
                this.success(this.$t('messages.savedWithSuccess',
                    { what: this.$t('titles.dataSource') }), 3500);
            };
            this.loadData(callback, success, true);
        },
        handleStepDrag(e) {
            // Disable some steps to be dragged
            return (e?.relatedContext?.element?.display_order > 1);
        },

        /* Step group actions */
        handleSelectAll(ev) {
            this.workflowObj.tasks.forEach((task) => {
                task.selected = (task.display_order > 1) && ev.target.checked;
            });
        },
        handleToggleSelected(value) {
            let changed = false;
            this.workflowObj.tasks.forEach((task) => {
                task.enabled = (task.selected && value) || (task.display_order < 1);
                this.isDirty = true;
                changed = true;
            });
            if (changed) {
                this.loadData(null, null, false);
            }
        },
        handleDeleteSelected() {
            this.confirm(
                this.$t('actions.delete'), this.$t('dataExplorer.doYouWantToDeleteStep'),
                () => {
                    let found = false;
                    this.workflowObj.tasks.forEach((task) => {
                        if (task.display_order > 1 && task.selected) {
                            this.workflowObj.deleteTask(task);
                            this.isDirty = true;
                            found = true;
                        }
                    });
                    if (found) {
                        this.loadData(null, null, false);
                    }
                }
            );
        },
        /* Attribute suggestion */
        async _queryDataSource(id, callback) {
            //console.debug(`Querying data source ${id}.`);
            let attributes = null;
            id = parseInt(id);
            if (window.TahitiAttributeSuggester.cached === undefined) {
                window.TahitiAttributeSuggester.cached = {};
            }
            if (window.TahitiAttributeSuggester.cached[id]) {
                attributes = window.TahitiAttributeSuggester.cached[id];
                callback(attributes);
            } else {
                try {
                    const response = await axios.get(`${limoneroUrl}/datasources/${id}?attributes_name=true`);
                    //console.debug(response.data) 
                    let ds = response.data;
                    attributes = ds.attributes.map(function (attr) { return attr.name; }).sort();
                    window.TahitiAttributeSuggester.cached[id] = attributes;
                    callback(attributes);
                } catch (ex) {
                    this.warning(this.$t('errors.invalidDataSource'));
                    callback([]);
                }
            }
        },
        updateAttributeSuggestion() {
            let attributeSuggestion = {};
            if (!this.suggestion) return;
            try {
                //const cloned = structuredClone(deepToRaw(this.workflowObj));
                const flows = []
                for (let i = 0; i < this.workflowObj.tasks.length - 1; i++) {
                    let pair = [, this.workflowObj.tasks[i + 1].id];
                    flows.push({source_id: this.workflowObj.tasks[i].id, 
                        target_id: this.workflowObj.tasks[i + 1].id});
                }
                
                this.workflowObj.flows = flows;
                this.suggestion.compute(this.workflowObj, this._queryDataSource,
                    (result) => {
                        Object.keys(result).forEach(key => {
                            attributeSuggestion[key] = result[key].uiPorts;
                        });
                        Object.assign(this.attributeSuggestion, attributeSuggestion);
                        this.suggestion.processed = true;
                    });
            } catch (e) {
                console.log(e);
            }
            return
        },
        _unique(data) {
            return Array.from(new Set(data));
        },
        getSuggestions(taskId) {
            //return this.tableData.attributes.map(a => a.label);
            const extendedSuggestions = this.getExtendedSuggestions(taskId);
            if (extendedSuggestions && extendedSuggestions.inputs?.length) {
                return this._unique(Array.prototype.concat.apply([],
                    extendedSuggestions.inputs.map(
                        (item) => { return item.attributes; }))).sort(this._caseInsensitiveComparator);
            } else {
                return [];
            }
        },
        getExtendedSuggestions(taskId) {
            if (this.suggestion.processed === undefined
                || this.attributeSuggestion[taskId] === undefined
                || this.attributeSuggestion[taskId].length === 0) {
                this.updateAttributeSuggestion();
            }
            if (this.attributeSuggestion[taskId]) {
                return this.attributeSuggestion[taskId];
            } else {
                return {};
            }
        },
        /* Trigged by the step action */
        handleToggleStep(task) {
            task.enabled = !task.enabled;
            this.isDirty = true;
            this.loadData(null, null, false);
        },
        duplicate(step) {
            // Clone tasks instance
            const cloned = new Task(structuredClone(deepToRaw(step)));
            cloned.id = Operation.generateTaskId();
            this.workflowObj.tasks.splice(step.display_order, 0, cloned);
            // Update the display_order
            this.workflowObj.tasks.slice(step.display_order + 1).forEach(
                (task) => task.display_order++);
            this.isDirty = true;
        },
        previewUntilHere(step) {
            this.workflowObj.tasks.forEach((task) => {
                const previewable = (task.display_order <= step.display_order);
                task.previewable = previewable;
                if (task.forms?.$meta?.value) {
                    task.forms.$meta.value.previewable = previewable;
                } else {
                    task.forms.$meta = { value: { previewable } };
                }
            });
            this.isDirty = true;
            this.loadData(null, null, false);
        },
        handleUpdateStep(step) {
            const task = this.workflowObj.tasks.find(t => t.id === step.id);
            if (task) {
                Object.assign(task.forms, step.forms);
                task.editing = false;
                this.updateAttributeSuggestion();
                this.isDirty = true;
                this.loadData(null, null, false);
            }
        },
        handleDeleteStep(task) {
            this.workflowObj.deleteTask(task);
            if (task.previewable) {
                this.loadData(null, null, false);
            }
            this.$refs.stepList.setEdition(true);
            this.isDirty = true;
        },
        /*

        resetMenuData() {
            this.selected = { field: {} };
            this.$refs.preview.resetMenuData();
        },
        */
        handleSelectAttributeStat(ev) {
            const name = ev.target.value;
            this.handleAnalyse({ column: name, field: { key: name } });
            this.$refs.selectAttributeStat.disabled = true;
            // const pos = this.attributeNames.indexOf(this.stats.attribute);
            // if (pos > -1) {
            //     if (action === 'next' && this.tableData.attributes[pos + 1]) {
            //         const attr = this.tableData.attributes[pos + 1]
            //         this.handleAnalyse({column: attr.name, field: attr});
            //     } else if (this.attributeNames[pos - 1]) {
            //         const attr = this.tableData.attributes[pos - 1];
            //         this.handleAnalyse({column: attr.name, field: attr});
            //     }
            // }

        },
        handleSelectAttribute(attr) {
            this.selected = attr;
            this.valuesClusters = [];
        },

        /* Actions that add new steps */
        /* Handle Preview component context menu event */
        handleContextMenu(action, attributeName, operator, attributeValue) {
            //Formula using JSep syntax (https://ericsmekens.github.io/jsep/)
            let op = null;
            let expression = null;
            let alias = attributeName;

            if (action === 'filter') {
                op = this.operations.find(op => op.slug === 'filter');
                expression = `${attributeName} ${operator} ${attributeValue}`;
            } else if (action === 'filterNull') {
                op = this.operations.find(op => op.slug === 'filter');
                const f = operator === '!' ? 'isnotnull' : 'isnull';
                expression = `${f}(${attributeName}) `;
            } else if (action === 'flag') {
                op = this.operations.find(op => op.slug === 'add-by-formula');
                if (operator == '==' || operator == '!=') {
                    expression = `${attributeName} ${operator} ${attributeValue}`;
                } else {
                    const f = operator === '!' ? 'isnotnull' : 'isnull';
                    expression = `${f}(${attributeName}) `;
                }
                alias = `${attributeName}_flag`;
            } else if (action === 'clean') {
                op = this.operations.find(op => op.slug === 'add-by-formula');
                expression = `when(${attributeName} == ${attributeValue}, null, ${attributeName})`;
            }

            const formula = { alias, expression, tree: jsep(expression) };
            // formula['tree'] = jsep(expression);
            this.handleTrigger({
                action: 'menu',
                fields: { formula: { value: [formula] } },
                params: [op], 'selected': attributeName,
            });
        },
        /* Handle Preview component menu clicks */
        handleTrigger(options) {
            if (options.action === 'export') {
                this.$refs.modalExport.show();
            } else if (options?.params[0]?.slug === 'save') {
                this.$refs.modalSaveData.show();
                //console.debug(options);
            } else if (options.action === 'menu') {
                const newTask = this.workflowObj.addTask(
                    this.operationLookup.get(options.params[0].id),
                    options.selected, options.fields);
                this.isDirty = true;
                //this.loadData();
                this.$nextTick(() => { this.$refs.stepList.scrollToStep(); });
            } else {
                console.log(`Unknown action: ${options.action}`);
            }
        },

        disconnectWebSocket() {
            if (this.socket) {
                this.socket.emit('leave', { room: this.job.id });
                this.socket.close();
            }
        },
        duplicateStep(step) {
            // Clone tasks instance
            const cloned = new Task(JSON.parse(JSON.stringify(step)));
            cloned.id = Operation.generateTaskId();
            this.workflowObj.tasks.splice(step.display_order, 0, cloned);
            // Update the display_order
            this.workflowObj.tasks.slice(step.display_order + 1).forEach(
                (task) => task.display_order++);
            this.isDirty = true;
        },
        endSortSteps({ originalEvent }) { // eslint-disable-line no-unused-vars
            let elem = null;
            this.workflowObj.tasks.forEach((task, i) => {
                task.display_order = i;
                if (task.previewable) {
                    elem = task;
                    return false;
                }
            });
            this.isDirty = true;
            this.previewUntilHere(elem);
            this.loadData(null, null, false);
            this.updateAttributeSuggestion();
        },

        handleAnalyse(selected) {
            const workflow_id = this.workflowObj.id;
            const job_id = WORKFLOW_OFFSET + parseInt(workflow_id);
            const task_id = [... this.workflowObj.tasks].reverse().find(
                task => task.enabled && task.previewable)['id'];

            this.socket.emit("analyse attribute", {
                workflow_id, job_id, room: `${job_id}`, task_id,
                type: "analyse attribute", attribute: selected?.field?.key,
            });
        },
        handleComputeCluster() {
            const workflow_id = this.workflowObj.id;
            const job_id = WORKFLOW_OFFSET + parseInt(workflow_id);
            const task_id = [... this.workflowObj.tasks].reverse().find(
                task => task.enabled && task.previewable)['id'];

            this.socket.emit("analyse attribute", {
                cluster: true, similarity: this.similarity,
                workflow_id, job_id, room: `${job_id}`, task_id,
                type: "analyse attribute", attribute: this.selected?.field?.key,
            });
        },
        handleExport({ newName, exportDisabled, platform }) {

            const cloned = JSON.parse(JSON.stringify(this.workflowObj));
            cloned.platform_id = META_PLATFORM_ID;

            if (!exportDisabled) {
                cloned.tasks = cloned.tasks.filter((t) => t.enabled);
            }
            cloned.tasks.forEach((task) => {
                task.operation = { id: task.operation.id };
                delete task.version;
                delete task.step;
                delete task.status;
            });
            const workflow_id = this.workflowObj.id;
            const job_id = WORKFLOW_OFFSET + parseInt(workflow_id);

            this.socket.emit("export", {
                workflow_id, job_id, room: `${job_id}`,
                app_id: workflow_id,
                format: 'JSON',
                ticket: new Date().getTime(),
                target_platform: platform, name: newName,
                app_configs: { persist: false },
                workflow: cloned,
                type: "export",
            });
            this.info('Exportando o fluxo de trabalho. Quando a exportação terminar, você será notificado.', 10000);
        },

        getStatData() {
            const x = this.stats.message.histogram[1];
            const customdata = this.stats.message.numeric ?
                x.map((v, inx) => `${v.toFixed(2)} - ${x[inx + 1] ? x[inx + 1].toFixed(2) : ""}`) : x;
            const result = [];

            if (this.stats.message.numeric) {
                result.push({
                    opacity: 0.6, marker: { color: 'rgb(49,130,189)' }, 'orientation': 'h', 'type': 'box',
                    'lowerfence': [this.stats.message.fence_low],
                    'mean': [this.stats.message.stats.mean],
                    'median': [this.stats.message.stats.median],
                    'q1': [this.stats.message.stats['25%']],
                    'q3': [this.stats.message.stats['75%']],
                    // 'sd': [this.stats.message.stats.std],
                    'upperfence': [this.stats.message.fence_high],
                    yaxis: 'y2',
                });
            }

            result.push({
                type: 'bar',
                hovertemplate: `%{customdata}: %{y} ${this.$t("common.records", 2)}<extra></extra>`,
                customdata,
                x,
                y: this.stats.message.histogram[0],
                marker: {
                    color: 'rgb(49,130,189)',
                    opacity: 0.4,
                }
            }
            );
            if (this.stats.message.outliers?.length) {
                result[0]['x'] = [this.stats.message.outliers];
            }
            return result;
        },
        _heatMapColorforValue(value) {
            var h = (1.0 - (value + 1) / 2) * 240;
            return "hsl(" + h + ", 100%, 50%, .5)";
        },
        /* WebSocket Handling */
        connectWebSocket() {
            const self = this;
            if (self.socket === null) {
                const opts = { upgrade: true };
                if (standSocketIoPath !== '') {
                    opts['path'] = standSocketIoPath;
                }
                const socket = io(
                    `${standSocketServer}${standNamespace}`, opts);

                self.socket = socket;
                socket.on('connect', () => { socket.emit('join', { cached: false, room: self.job.id }); });

                socket.on('exported result', (msg) => {
                    //console.debug(msg);
                });
                socket.on('analysis', (msg) => { // eslint-disable-line no-unused-vars
                    if (msg.analysis_type !== 'cluster') {
                        this.stats = msg;
                        this.$refs.statsModal?.show();
                    } else {
                        this.valuesClusters = msg.message;
                    }
                    if (this.$refs.selectAttributeStat)
                        this.$refs.selectAttributeStat.disabled = false;
                });
                socket.on('update task', (msg, callback) => {// eslint-disable-line no-unused-vars

                    // Meta add a suffix to task id when converting tasks to other platform.
                    const task = self.workflowObj.getTaskById(msg.id.substring(0, 36));
                    if (task) {
                        task.error = (msg.status === 'ERROR') ? msg.message : '';
                    }

                    if (msg.type === 'OBJECT') {
                        if (msg.meaning === 'sample') {
                            this.$nextTick(() => {
                                self.removeDummyData();
                                //console.debug(new Date());
                                // Update must be done before assigning to observable self.tableData!
                                const messageJson = msg.message;
                                if (messageJson.format === 'polars') {
                                    const truncated = messageJson.truncated || [];
                                    const attributes = messageJson.columns.map(
                                        c => ({
                                            key: c.name, label: c.name, name: c.name,
                                            type: typeof (c.datatype) === 'object' ? Object.keys(c.datatype)[0] : c.datatype,
                                            inner: c?.values[0]?.datatype,
                                            tdClass: 'customTdClass'
                                        }));
                                    self.tableData = { attributes };
                                    self.loadingData = false;
                                    attributes.forEach((attr, i) => {
                                        attr.type = msg.message.types[i]; // Polars cast to Int32 when generating JSON
                                        attr.generic_type = type2Generic.get(attr.type) || attr.type;
                                    });
                                    // console.debug(attributes)

                                    self.dataSize = Math.round(msg.message.estimated_size / 1024.0) || '?';
                                    self.attributes = attributes;

                                    const attributeNames = attributes.map(a => a.name);
                                    self.attributeNames = attributeNames;
                                    const columnValues = messageJson.columns.map(col => col.values);

                                    // Transpose the columns to rows
                                    const rows = [];
                                    for (let i = 0; i < columnValues[0].length; i++) {
                                        const row = [];
                                        for (let j = 0; j < columnValues.length; j++) {
                                            // Test if it is a list
                                            if (columnValues[j][i] && columnValues[j][i].values) {
                                                row.push(JSON.stringify(columnValues[j][i].values));
                                            } else if (attributes[j].type === 'Datetime') {
                                                row.push(this.$filters.formatTimestamp(columnValues[j][i]));
                                            } else {
                                                row.push(columnValues[j][i]);
                                            }
                                        }
                                        rows.push(row);
                                    }

                                    // Create the row-oriented JSON
                                    const rowOriented = { rows: [] };
                                    rows.forEach(row => {
                                        const rowObject = {};
                                        for (let i = 0; i < attributeNames.length; i++) {
                                            rowObject[attributeNames[i]] = row[i];
                                        }
                                        rowOriented.rows.push(rowObject);
                                    });

                                    if (messageJson.page === 1) {
                                        // Update selected attribute (may have its time changed during processing)
                                        const selected = self.tableData.attributes.find(t => t?.key === self.selected.column);
                                        if (selected) {
                                            self.handleSelectAttribute({ field: selected, column: selected.key, label: selected.key });
                                        }
                                        self.rows = rowOriented.rows;
                                        self.page = 1;
                                        self.loadedDataSize = messageJson.size;
                                    } else if (messageJson.page === self.page + 1 && mapped.length > 0) {
                                        self.rows.push.apply(self.rows, rowOriented.rows);
                                        self.page = messageJson.page;
                                        self.loadedDataSize += Math.min(self.tableData.size, rowOriented.rows.length);
                                        self.loadingData = false;
                                    } else {
                                        self.loadingData = false;
                                    }
                                } else {
                                    const truncated = messageJson.truncated || [];
                                    messageJson.attributes.forEach((attr, index) => {
                                        attr['selected'] = true;
                                        attr['truncated'] = truncated.indexOf(attr.key) > -1;
                                        attr['position'] = index;
                                    });

                                    const attributeIds = messageJson.attributes.map(attr => attr.key);
                                    const mapped = messageJson.rows.map(
                                        row => Object.assign(...attributeIds.map((attr, i) => { return { [attr]: row[i] }; })));


                                    if (messageJson.page === 1) {
                                        self.tableData = messageJson;
                                        // Update selected attribute (may have its time changed during processing)
                                        const selected = self.tableData.attributes.find(t => t?.key === self.selected.column);
                                        if (selected) {
                                            self.handleSelectAttribute({ field: selected, column: selected.key, label: selected.key });
                                        }
                                        self.rows = mapped;
                                        self.page = 1;
                                        self.loadedDataSize = messageJson.size;
                                    } else if (messageJson.page === self.page + 1 && mapped.length > 0) {
                                        self.rows.push.apply(self.rows, mapped);
                                        self.page = messageJson.page;
                                        self.loadedDataSize += Math.min(self.tableData.size, mapped.length);
                                        self.loadingData = false;
                                    } else {
                                        self.loadingData = false;
                                    }
                                }
                            });
                            //console.debug(new Date());
                        } else if (msg.meaning === 'schema') {
                            self.schemas[msg.id] = msg.message;
                            /*
                                const task = self.workflowObj.tasks.find(t => t.id == msg.id)
                                if (task) {
                                    task.forms.$meta = (task.forms.$meta || { value })['value']['schema'] = self.schemas[msg.id];
                                }
                                */
                        }
                    }
                });
                socket.on('update job', msg => {
                    self.jobStatus = '';
                    if (msg.status === 'ERROR') {
                        self.error(msg);
                        self.loadingData = false;
                    }
                    if (msg.status === 'COMPLETED') {
                        self.jobStatus = msg.message;
                        self.loadingData = false;
                    }
                });
                socket.on('*', (msg) => {
                    //console.debug(msg, 'teste');
                });
            } else {
                //self.socket.emit('join', { room: self.job.id });
            }
        }
    }
};
</script>
<style scoped>
.flex_container {
    display: flex;
    width: 100%;
}

.flex_item_left {
    width: 300px;
}

.flex_item_right {
    flex: 1;
}
</style>

<style>
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.list-group {
    min-height: 20px;
}


#step-container {
    position: relative;
}

.step-scroll-area {
    position: relative;
    margin: auto;
    height: 65vh;

}

.fill-height {
    height: 65vh
}

/*
.step-list {
    -ms-flex: 0 0 305px;
    flex: 0 0 305px;
}
*/

.table-stats {
    font-size: 9pt;
}

.table-stats td,
.table-stats th {
    padding: 4px
}

.top-bar {
    height: 4px;
    background: rgb(49, 130, 189) !important;
}

div.stats {
    max-height: 450px;
    overflow: auto
}

tr.correlation>th {
    writing-mode: vertical-lr;
    background-color: pink;
    width: 60px !important;
}
</style>