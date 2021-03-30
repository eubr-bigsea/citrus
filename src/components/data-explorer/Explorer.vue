<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <PreviewMenu :selected="selected" @select="menuAction" />
            </div>
        </div>

        <div class="row">
            <div class="col-md-9 col-lg-10">
                <preview :attributes="tableData.attributes" :items="tableData.rows" :store="store"
                    :missing="tableData.missing" :invalid="tableData.invalid" :loading="loadingData"
                    :total="tableData.total" :service-bus="store.serviceBus" @select="select" ref="preview" />
            </div>
            <div class="col-md-3 col-lg-2 noselect mt-1">
                <div class="title">
                    <h5>{{$t('dataExplorer.title')}}</h5>
                </div>
                <div class="mb-2">
                    <small>{{$tc('titles.dataSource')}}:</small>
                    <b-input-group>
                        <b-input size="sm" v-model="dataSource.labelValue" disabled />
                        <b-input-group-append>
                            <b-button :title="$t('dataExplorer.selectDataSource')" variant="outline-secondary"
                                size="sm">
                                <span class="fa fa-database"></span>
                            </b-button>
                            <b-button :title="$t('dataExplorer.setupSample')" variant="outline-secondary" size="sm">
                                <span class="fa fa-vial"></span>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </div>
                <b-dropdown class="more-actions mr-1 mt-1 border rounded" size="sm" variant="btn" split
                    @click="store.toggleSteps($event, true)" :disabled="! (store.store && store.store.length > 0)">
                    <template #button-content>
                        <input type="checkbox" @change="store.toggleStep"
                            :disabled="! (store.store && store.store.length > 0)" />
                    </template>
                    <b-dropdown-item @click="store.enableSelected(true)">{{$t('dataExplorer.enableSelected')}}
                    </b-dropdown-item>
                    <b-dropdown-item @click="store.enableSelected(false)">{{$t('dataExplorer.disableSelected')}}
                    </b-dropdown-item>
                    <b-dropdown-item @click="store.removeSelected">{{$t('dataExplorer.removeSelected')}}
                    </b-dropdown-item>
                </b-dropdown>

                <b-button variant="primary" size="sm" class="float-right mt-2" @click="saveWorkflow"><span
                        class="fa fa-save"></span> {{$t('actions.save')}}
                </b-button>
                <b-button size="sm" variant="outline-secondary" class="float-right mt-2 mr-1" @click="loadData">
                    <span class="fa fa-redo"></span> {{$t('actions.refresh')}}
                </b-button>

                <div class="mt-3" v-if="store.steps && store.steps.length">
                    <strong>{{$tc('dataExplorer.step', 2)}}</strong>
                    <VuePerfectScrollbar ref="scrollBar" useBothWheelAxes="true" id="step-scroll">
                        <div id="step-container">
                            <draggable v-model="store.store" @start="drag=true" @end="drag=false" class="list-group"
                                ghost-class="ghost" handle=".step-drag-handle">
                                <div v-for="step, inx in store.stepManager.steps" :key="step.id"
                                    class="list-group-item steps clearfix"
                                    :title="step.operationSlug + '' + JSON.stringify(step.parameters)">
                                    <step :step="step" :service-bus="store.serviceBus"
                                        :attributes="tableData.attributes" :index="inx" @toggle="store.toggleStep(step)"
                                        @delete="store.deleteStep(step)" @update="store.updateStep(step)"
                                        @custom-open="store.customOpen" />
                                </div>
                            </draggable>
                        </div>
                    </VuePerfectScrollbar>
                </div>
                <div v-else class="mt-5 alert alert-warning">
                    <span class="fa fa-exclamation-triangle"></span> {{$t('dataExplorer.noStep')}}
                </div>
            </div>

            <!--
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
        -->
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import io from 'socket.io-client';
    import axios from 'axios';
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';
    import draggable from 'vuedraggable';
    import Preview from './Preview';
    import Step from './Step';
    import Notifier from '../../mixins/Notifier.js';
    import Commands from './Commands.js';
    import PreviewMenu from './PreviewMenu.vue';
    import contextMenu from 'vue-context-menu';

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const standUrl = process.env.VUE_APP_STAND_URL
    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;
    const standNamespace = process.env.VUE_APP_STAND_NAMESPACE;

    const SUPPORTED_OPERATIONS = ['cast', 'data-reader',
        'filter-selection', 'projection', 'sort', 'transformation'];

    export default {
        mixins: [Notifier],
        components: { Preview, draggable, VuePerfectScrollbar, contextMenu, Step, PreviewMenu },
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
                selected: { field: {} }, // selected attribute in table preview
                store: new Commands(new Vue(), 'pt'),  //store rules implementation
                socket: null, // used by socketio (web sockets)
                tableData: { attributes: [] }, // data used to render preview table
            }
        },
        mounted() {
            this.internalWorkflowId = (this.$route) ? this.$route.params.id : 0;
            this.loadWorkflow();
            /*this.serviceBus.$on('newStep', this.addTask);
            this.serviceBus.$on('toggleScroll', this.toggleScroll);*/
        },
        beforeDestroy() {
            this.disconnectWebSocket();
            /*
            this.serviceBus.$off('newStep');
            this.serviceBus.$off('toggleScroll');
            */
        },
        methods: {
            resetMenuData() {
                this.selected = { field: {} };
                this.$refs.preview.resetMenuData();
            },
            select(attr) {
                this.selected = attr;
            },
            toggleScroll() {
                console.debug(this.$refs.scrollBar);
            },
            // Attribute selection
            /*
            selectAttributes() {
                this.attributeSelection = JSON.parse(JSON.stringify(this.tableData.attributes));
                this.$refs.modalSelectAttributes.show();
            },
            okSelectAttributes() {
                this.store.selectAttributes(this.attributeSelection.filter(attr => attr.selected));
            },
            */
            // Filter
            addFilterTask(attributeName, operator, attributeValue) {
                console.debug(attributeName, operator, attributeValue)
            },
            //
            saveWorkflow() {
                let self = this
                let cloned = JSON.parse(JSON.stringify(self.store.workflow));
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
                        self.store.setWorkflow(resp.data.data, false);

                        self.success(self.$t('messages.savedWithSuccess',
                            { what: self.$tc('titles.workflow') }));
                    }
                ).catch(function (e) {
                    this.error(e);
                }.bind(this));
            },

            /* Attribute actions */
            menuAction(options) {
                if (typeof this[options.action] === 'function') {
                    this[options.action](options.params);
                } else {
                    console.log(`Unknown action: ${options.action}`);
                }
            },
            transform(params) {
                this.store.transformWithFunction(
                    this.selected.field.label,
                    this.selected.field.position, params);
                //this.$refs.expressionEditor.openModal();
            },
            saveExpression(expressionList) {
                this.store.transform(this.selected.field.label,
                    this.selected.field.position, expressionList);
            },
            deleteAttribute() {
                // OK
                this.store.deleteAttribute(this.selected.field.label);
                this.resetMenuData();
            },
            duplicateAttribute() {
                //OK
                const modalConfig =
                {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informNewName'),
                    title: this.$t('actions.duplicate'),
                    value: this.selected.field.label,
                    options: null,
                    ok: () => {
                        this.store.duplicateAttribute(
                            this.selected.field.label,
                            this.$refs.simpleInput.value);
                    }
                };
                this.$refs.simpleInput.show(modalConfig);
            },
            renameAttribute() {
                //OK
                const attributeName = this.selected.field.label;
                const modalConfig =
                {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informNewName'),
                    title: this.$t('actions.rename'),
                    value: attributeName,
                    ok: () => {
                        this.store.renameAttribute(
                            attributeName,
                            this.$refs.simpleInput.value);
                    }
                };
                this.$refs.simpleInput.show(modalConfig);
                this.resetMenuData();
                /*
                this.$refs.modalRenameAttribute.show();
                const col = this.attributes.find((f) => f.key === this.selected.field.key);
                col.label = this.selected.field.label;
                this.store.renameAttribute();*/
            },
            changeAttributeType() {
                const modalConfig =
                {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informNewName'),
                    options: this.dataTypes,
                    title: this.$t('actions.changeDataType'),
                    value: this.selected.field.type,
                    ok: () => {
                        this.store.changeAttributeType(
                            this.selected.field.label,
                            this.$refs.simpleInput.value);
                    }
                };
                this.$refs.simpleInput.show(modalConfig);
                /*if (this.dataTypes.includes(newType)) {
                    const col = this.attributes.find((f) => f.key === this.selected.field.key);
                    if (col) {
                        this.store.changeAttributeType(
                            this.selected.field.label,
                            newType);
                        ///col.type = newType;
                    }
                }*/
            },
            sort(direction) {
                this.store.sort(this.selected.field.label, direction);
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
                        const totalOfTasks = workflow.tasks.length;
                        /*
                        workflow.tasks.forEach((task, inx) => {
                            task.forms['display_sample'].value = (inx + 1) === totalOfTasks ? '1' : '0';
                        });
                        */
                        //To be compatible: 
                        // 1 - First task must be data reader
                        // 2 - Last task must emit samples
                        // 3 - No output can be used more than once (?)
                        // 4 - Only some operations are supported
                        const hasUnsupported = workflow.tasks.some((t) => !SUPPORTED_OPERATIONS.includes(t.operation.slug));
                        if (hasUnsupported || readerTask.operation.slug !== 'data-reader') {
                            self.error({ message: 'FIXME: Invalid workflow. It is not compatible with data explorer format' });
                            return;
                        }
                        self.loadingData = true;
                        self.store.setWorkflow(workflow, true);

                    }).catch(function (e) {
                        self.error(e);
                    }).finally(() => {
                        Vue.nextTick(() => {
                            this.$Progress.finish();
                        })
                    });

                //self.loadData();
            },
            async loadData() {
                const self = this;
                self.loadingData = true;
                const cloned = JSON.parse(JSON.stringify(this.store.workflow));
                cloned.platform_id = cloned.platform.id; //FIXME: review

                cloned.tasks.forEach((task) => {
                    // Remove unnecessary attributes from operation
                    task.operation = { id: task.operation.id };
                    delete task.version;
                });
                const body = {
                    workflow: cloned,
                    cluster: { id: 1 }, //FIXME: How to determine the cluster?
                    name: `## explorer ${self.store.workflow.id} ##`,
                    user: this.$store.getters.user, //: { id: user.id, login: user.login, name: user.name },
                    persist: false, // do not save the job in db.
                    app_configs: { sample_size: 200, },
                }
                self.disconnectWebSocket();
                self.store.prepareSampleProperties();

                axios.post(`${standUrl}/jobs`, body, {
                    headers: { 'Locale': self.$root.$i18n.locale, }
                }).then((response) => {
                    self.job = response.data.data;
                    self.$refs.preview.loadData();
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

                socket.on('connect', () => { socket.emit('join', { room: self.job.id }); });

                socket.on('update task', (msg, callback) => {
                    if (msg.type === 'OBJECT') {
                        // Update must be done before assigning to observable self.tableData!
                        const truncated = msg.message.truncated || [];
                        msg.message.attributes.forEach((attr, index) => {
                            attr['selected'] = true;
                            attr['truncated'] = truncated.indexOf(attr.key) > -1;
                            attr['position'] = index;
                        });

                        self.tableData = msg.message;

                        const attributeIds = self.tableData.attributes.map(attr => attr.key);
                        self.store.setAttributes(self.tableData.attributes);

                        self.tableData.rows = self.tableData.rows.map(
                            row => Object.assign(...attributeIds.map((attr, i) => { return { [attr]: row[i] } })));
                    }
                    self.store.changeStepStatus(msg.id, msg.status);
                });
                socket.on('update job', msg => {
                    if (msg.status === 'ERROR') {
                        self.error(msg);
                    }
                    if (msg.status === 'COMPLETED')
                        self.loadingData = false;
                });

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

    .more-actions li {
        font-size: .8em !important;
    }

    #step-container {
        position: relative;
        margin-right: 10px;
    }

    #step-scroll {
        position: relative;
        margin: auto;
        height: 60vh;
    }
</style>