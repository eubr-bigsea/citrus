<template>
    <div class="row">
        <div class="col-md-3 noselect">
            <div class="title">
                <h1>{{$t('dataExplorer.title')}}</h1>
            </div>
            <div class="mb-2">

                <small>{{$tc('titles.dataSource')}}:</small>
                <b-input-group>
                    <b-input size="sm" v-model="dataSource.labelValue" disabled />
                    <b-input-group-append>
                        <b-button :title="$t('dataExplorer.selectDataSource')" variant="outline-secondary"
                            size="sm"><span class="fa fa-database"></span></b-button>
                        <b-button :title="$t('dataExplorer.setupSample')" variant="outline-secondary" size="sm"><span
                                class="fa fa-vial"></span></b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <b-dropdown class="more-actions mt-1" block size="sm" variant="warning" dropright>
                <template #button-content>
                    <span class="fa fa-plus"></span> {{$t('dataExplorer.newStep')}}
                </template>
                <b-dropdown-item @click="selectAttributes">Select attributes ...</b-dropdown-item>
                <b-dropdown-item>Sort rows by...</b-dropdown-item>
                <b-dropdown-item>Group data by</b-dropdown-item>
                <b-dropdown-item>Join</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item>Sample</b-dropdown-item>
                <b-dropdown-item>Top N</b-dropdown-item>
                <b-dropdown-item>Window</b-dropdown-item>
                <b-dropdown-item>Stacking (união)</b-dropdown-item>
            </b-dropdown>
            <b-dropdown class="more-actions mr-1 mt-1 border rounded" size="sm" variant="btn" split
                @click="toggleSteps($event, true)" :disabled="! (steps && steps.length > 0)">
                <template #button-content>
                    <input type="checkbox" @change="toggleSteps" :disabled="! (steps && steps.length > 0)" />
                </template>
                <b-dropdown-item @click=" enableSelected(true)">{{$t('dataExplorer.enableSelected')}}</b-dropdown-item>
                <b-dropdown-item @click="enableSelected(false)">{{$t('dataExplorer.disableSelected')}}
                </b-dropdown-item>
                <!-- <b-dropdown-item>Copy selected</b-dropdown-item> -->
                <b-dropdown-item @click="removeSelected">{{$t('dataExplorer.removeSelected')}}</b-dropdown-item>
            </b-dropdown>

            <b-button variant="primary" size="sm" class="float-right mt-2"
                @click="saveWorkflow"><span class="fa fa-save"></span> {{$t('actions.save')}}
            </b-button>
            <b-button size="sm" variant="outline-secondary" class="float-right mt-2 mr-1" @click="loadData">
                <span class="fa fa-redo"></span> {{$t('actions.refresh')}}
            </b-button>
            <!--
            <b-button-toolbar class="mb-1">
                <b-button class="btn-sm mr-1" variant="outline-secondary">
                    <span class="fa fa-sort"></span> Sort rows by...
                </b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Group data by</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Distinct</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Join</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Sample</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Top N</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Window</b-button>
                <b-button class="btn-sm mr-1" variant="outline-secondary">Stacking (união)</b-button>
            </b-button-toolbar>
        -->
            <div class="mt-3">
                <h5>Steps</h5>
                <VuePerfectScrollbar ref="scrollBar" useBothWheelAxes="true">
                    <draggable v-model="steps" @start="drag=true" @end="drag=false" class="list-group"
                        ghost-class="ghost">
                        <transition-group>
                            <div v-for="step in steps" :key="step.id" class="list-group-item steps clearfix"
                                :title="step.operationSlug + '' + JSON.stringify(step.parameters)">
                                <div :style="{'background-color': step.background }" style="height: 60px; width:3px"
                                    class="mr-1 float-left text-secondary"></div>
                                <div style="width:15px" class="pt-1 float-left text-secondary">
                                    <span class="fa fa-grip-vertical"></span>

                                    <div class="mt-2">
                                        <span v-if="step.status === 'COMPLETED'"
                                            class="fa text-success fa-check-circle"></span>
                                        <span v-if="step.status === 'ERROR'"
                                            class="fa text-danger fa-times-circle"></span>
                                        <span v-if="step.status === 'CANCELED'"
                                            class="fa text-secondary fa-hand-paper"></span>
                                    </div>
                                </div>
                                <div class="float-left" style="width: calc(100% - 25px)">
                                    <div class="mb-2">
                                        <b-form-checkbox v-model="step.selected">
                                            <del v-if="!step.enabled"><span v-html="step.description"></span></del>
                                            <span v-else v-html="step.description"></span>.
                                        </b-form-checkbox>
                                    </div>
                                    <div class="float-left ml-4">
                                        <b-button-group>
                                            <b-button variant="light" size="sm" @click="toggleStep(step)">
                                                <span v-if="step.enabled" class="fa fa-toggle-on text-success"></span>
                                                <span v-else class="fa fa-toggle-off text-secondary"></span>
                                            </b-button>

                                            <b-button variant="light" size="sm" class="text-secondary"><span
                                                    class="fa fa-eye"></span></b-button>

                                            <b-button variant="light" size="sm" class="text-secondary"
                                                @click="deleteStep(step.id)"><span class="fa fa-trash"></span>
                                            </b-button>
                                            <b-button variant="light" size="sm" class="text-secondary"
                                                @click.prevent="customOpen($event, step)"><span
                                                    class="fa fa-ellipsis-h"></span>
                                            </b-button>
                                        </b-button-group>
                                    </div>
                                </div>
                            </div>
                        </transition-group>
                    </draggable>
                </VuePerfectScrollbar>
            </div>

            <div v-if="!steps || !steps.length" class="alert alert-warning">{{$t('dataExplorer.noStep')}}
            </div>
        </div>
        <div class="col-md-9 bg-white">
            <preview :attributes="tableData.attributes" :items="tableData.rows" :service="service"
                :missing="tableData.missing" :invalid="tableData.invalid" :loading="loadingData"
                :total="tableData.total" :service-bus="serviceBus" />
        </div>

        <!--
        <context-menu ref="stepCtxMenu" @ctx-open="onCtxOpen" @ctx-cancel="resetCtxLocals" class="menu">
            <li class="ctx-item">
                <span class="fa fa-edit text-secondary"></span> {{$t('actions.rename')}}
            </li>
        </context-menu>
        -->
        <b-modal ref="modalSelectAttributes" button-size="sm" :title="$t('actions.selectAttributes')"
            @ok="okSelectAttributes">
            <div style="height: 300px; overflow:auto">
                <draggable v-model="attributeSelection" @start="drag=true" @end="drag=false" class="list-group"
                    ghost-class="ghost">
                    <div v-for="attr in attributeSelection" :key="attr.key" class="list-group-item steps clearfix">
                        <div style="width:15px" class="pt-1 float-left text-secondary">
                            <span class="fa fa-grip-vertical"></span>
                        </div>
                        <div class="float-left mt-1">
                            <del v-if="!attr.selected">{{attr.label}} [{{attr.type}}]</del>
                            <span v-else>{{attr.label}} [{{attr.type}}]</span>
                        </div>
                        <div class="float-right">
                            <b-form-checkbox switch size="sm" v-model="attr.selected"></b-form-checkbox>
                        </div>
                    </div>
                </draggable>
            </div>
        </b-modal>

    </div>
