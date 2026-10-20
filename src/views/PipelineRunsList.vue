<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1 v-if="fromPipelineEdit">
                {{$t('titles.pipelineRuns', 2)}} - {{$route.params.name}}
            </h1>
            <h1 v-else class="runsList-title">
                {{$t('titles.pipelineRuns', 2)}}
            </h1>
            <router-link v-if="fromPipelineEdit" :to="{ name: 'pipelineEdit', params: { id: $route.params.id } }"
                         class="btn btn-outline-primary d-print-none float-end btn-sm">
                <font-awesome-icon icon="fa-chevron-left" />
                &nbsp; {{$t('actions.back')}} -
                Pipeline #{{$route.params.id}}
            </router-link>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="runsList-body">
                    <div class="runsList-container custom-table">
                        <div class="row">
                            <div class="col-12">
                                <div class="d-flex flex-wrap align-items-center gap-2 mb-2" role="group"
                                     :aria-label="$t('pipeline.list.presets.title')">
                                    <small class="text-muted">{{$t('pipeline.list.presets.title')}}:</small>
                                    <button v-for="preset in presets" :key="preset.key" type="button"
                                            class="preset-chip" :class="{ active: activePreset === preset.key }"
                                            :style="{ '--preset-color': preset.color }"
                                            :aria-pressed="activePreset === preset.key"
                                            @click="applyPreset(preset)">
                                        <font-awesome-icon :icon="`fa ${preset.icon}`" />
                                        {{$t(`pipeline.list.presets.${preset.key}`)}}
                                    </button>
                                </div>
                                <form class="row g-2 list-filter" @submit.prevent="search">
                                    <div class="col-12 col-md-4 col-xl-3 mb-2">
                                        <label for="run-filter-name">{{$t('pipeline.list.searchByIdOrName')}}:</label>
                                        <input id="run-filter-name" v-model="filters.name" type="text"
                                               class="form-control form-control-sm" :placeholder="$t('common.name')">
                                    </div>
                                    <div class="col-6 col-md-4 col-xl-2 mb-2">
                                        <label for="run-filter-start">{{$t('pipeline.list.periodStart')}}: </label>
                                        <input id="run-filter-start" v-model="filters.start" type="date"
                                               class="form-control form-control-sm">
                                    </div>
                                    <div class="col-6 col-md-4 col-xl-2 mb-2">
                                        <label for="run-filter-end">{{$t('pipeline.list.periodFinish')}}: </label>
                                        <input id="run-filter-end" v-model="filters.end" type="date"
                                               class="form-control form-control-sm">
                                    </div>
                                    <div class="col-6 col-md-4 col-xl-3 mb-2">
                                        <label for="run-filter-status">{{$t('common.status')}}: </label>
                                        <select id="run-filter-status" v-model="filters.status"
                                                class="form-select form-select-sm">
                                            <option value="">
                                                {{$t('pipeline.list.allStatuses')}}
                                            </option>
                                            <option v-if="filters.status && filters.status.includes(',')"
                                                    :value="filters.status">
                                                {{statusLabel(filters.status)}}
                                            </option>
                                            <option v-for="status in statuses" :key="status" :value="status">
                                                {{$t(`status.${status}`)}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-6 col-md-4 col-xl-2 mb-2">
                                        <label for="run-filter-limit">{{$t('common.limit')}}: </label>
                                        <select id="run-filter-limit" v-model="filters.limit"
                                                class="form-select form-select-sm">
                                            <option v-for="n in [10, 25, 50, 100]" :key="n" :value="n">
                                                {{n}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-12 d-flex flex-wrap align-items-center gap-2 mb-2">
                                        <button ref="searchBtn" type="submit" class="btn btn-secondary btn-sm btn-spinner">
                                            <font-awesome-icon icon="fa fa-search default-icon" /> {{$t('actions.search')}}
                                            <font-awesome-icon icon="spinner" pulse class="icon" />
                                        </button>
                                        <button type="button" class="btn btn-link btn-sm" @click="clearFilters">
                                            {{$t('actions.clearFilters')}}
                                        </button>
                                        <span v-for="chip in activeFilters" :key="chip.key" class="filter-chip">
                                            {{chip.label}}: <strong>{{chip.value}}</strong>
                                            <button type="button" class="btn-close btn-close-sm"
                                                    :aria-label="$t('actions.clearFilters') + ': ' + chip.label"
                                                    @click="removeFilter(chip.key)" />
                                        </span>
                                        <span class="live-indicator ms-auto" :class="{ off: !live }" role="status">
                                            <font-awesome-icon icon="fa fa-circle" />
                                            {{live ? $t('pipeline.list.live') : $t('pipeline.list.reconnecting')}}
                                        </span>
                                    </div>
                                </form>
                                <v-server-table id="runsList" ref="runsList" :columns="columns"
                                                :options="options" name="runsList">
                                    <template #id="props">
                                        <router-link :to="{ name: 'pipelineRunDetail', params: { id: props.row.id } }">
                                            {{props.row.id}}
                                        </router-link>
                                    </template>
                                    <template #pipeline_name="props">
                                        <router-link :to="{ name: 'pipelineEdit', params: { id: props.row.pipeline_id } }">
                                            <font-awesome-icon icon="fa fa-circle-nodes" class="text-muted" />
                                            {{props.row.pipeline_id}} - {{props.row.pipeline_name}}
                                        </router-link>
                                    </template>
                                    <template #rowDetails="props">
                                        <div class="context-vars-container">
                                            <div class="context-vars-header">
                                                <small class="text-muted">
                                                    <span class="context-connector" aria-hidden="true">↳</span>
                                                    {{$t('pipeline.list.contextVariablesOf', { id: props.row.id })}}
                                                </small>
                                                <button type="button" class="btn btn-link btn-sm context-var-add"
                                                        :title="$t('pipeline.schedule.addContextVariable')"
                                                        @click.stop="openContextEditor(props.row)">
                                                    <font-awesome-icon icon="plus" /> {{$t('pipeline.schedule.addContextData')}}
                                                </button>
                                            </div>
                                            <div class="context-vars-list d-flex flex-wrap gap-1">
                                                <span v-for="data in props.row.context_data" :key="data.name"
                                                      class="context-var-chip"
                                                      :title="`${data.name}: ${data.value}`">
                                                    <span class="context-var-value">
                                                        <strong>{{data.name}}</strong>: {{data.value}}
                                                    </span>
                                                    <span class="context-var-actions">
                                                        <button type="button" class="btn btn-link btn-sm"
                                                                :title="$t('actions.edit')"
                                                                @click.stop="openContextEditor(props.row, data)">
                                                            <font-awesome-icon icon="pen" />
                                                        </button>
                                                        <button type="button" class="btn btn-link btn-sm text-danger"
                                                                :title="$t('actions.delete')"
                                                                @click.stop="removeContextVariable(props.row, data)">
                                                            <font-awesome-icon icon="trash" />
                                                        </button>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </template>
                                    <template #start="props">
                                        {{$filters.formatJsonDate(props.row.start)}} {{$t('common.until')}} {{$filters.formatJsonDate(props.row.finish)}}
                                    </template>
                                    <template #updated="props">
                                        {{$filters.formatJsonDate(props.row.updated, 'dd/MM/yyyy HH:mm:ss')}}
                                    </template>
                                    <template #comment="props">
                                        <div class="comment-cell" :title="props.row.comment || ''">
                                            <span class="comment-text">{{commentPreview(props.row.comment)}}</span>
                                            <button type="button" class="btn btn-link btn-sm comment-edit"
                                                    :aria-label="$t('actions.edit') + ' ' + $t('titles.comment')"
                                                    :title="$t('actions.edit') + ' ' + $t('titles.comment')"
                                                    @click.stop="openCommentEditor(props.row)">
                                                <font-awesome-icon icon="fa fa-pen-to-square" />
                                            </button>
                                        </div>
                                    </template>
                                    <template #steps="props">
                                        <div class="d-flex flex-wrap gap-1 pb-2">
                                            <template v-for="step in props.row.steps" :key="step.id">
                                                <a :id="`step-${step.id}`" href="#" role="button"
                                                   class="arrow-step d-flex flex-column align-items-center justify-content-center text-center mb-1"
                                                   :style="{ '--status-color': statusOf(step.status).color }"
                                                   :aria-label="`${step.name}: ${$t(`status.${step.status}`)}`"
                                                   @click.prevent="confirmGoToWorkflow(step)">
                                                    <span class="step-name text-uppercase fw-bold text-truncate">{{step.name}}</span>
                                                    <span class="step-status">
                                                        <font-awesome-icon :icon="`fa ${statusOf(step.status).icon}`"
                                                                           :spin="statusOf(step.status).spin" />
                                                        {{$t(`status.${step.status}`)}}
                                                    </span>
                                                </a>
                                                <b-popover :target="`step-${step.id}`" placement="top" noninteractive>
                                                    <template #title>
                                                        {{step.name}}
                                                    </template>
                                                    <div class="step-popover">
                                                        <div :style="{ color: statusOf(step.status).color }" class="fw-bold">
                                                            <font-awesome-icon :icon="`fa ${statusOf(step.status).icon}`"
                                                                               :spin="statusOf(step.status).spin" />
                                                            {{$t(`status.${step.status}`)}}
                                                        </div>
                                                        <div>
                                                            <strong>{{$t('common.updated')}}:</strong>
                                                            {{$filters.formatJsonDate(step.updated, 'dd/MM/yyyy HH:mm:ss')}}
                                                        </div>
                                                        <small class="text-muted">
                                                            {{$t('pipeline.list.openWorkflow', { id: step.workflow_id })}}
                                                        </small>
                                                    </div>
                                                </b-popover>
                                            </template>
                                        </div>
                                    </template>
                                    <template #status="props">
                                        <span class="run-status" :style="{ '--status-color': statusOf(props.row.status).color }">
                                            <font-awesome-icon :icon="`fa ${statusOf(props.row.status).icon}`"
                                                               :spin="statusOf(props.row.status).spin" />
                                            {{$t(`status.${props.row.status}`)}}
                                        </span>
                                    </template>
                                    <template #actions="props">
                                        <button v-if="!props.row.context_data?.length" type="button"
                                                class="btn btn-sm btn-link text-secondary"
                                                :title="$t('pipeline.list.addContext')"
                                                :aria-label="$t('pipeline.list.addContext')"
                                                @click.stop="openContextEditor(props.row)">
                                            <font-awesome-icon icon="plus" />
                                        </button>
                                        <button type="button" class="btn btn-sm btn-link text-secondary row-delete"
                                                :title="$t('actions.delete')" :aria-label="$t('actions.delete')"
                                                @click.stop="remove(props.row.id)">
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                    </template>
                                </v-server-table>
                            </div>
                        </div>
                        <details open class="col-12 border-left mt-3">
                            <summary class="h6">
                                {{$t('titles.notification', 2)}}
                            </summary>
                            <pipeline-run-notifications ref="notificationsList" />
                        </details>
                    </div>
                </div>
            </div>
        </div>
        <dialog ref="commentDialog" class="comment-dialog" @cancel.prevent="closeCommentEditor">
            <form method="dialog" @submit.prevent="saveComment">
                <div class="comment-dialog-header">
                    <h2 class="h5 mb-0">
                        {{$t('titles.comment')}}
                        <span v-if="editingCommentRun">#{{editingCommentRun.id}}</span>
                    </h2>
                    <button type="button" class="btn-close" :aria-label="$t('actions.cancel')"
                            @click="closeCommentEditor" />
                </div>
                <div class="mb-3">
                    <label for="pipeline-run-comment" class="form-label">{{$t('titles.comment')}}</label>
                    <textarea id="pipeline-run-comment" v-model="commentDraft" class="form-control"
                              rows="6" maxlength="200" autofocus />
                    <div class="form-text text-end">
                        {{commentDraft.length}}/200
                    </div>
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary" :disabled="commentSaving"
                            @click="closeCommentEditor">
                        {{$t('actions.cancel')}}
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="commentSaving">
                        <font-awesome-icon v-if="commentSaving" icon="spinner" pulse />
                        {{$t('actions.save')}}
                    </button>
                </div>
            </form>
        </dialog>
        <dialog ref="contextDialog" class="context-dialog" @cancel.prevent="closeContextEditor">
            <form method="dialog" @submit.prevent="saveContextVariable">
                <div class="context-dialog-header">
                    <h2 class="h5 mb-0">
                        {{$t('pipeline.schedule.contextData')}}
                    </h2>
                    <button type="button" class="btn-close" :aria-label="$t('actions.cancel')"
                            @click="closeContextEditor" />
                </div>
                <div class="mb-3">
                    <label for="pipeline-run-context-name" class="form-label">
                        {{$t('pipeline.schedule.contextName')}}
                    </label>
                    <input id="pipeline-run-context-name" v-model="contextName" class="form-control"
                           maxlength="200" required :readonly="Boolean(editingContextVariable)">
                </div>
                <div class="mb-3">
                    <label for="pipeline-run-context-value" class="form-label">
                        {{$t('pipeline.schedule.contextValue')}}
                    </label>
                    <textarea id="pipeline-run-context-value" v-model="contextValue" class="form-control"
                              rows="5" maxlength="4000" required />
                    <div class="form-text text-end">
                        {{contextValue.length}}/4000
                    </div>
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary" :disabled="contextSaving"
                            @click="closeContextEditor">
                        {{$t('actions.cancel')}}
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="contextSaving">
                        <font-awesome-icon v-if="contextSaving" icon="spinner" pulse />
                        {{$t('actions.save')}}
                    </button>
                </div>
            </form>
        </dialog>
    </main>
</template>

<script>
import axios from 'axios';
import { useWebSocket } from '@/composables/websocket.js';
import PipelineRunNotifications from '@/components/PipelineRunNotifications.vue';
import Notifier from '@/mixins/Notifier.js';
import DataTableBuilder from '@/data-table-builder.js';
import { RUN_STATUS, statusOf } from '@/views/pipeline/run-status.js';
import { RUN_PRESETS, presetFilters } from '@/views/pipeline/run-presets.js';

const standUrl = import.meta.env.VITE_STAND_URL;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;

const { connectWebSocket, disconnectWebSocket, joinRoom } = useWebSocket();

export default {
    components: {
        PipelineRunNotifications
    },
    mixins: [Notifier],
    data() {
        return {
            statuses: Object.keys(RUN_STATUS),
            presets: RUN_PRESETS,
            live: false,
            filters: { // binding
                status: '',
                name: null,
                pipeline: null,
                start: null,
                end: null,
                dateType: 'updated',
                limit: 10,

            },
            fromPipelineEdit: false,
            editingCommentRun: null,
            commentDraft: '',
            commentSaving: false,
            editingContextRun: null,
            editingContextVariable: null,
            contextName: '',
            contextValue: '',
            contextSaving: false,
            ...new DataTableBuilder(this.$t)
                .columns(
                    'id',
                    'pipeline_name',
                    'status',
                    'start',
                    'updated',
                    'comment',
                    'steps',
                    'actions',
                )
                .skin('table-sm table table-hover')
                .perPageValues([])
                .columnClasses({
                    status: 'text-center',
                    updated: 'text-center',
                })
                .headings({
                    id: 'ID',
                    pipeline_name: this.$t('titles.pipeline'),
                    start: this.$t('common.period'),
                    updated: this.$t('common.updated'),
                    status: this.$t('common.status'),
                    steps: this.$t('pipeline.list.steps'),
                    actions: this.$t('titles.action', 2),
                    comment: this.$t('titles.comment', 2),
                })
                .sortable('id', 'pipeline_name', 'start', 'updated')
                .filterable()
                .rowDetails(row => Boolean(row.context_data?.length))
                .requestFunction(this.load)
                .orderBy('updated', false)
                .zebra()
                .onRowClick(this.openRun)
                .build()
        };
    },
    computed: {
        activePreset() {
            const f = this.filters;
            if (f.name) return null;
            return this.presets.find(p => {
                const v = presetFilters(p);
                return (f.status || '') === v.status && (f.start || null) === v.start && (f.end || null) === v.end;
            })?.key;
        },
        activeFilters() {
            const f = this.filters;
            return [
                f.name && { key: 'name', label: this.$t('common.name'), value: f.name },
                f.status && { key: 'status', label: this.$t('common.status'), value: this.statusLabel(f.status) },
                f.start && { key: 'start', label: this.$t('pipeline.list.periodStart'), value: f.start },
                f.end && { key: 'end', label: this.$t('pipeline.list.periodFinish'), value: f.end },
            ].filter(Boolean);
        }
    },
    watch: {
        '$route'() {
            disconnectWebSocket();
        }
    },
    mounted() {
        if (this.$route.params.from === 'PipelineEdit') this.fromPipelineEdit = true;
        else this.fromPipelineEdit = false;

        const eventHandlers = {
            'connect': () => {
                this.live = true;
                joinRoom('pipeline_runs', true);
            },
            'disconnect': () => {
                this.live = false;
            },
            'update pipeline run': (msg) => {
                if (!msg.pipeline_run) {
                    return;
                }
                this.$refs.notificationsList.push(msg);
                if (!msg.cache) {
                    this.$refs.runsList.refresh();
                }
            },
        };
        connectWebSocket(standSocketServer, standNamespace, standSocketIoPath,
            eventHandlers);
    },
    beforeMount() {
        Object.assign(this.filters, JSON.parse(localStorage.getItem('pipeline_run:list:filters') || '{}'));
    },
    unmounted() {
        disconnectWebSocket();
    },
    methods: {
        statusOf,
        statusLabel(status) {
            return status.split(',').map(st => this.$t(`status.${st}`)).join(', ');
        },
        applyPreset(preset) {
            Object.assign(this.filters, { name: null }, presetFilters(preset));
            this.search();
        },
        confirmGoToWorkflow(step) {
            this.confirm(
                step.name,
                this.$t('pipeline.list.goToWorkflowQuestion', { id: step.workflow_id }),
                () => this.$router.push({ name: 'sql-workflow', params: { id: step.workflow_id } })
            );
        },
        clearFilters() {
            Object.assign(this.filters, { status: '', name: null, start: null, end: null });
            this.search();
        },
        removeFilter(key) {
            this.filters[key] = key === 'status' ? '' : null;
            this.search();
        },
        openRun(row, event) {
            if (event.target.closest('a, button, input, select, textarea')) return;
            this.$router.push({ name: 'pipelineRunDetail', params: { id: row.id } });
        },
        async search() {
            const query = {};
            this.$router.replace({ query }).catch(() => { });
            this.$refs.runsList.refresh();
        },
        openCommentEditor(run) {
            this.editingCommentRun = run;
            this.commentDraft = run.comment || '';
            this.$nextTick(() => this.$refs.commentDialog.showModal());
        },
        commentPreview(comment) {
            if (!comment) return '—';
            return comment.length > 50 ? `${comment.slice(0, 50)}…` : comment;
        },
        closeCommentEditor() {
            if (this.$refs.commentDialog?.open) {
                this.$refs.commentDialog.close();
            }
            this.editingCommentRun = null;
            this.commentDraft = '';
        },
        async saveComment() {
            if (!this.editingCommentRun || this.commentSaving) return;

            this.commentSaving = true;
            try {
                const comment = this.commentDraft === '' ? null : this.commentDraft;
                const resp = await axios.patch(
                    `${standUrl}/pipeline-runs/${this.editingCommentRun.id}/comment`,
                    { comment }
                );
                Object.assign(this.editingCommentRun, resp.data.data?.[0] || { comment });
                this.$refs.runsList.refresh();
                this.success(this.$t('messages.savedWithSuccess', {
                    what: this.$t('titles.comment')
                }));
                this.closeCommentEditor();
            } catch (e) {
                this.error(e);
            } finally {
                this.commentSaving = false;
            }
        },
        openContextEditor(run, variable = null) {
            this.editingContextRun = run;
            this.editingContextVariable = variable;
            this.contextName = variable?.name || '';
            this.contextValue = variable?.value || '';
            this.$nextTick(() => this.$refs.contextDialog.showModal());
        },
        closeContextEditor() {
            if (this.$refs.contextDialog?.open) {
                this.$refs.contextDialog.close();
            }
            this.editingContextRun = null;
            this.editingContextVariable = null;
            this.contextName = '';
            this.contextValue = '';
        },
        async saveContextVariable() {
            const name = this.contextName.trim();
            if (!this.editingContextRun || !name || this.contextSaving) return;

            this.contextSaving = true;
            try {
                const resp = await axios.patch(
                    `${standUrl}/pipeline-runs/${this.editingContextRun.id}/context`,
                    { name, value: this.contextValue }
                );
                const savedVariable = resp.data.data?.[0] || { name, value: this.contextValue };
                const contextData = this.editingContextRun.context_data || [];
                const index = contextData.findIndex(variable => variable.name === savedVariable.name);
                if (index === -1) contextData.push(savedVariable);
                else contextData.splice(index, 1, savedVariable);
                this.editingContextRun.context_data = [...contextData];
                const action = this.editingContextVariable
                    ? this.$t('actions.edit')
                    : this.$t('actions.add', {
                        type: this.$t('pipeline.schedule.contextData')
                    });
                this.success(
                    `${action}: ${this.$t('messages.savedWithSuccess', {
                        what: this.$t('pipeline.schedule.contextData')
                    })}`,
                    10000
                );
                this.$refs.runsList.refresh();
                this.closeContextEditor();
            } catch (e) {
                this.error(e);
            } finally {
                this.contextSaving = false;
            }
        },
        removeContextVariable(run, variable) {
            this.confirm(
                this.$t('actions.delete'),
                `${this.$t('actions.delete')} ${variable.name}?`,
                async () => {
                    try {
                        await axios.delete(
                            `${standUrl}/pipeline-runs/${run.id}/context/${encodeURIComponent(variable.name)}`
                        );
                        run.context_data = (run.context_data || [])
                            .filter(context => context.name !== variable.name);
                        this.success(this.$t('messages.successDeletion', { what: variable.name }));
                        this.$refs.runsList.refresh();
                    } catch (e) {
                        this.error(e);
                    }
                }
            );
        },
        detail(step) {
            console.debug(step);
        },
        async load(data) {
            localStorage.setItem('pipeline_run:list:filters', JSON.stringify(this.filters));
            data.sort = data.orderBy;
            data.asc = data.ascending === 1 ? 'true' : 'false';
            data.size = this.filters.limit;
            data.name = this.filters.name;
            data.status = this.filters.status;
            data.pipelines = this.filters.pipeline;
            data.start = this.filters.start;
            data.end = this.filters.end;
            data.dateType = this.filters.dateType;

            if (this.$route.query.id) {
                data.name = this.$route.query.id;
                this.filters.name = data.name;
            }
            //data.fields = 'id,name,version,created,updated,user_name';

            this.$Progress.start();
            try {
                const resp = await axios.get(`${standUrl}/pipeline-runs`,
                    { params: data });
                return { data: resp.data.data, count: resp.data.pagination.total };
            } catch (e) {
                this.error(e);
            } finally {
                this.$Progress.finish();
            }
        },
        remove(id) {
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    axios
                        .delete(`${standUrl}/pipeline-runs/${id}`, {})
                        .then(() => {
                            this.success(
                                this.$t('messages.successDeletion', {
                                    what: 'Execução Pipeline'
                                })
                            );
                            this.$refs.runsList.refresh();
                        })
                        .catch(
                            function (e) {
                                this.error(e);
                            }.bind(this)
                        );
                }
            );
        }
    }
};


