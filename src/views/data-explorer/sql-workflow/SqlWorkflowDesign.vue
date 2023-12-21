<template>
    <div class="options-container  source-code-pro-font" ref="visualizationDesigner">
        <div class="options-visualization mt-1">
            <div>
                <h5>Fluxo de trabalho em SQL</h5>
                <form class="clearfix visualization-form">
                    <div data-test="basic-options-section">
                        <label>{{ $tc('common.name') }}:</label>
                        <input v-model="workflowObj.name" type="text" class="form-control form-control-sm"
                            :placeholder="$tc('common.name')" maxlength="100">

                        <vue-select v-if="workflowObj && workflowObj.readData"
                            v-model="workflowObj.readData.forms.data_source.value" :filterable="false"
                            :options="dataSourceList" :reduce="(opt) => opt.id" label="name" @search="loadDataSourceList"
                            @input="getAttributeList">
                            <template #no-options="{ }">
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

                        <label class="mt-3">{{ $tc('titles.cluster') }}: </label>
                        <v-select v-model="workflowObj.preferred_cluster_id" :options="clusters" label="name"
                            :reduce="(opt) => opt.id" :taggable="false" :close-on-select="true" :filterable="false">
                            <template #option="{ description, name }">
                                {{ name }}<br>
                                <small><em>{{ description }}</em></small>
                            </template>
                        </v-select>
                        <label for="" class="mt-3">Fontes de dados:</label> &nbsp;
                        <ul class="list-group">
                            <li v-for="dataSource in workflowObj.dataSources" class="list-group-item">
                                {{ dataSource.forms.data_source.labelValue }}
                                <br />
                                <small>Apelido: <span class="text-info">{{ dataSource.name }}</span></small>
                            </li>
                        </ul>
                    </div>
                    <div class="border-top mt-2">
                        <b-button variant="primary" size="sm" class="mt-2" @click="saveWorkflow" data-test="save">
                            <font-awesome-icon icon="fa fa-save" /> {{ $t('actions.save') }}
                        </b-button>
                    </div>
                </form>
            </div>
        </div>
        <div class="options-main pt-2">
            <h4>Comandos</h4>
            <div>
                <div v-for="sql, i in workflowObj.sqls" class="mb-4" :key="sql.id">
                    <div class="btn-group" role="group">
                        <button v-if="i < workflowObj.sqls.length - 1" class="btn btn-sm btn-secondary"
                            :title="$t('actions.moveDown')" @click="handleMoveSql(i, 'down')"><font-awesome-icon
                                icon="fa fa-caret-down" /></button>
                        <div class="alert alert-dark m-0 px-0"></div>
                        <button v-if="i > 0" class="btn btn-sm btn-secondary" :title="$t('actions.moveUp')"
                            @click="handleMoveSql(i, 'up')"><font-awesome-icon icon="fa fa-caret-up" /></button>
                        <div class="alert alert-dark m-0 px-0"></div>
                        <button class="btn btn-sm btn-danger" :title="$t('actions.delete')"
                            @click="handleRemoveSql(i)"><font-awesome-icon icon="fa fa-times" /></button>
                        <div class="alert alert-dark m-0 px-0"></div>
                        <button class="btn btn-sm btn-primary" :title="$t('actions.add')" @click="handleAddSql(i)">
                            <font-awesome-icon icon="fa fa-plus" /></button>
                        <div class="alert alert-dark m-0 px-0"></div>
                        <button class="btn btn-sm btn-success" :title="$t('actions.execute')">
                            <font-awesome-icon icon="fa fa-play" /></button>
                    </div>
                    <div style="width:75vw; overflow-x: hidden;">
                        <sql-editor :command="sql.forms.query.value" @update="(v) => sql.forms.query.value = v"
                            ref="codeEditor" :tables="dataSources" />

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
import { ref, computed, onBeforeMount } from "vue";
import SqlEditor from './SqlEditor.vue';

import { debounce } from "../../../util.js";
import Vue from 'vue';
import axios from 'axios';
import VueSelect from 'vue-select';
import io from 'socket.io-client';

import { getCurrentInstance } from 'vue';

import useNotifier from '../../../composables/useNotifier.js';
import useDataSource from '../../../composables/useDataSource.js';

import { Operation, SqlBuilderWorkflow } from '../entities.js';

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
const dataSources = ref([]);
const clusterId = ref(null);
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
const codeEditor = ref()

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
        let resp = await axios.get(`${tahitiUrl}/workflows/${internalWorkflowId.value}`);
        workflowObj.value = new SqlBuilderWorkflow(resp.data, operationsMap.value);
        if (workflowObj.value.type !== 'SQL') {
            error(null, i18n.$t('modelBuilder.invalidType')); //FIXME: add message
            router.push({ name: 'index-explorer' });
            return;
        }
        for (let ds of workflowObj.value.dataSources) {
            const dataSource = await loadDataSource(ds.forms.data_source.value); //FIXME
            dataSources.value.push(
                {
                    name: dataSource.name,
                    alias: ds.name,
                    attributes: dataSource.attributes.map(a => a.name),
                });
        }

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

const dataSourceList = ref([]);

const loadDataSource = async (id) => {
    const f = 'id,name,attributes';
    const resp = await axios.get(`${limoneroUrl}/datasources/${id}?fields=${f}`);
    return resp.data;
};
const getDataSourceNames = computed({
    get: () => {
        return workflowObj.value.dataSources.map(d => d.name);
    }
})
const loadClusters = async () => {
    try {
        const resp = await axios.get(`${standUrl}/clusters?enabled=true&platform=${targetPlatform.value}`);
        clusters.value = resp.data.data;
    } catch (ex) {
        error(ex);
    }
};
const saveWorkflow = async () => {
    let cloned = structuredClone(workflowObj.value);

    let url = `${tahitiUrl}/workflows/${cloned.id}`;

    cloned.platform_id = META_PLATFORM_ID;

    cloned.tasks.forEach((task) => {
        task.operation = { id: task.operation.id };
        delete task.version;
        delete task.step;
        delete task.status;
    });
    delete cloned._tasksLookup;
    cloned.tasks = [...cloned.dataSources, ...cloned.sqls];
    delete cloned.dataSources;
    delete cloned.sqls;

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
/**Events */
const handleAddSql = (index) => {
    workflowObj.value.addSqlTask(index);
    Vue.nextTick(() => {
        codeEditor.value.slice(-1)[0].focus()
    });
}
const handleRemoveSql = (index) => {
    if (confirm(i18n.$t('messages.doYouWantToDelete'))) {
        workflowObj.value.removeSqlTask(index);
    }
}
const handleMoveSql = (index, direction) => {
    workflowObj.value.moveSqlTask(index, direction);
}
</script>

<style>
.cm-content {
    border: 1px #ddd solid;
}
</style>
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