</template>
<script>
    import Vue from 'vue';
    import io from 'socket.io-client';
    import axios from 'axios';
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';
    import draggable from 'vuedraggable';
    import Preview from './Preview';
    import Notifier from '../../mixins/Notifier.js';
    import Commands from './Commands.js';

    import contextMenu from 'vue-context-menu';

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const standUrl = process.env.VUE_APP_STAND_URL
    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;
    const standNamespace = process.env.VUE_APP_STAND_NAMESPACE;

    const SUPPORTED_OPERATIONS = ['data-reader', 'projection', 'filter-selection', 'sort'];
    // FIXME: Must be loaded
    const OPERATIONS = new Map();
    OPERATIONS.set('projection', { id: 6, input_id: 3, output_id: 4 });
    OPERATIONS.set('data-reader', { id: 18, output_id: 35 });
    OPERATIONS.set('filter-selection', { id: 5, input_id: 1, output_id: 2 });

    export default {
        mixins: [Notifier],
        components: { Preview, draggable, VuePerfectScrollbar, contextMenu, },
        props: {
            attributes: { type: Array, default: () => [] },
            items: { type: Array },
            workflowId: { type: Number },
        },
        data() {
            return {
                attributeSelection: [], // used to select attributes
                dataSource: {}, // current data source
                internalWorkflowId: null, // workflow id
                isDirty: false,  //check if workflow is dirty before leaving page
                job: null,  //last job details
                loadingData: false,  //data loading state
                service: null,  //service rules implementation
                serviceBus: new Vue(), // service bus used to communicate
                socket: null, // used by socketio (web sockets)
                steps: [], // list of steps
                tableData: {}, // data used to render preview table
                workflow: null, //workflow JSON data
            }
        },
        mounted() {
            this.service = new Commands(this.serviceBus, this.steps, this.attributes, 'pt');
            this.internalWorkflowId = (this.$route) ? this.$route.params.id : this.workflowId;
            this.loadWorkflow();
            this.serviceBus.$on('newStep', this.addTask);
        },
        beforeDestroy() {
            this.disconnectWebSocket();
            this.serviceBus.$off('newStep');
        },
        methods: {

            // Step maintenance
            toggleStep(step) {
                step.enabled = !step.enabled;
                const task = this.workflow.tasks.find(task => task.id === step.id);
                task.enabled = step.enabled;

                this.workflow.tasks.forEach(task => task.forms.display_sample.value = '0');
                const sortedTasks = this.workflow.tasks.sort(task => -task.display_order)
                const lastEnabled = sortedTasks.find(task => task.enabled);
                if (lastEnabled) {
                    this.setupSampleProperties(lastEnabled);
                }
            },
            setupSampleProperties(task){
                task.forms.display_sample.value = '1';
                task.forms.infer_sample = {value: true};
                task.forms.describe_sample = {value: true};
                task.forms.sample_size = {value: 300};
            },
            deleteStep(id) {
                const pos = this.workflow.tasks.findIndex(task => task.id === id);
                if (pos > -1) {
                    const stepIndex = this.steps.findIndex(step => step.id === id);
                    this.steps.splice(stepIndex, 1);
                    if (pos == this.workflow.tasks.length - 1) {

                        const sourceFlowPos = this.workflow.flows.findIndex(flow => flow.target_id === id);
                        const sourceTask = this.workflow.tasks.find(
                            task => task.id === this.workflow.flows[sourceFlowPos].source_id)
                        this.setupSampleProperties(sourceTask);

                        this.workflow.flows.splice(sourceFlowPos, 1);
                    } else {
                        const targetFlowPos = this.workflow.flows.findIndex(flow => flow.source_id === id);
                        const sourceFlowPos = this.workflow.flows.findIndex(flow => flow.target_id === id);

                        console.debug(targetFlowPos, sourceFlowPos);
                        this.workflow.flows.push({
                            "source_port": this.workflow.flows[sourceFlowPos].source_port,
                            "target_port": this.workflow.flows[targetFlowPos].target_port,
                            "source_port_name": "output data",
                            "target_port_name": "input data",
                            "environment": "DESIGN",
                            "source_id": this.workflow.flows[sourceFlowPos].source_id,
                            "target_id": this.workflow.flows[targetFlowPos].target_id
                        })
                        this.setupSampleProperties(this.workflow.tasks[pos - 1]);
                        this.workflow.flows = this.workflow.flows.filter(flow => flow.target_id !== id && flow.source_id !== id);
                    }
                    this.workflow.tasks.splice(pos, 1);
                }
            },
            // Attribute selection
            selectAttributes() {
                this.attributeSelection = JSON.parse(JSON.stringify(this.tableData.attributes));
                this.$refs.modalSelectAttributes.show();
            },
            okSelectAttributes() {
                this.service.selectAttributes(this.attributeSelection.filter(attr => attr.selected));
            },
            // Filter
            addFilterTask(attributeName, operator, attributeValue) {
                console.debug(attributeName, operator, attributeValue)
            },
            //
            addTask(task, description) {
                const lastTask = this.workflow.tasks[this.workflow.tasks.length - 1];

                const operation = OPERATIONS.get(task.operation.slug);
                const maxDisplayOrder = Math.max.apply(Math, this.workflow.tasks.map(t => t.display_order));
                task.operation.id = operation.id;
                task.display_order = maxDisplayOrder + 1;
                task.enabled = true;
                task.environment = 'DESIGN'
                task.name = `${task.operation.slug} ${maxDisplayOrder + 1}`;
                task.z_index = task.display_order || 10;
                task.forms.display_sample = { value: '1' };
                task.forms.comment = { value: description };
                task.top = lastTask.top;
                task.left = lastTask.left + 240;

                this.workflow.tasks.push(task);
                const lastTaskOperation = OPERATIONS.get(lastTask.operation.slug);

                lastTask.forms.display_sample.value = '0';
                this.workflow.flows.push({
                    "source_port": lastTaskOperation.output_id,
                    "target_port": operation.input_id,
                    "source_port_name": "output data",
                    "target_port_name": "input data",
                    "environment": "DESIGN",
                    "source_id": lastTask.id,
                    "target_id": task.id
                })

            },
            saveWorkflow() {
                let self = this
                let cloned = JSON.parse(JSON.stringify(self.workflow));
                let url = `${tahitiUrl}/workflows`;
                let method = 'post'

                if (cloned.id !== 0) {
                    url = `${url}/${cloned.id}`;
                    method = 'patch'
                }

                cloned.platform_id = 4; // FIXME
                cloned.tasks.forEach((task) => {
                    task.operation = { id: task.operation.id };
                    delete task.version;
                    delete task.step;
                    delete task.status;
                });
                return axios[method](url, cloned, { headers: { 'Content-Type': 'application/json' } }).then(
                    (resp) => {
                        self.isDirty = false;
                        self.workflow = resp.data.data;

                        self.success(self.$t('messages.savedWithSuccess',
                            { what: self.$tc('titles.workflow') }));
                    }
                ).catch(function (e) {
                    this.error(e);
                }.bind(this));
            },
            customOpen(event, data) {
                this.$refs.stepCtxMenu.open(event, data);
            },
            /* Step selecion actions */
            toggleSteps(ev, fromButtom) {
                if (fromButtom) {
                    const check = ev.target.querySelector('input');
                    if (check) {
                        check.checked = !check.checked;
                        this.steps.forEach(step => step.selected = check.checked);
                    }
                } else {
                    this.steps.forEach(step => step.selected = ev.target.checked);
                }
            },
            enableSelected(enabled) {
                this.steps.forEach(step => step.selected && (step.enabled = enabled));
            },
            removeSelected() {
                this.steps = this.steps.filter(step => !step.selected);
            },
            /* Data loading */
            async loadWorkflow() {
                const self = this;
                this.$Progress.start()
                await axios.get(`${tahitiUrl}/workflows/${this.internalWorkflowId}`).then(
                    (resp) => {
                        const workflow = resp.data;
                        workflow.tasks = workflow.tasks.sort(
                            (a, b) => { return a.display_order - b.display_order; });

                        const readerTask = workflow.tasks[0];
                        const lastTask = workflow.tasks[workflow.tasks.length - 1];
                        //To be compatible: 
                        // 1 - First task must be data reader
                        // 2 - Last task must emit samples
                        // 3 - No output can be used more than once (?)
                        // 4 - Only some operations are supported
                        const hasUnsupported = workflow.tasks.some((t) => !SUPPORTED_OPERATIONS.includes(t.operation.slug));
                        if (hasUnsupported || readerTask.operation.slug !== 'data-reader' || lastTask.forms['display_sample'].value !== '1') {
                            self.error({ message: 'FIXME: Invalid workflow. It is not compatible with data explorer format' });
                            return;
                        }
                        this.service.createStepsFromTasks(workflow.tasks.slice(1));

                        self.loadingData = true;
                        self.dataSource = { ...readerTask.forms['data_source'] };

                        //console.debug(readerTask);

                        self.workflow = workflow;
                    }).catch(function (e) {
                        self.error(e);
                    }).finally(() => {
                        Vue.nextTick(() => {
                            this.$Progress.finish();
                        })
                    });
                self.setupSampleProperties(self.workflow.tasks[self.workflow.tasks.length - 1]);
                //self.loadData();
            },
            async loadData() {
                const self = this;
                this.loadingData = true;
                const cloned = JSON.parse(JSON.stringify(this.workflow));
                cloned.platform_id = cloned.platform.id; //FIXME: review

                cloned.tasks.forEach((task) => {
                    // Remove unnecessary attributes from operation
                    task.operation = { id: task.operation.id };
                    delete task.version;
                });
                const user = this.$store.getters.user;
                const body = {
                    workflow: cloned,
                    cluster: { id: 1 }, //FIXME: How to determine the cluster?
                    name: `## explorer ${self.workflow.id} ##`,
                    user: {
                        id: user.id,
                        login: user.login,
                        name: user.name
                    },
                    persist: false, // do not save the job in db.
                    app_configs: { sample_size: 200, },
                }
                self.disconnectWebSocket();

                axios.post(`${standUrl}/jobs`, body, {
                    headers: {
                        'Locale': self.$root.$i18n.locale,
                    }
                }).then(function (response) {
                    self.job = response.data.data;
                    self.connectWebSocket();
                }).catch((ex) => {
                    if (ex.data) {
                        self.error(ex.data.message);
                    } else if (ex.status === 0) {
                        self.$root.$refs.toastr.e(`Error connecting to the backend (connection refused).`);
                    } else {
                        self.error(`Unhandled error: ${JSON.stringify(ex)}`);
                    }
                    self.$Progress.finish();
                });
            },
            disconnectWebSocket() {
                if (this.socket) {
                    this.socket.emit('leave', { room: this.job.id });
                    this.socket.close();
                }
            },
            connectWebSocket() {
                const self = this;
                const socket = io(standNamespace, { upgrade: true, });
                self.socket = socket;
                /*
                socket.on('disconnect', () => { console.debug('You are not connected'); });
                socket.on('response', msg => { console.debug('response', msg); });

                socket.on('connect_error', () => { console.debug('Web socket server offline'); });
                */
                socket.on('connect', () => { socket.emit('join', { room: self.job.id }); });

                socket.on('update task', (msg, callback) => {
                    if (msg.type === 'OBJECT') {
                        // Update must be done before assigning to observable self.tableData!
                        const truncated = msg.message.truncated || [];
                        msg.message.attributes.forEach(attr => {
                            attr['selected'] = true;
                            attr['truncated'] = truncated.indexOf(attr.key) > -1
                        });

                        self.tableData = msg.message;

                        const attributeIds = self.tableData.attributes.map(attr => attr.key);
                        self.service.setAttributes(self.tableData.attributes);

                        self.tableData.rows = self.tableData.rows.map(
                            row => Object.assign(...attributeIds.map((attr, i) => { return { [attr]: row[i] } })));
                        //console.debug(self.tableData)
                    }
                    const step = self.steps.find(step => step.id === msg.id);
                    if (step) {
                        step.status = msg.status;
                    }
                });
                socket.on('update job', msg => {
                    if (msg.status === 'ERROR') {
                        self.error(msg);
                    }
                    if (msg.status === 'COMPLETED')
                        self.loadingData = false;
                });
                /*
                socket.on('task result', msg => {
                    console.debug(msg);
                });
                */
            }
        }
    }
</script>
<style>
    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }

    .list-group {
        min-height: 20px;
    }

    .steps .list-group-item {
        cursor: move;
        font-size: .8em;
    }

    .list-group-item:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    .list-group-item:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .list-group-item.steps {
        padding: 8px 5px;
    }

    .list-group-item.steps b {
        background-color: #17a2b8;
        border: 2px solid #17a2b8;
        border-radius: 5px;
        color: #fff;
        font-size: .8em;
        font-weight: normal;
        padding: 1px 5px;
    }

    .more-actions li {
        font-size: .8em !important;
    }
</style>