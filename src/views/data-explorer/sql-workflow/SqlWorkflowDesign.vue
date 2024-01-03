<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1>{{ $t('titles.sqlWorkflow') }}</h1>
            <b-button variant="primary" size="sm" class="mt-2 pu" @click="saveWorkflow" data-test="save">
                <font-awesome-icon icon="fa fa-save" /> {{ $t('actions.save') }}
            </b-button>
        </div>
        <div class="layout-container source-code-pro-font">
            <div class="layout">
                <div>
                    <form class="clearfix">
                        <div data-test="basic-options-section">
                            <label>{{ $tc('common.name') }}:</label>
                            <input v-model="workflowObj.name" type="text" class="form-control form-control-sm"
                                :placeholder="$tc('common.name')" maxlength="100">

                            <b-form-checkbox v-if="workflowObj" v-model="workflowObj.forms.$meta.value.use_hwc" class="mt-3"
                                value="true" unchecked-value="false">
                                Usar o Hive Warehouse Connector
                            </b-form-checkbox>
                            <label class="mt-3">{{ $tc('titles.cluster') }}: </label>
                            <v-select v-model="workflowObj.preferred_cluster_id" :options="clusters" label="name"
                                :reduce="(opt) => opt.id" :taggable="false" :close-on-select="true" :filterable="false">
                                <template #option="{ description, name }">
                                    {{ name }}<br>
                                    <small><em>{{ description }}</em></small>
                                </template>
                            </v-select>
                            <label for="" class="mt-3">{{ $tc('titles.dataSource', 2) }} ({{ workflowObj.dataSources?.length
                            }}):</label> &nbsp;
                            <button class="btn btn-sm btn-secondary mt-2 float-right" :title="$t('actions.add')"
                                @click.prevent="handleAddDataSource" :disabled="addingDataSource">
                                <font-awesome-icon icon="fa fa-plus" /> {{ $tc('titles.dataSource', 1) }}</button>
                            <div v-if="addingDataSource" class="mt-2">
                                <label>Escolha uma fonte de dados</label>
                                <vue-select :filterable="false" :options="dataSourceList" :reduce="(opt) => opt.id"
                                    label="name" @search="loadDataSourceList" @input="handleAddDataSource">
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
                                <div class="mt-2">
                                    <button class="btn btn-sm ml-1 btn-secondary" :title="$t('actions.cancel')"
                                        @click.prevent="addingDataSource = false"> {{ $t('actions.cancel') }}</button>
                                </div>
                            </div>
                            <ul class="list-group data-sources mt-2 scroll-area">
                                <li v-for="dataSource in workflowObj.dataSources" class="list-group-item p-2 pb-1 pt-1">
                                    <div class="mb-2 truncate" :title="dataSource.forms.data_source.labelValue">{{
                                        dataSource.forms.data_source.labelValue }}</div>
                                    <small>Apelido:</small>
                                    <input type="text" class="form-control form-control-sm w-75 float-right mb-1"
                                        v-model="dataSource.name" maxlength="50" @change="handleChangeAlias" />
                                    <div class="float-left">
                                        <button class="btn btn-sm text-danger" :title="$t('actions.delete')"
                                            @click.prevent="handleRemoveDataSource(dataSource.id)"><font-awesome-icon
                                                icon="fa fa-times" /></button>
                                        <button :title="$t('common.preview')" class="btn btn-sm"
                                            @click.prevent="handlePreview(dataSource.forms.data_source.value)">
                                            <font-awesome-icon icon="fa-eye" />
                                        </button>
                                        <button title="Criar SELECT para fonte de dados" class="btn btn-sm btn-light"
                                            @click.prevent="handleAddSqlFromDataSource('select', dataSource.forms.data_source.value)">
                                            SELECT
                                        </button>
                                        <button title="Criar INSERT para fonte de dados" class="btn btn-sm btn-light ml-1"
                                            @click.prevent="handleAddSqlFromDataSource('insert', dataSource.forms.data_source.value)">
                                            INSERT
                                        </button>
                                    </div>
                                </li>
                            </ul>

                        </div>
                    </form>
                </div>
            </div>
            <div class="layout-center pt-2">
                <h4>Comandos ({{ workflowObj.sqls?.length }})</h4>
                <div class="scroll-area commands">
                    <transition-group name="fade" @after-enter="handleCodeAppear">
                        <div v-for="sql, i in workflowObj.sqls" class="mb-1 editors" :key="sql.id">
                            <div>
                                Nome: <input class="form-control form-control-sm mb-1" maxlength="50" v-model="sql.name" />
                            </div>
                            <div class="button-toolbar">
                                <sql-editor-toolbar ref="toolbar" :task="sql" :show-move-up="i > 0" :data-task="sql.id"
                                    :show-move-down="i < workflowObj.sqls.length - 1" @on-move="handleMoveSql"
                                    @on-remove="handleRemoveSql" @on-add="handleAddSql" @on-indent="handleIndent(sql.id)" />
                            </div>
                            <div class="editor">
                                <sql-editor :query="sql.forms.query.value" @update="(v) => sql.forms.query.value = v"
                                    ref="codeEditor" :tables="dataSources" :functions="functions" :data-task="sql.id"
                                    :format="{ language: 'spark', tabWidth: 2, keywordCase: 'upper', linesBetweenQueries: 2 }" />
                            </div>
                        </div>
                    </transition-group>
                </div>
            </div>
            <div class="layout-help">
                <h4>{{ $t('common.help') }}</h4>
                <sql-editor-help :data-sources="dataSources" :functions="sparkFunctions"
                    :custom-functions="customFunctions" />
            </div>
            <div v-show="loadingData" class="preview-loading">
                <font-awesome-icon icon="lemon" spin class="text-success" />
                {{ i18n.$t('common.wait') }}
            </div>
            <modal-preview-data-source ref="previewWindow" />
        </div>
    </main>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";

