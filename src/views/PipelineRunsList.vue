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
                        <b-tabs content-class="mt-3" v-model="activeTab">
                            <b-tab title="Tabela">
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
                                        <router-link :to="{ name: 'pipelineEdit', params: { id: props.row.id } }">
                                            {{ props.row.pipeline_id }}
                                        </router-link>
                                    </template>
                                    <template #period="props">
                                        {{ props.row.start | formatJsonDate('dd/MM/yyyy') }} até {{ props.row.finish |
                                            formatJsonDate('dd/MM/yyyy') }}
                                    </template>
                                    <template #updated="props">
                                        {{ props.row.updated | formatJsonDate('dd/MM/yyyy HH:MM:SS') }}
                                    </template>
                                    <template #status="props">
                                        <div class="runsList-status" :class="props.row.status.toLowerCase()">
                                            {{ $tc(`status.${props.row.status}`).toUpperCase() }}
                                        </div>
                                    </template>
                                </v-server-table>
                            </b-tab>
                            <b-tab title="Gráficos">
                                <div class="row mb-3 mt-3">
                                    <div class="col-md-2 border-right">
                                        <label>Tipo de Gráfico:</label>
                                        <select @change="updateGraph" v-model="currentGraphic" class="form-control form-control-sm"
                                            name="status">
                                            <option selected value=""></option>
                                            <option v-for="(graphicOption,key) in graphicOptions" :value="key">{{ graphicOption.layout.title }}
                                            </option>
                                        </select>
                                        <div class="mt-3" v-if="currentGraphic=='steps-time-series'">
                                            <div class="border-bottom mb-2"></div>
                                            <label>Intervalo dos dados:</label>
                                            <select v-model="graphicOptions['steps-time-series'].request.filters.timeInterval" @change="updateGraph" class="form-control form-control-sm">
                                                <option selected value="hour">Hora a hora</option>
                                                <option value="daily">Diário</option>
                                                <option value="weekly">Semanal</option>
                                                <option value="monthly">Mensal</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-10">
                                        <div class="flex-grow-1 d-flex justify-content-center align-items-center w-100 h-100">
                                            <plotly v-if="currentGraphic!==''&&newGraphicLoaded" :data="graphic.data" :layout="graphic.layout" class="w-100 h-100"/>
                                        </div>
                                    </div>
                                </div>
                            </b-tab>
                        </b-tabs>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';
import Plotly from '../components/visualization/Plotly.vue'
import PieChart from '../components/visualization/PieChart.vue'
const standUrl = import.meta.env.VITE_STAND_URL;

export default {
    components: {
        'plotly': Plotly,
        'pie-chart': PieChart,
    },
    data() {
        return {
            statuses: ['COMPLETED', 'CANCELED', 'ERROR', 'INTERRUPTED', 'PENDING',
                'RUNNING', 'WAITING',],
            statusesColors: {
                'COMPLETED': '#2ecc40',
                'RUNNING': '#0074d9',
                'INTERRUPTED': '#111',
                'CANCELED': '#aaa',
                'WAITING': '#ffdc00',
                'ERROR': '#ff4136',
                'PENDING': '#ffa136'
            },
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
            activeTab: 0,
            graphic: {
                data:   [],
                layout: {
                    height:'auto',
                    title:""
                }
            },
            graphicOptions: {
                'steps-pie-chart': {
                    type: "pie",
                    request: {
                        type: "pie",
                        filters: {}
                    },
                    layout: {
                        title: "Gráfico de Pizza das Etapas"
                    },
                    receiveData: (data) => {
                        let labels = data.map(item => item[0]);
                        const values = data.map(item => item[1]);
                        const colors = labels.map(status => this.statusesColors[status]);
                        labels = labels.map(status => this.$tc(`status.${status}`).toUpperCase());
                        return [{
                                type: "pie",
                                labels:labels,
                                values:values,
                                marker: {
                                    colors:colors
                                },
                                textinfo: "label+percent",
                                insidetextorientation: "radial"
                            }]
                    }
                },
                'steps-time-series': {
                    type: "bar",
                    request: {
                        type: "line",
                        filters: {
                            timeInterval: "hour"
                        }
                    },
                    layout: {
                        title: "Série Temporal das Etapas"
                    },
                    receiveData: (data) => {
                        return [{...data,type:"bar"}]
                    }
                },
                'steps-time-series-by-status': {
                    type: "bar",
                    request: {
                        type: "histogram",
                        filters: {
                            timeInterval: "hour"
                        }
                    },
                    layout: {
                        title: "Histograma Acumulado das Etapas por Status",
                        xaxis: {title: "Intervalo Temporal"}, 
                        yaxis: {title: "Quantidade de Execuções"},
                        barmode: 'stack'
                    },
                    data: [],
                    receiveData: (data) => {
                        let startDate = new Date("2024-09-01");
                        let x = [];

                        for (let i = 0; i < 10; i++) {
                            let currentDate = new Date(startDate);
                            currentDate.setDate(startDate.getDate() + i);
                            let formattedDate = currentDate.toISOString().split('T')[0];
                            x.push(formattedDate);
                        }

                        let update = [];
                        let i = 0

                        this.statuses.forEach(status => {
                            let y = x.map(() => Math.floor(Math.random() * 6));
                            i = i+1;
                            let trace = {
                                x: x,
                                y: y,
                                name: status,
                                marker: {
                                    color: this.statusesColors[status],
                                    line: {
                                        color: this.statusesColors[status],
                                        width: 1
                                    }
                                },
                                opacity: 0.8,
                                type: "bar",
                                histfunc: 'count',
                                offsetgroup: i
                            };
                            
                            update.push(trace);
                        });
                        return update;
                    }
                }
            },
            currentGraphic: "",
            newGraphicLoaded: false,
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
        async updateGraph(event){
            this.newGraphicLoaded = false;
            if (this.currentGraphic == ""){
                this.graphic.data= [],
                this.graphic.layout= {height:'auto'}
                return;
            }
            
            let graphicOption = this.graphicOptions[this.currentGraphic];
            let resp = await this.loadGraph(graphicOption.request.filters);
            this.graphic.layout = {...this.graphic.layout,...graphicOption.layout};
            this.graphic.data = graphicOption.receiveData(resp.data);
            this.newGraphicLoaded = true;

        },
        async search() {
            this.$refs.runsList.refresh();
            if (this.currentGraphic != ""){
                this.updateGraph();
            }
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
        async loadGraph(additionalFilters={}) {
            
            let filter = (({ status, name, start, end }) => ({ status, name, start, end }))(this.filters);
            filter = {...filter, ...additionalFilters};

            const type = this.graphicOptions[this.currentGraphic].request.type;
            
            this.$Progress.start();
            try {
                const resp = await axios.get(`${standUrl}/pipeline-runs/summary?type=${type}`,
                    {params: filter}
                );
                return resp;
            } catch (e) {
                this.error(e);
            } finally {
                this.$Progress.finish();
            }
        }
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