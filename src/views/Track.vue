<template>
    <main role="main">
        <!--
        <div class="row">
            <div class="col">
                <div class="d-flex justify-content-between align-items-center">
                    <h1> {{workflow.name}} </h1>
                    <div>
                        <router-link :to="{name: 'tracks'}" class="d-print-none btn btn-sm btn-outline-primary float-left mr-1">
                            {{$t('actions.back')}}</router-link>
                    </div>
                </div>
                <hr>
            </div>
        </div>
        -->
        <div class="row">
            <div class="col-md-4 col-lg-3 border-right">
                <div class="mb-4 text-secondary">
                    <p class="border-bottom">
                        <!--span v-if="executeOnStart" class="fa fa-bolt text-warning"></span--> {{workflow.name}}
                    </p>
                    <!--
                    <VuePerfectScrollbar v-if="loaded" ref="scrollBar" useBothWheelAxes="true" class="scroll-area"
                        style="margin-right:-15px">
                        -->
                    <form v-if="loaded" ref="form" class="pr-3 zoom-90">

                        <div v-for="field in sortedEditFields" :key="field.key" class="lemonade-widgets"
                            :data-name="field.name" :data-type="field.sourceType"
                            :data-component="field.suggested_widget" :data-index="field.display_index">
                            <markdown-component v-if="field.textBefore" :text="field.textBefore" />
                            <template v-if="!!!field.hidden">
                                <component v-if="prepareVariable(field)" :is="`${field.suggested_widget}-component`"
                                    :field="field" :value="field.value" :language="$root.$i18n.locale"
                                    :show-help="false" :type="field.type" xlookups-method="getLookups"
                                    xlookups="lookups" class="mt-2" :data-component="field.suggested_widget"
                                    :data-index="field.display_index" @update-form-field-value="updateFieldValue" />
                                <component v-else
                                    :is="(field.suggested_widget === null ? 'text': field.suggested_widget) + '-component'"
                                    :field="field" :value="field.value" :language="$root.$i18n.locale"
                                    :show-help="false" :type="field.type" class="mt-2"
                                    @update-form-field-value="updateFieldValue">
                                </component>
                            </template>
                            <markdown-component v-if="field.textAfter" :text="field.textAfter" />

                        </div>
                        <!--
                        <div v-for="field in form" :key="field.name" class="lemonade-widgets" :data-name="field.name"
                            :data-type="field.sourceType">
                            <markdown-component v-if="field.textBefore" :text="field.textBefore" />
                            <template v-if="!!!field.hidden">
                                <component v-if="prepareVariable(field)" :is="`${field.suggested_widget}-component`"
                                    :field="field" :value="field.default_value" :language="$root.$i18n.locale"
                                    :show-help="false" :type="field.type" xlookups-method="getLookups"
                                    xlookups="lookups" class="mt-2" />
                                <component v-else
                                    :is="(field.suggested_widget === null ? 'text': field.suggested_widget) + '-component'"
                                    :field="field" :value="field.default_value" :language="$root.$i18n.locale"
                                    :show-help="false" :type="field.type" xlookups-method="getLookups"
                                    xlookups="lookups" class="mt-2">
                                </component>
                            </template>
                            <markdown-component v-if="field.textAfter" :text="field.textAfter" />
                        </div>
                        -->
                        <div v-for="prop in properties" :key="`${prop.task}-${prop.name}`" class="lemonade-widgets"
                            :data-property="prop.name">
                            <component
                                :is="(prop.field.suggested_widget === null ? 'text': prop.field.suggested_widget) + '-component'"
                                :field="prop.field" :value="prop.filled.value" :language="$root.$i18n.locale"
                                :type="prop.field.type" xlookups-method="getLookups" xlookups="lookups">
                            </component>
                        </div>
                        <!--
                            <div v-for="fltr in filters"
                                v-if="(fltr.suggested_widget === null ? 'text': fltr.suggested_widget) !== undefined"
                                :key="fltr.id" class="lemonade-widgets mb-3" data-filter="fltr.name">
                                {{fltr}}
                                <component
                                    :is="(fltr.suggested_widget === null ? 'text': fltr.suggested_widget) + '-component'"
                                    :field="fltr" :value="fltr.value" :language="$root.$i18n.locale" :type="fltr.type"
                                    xlookups-method="getLookups" xlookups="lookups">
                                </component>
                            </div>
                        -->
                    </form>
                    <!--
                    </VuePerfectScrollbar>
                    -->
                    <div v-else class="text-bold-normal">
                        <label>{{$tc('common.filter')}}:</label>
                        <b-skeleton type="input" width="65%"></b-skeleton>

                        <label>{{$tc('common.filter')}}:</label>
                        <b-skeleton type="input" width="85%" height="100px"></b-skeleton>
                        <br />
                        <b-skeleton type="avatar" width="30px" height="30px"></b-skeleton>
                        <b-skeleton type="avatar" width="30px" height="30px"></b-skeleton>
                        <b-skeleton type="avatar" width="30px" height="30px"></b-skeleton>
                        <br />
                        <b-skeleton animation="wave" width="85%" height="60px"></b-skeleton>
                        <b-skeleton animation="wave" width="55%" height="30px"></b-skeleton>
                        <b-skeleton animation="wave" width="70%" height="60px"></b-skeleton>

                    </div>
                    <div class="buttons mt-5 pt-2 text-center border-top">
                        <button class="btn btn-sm btn-outline-secondary float-right ml-1 mb-2" @click="showWorkflowInfo">
                            <span class="fas fa-info-circle"></span>
                        </button>
                        <button class="btn btn-sm btn-primary float-right ml-1 mb-2" type="submit" :disabled="running"
                            @click="execute">
                            <span class="fa fa-search"></span> {{$t('actions.search')}}
                        </button>
                        <button class="btn btn-sm btn-outline-info float-right" type="button" @click="showHelp"
                            :disabled="running">
                            <span class="fa fa-question-circle"></span> {{$t('variables.help')}}
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-md-8 col-lg-9 p-2 bg-white" style="min-height: 85vh;">
                <div v-if="empty" class="empty-state text-center justify-content-between mt-4 pt-4">
                    <h4>
                        <span class="fa fa-flask fa-3x"></span>
                    </h4>
                    <h4>Execução da trilha "{{workflow.name}}"</h4>
                    <p class="font-italic">{{workflow.description}}</p>
                    <p>
                        Para executar a trilha, preencha os valores para os filtros na caixa à esquerda e
                        depois clique o botão "Pesquisar".
                    </p>
                </div>
                <div v-else-if="statusError && !running"
                    class="empty-state text-center justify-content-between mt-4 pt-4">
                    <h4>
                        <span class="fa fa-flask fa-3x"></span>
                    </h4>
                    <h4>Execução da trilha "{{workflow.name}}"</h4>
                    <p class="font-italic">{{workflow.description}}</p>
                    <p>
                        Um problema aconteceu:
                    </p>
                    <div class="alert alert-danger p-2 m-4">{{statusError}}</div>
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
                                        :url="getCaipirinhaLink(job.id, item.task.id, 0)" :height="100*item.h" />
                                    <div v-else class="p-5 text-center mt-5">
                                        <b-spinner variant="success" type="grow"></b-spinner>
                                        <p>{{$t('common.wait')}}</p>
                                    </div>

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
        <b-modal ref="modalWorkflowInfo" :title="$tc('titles.info', 2)" ok-only size="lg" button-size="sm">
            <table class="table table-sm small">
                <tbody>
                    <tr>
                        <td>{{$tc('titles.workflow', 1)}}:</td>
                        <td>{{workflow.id}} - {{workflow.name}}</td>
                    </tr>
                    <tr>
                        <td>{{$tc('common.author', 1)}}:</td>
                        <td>{{workflow.user? workflow.user.name: ''}}</td>
                    </tr>
                    <tr>
                        <td>{{$tc('common.created', 1)}}:</td>
                        <td>{{workflow.created|formatJsonDate}}</td>
                    </tr>
                    <tr>
                        <td>{{$tc('common.updated', 1)}}:</td>
                        <td>{{workflow.updated|formatJsonDate}}</td>
                    </tr>
                    <tr>
                        <td>{{$tc('workflow.preferredCluster', 1)}}:</td>
                        <td>{{preferredCluster.name}}</td>
                    </tr>
                </tbody>
            </table>
        </b-modal>
        <b-modal ref="modalHelp" :title="$tc('variables.help')" ok-only size="lg" button-size="sm">
            <small>
                Você deve necessariamente informar todos os campos obrigatórios do formulário.
                Os campos obrigatórios são destacados em negrito e têm um asterisco (*) em seu rótulo.

                O botão Pesquisar dispara a execução da trilha e se tudo estiver certo, começa a executar a trilha. A
                área de resultados muda, inicialmente mostrando indicadores <b-spinner variant="success" small
                    type="grow"></b-spinner> e depois, mostrando as visualizações, à medida que os dados vão sendo
                recebidos.
            </small>
            <table class="table table-sm small">
                <thead class="">
                    <tr>
                        <th style="width:150px">Campo</th>
                        <th>Ajuda</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="h in sortedEditFields" :key="h.key" v-if="h.help">
                        <td>{{h.label}}</td>
                        <td>{{h.help}}</td>
                    </tr>
                </tbody>
            </table>
        </b-modal>
    </main>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import Notifier from '../mixins/Notifier';
    import DateComponent from '../components/widgets/Date.vue';
    import VueGridLayout from 'vue-grid-layout';
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';
    import io from 'socket.io-client';
    import CapirinhaVisualization from '../components/caipirinha-visualization/CaipirinhaVisualization.vue';


    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const standUrl = process.env.VUE_APP_STAND_URL;
    const standNamespace = process.env.VUE_APP_STAND_NAMESPACE;
    const standSocketIOPath = process.env.VUE_APP_STAND_SOCKET_IO_PATH;
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;

    class EditField {
        constructor(obj, sourceType) {
            this.sourceType = sourceType;
            // Text before/after not supported for variables and props
            this.textBefore = null;
            this.textAfter = null;
            this.taskId = null;
            this.property = null;
            this.variable = null;
            if (sourceType === 'variable') {
                this.default_value = obj.default_value;
                this.display_index = parseInt(obj.parameters.display_index || '0');
                this.help = obj.description;
                this.label = obj.label;
                this.multiplicity = obj.multiplicity;
                this.name = obj.name;
                this.required = obj.multiplicity === 1 || obj.multiplicity === 3;
                this.suggested_widget = obj.suggested_widget;
                this.type = obj.type;
                this.variable = obj.variable;
                this.value = null;
                this.values = obj.values;
            } else if (sourceType === 'property') {
                this.default_value = obj.value;
                this.display_index = parseInt(obj.display_index || '0');
                this.help = obj.help;
                this.label = obj.property.label;
                this.multiplicity = '0'; //FIXME
                this.name = obj.name;
                this.property = obj.property;
                this.suggested_widget = obj.suggested_widget;
                this.type = obj.type;
                this.value = obj.property?.value;
                this.taskId = obj.taskId;
                this.values = JSON.parse(obj.values); //FIXME
            } else if (sourceType === 'filter') {
                this.default_value = obj.value;
                this.display_index = parseInt(obj.display_index || '0');
                this.field = { label: obj.label, value: null };
                this.help = obj.help;
                this.label = obj.label;
                this.lookup = obj.lookup; // Fill sample lookup
                this.multiplicity = '0'; //FIXME
                this.name = obj.name;
                this.key = obj.key;
                this.required = obj.multiplicity !== 'OPTIONAL'
                    && obj.multiplicity !== 'ZERO_OR_MORE'; // FIXME
                this.suggested_widget = obj.suggested_widget;
                this.type = obj.type;
                this.textBefore = obj.textBefore;
                this.textAfter = obj.textAfter;
                this.value = obj.value;
                this.filter = obj;
                //this.values = obj.parameters.values;
            } else {
                throw new Error(`Invalid source type: ${sourceType}`);
            }
        }
    }
    export default {
        mixins: [Notifier],
        components: {
            'date-component': DateComponent,
            'caipirinha-visualization': CapirinhaVisualization,
            VuePerfectScrollbar
        },
        data() {
            return {
                configuration: {},
                executeOnStart: true,
                editFields: [],
                form: [],
                filters: [],
                job: { steps: [], user: {}, cluster: {}, id: null },
                empty: true,
                layout: [],
                loaded: false,
                lookups: {},
                operationsLookup: new Map(),
                preferredCluster: {},
                properties: [], //FIXME: remove
                running: false,
                savedFiltersName: null,
                savedFilters: {},
                socket: null,
                statusError: null,
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
            this.load();
            this.$root.$on('update-form-field-value', this.updateFieldValue)
        },

        computed: {
            sortedEditFields() {
                return this.editFields.sort((a, b) => a.display_index - b.display_index);
            }
        },
        methods: {
            updateFieldValue(field, value, labelValue) {
                if (field.sourceType === 'filter') {
                    field.filter.value = value;
                    field.value = value;
                } else if (field.sourceType === 'variable') {
                    field.variable.value = value;
                } else if (field.sourceType === 'property') {
                    field.property.value = value;
                } else {
                    console.log(`Unknown field type: ${field.sourceType}`);
                }
            },
            showWorkflowInfo() {
                this.$refs.modalWorkflowInfo.show();
            },
            showHelp() {
                this.$refs.modalHelp.show();
            },
            prepareVariable(variable) {
                return true; //FIXME
                if (variable.parameters && variable.parameters.length) {
                    variable.values = variable.parameters;
                    variable['default'] = variable.default_value;
                    return true;
                }
                return false;
            },
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
                    //console.debug('response', msg);
                });
                socket.on('connect', () => {
                    const room = self.job.id;
                    //console.debug('Connecting to room', room);
                    socket.emit('join', { room: room });
                    self.socket = socket;
                });
                socket.on('connect_error', () => {
                    //console.debug('Web socket server offline');
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
                    //console.debug(msg)
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
                        //console.debug(msg.message);
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
                                self.statusError = msg.message;
                                //self.error(null, msg.message);
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
                        self.statusError = null;
                        self.visualizations.forEach((v) => v.data = null);

                        const payload = {
                            filters: this.filters.map((f) => [f.id, f.value]),
                            workflow: this.workflow.id
                        };
                        localStorage[this.savedFiltersName] = JSON.stringify(payload);

                        const user = this.$store.getters.user;
                        const body = {
                            workflow: self.workflow,
                            cluster: { id: self.workflow.preferred_cluster_id },
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
                try {
                    let workflow = (await axios.get(`${tahitiUrl}/workflows/${this.$route.params.id}`)).data;
                    const query = self.$route.query;
                    //console.debug(query)

                    const params = {
                        platform: workflow.platform.id,
                        subset: workflow.subset ? workflow.subset.id : null,
                        lang: this.$root.$i18n.locale,
                        workflow: workflow.id,
                        _ts: new Date().getTime(),
                    }
                    const operations = (await axios.get(`${tahitiUrl}/operations`, { params })).data;

                    operations.forEach((op) => { self.operationsLookup[op.id] = op });
                    workflow.platform_id = workflow.platform.id;

                    // Load preferred cluster info
                    if (workflow.preferred_cluster_id) {
                        self.preferredCluster = (await axios.get(`${standUrl}/clusters/${workflow.preferred_cluster_id}`)).data.data[0];
                    } else {
                        self.error(null, 'O fluxo de trabalho não possui um cluster de processamento associado a ele. A trilha não funcionará.');
                    }

                    /* Prepare form */
                    workflow.variables.forEach((variable) => {
                        variable.sourceType = 'variable';
                        variable.help = variable.description;
                        variable.required = variable.multiplicity === 1 || variable.multiplicity == 3;
                        if (variable.description) {
                            variable.help = variable.description;
                        }
                        if (variable?.parameters?.values?.trim()) {
                            variable.values = JSON.parse(variable.parameters.values);
                            if (variable.values.length > 5 || true) {
                                variable.suggested_widget = 'dropdown';
                            } else {
                                variable.suggested_widget = 'radio';
                            }
                        } else if (['INTEGER', 'DECIMAL', 'DATE'].indexOf(variable.type) > -1) {
                            variable.suggested_widget = variable.type.toLowerCase();
                        } else if (variable.type === 'BINARY') {
                            variable.suggested_widget = 'checkbox';
                        } else if (variable.type === 'CHARACTER') {
                            variable.suggested_widget = 'text';
                        } else if (variable.type == 'STATIC_TEXT') {
                            variable.hidden = true;
                        } else {
                            self.error(null, 'Trilha possui configuração incorreta para variável');
                            console.debug(variable);
                        }
                        const field = new EditField(variable, 'variable');
                        field.variable = variable;
                        this.editFields.push(field)
                    });

                    self.savedFiltersName = `savedFilters_${self.$route.params.id}`;
                    if (localStorage[self.savedFiltersName]) {
                        self.savedFilters = JSON.parse(localStorage[self.savedFiltersName]);
                        self.savedFilters.filters = new Map(self.savedFilters.filters);
                    }
                    workflow.tasks.forEach((task) => {
                        if (task.enabled) {
                            const op = self.operationsLookup[task.operation.id];
                            const opFields = new Map(op.forms.flatMap(f => f.fields).map(f => [f.name, f]));
                            //task.operation = op;
                            if (op.slug !== 'user-filter') {
                                for (var [name, value] of Object.entries(task.forms)) {
                                    if (value.publishing_enabled === true) {
                                        const field = JSON.parse(JSON.stringify(opFields.get(name)));
                                        // Update field from the task properties
                                        const prop = task.forms[field.name];
                                        // Only show property if there is no variable associated to it 
                                        if (!prop.variable) {
                                            // Assign a reference to property from the task.
                                            // So, when input is updated, it changes to prop directly.
                                            field.property = prop;

                                            field.label = prop.new_label;
                                            field.display_index = prop.display_index;
                                            field.taskId = task.id;

                                            this.editFields.push(new EditField(field, 'property'));
                                        }
                                    }
                                }
                            }
                            if (op.type === 'VISUALIZATION') {
                                task.data = null;
                                let taskCoords = (task.forms.grid_coordinates || {}).value || {};
                                const coords = {
                                    // x and y are one-based
                                    "x": parseInt(taskCoords.column || 1) - 1,
                                    "y": parseInt(taskCoords.row || 1) - 1,
                                    "w": parseInt(taskCoords.width || 12),
                                    "h": parseInt(taskCoords.height || 3),
                                    "i": task.id,
                                    "task": task
                                };
                                self.layout.push(coords);
                                self.visualizations.push(task);
                            }
                            if (op.slug === 'user-filter') { // special operation
                                task.forms.filters.value.forEach((f) => {
                                    if (self.savedFilters && self.savedFilters.filters && self.savedFilters.filters.has(f.id)) {
                                        f.value = self.savedFilters.filters.get(f.id);
                                    } else {
                                        f.value = f.default_value;
                                    }
                                    f.sourceType = 'field';
                                    f.required = ['ONE', 'ONE_OR_MORE'].indexOf(f.multiplicity) > -1; //FIXME

                                    //FIXME: remove?
                                    self.filters.push(f);
                                    self.form.push(f);

                                    self.executeOnStart = (!f.required || (f.value !== null && f.value !== '')) && self.executeOnStart;
                                    if (f.customList && f.customList.trim()) {
                                        f.parameters = JSON.parse(f.customList);
                                        if (f.parameters.length > 5 || true) {
                                            f.suggested_widget = 'dropdown';
                                        } else {
                                            f.suggested_widget = 'radio';
                                        }
                                    } else if (['INTEGER', 'DECIMAL', 'DATE'].indexOf(f.type) > -1) {
                                        f.suggested_widget = f.type.toLowerCase();
                                    } else if (f.type === 'BINARY') {
                                        f.suggested_widget = 'checkbox';
                                    } else if (f.type === 'CHARACTER') {
                                        f.suggested_widget = 'text';
                                    } else if (f.type == 'STATIC_TEXT') {
                                        f.hidden = true;
                                    } else {
                                        self.error(null, 'Trilha possui configuração incorreta para variável');
                                        console.debug(f);
                                    }

                                    if (f.lookup) {
                                        f.suggested_widget = 'sample-lookup';
                                    } else {
                                        switch (f.type) {
                                            case 'INTEGER':
                                                f.suggested_widget = 'integer';
                                                break;
                                            case 'DECIMAL':
                                                break;
                                        }
                                    }
                                    this.editFields.push(new EditField(f, 'filter'))
                                });
                            }
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
<style>
</style>
<style scoped>
    .scroll-area {
        max-height: 85vh;
    }

    .zoom-90 {
        zoom: 90%;
    }

    .lemonade-widgets .label span.required {
        font-weight: bold !important;
    }

    .lemonade-widgets {
        width: 100%;
        margin-top: 20px;
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