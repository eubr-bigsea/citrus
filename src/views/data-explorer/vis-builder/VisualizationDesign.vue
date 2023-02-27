<template>
    <div class="options-container">
        <div class="options-visualization mt-1">
            <div>
                <form class="clearfix visualization-form">

                    <label>{{ $tc('common.name') }}:</label>
                    <input v-model="workflowObj.name" type="text" class="form-control form-control-sm"
                        :placeholder="$tc('common.name')" maxlength="100">

                    <label for="">Fonte de dados:</label> &nbsp;
                    <vue-select v-if="workflowObj && workflowObj.readData"
                        v-model="workflowObj.readData.forms.data_source.value" :filterable="false" :options="dataSourceList"
                        :reduce="(opt) => opt.id" label="name" @search="loadDataSourceList" @input="retrieveAttributes">
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

                    <label>{{ $tc('titles.cluster') }}: </label>
                    <v-select v-model="workflowObj.preferred_cluster_id" :options="clusters" label="name"
                        :reduce="(opt) => opt.id" :taggable="false" :close-on-select="true" :filterable="false">
                        <template #option="{ description, name }">
                            {{ name }}<br>
                            <small><em>{{ description }}</em></small>
                        </template>
                    </v-select>
                    <div class="mt-2 ">
                        <button class="btn btn-sm btn-primary ml-1" @click.prevent="loadData">
                            <font-awesome-icon icon="fa fa-search" />
                            {{ $t('actions.search') }}
                        </button>

                        <button class="btn btn-sm btn-outline-success ml-1 " @click.prevent="saveWorkflow">
                            <font-awesome-icon icon="fa fa-save" />
                            {{ $t('actions.save') }}
                        </button>
                        <router-link class="btn btn-sm btn-outline-secondary ml-1" :to="{ name: 'index-explorer' }"
                            :title="$t('actions.back')">
                            {{ $t('actions.back') }}
                        </router-link>
                    </div>
                    <div v-if="visualizationObj">
                        <chart-builder-options :attributes="attributes" v-model="options" />
                    </div>
                </form>
            </div>

        </div>
        <div class="options-main" v-if="visualizationObj">
            <chart-builder-axis :attributes="attributes" :workflow="workflowObj" v-model="axis" :type="visualizationObj.type.value"/>
            <div class="chart">
                <div class="chart-builder-visualization" style="height: 85vh">
                    <div v-if="plotlyData" style="background: orange; height: 100%">
                        <plotly :options="{ responsive: true, height: 600 }" :data="plotlyData.data"
                            :layout="plotlyData.layout" />
                        <!-- ||{{ plotlyData }}|| -->

                    </div>
                    <div v-else class="chart-not-available">
                        Selecione o tipo de gráfico e configure suas propriedades
                    </div>
                    <!--
                                <small>{{ visualizationObj }}</small>
                                -->
                </div>
            </div>
        </div>
        <div v-show="loadingData" class="preview-loading">
            <font-awesome-icon icon="lemon" spin class="text-success" />
            {{ $t('common.wait') }}
        </div>
    </div>
</template>

<script>
import ChartBuilderOptions from '../../../components/chart-builder/ChartBuilderOptions.vue';
import ChartBuilderAxis from '../../../components/chart-builder/ChartBuilderAxis.vue';

import Vue from 'vue';
import ExpressionEditor from '../../../components/widgets/ExpressionEditor.vue';
import DataSourceMixin from '../DataSourceMixin.js';
import Notifier from '../../../mixins/Notifier.js';

import Plotly from '../../../components/visualization/Plotly.vue';

import { Operation, VisualizationBuilderWorkflow, Visualization } from '../entities.js';
import axios from 'axios';
import vSelect from 'vue-select';

import io from 'socket.io-client';
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
const tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const standUrl = import.meta.env.VITE_STAND_URL;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;

const META_PLATFORM_ID = 1000;

