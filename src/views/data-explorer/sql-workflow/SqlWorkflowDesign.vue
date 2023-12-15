<template>
    <div class="options-container  source-code-pro-font" ref="visualizationDesigner">
        <div class="options-visualization mt-1">
            <div>
                <h6>Fluxo de trabalho em SQL</h6>
                <form class="clearfix visualization-form">
                    <div data-test="basic-options-section">
                        <label>{{ $tc('common.name') }}:</label>
                        <input v-model="workflowObj.name" type="text" class="form-control form-control-sm"
                            :placeholder="$tc('common.name')" maxlength="100">

                        <label for="">Fontes de dados:</label> &nbsp;
                        <vue-select v-if="workflowObj && workflowObj.readData"
                            v-model="workflowObj.readData.forms.data_source.value" :filterable="false"
                            :options="dataSourceList" :reduce="(opt) => opt.id" label="name" @search="loadDataSourceList"
                            @input="getAttributeList">
                            <template #no-options="{}">
                                <small>Digite parte do nome pesquisar ...</small>
                            </template>
                            <template #option="option">
                                <div class="d-center">
                                    <span class="span-id">{{ option.id }}</span> - {{ option.name }}
                                </div>
                            </template>
                            <template #selected-option="option">
                                <div class="selected d-center">
                                    {{ option.id }} - {{ option.name }}
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
                    </div>
                </form>
            </div>
        </div>
        <div class="options-main pt-2">
            <h4>Comandos</h4>
            <div>
                <div v-for="sql in sqls" class="mb-4">
                    <div>
                        <sql-editor :command="sql.command"/>
                        {{ sql.command }}
                    </div>
                    <div class="pt-2 pb-1">
                        <button class="btn btn-sm btn-primary mr-1">Move</button>
                        <button class="btn btn-sm btn-primary mr-1">Move</button>
                        <button class="btn btn-sm btn-primary mr-1">Remove</button>
                        <button class="btn btn-sm btn-primary mr-1">Add</button>
                        <button class="btn btn-sm btn-primary mr-1">Execute</button>
                    </div>
                </div>
            </div>

            <div v-show="loadingData" class="preview-loading">
                <font-awesome-icon icon="lemon" spin class="text-success" />
                {{ i18n.$t('common.wait') }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, shallowRef, computed, onBeforeMount, onMounted, onUnmounted } from "vue";
import SqlEditor from './SqlEditor.vue';

import { debounce } from "../../../util.js";
import Vue from 'vue';
import axios from 'axios';
import VueSelect from 'vue-select';
import io from 'socket.io-client';

import { getCurrentInstance } from 'vue';

import useNotifier from '../../../composables/useNotifier.js';
import useDataSource from '../../../composables/useDataSource.js';

import { Operation, Workflow, SqlBuilderWorkflow } from '../entities.js';

const vm = getCurrentInstance();
const router = vm.proxy.$router;
const route = vm.proxy.$route;

const progress = vm.proxy.$Progress;
const store = vm.proxy.$store;
const i18n = vm.proxy.$i18n.vm;

const { success, error } = useNotifier(vm.proxy);

const operationsMap = ref(new Map());
/**/
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
const tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const standUrl = import.meta.env.VITE_STAND_URL;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;
/**/

const META_PLATFORM_ID = 1000;
const clusters = ref([]);
const clusterId = ref(null);
const dataSources = ref(null);
const internalWorkflowId = ref(null);
const isDirty = ref(false);
const job = ref(null);
const jobStatus = ref(null);
const loaded = ref(false);
const loadingData = ref(false);
const socketIo = ref(null); // used by socketio (web sockets)
const targetPlatform = ref(4);
const workflowObj = ref({ forms: { $meta: { value: { target: '', taskType: '' } } } });

// Elements refs
const cluster = ref(null)
const visualizationDesigner = ref(ref)

const sqls = ref([
    {command: "select * from tb"},
    {command: "select max(id) from tb2"},
    {command: "select now()"},
]);


