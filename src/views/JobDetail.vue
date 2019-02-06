<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <div class="border p-2 mb-1">
                    <strong>{{$tc('titles.workflow')}}: </strong>
                    <router-link :to="{name: 'editWorkflow', params: {id: workflow.id, platform: workflow.platform.id}}"
                        v-if="workflow.id">{{workflow.id}} - {{workflow.name}} ({{$t('actions.back').toLowerCase()}})</router-link>
                </div>
                <b-tabs>
                    <b-tab active title-item-class="smalltab">
                        <template slot="title">
                            {{$tc('titles.job')}}: {{job.name}}
                        </template>
                        <div class="row mt-1">
                            <div class="col-md-12" style="position: relative; overflow: hidden; height: 65vh;">
                                <diagram :workflow="workflow" ref="diagram" id="main-diagram" :operations="operations"
                                    :version="job.id" initial-zoom="1" :showToolbar="false" :editable="false" shink="true"
                                    v-if="loaded" :loaded="loaded" :showTaskDecoration="true" :initialZoom=".7"/>
                                <slideout-panel :opened="showProperties" v-if="selectedTask && selectedTask.operation">
                                    <div style="background: red; height: 60vh; width: 300px" class="p-2">
                                        <h6>{{$tc('titles.property', 2)}}</h6>
                                        <dl>
                                            <template v-for="form in operationsLookup[selectedTask.operation.id].forms">
                                                {{form.scope}}
                                                <template v-for="field in form" v-if="form.scope !== 'EXECUTION' ">
                                                    <dt>{{field}}</dt>
                                                    <dd></dd>
                                                </template>
                                            </template>
                                        </dl>
                                    </div>
                                </slideout-panel>
                            </div>
                            <div class="fixed-bottom m-2 border" style="height: 200px; background: white; overflow: auto">
                                <div class="row">
                                    <div class="col-md-12">
                                        <b-tabs>
                                            <b-tab active title-item-class="smalltab">
                                                <template slot="title">
                                                    <div class="circle lemonade-job" :class="jobStatus" :title="job.status"></div>
                                                    {{$tc('job.logs', 2)}}
                                                </template>
                                                <div class="pl-4 mr-3 mt-1">
                                                    <div class="alert alert-secondary">{{job.status_text}}</div>
                                                    <div style="font-size:.8em" class="mt-2" v-if="job.exception_stack">
                                                        <a href="#" @click.prevent="details=!details">{{$t('titles.errorDetail')}}</a>
                                                        <div v-if="details">
                                                            <code><pre>{{job.exception_stack}}</pre></code>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="job-log-list">
                                                    <div v-for="log in sortedLogs" :key="log.id" class="job-log pl-4"
                                                        :class="{'disabled': selectedTask.id && selectedTask.id !== log.task.id}">
                                                        <small>
                                                            <span class="badge-custom" :class="'badge badge-' + log.level.replace('ERROR', 'danger').toLowerCase()">
                                                                {{log.level}}
                                                            </span> &nbsp;
                                                            <span>{{log.date}}</span>&nbsp;
                                                            <TaskDisplay :task="getTask(log.task.id)" :simple="true" />
                                                            &nbsp;</strong>

                                                            <span v-if="log.type === 'TEXT'">
                                                                {{log.message}}
                                                            </span>
                                                            <span v-else-if="log.type === 'STATUS'">
                                                                &#9733;{{log.message}}
                                                            </span>
                                                        </small>
                                                    </div>
                                                </div>
                                            </b-tab>
                                            <b-tab :title="$t('titles.errorDetail')" title-item-class="smalltab">
                                                <div style="font-size:.8em" class="mt-2 p-2" v-if="job.exception_stack">
                                                    <a href="#" @click.prevent="details=!details">{{$t('titles.errorDetail')}}</a>
                                                    <div v-if="details">
                                                        <code><pre>{{job.exception_stack}}</pre></code>
                                                    </div>
                                                </div>
                                                <div v-else class="p-2">
                                                    {{$t('common.noData')}}
                                                </div>
                                            </b-tab>
                                        </b-tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab :title="$tc('job.results', 2)" title-item-class="smalltab">
                        <div class="row" v-for="(step, inx) in job.steps" :key="inx">
                            <div class="col-md-12 lemonade">
                                <div class="mt-2 border-bottom pb-2" v-if="step.logs.find(s => s.type === 'HTML' || s.type === 'IMAGE' )">
                                    <TaskDisplay :task="getTask(step.task.id)" /> &nbsp;</strong>
                                    {{step.status}}
                                    <div v-for="log in step.logs" :key="log.id" style="font-size:.9em">
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
                    </b-tab>
                    <b-tab :title="$tc('job.visualizations', 2)" title-item-class="smalltab" v-if="job.results && job.results.length"
                        @click="loadVisualizations">
                        <div class="row" v-for="(result, inx) in job.results" :key="result.id">
                            <div class="col-md-8 lemonade offset-2" style="margin-top: 14px">
                                <caipirinha-visualization :url="getCaipirinhaLink(job.id, result.task.id)"></caipirinha-visualization>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab :title="$tc('job.details', 2) + ' (' + $tc('titles.job').toLowerCase() + ')' "
                        title-item-class="smalltab">
                        <ul class="mt-2">
                            <li class="list-group-item">
                                <strong>{{$t('common.date')}}:</strong> {{job.created}}
                            </li>
                            <li class="list-group-item">
                                <strong>{{$t('common.user.name')}}: </strong> {{job.user.name}}
                                ({{job.user.login}})
                            </li>
                            <li class="list-group-item">
                                <strong>{{$tc('titles.cluster')}}: </strong> {{job.cluster.name}}
                            </li>
                        </ul>
                    </b-tab>
                    <b-tab :title="$tc('job.sourceCode')" title-item-class="smalltab" @click="showSourceCode = 1">
                        <SourceCode v-if="showSourceCode" :job="job.id" />
                    </b-tab>
                    <!-- <b-tab :title="$tc('job.logs', 2)" title-item-class="smalltab">
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
                showProperties: false
            }
        },
        methods: {
            loadVisualizations() {

            },
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
                    console.debug('task', task)
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
                    if (msg.id === self.job.id && self.job.status !== 'COMPLETED') {
                        self.job.status = msg.status;
                        self.jobStatus = msg.status.toLowerCase();
                        self.job.finished = msg.finished;

                        if (msg.message) {
                            // let finalMsg = msg.message.replace(/&/g, '&amp;')
                            //     .replace(/"/g, '&quot;')
                            //     .replace(/</g, '&lt;')
                            //     .replace(/>/g, '&gt;');;
                            const finalMsg = msg.message;
                            self.job.status_text = finalMsg;
                            if (msg.status === 'COMPLETED') {
                                self.success(finalMsg);
                            } else if (msg.status === 'ERROR') {
                                if (msg.exception_stack) {
                                    self.job.exception_stack = msg.exception_stack.replace(/(^[ \t]*\n)/gm, "");
                                }
                                self.error(null, self.$t('job.error'));
                                // } else {
                                //     self.error(finalMsg)
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

    .circle {
        float: left;
        border-radius: 10px;
        height: 20px;
        width: 20px;
        margin: 2px 2px 0 2px;
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
</style>