export default {
    components: {
        'vue-select': vSelect,
        ChartBuilderOptions,
        ChartBuilderAxis,
        ExpressionEditor, Plotly
    },
    mixins: [DataSourceMixin, Notifier],
    data() {
        return {
            attributes: [],
            clusters: [],
            clusterId: null,
            dataSource: null,
            dataSourceOptions: [],
            filterField: { label: 'Filtrar', values: '{"alias": false}', required: false },
            group: false,
            internalWorkflowId: null,
            isDirty: false,
            job: null,
            jobStatus: '',
            jobs: [],
            groupedJobs: null,
            loaded: false,
            loadingData: false,
            notRunning: true,
            operationsMap: new Map(),
            plotlyData: null,
            socket: null, // used by socketio (web sockets)
            targetPlatform: 4,
            workflowObj: { forms: { $meta: { value: { target: '', taskType: '' } } } },
            visualizationObj: null,

        }
    },
    computed: {
        dataSourceId: {
            get() { return this.workflowObj.readData.forms.data_source.value; },
            set(newValue) { this.workflowObj.readData.forms.data_source.value = newValue }
        },
        axis: {
            get() {
                const { x_axis, y_axis, y, x, type } = this.visualizationObj;
                return { x_axis, y_axis, y, x, type };
            },
            set(value) {
                Object.assign(this.visualizationObj, value);
            }
        },

        options: {
            get() {
                const { display_legend, smoothing, palette, color_scale, label, type, title, hole,
                    text_position, text_info, 
                    top_margin, bottom_margin, left_margin, right_margin, auto_margin} = this.visualizationObj
                return {
                    display_legend, smoothing, palette, color_scale, label, type, title, hole,
                    text_position, text_info, top_margin, bottom_margin, left_margin, right_margin,
                    auto_margin,
                };
            },
            set(value) {
                Object.assign(this.visualizationObj, value);
            }
        }
    },
    async created() {
        this.internalWorkflowId = (this.$route) ? this.$route.params.id : 0;
        await this.load();
    },
    beforeUnmount() {
        this.disconnectWebSocket();
    },
    methods: {
        getIcon(attr) {
            switch (attr.type) {
                case 'DECIMAL':
                case 'INTEGER':
                    return 'hashtag';
                case 'CHARACTER':
                    return 'font';
                case 'DATE':
                    return 'calendar';

            }
        },
        async load() {
            this.loadingData = true;
            this.$Progress.start()
            try {
                await this.loadOperations();
                let resp = await axios.get(`${tahitiUrl}/workflows/${this.internalWorkflowId}`);
                this.workflowObj = new VisualizationBuilderWorkflow(resp.data, this.operationsMap);
                if (this.workflowObj.type !== 'VIS_BUILDER') {
                    this.error(null, this.$tc('modelBuilder.invalidType'));
                    this.$router.push({ name: 'index-explorer' })
                    return;
                }
                await this.loadDataSource(this.dataSourceId);

                //const attributes = this.dataSource.attributes;
                // FIXME: 'group' task is not necessary anymore
                /*
                this.workflowObj?.group?.forms?.function?.value?.forEach(attr => {
                    attr['name'] = attr.attribute;
                    const v = attributes.find(a => a.name === attr.name);
                    attr['type'] = v ? v.type : '';
                }); */

                this.loadClusters();
                this.visualizationObj = new Visualization(
                    this.workflowObj.visualization.forms);
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
            const params = {
                category: 'visualization-builder', platform: META_PLATFORM_ID,
                fields: 'id,forms,categories,name,slug'
            };

            const resp = await axios.get(`${tahitiUrl}/operations`, { params });
            resp.data.data.forEach(op => this.operationsMap.set(op.slug, new Operation(op)));
        },
        async loadDataSource(id) {
            const resp = await axios.get(`${limoneroUrl}/datasources/${id}`);
            this.dataSource = resp.data;
            this.attributes = this.dataSource.attributes.sort((a, b) => a.name.localeCompare(b.name));
            this.attributes.forEach(a => {
                a.attribute = a.name;
                a.numeric = ['DECIMAL', 'INTEGER', 'DOUBLE', 'FLOAT', 'LONG']
                    .indexOf(a.type) >= 0;
            });
            this.dataSourceList = [this.dataSource];
        },
        async loadClusters() {
            try {
                const resp = await axios.get(`${standUrl}/clusters?enabled=true&platform=${this.targetPlatform}`)
                this.clusters = resp.data.data;
            } catch (ex) {
                this.error(ex);
            }
        },
        async saveWorkflow() {
            this.workflowObj.visualization.forms = this.visualizationObj;
            let cloned = structuredClone(this.workflowObj);
            if (!cloned.filter.forms.formula || cloned.filter.forms.formula.value === null || cloned.filter.forms.formula.value.length === 0) {
                cloned.tasks = cloned.tasks.filter(t => t !== cloned.filter);
            }
            if (!cloned.sort.forms.order_by || !Array.isArray(cloned.sort.forms.order_by.value)) {
                cloned.tasks = cloned.tasks.filter(t => t !== cloned.sort);
            }
            let url = `${tahitiUrl}/workflows/${cloned.id}`;

            cloned.platform_id = META_PLATFORM_ID;

            cloned.tasks.forEach((task) => {
                task.operation = { id: task.operation.id };
                delete task.version;
                delete task.step;
                delete task.status;
            });
            delete cloned.readData
            delete cloned.sort
            delete cloned.visualization
            delete cloned.sample
            delete cloned.filter

            try {
                await axios.patch(url, cloned, { headers: { 'Content-Type': 'application/json' } });
                this.isDirty = false;
                this.success(this.$t('messages.savedWithSuccess', { what: this.$tc('titles.workflow') }));
            } catch (e) {
                this.error(e);
            }
        },
        handleUpdateFilter(field, value) {
            this.workflowObj.filter.forms.formula.value = value;
        },
        async loadData() {
            this.loadingData = true;
            Object.assign(this.workflowObj.visualization.forms, this.visualizationObj);
            if (this.workflowObj.sort.forms.order_by.value === 'asc' ||
                this.workflowObj.sort.forms.order_by.value === null) {
                this.workflowObj.sort.enabled = false;
            }
            const cloned = JSON.parse(JSON.stringify(this.workflowObj));
            cloned.platform_id = cloned.platform.id; //FIXME: review

            cloned.tasks.forEach((task) => {
                // Remove unnecessary attributes from operation
                task.operation = { id: task.operation.id };
                delete task.version;
            });

            const body = {
                workflow: cloned,
                cluster: { id: cloned.preferred_cluster_id },
                name: `## vis explorer ${this.workflowObj.id} ##`,
                user: this.$store.getters.user, //: { id: user.id, login: user.login, name: user.name },
                persist: false, // do not save the job in db.
                app_configs: {
                    verbosity: 0,
                    target_platform: 'scikit-learn',
                    variant: 'polars'
                },
            }

            try {
                const response = await axios.post(`${standUrl}/jobs`, body,
                    { headers: { 'Locale': this.$root.$i18n.locale, } })
                this.job = response.data.data;
                this.connectWebSocket();
            } catch (ex) {
                if (ex.data) {
                    this.error(ex.data.message);
                } else if (ex.status === 0) {
                    this.$root.$refs.toastr.e(`Error connecting to the backend (connection refused).`);
                } else {
                    this.error(`Unhandled error: ${ex}`);
                }
            } finally {
                this.$Progress.finish();
            }
        },
        disconnectWebSocket() {
            if (this.socket) {
                this.socket.emit('leave', { room: this.job.id });
                this.socket.close();
            }
        },
        /* WebSocket Handling */
        connectWebSocket() {
            if (this.socket === null) {
                const opts = { upgrade: true };
                if (standSocketIoPath !== '') {
                    opts['path'] = standSocketIoPath;
                }
                const socket = io(
                    `${standSocketServer}${standNamespace}`, opts);

                this.socket = socket;
                socket.on('connect', () => { socket.emit('join', { cached: false, room: this.job.id }); });
                socket.on('update task', (msg, callback) => {// eslint-disable-line no-unused-vars
                    if (msg.type === 'PLOTLY') {
                        const messageJson = msg.message;
                        this.plotlyData = messageJson;
                    }
                });
                socket.on('update job', msg => {
                    this.jobStatus = '';
                    if (msg.status === 'ERROR') {
                        this.error(msg);
                        this.loadingData = false;
                    }
                    if (msg.status === 'COMPLETED') {
                        this.jobStatus = msg.message;
                        this.loadingData = false;
                    }
                });
            } else {
                //self.socket.emit('join', { room: self.job.id });
            }
        }

    }
}

</script>

<style scoped lang="scss">
.chart {
    margin-top: 10px;
    position: relative;
    height: 70vh;
    width: 100%;
    padding: 5px 0;
}

#chart-builder {
    width: 100%;
    height: calc(100vh - 110px);
    display: flex;

    .visualization-builder {
        width: 550px;
    }

    /*
        .datasource {
            overflow: auto;
            width: 250px;
            padding-right: 1rem;
            border-right: 1px solid rgba(black, .08);
        }

        .options {
            width: 300px;
            padding: 0 2rem;

            .type-selector {
                margin-bottom: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(black, .08);
            }
        }*/

    .visualization {
        width: 100%;
        display: flex;
        flex-direction: column;

        div {
            width: 100%;
        }

        .chart {
            height: 100%;
        }
    }
}

.options-visualization {
    flex: 0 0 250px;
    background-color: #fff;
    padding: 0px;
}

.options-container {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    gap: 10px;
    height: 100vh;
}

.options-main {
    flex: 3;
}

.visualization-form {
    font-size: .8em;
}

.chart-builder-visualization {
    //height: 600px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}

.chart-not-available {
    background-color: #fff;
    border: 1px solid rgba(#000, .08);
    padding: 1rem;
    margin: 0;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: bold;
    color: rgba(#000, .2);
}
</style>
