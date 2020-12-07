<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <TahitiSuggester />

                <div class="title">

                    <div class="float-right">
                        <workflow-toolbar v-if="loaded" :workflow="workflow" />
                    </div>

                    <h6 class="header-pretitle">{{$tc('titles.workflow', 1)}} #{{workflow.id}}</h6>
                    <input-header v-model="workflow.name"></input-header>

                </div>

                <div v-show="showTasksPanel" class="toolbox">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title">{{ $tc('common.operation', 2) }}</h4>
                        </div>
                        <toolbox :operations="operations" :workflow="workflow" :selected-task='selectedTask.task'
                            :loading="loadingToolbox" />
                    </div>
                </div>
                <div v-show="showDataSourcesPanel" class="toolbox datasource-toolbox">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title">{{ $tc('titles.dataSource2', 2) }}</h4>
                        </div>
                        <custom-toolbox :operations="expandableOperations" :workflow="workflow"
                            :selected-task='selectedTask.task' />
                    </div>
                </div>

                <diagram ref="diagram" id="main-diagram" :workflow="workflow" v-if="loaded" :operations="operations"
                    :loaded="loaded" :version="workflow.version" tabindex="0"
                    :useDataSource="expandableOperations.length > 0">
                </diagram>

                <div class="diagram-properties" v-if="showProperties">
                    <property-window :task="selectedTask.task" v-if="selectedTask.task"
                        :variables="workflow.variables || []"
                        :suggestionEvent="() => getSuggestions(selectedTask.task.id)"
                        :extendedSuggestionEvent="() => getExtendedSuggestions(selectedTask.task.id)"
                        :publishingEnabled="workflow && workflow.publishing_enabled" />
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
                            <span class="fa fa-cogs"></span> {{form.name}}
                        </template>
                        <div class="card mt-1" style="min-height: 90vh">
                            <div class="card-body">
                                <WorkflowProperty v-if="loaded" :form="form" :workflow="workflow" :loaded="loaded" />
                            </div>
                        </div>
                    </b-tab>
                    <b-tab :title="$tc('titles.workflow', 1)" title-item-class="tab-order-5">
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
                    <b-tab :title="$tc('titles.job', 2)" title-item-class="tab-order-6" @click="showJobs">
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
                <ModalWorkflowVariables ref="variablesModal" :workflow="workflow" :items="workflow.variables" />
                <ModalExecuteWorkflow ref="executeModal" :clusters="clusters" :clusterInfo="clusterInfo"
                    :validationErrors="validationErrors" :workflow="workflow" />
                <ModalWorkflowHistory ref="historyModal" :history="history" />
                <ModalSaveWorkflowAs ref="saveAsModal" />
                <ModalTaskResults ref="taskResultModal" :task="resultTask" />
                <ModalWorkflowProperties ref="workflowPropertiesModal" :loaded="loaded" :workflow="workflow"
                    :clusters="clusters" />
                <ModalWorkflowImage ref="workflowImageModal" :workflow="workflow" />
                <WorkflowExecution ref="executionsModal" :workflow-id="workflow.id" />
            </div>
        </div>
    </main>
</template>

