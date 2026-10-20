<template>
    <main role="main">
        <div class="workflow-header pb-2 mb-2 border-bottom">
            <div class="workflow-heading">
                <h6 class="header-pretitle">
                    {{ $t('titles.sqlWorkflow') }} #{{ workflowObj.id }}
                    <span v-if="isDirty" class="unsaved-indicator ms-2" role="status">Alterações não salvas</span>
                </h6>
                <input-header v-model="workflowObj.name" @input="isDirty = true" />
            </div>
            <div class="workflow-actions">
                <div class="workflow-actions-group" aria-label="Ações do fluxo">
                <router-link v-if="workflowObj.pipeline"
                    :to="{ name: 'pipelineEdit', params: { id: workflowObj.pipeline.id } }"
                    class="btn btn-outline-secondary btn-sm me-1" :title="workflowObj.pipeline.name" tag="button">
                    <font-awesome-icon icon="fa fa-circle-nodes" />
                    Ir para pipeline #{{ workflowObj.pipeline.id }}
                </router-link>
                <b-button variant="outline-secondary" size="sm" title="Usar biblioteca"
                    @click="handleShowModalCodeLibrary" class="me-1">
                    <font-awesome-icon icon="fa fa-file-code" />
                    Bibliotecas de código <span v-if="workflowObj.forms.code_libraries?.value?.length > 0"> ({{
                        workflowObj.forms.code_libraries.value.length }})</span>
                </b-button>

                <b-button variant="outline-dark" size="sm" :title="$t('actions.showVariables')"
                    @click.prevent="$refs.variablesModal.show()" class="me-1">
                    <font-awesome-icon icon="fa fa-dollar-sign" /> Variáveis
                    <span v-if="workflowObj.variables?.length > 0"> ({{
                        workflowObj.variables?.length }})</span>
                </b-button>

                </div>
                <div class="workflow-actions-group" aria-label="Execução">
                <b-button variant="outline-secondary" size="sm" class="pu me-1 btn-save" :class="{ 'btn-save-dirty': isDirty }"
                    @click="saveWorkflow" data-test="save" title="Salvar (Ctrl+S)">
                    <font-awesome-icon icon="fa fa-save" />
                    {{ $t('actions.save') }}
                </b-button>
                <b-button variant="success" size="sm" class="pu" :disabled="running || loadingData"
                    @click="executeWorkflow" data-test="execute">
                    <template v-if="running">
                        <font-awesome-icon icon="fa fa-spinner" spin /> Executando…
                    </template>
                    <template v-else>
                        <font-awesome-icon icon="fa fa-play" /> {{ $t('actions.execute') }}
                    </template>
                </b-button>
                <b-button v-if="sample" variant="info" size="sm" class="ms-2 pu" @click="showSample" data-test="sample">
                    <font-awesome-icon icon="fa fa-table" /> Ver dados
                </b-button>
                <b-button variant="outline-danger" size="sm" class="ms-2 pu" :disabled="!running" @click="stop" data-test="restart"
                    title="Para os recursos alocados e reinicia os executores" aria-label="Parar execução">
                    <font-awesome-icon icon="fa fa-stop" /> {{ $t('actions.stop') }}
                </b-button>
                </div>
            </div>
        </div>
        <div class="layout-container xsource-code-pro-font" id="workflow-design" ref="workflowDesign">
            <div class="layout">
                <div>
                    <form class="clearfix">
                        <div data-test="basic-options-section">
                            <label class="mt-3" for="cluster-select">{{ $t('titles.cluster') }}: </label>
                            <select id="cluster-select" ref="clusterRef" v-model="clusterId"
                                class="form-select form-select-sm" :class="{ 'is-invalid': clusterInvalid }"
                                @change="clusterInvalid = false; isDirty = true">
                                <option :value="null" disabled>Selecione um cluster</option>
                                <option v-for="c in clusters" :key="c.id" :value="c.id" :title="c.description">{{ c.name }}</option>
                            </select>
                            <small v-if="selectedCluster?.description" class="text-muted d-block mt-1">{{ selectedCluster.description }}</small>
                            <div v-if="workflowObj" class="switch-aligned mt-3" title="Usar o Hive Warehouse Connector (HWC)">
                                <b-form-checkbox v-model="workflowObj.forms.$meta.value.use_hwc"
                                    value="true" unchecked-value="false" switch @change="isDirty = true">
                                    Usar o Hive Warehouse Connector
                                </b-form-checkbox>
                            </div>
                            <label for="" class="mt-3 d-block">{{ $t('titles.dataSource', 2) }}
                                ({{ workflowObj.dataSources?.length }}):</label>
                            <button class="btn btn-sm btn-secondary mt-2" :title="$t('actions.add')"
                                @click.prevent="handleAddDataSource" :disabled="addingDataSource">
                                <font-awesome-icon icon="fa fa-plus" /> {{ $t('titles.dataSource', 1) }}</button>
                            <div v-if="addingDataSource" class="mt-2">
                                <label>Escolha uma fonte de dados</label>
                                <vue-select :filterable="false" :options="dataSourceList" :reduce="(opt) => opt.id"
                                    label="name" @search="loadDataSourceList"
                                    @update:model-value="(id) => id && handleAddDataSource(id)">
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
                                    <button class="btn btn-sm ms-1 btn-secondary" :title="$t('actions.cancel')"
                                        @click.prevent="addingDataSource = false"> {{ $t('actions.cancel') }}</button>
                                </div>
                            </div>
                            <ul class="list-unstyled data-sources mt-2 mb-0 scroll-area">
                                <li v-for="dataSource in workflowObj.dataSources" :key="dataSource.id"
                                    class="data-source-card">
                                    <div class="d-flex align-items-center">
                                        <div class="truncate flex-grow-1" :title="dataSource.forms.data_source.labelValue">
                                            {{ dataSource.forms.data_source.labelValue }}
                                        </div>
                                        <button class="btn btn-sm text-danger" :title="$t('actions.delete')"
                                            :aria-label="$t('actions.delete')"
                                            @click.prevent="handleRemoveDataSource(dataSource.id)"><font-awesome-icon
                                                icon="fa fa-trash" /></button>
                                    </div>
                                    <label class="form-text mb-0" :for="`ds-alias-${dataSource.id}`">Nome no SQL:</label>
                                    <input type="text" class="form-control form-control-sm mb-2"
                                        :id="`ds-alias-${dataSource.id}`"
                                        v-model="dataSource.name" maxlength="50" @change="handleChangeAlias" />
                                    <div class="ds-actions d-flex flex-wrap align-items-center gap-1">
                                        <button :title="$t('common.preview')" class="btn btn-sm btn-light"
                                            @click.prevent="handlePreview(dataSource.forms.data_source.value)">
                                            <font-awesome-icon icon="fa-eye" />
                                        </button>
                                        <span class="text-muted ms-1">Gerar célula:</span>
                                        <button title="Criar SELECT para fonte de dados" class="btn btn-sm btn-light"
                                            @click.prevent="handleAddSqlFromDataSource('select', dataSource.forms.data_source.value)">
                                            <font-awesome-icon icon="fa fa-plus" /> SELECT
                                        </button>
                                        <button title="Criar INSERT para fonte de dados" class="btn btn-sm btn-light"
                                            @click.prevent="handleAddSqlFromDataSource('insert', dataSource.forms.data_source.value)">
                                            <font-awesome-icon icon="fa fa-plus" /> INSERT
                                        </button>
                                        <button title="Criar STAGE para fonte de dados" class="btn btn-sm btn-light"
                                            @click.prevent="handleAddSqlFromDataSource('stage', dataSource.forms.data_source.value)">
                                            <font-awesome-icon icon="fa fa-plus" /> STAGE
                                        </button>
                                    </div>
                                </li>
                            </ul>

                        </div>
                    </form>
                </div>
            </div>
            <div class="layout-center pt-2">
                <div class="d-flex justify-content-end align-items-center py-1">
                    <h4 class="m-0">Células <span class="command-count">{{ workflowObj.cells?.length }}</span></h4>
                    <cell-map class="me-auto ms-3" :cells="workflowObj.cells || []" :active-id="activeCellId" @select="scrollToCell" />
                    <div>
                        <button type="button" @click="toggleExpand" class="btn btn-sm"
                            :class="{'btn-info': expandedArea, 'btn-outline-secondary': !expandedArea}"
                            :title="expandedArea ? 'Mostrar os painéis laterais' : 'Esconder os painéis laterais'">
                            <font-awesome-icon :icon="expandedArea ? 'fa fa-minimize' : 'fa fa-maximize'"/> Modo foco
                        </button>
                    </div>

                    <div class="btn-group btn-group-sm ms-2" role="group" aria-label="Células">
                        <button type="button" @click="toggleExpandAll" class="btn btn-outline-secondary"
                            title="Expandir todas as células" aria-label="Expandir todas as células">
                            <font-awesome-icon icon="fa fa-angles-down"/> Expandir tudo
                        </button>
                        <button type="button" @click="handleCollapseAll" class="btn btn-outline-secondary"
                            title="Recolher todas as células" aria-label="Recolher todas as células">
                            <font-awesome-icon icon="fa fa-angles-up"/> Recolher tudo
                        </button>
                    </div>
                </div>

        <div class="job-status" v-if="jobStatus.status || jobStatus.message">
            <span class="job-status-badge" :class="`status-${(jobStatus.status || 'unknown').toLowerCase()}`" role="status">
                <font-awesome-icon :icon="jobStatus.status === 'RUNNING' ? 'fa fa-sync' : jobStatus.status === 'COMPLETED' ? 'fa fa-check-circle' : jobStatus.status === 'ERROR' ? 'fa fa-circle-exclamation' : 'fa fa-circle-info'" :spin="jobStatus.status === 'RUNNING'" />
                {{ jobStatus.status || 'Status' }}
            </span>
            <span class="job-status-message">{{ jobStatus.message }}</span>
            <button v-if="jobStatus.exception_stack" type="button" class="btn btn-link btn-sm p-0"
                @click="exceptionDialog.showModal()">Ver detalhes do erro</button>
            <dialog ref="exceptionDialog" class="exception-dialog">
                <h5>Detalhes do erro</h5>
                <pre class="exception">{{ jobStatus.exception_stack }}</pre>
                <button class="btn btn-sm btn-secondary" @click="exceptionDialog.close()">Fechar</button>
            </dialog>
        </div>

                <div v-if="workflowObj.cells?.length === 0" class="empty-state">
                    <h5 class="mb-1">Nenhuma célula ainda</h5>
                    <p class="text-muted">Adicione a primeira célula para começar.</p>
                    <add-cell-buttons captions @add="(type) => handleAdd(null, type, '\n')" />
                    <p class="text-muted mt-3 mb-0">
                        <template v-if="workflowObj.dataSources?.length > 0">
                            Dica: use SELECT, INSERT ou STAGE nas fontes de dados ao lado para gerar a primeira célula.
                        </template>
                        <template v-else>Dica: comece adicionando uma fonte de dados no painel lateral.</template>
                    </p>
                </div>
                <div class="scroll-area commands pb-5" @scroll.passive="updateActiveCell" @wheel.passive="pinnedCellId = null" @touchmove.passive="pinnedCellId = null">
                    <transition-group name="fade" @after-enter="handleCodeAppear">
                        <sql-cell v-for="cell, i in workflowObj.cells" :key="cell.id" ref="cellRefs"
                            :cell="cell" :index="i" :total="workflowObj.cells.length"
                            :data-sources="dataSources" :functions="functions"
                            @move="handleMove" @remove="handleRemoveSql" @add="handleAdd"
                            @execute="executeWorkflow" @toggle-use-hwc="handleToggleHWC"
                            @toggle="handleToggle" @dirty="isDirty = true"
                            @click="setActiveCell(cell.id)" @focusin="setActiveCell(cell.id)" />
                    </transition-group>
                    <div v-if="workflowObj.cells?.length > 0" class="text-center mt-2">
                        <add-cell-buttons @add="(type) => handleAdd(null, type, '\n')" />
                    </div>
                </div>
            </div>
            <div class="layout-help" :class="{ collapsed: helpCollapsed }">
                <button type="button" class="help-toggle" :aria-expanded="!helpCollapsed" aria-controls="help-content"
                    :title="helpCollapsed ? 'Mostrar ajuda' : 'Recolher ajuda'" @click="toggleHelp">
                    <font-awesome-icon :icon="helpCollapsed ? 'fa fa-chevron-left' : 'fa fa-chevron-right'" />
                    <h4 class="m-0">{{ $t('common.help') }}</h4>
                </button>
                <div id="help-content" v-show="!helpCollapsed">
                    <sql-editor-help :data-sources="dataSources" :functions="sparkFunctions"
                        :custom-functions="customFunctions" />
                </div>
            </div>
            <div v-show="loadingData" class="preview-loading">
                <font-awesome-icon icon="lemon" spin class="text-success" />
                {{$t('common.wait') }}
            </div>
        </div>
        <modal-preview-data-source ref="previewWindow" />
        <sql-sample v-show="sample" :sample="sample" ref="modalSample" />
        <modal-workflow-variables ref="variablesModal" :simple="true" :items="workflowObj.variables"
            @confirm="handleVariablesConfirm" />
        <sql-editor-use-code-library v-if="showUseCodeLibrary" ref="modalUseCodeLibrary" :task="workflowObj" />

    </main>
