<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <TahitiSuggester />

                <div class="title">
                    <div class="float-right">
                        <workflow-toolbar v-if="loaded" :workflow="workflow" :is-dirty="isDirty"
                                          @onsave-workflow="saveWorkflow(false)" @onshow-history="showHistory"
                                          @onshow-executions="$refs.executionsModal.show()"
                                          @onshow-variables="$refs.variablesModal.show()" @onsave-workflow-as="saveWorkflowAs"
                                          @onshow-properties="showWorkflowProperties" @onsaveas-workflow="showSaveAs"
                                          @onclick-execute="showExecuteWindow" @onclick-export="(format) => exportWorkflow(format)"
                                          @onupdate-workflow-properties="saveWorkflowProperties" @onrestore-workflow="restore"
                                          @onsave-as-image="saveAsImage" />
                    </div>

                    <h6 class="header-pretitle">
                        {{$t('titles.workflow', 1)}} #{{workflow.id}}
                    </h6>
                    <InputHeader v-model="workflow.name" />
                </div>

                <div v-show="showTasksPanel" class="toolbox">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title">
                                {{$t('common.operation', 2)}}
                            </h4>
                        </div>
                        <toolbox :operations="operations" :workflow="workflow" :selected-task="selectedTask.task"
                                 :loading="loadingToolbox" />
                    </div>
                </div>
                <div v-show="showDataSourcesPanel" class="toolbox datasource-toolbox">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title">
                                {{$t('titles.dataSource2', 2)}}
                            </h4>
                        </div>
                        <custom-toolbox :operations="expandableOperations" :workflow="workflow"
                                        :selected-task="selectedTask.task" />
                    </div>
                </div>

                <diagram v-if="loaded" id="main-diagram" ref="diagram" :workflow="workflow"
                         :operations="operations"
                         :loaded="loaded" :version="workflow.version" tabindex="0"
                         :use-data-source="expandableOperations.length > 0" @ontoggle-tasks-panel="toggleTasksPanel"
                         @ontoggle-data-sources-panel="toggleDataSourcesPanel" @onselect-image="selectImage"
                         @onset-is-dirty="setIsDirty" @onzoom="applyZoom" @add-task="addTask" @onclick-task="clickTask"
                         @add-flow="addFlow" @remove-flow="removeFlow" @onclear-selection="clearSelection"
                         @onblur-selection="blurSelection" 
                         @remove-task="removeTask" />

                <div v-if="showProperties" class="diagram-properties">
                    <property-window v-if="selectedTask.task" :task="selectedTask.task"
                                     :variables="workflow.variables || []" :suggestion-event="() => getSuggestions(selectedTask.task.id)"
                                     :extended-suggestion-event="() => getExtendedSuggestions(selectedTask.task.id)"
                                     :publishing-enabled="workflow && workflow.publishing_enabled"
                                     @update-form-field-value="updateFormFieldValue" 
                                     @update-task-name="(name) => selectedTask.task.name = name"
                                     @toggle-task="(value) => selectedTask.task.enabled = value" />
                </div>

                <!--
                <div class="row border-top pt-1">
                    <div class="col col-md-4 col-lg-3 col-xl-2 pr-0">
                        <toolbox :operations="operations" :workflow="workflow" :selected-task='selectedTask.task' />
                    </div>
                    <div class="col col-md-8 col-lg-9 col-xl-10" style="position: relative">
                        <diagram ref="diagram" id="main-diagram" :workflow="workflow" v-if="loaded"
                            :operations="operations" :loaded="loaded" :version="workflow.version" tabindex="0">
                        </diagram>
                        <slideout-panel :opened="showProperties">
                            <property-window :task="selectedTask.task" v-if="selectedTask.task"
                                :variables="workflow.variables || []"
                                :suggestionEvent="() => getSuggestions(selectedTask.task.id)"
                                :publishingEnabled="workflow && workflow.publishing_enabled" />
                        </slideout-panel>
                    </div>
                </div> -->

                <!--
                <b-tabs ref="formTabs" v-model="selectedTab" nav-class="custom-tab" @input="updateSelectedTab">
                    <b-tab v-for="form of workflow.platform.forms" :title-item-class="'tab-order-' + form.order"
                        :key="form.id" :active="form.order === minFormOrder">
                        <template slot="title">
                            <font-awesome-icon icon="fa fa-cogs" /> {{form.name}}
                        </template>
                        <div class="card mt-1" style="min-height: 90vh">
                            <div class="card-body">
                                <WorkflowProperty v-if="loaded" :form="form" :workflow="workflow" :loaded="loaded" />
                            </div>
                        </div>
                    </b-tab>
                    <b-tab :title="$t('titles.workflow', 1)" title-item-class="tab-order-5">
                        <b-card>
                            <div class="row">
                                <div class="col col-md-4 col-lg-3 col-xl-2 pr-0">
                                    <toolbox :operations="operations" :workflow="workflow"
                                        :selected-task='selectedTask.task' />
                                </div>
                                <div class="col col-md-8 col-lg-9 col-xl-10" style="position: relative">
                                    <diagram ref="diagram" id="main-diagram" :workflow="workflow" v-if="loaded"
                                        :operations="operations" :loaded="loaded" :version="workflow.version"
                                        tabindex="0"></diagram>
                                    <slideout-panel :opened="showProperties">
                                        <property-window :task="selectedTask.task" v-if="selectedTask.task"
                                            :suggestionEvent="() => getSuggestions(selectedTask.task.id)"
                                            :publishingEnabled="workflow.publishing_enabled" />
                                    </slideout-panel>
                                </div>
                            </div>
                        </b-card>
                    </b-tab>
                    <b-tab :title="$t('titles.job', 2)" title-item-class="tab-order-6" @click="showJobs">
                        <b-card>
                            <div class="container">
                                <div class="row">
                                    <div class="col justify-content-center">
                                        <WorkflowExecution v-if="showPreviousJobs" :workflow-id="workflow.id" />
                                    </div>
                                </div>
                            </div>
                        </b-card>
                    </b-tab>
                </b-tabs>
                -->
                <ModalWorkflowVariables ref="variablesModal" :workflow="workflow" :items="workflow.variables"
                                        @ok="(v) => { workflow.variables = v; isDirty = true }" />
                <ModalExecuteWorkflow ref="executeModal" :clusters="clusters" :cluster-info="clusterInfo"
                                      :validation-errors="validationErrors" :workflow="workflow" @onexecute-workflow="execute"
                                      @onchange-cluster="changeCluster" @update-value="handleUpdateClusterInfo" />
                <ModalWorkflowHistory ref="historyModal" :history="history" @onrestore-workflow="restore" />
                <ModalSaveWorkflowAs ref="saveAsModal" @onsave-workflow-as="saveWorkflowAs" />
                <ModalTaskResults ref="taskResultModal" :task="resultTask" />
                <ModalWorkflowProperties ref="workflowPropertiesModal" :loaded="loaded" :workflow="workflow"
                                         :clusters="clusters" @update-value="handleUpdateWorkflowProperties" />
                <!--
                <ModalWorkflowImage ref="workflowImageModal" :workflow="workflow" @update-value="(v) => workflow.image = v"/>
                -->
                <WorkflowExecution ref="executionsModal" :workflow-id="workflow.id" />
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import DiagramComponent from '../components/Diagram.vue';
//import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import InputHeader from '../components/InputHeader.vue';
import ModalSaveWorkflowAs from './modal/ModalSaveWorkflowAs.vue';
import ModalWorkflowProperties from './modal/ModalWorkflowProperties.vue';
import ModalWorkflowImage from './modal/ModalWorkflowImage.vue';
import ModalWorkflowVariables from './modal/ModalWorkflowVariables.vue';
import ModalTaskResults from './modal/ModalTaskResults.vue';
import ModalWorkflowHistory from './modal/ModalWorkflowHistory.vue';
import ModalExecuteWorkflow from './modal/ModalExecuteWorkflow.vue';
import PropertyWindow from '../components/PropertyWindow.vue';
import Notifier from '../mixins/Notifier.js';
import ToolboxComponent from '../components/Toolbox.vue';
import CustomToolboxComponent from '../components/CustomToolbox.vue';
import Vue from 'vue';
import WorkflowExecution from '../components/WorkflowExecution.vue';
import WorkflowToolbar from '../components/WorkflowToolbar.vue';

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
const standUrl = import.meta.env.VITE_STAND_URL;
const caipirinhaUrl = import.meta.env.VITE_CAIPIRINHA_URL;