import { debounce } from "@/util.js";
import ModalPreviewDataSource from '@/views/modal/ModalPreviewDataSource.vue';
import axios from 'axios';
import io from 'socket.io-client';
import Vue from 'vue';
import VueSelect from 'vue-select';
import SqlEditor from './SqlEditor.vue';
import SqlEditorHelp from './SqlEditorHelp.vue';
import SqlEditorToolbar from './SqlEditorToolbar.vue';

import { getCurrentInstance } from 'vue';

import useDataSource from '@/composables/useDataSource.js';
import useNotifier from '@/composables/useNotifier.js';

import { SqlBuilderWorkflow } from '../entities.js';

const vm = getCurrentInstance();
const router = vm.proxy.$router;
const route = vm.proxy.$route;

const progress = vm.proxy.$Progress;
//const store = vm.proxy.$store;
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
const storages = ref([]);
const dataSources = ref([]);
const cachedDataSources = ref([]);
const clusterId = ref(null);
const internalWorkflowId = ref(null);
const job = ref(null);
const jobStatus = ref(null);
const loaded = ref(false);
const loadingData = ref(false);
const socketIo = ref(null); // used by socketio (web sockets)
const targetPlatform = ref(4);
const workflowObj = ref({ forms: { $meta: { value: { target: '', taskType: '' } } } });

