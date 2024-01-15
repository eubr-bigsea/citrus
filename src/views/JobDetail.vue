<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div class="title">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 v-if="loaded" class="header-title">
                                <h6 class="header-pretitle">
                                    {{$t('titles.job', 1)}} #{{job.id}}
                                </h6>
                                {{workflow.name}}
                            </h1>
                        </div>
                        <div>
                            <router-link v-if="workflow.id"
                                         :to="{name: 'editWorkflow', params: {id: workflow.id, platform: workflow.platform.id}}"
                                         class="btn btn-outline-primary d-print-none float-right btn-sm">
                                <font-awesome-icon icon="fa-chevron-left" />
                                &nbsp; {{$t('actions.back')}} -
                                {{$t('titles.workflow', 1)}} {{job.workflow.id}}
                            </router-link>
                            <button v-if="job.status === 'RUNNING' || job.status === 'PENDING' || job.status === 'WAITING' "
                                    class="btn btn-sm btn-outline-danger me-1 pull-right" :title="$t('actions.stop')"
                                    @click="stop(job.id)">
                                <font-awesome-icon icon="stop" /> {{$t('actions.stop')}}
                            </button>
                        </div>
                    </div>
                    <div>
                        <b-tabs nav-class="custom-tab mb-0">
                            <b-tab active :title="$t('titles.job')" :title-link-class="'small-nav-link'">
                                <div>
                                    <diagram v-if="loaded" id="main-diagram" ref="diagram" :workflow="workflow"
                                             :operations="operations" :version="job.id" :show-toolbar="false"
                                             :editable="false" :shink="true" :loaded="loaded" :show-task-decoration="true"
                                             :initial-zoom=".85" />
                                </div>
                                <div class="job-details">
                                    <b-card no-body>
                                        <b-tabs card>
                                            <b-tab active>
                                                <template #title>
                                                    <div id="dtl-job-status"
                                                         class="job-status-circle lemonade-job margin-right"
                                                         :class="jobStatus" :title="job.status" />
                                                    {{$t('job.logs', 2)}}
                                                </template>
                                                <div>
                                                    <div class="alert" :class="{
                                                        'alert-success': job.status=='COMPLETED',
                                                        'alert-danger': job.status=='ERROR',
                                                        'alert-warning': job.status=='WAITING',
                                                    }">
                                                        {{job.status_text}}
                                                    </div>

                                                    <div v-for="step in notPendingSteps"
                                                         :key="step.id" class="job-step"
                                                         :class="{'disabled': selectedTask.id && selectedTask.id !== step.task.id}">
                                                        <div class="label"
                                                             :class="step.logs[step.logs.length-1].level.toLowerCase()">
                                                            {{$t(`juicer.log.${step.logs[step.logs.length-1].level.toLowerCase()}`)}}
                                                        </div>
                                                        <h2>{{getTask(step.task.id).name}}</h2>

                                                        <div v-for="log in step.logs" :key="log.id">
                                                            <p v-if="log.type === 'TEXT' || log.type === 'STATUS'">
                                                                <!--
                                                                    <span class="icon fa fa-fw" :class="{
                                                                        'running fa-sync': log.status=='RUNNING',
                                                                        'fa-spin': log.status=='RUNNING' && step.logs.length==1,
                                                                        'completed fa-check-circle': log.status=='COMPLETED',
                                                                        'error fa-times-circle': log.level=='ERROR',
                                                                        'warning fa-exclamation-triangle': log.status=='ERROR' && log.level=='WARN',
                                                                    }"></span>
                                                                    -->

                                                                <span class="date">{{$filters.formatJsonHourMinute(log.date)}}</span>
                                                                <span class="info">{{log.message}}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--
                                                    <div class="job-log-list">
                                                        <div id="dtl-job-status-text" class="alert alert-secondary">
                                                            {{job.status_text}}</div>
                                                        <ProgressChart :logs="sortedLogs" />
                                                        <div class="job-log-list">
                                                            <div v-for="log in sortedLogs" :key="log.id" class="job-log"
                                                                :class="{'disabled': selectedTask.id && selectedTask.id !== log.task.id}">

                                                                <small
                                                                    v-show="log.type !== 'SILENT' && log.type !== 'HTML' && log.type !== 'PROGRESS'">
                                                                    <span class="badge-custom"
                                                                        :class="'badge badge-' + log.level.replace('ERROR', 'danger').toLowerCase()">{{$t(`juicer.log.${log.level.toLowerCase()}`)}}</span>
                                                                    &nbsp;
                                                                    <span>{{log.date | formatJsonHourMinute}}</span>&nbsp;
                                                                    <TaskDisplay :task="getTask(log.task.id)"
                                                                        :simple="true" />

                                                                    <span
                                                                        v-if="log.type === 'TEXT'">&nbsp;{{log.message}}</span>
                                                                    <span
                                                                        v-else-if="log.type === 'STATUS'">&#9733;{{log.message}}</span>
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    -->
                                            </b-tab>
                                            <b-tab v-if="job.exception_stack" :title="$t('titles.errorDetail')">
                                                <div style="font-size:.8em">
                                                    <code>
                                                        <pre>{{job.exception_stack}}</pre>
                                                    </code>
                                                </div>
                                            </b-tab>
                                            <b-tab :title="$t('job.details', 2)">
                                                <dl>
                                                    <dt>{{$t('common.date')}}</dt>
                                                    <dd>{{$filters.formatJsonDate(job.created)}}</dd>
                                                    <dt>{{$t('common.user.name')}}</dt>
                                                    <dd>{{job.user.name}} ({{job.user.login}})</dd>
                                                    <dt>{{$t('titles.cluster')}}</dt>
                                                    <dd>{{job.cluster.name}}</dd>
                                                </dl>
                                            </b-tab>
                                            <b-tab v-if="job.workflow" :title="$t('job.parameters', 2)">
                                                <div v-for="ttask in job.workflow.tasks" :key="ttask.id" class="card">
                                                    <div class="card-body" style="overflow: auto">
                                                        {{ttask.name}} ({{ttask.operation.name}})
                                                        <table class="table table-sm table-parameters">
                                                            <thead>
                                                                <tr />
                                                                <tr>
                                                                    <th>{{$t('job.parameters', 1)}}</th>
                                                                    <th>{{$t('job.values', 1)}}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-for="(v, k, i) in ttask.forms" :key="i">
                                                                    <td>{{v.label ? v.label : k}}</td>
                                                                    <td>
                                                                        {{v.labelValue ? v.labelValue: v.value}}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </b-tab>
                                        </b-tabs>
                                    </b-card>
                                </div>
                            </b-tab>
                            <!--
                            <b-tab v-if="false" :title="$t('job.results', 2)">
                                <div v-for="(step, inx) in job.steps" :key="inx" class="row">
                                    <div class="col-md-12 lemonade">
                                        <div v-if="step.logs.find(s => s.type === 'HTML' || s.type === 'IMAGE' )"
                                            class="mt-2 border-bottom pb-2">
                                            <TaskDisplay :task="getTask(step.task.id)" />
                                            &nbsp;
                                            {{step.status}}
                                            <div v-for="log in step.logs" :key="log.id"
                                                style="font-size:.9em; margin-top: 20px">
                                                <span v-if="log.type === 'HTML'">
                                                    <div class="html-div" v-html="log.message"></div>
                                                </span>
                                                <div v-else-if="log.type === 'IMAGE'" class="image-result">
                                                    <img :src="'data:image/png;base64,' + log.message">
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="step.logs.find(s => s.type === 'OBJECT')"
                                            class="mt-2 border-bottom pb-2">
                                            <TaskDisplay :task="getTask(step.task.id)" />
                                            &nbsp;
                                            {{step.status}}
                                            <div v-for="log in step.logs" :key="log.id"
                                                style="font-size:.9em; margin-top: 20px">
                                                <span v-if="log.type === 'OBJECT'">
                                                    <v-client-table ref="jobList" :data="log.message.rows"
                                                        :columns="log.message.attributes.map(a=>a.label)"
                                                        :options="sampleOptions"></v-client-table>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </b-tab>
                            -->
                            <!--
                            <b-tab v-if="false" v-show="job.results && job.results.length" :title="$t('job.visualizations', 2)"
                                @click="showVisualizations = true">
                                <div v-for="result in job.results" :key="result.id" class="row">
                                    <div v-if="showVisualizations" class="col-md-8 lemonade offset-2"
                                        style="margin-top: 14px; display:table">
                                        <caipirinha-visualization :url="getCaipirinhaLink(job.id, result.task.id, 0)">
                                        </caipirinha-visualization>
                                    </div>
                                </div>
                            </b-tab>
                            -->
                            <b-tab :title="$t('job.results', 2)" :title-link-class="'small-nav-link'">
                                <div class="row">
                                    <div class="col-md-3 pt-3 result-area">
                                        <b-list-group>
                                            <b-list-group-item v-for="(res, taskId) in allResults" :key="taskId" button
                                                               href="#" @click.prevent="showResult(taskId)">
                                                {{res[0].value.task.name}}
                                                <br><em><small>{{res[0].value.task.operation.name}}</small></em>
                                            </b-list-group-item>
                                        </b-list-group>
                                    </div>
                                    <div class="col-md-9 border-left result-area">
                                        <div v-for="(res, taskId) in allResults" :key="taskId" class="row">
                                            <div class="col-md-12">
                                                <b-card :id="`task-${taskId}`" :header="getTask(taskId).name"
                                                        class="mt-2" header-bg-variant="light" border-variant="info">
                                                    <div v-for="(result, inx) in res" :key="inx">
                                                        <div v-if="result.type === 'result'" class="col-md-12 lemonade">
                                                            <div v-if="result.value.logs.find(s => s.type === 'HTML' || s.type === 'IMAGE' )"
                                                                 :header="result.value.task.name" class="mt-2"
                                                                 header-bg-variant="light" border-variant="info">
                                                                <div v-for="log in result.value.logs" :key="log.id"
                                                                     class="ps-5 mt-2">
                                                                    <span v-if="log.type === 'HTML'">
                                                                        <div class="html-div" v-html="log.message" />
                                                                    </span>
                                                                    <div v-else-if="log.type === 'IMAGE'"
                                                                         class="image-result">
                                                                        <img :src="'data:image/png;base64,' + log.message">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div v-if="result.value.logs.find(s => s.type === 'OBJECT')"
                                                                 :header="result.value.task.name" class="mt-2"
                                                                 header-bg-variant="light" border-variant="info">
                                                                <h1>Objeto</h1>
                                                                <div v-for="log in result.value.logs" :key="log.id"
                                                                     class="ps-5 mt-2">
                                                                    <span v-if="log.type === 'OBJECT' && log.message.attributes">
                                                                        <v-client-table ref="jobList"
                                                                                        :data="log.message.rows"
                                                                                        :columns="log.message.attributes.map(a=>a.label)"
                                                                                        :options="sampleOptions">
                                                                            <template v-for="header in log.message.attributes.map(a=>a.label)" 
                                                                                      #[`h__${header}`]="{}">
                                                                                <span :key="header">{{header}}</span>
                                                                            </template>
                                                                        </v-client-table>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div v-if="result.type === 'visualization'"
                                                             class="col-md-12 lemonade">
                                                            <caipirinha-visualization :url="getCaipirinhaLink(job.id, result.value.task.id, 0)" />
                                                        </div>
                                                    </div>
                                                </b-card>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </b-tab>

                            <b-tab :title="$t('job.sourceCode')" :title-link-class="'small-nav-link'"
                                   @click="showSourceCode = 1">
                                <b-card class="mt-3">
                                    <SourceCode v-if="showSourceCode" :job="job.id" />
                                </b-card>
                            </b-tab>
                        </b-tabs>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
