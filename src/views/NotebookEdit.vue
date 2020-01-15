<template>
    <main role="main">
        <TahitiSuggester />
        <div class="border-bottom d-flex justify-content-between align-items-center">
            <div>
                <h6 class="header-pretitle">{{$tc('titles.notebook', 1)}} - {{$tc('titles.workflow', 1)}}
                    #{{workflow.id}}</h6>
                <input-header v-model="workflow.name"></input-header>
            </div>
            <div>
                <workflow-toolbar v-if="loaded" :workflow="workflow"></workflow-toolbar>
            </div>
        </div>

        <div class="notebook">
            <div class="row" v-for="(task, counter) in workflow.tasks" :key="task.id">
                <div class="col-md-10 cell offset-1">
                    <div class="props card text-dark bg-light p1 mb-1">
                        <div class="special card-header">
                            <div class="row">
                                <div class="col-md-3"
                                    :class="'decor ' + (task.step? task.step.status.toLowerCase() : 'pending')">
                                    <strong>[ <span
                                            :class="getClassesForDecor(task.step? task.step.status : 'PENDING')"></span>
                                        ] - {{task.operation.name}}</strong>
                                </div>
                                <div class="col-md-4"></div>
                                <div class="col-md-1 text-right">
                                    <SwitchComponent v-model="task.enabled" :checked="task.enabled">
                                        {{$t('common.enabled')}}
                                    </SwitchComponent>
                                </div>
                                <div class="col-md-4 text-right">
                                    <button class="btn btn-sm btn-outline-secondary ml-1"
                                        :title="$tc('notebook.newCell')">
                                        <span class="fa fa-plus"></span>
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary ml-1"
                                        :title="$tc('notebook.executeUntil')">
                                        <span class="fa fa-play"></span>
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary ml-1"
                                        :title="$tc('notebook.delete')">
                                        <span class="fa fa-trash"></span>
                                    </button>
                                    <a class="btn btn-sm btn-outline-secondary ml-1" :href="'docReferenceUrl'"><span
                                            class="fa fa-question-circle"></span>
                                        {{$t('property.help')}}</a>
                                </div>

                            </div>
                        </div>
                        <div style="display: flex; padding:4px; flex-wrap: wrap; flex-direction: row;">
                            <div class="col">
                                <label>{{$t('property.taskName')}}</label>
                                <input type="text" maxlength="50" v-model="task.name" class="form-control" />
                                <div v-for="port in getInputPorts(task)" :key="port.id">
                                    <label>{{port.name.charAt(0).toUpperCase()}}{{port.name.slice(1)}}</label>
                                    <select class="form-control">
                                        <option></option>
                                    </select>
                                </div>
                            </div>
                            <div class="col" v-for="(form, index) in task.operation.forms" v-bind:key="form.id"
                                :title="form.name">
                                <div>
                                    <div v-for="field in form.fields" class="mb-2 property clearfix"
                                        v-bind:key="task.id + field.name" v-if="true || field.enabled"
                                        :data-name="field.name">
                                        <component :is="field.suggested_widget + '-component'" :field="field"
                                            :value="getValue(task, field.name)" 
                                            :suggestionEvent="() => getSuggestions(task.id)"
                                            :programmingLanguage="task.operation.slug === 'execute-python'? 'python': (task.operation.slug === 'execute-sql'? 'sql': '') "
                                            :language="$root.$i18n.locale" :type="field.suggested_widget"
                                            context="context" :parentId="task.id">
                                        </component>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="taskId">{{task.id}}</div>
                    </div>
                </div>
                <div class="col-md-10 offset-1">
                    <div v-if="task.step">
                        <div class="step-log" v-for="log in task.step.logs" :key="log.id">
                            <div class="step-date">{{log.date | formatJsonDate}}</div>
                            <div v-if="log.type==='TEXT'">
                                <small>{{log.message}}</small>
                            </div>
                            <div v-if="log.type === 'HTML'">
                                <div class="html-div" v-html="log.message"></div>
                            </div>
                            <div v-if="log.type === 'IMAGE'">
                                <img class="image" :src="'data:image/png;base64,' + log.message">
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalExecuteWorkflow ref="executeModal" :clusters="clusters" :clusterInfo="clusterInfo"
            :validationErrors="validationErrors" :workflow="workflow" />
        <ModalWorkflowHistory ref="historyModal" :history="history" />
        <ModalSaveWorkflowAs ref="saveAsModal" />
        <ModalTaskResults ref="taskResultModal" :task="resultTask" />
        <ModalWorkflowProperties ref="workflowPropertiesModal" :loaded="loaded" :workflow="workflow" />
    </main>