const dataSourceId = computed({
    get() { return workflowObj.value.readData.forms.data_source.value; },
    set(newValue) { workflowObj.value.readData.forms.data_source.value = newValue; }
});
const { getAttributeList, asyncLoadDataSourceList } = useDataSource();

const loadDataSourceList = debounce(async function (search, loading) {
    if (search) {
        dataSourceList.value = await asyncLoadDataSourceList(search, loading);
    }
}, 800);

onBeforeMount(async () => {
    disconnectWebSocket();
    internalWorkflowId.value = (route) ? route.params.id : 0;
    await load();
});


const load = async () => {
    loadingData.value = true;
    progress.start();
    try {
        await loadOperations();
        let resp = await axios.get(`${tahitiUrl}/workflows/${internalWorkflowId.value}`);
        workflowObj.value = new SqlBuilderWorkflow(resp.data, operationsMap.value);
        if (workflowObj.value.type !== 'SQL') {
            error(null, i18n.$t('modelBuilder.invalidType')); //FIXME: add message
            router.push({ name: 'index-explorer' });
            return;
        }
        //await loadDataSource(dataSourceId.value); //FIXME
        
        loadClusters();
        loaded.value = true;

    } catch (e) {
        error(e);
        router.push({ name: 'index-explorer' });
    } finally {
        Vue.nextTick(() => {
            progress.finish();
            loadingData.value = false;
            isDirty.value = false;
        });
    }
};
const loadOperations = async () => {
    const params = {
        category: 'visualization-builder', platform: META_PLATFORM_ID,
        fields: 'id,forms,categories,name,slug'
    };

    const resp = await axios.get(`${tahitiUrl}/operations`, { params });
    resp.data.data.forEach(op => operationsMap.value.set(op.slug, new Operation(op)));
};
const dataSourceList = ref([]);

