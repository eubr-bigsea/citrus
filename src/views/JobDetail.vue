<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <b-tabs>
                    <b-tab active title-item-class="smalltab">
                         <template slot="title">
                            {{$tc('titles.job')}}: {{job.name}}
                        </template>
                        <div class="row mt-1">
                            <div class="col-md-9">
                                <diagram :workflow="workflow" ref="diagram" id="main-diagram" 
                                    :operations="operations" v-if="loaded" :version="job.id" zinitial-zoom=".8"
                                    :showToolbar="false"
                                    :hack="true"
                                    :editable="false" shink="true"/>
                            </div>
                            <div class="col-md-3">
                                <div class="card">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">
                                            <strong>Workflow: </strong> 
                                            <br/> <router-link :to="{name: 'editWorkflow', params: {id: workflow.id, platform: workflow.platform.id}}" class="nav-link">{{workflow.name}}</router-link>
                                        </li>
                                        <li class="list-group-item">
                                            <strong>Date:</strong> {{job.created}}
                                        </li>
                                        <li class="list-group-item">
                                            <strong>User: </strong> {{job.user.name}}
                                        </li>
                                        <li class="list-group-item">
                                            <strong>Cluster: </strong> {{job.cluster.name}}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab :title="$tc('job.results', 2)" title-item-class="smalltab">
                        <div class="row" v-for="(step, inx) in sortedSteps" :key="inx">
                            <div class="col-md-12 lemonade">
                                <div class="mt-5">
                                    {{step.status}}
                                    <div v-for="log in step.logs" :key="log.id" style="font-size:.9em">
                                        <!-- <span class="badge-custom" :class="'badge badge-' + log.level.replace('ERROR', 'danger').toLowerCase()">
                                            {{log.level}}
                                        </span> &nbsp; -->
                                        <!-- <span>{{log.date}}</span>
                                        <span v-if="log.type === 'TEXT'">
                                            {{log.message}}
                                        </span> -->
                                        <span v-if="log.type === 'HTML'">
                                            HTML content
                                            <div class="html-div" v-html="log.message"></div>
                                        </span>
                                        <span v-else-if="log.type === 'STATUS'">
                                            &#9733;{{log.message}}
                                        </span>
                                        <!-- <div v-else>
                                            {{log}}
                                        </div> -->
                                    </div>
                                    <div v-for="(result, taskId) in getResults(step.task.id)" :key="taskId">
                                        <div v-if="result && result.type === 'VISUALIZATION'">
                                            <Visualization :url="getCaipirinhaLink(job.id, result.task.id)"></Visualization>
                                        </div>
                                        <div v-else>
                                            {{result}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab :title="$tc('job.logs', 2)" title-item-class="smalltab">
                        <div class="row mt-2">
                            <div class="col-md-12" v-for="log in sortedLogs" :key="log.id">
                                <span class="badge-custom" :class="'badge badge-' + log.level.replace('ERROR', 'danger').toLowerCase()">
                                    {{log.level}}
                                </span> &nbsp;
                                <span>{{log.date}}</span>&nbsp;
                                
                                <span v-if="log.type === 'TEXT'">
                                    {{log.message}}
                                </span>
                                <span v-else-if="log.type === 'STATUS'">
                                    &#9733;{{log.message}}
                                </span>
                            </div>
                        </div>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import DiagramComponent from '../components/Diagram.vue'
    import Visualization from '../components/Visualization.vue'
    import Notifier from '../mixins/Notifier'
    import axios from 'axios'
    const standUrl = process.env.VUE_APP_STAND_URL
    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL

    const TaskDisplay = Vue.extend({
        props: {
            task: {}
        },
        render(createElement) {
            let color = this.task.forms.color
                && this.task.forms.color.value
                ? this.task.forms.color.value.background : '#fff'
            return createElement('span',
                {
                    domProps: {
                        innerHTML: this.task.name
                    },
                    style: {
                        'font-size': '.6em',
                        'padding': '2px',
                        'width': '180px',
                        'display': 'inline-block',
                        'text-align': 'center',
                        'border': '1px solid',
                        'border-left': '8px solid',
                        'border-right': '8px solid',
                        'border-color': color,
                    },
                    text: 'this.task.name'
                })
        }
    });
    export default {
        mixins: [Notifier],
        components: {
            'diagram': DiagramComponent,
            Visualization,
            'task-display': TaskDisplay
        },
        computed: {
            sortedLogs() {
                let logs = []
                this.job.steps.forEach((step) => {
                    step.logs.forEach((info) => {
                        info.task = step.task
                        logs.push(info)
                    })
                });
                return logs.sort((a, b) => {
                    return a.id - b.id;
                });
            },
        },
        data() {
            return {
                job: { steps: [], user:{}, cluster:{} },
                results: new Map(),
                sortedSteps: [],
                tasks: new Map(),
                loaded: false,
                operations: [],
                workflow: {id: 0, platform: {id: 0}, name: ''},
                operationsLookup: new Map(),
            }
        },
        methods: {
            getTask(taskId) {
                return this.tasks[taskId]
            },

            getResults(taskId) {
                return { taskId: this.results[taskId] }
            },
            getCaipirinhaLink(jobId, taskId) {
                return `${caipirinhaUrl}/visualizations/${jobId}/${taskId}?token=123456`
            }
        },
        mounted() {
            let self = this
            this.$Progress.start();
            axios.get(`${standUrl}/jobs/${this.$route.params.id}`).then(
                (resp) => {
                    self.job = resp.data
                    const workflow =  self.job.workflow;

                    axios.get(`${tahitiUrl}/operations?platform=${this.$route.params.platform}`).then(
                        (resp) => {
                            self.operations = resp.data
                            self.operations.forEach((op) => {
                                self.operationsLookup[op.id] = op
                            })
                            workflow.tasks.forEach((task) => {
                                task.operation = self.operationsLookup[task.operation.id]
                            });
                            
                            self.$nextTick(() =>  {
                                self.loaded = true;
                                self.workflow = workflow;
                            });
                        }).catch(function (e) {
                            this.error(e);
                        }.bind(this)).finally(() => {
                            Vue.nextTick(() => {
                                this.$Progress.finish()
                            })
                        });

                    self.sortedSteps = resp.data.steps.sort((s1, s2) => {
                        let result = -1
                        if (s1.logs.length) {
                            if (s2.logs.length) {
                                result = s1.logs[0].id - s2.logs[0].id
                            } else {
                                result = 1
                            }
                        }
                        return result
                    })
                    workflow.tasks.forEach(task => {
                        self.tasks[task.id] = task
                    })
                    resp.data.results.forEach(result => {
                        self.results[result.task.id] = result
                    });
                }
            ).catch(function (e) {
                self.error(e);
            });
        }
    }
</script>
<style>
    .badge-custom {
        min-width: 80px
    }

    .html-div {
        border: 1px solid #ccc;
        padding: 5px;
        margin: 10px;
        width: 90%;
        overflow: auto;
        font-size: .8em;
    }

    .html-div .table td,
    .html-div .table th {
        padding: .3rem;
    }

    .alternate {
        background: #eee;
    }

    .alternate>div>div {
        background: #fff
    }

    .alternate>div {
        padding: 5px;
        padding-bottom: 0;
        padding-left: 0
    }
</style>