</template>

<script>
    import axios from 'axios';
    import DiagramComponent from '../components/Diagram.vue';
    import html2canvas from 'html2canvas';
    import InputHeader from '../components/InputHeader.vue';
    import ModalSaveWorkflowAs from './modal/ModalSaveWorkflowAs.vue'
    import ModalWorkflowProperties from './modal/ModalWorkflowProperties.vue'
    import ModalTaskResults from './modal/ModalTaskResults.vue'
    import ModalWorkflowHistory from './modal/ModalWorkflowHistory.vue'
    import ModalExecuteWorkflow from './modal/ModalExecuteWorkflow.vue'
    import PropertyWindow from '../components/PropertyWindow.vue';
    import Notifier from '../mixins/Notifier';
    import SlideOutPanel from '../components/SlideOutPanel.vue';
    import ToolboxComponent from '../components/Toolbox.vue';
    import Vue from 'vue';
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';
    import WorkflowExecution from '../components/WorkflowExecution.vue';
    import WorkflowProperty from '../components/WorkflowProperty.vue';
    import WorkflowToolbar from '../components/WorkflowToolbar.vue';

    import AttributeFunctionComponent from '../components/widgets/AttributeFunction.vue'
    // import AttributeSelectorComponent from '../components/widgets/AttributeSelector2.vue'
    import AttributeSelector2Component from '../components/widgets/AttributeSelector2.vue'
    import CheckboxComponent from '../components/widgets/Checkbox.vue'
    import CodeComponent from '../components/widgets/Code.vue'
    import ColorComponent from '../components/widgets/Color.vue'
    import DecimalComponent from '../components/widgets/Decimal.vue'
    import DropDownComponent from '../components/widgets/DropDown.vue'
    import ExpressionComponent from '../components/widgets/ExpressionEditor.vue'
    import IntegerComponent from '../components/widgets/Integer.vue'
    import LookupComponent from '../components/widgets/Lookup.vue'
    import RangeComponent from '../components/widgets/Range.vue'
    import Select2Component from '../components/widgets/Select2.vue'
    import SwitchComponent from '../components/widgets/Switch.vue'
    import TagComponent from '../components/widgets/Select2.vue'
    import TextComponent from '../components/widgets/Text.vue'
    import TextAreaComponent from '../components/widgets/TextArea.vue'

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const standUrl = process.env.VUE_APP_STAND_URL

    export default {
        mixins: [Notifier],
        components: {
            'diagram': DiagramComponent,
            'toolbox': ToolboxComponent,
            'workflow-toolbar': WorkflowToolbar,
            'slideout-panel': SlideOutPanel,
            'property-window': PropertyWindow,

            ModalExecuteWorkflow,
            ModalSaveWorkflowAs,
            ModalTaskResults,
            ModalWorkflowHistory,
            ModalWorkflowProperties,

            SwitchComponent,
            'attribute-function-component': AttributeFunctionComponent,
            // 'attribute-selector-component': AttributeSelectorComponent,
            'attribute-selector-component': AttributeSelector2Component,
            'checkbox-component': CheckboxComponent,
            'code-component': CodeComponent,
            'color-component': ColorComponent,
            'decimal-component': DecimalComponent,
            'dropdown-component': DropDownComponent,
            'expression-component': ExpressionComponent,
            'integer-component': IntegerComponent,
            'lookup-component': LookupComponent,
            'percentage-component': RangeComponent,
            'range-component': RangeComponent,
            'select2-component': Select2Component,
            'tag-component': TagComponent,
            'text-component': TextComponent,
            'textarea-component': TextAreaComponent,


            WorkflowProperty,
            WorkflowExecution,
            VuePerfectScrollbar,
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
                tabIndex: 0,
                atmosphereExtension: false,

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
                minFormOrder: 5,
                newName: '',
                operations: [],
                operationsLookup: new Map(),

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
                }
            }
        },
        created() {
            var self = this;
            window.addEventListener('beforeunload', self.leaving)
        },
        mounted() {
            const self = this
            //self.updateAttributeSuggestion();

            this.$root.$on('onclear-selection', () => {
                this.selectedTask = {};
                this.selectedElements = [];
            });
            this.$root.$on('onclick-task', (taskComponent, showProperties) => {
                // If there is a selected task, keep properties opened
                this.showProperties = showProperties ||
                    (this.selectedTask.task && this.selectedTask.task.id);
                this.selectedTask = taskComponent;
                //this.updateAttributeSuggestion();
            });
            this.$root.$on('on-error', (e) => {
                this.error(e);
            });
            this.$root.$on('onsave-as-image', () => {
                this.saveAsImage()
            });
            this.$root.$on('onsave-workflow', () => this.saveWorkflow(false));
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
            this.$root.$on('onremove-tasks', this.removeTasks);
            this.$root.$on('ondistribute-tasks', this.distribute);
            this.$root.$on('onclick-export', () => this.exportWorkflow());
            this.$root.$on('onclick-execute', this.showExecuteWindow);
            this.$root.$on('onshow-properties', this.showWorkflowProperties);
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
                return;
                // FIXME: Review this code. It is used to save the label
                // if (! self.selectedTask.task.forms){
                //     self.selectedTask.task.forms = {};
                // }
                // let fieldInSelectedTask = self.selectedTask.task.forms[field.name];
                // if (fieldInSelectedTask) {
                //     fieldInSelectedTask.value = value
                // } else {
                //     fieldInSelectedTask = { value: value }
                // }
                // fieldInSelectedTask.label = field.label;
                // if (labelValue) {
                //     fieldInSelectedTask.labelValue = labelValue
                // } else if (fieldInSelectedTask.labelValue){
                //     delete fieldInSelectedTask.labelValue
                // }
                // self._validateTasks([self.selectedTask.task]);
                // this.isDirty = true;
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
            this.$root.$off('onclick-task');
            this.$root.$off('on-error');
            this.$root.$off('onsave-as-image');
            this.$root.$off('onsave-workflow');
            this.$root.$off('onsaveas-workflow');
            this.$root.$off('onalign-tasks');
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
            window.removeEventListener('beforeunload', this.leaving)
        },
        watch: {
            '$route.params.id': function (id) {
                this.$refs.diagram.clearWorkflow();
                this.load(id);
            }
        },
        methods: {
            getClassesForDecor(value) {
                const result = [];
                switch (value) {
                    case 'ERROR':
                        result.push("fa fa-times-circle");
                        break;
                    case 'PENDING':
                        result.push("fa fa-pause-circle");
                        break;
                    case 'CANCELED':
                        result.push("fa fa-stop-circle");
                        break;
                    case 'RUNNING':
                        result.push("fa fa-sync fa-spin");
                        break;
                    case 'COMPLETED':
                        result.push("fa fa-check-circle");
                        break;
                    default:
                }
                result.push(value.toLowerCase());
                return result.join(' ');
            },
            getValue(task, name) {
                return task
                    && task.forms
                    && task.forms[name]
                    ? task.forms[name].value : null;
            },
            getInputPorts(task) {
                if (task.outputs === undefined) {
                    task.outputs = task.operation.ports.filter(p => p.type === 'INPUT');
                }
                return task.outputs;
            },
            leaving(event) {
                let self = this;
                if (self.isDirty) {
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
            toggleTasks(mode, prop) { this.$refs.diagram.toggleTasks(mode, prop); },
            removeTasks() { this.$refs.diagram.removeSelectedTasks(); },
            distribute(mode, prop) { this.$refs.diagram.distribute(mode, prop); },
            updateSelectedTab(index) {
                //this.selectedTab = index;
                console.debug(index)
                this.$refs.diagram.repaint();
            },
            load() {
                let self = this;
                axios.get(`${tahitiUrl}/workflows/${this.$route.params.id}`).then(
                    (resp) => {
                        const workflow = resp.data;
                        workflow.tasks = workflow.tasks.sort((a, b) => { console.debug(b.order, a.order); return b.order - a.order; });

                        this.$Progress.start()
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
                                let usingDisabledOp = false;
                                workflow.tasks.forEach((task) => {
                                    let op = self.operationsLookup[task.operation.id];
                                    task.operation = op
                                    task.step = null;
                                    usingDisabledOp |= op.enabled === false;
                                    if (!op.enabled) {
                                        task.warning = self.$t('workflow.usingDisabledOperation');
                                    } else {
                                        task.warning = null;
                                    }
                                    op.forms.sort((a, b) => {
                                        return a.order - b.order;
                                    });
                                });
                                if (usingDisabledOp) {
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
                                });
                                self.workflow = workflow;
                                self._validateTasks(self.workflow.tasks);
                                //this.updateAttributeSuggestion();
                                self.loaded = true;
                                const params = { workflow_id: this.$route.params.id }

                                axios.get(`${standUrl}/jobs/latest`, { params })
                                    .then((resp2 => {
                                        const job = resp2.data;
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
                                                //console.debug(foundTask.id)
                                                //console.debug(result)
                                                foundTask.result = result;
                                            }
                                        });
                                        job.steps.forEach((step) => {
                                            const foundTask = tasks.find((t) => {
                                                return t.id === step.task.id;
                                            });
                                            if (foundTask) {
                                                //console.debug(foundTask.id)
                                                //console.debug(step)
                                                foundTask.step = step;
                                            }
                                        });
                                    })).catch(() => { });
                            }
                        ).catch(function (e) {
                            this.error(e);
                        }.bind(this)).finally(() => {
                            Vue.nextTick(() => {
                                this.$Progress.finish()
                            })
                        });
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

                if (window.hasOwnProperty('TahitiAttributeSuggester')) {
                    if (window.TahitiAttributeSuggester.processed === undefined) {
                        this.updateAttributeSuggestion();
                    }
                    if (this.attributeSuggestion[taskId]) {
                        return this._unique(Array.prototype.concat.apply([],
                            this.attributeSuggestion[taskId].inputs.map(
                                (item) => { return item.attributes; }))).sort(this._caseInsensitiveComparator);
                    } else {
                        return [];
                    }
                }
            },
            updateAttributeSuggestion(callback) {
                const self = this;
                const attributeSuggestion = {};
                try {
                    if (window.TahitiAttributeSuggester) {
                        window.TahitiAttributeSuggester.compute(self.workflow, this._queryDataSource,
                            (result) => {
                                Object.keys(result).forEach(key => {
                                    attributeSuggestion[key] = result[key].uiPorts;
                                });
                                Object.assign(self.attributeSuggestion, attributeSuggestion);
                                window.TahitiAttributeSuggester.processed = true;
                                if (callback) {
                                    callback();
                                }
                            });
                    }
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
                if (this.$refs.workflowPropertiesModal)
                    this.$refs.workflowPropertiesModal.show();
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
                const self = this;
                const d = new Date().toISOString().slice(0, -5);
                this.clusterInfo.jobName = `${d} - ${this.workflow.name}`;
                axios.get(`${standUrl}/clusters?enabled=true`, {})
                    .then((response) => {
                        self.clusters.length = 0;
                        Array.prototype.push.apply(self.clusters, response.data);
                        if (self.clusters.length) {
                            self.clusterInfo.id = self.clusters[0].id;
                            self.clusterInfo.name = self.clusters[0].name;
                            self.clusterInfo.description = self.clusters[0].description;
                            self.$refs.executeModal.show();
                            if (self.name === '') {
                                self.clusterInfo.workflowName = self.workflow.name;
                            }
                        } else {
                            self.error("Unable to execute workflow: There is not cluster available.");
                        }
                    }).catch((ex) => {
                        self.error(ex);
                    });
            },
            execute() {
                const self = this;
                this.saveWorkflow(false).then(() => {
                    self._execute();
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
                    if (t.enabled) {
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
<style>
    .notebook .cell {
        background-color: #fff;
        border: 0px solid #ddd;
        padding: 0;
    }

    .notebook .row {
        margin: 5px 0 0 0;
    }

    .notebook {
        background: #fff;
        height: 80vh;
        overflow: auto;
    }

    .notebook .row>div {
        padding: 10px 5px;
    }

    .notebook .task-name {
        border: none;
        border-bottom: 1px solid #aaa;
        background-color: transparent;
        width: 500px;
        padding: 2px 5px;
    }

    .notebook .operation-name {
        font-size: .7em;
    }

    .w-auto {
        font-size: .8em !important;
        width: auto !important;
    }

    .step-date {
        font-size: .55em;
        color: #555;
    }

    .step-log {
        padding: 0 0 10px 5px;
        border: 1px dashed #ddd;
    }

    .notebook .html-div {
        max-height: 50vh;
        overflow: auto;
        border: 1px dashed #ddd;
        padding: 5px;
    }

    .notebook .image {
        border: 1px dashed #ddd;
    }

    .taskId {
        color: #777;
        padding: 0 1px;
        font-size: .7em;
        text-align: right;
    }

    .switch {
        font-size: .8em
    }
</style>
<style scoped lang="scss">
    div.decor {
        &.completed {
            color: seagreen;

            span {
                /* @extend .fa-check; */
            }
        }

        &.running {
            color: dodgerblue;

            span {
                /* @extend .fa-spin;
                        @extend .fa-refresh; */
                display: block;
                width: 16px;
                height: 16px;
                display: inline-block;
                text-align: center;
            }
        }

        &.interrupted {
            color: black;

            span {
                /* @extend .fa-hand-stop-o; */
            }
        }

        &.canceled {
            color: darkgray;

            span {
                /* @extend .fa-close; */
            }
        }

        &.waiting {
            color: #aaa;

            span {
                /* @extend .fa-clock-o; */
            }
        }

        &.error {
            color: red;

            span {
                /* @extend .fa-warning; */
            }
        }
    }
</style>