</script>
<style>
@keyframes highlightRow {

    0%,
    100% {
        background-color: #ffffff;
    }

    50% {
        background-color: #d4daed;
    }
}

.highlight {
    animation: highlightRow 5s forwards;
}

.context-var-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.15rem;
    background: #e9ecef;
    color: #495057;
    border-radius: 1rem;
    padding: 0.1rem 0.6rem;
    font-size: 0.75rem;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
}

.context-connector {
    font-size: 1rem;
    margin-right: 0.25rem;
    color: #6c757d;
}

.context-vars-container {
    max-width: 100%;
    margin-left: 1.25rem;
    padding-left: 0.75rem;
    border-left: 3px solid #ced4da;
}

.context-vars-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.15rem;
}

.context-vars-list {
    align-items: flex-start;
}

.context-var-add {
    padding: 0 0.25rem;
}

.row-details > td {
    background-color: inherit;
    border-top: 0;
    padding: 0.35rem 0.5rem 0.6rem;
}

.context-var-value {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.context-var-actions {
    flex: none;
    display: inline-flex;
    white-space: nowrap;
}

.context-var-actions .btn {
    padding: 0 0.2rem;
}

.comment-cell {
    display: block;
    min-width: 16rem;
    max-width: 32rem;
}

.comment-text {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.comment-edit {
    margin-left: 0.35rem;
    padding: 0.1rem 0.25rem;
}

.comment-dialog {
    width: min(42rem, calc(100vw - 2rem));
    border: 0;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 2rem rgb(0 0 0 / 25%);
    padding: 1.25rem;
}

.comment-dialog::backdrop {
    background: rgb(0 0 0 / 45%);
}

.comment-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.context-dialog {
    width: min(36rem, calc(100vw - 2rem));
    border: 0;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 2rem rgb(0 0 0 / 25%);
    padding: 1.25rem;
}

.context-dialog::backdrop {
    background: rgb(0 0 0 / 45%);
}

.context-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.arrow-step {
    position: relative;
    background: var(--status-color, #6c757d);
    color: white !important;
    padding: 1px 14px 1px 14px;
    margin-right: 1px;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%, 8px 50%);
    min-width: 120px;
    max-width: 200px;
    min-height: 38px;
    cursor: pointer;
    text-decoration: none !important;
}

.arrow-step:hover,
.arrow-step:focus-visible {
    filter: brightness(0.8);
    outline: none;
}

.arrow-step:focus-visible .step-name {
    text-decoration: underline;
}

.arrow-step:first-child {
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%);
}

.arrow-step:last-child {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 8px 50%);
    margin-right: 0;
}

