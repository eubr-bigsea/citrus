<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom">
            <h1 v-if="fromPipelineEdit" class="runsList-title">
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
                            <div class="form-group col-4">
                                <label for="search">{{ $tc('common.name') }} da pipeline:</label>
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
                                <select v-model="filters.status" class="ml-2 form-control form-control-sm"
                                    name="status">
                                    <option selected value=""></option>
                                    <option v-for="status in statuses" :value="status">{{ $tc(`status.${status}`) }}
                                    </option>
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
                            <template #pipeline_id="props">
                                    {{ props.row.pipeline_id }}
                            </template>
                            <template #pipeline_name="props">
                                <router-link :to="{ name: 'pipelineEdit', params: { id: props.row.id } }">
                                    {{ props.row.pipeline_name }}
                                </router-link>
                            </template>
                            <template #period="props">
                                {{ props.row.start | formatJsonDate('dd/MM/yyyy') }} até {{ props.row.finish |
                                    formatJsonDate('dd/MM/yyyy') }}
                            </template>
                            <template #updated="props">
                                {{ props.row.updated | formatJsonDate }}
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
    </div>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';

const standUrl = import.meta.env.VITE_STAND_URL;

export default {
    components: {
    },
    data() {
        return {
            statuses: ['COMPLETED', 'CANCELED', 'ERROR', 'INTERRUPTED', 'PENDING',
                'RUNNING', 'WAITING',],
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
    beforeMount(){
        this.filters = JSON.parse(localStorage.getItem('pipeline_run:list:filters') || '{}');
    },
    methods: {
        async search() {
            this.$refs.runsList.refresh();
        },
        async load(data) {
            localStorage.setItem('pipeline_run:list:filters', JSON.stringify(this.filters));
            data.sort = data.orderBy;
            data.asc = data.ascending === 1 ? 'true' : 'false';
            data.size = data.limit;
            data.name = this.filters.name;
            data.status = this.filters.status;
            data.pipeline = this.filters.pipeline;
            data.start = this.filters.start;
            data.end = this.filters.end;
            data.dateType = this.filters.dateType;

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

<style lang="scss" scoped>
.list-filter,
.list-filter input,
.list-filter select {
    font-size: .9em
}

.form-group {
    margin-bottom: 0rem;
}

.runsList-body {
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
}

.runsList-container {
    border: 1px solid #dee2e6;
    padding: 16px;
    border-radius: 3px;
}

.runsList-title {
    color: #333;
    margin: 10px 0px;
}


</style>