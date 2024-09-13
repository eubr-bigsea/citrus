<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1>{{$t('titles.sqlWorkflow')}}</h1>
            <div class="mt-2">
                <router-link v-if="workflowObj.pipeline" :to="{name: 'pipelineEdit', params: {id: workflowObj.pipeline.id}}"
                             class="btn btn-outline-secondary btn-sm mr-1" :title="workflowObj.pipeline.name">
                    <button class="btn btn-secondary btn-sm">
                        <font-awesome-icon icon="fa fa-circle-nodes" />
                        Ir para pipeline #{{workflowObj.pipeline.id}}
                    </button>
                </router-link>
                <b-button variant="outline-secondary" size="sm" title="Usar biblioteca"
                          class="mr-1" @click="handleShowModalCodeLibrary">
                    <font-awesome-icon icon="fa fa-file-code" />
                    Bibliotecas de código <span v-if="workflowObj.forms.code_libraries?.value.length >=0"> ({{workflowObj.forms.code_libraries.value.length}})</span>
                </b-button>

                <b-button variant="outline-dark" size="sm" :title="$t('actions.showVariables')"
                          class="mr-1" @click.prevent="$refs.variablesModal.show()">
                    <font-awesome-icon icon="fa fa-dollar-sign" /> Variáveis
                    <span v-if="workflowObj.variables?.length >=0"> ({{workflowObj.variables?.length}})</span>
                </b-button>

                <b-button variant="primary" size="sm" class="pu mr-1" data-test="save"
                          @click="saveWorkflow">
                    <font-awesome-icon icon="fa fa-save" />
                    {{$t('actions.save')}}
                </b-button>
                <b-button variant="success" size="sm" class="pu" data-test="execute"
                          @click="executeWorkflow">
                    <font-awesome-icon icon="fa fa-play" /> {{$t('actions.execute')}}
                </b-button>
                <b-button v-if="sample" variant="info" size="sm" class="ml-2 pu"
                          data-test="sample"
                          @click="showSample">
                    <font-awesome-icon icon="fa fa-eye" /> Ver dados
                </b-button>
                <b-button variant="danger" size="sm" class="ml-2 pu" data-test="restart"
                          title="Para os recursos alocados e reinicia os executores"
                          @click="stop">
                    <font-awesome-icon icon="fa fa-skull" /> {{$t('actions.stop')}}
                </b-button>
            </div>
        </div>
        <div class="layout-container xsource-code-pro-font">
            <div class="layout">
                <div>
                    <form class="clearfix">
                        <div data-test="basic-options-section">
                            <label>{{$t('common.name')}}:</label>
                            <input v-model="workflowObj.name" type="text" class="form-control form-control-sm"
                                   :placeholder="$t('common.name')" maxlength="100"
                                   title="Apelido usado quando referenciar esta fonte de dados no comando SQL">

                            <b-form-checkbox v-if="workflowObj" v-model="workflowObj.forms.$meta.value.use_hwc"
                                             class="mt-3 " value="true" unchecked-value="false" style="zoom:.9">
                                Usar o Hive Warehouse Connector (HWC)
                            </b-form-checkbox>
                            <label class="mt-3">{{$t('titles.cluster')}}: </label>
                            <v-select ref="clusterRef" v-model="workflowObj.preferred_cluster_id" :options="clusters"
                                      label="name" :reduce="(opt) => opt.id" :taggable="false" :close-on-select="true"
                                      :filterable="false">
                                <template #option="{ description, name }">
                                    {{name}}<br>
                                    <small><em>{{description}}</em></small>
                                </template>
                            </v-select>
                            <label for="" class="mt-3">{{$t('titles.dataSource', 2)}}
                                ({{workflowObj.dataSources?.length}}):</label> &nbsp;
                            <button class="btn btn-sm btn-secondary mt-2 float-right" :title="$t('actions.add')"
                                    :disabled="addingDataSource" @click.prevent="handleAddDataSource">
                                <font-awesome-icon icon="fa fa-plus" /> {{$t('titles.dataSource', 1)}}
                            </button>
                            <div v-if="addingDataSource" class="mt-2">
                                <label>Escolha uma fonte de dados</label>
                                <vue-select :filterable="false" :options="dataSourceList" :reduce="(opt) => opt.id"
                                            label="name" @search="loadDataSourceList" @input="handleAddDataSource">
                                    <template #no-options="{}">
                                        <small>Digite parte do nome pesquisar ...</small>
                                    </template>
                                    <template #option="option">
                                        <div class="d-center">
                                            <span class="span-id">{{option.id}}</span> - {{option.name}}
                                        </div>
                                    </template>
                                    <template #selected-option="option">
                                        <div class="selected d-center">
                                            {{option.id}} - {{option.name}}
                                        </div>
                                    </template>
                                </vue-select>
                                <div class="mt-2">
                                    <button class="btn btn-sm ml-1 btn-secondary" :title="$t('actions.cancel')"
                                            @click.prevent="addingDataSource = false">
                                        {{$t('actions.cancel')}}
                                    </button>
                                </div>
                            </div>
                            <ul class="list-group data-sources mt-2 scroll-area">
                                <li v-for="dataSource in workflowObj.dataSources" :key="dataSource.id" class="list-group-item p-2 pb-1 pt-1">
                                    <div class="mb-2 truncate" :title="dataSource.forms.data_source.labelValue">
                                        {{dataSource.forms.data_source.labelValue}}
                                    </div>
                                    <small>Apelido:</small>
                                    <input v-model="dataSource.name" type="text"
                                           class="form-control form-control-sm w-75 float-right mb-1" maxlength="50" @change="handleChangeAlias">
                                    <div class="float-left">
                                        <button class="btn btn-sm text-danger" :title="$t('actions.delete')"
                                                @click.prevent="handleRemoveDataSource(dataSource.id)">
                                            <font-awesome-icon icon="fa fa-times" />
                                        </button>
                                        <button :title="$t('common.preview')" class="btn btn-sm"
                                                @click.prevent="handlePreview(dataSource.forms.data_source.value)">
                                            <font-awesome-icon icon="fa-eye" />
                                        </button>
                                        <button title="Criar SELECT para fonte de dados" class="btn btn-sm btn-light"
                                                @click.prevent="handleAddSqlFromDataSource('select', dataSource.forms.data_source.value)">
                                            SELECT
                                        </button>
                                        <button title="Criar INSERT para fonte de dados"
                                                class="btn btn-sm btn-light ml-1"
                                                @click.prevent="handleAddSqlFromDataSource('insert', dataSource.forms.data_source.value)">
                                            INSERT
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </form>
                </div>
                <div>
                    <span class="px-3 lemonade-job" :class="jobStatus.status.toLowerCase()">{{jobStatus.status}}</span>
                    {{jobStatus.message}}
                    <div v-if="jobStatus.exception_stack" class="exception-stack scroll-area">
                        <pre class="exception mt-4">{{jobStatus.exception_stack}}</pre>
                    </div>
                </div>
            </div>
            <div class="layout-center pt-2">
                <h4>Comandos ({{workflowObj.cells?.length}})</h4>
                <div v-if="workflowObj.cells?.length === 0">
                    <button class="btn btn-secondary btn-sm" @click="handleAdd(null, 'sql', '\n')">
                        <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.add')}} SQL
                    </button>
                    <button class="btn btn-secondary btn-sm ml-3" @click="handleAdd(null, 'python', '\n')">
                        <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.add')}} Python
                    </button>
                    <blockquote class="blockquote">
                        <p class="mb-0">
                            Nenhum comando ainda.
                        </p>
                        Escolha uma das opções acima para iniciar.
                    </blockquote>
                </div>
                <div class="scroll-area commands pb-5 mb-4">
                    <transition-group name="fade" @after-enter="handleCodeAppear">
                        <div v-for="cell, i in workflowObj.cells" :key="cell.id" class="mb-3 editors"
                             :class="{ 'disabled-cell': !cell.enabled }">
                            <div v-if="cell.operation.slug === 'execute-sql'" class="row" :data-cell="cell.id">
                                <div class="col-12">
                                    <div class="button-toolbar">
                                        <sql-editor-toolbar ref="toolbar" :task="cell" :show-move-up="i > 0"
                                                            :data-task="cell.id" :show-move-down="i < workflowObj.cells.length - 1"
                                                            :use-h-w-c="cell.forms.useHWC.value" @on-move="handleMove"
                                                            @on-remove="handleRemoveSql" @on-add="handleAdd"
                                                            @on-indent="handleIndent(cell.id)"
                                                            @on-execute="(taskId, value) => executeWorkflow(cell.id, value)"
                                                            @on-toggle-use-hwc="handleToggleHWC" />
                                    </div>
                                </div>
                                <div class="col-4"
                                     title="Apelido usado quando referenciar esta fonte de dados no comando SQL">
                                    <span class="form-text">{{$t('common.aliasSql')}} (use no SQL):</span>
                                    <input v-model="cell.name" class="form-control form-control-sm mb-1"
                                           maxlength="50">
                                </div>

                                <div class="col-4">
                                    <span class="form-text">{{$t('titles.comment')}}:</span> <input v-model="cell.forms.comment.value" class="form-control form-control-sm mb-1"
                                                                                                    maxlength="100">
                                </div>
                                <div class="col-2 mt-4">
                                    <b-form-checkbox v-model="cell.enabled" :value="true" :unchecked-value="false">
                                        Habilitado
                                    </b-form-checkbox>
                                </div>
                                <div class="col-2">
                                    <span class="form-text">Tipo:</span>
                                    <input type="text" readonly :value="cell.operation.slug.substring(8)"
                                           class="form-control form-control-sm w-24">
                                </div>
                            </div>
                            <div v-else class="row">
                                <div class="col-12">
                                    <div class="button-toolbar">
                                        <sql-editor-toolbar ref="toolbar" :task="cell" :show-move-up="i > 0"
                                                            :data-task="cell.id" :show-move-down="i < workflowObj.cells.length - 1"
                                                            @on-move="handleMove" @on-remove="handleRemoveSql" @on-add="handleAdd"
                                                            @on-indent="handleIndent(cell.id)"
                                                            @on-execute="(taskId, value) => executeWorkflow(cell.id, value)"
                                                            @on-toggle-use-hwc="handleToggleHWC" />
                                    </div>
                                </div>
                                <div class="col-8">
                                    <span class="form-text">{{$t('titles.comment')}}:</span> <input v-model="cell.forms.comment.value" class="form-control form-control-sm mb-1"
                                                                                                    maxlength="100">
                                </div>
                                <div class="col-2 mt-4">
                                    <b-form-checkbox v-model="cell.enabled" :value="true" :unchecked-value="false">
                                        Habilitado
                                    </b-form-checkbox>
                                </div>
                                <div class="col-2">
                                    <span class="form-text">Tipo:</span>
                                    <input type="text" readonly :value="cell.operation.slug.substring(8)"
                                           class="form-control form-control-sm w-24">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="editor">
                                        <sql-editor v-if="cell.operation.slug === 'execute-sql'"
                                                    ref="codeEditor" :query="cell.forms.query.value"
                                                    :tables="dataSources" :functions="functions" :data-task="cell.id"
                                                    :formatter="{ language: 'spark', tabWidth: 2, keywordCase: 'upper', linesBetweenQueries: 2 }"
                                                    @update="(v) => cell.forms.query.value = v" />
                                        <python-editor v-else ref="codeEditor"
                                                       :query="cell.forms.code.value" :tables="dataSources"
                                                       :functions="functions" :data-task="cell.id" :format="{ language: 'spark', tabWidth: 2, keywordCase: 'upper', linesBetweenQueries: 2 }"
                                                       @update="(v) => cell.forms.code.value = v" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 cell-status-bar">
                                    <!--
                                        <font-awesome-icon v-if="taskStatuses[cell.id] === 'RUNNING'" icon="fas fa-sync" class="text-primary fa-spin" spin />
                                        <font-awesome-icon v-if="taskStatuses[cell.id] === 'COMPLETED'" icon="fa-check-circle" class="text-success " />
                                        <font-awesome-icon v-if="taskStatuses[cell.id] === 'ERROR'" icon="fa-stop" class="text-danger" />
                                        -->
                                    <span v-if="cell.status && cell.status != ''">
                                        {{cell.message}}
                                        <font-awesome-icon :icon="'fa' + getCellIcon(cell)"
                                                           :class="getCellClass(cell)" />
                                    </span>
                                </div>
                                <div v-if="cell.userMessages && cell.userMessages != ''" class="col-12">
                                    <div class=" ml-4 mt-3 border-top notifications px-4 py-2">
                                        <div v-for="msg, counter in cell.userMessages" :key="counter" class="mt-2 pt-2 border-top">
                                            <div v-if="msg.type.toUpperCase() === 'HTML'">
                                                <span v-html="msg.message" />
                                            </div>
                                            <div v-else>
                                                {{msg.message}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition-group>
                </div>
            </div>
            <div class="layout-help">
                <h4>{{$t('common.help')}}</h4>
                <sql-editor-help :data-sources="dataSources" :functions="sparkFunctions"
                                 :custom-functions="customFunctions" />
            </div>
            <div v-show="loadingData" class="preview-loading">
                <font-awesome-icon icon="lemon" spin class="text-success" />
                {{i18n.$t('common.wait')}}
            </div>
        </div>
        <modal-preview-data-source ref="previewWindow" />
        <sql-sample v-show="sample" ref="modalSample" :sample="sample" />
        <modal-workflow-variables ref="variablesModal" :simple="true" :workflow="workflowObj"
                                  :items="workflowObj.variables" />
        <sql-editor-use-code-library v-if="showUseCodeLibrary" ref="modalUseCodeLibrary" :task="workflowObj" />
    </main>
</template>

<script setup>
import { onBeforeMount, ref, nextTick, onUnmounted, onMounted } from "vue";

import { useWebSocket } from '@/composables/websocket.js';
import { debounce } from "@/util.js";
import ModalPreviewDataSource from '@/views/modal/ModalPreviewDataSource.vue';
import axios from 'axios';
import Vue from 'vue';
import VueSelect from 'vue-select';
import SqlEditor from './SqlEditor.vue';
import PythonEditor from './PythonEditor.vue';
import SqlEditorHelp from './SqlEditorHelp.vue';
import SqlEditorToolbar from './SqlEditorToolbar.vue';
import SqlSample from './SqlSample.vue';
import ModalWorkflowVariables from "@/views/modal/ModalWorkflowVariables.vue";
import SqlEditorUseCodeLibrary from './SqlEditorUseCodeLibrary.vue';

import { getCurrentInstance } from 'vue';

import useDataSource from '@/composables/useDataSource.js';
import useNotifier from '@/composables/useNotifier.js';

import { SqlBuilderWorkflow, EXECUTE_SQL } from '../entities.js';

const vm = getCurrentInstance();
const router = vm.proxy.$router;
const route = vm.proxy.$route;

const progress = vm.proxy.$Progress;
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
const cachedDataSources = ref([]);
const internalWorkflowId = ref(null);
const job = ref(null);
const jobStatus = ref({ status: '' });
const loaded = ref(false);
const loadingData = ref(false);
const clusterRef = ref(null);

const targetPlatform = ref(4);
const workflowObj = ref({ variables: [], forms: { $meta: { value: { target: '', taskType: '' } } } });

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
const functions = [...customFunctions, ...sparkFunctions];

/* Control dirty state */
const isDirty = ref(false);
const confirmMsg = i18n.$t('warnings.dirtyCheck');

window.onbeforeunload = function () {
    if (isDirty.value) {
        return confirmMsg;
    }
};
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

/** Web socket  */
const { connectWebSocket, disconnectWebSocket, socketEmit, joinRoom } = useWebSocket();

const configureWebSocket = async () => {
    const eventHandlers = {
        'connect': () => {
            joinRoom(job.value.id);
        },
        'response': (msg) => {

        },
        'update task': (msg) => {
            if (msg.type === 'OBJECT') {
                sample.value = msg.message;
                nextTick(() => {
                    modalSample.value.show();
                });
            } else {
                const cell = workflowObj.value.cellMap.get(msg.id);
                if (cell) {
                    cell.status = msg.status;
                    cell.message = msg.message;
                }
            }
        },
        'user message': (msg) => {
            const cell = workflowObj.value.cellMap.get(msg.id);
            if (cell) {
                cell.userMessages = (cell.userMessages || []);
                cell.userMessages.push(msg);
            }
        },
        'update job': (msg) => {
            jobStatus.value = '';
            if (msg.status === 'ERROR') {
                error(msg);
                loadingData.value = false;
            }
            if (msg.status === 'COMPLETED') {
                loadingData.value = false;
            }
            jobStatus.value = msg;
        },
    };
    connectWebSocket(standSocketServer, standNamespace, standSocketIoPath,
        eventHandlers);
};

onBeforeMount(async () => {
    internalWorkflowId.value = (route) ? route.params.id : 0;
    await load();
});
onUnmounted(() => {
    disconnectWebSocket();
});
onMounted(() => {
    job.value = { id: (800000 + parseInt(internalWorkflowId.value)) };
    configureWebSocket();
});
//disconnectWebSocket();
const updateDataSources = async (useCached) => {
    dataSources.value = [];
    if (useCached) {
        for (let wfDs of workflowObj.value.dataSources) {
            const dataSource = cachedDataSources.value.find(d => d.id === wfDs.forms.data_source.value);
            dataSources.value.push(
                {
                    id: wfDs.id,
                    dataSourceId: wfDs.forms.data_source.value,
                    name: dataSource?.name,
                    alias: wfDs.name,
                    attributes: dataSource?.attributes,
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
};

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

const executeWorkflow = async (taskId, only) => {

    if (!workflowObj.value.preferred_cluster_id) {
        error('Por favor, selecione um cluster para execução.');
        clusterRef.value.open = true;
        return;
    }
    workflowObj.value.tasks.forEach(t => {
        t.status = null;
        t.userMessages = [];
    });
    if (isDirty.value) {
        saveWorkflow();
    }
    loadingData.value = true;

    let cloned = structuredClone(workflowObj.value);

    cloned.platform_id = META_PLATFORM_ID;

    cloned.tasks.forEach((task) => {
        task.operation = { id: task.operation.id };
        delete task.version;
        delete task.step;
        delete task.status;
        delete task.userMessages;
    });
    delete cloned._tasksLookup;
    cloned.cells = cloned.cells.sort(c => c.display_order);
    cloned.tasks = [...cloned.dataSources, ...cloned.cells];

    if (taskId) {
        if (only) {
            cloned.tasks = cloned.tasks.filter(t => t.id === taskId || t.operation.id != EXECUTE_SQL);
        } else {
            let found = false;
            cloned.tasks = cloned.tasks.filter(task => {
                if (task.operation.id !== EXECUTE_SQL) {
                    return true;
                }
                if (found) {
                    return false;
                }
                if (task.id === taskId) {
                    found = true;
                    return true;
                }
                return true;
            });
        }
    }
    delete cloned.dataSources;
    delete cloned.cells;
    const PAGE_SIZE = 20;
    const body = {
        workflow: cloned,
        cluster: { id: cloned.preferred_cluster_id },
        name: `## sql workflow ${cloned.id} ##`,
        persist: false, // do not save the job in db.
        app_configs: {
            verbosity: 0, sample_size: PAGE_SIZE, sample_page: 1,
            //target_platform: 'scikit-learn',
            //variant: 'polars',
            sample_style: 'DATA_EXPLORER'
        },
    };

    try {
        const response = await axios.post(`${standUrl}/jobs`, body);
        job.value = response.data.data;

        configureWebSocket();

    } catch (ex) {
        loadingData.value = false;
        error(ex);
    }
};

const stop = async () => {
    try {
        const resp = await axios.post(`${standUrl}/jobs/${job.value.id}/stop?executor=true`);
        success(i18n.$t('messages.successStop', { what: i18n.$t('titles.job') }));
    } catch (e) {
        error(e, null, null, 10000, false);
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
    cloned.tasks = [...cloned.dataSources, ...cloned.cells];
    delete cloned.dataSources;
    delete cloned.cells;

    try {
        await axios.patch(url, cloned, { headers: { 'Content-Type': 'application/json' } });
        isDirty.value = false;
        success(i18n.$t('messages.savedWithSuccess', { what: i18n.$t('titles.workflow') }));
    } catch (e) {
        error(e);
    }
};

const sample = ref();
const modalSample = ref(null);

const showSample = () => {
    modalSample.value.show();
};

/**Events */
const handleAdd = (taskId, type, command) => {
    if (type === 'sql' || type === undefined) {
        workflowObj.value.addSqlTask(taskId, command || '\n');
    } else {
        workflowObj.value.addPythonTask(taskId, command);
    }
    if (codeEditor.value) {
        Vue.nextTick(() => {
            codeEditor.value.slice(-1)[0].focus();
        });
    }
    isDirty.value = true;
};
const handleRemoveSql = (taskId) => {
    if (confirm(i18n.$t('messages.doYouWantToDelete'))) {
        workflowObj.value.removeTask(taskId);
        isDirty.value = true;
    }
};
const handleMove = (taskId, direction) => {
    workflowObj.value.moveTask(taskId, direction);
};
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
};
const handleRemoveDataSource = (taskId) => {
    if (confirm(i18n.$t('messages.doYouWantToDelete'))) {
        workflowObj.value.removeTask(taskId);
        dataSources.value = dataSources.value.filter(ds => ds.id !== taskId);
    }
    isDirty.value = true;
};
const handlePreview = (dataSourceId) => {
    previewWindow.value.show(dataSourceId);
};
const handleAddSqlFromDataSource = (type, dataSourceId) => {
    const ds = dataSources.value.find(ds => ds.dataSourceId === dataSourceId);
    if (ds && ds.attributes.length > 0) {
        const cmd = [];
        if (type === 'select') {
            cmd.push('SELECT');
            for (const attr of ds.attributes.slice(0, -1)) {
                cmd.push(`   ${ds.alias}.${attr.name},`);
            }
            cmd.push(`   ${ds.alias}.${ds.attributes.slice(-1)[0].name}`);
            cmd.push(`FROM ${ds.alias}`);
        } else if (type === 'insert') {
            cmd.push(`INSERT INTO ${ds.alias}(`);
            for (const attr of ds.attributes.slice(0, -1)) {
                cmd.push(`   ${attr.name},`);
            }
            cmd.push(`   ${ds.attributes.slice(-1)[0].name}`);
            cmd.push(')');
            cmd.push('VALUES()');
        }
        handleAdd(null, 'sql', cmd.join('\n'));
    }
};
const handleChangeAlias = () => {
    isDirty.value = true;
    updateDataSources(true);
};
const handleToggleHWC = (task, value) => {
    task.forms.useHWC.value = value;
};
const toolbar = ref();

const handleIndent = (taskId) => {
    const currentToolbar = toolbar.value.find(el => el.$el.dataset.task === taskId);
    const currentEditor = codeEditor.value.find(el => el.$el.dataset.task === taskId);
    if (currentToolbar && currentEditor) {
        currentToolbar.showStatus('código formatado');
        currentEditor.indent();
    }
};
const handleCodeAppear = (el, done) => {
    el.scrollIntoView({ behavior: "smooth" });

};
const getCellIcon = (cell) => {
    switch (cell.status) {
    case 'RUNNING':
        return 'fa-sync';
    case 'COMPLETED':
        return 'fa-check-circle';
    case 'ERROR':
        return 'fa-stop';
    default:
        return 'fa-question';
    }
};
const getCellClass = (cell) => {
    switch (cell.status) {
    case 'RUNNING':
        return 'text-primary';
    case 'COMPLETED':
        return 'text-success';
    case 'ERROR':
        return 'text-danger';
    }
};

const showUseCodeLibrary = ref(false);
const modalUseCodeLibrary = ref();
const handleShowModalCodeLibrary = () => {
    showUseCodeLibrary.value = true;
    nextTick(() => modalUseCodeLibrary.value.show());
};
</script>

<style>
.disabled-cell .cm-content,
.disabled-cell input {
    background: lightgray !important;
}

table.dataframe tr:nth-child(even) {
    background-color: white;
}

table.dataframe td,
table.dataframe th {
    padding: 2px 5px;
}

table.dataframe td,
table.dataframe th,
table.dataframe {
    border: 0;
    text-align: center;
}
</style>
<style scoped lang="scss">
.layout-container {
    display: flex;
    gap: 10px;
    /*height: 85vh;*/
    font-size: .8em;
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
    overflow-x: hidden;
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

.bottom-fixed-component {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.1);
}

.form-text {
    font-size: 10pt;
}

.exception-stack {
    overflow: auto;
    width: 260px;
    height: 300px;
}

.cell-status-bar {
    padding: 4px 0 0 40px;
    line-height: 15px;
    margin-top: 2px;
    min-height: 16px;
    font-size: 9pt;
}

.notifications {
    font-size: .9em;
    background-color: #fafafa;
    width: 100%;
    overflow-x: auto;
}

.editor {
    display: block;
    position: relative;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
}
</style>
