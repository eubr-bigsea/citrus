<template>
    <main role="main">
        <div class="row">
            <div class="col">
                    <div class="d-flex justify-content-between align-items-center">
                        <h1> <span v-if="executeOnStart" class="fa fa-bolt text-warning"></span> {{workflow.name}} </h1>
                        <div>
                            <router-link :to="{name: 'addWorkflow'}"
                                class="btn btn-sm btn-outline-primary float-left mr-1">
                                {{$t('actions.back')}}</router-link>
                        </div>
                    </div>
                    <hr>
            </div>
        </div>
        <div class="row">
            <div class="col-md-3 col-lg-2">
                <form @submit.prevent="execute">
                <div v-for="variable in workflow.variables" :key="variable.name" class="lemonade-widgets">
                       <component :is="(variable.suggested_widget === null ? 'text': variable.suggested_widget) + '-component'" 
                           :field="variable"
                           :value="variable.default_value" 
                           :language="$root.$i18n.locale" 
                           :type="variable.type"
                           xlookups-method="getLookups" 
                           xlookups="lookups"
                           class="mt-2"
                           >
                       </component>
                </div>
                <div v-for="prop in properties" :key="`${prop.task}-${prop.name}`" class="lemonade-widgets">
                        <component :is="(prop.field.suggested_widget === null ? 'text': prop.field.suggested_widget) + '-component'" 
                           :field="prop.field"
                           :value="prop.filled.value" 
                           :language="$root.$i18n.locale" 
                           :type="prop.field.type"
                           xlookups-method="getLookups" 
                           xlookups="lookups">
                       </component>
                </div>
                <div v-for="fltr in filters" :key="fltr.id" class="lemonade-widgets mb-3">
                        <component :is="(fltr.suggested_widget === null ? 'text': fltr.suggested_widget) + '-component'" 
                           :field="fltr"
                           :value="fltr.value" 
                           :language="$root.$i18n.locale" 
                           :type="fltr.type"
                           xlookups-method="getLookups" 
                           xlookups="lookups">
                       </component>
                </div>
                <div class="buttons mt-2 pt-2 border-top text-center">
                    <button class="btn btn-sm btn-primary" type="submit">
                        <span class="fa fa-search"></span> {{$t('actions.search')}}
                    </button>
                </div>
                </form>
            </div>
            <div class="col-md-8 col-lg-10 border p-5">
                <div v-for="v in visualizations" :key="v.id" class="visualization">
                    <h5>{{v.id}}</h5>
                </div>
                {{filters}}
            </div>
        </div>
    </div>
</main>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import Notifier from '../mixins/Notifier';
    import DateComponent from '../components/widgets/Date.vue';
    import io from 'socket.io-client';

    let tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    export default {
        mixins: [Notifier],
        components: {
            'date-component': DateComponent, 
        },
        data(){
            return {
                executeOnStart: true,
                filters: [],
                job: { steps: [], user: {}, cluster: {} },
                operations: [],
                operationsLookup: new Map(),
                properties: [],
                savedFiltersName: null,
                savedFilters: {},
                socket: null,
                visualizations: [],
                workflow: {},
            }
        },
        props: {
        },
        beforeDestroy() {
            this.$root.$off('update-form-field-value');
            if (this.socket) {
                this.socket.emit('leave', { room: this.job.id });
                this.socket.close();
            }
        },
        mounted(){
            this.load();
            this.$root.$on('update-form-field-value', (field, value, labelValue) => {
                if (field.type === 'field'){
                    // const found = this.filters.find((f) => f.id === field.substring(2));
                    field.value = value;
                } else {
                    console.debug(field)
                }
            });
        },
        methods: {
            connectWebSocket() {
                const self = this;
                const socket = io(standNamespace, { upgrade: true, });

                self.socket = socket;

                socket.on('disconnect', () => {
                    console.debug('You are not connected');
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
                socket.on('update task', (msg, callback) => {
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
                            if (found.length === 0) {
                                step.logs.push({
                                    id: msg.step_id,
                                    level: msg.level,
                                    date: msg.date,
                                    type: msg.type,
                                    message: msg.message
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
                                window.setTimeout(() => (self.jobStatus = 'COMPLETED'), 10);
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
            },
            execute(){
                const payload = {
                    filters: this.filters.map((f) => [f.id, f.value]),
                    workflow: this.workflow.id
                };
                localStorage[this.savedFiltersName] = JSON.stringify(payload);
            },
            async getJob(){
                axios
                    .get(`${standUrl}/jobs/${this.job.id}`)
                    .then(resp => {
                        // Required in order to have status information
                        resp.data.workflow.tasks.forEach(t => (t.status = ''));
                        self.job = resp.data;
                        const workflow = self.job.workflow;
                        self.jobStatus = self.job.status.toLowerCase();
                        const params = {
                            platform: this.$route.params.platform,
                            lang: this.$root.$i18n.locale,
                            disabled: true // even disabled operations must be returned to keep compatibility
                        };
                        /*
                        axios
                            .get(`${tahitiUrl}/operations`, { params })
                            .then(resp => {
                                self.operations = resp.data;
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
                            )
                            .finally(() => {
                                Vue.nextTick(() => {
                                    this.$Progress.finish();
                                });
                            });
                        */
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
            },
            async load() {
                let self = this;
                self.$Progress.start()
                try {
                    const workflow = await axios.get(`${tahitiUrl}/workflows/${this.$route.params.id}`).then(
                        (resp) => resp.data);
                    
                    const params = {
                        platform: workflow.platform.id, 
                        subset: workflow.subset ? workflow.subset.id : null,
                        lang: this.$root.$i18n.locale,
                        workflow: workflow.id
                    }
                    const operations = await axios.get(`${tahitiUrl}/operations`, { params }).then(
                                (resp) => resp.data);
                    operations.forEach((op) => {
                        self.operationsLookup[op.id] = op
                    });
                    self.operations = operations;


                    workflow.variables.forEach((variable) => {
                        variable.help = variable.description;
                        if (variable.suggested_widget === 'dropdown'){
                            variable.values = JSON.stringify(
                                variable.parameters.split('\n').map((v) => { return {key: v, value: v} }));
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
                        for (var [name, value] of Object.entries(task.forms)){
                            if (value.publishing_enabled === true){
                                self.properties.push({
                                    name, filled: value, field: opFields.get(name), task: task.id
                                });
                            }
                        }
                        if (task.operation.type === 'VISUALIZATION'){
                            self.visualizations.push(task);
                        }
                        if (task.operation.slug === 'user-filter'){ // special operation
                            task.forms.filters.value.forEach((f) => {
                                f.required = f.multiplicity > 0;
                                if (self.savedFilters && self.savedFilters.filters && self.savedFilters.filters.has(f.id)){
                                    f.value = self.savedFilters.filters.get(f.id);
                                } else {
                                    f.value = f.default_value;
                                }
                                f.type = 'field';
                                self.filters.push(f);
                                self.executeOnStart = !f.required && self.executeOnStart;
                            });
                        }
                    });

                    if (!workflow.forms) {
                        workflow.forms = {};
                    }
                    self.workflow = workflow;
                    self.loaded = true;
                } catch(ex){
                    self.error(ex);
                }finally {
                    self.$Progress.finish()
                }
            },
        }
    }
</script>
<style scoped>
    .lemonade-widgets {
        width: 100%;
        min-height: 20px;
    }
    .visualization {
        border: 1px dashed;
        width: 100%;
        min-height: 200px;
    }
</style>