</template>

<script setup>
import { onBeforeMount, ref, computed, watch, nextTick, onUnmounted, onMounted } from "vue";
import { onBeforeRouteLeave } from 'vue-router';

import { useWebSocket } from '@/composables/websocket.js';
import { debounce } from "@/util.js";
import { useI18n } from 'vue-i18n';
import ModalPreviewDataSource from '@/views/modal/ModalPreviewDataSource.vue';
import axios from 'axios';
import VueSelect from 'vue-select';
import InputHeader from '@/components/InputHeader.vue';
import SqlCell from './SqlCell.vue';
import AddCellButtons from './AddCellButtons.vue';
import CellMap from './CellMap.vue';
import SqlEditorHelp from './SqlEditorHelp.vue';
import SqlSample from './SqlSample.vue';
import ModalWorkflowVariables from "@/views/modal/ModalWorkflowVariables.vue";
import SqlEditorUseCodeLibrary from './SqlEditorUseCodeLibrary.vue';

import { getCurrentInstance } from 'vue';

import useDataSource from '@/composables/useDataSource.js';
import useNotifier from '@/composables/useNotifier.js';

import { SqlBuilderWorkflow, EXECUTE_SQL, DATA_READER } from '../entities.js';

const vm = getCurrentInstance();
const router = vm.proxy.$router;
const route = vm.proxy.$route;

