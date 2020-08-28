<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div class="d-flex justify-content-between align-items-center">
                    <h1> <span v-if="executeOnStart" class="fa fa-bolt text-warning"></span> {{workflow.name}} </h1>
                    <div>
                        <router-link :to="{name: 'tracks'}" class="d-print-none btn btn-sm btn-outline-primary float-left mr-1">
                            {{$t('actions.back')}}</router-link>

                        <button @click="testar">Testar</button>
                    </div>
                </div>
                <hr>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2 col-lg-2 border-right">
                <form @submit.prevent="execute($event)" ref="form">
                    <div v-for="variable in workflow.variables" :key="variable.name" class="lemonade-widgets">
                        <component
                            :is="(variable.suggested_widget === null ? 'text': variable.suggested_widget) + '-component'"
                            :field="variable" :value="variable.default_value" :language="$root.$i18n.locale"
                            :type="variable.type" xlookups-method="getLookups" xlookups="lookups" class="mt-2">
                        </component>
                    </div>
                    <div v-for="prop in properties" :key="`${prop.task}-${prop.name}`" class="lemonade-widgets">
                        <component
                            :is="(prop.field.suggested_widget === null ? 'text': prop.field.suggested_widget) + '-component'"
                            :field="prop.field" :value="prop.filled.value" :language="$root.$i18n.locale"
                            :type="prop.field.type" xlookups-method="getLookups" xlookups="lookups">
                        </component>
                    </div>
                    <div v-for="fltr in filters" :key="fltr.id" class="lemonade-widgets mb-3">
                        <component :is="(fltr.suggested_widget === null ? 'text': fltr.suggested_widget) + '-component'"
                            :field="fltr" :value="fltr.value" :language="$root.$i18n.locale" :type="fltr.type"
                            xlookups-method="getLookups" xlookups="lookups">
                        </component>
                    </div>
                    <div class="buttons mt-2 pt-2 border-top text-center">
                        <button class="btn btn-sm btn-primary" type="submit" :disabled="running">
                            <span class="fa fa-search"></span> {{$t('actions.search')}}
                        </button>
                    </div>
                </form>
            </div>
            <div class="col-md-10 col-lg-10 p-2 mb-5">
                <div>
                    {{workflow.description}}
                </div>
                <div v-if="empty" class="empty-state text-center justify-content-between mt-4 pt-4">
                    <h4>
                        <span class="fa fa-flask fa-3x"></span>
                    </h4>
                    <h4>Execução da trilha "{{workflow.name}}"</h4>
                    <p>
                        Para executar a trilha, preencha os valores para os filtros na caixa à esquerda e
                        depois clique o botão "Executar".
                    </p>
                </div>
                <div v-else>
                    <div class="">
                        <div class="">
                            <grid-layout :layout.sync="layout" :col-num="12" :row-height="100" :is-draggable="true"
                                :is-resizable="true" :is-mirrored="false" :vertical-compact="true" :margin="[10, 10]"
                                :use-css-transforms="true" @layout-updated="layoutUpdatedEvent">

                                <grid-item v-for="item in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
                                    :i="item.i" :key="item.i" class="grid-item">
                                    <caipirinha-visualization v-if="!running" class="pl-2 pr-2"
                                        :url="getCaipirinhaLink(job.id, item.task.id, 0)" :height="100*item.h"/>
                                    <div v-else class="p-5 text-center mt-5">
                                        <b-spinner variant="success" type="grow"></b-spinner>
                                        <p>{{$t('common.wait')}}</p>
                                    </div>
                                    <div style="position: absolute; top:0; left:0">{{item.x}}/{{item.y}} {{item.w}}/{{item.h}} {{100*item.h}}</div>
                                </grid-item>
                            </grid-layout>
                        </div>
                    </div>
                </div>
                <!--
                {{lookups}}
                {{filters}}
                -->
            </div>
        </div>
    </main>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import Notifier from '../mixins/Notifier';
    import DateComponent from '../components/widgets/Date.vue';
    import VueGridLayout from 'vue-grid-layout';
    import io from 'socket.io-client';
    import CapirinhaVisualization from '../components/caipirinha-visualization/CaipirinhaVisualization.vue';


    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const standUrl = process.env.VUE_APP_STAND_URL;
    const standNamespace = process.env.VUE_APP_STAND_NAMESPACE;
    const standSocketIOPath = process.env.VUE_APP_STAND_SOCKET_IO_PATH;
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;

    export default {
        mixins: [Notifier],
        components: {
            'date-component': DateComponent,
            'caipirinha-visualization': CapirinhaVisualization,
        },
        data() {
            return {
                configuration: {},
                executeOnStart: true,
                filters: [],
                job: { steps: [], user: {}, cluster: {}, id: null },
                empty: true,
                layout: [],
                lookups: {},
                operations: [],
                operationsLookup: new Map(),
                properties: [],
                running: false,
                savedFiltersName: null,
                savedFilters: {},
                socket: null,
                visualizations: [],
                workflow: {},
            }
        },
        beforeDestroy() {
            this.$root.$off('update-form-field-value');
            if (this.socket) {
                this.socket.emit('leave', { room: this.job.id });
                this.socket.close();
            }
        },
        mounted() {
            const self = this;
            self.load();
            this.$root.$on('update-form-field-value', (field, value, labelValue) => {
                if (field.parameterType === 'field') {
                    field.value = value;
                } else if (field.parameterType === 'variable') {
                    const variable = self.workflow.variables.find((v) => v.name === field.name);
                    if (variable){
                        variable.value = value;
                    }
                } else {
                    field.field.value = value;
                }
            });
        },
        methods: {
            layoutUpdatedEvent: function (newLayout) {
                newLayout.forEach(item => {
                    this.configuration[item.i] = {
                        ...this.configuration[item.i],
                        x: item.x,
                        y: item.y,
                        width: item.w,
                        height: item.h
                    };
                });
                window.dispatchEvent(new Event('resize'));
            },
            connectWebSocket() {
                const self = this;
                const socket = io(standNamespace, { upgrade: true, });

                self.socket = socket;

                socket.on('disconnect', () => {
                    //self.warning({ message: self.$t('You are not connected') });
                });
                socket.on('response', msg => {
                    console.debug('response', msg);
                });
                socket.on('connect', () => {
                    const room = self.job.id;
                    console.debug('Connecting to room', room);
                    socket.emit('join', { room: room });
                    self.socket = socket;
                });
                socket.on('connect_error', () => {
                    console.debug('Web socket server offline');
                });
                // socket.on('update task', (msg, callback) => {
                //     const task = self.job.workflow.tasks.find(t => {
                //         return msg.task && t.id === msg.task.id;
                //     });
                //     console.debug(msg);
                //     if (task) {
                //         task.status = msg.status;
                //         let step = self.job.steps.find(step => step.task.id === task.id);
                //         if (step) {
                //             step.status = msg.status;
                //             const found = step.logs.filter(v => v.id === msg.id);
                //             if (found.length === 0) {
                //                 step.logs.push({
                //                     id: msg.step_id,
                //                     level: msg.level,
                //                     date: msg.date,
                //                     type: msg.type,
                //                     message: msg.message
                //                 });
                //             }
                //         }
                //     }
                // });
                socket.on('task result', msg => {
                    console.debug(msg)
                    const task = self.visualizations.find((t) => t.id === msg.task.id);
                    if (task) {
                        task.data = msg;
                    } else {
                        console.debug('task not found: ', msg.task.id);
                    }
                });
                socket.on('update job', msg => {
                    self.jobStatus = msg.status.toLowerCase();
                    if (msg.id === self.job.id && self.job.status !== 'COMPLETED') {
                        self.job.status = msg.status;
                        self.job.finished = msg.finished;
                        console.debug(msg.message);
                        if (msg.message) {
                            const finalMsg = msg.message;
                            self.job.status_text = finalMsg;
                            if (msg.status === 'COMPLETED') {
                                // hack
                                window.setTimeout(() => (self.jobStatus = 'COMPLETED'), 10);
                                //self.success(finalMsg);
                                self.running = false;
                            } else if (msg.status === 'ERROR') {
                                if (msg.exception_stack) {
                                    self.job.exception_stack = msg.exception_stack.replace(
                                        /(^[ \t]*\n)/gm,
                                        ''
                                    );
                                }
                                self.error(null, self.$t('job.error'));
                                self.running = false;
                            }
                        }
                    }
                });
                socket.on('task result', msg => {
                    self.job.results.push(msg);
                });
            },
            async execute(ev) {
                const self = this;
                try {
                    if (self.$refs.form.checkValidity()) {
                        self.running = true;
                        self.empty = false;
                        self.visualizations.forEach((v) => v.data = null);

                        const payload = {
                            filters: this.filters.map((f) => [f.id, f.value]),
                            workflow: this.workflow.id
                        };
                        localStorage[this.savedFiltersName] = JSON.stringify(payload);

                        const user = this.$store.getters.user;
                        const body = {
                            workflow: self.workflow,
                            cluster: { id: 1 }, // @FIXME Handle cluster information
                            name: self.workflow.name, //@FIXME
                            user: {
                                id: user.id,
                                login: user.login,
                                name: user.name
                            },
                        }
                        const headers = {
                            'Locale': self.$root.$i18n.locale,
                        };
                        self.job = await axios.post(`${standUrl}/jobs`, body, { headers })
                            .then((response) => response.data.data);
                        self.connectWebSocket();
                    } else {
                        self.$refs.form.reportValidity();
                    }
                } catch (ex) {
                    console.debug(ex)
                    if (ex.data) {
                        self.error(ex.data.message);
                    } else if (ex.status === 0) {
                        self.$root.$refs.toastr.e(`Error connecting to the backend (connection refused).`);
                    } else {
                        self.error(`Unhandled error: ${JSON.stringify(ex)}`);
                    }
                    self.running = false;
                };
            },
            getCaipirinhaLink(jobId, taskId, visId) {
                return `${caipirinhaUrl}/visualizations/${jobId}/${taskId}/${visId}`;
            },
            async load() {
                let self = this;
                self.$Progress.start()
                self.$Progress.start()
                try {
                    const workflow = await axios.get(`${tahitiUrl}/workflows/${this.$route.params.id}`).then(
                        (resp) => resp.data);
                    const query = self.$route.query;
                    console.debug(query)

                    const params = {
                        platform: workflow.platform.id,
                        subset: workflow.subset ? workflow.subset.id : null,
                        lang: this.$root.$i18n.locale,
                        workflow: workflow.id,
                        _ts: new Date().getTime(),
                    }
                    const operations = await axios.get(`${tahitiUrl}/operations`, { params }).then(
                        (resp) => resp.data);
                    operations.forEach((op) => { self.operationsLookup[op.id] = op });
                    self.operations = operations;

                    workflow.platform_id = workflow.platform.id;

                    workflow.variables.forEach((variable) => {
                        variable.help = variable.description;
                        variable.parameterType = 'variable';
                        if (variable.suggested_widget === 'dropdown') {
                            variable.values = JSON.stringify(
                                variable.parameters.split('\n').map((v) => { return { key: v, value: v } }));
                        }
                    });

                    self.savedFiltersName = `savedFilters_${self.$route.params.id}`;
                    if (localStorage[self.savedFiltersName]) {
                        self.savedFilters = JSON.parse(localStorage[self.savedFiltersName]);
                        self.savedFilters.filters = new Map(self.savedFilters.filters);
                    }
                    workflow.tasks.forEach((task) => {
                        const op = self.operationsLookup[task.operation.id];
                        const opFields = new Map(op.forms.flatMap(f => f.fields).map(f => [f.name, f]));
                        task.operation = op;
                        for (var [name, value] of Object.entries(task.forms)) {
                            if (value.publishing_enabled === true) {
                                const field = opFields.get(name);
                                // Copy field from the task
                                field.field = task.forms[field.name];
                                self.properties.push({
                                    name, filled: value, field
                                });
                            }
                        }
                        if (task.operation.type === 'VISUALIZATION' && task.enabled) {
                            task.data = null;
                            let taskCoords = (task.forms.grid_coordinates || {}).value || {};
                            console.debug("===", taskCoords)
                            const coords = {
                                // x and y are zero-based
                                "x": parseInt(taskCoords.column || 1) - 1,
                                "y": parseInt(taskCoords.row || 1) -1,
                                "w": parseInt(taskCoords.width || 12),
                                "h": parseInt(taskCoords.height || 3),
                                "i": task.id,
                                "task": task
                            };
                            self.layout.push(coords);
                            self.visualizations.push(task);
                        }
                        if (task.operation.slug === 'user-filter') { // special operation
                            task.forms.filters.value.forEach((f) => {
                                f.required = f.multiplicity > 0;
                                if (self.savedFilters && self.savedFilters.filters && self.savedFilters.filters.has(f.id)) {
                                    f.value = self.savedFilters.filters.get(f.id);
                                } else {
                                    f.value = f.default_value;
                                }
                                f.parameterType = 'field';
                                f.required = ['ONE', 'ONE_OR_MORE'].indexOf(f.multiplicity) > -1;
                                self.filters.push(f);

                                self.executeOnStart = (!f.required || (f.value !== null && f.value !== '')) && self.executeOnStart;

                                if (f.lookup) {
                                    f.suggested_widget = 'sample-lookup';
                                }
                            });
                        }
                    });
                    if (!workflow.forms) {
                        workflow.forms = {};
                    }
                    self.workflow = workflow;
                    self.loaded = true;
                    if (this.executeOnStart) {
                        //this.execute();
                    }
                } catch (ex) {
                    console.debug(ex)
                    self.error(ex);
                } finally {
                    self.$Progress.finish();
                }
            },
            testar() {
                this.$router.push({
                    query: {
                        plan: 'private',
                        _ts: new Date().getTime(),

                    }
                })
            },
        },
    }
</script>
<style scoped>
    .lemonade-widgets {
        width: 100%;
        min-height: 20px;
    }

    /* .visualization {
        border: 1px solid #eee;
        margin-top: 10px;
        width: 100%;
        min-height: 200px;
    } */
    .grid-item {
        overflow: auto;
    }
</style>