const sparkFunctions = [
    'abs', 'add_months', 'approx_count_distinct', 'approx_percentile', 'bround',
    'cast', 'ceil', 'avg',
    'char_length', 'coalesce', 'collect_list', 'collect_set',
    'count',
    'concat', 'concat_ws', 'contains', 'current_date',
    'current_timestamp', 'date_add',
    'date_diff', 'date_format', 'date_from_unix_date',
    'date_part', 'date_sub', 'date_trunc',
    'day', 'dayofmonth', 'dayofweek',
    'dayofyear', 'endswith', 'exp',
    'floor', 'format_number', 'format_string',
    'from_unixtime', 'from_utc_timestamp',
    'ifnull', 'ilike',
    'initcap', 'instr', 'int', 'isnan', 'isnotnull',
    'isnull', 'last', 'last_day', 'lcase', 'lead',
    'least', 'left', 'len', 'length',
    'ln', 'localtimestamp', 'locate', 'log', 'log10',
    'log2', 'lower', 'lpad', 'ltrim',
    'mask', 'max', 'max_by', 'md5', 'mean', 'median', 'min',
    'min_by', 'minute', 'mod', 'mode',
    'month', 'months_between',
    'next_day', 'now', 'nullif', 'pi',
    'power', 'quarter', 'radians', 'rand', 'randn',
    'random', 'regexp', 'regexp_count',
    'regexp_extract', 'regexp_extract_all', 'regexp_instr',
    'regexp_like', 'regexp_replace', 'regexp_substr', 'repeat',
    'replace', 'reverse', 'right', 'rint', 'rlike', 'round',
    'row_number', 'rpad', 'rtrim', 'sec', 'second', 'sequence',
    'sha', 'sign', 'signum', 'size', 'soundex',
    'split', 'split_part', 'sqrt', 'startswith',
    'substring', 'substring_index', 'sum',
    'timestamp',
    'timestamp_millis', 'timestamp_seconds',
    'to_timestamp', 'to_timestamp_ltz', 'to_timestamp_ntz',
    'to_unix_timestamp', 'to_utc_timestamp', 'translate',
    'trim', 'trunc', 'ucase', 'unix_date',
    'unix_millis', 'unix_seconds', 'unix_timestamp',
    'upper', 'url_decode', 'url_encode', 'weekday', 'weekofyear',
    'when', 'year', 'zip_with',];

const customFunctions = ['trata_cnpj', 'remove_acento'];
const functions = [...customFunctions, ...sparkFunctions]

/* Control dirty state */
const isDirty = ref(false);
const confirmMsg = i18n.$t('warnings.dirtyCheck');

window.onbeforeunload = function () {
    if (isDirty.value) {
        return confirmMsg;
    }
}
router.beforeEach(function (to, from, next) {
    if (!isDirty.value || (confirm(confirmMsg))) {
        isDirty.value = false;
        next();
    } else {
        next(false);
    }
});

// Elements refs
const cluster = ref(null);
const codeEditor = ref();
const previewWindow = ref();

onBeforeMount(async () => {
    disconnectWebSocket();
    internalWorkflowId.value = (route) ? route.params.id : 0;
    await load();
});

const updateDataSources = async (useCached) => {
    dataSources.value = [];
    if (useCached) {
        for (let wfDs of workflowObj.value.dataSources) {
            const dataSource = cachedDataSources.value.find(d => d.id === wfDs.forms.data_source.value);
            dataSources.value.push(
                {
                    id: wfDs.id,
                    dataSourceId: wfDs.forms.data_source.value,
                    name: dataSource.name,
                    alias: wfDs.name,
                    attributes: dataSource.attributes,
                });
        }
    } else {
        for (let wfDs of workflowObj.value.dataSources) {
            const dataSource = await loadDataSource(wfDs.forms.data_source.value);
            dataSources.value.push(
                {
                    id: wfDs.id,
                    dataSourceId: wfDs.forms.data_source.value,
                    name: dataSource.name,
                    alias: wfDs.name,
                    attributes: dataSource.attributes,
                });
            cachedDataSources.value.push(dataSource);
        }
    }
}

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
        if (!workflowObj.value.forms) {
            workflowObj.value.forms = { '$meta': { value: {} } };
        }
        updateDataSources(false);
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
const handleAddSql = (taskId, command) => {
    workflowObj.value.addSqlTask(taskId, command);
    Vue.nextTick(() => {
        codeEditor.value.slice(-1)[0].focus()
    });
    isDirty.value = true;
}
const handleRemoveSql = (taskId) => {
    if (confirm(i18n.$t('messages.doYouWantToDelete'))) {
        workflowObj.value.removeTask(taskId);
        isDirty.value = true;
    }
}
const handleMoveSql = (taskId, direction) => {
    workflowObj.value.moveSqlTask(taskId, direction);
}
/* Data source related */
const addingDataSource = ref(false);
const dataSourceList = ref([]);
const loadDataSource = async (id) => {
    const f = 'id,name,attributes';
    const resp = await axios.get(`${limoneroUrl}/datasources/${id}?fields=${f}`);
    return resp.data;
};
const { asyncLoadDataSourceList } = useDataSource();

