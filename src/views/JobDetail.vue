<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h6 class="header-pretitle">
                    <router-link :to="{name: 'editWorkflow', params: {id: workflow.id, platform: workflow.platform.id}}" v-if="workflow.id">
                        <i class="fa fa-chevron-left"></i> &nbsp; {{$t('actions.back')}}
                    </router-link>
                </h6>
                <h1 class="header-title" v-if="loaded">
                    <span v-bind:title="$tc('titles.job', 1)"> {{job.id}} </span> {{workflow.name}}
                </h1>
            </div>
        </div>
        <div>
            <b-tabs nav-class="custom-tab">
                <b-tab active :title="$tc('titles.job')" >
                    <div class="row" >
                        <div class="col-md-8">
                            <b-card>
                                <div style="position: relative; overflow: hidden; height: 75vh;">
                                    <diagram :workflow="workflow" ref="diagram" id="main-diagram"
                                        :operations="operations" :version="job.id" initial-zoom="1" :showToolbar="false"
                                        :editable="false" shink="true" v-if="loaded" :loaded="loaded"
                                        :showTaskDecoration="true" :initialZoom=".7" />
                                </div>
                            </b-card>
                        </div>
                        <div class="col-md-4">
                            <b-card no-body>
                                <b-tabs card>
                                    <b-tab active>
                                        <template slot="title">
                                            <div class="job-status-circle lemonade-job" :class="jobStatus" :title="job.status"
                                                id="dtl-job-status"></div>
                                            {{$tc('job.logs', 2)}}
                                        </template>
                                        <div class="job-log-list">
                                            <div class="alert alert-secondary" id="dtl-job-status-text">
                                                {{job.status_text}}
                                            </div>
                                            <div class="job-log-list">
                                                <div v-for="log in sortedLogs" :key="log.id" class="job-log"
                                                    :class="{'disabled': selectedTask.id && selectedTask.id !== log.task.id}">
                                                    <small>
                                                        <span class="badge-custom"
                                                            :class="'badge badge-' + log.level.replace('ERROR', 'danger').toLowerCase()">
                                                            {{$t(`juicer.log.${log.level.toLowerCase()}`)}}
                                                        </span> &nbsp;
                                                        <span>{{log.date | formatJsonDate}}</span>&nbsp;
                                                        <TaskDisplay :task="getTask(log.task.id)" :simple="true" />

                                                        <span v-if="log.type === 'TEXT'">
                                                            {{log.message}}
                                                        </span>
                                                        <span v-else-if="log.type === 'STATUS'">
                                                            &#9733;{{log.message}}
                                                        </span>
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </b-tab>
                                    <b-tab :title="$t('titles.errorDetail')" v-if="job.exception_stack">
                                        <div style="font-size:.8em">
                                            <code><pre>{{job.exception_stack}}</pre></code>
                                        </div>
                                    </b-tab>
                                    <b-tab :title="$tc('job.details', 2)">
                                        <dl>
                                            <dt>{{$t('common.date')}}</dt>
                                            <dd>{{job.created | formatJsonDate}}</dd>
                                            <dt>{{$t('common.user.name')}}</dt>
                                            <dd>{{job.user.name}} ({{job.user.login}})</dd>
                                            <dt>{{$tc('titles.cluster')}}</dt>
                                            <dd>{{job.cluster.name}}</dd>
                                        </dl>
                                    </b-tab>
                                </b-tabs>
                            </b-card>
                        </div>
                    </div>
                </b-tab>
                <b-tab :title="$tc('job.results', 2)" >
                    <b-card>
                        <div class="row" v-for="(step, inx) in job.steps" :key="inx">
                            <div class="col-md-12 lemonade">
                                <div class="mt-2 border-bottom pb-2"
                                    v-if="step.logs.find(s => s.type === 'HTML' || s.type === 'IMAGE' )">
                                    <TaskDisplay :task="getTask(step.task.id)" /> &nbsp;
                                    {{step.status}}
                                    <div v-for="log in step.logs" :key="log.id" style="font-size:.9em; margin-top: 20px">
                                        <!-- <span class="badge-custom" :class="'badge badge-' + log.level.replace('ERROR', 'danger').toLowerCase()">
                                            {{log.level}}
                                        </span> &nbsp; -->
                                        <!-- <span>{{log.date}}</span>
                                        -->
                                        <!-- <span v-if="log.type === 'TEXT'">
                                            {{log.message}}
                                        </span> -->
                                        <span v-if="log.type === 'HTML'">
                                            <div class="html-div" v-html="log.message"></div>
                                        </span>
                                        <span v-else-if="log.type === 'IMAGE'">
                                            <img :src="'data:image/png;base64,' + log.message" />
                                        </span>
                                        <!-- <span v-else-if="log.type === 'STATUS'">
                                            &#9733;{{log.message}}
                                        </span> -->
                                        <!-- <div v-else>
                                            {{log}}
                                        </div> -->
                                    </div>
                                    <!--
                                    <div v-for="(result, taskId) in getResults(step.task.id)" :key="taskId">
                                        <div v-if="result && result.type === 'VISUALIZATION'">
                                            <Visualization :url="getCaipirinhaLink(job.id, result.task.id)"></Visualization>
                                        </div>
                                        <div v-else>
                                            {{result}}
                                        </div>
                                    </div>
                                -->
                                </div>
                                <!-- <div v-else class="mt-1">
                                    <div class="alert alert-info">{{$t('common.noResults')}}</div>
                                </div> -->
                            </div>
                        </div>
                    </b-card>
                </b-tab>
                <b-tab :title="$tc('job.visualizations', 2)" 
                    v-if="job.results && job.results.length" @click="showVisualizations = true">
                    <b-card>
                        <div class="row" v-for="result in job.results" :key="result.id">
                            <div class="col-md-8 lemonade offset-2" style="margin-top: 14px; height: 500px"
                                v-if="showVisualizations">
                                <caipirinha-visualization :url="getCaipirinhaLink(job.id, result.task.id)">
                                </caipirinha-visualization>
                            </div>
                        </div>
                    </b-card>
                </b-tab>
                <b-tab :title="$tc('job.sourceCode')"  @click="showSourceCode = 1">
                    <b-card>
                        <SourceCode v-if="showSourceCode" :job="job.id" />
                    </b-card>
                </b-tab>
                    <!-- <b-tab :title="$tc('job.logs', 2)" >
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
                            <TaskDisplay :task="getTask(log.task.id)"/>
                        </div>
                    </div>
                </b-tab> -->
            </b-tabs>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import DiagramComponent from '../components/Diagram.vue'
    import SourceCode from '../components/SourceCode.vue'
    import Visualization from '../components/Visualization.vue'
    import Notifier from '../mixins/Notifier'
    import axios from 'axios'
    import io from 'socket.io-client';
    import SlideOut from '../components/SlideOutPanel.vue'
    import CapirinhaVisualization from '../components/caipirinha-visualization/CaipirinhaVisualization.vue'

    const standUrl = process.env.VUE_APP_STAND_URL
    const standNamespace = process.env.VUE_APP_STAND_NAMESPACE
    const standSocketIOPath = process.env.VUE_APP_STAND_SOCKET_IO_PATH
    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL

    const TaskDisplay = Vue.extend({
        props: {
            task: {},
            simple: false
        },
        render(createElement) {
            const color = this.task.forms.color
                && this.task.forms.color.value
                ? this.task.forms.color.value.background : '#222'

            let style;
            let text;
            if (!this.simple) {
                style = {
                    'font-size': '.7em',
                    'padding': '2px',
                    'width': '180px',
                    'display': 'inline-block',
                    'text-align': 'center',
                    'border': '1px solid',
                    'border-left': '8px solid',
                    'border-right': '8px solid',
                    'border-color': color,
                }
                text = this.task.name
            } else {
                style = {};
                text = `[${this.task.name}]`;
            }

            return createElement('span',
                {
                    domProps: {
                        innerHTML: text
                    },
                    style,
                    text
                })
        }
    });
    export default {
        mixins: [Notifier],
        components: {
            'diagram': DiagramComponent,
            'slideout-panel': SlideOut,
            'caipirinha-visualization': CapirinhaVisualization,
            SourceCode,
            Visualization,
            TaskDisplay
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
                sourceCode: '',
                details: false,
                jobStatus: '',
                job: { steps: [], user: {}, cluster: {} },
                results: new Map(),
                sortedSteps: [],
                tasks: new Map(),
                loaded: false,
                operations: [],
                workflow: { id: 0, platform: { id: 0 }, name: '' },
                operationsLookup: new Map(),
                selectedTask: {},
                showSourceCode: false,
                showProperties: false,
                showVisualizations: false,
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
            },
            connectWebSocket() {
                const self = this;
                const socket = io(`${standUrl}${standNamespace}`,
                    { upgrade: true, path: `${standSocketIOPath}/socket.io`, });

                self.socket = socket

                socket.on('disconnect', () => {
                    console.debug("You are not connected");
                });
                socket.on('response', (msg) => {
                    console.debug('response', msg);
                });
                socket.on('connect', () => {
                    let room = self.job.id;
                    console.debug('Connecting to room', room);
                    socket.emit('join', { room: room });
                    self.socket = socket;
                });
                socket.on('connect_error', () => {
                    console.debug('Web socket server offline');
                });
                socket.on('update task', (msg, callback) => {
                    const task = self.job.workflow.tasks.find((t) => {
                        return msg.task && t.id === msg.task.id;
                    })
                    // const task = self.tasks[msg.task.id];
                    if (task) {
                        task.status = msg.status;
                        let step = self.job.steps.find((step) => step.task.id === task.id);
                        if (step) {
                            step.status = msg.status;
                            const found = step.logs.filter((v) => v.id === msg.id);
                            if (found.length === 0) {
                                step.logs.push({
                                    id: msg.step_id,
                                    level: msg.level,
                                    date: msg.date,
                                    type: msg.type,
                                    message: msg.message
                                })
                            }
                        }
                    }
                });
                socket.on('update job', (msg) => {
                    self.jobStatus = msg.status.toLowerCase();
                    if (msg.id === self.job.id && self.job.status !== 'COMPLETED') {
                        self.job.status = msg.status;
                        self.job.finished = msg.finished;

                        if (msg.message) {
                            // let finalMsg = msg.message.replace(/&/g, '&amp;')
                            //     .replace(/"/g, '&quot;')
                            //     .replace(/</g, '&lt;')
                            //     .replace(/>/g, '&gt;');;
                            const finalMsg = msg.message;
                            self.job.status_text = finalMsg;
                            if (msg.status === 'COMPLETED') {
                                // hack
                                window.setTimeout(() => self.jobStatus = 'COMPLETED', 10)
                                self.success(finalMsg);
                            } else if (msg.status === 'ERROR') {
                                if (msg.exception_stack) {
                                    self.job.exception_stack = msg.exception_stack.replace(/(^[ \t]*\n)/gm, "");
                                }
                                self.error(null, self.$t('job.error'));
                            }
                        }
                    }
                });
                socket.on('task result', (msg) => {
                    self.job.results.push(msg);
                });
            },
        },
        beforeDestroy() {
            if (this.socket) {
                this.socket.emit('leave', { room: this.job.id });
                this.socket.close();
            }
        },
        beforeDestroy() {
            this.$root.$off('onclick-task');
            this.$root.$off('onblur-selection');
        },
        mounted() {
            let self = this
            this.$Progress.start();
            axios.get(`${standUrl}/jobs/${this.$route.params.id}`).then(
                (resp) => {
                    // Required in order to have status information
                    resp.data.workflow.tasks.forEach((t) => t.status = '');
                    self.job = resp.data
                    const workflow = self.job.workflow;
                    self.jobStatus = self.job.status.toLowerCase();
                    const params = {
                        platform: this.$route.params.platform,
                        lang: this.$root.$i18n.locale,
                        disabled: true // even disabled operations must be returned to keep compatibility
                    }
                    axios.get(`${tahitiUrl}/operations`, { params }).then(
                        (resp) => {
                            self.operations = resp.data
                            self.operations.forEach((op) => {
                                self.operationsLookup[op.id] = op
                            })
                            workflow.tasks.forEach((task) => {
                                task.operation = self.operationsLookup[task.operation.id];
                                task.status = task.status || "";
                            });

                            self.$nextTick(() => {
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
                    self.job.steps.forEach(step => {
                        self.tasks[step.task.id].status = step.status;
                    });
                    resp.data.results.forEach(result => {
                        self.results[result.task.id] = result
                    });
                    if (['running', 'waiting'].includes(self.job.status.toLowerCase())) {
                        self.connectWebSocket();
                    }
                }
            ).catch(function (e) {
                self.error(e);
            });
            this.$root.$on('onclick-task', (taskComponent) => {
                this.selectedTask = taskComponent.task;
                this.showProperties = true;
            });
            this.$root.$on('onblur-selection', () => {
                this.selectedTask = {};
                this.showProperties = false;
            });

        }
    }
</script>
<style>
    .badge-custom {
        width: 60px
    }

    .html-div {
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

    .job-status-circle {
        float: left;
        border-radius: 50%;
        height: 12px;
        width: 12px;
        transform: translateY(50%);
        margin-right: 10px;
    }

    .badge-warn {
        background-color: #FFDC00;
    }

    .job-log-list {
        flex-direction: column;
        display: flex
    }

    .job-log {
        order: 1;
    }

    .job-log.disabled {
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: grayscale(100%);
        filter: gray;
        opacity: 0.4;
        order: 2;
    }

    .flex {
        display: flex;
        flex-direction: column
    }

    .header-title {
        margin-bottom: 12px!important;
    }

    .header-title > span {
        font-weight: 200;
    }

    .header-pretitle:hover > a {
        text-decoration: none;
    }
</style>