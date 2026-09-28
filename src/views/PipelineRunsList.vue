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
                                <form class="row g-2 list-filter">
                                    <div class="col-3 mb-2">
                                        <label for="search">{{$t('pipeline.list.searchByIdOrName')}}:</label>
                                        <input v-model="filters.name" type="text" class="form-control form-control-sm"
                                               :placeholder="$t('common.name')">
                                    </div>
                                    <div class="col-2 mb-2">
                                        <label for="range">{{$t('pipeline.list.periodStart')}}: </label>
                                        <input v-model="filters.start" type="date"
                                               class="form-control form-control-sm">
                                    </div>

                                    <div class="col-2 mb-2">
                                        <label for="range">{{$t('pipeline.list.periodFinish')}}: </label>
                                        <input v-model="filters.end" type="date" class="form-control form-control-sm">
                                    </div>

                                    <div class="col-2 mb-2">
                                        <label for="status">{{$t('common.status')}}: </label>
                                        <select v-model="filters.status" class="form-select form-select-sm"
                                                name="status">
                                            <option selected value="" />
                                            <option v-for="status in statuses" :key="status" :value="status">
                                                {{$t(`status.${status}`)}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-1 mb-2">
                                        <label for="limit">{{$t('common.limit')}}: </label>
                                        <select v-model="filters.limit" class="form-select form-select-sm"
                                                name="limit">
                                            <option selected value="10">
                                                10
                                            </option>
                                            <option selected value="25">
                                                25
                                            </option>
                                            <option selected value="50">
                                                50
                                            </option>
                                            <option selected value="100">
                                                100
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-12 mt-2">
                                        <button ref="searchBtn" class="btn btn-secondary btn-sm mb-2 btn-spinner"
                                                @click.prevent="search">
                                            <font-awesome-icon icon="fa fa-search default-icon" /> {{$t('actions.search')}}
                                            <font-awesome-icon icon="spinner" pulse class="icon" />
                                        </button>
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
                                        <router-link
                                            :to="{ name: 'pipelineEdit', params: { id: props.row.pipeline_id } }">
                                            <font-awesome-icon icon="fa fa-circle-nodes" class="text-success" /> {{
                                                props.row.pipeline_id }} -
                                            {{ props.row.pipeline_name }}
                                        </router-link>
                                        <button v-if="!props.row.context_data?.length" type="button"
                                                class="btn btn-link btn-sm context-var-add"
                                                :title="$t('pipeline.schedule.addContextData')"
                                                @click.stop="openContextEditor(props.row)">
                                            <font-awesome-icon icon="plus" />
                                        </button>
                                    </template>
                                    <template #rowDetails="props">
                                        <div class="context-vars-container" :title="$t('pipeline.list.contextVariables')">
                                            <div class="context-vars-header">
                                                <small class="text-muted">{{$t('pipeline.list.contextVariables')}}</small>
                                                <button type="button" class="btn btn-link btn-sm context-var-add"
                                                        :title="$t('pipeline.schedule.addContextData')"
                                                        @click.stop="openContextEditor(props.row)">
                                                    <font-awesome-icon icon="plus" />
                                                </button>
                                            </div>
                                            <div class="context-vars-list d-flex flex-wrap gap-1">
                                                <span v-for="data in props.row.context_data" :key="data.name"
                                                      class="context-var-chip"
                                                      :title="`${data.name}: ${data.value}`">
                                                    <span class="context-var-value">
                                                        <strong>{{ data.name }}</strong>: {{ data.value }}
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
                                    <template #period="props">
                                       {{ $filters.formatJsonDate(props.row.start) }} {{$t('common.until')}} {{ $filters.formatJsonDate(props.row.finish) }}
                                    </template>
                                    <template #updated="props" class="text-center">

                                        <font-awesome-icon icon="fa fa-calendar-alt"
                                            :title="$filters.formatJsonDate(props.row.updated, 'dd/MM/yyyy HH:mm:SS')"
                                            class="text-info" />
                                        {{ $filters.formatJsonDate(props.row.updated, 'dd/MM/yyyy HH:mm:SS') }}

                                    </template>
                                    <template #comment="props">
                                        <div class="comment-cell" :title="props.row.comment || ''">
                                            <span class="comment-text">{{ commentPreview(props.row.comment) }}</span>
                                            <button type="button" class="btn btn-link btn-sm comment-edit"
                                                    :aria-label="$t('actions.edit') + ' ' + $t('titles.comment')"
                                                    :title="$t('actions.edit') + ' ' + $t('titles.comment')"
                                                    @click.stop="openCommentEditor(props.row)">
                                                <font-awesome-icon icon="fa fa-pen-to-square" />
                                            </button>
                                        </div>
                                    </template>
                                    <template #statusStatus="props">
                                        <!-- Arrow Steps -->
                                        <div class="d-flex flex-wrap gap-2 pb-2">
                                            <div v-for="step in props.row.steps" :key="step.id" class="arrow-step d-flex flex-column align-items-center
                                                justify-content-center text-center mb-1 text-truncate"
                                                :class="step.status.toLowerCase()" :id="'tooltip-target-' + step.id">
                                                <div>
                                                    <div class="fw-bold text-uppercase" style="font-size: 0.65rem;">{{
                                                        step.name }}</div>
                                                    <div style="font-size: 0.55rem; opacity: 0.9;">{{
                                                        $t(`status.${step.status}`) }}
                                                    </div>
                                                </div>
                                                <b-tooltip :target="'tooltip-target-' + step.id" triggers="hover"
                                                    custom-class="tooltip-large">
                                                    <div>
                                                        <strong>{{$t('common.updated')}}:</strong> {{ $filters.formatJsonDate(step.updated, 'dd/MM/yyyy HH:mm:SS') }} <br>
                                                        <router-link
                                                            :to="{ name: 'sql-workflow', params: { id: step.workflow_id } }">
                                                            {{$t('pipeline.list.goToWorkflow')}} #{{ step.workflow_id }}
                                                        </router-link>
                                                    </div>
                                                </b-tooltip>
                                            </div>
                                            <!--
                                            <div
                                            class="arrow-step completed d-flex flex-column align-items-center justify-content-center text-center">
                                            <small class="fw-bold text-uppercase" style="font-size: 0.65rem;">Etapa
                                                    1</small>
                                                <small style="font-size: 0.55rem; opacity: 0.9;">Iniciação</small>
                                            </div>
                                            <div
                                                class="arrow-step completed d-flex flex-column align-items-center justify-content-center text-center">
                                                <small class="fw-bold text-uppercase" style="font-size: 0.65rem;">Etapa
                                                    2</small>
                                                <small style="font-size: 0.55rem; opacity: 0.9;">Planejamento</small>
                                            </div>

                                            <div
                                                class="arrow-step in-progress d-flex flex-column align-items-center justify-content-center text-center">
                                                <small class="fw-bold text-uppercase" style="font-size: 0.65rem;">Etapa
                                                    3</small>
                                                <small style="font-size: 0.55rem; opacity: 0.9;">Execução</small>
                                            </div>

                                            <div
                                            class="arrow-step pending d-flex flex-column align-items-center justify-content-center text-center">
                                            <small class="fw-bold text-uppercase" style="font-size: 0.65rem;">Etapa
                                                4</small>
                                                <small style="font-size: 0.55rem; opacity: 0.9;">Monitoramento</small>
                                            </div>

                                            <div
                                                class="arrow-step pending d-flex flex-column align-items-center justify-content-center text-center">
                                                <small class="fw-bold text-uppercase" style="font-size: 0.65rem;">Etapa
                                                    5</small>
                                                <small style="font-size: 0.55rem; opacity: 0.9;">Encerramento</small>
                                            </div>
                                        -->

                                        </div>
                                    </template>
                                    <template #status="props">
                                        <div class="lemonade-job" :class="props.row.status.toLowerCase()">
                                            {{$t(`status.${props.row.status}`).toUpperCase()}}
                                        </div>
                                    </template>
                                    <template #context="props">
                                        <a v-if="props.row.context_data" :href="`/pipeline-runs/${props.row.id}/context`" target="_blank">
                                            <font-awesome-icon icon="fa fa-gear" class="text-info" size="2x"/>
                                        </a>
                                    </template>
                                    <template #actions="props">
                                        <button class="btn btn-sm btn-danger" @click="remove(props.row.id)">
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                    </template>
                                </v-server-table>
                            </div>
                        </div>
                        <div class="col-12 border-left">
                            <h6>{{$t('titles.notification', 2)}}</h6>
                            <pipeline-run-notifications ref="notificationsList" />
                        </div>
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
                    <div class="form-text text-end">{{commentDraft.length}}/200</div>
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
                    <h2 class="h5 mb-0">{{$t('pipeline.schedule.contextData')}}</h2>
                    <button type="button" class="btn-close" :aria-label="$t('actions.cancel')"
                            @click="closeContextEditor" />
                </div>
                <div class="mb-3">
                    <label for="pipeline-run-context-name" class="form-label">
                        {{$t('pipeline.schedule.contextName')}}
                    </label>
                    <input id="pipeline-run-context-name" v-model="contextName" class="form-control"
                           maxlength="200" required :readonly="Boolean(editingContextVariable)" />
                </div>
                <div class="mb-3">
                    <label for="pipeline-run-context-value" class="form-label">
                        {{$t('pipeline.schedule.contextValue')}}
                    </label>
                    <textarea id="pipeline-run-context-value" v-model="contextValue" class="form-control"
                              rows="5" maxlength="4000" required />
                    <div class="form-text text-end">{{contextValue.length}}/4000</div>
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
            statuses: ['COMPLETED', 'CANCELED', 'ERROR', 'INTERRUPTED', 'PENDING',
                'RUNNING', 'WAITING', 'WAITING_INTERVENTION'],
            filters: { // binding
                status: null,
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
                    //'pipeline_id',
                    'pipeline_name',
                    'status',
                    'period',
                    'updated',
                    //'last_executed_step',
                    'comment',
                    //'context',
                    'statusStatus',
                    'actions',
                )
                .skin('table-sm table table-hover')
                .perPageValues([])
                .columnClasses({
                    last_executed_step: 'text-center',
                    status: 'text-center',
                })
                .headings({
                    id: 'ID',
                    pipeline_name: this.$t('titles.pipeline'),
                    period: this.$t('common.period'),
                    updated: this.$t('common.updated'),
                    status: this.$t('common.status'),
                    statusStatus: this.$t('common.status'),
                    actions: this.$t('titles.action', 2),
                    comment: this.$t('titles.comment', 2),
                })
                .sortable('id', 'pipeline_id', 'pipeline_name', 'period', 'updated')
                .filterable()
                .rowDetails(row => Boolean(row.context_data?.length))
                .requestFunction(this.load)
                .build()
        };
    },
    mounted() {
        if (this.$route.params.from === 'PipelineEdit') this.fromPipelineEdit = true;
        else this.fromPipelineEdit = false;

        const eventHandlers = {
            'connect': () => {
                joinRoom('pipeline_runs', true);
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
    watch: {
        '$route'() {
            disconnectWebSocket();
        }
    },
    methods: {
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
                    } catch (e) {
                        this.error(e);
                    }
                }
            );
        },
        detail(step) {
            console.debug(step)
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
    white-space: nowrap;
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
    background-color: #f8f9fa;
    border-top: 0;
    padding: 0.35rem 0.5rem 0.6rem;
}

.context-var-value {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.context-var-actions {
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
    background: #6c757d;
    color: white;
    padding: 1px 10px 1px 10px;
    margin-right: 1px;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%, 8px 50%);
    min-width: 120px;
    min-height: 35px;
    cursor: pointer;
}

.arrow-step:first-child {
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%);
    padding-left: 10px;
}

.arrow-step:last-child {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 8px 50%);
    padding-right: 10px;
    margin-right: 0;
}

.arrow-step.completed {
    background: linear-gradient(35deg, #28a745 0%, #40fffd 100%);
}

.arrow-step.in-progress {
    background: linear-gradient(35deg, #ffc107 0%, #ffb300 100%);
}

.arrow-step.pending {
    background: linear-gradient(35deg, #6c757d 0%, #5a6268 100%);
}

.arrow-step.running {
    background: linear-gradient(35deg, #5555ff 20%, #aa00ff 100%);
}

.arrow-step.error {
    background: linear-gradient(35deg, #aa2222 20%, #ff4444 100%);
    color: white;
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