const loadDataSource = async (id) => {
    const resp = await axios.get(`${limoneroUrl}/datasources/${id}`);
    dataSource.value = resp.data;
    attributes.value = dataSource.value.attributes.sort((a, b) => a.name.localeCompare(b.name));
    attributes.value.forEach(a => {
        a.attribute = a.name;
        a.numeric = ['DECIMAL', 'INTEGER', 'DOUBLE', 'FLOAT', 'LONG']
            .includes(a.type);
        a.integerType = ['INTEGER', 'LONG'].includes(a.type);
    });
    dataSourceList.value = [dataSource.value];
};
const loadClusters = async () => {
    try {
        const resp = await axios.get(`${standUrl}/clusters?enabled=true&platform=${targetPlatform.value}`);
        clusters.value = resp.data.data;
    } catch (ex) {
        error(ex);
    }
};
const saveWorkflow = async () => {
    workflowObj.value.visualization.forms = visualizationObj.value;
    let cloned = structuredClone(workflowObj.value);

    if (!cloned.visualization.forms.filter || cloned.visualization.forms.filter.value === null
        || cloned.visualization.forms.filter.value.length === 0) {
        cloned.tasks = cloned.tasks.filter(t => t !== cloned.filter);
    } else {
        // Copy filter from visualization to correct operation
        cloned.filter.forms.formula = structuredClone(cloned.visualization.forms.filter);
    }
    if (!cloned.sort.forms.order_by || !Array.isArray(cloned.sort.forms.order_by.value)) {
        cloned.tasks = cloned.tasks.filter(t => t !== cloned.sort);
    }
    //cloned.forms = { $meta: { plot: plotlyData.value } };
    let url = `${tahitiUrl}/workflows/${cloned.id}`;

    cloned.platform_id = META_PLATFORM_ID;

    cloned.tasks.forEach((task) => {
        task.operation = { id: task.operation.id };
        delete task.version;
        delete task.step;
        delete task.status;
    });
    delete cloned.readData;
    delete cloned.sort;
    delete cloned.visualization;
    delete cloned.sample;
    delete cloned.filter;

    try {
        await axios.patch(url, cloned, { headers: { 'Content-Type': 'application/json' } });
        isDirty.value = false;
        success(i18n.$t('messages.savedWithSuccess', { what: i18n.$t('titles.workflow') }));
    } catch (e) {
        error(e);
    }
};
const handleUpdateFilter = (field, value) => {
    workflowObj.value.filter.forms.formula.value = value;
};
const loadData = async () => {
    if (!workflowObj.value.preferred_cluster_id) {
        error(`${i18n.$t('errors.missingRequiredValue')}: ${i18n.$t('workflow.preferredCluster')}`);
        return;
    }
    loadingData.value = true;
    Object.assign(workflowObj.value.visualization.forms, visualizationObj.value);
    if (workflowObj.value.sort.forms.order_by.value === 'asc' ||
        workflowObj.value.sort.forms.order_by.value === null) {
        workflowObj.value.sort.enabled = false;
    }
    const cloned = JSON.parse(JSON.stringify(workflowObj.value));
    cloned.platform_id = cloned.platform.id; //FIXME: review
    const filterTask = cloned.tasks.find(t => t.operation.slug === 'filter');
    const visualizationTask = cloned.tasks.find(t => t.operation.slug === 'visualization');
    if (!cloned.visualization.forms.filter || cloned.visualization.forms.filter.value === null
        || cloned.visualization.forms.filter.value.length === 0) {
        cloned.tasks = cloned.tasks.filter(t => t !== cloned.filter);
    } else {
        // Copy filter from visualization to correct operation
        filterTask.forms.formula = structuredClone(visualizationTask.forms.filter);
    }

    cloned.tasks.forEach((task) => {
        // Remove unnecessary attributes from operation
        task.operation = { id: task.operation.id };
        delete task.version;
    });

    const body = {
        workflow: cloned,
        cluster: { id: cloned.preferred_cluster_id },
        name: `## vis explorer ${workflowObj.value.id} ##`,
        user: store.getters.user, //: { id: user.id, login: user.login, name: user.name },
        persist: false, // do not save the job in db.
        app_configs: {
            verbosity: 0,
            target_platform: 'scikit-learn',
            variant: 'polars'
        },
    };

    try {
        const response = await axios.post(`${standUrl}/jobs`, body,
            { headers: { 'Locale': i18n.locale, } });
        job.value = response.data.data;
        connectWebSocket();
    } catch (ex) {
        if (ex.data) {
            error(ex.data.message);
        } else if (ex.status === 0) {
            this.$root.$refs.toastr.e(`Error connecting to the backend (connection refused).`);
        } else {
            error(`Unhandled error: ${ex}`);
        }
    } finally {
        progress.finish();
    }
};
/* WebSocket Handling */
const disconnectWebSocket = () => {
    if (socketIo.value) {
        socketIo.value.emit('leave', { room: job.value.id });
        socketIo.value.close();
    }
};

const connectWebSocket = () => {
    if (socketIo.value === null) {
        const opts = { upgrade: true };
        if (standSocketIoPath !== '') {
            opts['path'] = standSocketIoPath;
        }
        const socket = io(
            `${standSocketServer}${standNamespace}`, opts);

        socketIo.value = socket;
        socket.on('connect', () => { socket.emit('join', { cached: false, room: job.value.id }); });
        socket.on('update task', (msg, callback) => {// eslint-disable-line no-unused-vars
            if (msg.type === 'PLOTLY') {
                const messageJson = msg.message;
                plotlyData.value = messageJson;
                plotVersion.value++;
            }
        });
        socket.on('update job', msg => {
            jobStatus.value = '';
            if (msg.status === 'ERROR') {
                error(msg);
                loadingData.value = false;
            }
            if (msg.status === 'COMPLETED') {
                jobStatus.value = msg.message;
                loadingData.value = false;
            }
        });
    } else {
        //self.socket.emit('join', { room: self.job.id });
    }
};

</script>

<style scoped lang="scss">
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
    height: 92vh;
}

.options-main {
    flex: 3;
}
</style>
