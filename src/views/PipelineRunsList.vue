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
                        <form class="form-row list-filter">
                            <div class="form-group col-3">
                                <label for="search">Id ou {{ $tc('common.name') }} da pipeline:</label>
                                <input v-model="filters.name" type="text" class="form-control form-control-sm"
                                    :placeholder="$tc('common.name')">
                            </div>
                            <div class="form-group col-2">
                                <label for="range">{{ $tc('titles.start') }} do período: </label>
                                <input v-model="filters.start" type="date" class="form-control form-control-sm" />
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
                                    <option v-for="status in statuses" :value="status">{{ $tc(`status.${status}`) }}
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
                                    <font-awesome-icon icon="fa fa-search default-icon" /> {{ $t('actions.search') }}
                                    <font-awesome-icon icon="spinner" pulse class="icon" />
                                </button>
                            </div>
                        </form>
                        <v-server-table ref="runsList" :columns="columns" :options="options" name="runsList">
                            <template #id="props">
                                <router-link :to="{ name: 'pipelineRunDetail', params: { id: props.row.id } }">
                                    {{ props.row.id }}
                                </router-link>
                            </template>
                            <template #pipeline_name="props">
                                {{ props.row.pipeline_name }}
                            </template>
                            <template #pipeline_id="props">
                                <router-link :to="{ name: 'pipelineEdit', params: { id: props.row.pipeline_id } }">
                                    {{ props.row.pipeline_id }}
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
                                <div class="runsList-status" :class="props.row.status.toLowerCase()">
                                    {{ $tc(`status.${props.row.status}`).toUpperCase() }}
                                </div>
                            </template>
                        </v-server-table>
                    </div>
                </div>
            </div>

        </div>
    </main>
</template>

<script>
import axios from 'axios';

const standUrl = import.meta.env.VITE_STAND_URL;

export default {
    components: {
    },
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
                orderBy: null,
                ascending: null,
                limit: 10,

            },
            fromPipelineEdit: false,
            columns: [
                'id',
                'pipeline_id',
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
                requestFunction: this.load
            }
        };
    },
    mounted() {
        if (this.$route.params.from === 'PipelineEdit') this.fromPipelineEdit = true;
        else this.fromPipelineEdit = false;
    },
    beforeMount() {
        this.filters = JSON.parse(localStorage.getItem('pipeline_run:list:filters') || '{}');
    },
    methods: {
        async search() {
            const query = {};
            this.$router.replace({ query });
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