;
import DiagramComponent from '../components/Diagram.vue';
import SourceCode from '../components/SourceCode.vue';
import Notifier from '../mixins/Notifier.js';
import axios from 'axios';
import io from 'socket.io-client';
import CapirinhaVisualization from '../components/caipirinha-visualization/CaipirinhaVisualization.vue';

const standUrl = import.meta.env.VITE_STAND_URL;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const caipirinhaUrl = import.meta.env.VITE_CAIPIRINHA_URL;
const tahitiUrl = import.meta.env.VITE_TAHITI_URL;

/*
    const TaskDisplay = Vue.extend({
        props: {
            task: {default: () => {}, type: Object},
            simple: { default: false, type: Boolean }
        },
        render(createElement) {
            const color =
                this.task.forms.color && this.task.forms.color.value
                    ? this.task.forms.color.value.background
                    : '#222';

            let style;
            let text;
            if (!this.simple) {
                style = {
                    'font-size': '.7em',
                    padding: '2px',
                    width: '180px',
                    display: 'inline-block',
                    'text-align': 'center',
                    border: '1px solid',
                    'border-left': '8px solid',
                    'border-right': '8px solid',
                    'border-color': color
                };
                text = this.task.name;
            } else {
                style = {};
                text = `[${this.task.name}]`;
            }

            return createElement('span', {
                domProps: {
                    innerHTML: text
                },
                style,
                text
            });
        }
    });
    */
