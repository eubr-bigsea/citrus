<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1 v-if="fromPipelineEdit">
                Execuções - {{ $route.params.name }}
            </h1>
            <h1 v-else class="runsList-title">
                {{ $t('titles.pipelineRuns', 2) }}
            </h1>
            <router-link v-if="fromPipelineEdit" :to="{ name: 'pipelineEdit', params: { id: $route.params.id } }"
                class="btn btn-outline-primary d-print-none float-right btn-sm">
                <font-awesome-icon icon="fa-chevron-left" />
                &nbsp; {{ $t('actions.back') }} -
                Pipeline #{{ $route.params.id }}
            </router-link>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="runsList-body">
                    <div class="runsList-container custom-table">
                        <div class="row">
                            <div class="col-12">
                                <form class="form-row list-filter">
                                    <div class="form-group col-3">
                                        <label for="search">Id ou {{ $tc('common.name') }} da pipeline:</label>
                                        <input v-model="filters.name" type="text" class="form-control form-control-sm"
                                            :placeholder="$tc('common.name')">
                                    </div>
                                    <div class="form-group col-2">
                                        <label for="range">{{ $tc('titles.start') }} do período: </label>
                                        <input v-model="filters.start" type="date"
                                            class="form-control form-control-sm" />
                                    </div>

                                    <div class="form-group col-2">
                                        <label for="range">{{ $tc('common.end') }} do período: </label>
                                        <input v-model="filters.end" type="date" class="form-control form-control-sm" />
                                    </div>

                                    <div class="form-group col-2">
                                        <label for="status">{{ $tc('common.status') }}: </label>
                                        <select v-model="filters.status" class="form-control form-control-sm"
                                            name="status">
                                            <option selected value=""></option>
                                            <option v-for="status in statuses" :value="status">{{
                                                $tc(`status.${status}`) }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form-group col-1">
                                        <label for="limit">{{ $tc('common.limit') }}: </label>
                                        <select v-model="filters.limit" class="form-control form-control-sm"
                                            name="limit">
                                            <option selected value="10">10</option>
                                            <option selected value="25">25</option>
                                            <option selected value="50">50</option>
                                            <option selected value="100">100</option>
                                        </select>
                                    </div>
                                    <div class="col-12 mt-2">
                                        <button ref="searchBtn" class="btn btn-secondary btn-sm mb-2 btn-spinner"
                                            @click.prevent="search">
                                            <font-awesome-icon icon="fa fa-search default-icon" /> {{
                                                $t('actions.search') }}
                                            <font-awesome-icon icon="spinner" pulse class="icon" />
                                        </button>
                                    </div>
                                </form>

                                <v-server-table ref="runsList" :columns="columns" :options="options" name="runsList"
                                    :key="key" id="runsList">
                                    <template #id="props">
                                        <router-link :to="{ name: 'pipelineRunDetail', params: { id: props.row.id } }">
                                            {{ props.row.id }}
                                        </router-link>
                                    </template>
                                    <template #pipeline_name="props">
                                        <router-link
                                            :to="{ name: 'pipelineEdit', params: { id: props.row.pipeline_id } }">
                                            <font-awesome-icon icon="fa fa-circle-nodes" class="text-success" /> {{
                                                props.row.pipeline_id }} -
                                            {{ props.row.pipeline_name }}
                                        </router-link>
                                        <div v-if="props.row.context_data && props.row.context_data.length > 0" class="mt-1" title="Variáveis de contexto">
                                                <span v-for="data in props.row.context_data" :key="data.name" class="text-muted mr-2 small">{{ data.name }}={{ data.value }}</span>
                                        </div>
                                    </template>
                                    <template #period="props">
                                        {{ props.row.start | formatJsonDate('dd/MM/yyyy') }} até {{ props.row.finish |
                                            formatJsonDate('dd/MM/yyyy') }}
                                    </template>
                                    <template #updated="props" class="text-center">

                                        <font-awesome-icon icon="fa fa-calendar-alt"
                                            :title="props.row.updated | formatJsonDate('dd/MM/yyyy HH:mm:SS')"
                                            class="text-info" />
                                        {{ props.row.updated | formatJsonDate('dd/MM/yyyy HH:mm:SS') }}

                                    </template>
                                    <template #comment="props">
                                        <div class="">
                                            <font-awesome-icon icon="fa fa-info-circle" :title="props.row.comment"
                                                class="text-primary" size="2x" />
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
                                                        $tc(`status.${step.status}`) }}
                                                    </div>
                                                </div>
                                                <b-tooltip :target="'tooltip-target-' + step.id" triggers="hover"
                                                    custom-class="tooltip-large">
                                                    <div>
                                                        <strong>Atualização:</strong> {{ step.updated |
                                                            formatJsonDate('dd/MM/yyyy HH:mm:SS') }} <br>
                                                        <router-link
                                                            :to="{ name: 'sql-workflow', params: { id: step.workflow_id, platform: 2 } }">
                                                            Ir para o fluxo de trabalho #{{ step.workflow_id }}
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
                            <h6>Notificações</h6>
                            <pipeline-run-notifications :notifications="notifications" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import { useWebSocket } from '@/composables/websocket.js';