const {t} = useI18n()

const { success, error, confirmDelete, successDeleted } = useNotifier(vm.proxy);
const CELL = { name: 'célula', gender: 'f' };

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
const running = computed(() => ['RUNNING', 'PENDING', 'WAITING'].includes(jobStatus.value?.status));
const clusterRef = ref(null);
const clusterInvalid = ref(false);
const activeCellId = ref(null);
// cell chosen by clicking the map; kept active while visible, since the last cells cannot reach the top of the list
let pinnedCellId = null;
const updateActiveCell = () => {
    const box = document.querySelector('.commands');
    if (!box) return;
    const { top, bottom } = box.getBoundingClientRect();
    if (pinnedCellId) {
        const rect = box.querySelector(`[data-cell-container="${pinnedCellId}"]`)?.getBoundingClientRect();
        if (rect && rect.top < bottom && rect.bottom > top) {
            activeCellId.value = pinnedCellId;
            return;
        }
        pinnedCellId = null;
    }
    const el = [...box.querySelectorAll('[data-cell-container]')]
        .find(c => c.getBoundingClientRect().bottom > top + 8);
    activeCellId.value = el?.dataset.cellContainer ?? null;
};
const setActiveCell = (id) => {
    pinnedCellId = id;
    activeCellId.value = id;
};
const scrollToCell = (id) => {
    const el = document.querySelector(`[data-cell-container="${id}"]`);
    if (!el) return;
    setActiveCell(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.add('cell-flash');
    setTimeout(() => el.classList.remove('cell-flash'), 1200);
};
// null (not undefined) so the disabled placeholder option is shown when no cluster is set
const clusterId = computed({
    get: () => workflowObj.value.preferred_cluster_id ?? null,
    set: (v) => { workflowObj.value.preferred_cluster_id = v; },
});
const selectedCluster = computed(() => clusters.value.find(c => c.id === workflowObj.value.preferred_cluster_id));
const exceptionDialog = ref(null);
const expandedArea = ref(false);

const targetPlatform = ref(4);
const workflowObj = ref({ variables: [], forms: { $meta: { value: { target: '', taskType: '' } } } });

// the code library modal edits forms.code_libraries directly; skip the first value (load)
watch(() => loaded.value ? JSON.stringify(workflowObj.value.forms?.code_libraries?.value ?? null) : undefined,
    (_, old) => { if (old !== undefined) isDirty.value = true; });
watch(() => workflowObj.value.cells?.map(c => c.id).join(','), () => nextTick(updateActiveCell), { flush: 'post' });

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
const confirmMsg = t('warnings.dirtyCheck');

window.onbeforeunload = function () {
    if (isDirty.value) {
        return confirmMsg;
    }
}
onBeforeRouteLeave(() => {
    if (!isDirty.value || confirm(confirmMsg)) {
        isDirty.value = false;
        return true;
    }
    return false;
});

// Elements refs
const cluster = ref(null);
const cellRefs = ref([]);
const previewWindow = ref();
const workflowDesign = ref();

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
                    if (msg.status === 'RUNNING' && cell.status !== 'RUNNING') {
                        cell.startedAt = Date.now();
                        cell.duration = null;
                    } else if (cell.startedAt && ['COMPLETED', 'ERROR'].includes(msg.status)) {
                        cell.duration = `${((Date.now() - cell.startedAt) / 1000).toFixed(1)} s`;
                        cell.startedAt = null;
                    }
                    cell.status = msg.status;
                    cell.message = msg.message;
                    if (msg.status === 'ERROR' && !workflowObj.value.cells.some(c => c.status === 'ERROR' && c !== cell)) {
                        nextTick(() => document.querySelector(`[data-cell-container="${cell.id}"]`)
                            ?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
                    }
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
}

onBeforeMount(async () => {
    internalWorkflowId.value = (route) ? route.params.id : 0;
    await load();
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
    window.removeEventListener('resize', fitHeight);
    document.documentElement.style.overflow = '';
    headerObserver?.disconnect();
    window.onbeforeunload = null;
    disconnectWebSocket();
});
// Fit the 3 columns to the viewport so each one scrolls on its own (stacked layout below 1100px keeps page scroll)
let headerObserver = null;
const fitHeight = () => {
    const el = workflowDesign.value;
    if (!el) return;
    const wide = window.innerWidth > 1100;
    // header stays put: the page itself must not scroll when the columns do
    document.documentElement.style.overflow = wide ? 'hidden' : '';
    if (!wide) {
        el.style.height = '';
        return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY;
    const footer = document.querySelector('footer')?.offsetHeight || 0;
    el.style.height = `${Math.max(window.innerHeight - top - footer - 16, 400)}px`;
};
onMounted(() => {
    window.addEventListener('keydown', handleGlobalKeydown);
    window.addEventListener('resize', fitHeight);
    fitHeight();
    const header = document.querySelector('.workflow-header');
    if (header) {
        headerObserver = new ResizeObserver(fitHeight);
        headerObserver.observe(header);
    }
    job.value = { id: 800_000 + parseInt(internalWorkflowId.value) };
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
}

const load = async () => {
    loadingData.value = true;
    try {
        let resp = await axios.get(`${tahitiUrl}/workflows/${internalWorkflowId.value}`);
        workflowObj.value = new SqlBuilderWorkflow(resp.data, operationsMap.value);
        if (workflowObj.value.type !== 'SQL') {
            error(null, t('modelBuilder.invalidType')); //FIXME: add message
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
        nextTick(() => {
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

const executeWorkflow = async (taskId, cached) => {

    if (!workflowObj.value.preferred_cluster_id) {
        error('Por favor, selecione um cluster para execução.');
        clusterInvalid.value = true;
        clusterRef.value.focus();
        return;
    }
    workflowObj.value.tasks.forEach(t => {
        t.status = null;
        t.userMessages = [];
    });
    if (isDirty.value) {
        await saveWorkflow();
    }
    loadingData.value = true;

    let cloned = JSON.parse(JSON.stringify(workflowObj.value));

    cloned.platform_id = META_PLATFORM_ID;


    cloned.tasks.forEach((task) => {
        task.operation = { id: task.operation.id };
        delete task.version;
        delete task.step;
        delete task.status;
        delete task.userMessages;
        delete task.startedAt;
        delete task.duration;
    });
    delete cloned._tasksLookup;
    cloned.cells = cloned.cells.sort((a, b) => a.display_order - b.display_order);
    cloned.tasks = [...cloned.dataSources, ...cloned.cells];

    const partial = !!taskId;
    if (partial) {
        let found = false;
        cloned.tasks = cloned.tasks.filter(task => {
            if (task.operation.id === DATA_READER) {
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
    delete cloned.dataSources;
    delete cloned.cells;
    const PAGE_SIZE = 20
    const body = {
        workflow: cloned,
        cluster: { id: cloned.preferred_cluster_id },
        name: `## sql workflow ${cloned.id} ##`,
        persist: false, // do not save the job in db.
        app_configs: {
            verbosity: 0, sample_size: PAGE_SIZE, sample_page: 1,
            sample_style: 'DATA_EXPLORER',
            partial,
            cached,
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
    if (!confirm(t('messages.doYouWantToStop'))) return;
    try {
        const resp = await axios.post(`${standUrl}/jobs/${job.value.id}/stop?executor=true`)
        loadingData.value = false;
        jobStatus.value = { status: 'Cancelado' };
        success(t('messages.successStop', { what: t('titles.job') }));
    } catch (e) {
        error(e, null, null, 10000, false);
    }
};
const saveWorkflow = async () => {
    let cloned = JSON.parse(JSON.stringify(workflowObj.value));

    let url = `${tahitiUrl}/workflows/${cloned.id}`;

    cloned.platform_id = META_PLATFORM_ID;

    cloned.tasks.forEach((task) => {
        task.operation = { id: task.operation.id };
        delete task.version;
        delete task.step;
        delete task.status;
        delete task.startedAt;
        delete task.duration;
    });
    delete cloned._tasksLookup;
    cloned.tasks = [...cloned.dataSources, ...cloned.cells];
    delete cloned.dataSources;
    delete cloned.cells;

    try {
        await axios.patch(url, cloned, { headers: { 'Content-Type': 'application/json' } });
        isDirty.value = false;
        success(t('messages.savedWithSuccess', { what: t('titles.workflow') }));
    } catch (e) {
        error(e);
    }
};

const handleVariablesConfirm = (variables) => {
    workflowObj.value.variables = variables;
    isDirty.value = true;
};

const sample = ref();
const modalSample = ref(null);

const showSample = () => {
    modalSample.value.show();
};

/**Events */
const handleAdd = (taskId, type, command) => {
    const knownIds = new Set((workflowObj.value.cells || []).map(c => c.id));
    if (type === 'sql' || type === undefined) {
        workflowObj.value.addSqlTask(taskId, command || '\n');
    } else if (type === 'script') {
        workflowObj.value.addScriptTask(taskId, command);
    } else {
        workflowObj.value.addPythonTask(taskId, command);
    }
    nextTick(() => {
        const added = workflowObj.value.cells.find(c => !knownIds.has(c.id));
        if (!added) return;
        setActiveCell(added.id);
        cellRefs.value.find(c => c.$el.dataset.cellContainer === added.id)?.focus();
    });
    isDirty.value = true;
}
const handleRemoveSql = (taskId) => {
    confirmDelete(CELL, () => {
        workflowObj.value.removeTask(taskId);
        isDirty.value = true;
        successDeleted(CELL);
    });
}
const handleMove = async (taskId, direction) => {
    const cellTop = () => document.querySelector(`[data-cell-container="${taskId}"]`)?.getBoundingClientRect().top;
    const before = cellTop();
    workflowObj.value.moveTask(taskId, direction);
    isDirty.value = true;
    await nextTick();
    const after = cellTop();
    // keep the moved cell (and the button under the mouse) at the same screen position
    if (before !== undefined && after !== undefined) {
        document.querySelector('.commands').scrollTop += after - before;
    }
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
        cachedDataSources.value.push(ds);
        updateDataSources(true);
        isDirty.value = true;
    }
    addingDataSource.value = !addingDataSource.value;
}
const handleRemoveDataSource = (taskId) => {
    if (confirm(t('messages.doYouWantToDelete'))) {
        workflowObj.value.removeTask(taskId);
        dataSources.value = dataSources.value.filter(ds => ds.id !== taskId);
        isDirty.value = true;
    }
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
            handleAdd(null, 'sql', cmd.join('\n'));

        } else if (type === 'insert') {
            cmd.push(`INSERT INTO ${ds.alias}(`)
            for (const attr of ds.attributes.slice(0, -1)) {
                cmd.push(`   ${attr.name},`)
            }
            cmd.push(`   ${ds.attributes.slice(-1)[0].name}`);
            cmd.push(')')
            cmd.push('VALUES()')
            handleAdd(null, 'sql', cmd.join('\n'));
        }
        else if (type === 'stage') {
            cmd.push(`stage_table_name ='stage.${ds.name}'`)
            cmd.push(`query = f"""`)
            cmd.push(`CREATE TABLE IF NOT EXISTS {stage_table_name}(`)
            cmd.push('metadata_linha string,')
            for (const attr of ds.attributes.slice(0, -1)) {
                cmd.push(`   ${attr.name} string,`)
            }
            cmd.push(`   ${ds.attributes.slice(-1)[0].name} string,`);
            cmd.push('metadata_arquivo string,')
            cmd.push('metadata_data_ingestao timestamp')
            cmd.push(')')
            cmd.push('"""')
            cmd.push("hive=get_hwc_connection(spark_session)")
            cmd.push('hive.executeUpdate(query)')
            cmd.push('select_query= f"""')
            cmd.push("SELECT")
            cmd.push("ROW_NUMBER() OVER (")
            cmd.push("ORDER BY monotonically_increasing_id() ) AS metadata_linha,")
            for (const attr of ds.attributes.slice(0, -1)) {
                cmd.push(`   ${ds.alias}.${attr.name},`)
            }
            cmd.push(`   ${ds.alias}.${ds.attributes.slice(-1)[0].name},`);
            cmd.push(' \'${raw_src}\' AS metadata_arquivo,')
            cmd.push('FROM_UNIXTIME(UNIX_TIMESTAMP()) as metadata_data_ingestao')
            cmd.push(`FROM ${ds.alias} """`)
            cmd.push('df = spark_session.sql(select_query)')
            cmd.push('df.write.mode(\'overwrite\').format(HiveWarehouseSession.HIVE_WAREHOUSE_CONNECTOR).option(\'table\', stage_table_name).save()')
            handleAdd(null, 'python', cmd.join('\n'));


        }

    }
}
const handleChangeAlias = () => {
    isDirty.value = true;
    updateDataSources(true);
}
const handleToggleHWC = (task, value) => {
    task.forms.useHWC.value = value
    isDirty.value = true;
}
const handleToggle = (task) => {
    task.forms.opened.value = !task.forms?.opened?.value
}
const HELP_KEY = 'sqlWorkflow.helpCollapsed';
const readHelpCollapsed = () => {
    try {
        return localStorage.getItem(HELP_KEY) !== '0'; // collapsed unless the user expanded it
    } catch (e) {
        return true;
    }
};
const helpCollapsed = ref(readHelpCollapsed());
const toggleHelp = () => {
    helpCollapsed.value = !helpCollapsed.value;
    try {
        localStorage.setItem(HELP_KEY, helpCollapsed.value ? '1' : '0');
    } catch (e) {
        // storage unavailable: preference lasts only for this session
    }
};
const toggleExpand = () => {
    const leftChild = workflowDesign.value.children[0];
    const midChild = workflowDesign.value.children[1];
    const rightChild = workflowDesign.value.children[2];

    expandedArea.value = !expandedArea.value;
    if (expandedArea.value) {
        leftChild.style.display = 'none';
        midChild.style.flex = '1 1 auto';
        rightChild.style.display = 'none';
    } else {
        leftChild.style.display = '';
        midChild.style.flex = '';
        rightChild.style.display = '';
    }

}
const toggleExpandAll = () => {
    workflowObj.value.cells.forEach(task => {
        task.forms.opened.value = true;
    })
}
const handleCollapseAll = () => {
    workflowObj.value.cells.forEach(task => {
        task.forms.opened.value = false;
    })
}
const handleGlobalKeydown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveWorkflow();
    }
};
const handleCodeAppear = (el, done) => {
    el.scrollIntoView({ behavior: "smooth" });

}
const showUseCodeLibrary = ref(false);
const modalUseCodeLibrary = ref();
const handleShowModalCodeLibrary = () => {
    showUseCodeLibrary.value = true;
    nextTick(() => modalUseCodeLibrary.value.show());
}
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
    align-items: stretch;
    gap: 10px;
    font-size: .8em;
}

.layout,
.layout-help {
    min-height: 0;
    overflow-y: auto;
}

.workflow-header,
.workflow-heading,
.workflow-actions,
.workflow-actions-group,
.job-status {
    display: flex;
    align-items: center;
}

.workflow-header {
    justify-content: space-between;
    gap: 1rem;
}

.workflow-heading {
    min-width: 220px;
    flex-direction: column;
    align-items: flex-start;
}

.unsaved-indicator {
    color: #b45309;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    white-space: nowrap;
}

.workflow-actions {
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: .4rem;
}

.workflow-actions-group {
    flex-wrap: wrap;
    gap: .25rem;
}

.job-status {
    align-items: flex-start;
    flex-direction: column;
    gap: .35rem;
    margin-bottom: .5rem;
    padding: .65rem;
    background: #f1f3f5;
}

.job-status-badge {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    font-weight: 600;
}

.status-running { color: #0759a5; }
.status-completed { color: #176b36; }
.status-error { color: #a4262c; }
.status-pending,
.status-waiting { color: #805b00; }
.status-cancelado { color: #595959; }
.status-unknown { color: #595959; }

.job-status-message {
    overflow-wrap: anywhere;
}

.command-count {
    display: inline-flex;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 .4rem;
    align-items: center;
    justify-content: center;
    background: #e9ecef;
    font-size: .8em;
}

.layout,
.layout-help {
    flex: 0 1 300px;
    min-width: 240px;
    background-color: #f8f9fa;
    padding: 15px;
    margin-top: 10px;
}

.layout-center {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
    align-self: auto;
    order: 0;
    padding: 10px;
    min-width: 0;
}

.commands {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
}

.switch-aligned {
    font-size: .9rem;
}

.switch-aligned :deep(.form-check) {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin: 0;
    padding-left: 0;
}

.switch-aligned :deep(.form-check-input) {
    float: none;
    margin: 0;
}

.switch-aligned :deep(.form-check-label) {
    margin: 0;
}

.layout-center > :not(.commands) {
    flex: none;
}

.cell-flash {
    outline: 2px solid var(--cell-color);
    outline-offset: 2px;
}

.btn-save {
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-save-dirty,
.btn-save-dirty:hover {
    color: #fff;
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.empty-state {
    padding: 2rem 1rem;
    border: 1px dashed #ced4da;
    text-align: center;
}

.help-toggle {
    display: flex;
    align-items: center;
    gap: .5rem;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    text-align: left;
}

.layout-help.collapsed {
    flex: 0 0 40px;
    min-width: 40px;
    padding: 15px 5px;
}

.layout-help.collapsed .help-toggle {
    flex-direction: column;
    justify-content: flex-start;
}

.layout-help.collapsed .help-toggle h4 {
    writing-mode: vertical-rl;
}

.ds-actions .btn {
    font-size: .7rem;
    padding: .1rem .4rem;
    line-height: 1.3;
}

.data-source-card {
    background: #fff;
    border: 1px solid #dee2e6;
    border-left: 4px solid var(--secondary-color);
    padding: .5rem .75rem;
    margin-bottom: .75rem;
}

.truncate {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: .9em;
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

.exception-dialog {
    width: 80%;
    max-height: 80vh;
    overflow: auto;
    border: 1px solid gray;
}

.exception-dialog .exception {
    white-space: pre-wrap;
}

@media (max-width: 1100px) {
    .workflow-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .workflow-actions {
        justify-content: flex-start;
    }

    .layout-container {
        flex-wrap: wrap;
    }

    .layout,
    .layout-help {
        flex: 1 1 260px;
        min-width: min(260px, 100%);
    }

    .layout-center {
        flex: 1 1 100%;
        order: -1;
    }

    .commands {
        max-height: 70vh;
    }

    .layout-help.collapsed {
        flex: 1 1 100%;
        min-width: 0;
        padding: 5px 15px;
    }

    .layout-help.collapsed .help-toggle {
        flex-direction: row;
    }

    .layout-help.collapsed .help-toggle h4 {
        writing-mode: horizontal-tb;
    }
}

@media (max-width: 600px) {
    .workflow-heading {
        align-items: flex-start;
        flex-direction: column;
    }

    .workflow-actions-group {
        width: 100%;
    }

    .workflow-actions-group > * {
        margin-left: 0 !important;
    }

    .layout,
    .layout-help {
        flex-basis: 100%;
        min-width: 0;
    }

    .layout-center > .d-flex {
        align-items: flex-start !important;
        flex-wrap: wrap;
        gap: .4rem;
    }

    .layout-center > .d-flex > h4 {
        flex-basis: 100%;
    }
}
</style>
