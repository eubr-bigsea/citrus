<template lang="">
    <div>
        <div v-if="jobs"
             class="row">
            <div class="col-md-4 col-lg-3 pl-4">
                <b-list-group v-if="jobs.length > 0">
                    <b-list-group-item v-for="job in jobs"
                                       :key="job.id"
                                       class="flex-column align-items-start p-0"
                                       @click="handleClick(job)" role="button">
                        <div class="d-flex w-100 justify-content-between p-1"
                             :class="(selectedJob && (selectedJob.id === job.id)) ? 'bg-secondary text-white': 'bg-light' ">
                            <span class="mb-1 job-title">{{$tc('titles.job')}} #{{job.id}}</span>
                            <small>
                                {{$t('status.' + job.status)}}
                                <span :class="getClassesForDecor(job.status)" />
                                <b-dropdown variant="link"
                                            size="sm"
                                            no-caret
                                            class="text-white">
                                    <template #button-content>
                                        <font-awesome-icon icon="fa fa-ellipsis-v" />
                                    </template>
                                    <b-dropdown-item @click="$emit('delete-job', job.id, job === selectedJob)">Excluir
                                        execução</b-dropdown-item>
                                </b-dropdown>
                            </small>
                        </div>
                        <div class="result">
                            <div v-for="(result, inx) in groupedResults(job)"
                                 :key="inx"
                                 role="button">
                                {{result[0].title}}
                                <div v-if="result[0] && result[0].best"
                                     class="float-right">
                                    {{result[0].best.toFixed(4)}}
                                </div>
                                <!--
                                {{result.title}}

                                <font-awesome-icon icon="medal" v-if="result.content.best" class="best fa-2x"
                                    transform="shrink-3" title="Este é o melhor modelo segundo a métrica escolhida" />
                                    -->
                            </div>
                        </div>
                    </b-list-group-item>
                </b-list-group>
                <div v-else>
                    {{$t('common.noResults')}}
                </div>
            </div>
            <div class="col-md-8 col-lg-9">
                <b-card v-if="selectedJob"
                        variant="primary">
                    <template #header>
                        <b>{{$tc('titles.job')}} #{{selectedJob.id}}</b>
                        <span class="pull-right float-right">
                            <small>Iniciada em {{selectedJob.started | formatJsonDate}}</small>
                            <small v-if="selectedJob.finished"> / Terminada em {{selectedJob.finished |
                                formatJsonDate}}</small>
                        </span>
                    </template>
                    <div class="row pt-1 pb-4">
                        <div v-if="finalReport"
                             class="col-4 text-center">
                            <b-card border-variant="primary">
                                <strong>Resultado: </strong>
                                {{finalReport.content.task_name}}<br>
                                {{finalReport.content.metric_name}} =
                                {{finalReport.content.metric_value.toFixed(4)}}

                                <small v-if="finalReport.content.larger_better">(maior é melhor)</small>
                                <small v-else>(menor é melhor)</small>
                            </b-card>
                        </div>
                        <div v-if="finalReport"
                             class="col-8 text-center">
                            <b-card border-variant="primary">
                                <strong>Parâmetros</strong><br>
                                <small v-for="(v, k) in finalReport.content.best"
                                       :key="k">
                                    <span>{{k}} = {{v}}</span><br>
                                </small>
                            </b-card>
                        </div>
                        <!-- Chart -->
                        <div class="col-9 mt-2">
                            <b-card border-variant="primary">
                                <div v-if="selectedJob.status !== 'ERROR' && selectedJob.status !== 'CANCELED' " style="height: 250px">
                                <Plotly 
                                        ref="plotly"
                                        :data="scatterData"
                                        :layout="scatterLayout"
                                        :display-mode-bar="true"
                                        :auto-resize="true"
                                        :options="{displayModeBar: false}" />
                                </div>
                                <div v-else>
                                    {{selectedJob.status_text}}
                                    <pre><code>{{selectedJob.exception_stack}}</code></pre>
                                </div>
                            </b-card>
                        </div>
                        <div v-if="finalReport"
                             class="col-3 mt-2 text-center">
                            <b-card border-variant="primary">
                                <small>Treino/teste</small>
                                <Plotly ref="plotly"
                                        :data="pieData"
                                        :layout="pieLayout"
                                        :display-mode-bar="true"
                                        :auto-resize="true"
                                        :options="{displayModeBar: false}" />
                            </b-card>
                        </div>
                        <!--
                            <div class="row">
                                <div class="col-3">Métrica <font-awesome-icon icon="fa fa-trophy text-secondary" /> R2</div>
                                <div class="col-3">{{selectedJob.results.length}} modelos para treino</div>
                                <div class="col-3">20 features, registros para treino, para teste</div>
                                <div class="col-3">Link para parte de transparency e fairness?</div>
                            </div>
                            -->
                    </div>
                    <div v-for="(results, key) in selectedGroupedResults"
                         :key="key"
                         class="row">
                        <div v-if="results && results.length > 0"
                             class="col-12">
                            <h6 class="result">
                                <font-awesome-icon v-if="results.find(r => r.winner)"
                                                   icon="trophy"
                                                   class="best"
                                                   title="Este é o melhor modelo segundo a métrica escolhida" />
                                {{results[1][0].title}}
                            </h6>
                        </div>
                        <table class="table table-condensed table-striped table-sm table-training">
                            <thead>
                                <th class="col-1">
                                    #
                                </th>
                                <th class="col-3">
                                    Parâmetros
                                </th>
                                <th class="col-3">
                                    Resultado da métrica
                                </th>
                                <th class="col-8">
                                    Saída
                                </th>
                                <th class="col-1">
                                    Duração (s)
                                </th>
                            </thead>
                            <tbody>
                                <tr v-for="(result, counter) in results[1]"
                                    :key="counter">
                                    <td :data-index="result.content.index">
                                        {{counter + 1}}
                                    </td>
                                    <td>
                                        <font-awesome-icon v-if="result.winner"
                                                           icon="fa fa-trophy best" />
                                        <span v-for="(value, param) in result.content.params"
                                              :key="param">
                                            {{param}} = {{value}}<br>
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="result.content.metric">
                                            {{result.content.metric.name}} = {{result.content.metric.value}}
                                        </span>
                                    </td>
                                    <td>
                                        {{result.content.error || result.content.message}}
                                    </td>
                                    <td>{{result.content.t}}</td>
                                    <!--
                                    <div class="col-3">Atributos mais importantes</div>
                                    -->
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--
                            <img src="https://topepo.github.io/caret/basic/train_plot1-1.svg" alt="">
                            Gráfico métrica por tempo
                            <b-list-group>
                                <b-list-group-item v-for="run in sessions[0].runs" :key="run.id" class="p-0 pl-2">
                                    <div class="d-flex w-100 justify-content-between bg-light p-1">
                                        <b class="mb-1">{{run.name}}</b>
                                        <small>
                                            <button class="btn btn-sm btn-danger">
                                                <font-awesome-icon icon="fa fa-times-circle " /> </button>
                                        </small>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <ul>
                                                <li>Grid size: 2</li>
                                                <li>Trees: 4</li>
                                                <li>Depth: 3</li>
                                            </ul>
                                        </div>
                                        <div class="col-md-4 text-center">
                                            Atributos mais importantes
                                            <img src="https://i2.wp.com/cdn-images-1.medium.com/max/1024/1*XLiG4oyZyrCU5Cyf9LxL6Q.png?w=584&ssl=1"
                                                alt="" style="width: 100%; height: auto" />
                                        </div>
                                        <div class="col-md-4">
                                            <ul>
                                                <li>Número de registros para o treino: 2</li>
                                                <li>Número de registros para o teste: 4</li>
                                                <li>Duração: 3</li>
                                            </ul>
                                        </div>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                            -->
                </b-card>

                <!--
                    <b-tab :title="$tc('titles.model', 2)">

                    </b-tab>
                    -->
                <!--
                    <b-tab title="Tabela">
                        <table class="table table-condensed table-sm table-result">
                            <thead>
                                <tr>
                                    <th>Execução</th>
                                    <th>Algoritmo</th>
                                    <th>Tempo</th>
                                    <th>Parâmetros</th>
                                    <th>Métrica</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="job in jobs">
                                    <template v-for="result in job.results">
                                        <tr v-for="iteration in result.content.iterations">
                                            <td>{{job.id}}</td>
                                            <td>{{result.title}}</td>
                                            <td>{{result.content.duration_in_seconds}}</td>
                                            <td>FIXME params</td>
                                            <td>FIXME Metricas</td>
                                        </tr>
                                    </template>
                                </template>
                            </tbody>
                        </table>
                    </b-tab>
                    -->
            </div>
        </div>
        <div v-else
             class="row text-center">
            <div class="col-md-12 pt-5">
                <h4>Nenhum modelo treinado ainda</h4>
                Revise os parâmetros ou dispare o treino do modelo agora.
            </div>
        </div>
    </div>