import PipelineRunNotifications from '@/components/PipelineRunNotifications.vue';
import Notifier from '@/mixins/Notifier.js';

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
            notifications: [],
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
            columns: [
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
            ],
            options: {
                skin: 'table-sm table table-hover',
                perPageValues: [],
                dateColumns: [],
                columnsClasses: {
                    last_executed_step: 'text-center',
                    status: 'text-center',
                },
                headings: {
                    id: 'ID',
                    pipeline_name: this.$tc('titles.pipeline'),
                    pipeline_id: `${this.$tc('titles.pipeline')} Id`,
                    period: this.$tc('common.period'),
                    updated: this.$tc('common.updated'),
                    last_executed_step: 'Última Etapa',
                    status: this.$tc('common.status'),
                    actions: this.$tc('titles.action', 2),
                    comment: this.$tc('titles.comment', 2),
                    context: 'Variáveis',
                },
                sortable: ['id', 'pipeline_id', 'pipeline_name', 'period', 'updated',],
                filterable: false,
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ml-10',
                    up: 'sort-up',
                    down: 'sort-down'
                },
                preserveState: true,
                saveState: true,
                texts: {
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                },
                requestFunction: this.load,
                width: ['5%', '25%', '10%', '10%', '10%', '40%'],
            },
            orderBy: null,
            ascending: null,
            key: 1
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
                this.notifications.unshift({
                    id: msg.pipeline_run.id,
                    status: msg.pipeline_step_run.status, date: msg.date,
                    order: msg.pipeline_step_run.order
                });
                this.notifications.length = this.notifications.length > 100 ? 100
                    : this.notifications.length;
                if (!msg.cache) {
                    const run = msg.pipeline_run;
                    let elem = document.getElementById('runsList');
                    if (elem)
                        elem = elem.querySelector(`[data-id="${run.id}"]`);
                    if (elem) {
                        elem.className = 'pipeline-runs-status';
                        elem.classList.add(run.status.toLowerCase());
                        elem.innerText = this.$tc(`status.${run.status}`).toUpperCase();

                        const row = elem.parentNode.parentNode;
                        const children = row.childNodes;
                        if (run.updated) {
                            children[4].innerText = run.updated;
                        }
                        if (run.last_step) {
                            children[5].innerText = run.last_step;
                        }

                        row.classList.add('highlight');
                        row.classList.add('font-weight-bold');
                        row.addEventListener('animationend', () => {
                            row.classList.remove('highlight');
                            row.classList.remove('font-weight-bold');
                        });
                    }
                }
            },
        };
        connectWebSocket(standSocketServer, standNamespace, standSocketIoPath,
            eventHandlers);
    },
    beforeMount() {
        this.filters = JSON.parse(localStorage.getItem('pipeline_run:list:filters') || '{}');
    },
    unmounted() {
        debugger
    },
    watch: {
        '$route': function (to, from) {
            debugger
            disconnectWebSocket();
        }
    },
    methods: {
        async search() {
            const query = {};
            this.$router.replace({ query }).catch(() => { });
            this.$refs.runsList.refresh();
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

            this.orderBy = data.sort;
            this.ascending = data.asc;

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
