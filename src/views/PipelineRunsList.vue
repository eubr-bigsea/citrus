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
                            <div class="col-10">
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
                                            {{ props.row.pipeline_id }} -
                                            {{ props.row.pipeline_name }}
                                        </router-link>
                                    </template>
                                    <template #period="props">
                                        {{ props.row.start | formatJsonDate('dd/MM/yyyy') }} até {{ props.row.finish |
                                            formatJsonDate('dd/MM/yyyy') }}
                                    </template>
                                    <template #updated="props">
                                        {{ props.row.updated | formatJsonDate('dd/MM/yyyy HH:mm:SS') }}
                                    </template>
                                    <template #status="props">
                                        <div class="pipeline-runs-status" :class="props.row.status.toLowerCase()"
                                            :data-id="props.row.id">
                                            {{ $tc(`status.${props.row.status}`) }}
                                        </div>
                                    </template>
                                </v-server-table>
                            </div>
                            <div class="col-2 border-left">
                                <h6>Notificações</h6>
                                <pipeline-run-notifications :notifications="notifications"/>
                            </div>
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

const standUrl = import.meta.env.VITE_STAND_URL;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;

const { connectWebSocket, disconnectWebSocket, joinRoom } = useWebSocket();

export default {
    components: {
        PipelineRunNotifications
    },
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
                'period',
                'updated',
                'last_executed_step',
                'comment',
                'status',
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
                    comment: this.$tc('titles.comment', 2)
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
                this.notifications.unshift({id: msg.pipeline_run.id,
                    status: msg.pipeline_step_run.status, date: msg.date,
                    order: msg.pipeline_step_run.order});
                this.notifications.length = this.notifications.length > 100? 100
                    : this.notifications.length;
                if (!msg.cache) {
                    const run = msg.pipeline_run;
                    //const elem = this.$refs.runsList.$el.querySelector(`[data-id="${run.id}"]`); // Not working
                    const elem = document.getElementById('runsList')
                        .querySelector(`[data-id="${run.id}"]`);
                    if (elem) {
                        elem.className = 'runsList-status';
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
    unmounted() {
        disconnectWebSocket();
    },
    beforeMount() {
        this.filters = JSON.parse(localStorage.getItem('pipeline_run:list:filters') || '{}');
    },
    methods: {
        async search() {
            const query = {};
            this.$router.replace({ query }).catch(() => { });
            this.$refs.runsList.refresh();
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

</style>