</template>
<script>
import Plotly from '../../../../components/visualization/Plotly.vue';


export default {
    name: 'ResultComponent',
    components: { Plotly },
    props: {
        jobs: { required: true, type: Array, default: () => [] },
        numberOfFeatures: { type: Number, default: () => 0 }
    },
    emits: ['delete-job'],
    data() {
        return {
            finalReport: null,
            selectedJob: null,
            gridSize: null,
            internalJobs: [],

            pieLayout: {
                autosize: true,
                height: 140,
                width: 140,
                showlegend: false,
                margin: {
                    t: 10, b: 10, l: 10, r: 10
                }
            },
            scatterLayout: {
                showlegend: true,
                legend: {
                    orientation: "h",
                    yanchor: "bottom",
                    y: 1.02,
                    xanchor: "right",
                    x: .52,
                    xbgcolor: '#f0f0f0',
                    font: { size: 10 },
                    bordercolor: '#222',
                    borderwidth: 0.5
                },
                height: 240,
                margin: {
                    t: 0, b: 25, l: 50, r: 10
                },
                xplot_bgcolor: '#444',
                xpaper_bgcolor: '#fff',
                yaxis: {
                    tickcolor: "#eee",
                    tickwidth: 1,

                    gridcolor: "#eee",
                    gridwidth: 1,
                    rangemode: 'tozero',
                    title: 'Métrica',
                    titlefont: { size: 12 }

                },
                xaxis: {
                    gridcolor: "#eee",
                    gridwidth: 1,
                    rangemode: 'tozero',
                    title: 'Duração (s)',
                    titlefont: { size: 12 }
                },
                hoverlabel: {
                    font: {
                        size: 12
                    },
                    padding: {
                        t: 400,
                        b: 50,
                        l: 40,
                        r: 40
                    },
                    borderwidth: 2
                }
            }
        }
    },
    computed: {

        pieData() {
            return this.finalReport ?
                [{
                    values: [this.finalReport.content.train_size, this.finalReport.content.test_size,],
                    labels: ['Treino', 'Teste'],
                    type: 'pie',
                    hole: .5, textposition: 'inside',
                }] : [{}]
        },
        scatterData() {
            const series = []
            if (this.selectedJob && this.selectedJob.groupedResults) {
                Object.entries(this.selectedJob.groupedResults).forEach(([k, results]) => { // eslint-disable-line no-unused-vars
                    let x = [];
                    let y = [];
                    let text = [];
                    results.forEach((result, inx) => {// eslint-disable-line no-unused-vars
                        const content = result.content;
                        if (!content.error && content.metric) {
                            x.push(content.t);
                            y.push(content.metric.value);
                            text.push(JSON.stringify(content.params, null, '<br>').replace(/[{}]/g, ''));
                        }
                    });
                    series.push({
                        x, y, mode: 'markers', type: 'scatter',
                        text, marker: { size: 8 }, name: results[0].title
                    })
                });
            }
            return series;
        },
        selectedGroupedResults() {
            return Object.entries(this.selectedJob.groupedResults).filter(
                (v) => v.length && v[0].type !== 'OTHER');
        },
    },
    watch: {
        selectedJob(newValue) {
            const finalReport = newValue.results.find(r => r.type === 'OTHER');
            if (finalReport) {
                const best = newValue.results.find(r => r.content?.index === finalReport.content.index);
                if (best) {
                    best.winner = true;
                }
            }
            this.finalReport = finalReport;
        }
    },
    mounted() {
        this.selectedJob = (this.jobs.length) ? this.jobs[0] : null;
    },
    methods: {
        groupedResults(job) {
            return Object.values(job.groupedResults).filter((result) => result[0].type !== 'OTHER');
        },

        selectFirst() {
            this.selectedJob = null;
            if (this.jobs.length) {
                this.selectedJob = this.jobs[0];
            }
        },
        handleClick(job) {
            this.selectedJob = job;
        },

        getClassesForDecor(value) {
            let result = [];
            switch (value) {
                case 'ERROR':
                    result.push("fa fa-times-circle text-danger");
                    break;
                case 'PENDING':
                    result.push("fa fa-pause-circle text-warning");
                    break;
                case 'CANCELED':
                    result.push("fa fa-stop-circle text-secondary");
                    break;
                case 'RUNNING':
                    result.push("fa fa-sync fa-spin text-primary");
                    break;
                case 'COMPLETED':
                    result.push("fa fa-check-circle text-success");
                    break;
                case 'INTERRUPTED':
                    result.push("fa fa-stop text-danger");
                    break;
                default:
            }
            result.push(value.toLowerCase());
            return result.join(' ');
        },
    }
}
</script>
<style scoped>
.result {
    position: relative;
}

.result>div {
    color: #495057;
    font-size: .85em;
    padding: 5px 15px;
}

.result>div:hover {
    color: rgb(0, 136, 204)
}

.result div:not(:last-child) {
    border-bottom: 1px solid #eee;
}

.job-title {
    padding-top: 3px;
    font-size: .9em;
    /*color: #495057;*/
    font-weight: bold;
}

.result:last-child {
    padding-bottom: 5px;
}

.best {
    color: rgb(250, 189, 56);
}

.bg-primary .fa {
    color: white;
}

h6.result {
    color: rgb(0, 136, 204);
    border-bottom: 1px solid rgb(0, 136, 204)
}

.table-result {
    font-size: .9em
}

.table-training {
    font-size: .8em;
}
</style>