<script>
    import axios from 'axios';
    import DiagramComponent from '../components/Diagram.vue';
    import html2canvas from 'html2canvas';
    import InputHeader from '../components/InputHeader.vue';
    import ModalSaveWorkflowAs from './modal/ModalSaveWorkflowAs.vue'
    import ModalWorkflowProperties from './modal/ModalWorkflowProperties.vue'
    import ModalWorkflowImage from './modal/ModalWorkflowImage.vue'
    import ModalWorkflowVariables from './modal/ModalWorkflowVariables.vue'
    import ModalTaskResults from './modal/ModalTaskResults.vue'
    import ModalWorkflowHistory from './modal/ModalWorkflowHistory.vue'
    import ModalExecuteWorkflow from './modal/ModalExecuteWorkflow.vue'
    import PropertyWindow from '../components/PropertyWindow.vue';
    import Notifier from '../mixins/Notifier';
    import SlideOutPanel from '../components/SlideOutPanel.vue';
    import ToolboxComponent from '../components/Toolbox.vue';
    import CustomToolboxComponent from '../components/CustomToolbox.vue';
    import Vue from 'vue';
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';
    import WorkflowExecution from '../components/WorkflowExecution.vue';
    import WorkflowProperty from '../components/WorkflowProperty.vue';
    import WorkflowToolbar from '../components/WorkflowToolbar.vue';
    import CapirinhaVisualization from '../components/caipirinha-visualization/CaipirinhaVisualization.vue';

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const standUrl = process.env.VUE_APP_STAND_URL
    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;

    export default {
        mixins: [Notifier],
        components: {
            'caipirinha-visualization': CapirinhaVisualization,
            'diagram': DiagramComponent,
            'toolbox': ToolboxComponent,
            'custom-toolbox': CustomToolboxComponent,
            'workflow-toolbar': WorkflowToolbar,
            'slideout-panel': SlideOutPanel,
            'property-window': PropertyWindow,

            ModalExecuteWorkflow,
            ModalSaveWorkflowAs,
            ModalTaskResults,
            ModalWorkflowHistory,
            ModalWorkflowProperties,
            ModalWorkflowImage,
            ModalWorkflowVariables,

            VuePerfectScrollbar,

            WorkflowProperty,
            WorkflowExecution,
            InputHeader,
            TahitiSuggester: () => {
                return new Promise((resolve, reject) => {
                    let script = document.createElement('script')
                    script.async = true
                    script.src = `${tahitiUrl}/public/js/tahiti.js`
                    document.head.appendChild(script)
                })
            }
        },
        data() {
            return {
                atmosphereExtension: false,
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
            }
        },
        created() {
            var self = this;
            window.addEventListener('beforeunload', self.leaving)
        },
        mounted() {
            const self = this

            this.$root.$on('addTask', () => {
                this.showTasksPanel = false;
            });

            this.$root.$on('onclear-selection', () => {
                this.selectedTask = {};
                this.selectedElements = [];
                this.showDataSourcesPanel = false;
                this.showTasksPanel = false;
            });
            this.$root.$on('onclick-task', (taskComponent, showProperties) => {
                // If there is a selected task, keep properties opened
                this.showProperties = showProperties ||
                    (this.selectedTask.task && this.selectedTask.task.id);
                this.selectedTask = taskComponent;
                this.updateAttributeSuggestion();
            });
            this.$root.$on('on-error', (e) => {
                this.error(e);
            });
            this.$root.$on('onsave-as-image', () => {
                this.saveAsImage()
            });
            this.$root.$on('onsave-workflow', () => this.saveWorkflow(false));
            this.$root.$on('onshow-executions', () => this.$refs.executionsModal.show());
            this.$root.$on('onshow-variables', () => this.$refs.variablesModal.show());
            this.$root.$on('onsave-workflow-as', (saveOption, newName) => {
                if (saveOption === 'new') {
                    this.saveWorkflow(true, newName);
                } else if (saveOption === 'image') {
                    this.saveAsImage();
                }
            });
            // Modal
            this.$root.$on('onsaveas-workflow', this.showSaveAs);
            this.$root.$on('onupdate-workflow-properties', this.saveWorkflowProperties);
            this.$root.$on('onrestore-workflow', this.restore);
            this.$root.$on('onchange-cluster', this.changeCluster);
            this.$root.$on('onexecute-workflow', this.execute);


            this.$root.$on('onalign-tasks', this.align);
            this.$root.$on('ontoggle-tasks', this.toggleTasks);
            this.$root.$on('ontoggle-tasksPanel', this.toggleTasksPanel);
            this.$root.$on('ontoggle-dataSourcesPanel', this.toggleDataSourcesPanel);
            this.$root.$on('onremove-tasks', this.removeTasks);
            this.$root.$on('ondistribute-tasks', this.distribute);
            this.$root.$on('onclick-export', () => this.exportWorkflow());
            this.$root.$on('onclick-execute', this.showExecuteWindow);
            this.$root.$on('onshow-properties', this.showWorkflowProperties);
            this.$root.$on('onselect-image', this.selectImage);
            this.$root.$on('onset-isDirty', this.setIsDirty);
            this.$root.$on('onclick-setup', (options) => {
                this.performanceModel.cores = options.cores;
                this.performanceModel.setup = options.setup;
            });
            this.$root.$on('onblur-selection', () => {
                this.showProperties = false;
                this.selectedTask = { task: {} };
            });

            this.$root.$on('update-form-field-value', (field, value, labelValue) => {
                if (self.selectedTask.task.forms[field.name]) {
                    if (self.selectedTask.task.forms[field.name].value !== value) {
                        self.selectedTask.task.forms[field.name].value = value
                        this.isDirty = true;
                    }
                } else {
                    this.isDirty = true;
                    self.selectedTask.task.forms[field.name] = { value: value }
                }
                self._validateTasks([self.selectedTask.task]);

                // Used to save the label with the job
                if (!self.selectedTask.task.forms) {
                    self.selectedTask.task.forms = {};
                }
                const fieldInSelectedTask = self.selectedTask.task.forms[field.name];
                if (fieldInSelectedTask) {
                    fieldInSelectedTask.value = value
                } else {
                    fieldInSelectedTask = { value: value }
                }
                fieldInSelectedTask.label = field.label;
                if (labelValue) {
                    fieldInSelectedTask.labelValue = labelValue
                } else if (fieldInSelectedTask.labelValue) {
                    delete fieldInSelectedTask.labelValue
                }
            });
            this.$root.$on('update-workflow-form-field-value', (field, value, labelValue) => {
                const self = this;
                if (self.workflow)
                    if (!self.workflow.forms || !(self.workflow.forms instanceof Object)) {
                        self.workflow.forms = {}
                    }
                try {
                    if (labelValue) {
                        if (self.workflow.forms[field.name].value !== value) {
                            self.workflow.forms[field.name].value = value;
                            this.isDirty = true;
                        }
                        if (self.workflow.forms[field.name].labelValue !== labelValue) {
                            self.workflow.forms[field.name].labelValue = labelValue;
                            this.isDirty = true;
                        }
                    } else {
                        if (self.workflow.forms[field.name].value !== value) {
                            self.workflow.forms[field.name].value = value;
                            this.isDirty = true;
                        }
                    }
                    self.workflow.forms[field.name].label = field.label;
                } catch (e) {
                    console.debug(e)
                }
            })
            /* Task related */
            this.$root.$on('addTask', (task) => {
                task.step = null;
                this.workflow.tasks.push(task);
                this.isDirty = true;
            });
            this.$root.$on('onremove-task', (task) => {
                // const self = this;
                // this.instance.deleteConnectionsForElement(task.id);
                // this.instance.removeAllEndpoints(task.id);
                // let elem = document.getElementById(task.id)
                // elem.parentNode.removeChild(elem);
                // //console.debug(this.instance.getConnections());
                // this.instance.repaintEverything();
                // Vue.nextTick(function () {
                //     self.$store.dispatch('removeTask', task);
                //     self.clearSelection();
                //     self.instance.repaintEverything();
                // })
                const inx = this.workflow.tasks.findIndex((n) => n.id === task.id);
                if (inx > -1) {
                    this.workflow.tasks.splice(inx, 1);
                    // const flows = this.workflow.flows;
                    // for (let i = flows.length - 1; i > 0; i--) {
                    //     if (flows[i].source_id === task.id) {
                    //         state.workflow.flows.splice(i, 1);
                    //     }
                    // }
                }
                this.isDirty = true;
            });
            this.$root.$on('addFlow', (flow, jsPlumbConn) => {
                flow.id = `${flow.source_id}/${flow.source_port}-${flow.target_id}/${flow.target_port}`;
                this.workflow.flows.push(flow);
                this.isDirty = true;
            });
            this.$root.$on('removeFlow', (flowId) => {
                const inx = this.workflow.flows.findIndex((n) => {
                    const id = `${n.source_id}/${n.source_port}-${n.target_id}/${n.target_port}`;
                    return id === flowId;
                });
                if (inx > -1) {
                    this.workflow.flows.splice(inx, 1);
                }
                this.isDirty = true;
            });
            this.$root.$on('onshow-history', this.showHistory);
            this.$root.$on('onzoom', (zoom) => {
                this.$refs.diagram.setZoomPercent(zoom);
            });
            this.$root.$on('onshow-result', this.showTaskResult);
            this.load();

        },
        beforeRouteLeave(to, from, next) {
            let self = this;
            if (self.isDirty) {
                if (confirm(self.$tc('warnings.dirtyCheck'))) {
                    next()
                }
            } else {
                next();
            }
        },
        beforeDestroy() {
            this.$root.$off('addTask');
            this.$root.$off('onclick-task');
            this.$root.$off('on-error');
            this.$root.$off('onsave-as-image');
            this.$root.$off('onsave-workflow');
            this.$root.$off('onsave-workflow-as');
            this.$root.$off('onsaveas-workflow');
            this.$root.$off('onalign-tasks');
            this.$root.$off('ontoggle-tasksPanel');
            this.$root.$off('ontoggle-tasks');
            this.$root.$off('ondistribute-tasks');
            this.$root.$off('onclick-execute');
            this.$root.$off('onblur-selection');
            this.$root.$off('update-form-field-value');
            this.$root.$off('update-workflow-form-field-value');
            this.$root.$off('addTask');
            this.$root.$off('onremove-task');
            this.$root.$off('addFlow');
            this.$root.$off('removeFlow');
            this.$root.$off('onshow-history');
            this.$root.$off('onzoom');
            this.$root.$off('onshow-result');
            this.$root.$off('onset-isDirty');
            this.$root.$off('onsaveas-workflow');
            this.$root.$off('onupdate-workflow-properties');
            this.$root.$off('onrestore-workflow');
            this.$root.$off('onchange-cluster');
            this.$root.$off('onexecute-workflow');
            this.$root.$off('onshow-properties');
            this.$root.$off('onshow-executions');
            this.$root.$off('onshow-variables');
            window.removeEventListener('beforeunload', this.leaving)
        },
        watch: {
            '$route.params.id': function (id) {
                this.$refs.diagram.clearWorkflow();
                this.load(id);
            }
        },
        methods: {
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
                this.showPreviousJobs = true
            },
            align(prop, fn) {
                this.$refs.diagram.align(prop, fn);
            },
            toggleTasksPanel() { this.showTasksPanel = !this.showTasksPanel; this.showDataSourcesPanel = false; },
            toggleDataSourcesPanel() { this.showDataSourcesPanel = !this.showDataSourcesPanel; this.showTasksPanel = false; },
            toggleTasks(mode, prop) { this.$refs.diagram.toggleTasks(mode, prop); },
            removeTasks() { this.$refs.diagram.removeSelectedTasks(); },
            distribute(mode, prop) { this.$refs.diagram.distribute(mode, prop); },
            updateSelectedTab(index) {
                //this.selectedTab = index;
                this.$refs.diagram.repaint();
            },
            _loadOperations(self, workflow, resp, showDisabledOpsAlert) {
                self.operations = resp.data
                self.operations.forEach((op) => {
                    self.operationsLookup[op.id] = op
                })
                let usingDisabledOp = false;
                workflow.tasks.forEach((task) => {
                    let op = self.operationsLookup[task.operation.id];
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
                        { what: self.$tc('titles.workflow') }), 60000, 300);
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
                        this.$Progress.start()
                        const params = {
                            platform: workflow.platform.id, //this.$route.params.platform,
                            subset: workflow.subset ? workflow.subset.id : null,
                            lang: this.$root.$i18n.locale,
                            disabled: true, // even disabled operations must be returned to keep compatibility,
                            workflow: workflow.id,
                            t: new Date().getTime(), // Force refresh
                        }
                        axios.get(`${tahitiUrl}/operations`, { params }).then(resp => self._loadOperations(self, workflow, resp, true)
                        ).catch(function (e) {
                            this.error(e);
                        }.bind(this)).finally(() => {
                            Vue.nextTick(() => {
                                this.$Progress.finish();
                                self.loadingToolbox = true;
                                delete params['workflow'];
                                delete params['t'];
                                axios.get(`${tahitiUrl}/operations`, { params }).then(resp => self._loadOperations(self, workflow, resp, false)
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
            saveAsImage() {
                let self = this
                let $elem = this.$refs.diagram.$el.querySelector('#lemonade-container')
                html2canvas($elem, {
                    width: 3000, height: 3000, logging: false, allowTaint: false,
                    onclone(clone) {
                        let elem = clone.getElementById($elem.id);
                        elem.parentElement.style.height = '10000px';
                        elem.style.transform = 'inherit'; // remove zoom
                        elem.parentElement.scrollTop = 0;
                    },
                }).then(
                    (canvas) => {
                        //inversed, to get smallest 
                        let x0 = canvas.width, y0 = canvas.height, x1 = 0, y1 = 0;
                        self.workflow.tasks.forEach((task) => {
                            let elem = document.getElementById(task.id);
                            x0 = Math.min(task.left, x0);
                            x1 = Math.max(task.left + elem.style.width, x1);
                            y0 = Math.min(task.top, y0);
                            y1 = Math.max(task.top + elem.style.height, y1);
                        });
                        const targetCanvas = document.createElement('canvas');
                        const targetCtx = targetCanvas.getContext('2d');
                        const padding = 100;
                        targetCanvas.width = x1 + 2 * padding;
                        targetCanvas.height = y1 + 2 * padding;
                        targetCtx.fillStyle = "white";
                        // targetCtx.translate(-x0 + 150, -y0 + 150);
                        targetCtx.drawImage(canvas, 0, 0);
                        // let ctx = canvas.getContext('2d');
                        for (let flow of $elem.getElementsByClassName('jtk-connector')) {
                            const DOMURL = window.URL || window.webkitURL || window;
                            const xml = `<svg width="${flow.width.baseVal.value}" height="${flow.height.baseVal.value}" xmlns="http://www.w3.org/2000/svg">${flow.innerHTML}</svg>`;
                            const url = DOMURL.createObjectURL(
                                new Blob([xml], { type: 'image/svg+xml' }));
                            const left = parseInt(flow.style.left);
                            const top = parseInt(flow.style.top);
                            const img = new Image();
                            img.onload = () => {
                                targetCtx.drawImage(img, left, top);
                                DOMURL.revokeObjectURL(url);
                            };
                            img.src = url;
                        }
                        window.setTimeout(() => {
                            targetCtx.fillStyle = "black";
                            targetCtx.font = "10pt Verdana";
                            targetCtx.fillText(
                                `${self.workflow.name}. ${self.$t('workflow.imageGeneratedAt')} ${new Date()}`,
                                20, targetCanvas.height - 20);
                            const link = document.createElement('a');
                            link.setAttribute('download', `workflow_${self.workflow.id}.png`);
                            link.setAttribute('href', targetCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
                            document.getElementsByTagName("body")[0].appendChild(link)
                            link.click();
                            link.remove();
                            //link.text = "Click"
                        }, 1000);
                    });
            },
            _generateId() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            exportWorkflow() {
                const self = this
                const json = JSON.stringify(self.workflow);
                const element = document.createElement('a');
                element.setAttribute('href', 'data:application/json;charset=utf-8,' +
                    encodeURIComponent(json));
                element.setAttribute('download', self.workflow.name + '.json');
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                // self.success(self.$t('messages.exportWorkflow'));
            },
            saveWorkflow(savingCopy, newName) {
                let self = this
                let cloned = JSON.parse(JSON.stringify(self.workflow));
                let url = `${tahitiUrl}/workflows`;
                let headers = { 'Content-Type': 'application/json' }
                let method = 'post'
                if (cloned.id !== 0 && !savingCopy) {
                    url = `${url}/${cloned.id}`;
                    method = 'patch'
                }
                cloned.platform_id = this.$route.params.platform;
                const oldId2NewId = new Map();
                cloned.tasks.forEach((task) => {
                    task.operation = { id: task.operation.id };
                    delete task.version; //
                    delete task.step;
                    delete task.status;
                    if (savingCopy) {
                        const newId = self._generateId();
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
                return axios[method](url, cloned, { headers }).then(
                    (resp) => {
                        self.isDirty = false;
                        if (!savingCopy) {
                            let workflow = resp.data.data;
                            workflow.tasks.forEach((task) => {
                                task.operation = self.operationsLookup[task.operation.id]
                            });
                            self.workflow = workflow;
                            self.success(self.$t('messages.savedWithSuccess',
                                { what: self.$tc('titles.workflow') }));
                            self._validateTasks(self.workflow.tasks);
                        } else {
                            self.success(self.$t('workflow.copySavedWithSuccess',
                                { what: self.$tc('titles.workflow') }));
                        }
                    }
                ).catch(function (e) {
                    this.error(e);
                }.bind(this));
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
                                .then((resp) => {
                                    let workflow = resp.data;
                                    workflow.tasks.forEach((task) => {
                                        task.operation = self.operationsLookup[task.operation.id]
                                        task.step = null
                                    });
                                    self.success(self.$t('workflow.versionRestored',
                                        { version, version2: 2343 }));
                                    self.workflow = workflow;
                                    self.closeHistory();
                                    self.isDirty = false;
                                }).catch((e) => self.error(e))
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
                if (window.hasOwnProperty('TahitiAttributeSuggester')) {
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
                const url = `${tahitiUrl}/workflows/history/${this.workflow.id}`
                axios.get(url)
                    .then((resp) => {
                        self.history = resp.data.data
                        if (self.$refs.historyModal) {
                            self.$refs.historyModal.show();
                        }
                    })
                    .catch(function (e) {
                        self.error(e);
                    }.bind(this));
            },
            closeHistory() {
                this.$refs.historyModal.hide();
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
                this.isDirty = flag;
            },

            changeCluster(c) {
                if (c) {
                    const uiParameters = c.ui_parameters
                        ? new Map(c.ui_parameters.split(",").map(item => item.split("=")))
                        : new Map();
                    this.atmosphereExtension = uiParameters.get('atmosphere') === 'true';
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
            execute() {
                const self = this;
                this.$Progress.start()
                this.saveWorkflow(false).then(() => {
                    self._execute();
                });
            },
            _retrieveClusters() {
                const self = this;
                return axios.get(`${standUrl}/clusters?enabled=true`, {})
                    .then((response) => {
                        self.clusters = response.data.data;
                        if (self.clusters.length) {
                            self.clusterInfo.id = self.clusters[0].id;
                            self.clusterInfo.name = self.clusters[0].name;
                            self.clusterInfo.description = self.clusters[0].description;
                            if (self.name === '') {
                                self.clusterInfo.workflowName = self.workflow.name;
                            }
                        } else {
                            self.error(null, self.$t("workflow.errorNoCluster"));
                        }
                    }).catch((ex) => {
                        self.error(ex);
                    });
            },
            _execute() {
                const self = this;
                const cloned = JSON.parse(JSON.stringify(this.workflow));
                cloned.platform_id = cloned.platform.id;
                if (self.atmosphereExtension) {
                    cloned['atmosphere'] = this.$refs.performanceModel.payload;
                }
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
                }
                const headers = {
                    'Locale': self.$root.$i18n.locale,
                };
                axios.post(`${standUrl}/jobs`, body, { headers })
                    .then(function (response) {
                        self.$Progress.finish()
                        self.$router.push({
                            name: 'jobDetail',
                            params: {
                                id: response.data.data.id,
                                platform: self.$route.params.platform
                            }
                        });
                    }).catch((ex) => {
                        if (ex.data) {
                            self.error(ex.data.message);
                        } else if (ex.status === 0) {
                            self.$root.$refs.toastr.e(`Error connecting to the backend (connection refused).`);
                        } else {
                            self.error(`Unhandled error: ${JSON.stringify(ex)}`);
                        }
                    });
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
                                            if (value === null || value === '' || value === {} || (value.length !== undefined && value.length === 0)) {
                                                warning = this.$tc("errors.missingRequiredValue");
                                                self.validationErrors.push({
                                                    id: counter++, task: { id: t.id, name: t.name },
                                                    field: field.label,
                                                    message: self.$tc("errors.missingRequiredValue")
                                                })
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
                return Array.from(new Set(data))
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
                            attributes = ds.attributes.map(function (attr) { return attr.name });
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
    }
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

    .atmosphere h3 {
        text-align: center;
        color: #aaa;
    }
</style>