.arrow-step .step-name {
    font-size: 0.75rem;
    max-width: 100%;
}

.arrow-step .step-status {
    font-size: 0.7rem;
}

.run-status {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    color: white;
    white-space: nowrap;
    background: var(--status-color);
}

.preset-chip {
    padding: 0.15rem 0.7rem;
    border: 1px solid var(--preset-color);
    border-radius: 1rem;
    background: transparent;
    color: var(--preset-color);
    font-size: 0.8rem;
}

.preset-chip:hover,
.preset-chip.active {
    background: var(--preset-color);
    color: white;
}

.filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.1rem 0.6rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    background: #e9ecef;
    color: #495057;
}

.btn-close-sm {
    font-size: 0.6rem;
}

.live-indicator {
    font-size: 0.8rem;
    color: #1f7a3d;
}

.live-indicator.off {
    color: #5f6b76;
}

.row-delete {
    opacity: 0.45;
}

tr:hover .row-delete,
.row-delete:focus-visible {
    opacity: 1;
    color: #b02a37 !important;
}

.tooltip-large .tooltip-inner {
    min-width: 300px;
    white-space: pre-wrap;
    font-size: 0.95rem;
    background-color: #333;
}

.tooltip-large .tooltip-inner a {
    color: white;
    text-decoration: underline;
}
</style>