const loadDataSourceList = debounce(async function (search, loading) {
    if (search) {
        dataSourceList.value = await asyncLoadDataSourceList(search, loading);
    }
}, 800);

const handleAddDataSource = async (dataSourceId) => {
    if (addingDataSource.value) {
        const ds = await loadDataSource(dataSourceId);
        workflowObj.value.addDataSourceTask(dataSourceId, ds.name);
        updateDataSources(true);
        isDirty.value = true;
    }
    addingDataSource.value = !addingDataSource.value;
}
const handleRemoveDataSource = (taskId) => {
    if (confirm(i18n.$t('messages.doYouWantToDelete'))) {
        workflowObj.value.removeTask(taskId);
        dataSources.value = dataSources.value.filter(ds => ds.id !== taskId);
    }
    isDirty.value = true;
}
const handlePreview = (dataSourceId) => {
    previewWindow.value.show(dataSourceId);
}
const handleAddSqlFromDataSource = (type, dataSourceId) => {
    const ds = dataSources.value.find(ds => ds.dataSourceId === dataSourceId);
    if (ds && ds.attributes.length > 0) {
        const cmd = [];
        if (type === 'select') {
            cmd.push('SELECT')
            for (const attr of ds.attributes.slice(0, -1)) {
                cmd.push(`   ${ds.alias}.${attr.name},`)
            }
            cmd.push(`   ${ds.alias}.${ds.attributes.slice(-1)[0].name}`);
            cmd.push(`FROM ${ds.alias}`)
        } else if (type === 'insert') {
            cmd.push(`INSERT INTO ${ds.alias}(`)
            for (const attr of ds.attributes.slice(0, -1)) {
                cmd.push(`   ${attr.name},`)
            }
            cmd.push(`   ${ds.attributes.slice(-1)[0].name}`);
            cmd.push(')')
            cmd.push('VALUES()')
        }
        handleAddSql(null, cmd.join('\n'));
    }
}
const handleChangeAlias = () => {
    isDirty.value = true;
    updateDataSources(true);
}
const toolbar = ref();

const handleIndent = (taskId) => {
    const currentToolbar = toolbar.value.find(el => el.$el.dataset.task === taskId);
    const currentEditor = codeEditor.value.find(el => el.$el.dataset.task === taskId);
    if (currentToolbar && currentEditor) {
        currentToolbar.showStatus('código formatado');
        currentEditor.indent();
    }
}
const handleCodeAppear = (el, done) => {
    el.scrollIntoView({ behavior: "smooth" });

}
</script>

<style scoped lang="scss">
.layout-container {
    display: flex;
    gap: 10px;
    /*height: 85vh;*/
}

.layout,
.layout-help {
    flex: 0 0 300px;
    background-color: #fcfcfc;
    padding: 15px;
    border: 1px solid #dfdfdf;
    border-radius: 2px;
    margin-top: 10px;
}

.layout-center {
    margin-top: 10px;
    border: 1px solid #dfdfdf;
    border-radius: 2px;
    display: block;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
    align-self: auto;
    order: 0;
    padding: 10px;
}

.commands {
    max-height: 75vh;
    overflow-y: auto;
}

.data-sources {
    max-height: 50vh;
    overflow-y: auto;
}

.button-toolbar {
    background-color: #f3f3f3;
    border-radius: 2px;
    display: flex;
    justify-content: end;
    padding-bottom: 5px;
}

.truncate {
    width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: .9em;
}

.editors {
    background-color: #f3f3f3;
    padding: 10px;
}

.editors .editor {
    background: white;
    width: 100%;
    overflow-x: hidden;
}
</style>