export default {
    components: {
        diagram: DiagramComponent,
        'caipirinha-visualization': CapirinhaVisualization,
        SourceCode,
    },
    mixins: [Notifier],
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
            progressIndicators: [],
            sampleOptions: {
                skin: 'table-smallest table table-hover',
                filterable: false, perPageValues: [],
                sortable: [],
                texts: {
                    filter: this.$t('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
                }
            }
        };
    },
    computed: {
        notPendingSteps() {
            return this.job.steps.filter(step => step.status!='PENDING');
        },
        sortedLogs() {
            let logs = [];
            this.job.steps.forEach(step => {
                step.logs.forEach(info => {
                    info.task = step.task;
                    logs.push(info);
                });
            });
            return logs.sort((a, b) => {
                return a.id - b.id;
            });
        },
        allResults() {
            const results = [];
            const self = this;
            this.job.steps.filter(s => s.logs.find(l => l.type === 'HTML' || l.type === 'IMAGE' || l.type === 'OBJECT')).forEach(step => {
                step.task = self.tasks[step.task.id];
                results.push({ type: 'result', order: 0, value: step });
            });
            if (this.job.results) {
                this.job.results.forEach(result => {
                    result.task = self.tasks[result.task.id];
                    results.push({ type: 'visualization', order: 0, value: result });
                });
            }
            return results.reduce((acc, curr) => {
                if (!acc[curr.value.task.id]) acc[curr.value.task.id] = [];
                acc[curr.value.task.id].push(curr);
                return acc;
            }, {});
        }
    },
    beforeUnmount() {
        if (this.socket) {
            this.socket.emit('leave', { room: this.job.id });
            this.socket.close();
        }
        this.$root.$off('onclick-task');
        this.$root.$off('onblur-selection');
    },
    mounted() {
        let self = this;
        axios
            .get(`${standUrl}/jobs/${this.$route.params.id}`)
            .then(resp => {
                // Required in order to have status information
                resp.data.workflow.tasks.forEach(t => (t.status = ''));
                self.job = resp.data;
                const workflow = self.job.workflow;
                self.jobStatus = self.job.status.toLowerCase();
                const operationIds = workflow.tasks.map(t => t.operation.id.toString());
                const params = {
                    platform: this.$route.params.platform,
                    lang: this.$root.$i18n.locale,
                    ids: operationIds,
                    disabled: true, // even disabled operations must be returned to keep compatibility
                    ts: new Date().getTime() // in order to avoid cache
                };
                axios
                    .get(`${tahitiUrl}/operations`, { params })
                    .then(resp => {
                        self.operations = resp.data.data;
                        self.operations.forEach(op => {
                            self.operationsLookup[op.id] = op;
                        });
                        workflow.tasks.forEach(task => {
                            task.operation = self.operationsLookup[task.operation.id];
                            task.status = task.status || '';
                        });

                        self.$nextTick(() => {
                            self.loaded = true;
                            self.workflow = workflow;
                        });
                    })
                    .catch(
                        function (e) {
                            this.error(e);
                        }.bind(this)
                    );

                self.sortedSteps = resp.data.steps.sort((s1, s2) => {
                    let result = -1;
                    if (s1.logs.length) {
                        if (s2.logs.length) {
                            result = s1.logs[0].id - s2.logs[0].id;
                        } else {
                            result = 1;
                        }
                    }
                    return result;
                });
                workflow.tasks.forEach(task => {
                    self.tasks[task.id] = task;
                });
                self.job.steps.forEach(step => {
                    self.tasks[step.task.id].status = step.status;
                    step.logs.forEach(log => {
                        if (log.type === 'OBJECT' && typeof (log.message) === 'string') {
                            log.message = JSON.parse(log.message);
                            if (log.message.rows) { // Sample table
                                const attributeNames = log.message.attributes.map(attr => attr.key);
                                log.message.rows = log.message.rows.map(
                                    row => Object.assign(...attributeNames.map((attr, i) => { return { [attr]: row[i] }; })));
                            }
                        }

                    });
                });
                resp.data.results.forEach(result => {
                    self.results[result.task.id] = result;
                });
                if (['running', 'waiting'].includes(self.job.status.toLowerCase())) {
                    self.connectWebSocket();
                }
            })
            .catch(function (e) {
                self.error(e);
            });
        this.$root.$on('onclick-task', taskComponent => {
            this.selectedTask = taskComponent.task;
            this.showProperties = true;
        });
        this.$root.$on('onblur-selection', () => {
            this.selectedTask = {};
            this.showProperties = false;
        });
    },
    methods: {
        ttype(v) {
            return typeof (v);
        },
        stop(jobId) {
            this.confirm(
                this.$t('actions.stop'),
                this.$t('messages.doYouWantToStop'),
                () => {
                    axios
                        .post(`${standUrl}/jobs/${jobId}/stop`, {})
                        .then(() => {
                            this.success(
                                this.$t('messages.successStop', {
                                    what: this.$t('titles.job', 1)
                                })
                            );
                            this.$router.push({
                                name: 'editWorkflow',
                                params: {
                                    id: this.workflow.id,
                                    platform: this.workflow.platform.id
                                }
                            });
                        })
                        .catch(
                            function (e) {
                                this.error(e);
                            }.bind(this)
                        );
                }
            );
        },
        showResult(taskId) {
            const elem = document.getElementById(`task-${taskId}`);
            if (elem) {
                elem.scrollIntoView();
            }
        },
        getTask(taskId) {
            return this.tasks[taskId];
        },

        getResults(taskId) {
            return { taskId: this.results[taskId] };
        },
        getCaipirinhaLink(jobId, taskId, visId) {
            return `${caipirinhaUrl}/visualizations/${jobId}/${taskId}/${visId}`;
        },
        connectWebSocket() {
            const self = this;
            const opts = {
                upgrade: true,
            };
            if (standSocketIoPath !== '') {
                opts['path'] = standSocketIoPath;
            }
            const socket = io(`${standSocketServer}${standNamespace}`, opts);

            self.socket = socket;

            socket.on('disconnect', () => {
                console.debug('You are not connected');
            });
            socket.on('response', msg => {
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
            socket.on('update task', (msg, callback) => {// eslint-disable-line no-unused-vars
                const task = self.job.workflow.tasks.find(t => {
                    return msg.task && t.id === msg.task.id;
                });
                    // const task = self.tasks[msg.task.id];
                if (task) {
                    task.status = msg.status;
                    let step = self.job.steps.find(step => step.task.id === task.id);
                    if (step) {
                        step.status = msg.status;
                        const found = step.logs.filter(v => v.id === msg.id);
                        let message = msg.message;
                        if (msg.type === 'OBJECT' && msg.meaning === 'sample') {
                            message = JSON.parse(message);
                            const attributeNames = message.attributes.map(attr => attr.key);
                            message.rows = message.rows.map(
                                row => Object.assign(...attributeNames.map((attr, i) => { return { [attr]: row[i] }; })));
                        }
                        if (found.length === 0) {
                            step.logs.push({
                                id: msg.step_id,
                                level: msg.level,
                                date: msg.date,
                                type: msg.type,
                                message
                            });
                        }
                    }
                }
            });
            socket.on('update job', msg => {
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
                            window.setTimeout(() => {
                                self.jobStatus = 'COMPLETED';
                                self.job.steps.forEach(step => {
                                    if (step.status !== 'COMPLETED') {
                                        step.status = 'COMPLETED';
                                    }
                                });
                            }, 10);
                            self.success(finalMsg);
                        } else if (msg.status === 'ERROR') {
                            if (msg.exception_stack) {
                                self.job.exception_stack = msg.exception_stack.replace(
                                    /(^[ \t]*\n)/gm,
                                    ''
                                );
                            }
                            self.error(null, self.$t('job.error'));
                        }
                    }
                }
            });
            socket.on('task result', msg => {
                self.job.results.push(msg);
            });
        }
    }
};
</script>
<style lang="scss">
    .alert {
        margin-bottom: 0 !important;
    }

    .job-details {
        width: 470px;
        max-height: calc(100vh - 300px);
        position: fixed;
        right: 1rem;
        bottom: calc(1rem + 25px);
        overflow: hidden;
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);

        .tab-pane {
            max-height: calc(100vh - 356px);
            overflow: auto;
        }
    }

    .image-result {
        border: 1px dashed #ccc;
        width: 100%;
    }

    .badge-custom {
        width: 80px;
    }

    .html-div {
        overflow: auto;
        font-size: 0.8em;
    }

    .html-div .table td,
    .html-div .table th {
        padding: 0.3rem;
    }

    .alternate {
        background: #eee;
    }

    .alternate>div>div {
        background: #fff;
    }

    .alternate>div {
        padding: 5px;
        padding-bottom: 0;
        padding-left: 0;
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
        background-color: #ffdc00;
    }

    .job-step {
        padding: 1rem 0;
        border-bottom: 1px solid rgba(var(--font-color-rgb), .16);

        &.disabled {
            opacity: .25;
        }

        .label {
            font-size: 10px;
            font-weight: 500;
            text-transform: uppercase;
            color: rgba(#4B4E51, .5);

            &.info {
                color: #56C0E0;
            }

            &.warning {
                color: #F0AD4E;
            }

            &.error {
                color: #D9534F;
            }
        }

        .date {
            color: #97999B;
            font-size: 12px;
            font-weight: normal;

            span {
                //display: inline-block;
                margin-right: .25rem;

                &::after {
                    content: " / ";
                }

                &:last-child {
                    &::after {
                        content: "";
                    }
                }
            }
        }

        h2 {
            font-size: 16px;
            font-weight: 700;
            margin: 0;
        }

        p {
            margin: .25rem 0;
            font-size: 12px;

            span {
                display: inline-block;
            }

            .icon {
                margin-right: .25rem;

                &.running {
                    color: #A5A6A8;
                }

                &.completed {
                    color: #A8CA57;
                }

                &.warning {
                    color: #F0AD4E;
                }

                &.error {
                    color: #D9534F;
                }
            }

            .date {
                color: #97999B;
                margin-right: .5rem;
            }
        }
    }

    .job-log-list {
        flex-direction: column;
        display: flex;
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
        flex-direction: column;
    }

    .header-title {
        margin-bottom: 12px !important;
    }

    .header-title>span {
        font-weight: 200;
    }

    .header-pretitle:hover>a {
        text-decoration: none;
    }

    .plot-container.plotly {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .table-parameters td,
    .table-parameters th {
        padding: 1px !important;
        font-size: 0.75em;
    }

    .result-area {
        max-height: 75vh;
        border: 1px solid #ccc;
        padding: 4px 0;
        overflow: auto;
    }
</style>