export default {
    components: {
        'diagram': DiagramComponent,
        'toolbox': ToolboxComponent,
        'custom-toolbox': CustomToolboxComponent,
        'workflow-toolbar': WorkflowToolbar,
        'property-window': PropertyWindow,

        ModalExecuteWorkflow,
        ModalSaveWorkflowAs,
        ModalTaskResults,
        ModalWorkflowHistory,
        ModalWorkflowProperties,
        ModalWorkflowVariables,

        WorkflowExecution,
        InputHeader,
        TahitiSuggester: () => {
            return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
                const script = document.createElement('script');
                script.setAttribute('id', 'tahiti-script');
                script.async = true;
                //script.src = `${tahitiUrl}/public/js/tahiti.js`
                document.head.appendChild(script);
            });
        }
    },
    mixins: [Notifier],
    beforeRouteLeave(to, from, next) {
        if (this.isDirty) {
            if (confirm(this.$t('warnings.dirtyCheck'))) {
                next();
            }
        } else {
            next();
        }
    },
    data() {
        return {
            job: {},
            attributeSuggesterLoaded: false,
            attributeSuggestion: {},
            clusters: [],
            clusterInfo: {
                name: '', description: '', workflowName: '', id: 0,
                jobName: '', clusterName: ''
            },
            history: [],
            isDirty: false,
            loaded: false,
            loadingToolbox: true,
            maxDisplayOrder: 0,
            minFormOrder: 5,
            newName: '',
            operations: [],
            operationsLookup: new Map(),

            showTasksPanel: false,
            showDataSourcesPanel: false,
            resultTask: { step: {} },
            saveOption: 'new',
            selectedTab: 0,
            selectedTask: { task: { operation: {} } },
            showPreviousJobs: false,
            showProperties: false,
            validationErrors: [],
            workflow: { tasks: [], flows: [], platform: {} },
            performanceModel: {
                cores: null,
                setup: null
            },
            expandableOperations: [],
            exportTimeoutHandler: null,
            
        };
    },
    watch: {
        '$route.params.id': function (id) {
            this.$refs.diagram.clearWorkflow();
            this.load(id);
        }
    },
    created() {
        window.addEventListener('beforeunload', this.leaving);
    },
    mounted() {
        const self = this;
        document.getElementById('tahiti-script').setAttribute(
            'src', `${tahitiUrl}/public/js/tahiti.js?platform=${this.$route.params.platform}`);

        //this.$root.$on('onshow-result', this.showTaskResult);
        this.load();

    },
    beforeUnmount() {
        window.removeEventListener('beforeunload', this.leaving);
    },
    methods: {
        // Forms 
        updateFormFieldValue(field, value, labelValue) {
            const self = this;
            if (self.selectedTask.task.forms[field.name]) {
                if (self.selectedTask.task.forms[field.name].value !== value) {
                    self.selectedTask.task.forms[field.name].value = value;
                    this.setIsDirty(true);
                }
            } else {
                this.setIsDirty(true);
                self.selectedTask.task.forms[field.name] = { value: value };
            }
            self._validateTasks([self.selectedTask.task]);

            // Used to save the label with the job
            if (!self.selectedTask.task.forms) {
                self.selectedTask.task.forms = {};
            }
            let fieldInSelectedTask = self.selectedTask.task.forms[field.name];
            if (fieldInSelectedTask) {
                fieldInSelectedTask.value = value;
            } else {
                fieldInSelectedTask = { value: value };
            }
            fieldInSelectedTask.label = field.label;
            if (labelValue) {
                fieldInSelectedTask.labelValue = labelValue;
            } else if (fieldInSelectedTask.labelValue) {
                delete fieldInSelectedTask.labelValue;
            }
        },
        updateWorkflowFormFieldValue(field, value, labelValue) {
            const self = this;
            if (self.workflow)
                if (!self.workflow.forms || !(self.workflow.forms instanceof Object)) {
                    self.workflow.forms = {};
                }
            try {
                if (labelValue) {
                    if (self.workflow.forms[field.name].value !== value) {
                        self.workflow.forms[field.name].value = value;
                        this.setIsDirty(true);
                    }
                    if (self.workflow.forms[field.name].labelValue !== labelValue) {
                        self.workflow.forms[field.name].labelValue = labelValue;
                        this.setIsDirty(true);
                    }
                } else {
                    if (self.workflow.forms[field.name].value !== value) {
                        self.workflow.forms[field.name].value = value;
                        this.setIsDirty(true);
                    }
                }
                self.workflow.forms[field.name].label = field.label;
            } catch (e) {
                console.debug(e);
            }
        },
        // Selection
        blurSelection() {
            this.showProperties = false;
            this.selectedTask = { task: {} };
        },
        clearSelection() {
            this.selectedTask = {};
            this.selectedElements = [];
            this.showDataSourcesPanel = false;
            this.showTasksPanel = false;
        },
        addFlow(flow, jsPlumbConn) {// eslint-disable-line no-unused-vars
            const sourceTask = this.workflow.tasks.find((t) => t.id === flow.source_id);
            const targetTask = this.workflow.tasks.find((t) => t.id === flow.target_id);
            if (targetTask.$meta === undefined) {
                targetTask.$meta = {};
            }
            const inputPort = targetTask.operation.ports.find(p => p.id == flow.target_port);
            targetTask.$meta[inputPort.slug] = { sourceOperationSlug: sourceTask.operation.slug };

            flow.id = `${flow.source_id}/${flow.source_port}-${flow.target_id}/${flow.target_port}`;
            this.workflow.flows.push(flow);
            this.setIsDirty(true);
        },
        removeFlow(flowId) {
            const inx = this.workflow.flows.findIndex((n) => {
                const id = `${n.source_id}/${n.source_port}-${n.target_id}/${n.target_port}`;
                return id === flowId;
            });
            if (inx > -1) {
                const flow = this.workflow.flows[inx];
                this.workflow.flows.splice(inx, 1);

                this.setIsDirty(true);

                const targetTask = this.workflow.tasks.find((t) => t.id === flow.target_id);
                const inputPort = targetTask.operation.ports.find(p => p.id == flow.target_port);
                if (targetTask.$meta && targetTask.$meta[inputPort.slug]) {
                    delete targetTask.$meta[inputPort.slug];
                }
            }
        },

        /* Task related  */
        clickTask(taskComponent, showProperties) {
            // If there is a selected task, keep properties opened
            this.showProperties = showProperties
                || (this.showProperties && this.selectedTask.task && this.selectedTask.task.id);
            this.selectedTask = taskComponent;
            this.updateAttributeSuggestion();
        },
        addTask(task) {
            this.showTasksPanel = false;
            this.maxDisplayOrder++;
            task.step = null;
            task.display_order = this.maxDisplayOrder;

            this.workflow.tasks.push(task);
            this.setIsDirty(true);
        },
        removeTask(task) {
            const inx = this.workflow.tasks.indexOf(task);
            if (inx >= 0) {
                this.workflow.tasks.splice(inx, 1);
            }
        },

        applyZoom(zoom) {
            this.$refs.diagram.setZoomPercent(zoom);
        },
        getCaipirinhaLink(jobId, taskId, visId) {
            return `${caipirinhaUrl}/visualizations/${jobId}/${taskId}/${visId}`;
        },

        leaving(event) {
            if (this.isDirty) {
                event.preventDefault();
                event.returnValue = false;
            }
        },
        showTaskResult(task) {
            this.resultTask = task;
            this.$refs.taskResultModal.show();
        },
        showJobs() {
            this.showPreviousJobs = true;
        },
        toggleTasksPanel() { this.showTasksPanel = !this.showTasksPanel; this.showDataSourcesPanel = false; },
        toggleDataSourcesPanel() { this.showDataSourcesPanel = !this.showDataSourcesPanel; this.showTasksPanel = false; },
        updateSelectedTab(index) {// eslint-disable-line no-unused-vars
            //this.selectedTab = index;
            this.$refs.diagram.repaint();
        },
        _loadOperations(self, workflow, resp, showDisabledOpsAlert) {
            self.operations = resp.data;

            self.operations.forEach((op) => {
                self.operationsLookup[op.id] = op;
            });
            let usingDisabledOp = false;
            workflow.tasks.forEach((task) => {
                let op = self.operationsLookup[task.operation.id];
                self.maxDisplayOrder = self.maxDisplayOrder < task.display_order ? task.display_order : self.maxDisplayOrder;
                task.operation = op || { forms: [] };
                task.step = null;
                usingDisabledOp |= op === undefined || op.enabled === false;
                if (op === undefined || !op.enabled) {
                    task.warning = self.$t('workflow.usingDisabledOperation');
                } else {
                    task.warning = null;
                }
            });
            if (usingDisabledOp && showDisabledOpsAlert) {
                self.warning(self.$t('messages.usingDisabledOperation',
                    { what: self.$t('titles.workflow') }), 60000, 300);
            }
            if (!workflow.forms) {
                workflow.forms = {};
            }
            (workflow.platform.forms || []).forEach((form) => {
                if (form.order < self.minFormOrder) {
                    self.minFormOrder = form.order;
                }
                // form.fields.forEach((field) => {
                //     // console.debug("Aqui", workflow.forms[field.name])
                //     // workflow.forms[field.name] = workflow.forms[field.name].value ||
                //     //     field['default'] || ''
                // });
            });
            self.workflow = workflow;
            self._validateTasks(self.workflow.tasks);
            self.updateAttributeSuggestion();
            self.loaded = true;
            self.loadingToolbox = false;
            self.expandableOperations = this.operations.filter(op => op.type === 'SHORTCUT');
        },
        load() {
            let self = this;
            self.loadingToolbox = true;
            axios.get(`${tahitiUrl}/workflows/${this.$route.params.id}`).then(
                (resp) => {
                    let workflow = resp.data;
                    workflow.variables = workflow.variables || [];
                    this.$Progress.start();
                    const params = {
                        platform: workflow.platform.id, //this.$route.params.platform,
                        subset: workflow.subset ? workflow.subset.id : null,
                        lang: this.$root.$i18n.locale,
                        disabled: true, // even disabled operations must be returned to keep compatibility,
                        workflow: workflow.id,
                        t: new Date().getTime(), // Force refresh
                    };
                    axios.get(`${tahitiUrl}/operations`, { params }).then(
                        resp => self._loadOperations(self, workflow, resp.data, true)
                    ).catch(function (e) {
                        this.error(e);
                    }.bind(this)).finally(() => {
                        Vue.nextTick(() => {
                            this.$Progress.finish();
                            self.loadingToolbox = true;
                            delete params['workflow'];
                            delete params['t'];
                            axios.get(`${tahitiUrl}/operations`, { params }).then(
                                resp => self._loadOperations(self, workflow, resp.data, false)
                            ).catch(function (e) {
                                this.error(e);
                            });
                        });
                    });
                    axios.get(`${standUrl}/jobs/latest`, { params })
                        .then((resp2 => {
                            const job = resp2.data;
                            self.job = job;
                            const tasks = self.workflow.tasks;
                            job.steps.forEach((step) => {
                                const foundTask = tasks.find((t) => {
                                    return t.id === step.task.id;
                                });
                                if (foundTask) {
                                    foundTask.step = step;
                                }
                            });
                            job.results.forEach((result) => {
                                const foundTask = tasks.find((t) => {
                                    return t.id === result.task.id;
                                });
                                if (foundTask) {
                                    foundTask.result = result;
                                }
                            });
                        })).catch(() => { });

                }
            ).catch(function (e) {
                this.error(e);
            }.bind(this));

        },
        async saveAsImage() {
            let self = this;
            let $elem = this.$refs.diagram.$el.querySelector('#lemonade-container');

            toPng($elem)
                .then(function (dataUrl) {
                    const link = document.createElement('a');
                    link.setAttribute('download', `workflow_${self.workflow.id}.png`);
                    link.setAttribute('href', dataUrl);
                    document.getElementsByTagName("body")[0].appendChild(link);
                    link.click();
                    link.remove();
                });
        },
        _generateId() {
            return this.$refs.diagram.generateId();
        },
        _downloadAsType(data, contentType, extension) {
            const self = this;
            const element = document.createElement('a');
            element.setAttribute('href', `data:${contentType};charset=utf-8,` +
                encodeURIComponent(data));
            element.setAttribute('download', `workflow_${self.workflow.id}.${extension}`);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        exportWorkflow(format) {
            const self = this;
            if (format === undefined) {
                self._downloadAsType(JSON.stringify(self.workflow),
                    'application/json', 'json');
            } else if (format === 'python' || format === 'notebook') {
                const body = {
                    workflow_id: self.$route.params.id,
                    template: format
                };
                const contentType = format === 'python' ? 'application/x-python-code' :
                    'application/x-ipynb+json';
                const extension = format === 'python' ? 'py' : 'ipynb';
                axios.post(`${standUrl}/workflow/source-code`, body).then(resp => {
                    self.info(self.$t('common.wait'), 5000);
                    self.exportTimeoutHandler = setTimeout(() => {
                        axios.get(`${standUrl}/workflow/source-code/${resp.data}`).then(
                            resp => {
                                self._downloadAsType(resp.data, contentType, extension);
                            }).catch(function (e) {
                            self.error(e);
                        });
                    }, 5000);
                }).catch(function (e) {
                    self.error(e);
                });
            } else {
                self.warning(self.$t('errors.invalidOperation'));
            }

            // self.success(self.$t('messages.exportWorkflow'));
        },
        async saveWorkflowAs(saveOption, newName) {
            if (saveOption === 'new') {
                await this.saveWorkflow(true, newName);
            } else if (saveOption === 'image') {
                await this.saveAsImage();
            }
        },
        async saveWorkflow(savingCopy, newName) {
            let cloned = JSON.parse(JSON.stringify(this.workflow));
            let url = `${tahitiUrl}/workflows`;
            let headers = { 'Content-Type': 'application/json' };
            let method = 'post';
            if (cloned.id !== 0 && !savingCopy) {
                url = `${url}/${cloned.id}`;
                method = 'patch';
            }
            cloned.platform_id = this.$route.params.platform;
            const oldId2NewId = new Map();
            cloned.tasks.forEach((task) => {
                task.operation = { id: task.operation.id };
                delete task.version; //
                delete task.step;
                delete task.status;
                if (savingCopy) {
                    const newId = this._generateId();
                    oldId2NewId[task.id] = newId;
                    task.id = newId;
                }
            });
            if (savingCopy) {
                cloned.id = null;
                cloned.name = newName;
                cloned.flows.forEach((flow) => {
                    let newSource = oldId2NewId[flow.source_id];
                    flow.source_id = newSource;
                    let newTarget = oldId2NewId[flow.target_id];
                    flow.target_id = newTarget;
                    flow.id = `${newSource}/${flow.source_port}-${newTarget}/${flow.target_port}`;
                });
            }
            try {
                const resp = await axios[method](url, cloned, { headers });
                this.setIsDirty(false);
                if (!savingCopy) {
                    let workflow = resp.data.data;
                    workflow.tasks.forEach((task) => {
                        task.operation = this.operationsLookup[task.operation.id];
                    });
                    this.workflow = workflow;
                    this.success(this.$t('messages.savedWithSuccess',
                        { what: this.$t('titles.workflow') }));
                    this._validateTasks(this.workflow.tasks);
                } else {
                    this.success(this.$t('workflow.copySavedWithSuccess',
                        { what: this.$t('titles.workflow') }));
                }
            } catch (e) {
                this.error(e);
            }
        },
        restore(version) {
            let self = this;
            this.confirm(
                this.$t('common.history'),
                this.$t('workflow.restoreHistory'),
                () => {
                    self.$refs.diagram.clearWorkflow().then(() => {
                        let url = `${tahitiUrl}/workflows/history/${this.workflow.id}`;
                        axios.post(url, { version })
                            .then(() => {
                                self.isDirty = false;
                                self.success(self.$t('workflow.versionRestored',
                                    { version }));
                                //self.$router.go(self.$router.currentRoute);
                                self.closeHistory();
                                self.load();
                            }).catch((e) => self.error(e));
                    });
                });
        },
        getSuggestions(taskId) {
            const extendedSuggestions = this.getExtendedSuggestions(taskId);
            if (extendedSuggestions) {
                return this._unique(Array.prototype.concat.apply([],
                    extendedSuggestions.inputs.map(
                        (item) => { return item.attributes; }))).sort(this._caseInsensitiveComparator);
            } else {
                return [];
            }
        },
        getExtendedSuggestions(taskId) {
            if (Object.hasOwnProperty.call(window, 'TahitiAttributeSuggester')) {
                if (window.TahitiAttributeSuggester.processed === undefined
                    || this.attributeSuggestion[taskId] === undefined
                    || this.attributeSuggestion[taskId].length === 0) {
                    this.updateAttributeSuggestion();
                }
                if (this.attributeSuggestion[taskId]) {
                    return this.attributeSuggestion[taskId];
                } else {
                    return {};
                }
            }
        },
        updateAttributeSuggestion() {
            let self = this;
            let attributeSuggestion = {};
            try {
                window.TahitiAttributeSuggester.compute(self.workflow, this._queryDataSource,
                    (result) => {
                        Object.keys(result).forEach(key => {
                            attributeSuggestion[key] = result[key].uiPorts;
                        });
                        Object.assign(self.attributeSuggestion, attributeSuggestion);
                        window.TahitiAttributeSuggester.processed = true;
                    });
            } catch (e) {
                console.log(e);
            }
        },
        showHistory() {
            const self = this;
            const url = `${tahitiUrl}/workflows/history/${this.workflow.id}`;
            axios.get(url)
                .then((resp) => {
                    self.history = resp.data.data;
                    if (self.$refs.historyModal) {
                        self.$refs.historyModal.show();
                    }
                })
                .catch(function (e) {
                    self.error(e);
                }.bind(this));
        },
        closeHistory() {
            this.$refs.historyModal.close();
        },
        saveWorkflowProperties() {
        },
        showWorkflowProperties() {
            if (this.$refs.workflowPropertiesModal) {
                this._retrieveClusters().then(() =>
                    this.$refs.workflowPropertiesModal.show());
            }
        },
        selectImage() {
            if (this.$refs.workflowImageModal)
                this.$refs.workflowImageModal.show();
        },
        showSaveAs() {
            if (this.$refs.saveAsModal) {
                this.$refs.saveAsModal.show(`${this.$t('workflow.copyOf')} ${this.workflow.name}`);
            }
        },
        setIsDirty(flag) {
            console.debug('Dirty=', flag);
            this.isDirty = flag;
        },

        changeCluster(c) {
            if (c) {
                const uiParameters = c.ui_parameters
                    ? new Map(c.ui_parameters.split(",").map(item => item.split("=")))
                    : new Map();
                this.clusterInfo.description = c.description;
                this.clusterInfo.clusterName = c.name;
            }
        },
        showExecuteWindow() {
            const d = new Date().toISOString().slice(0, -5);
            this.clusterInfo.jobName = `${d} - ${this.workflow.name}`;
            this._retrieveClusters().then(() => {
                this.$refs.executeModal.show();
            });
        },
        async execute() {
            this.$Progress.start();
            if (this.isDirty) {
                await this.saveWorkflow(false);
                await this._execute();
            } else {
                await this._execute();
            }
        },
        handleUpdateClusterInfo(updates) {
            const { id, jobName, description, } = updates;
            Object.assign(this.clusterInfo, { id, jobName, description });
        },
        handleUpdateWorkflowProperties(updatedWorkflow) {
            let {
                name, preferred_cluster_id, description,
                is_template, is_system_template,
                publishing_enabled, publishing_status
            } = updatedWorkflow;
            Object.assign(this.workflow, {
                name, preferred_cluster_id, description,
                is_template, is_system_template,
                publishing_enabled, publishing_status
            });
            this.setIsDirty(true);
        },
        _retrieveClusters() {
            const self = this;
            return axios.get(`${standUrl}/clusters?enabled=true&platform=${self.workflow.platform.id}`, {})
                .then((response) => {
                    self.clusters = response.data.data;
                    if (self.clusters.length) {
                        self.clusterInfo.id = self.clusters[0].id;
                        self.clusterInfo.name = self.clusters[0].name;
                        self.clusterInfo.description = self.clusters[0].description;
                        if (self.name === '') {
                            self.clusterInfo.workflowName = self.workflow.name;
                        }
                    }
                }).catch((ex) => {
                    self.error(ex);
                });
        },
        async _execute() {
            const self = this;
            const cloned = JSON.parse(JSON.stringify(this.workflow));
            cloned.platform_id = cloned.platform.id;
            cloned.tasks.forEach((task) => {
                task.operation = { id: task.operation.id };
                delete task.version;
            });
            const user = this.$store.getters.user;
            const body = {
                workflow: cloned,
                cluster: { id: self.clusterInfo.id },
                name: self.clusterInfo.jobName,
                user: {
                    id: user.id,
                    login: user.login,
                    name: user.name
                },
            };
            const headers = {
                'Locale': self.$root.$i18n.locale,
            };
            try {
                const response = await axios.post(`${standUrl}/jobs`, body, { headers });
                self.$Progress.finish();
                self.$router.push({
                    name: 'jobDetail',
                    params: {
                        id: response.data.data.id,
                        platform: self.$route.params.platform
                    }
                });
            } catch (ex) {
                if (ex.data) {
                    self.error(ex.data.message);
                } else if (ex.status === 0) {
                    self.$root.$refs.toastr.e(`Error connecting to the backend (connection refused).`);
                } else {
                    self.error(`Unhandled error: ${JSON.stringify(ex)}`);
                }
            }
        },
        _validateTasks(tasks) {
            const self = this;
            self.validationErrors = [];
            let counter = 1;
            let result = true;
            tasks.forEach(t => {
                if (t.enabled && t.operation) {
                    let warning = null;
                    t.operation.forms.forEach(form => {
                        if (form.category === 'execution') {
                            form.fields.forEach(field => {
                                if (field.enabled || field.enabled === undefined) {
                                    if (field.required && field.enable_conditions !== 'false') {
                                        const value = t.forms[field.name] ? t.forms[field.name].value : null;
                                        if (value === null || value === undefined || value === '' || value === {} || (value.length !== undefined && value.length === 0)) {
                                            warning = this.$t("errors.missingRequiredValue");
                                            self.validationErrors.push({
                                                id: counter++, task: { id: t.id, name: t.name },
                                                field: field.label,
                                                message: self.$t("errors.missingRequiredValue")
                                            });
                                            result = false;
                                        }
                                    }
                                }
                            });
                        }
                    });
                    t.warning = warning;
                }
            });
            return result;
        },
        _unique(data) {
            return Array.from(new Set(data));
        },
        _queryDataSource(id, callback) {
            let attributes = null;
            let self = this;
            id = parseInt(id);
            if (window.TahitiAttributeSuggester.cached === undefined) {
                window.TahitiAttributeSuggester.cached = {};
            }
            if (window.TahitiAttributeSuggester.cached[id]) {
                attributes = window.TahitiAttributeSuggester.cached[id];
                callback(attributes);
            } else {
                let url = `${limoneroUrl}/datasources/${id}`;
                axios.get(url).then(
                    (response) => {
                        //console.debug(response.data)
                        let ds = response.data;
                        attributes = ds.attributes.map(function (attr) { return attr.name; });
                        window.TahitiAttributeSuggester.cached[id] = attributes;
                        callback(attributes);
                    },
                    () => {
                        self.warning(self.$t('errors.invalidDataSource'));
                        callback([]);
                    }
                );
            }
        },
    }
};
</script>
<style scoped>
body {
    overflow-y: hidden
}
</style>
<style lang="scss">
.toolbox {
    &:before {
        content: "";
        position: absolute;
        width: 15px;
        height: 15px;
        background-color: #ECEEEF;
        margin: -8px 0 0 12px;
        transform: rotate(45deg);
        z-index: 1;
    }

    position: absolute;
    z-index: 10;
    width: 250px;
    margin-top: 50px;
    //overflow: hidden;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
    border-radius: 5px;

    .card .card-header {

        .card-title {
            font-size: 12px;
        }
    }

    .ps__scrollbar-y-rail {
        z-index: 1;
    }

    &.datasource-toolbox {
        left: 200px;
    }
}

.diagram-properties {
    width: 350px;
    height: calc(100vh - 250px);
    position: fixed;
    right: 1rem;
    /* bottom: calc(1rem + 25px); */
    top: 190px;
    overflow: hidden;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
}

.blackout {
    background-color: rgba(0, 0, 0, 0) !important;
}

.historyArea {
    height: 60vh;
    overflow: auto
}
</style>