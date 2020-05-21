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
                <b-btn size="sm mr-1" variant="outline-secondary" @click.prevent="showWorkflowProperties"
                    :title="$t('actions.showProperties')">
                    <span class="fa fa-cogs"></span>
                </b-btn>
                <b-btn size="sm mr-1" variant="outline-secondary" @click.prevent="toggleResults"
                    :title="$t('actions.showResults')">
                    <span class="fa fa-toggle-on" v-if="showResults"></span>
                    <span class="fa fa-toggle-off" v-if="!showResults"></span>
                    {{$t('actions.showResults')}}
                </b-btn>

                <workflow-toolbar v-if="loaded" :workflow="workflow"></workflow-toolbar>
            </div>
        </div>

        <div class="notebook">
            <div class="row" v-for="(task, counter) in workflow.tasks" :key="task.id" @mousedown="selectTask(task)"
                :tabindex="counter + 1">
                <div class="col-md-10 cell offset-1" :class="{'selected-row': task.id === selectedTask.task.id}">
                    <div class="props card xbg-light p1 mb-1">
                        <div class="special card-header"
                            v-bind:style="{borderWidth: '2px', borderColor: task.forms && task.forms.color ? task.forms.color.value.background : 'rgba(0,0,0,.03)'}">
                            <div class="row">
                                <div class="col-md-3"
                                    :class="'decor ' + (task.step? task.step.status.toLowerCase() : 'pending')">
                                    <strong>
                                        [ {{task.display_order}}
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
                                        :title="$tc('notebook.moveDown')"
                                        v-if="task.display_order < workflow.tasks.length" @click.prevent="moveDown">
                                        <span class="fa fa-chevron-circle-down"></span>
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary ml-1"
                                        :title="$tc('notebook.moveUp')" v-if="task.display_order > 1"
                                        @click.prevent="moveUp">
                                        <span class="fa fa-chevron-circle-up"></span>
                                    </button>

                                    <button class="btn btn-sm btn-outline-secondary ml-1"
                                        :title="$tc('notebook.delete')" @click.prevent="removeTask(task)">
                                        <span class="fa fa-trash"></span>
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary ml-1"
                                        :title="$tc('notebook.executeUntil')">
                                        <span class="fa fa-play"></span>
                                    </button>
                                    <a class="btn btn-sm btn-outline-secondary ml-1" :href="'docReferenceUrl'"><span
                                            class="fa fa-question-circle"></span>
                                        {{$t('property.help')}}</a>
                                </div>

                            </div>
                        </div>
                        <!--
                        <div style="display: flex; padding:4px; flex-wrap: wrap; flex-direction: row;">
                            <div class="col">
                                <div class="property">
                                    <label>{{$t('property.taskName')}}</label>
                                    <input type="text" maxlength="50" v-model="task.name" class="form-control" />
                                </div>
                                <div v-for="port in getInputPorts(task)" :key="port.id" class="property">
                                    <label>{{port.name.charAt(0).toUpperCase()}}{{port.name.slice(1)}}</label>
                                    <select class="form-control">
                                        <option></option>
                                    </select>
                                </div>
                            </div>
                            <div class="col" v-for="(form, index) in task.operation.forms" v-bind:key="form.id"
                                :title="form.name" v-if="form.category !== 'appearance'">
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
                        -->
                        <div class="flex-props">
                            <div class="property">
                                <label>{{$t('property.taskName')}}</label>
                                <input type="text" maxlength="50" v-model="task.name" class="form-control" />
                            </div>
                            <div v-for="port in getInputPorts(task)" :key="port.id" class="property">
                                <label>{{port.name.charAt(0).toUpperCase()}}{{port.name.slice(1)}}</label>
                                <div class="input-group">
                                    <select class="form-control">
                                        <template v-for="ifce in port.interfaces">
                                            <option></option>
                                            <option v-for="port in outputPortsByInterface.get(ifce.name)" :key="port.id"
                                                v-if="port[0] !== task.id">
                                                {{port[1].task.name}}
                                            </option>
                                        </template>
                                    </select>
                                    <div class="input-group-append p-0">
                                        <label class="input-group-text p-0 pl-2 pr-2">
                                            <a href="#" click.prevent="scrollToTask()"><span
                                                    class="fa fa-project-diagram" /></a>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <template v-for="(form, index) in task.operation.forms" :title="form.name"
                            v-if="form.category !== 'appearance'">
                            <div class="flex-props">
                                <div v-for="field in form.fields" class="mb-2 property clearfix"
                                    v-bind:key="task.id + field.name" v-if="true || field.enabled"
                                    :data-name="field.name">
                                    <component :is="field.suggested_widget + '-component'" :field="field"
                                        :value="getValue(task, field.name)"
                                        :suggestionEvent="() => getSuggestions(task.id)"
                                        :programmingLanguage="task.operation.slug === 'execute-python'? 'python': (task.operation.slug === 'execute-sql'? 'sql': '') "
                                        :language="$root.$i18n.locale" :type="field.suggested_widget" context="context"
                                        :parentId="task.id">
                                    </component>
                                </div>
                            </div>
                        </template>
                        <div v-if="task.forms.comment">
                            <Markdown :text="task.forms.comment.value"
                                :css-style="{border: '1px dashed #ddd', borderRadius: '5px', background: '#fbfcf0', margin: '5px', padding: '5px'}" />
                        </div>
                        <div class="taskId m-1">{{task.id}}</div>
                    </div>
                </div>
                <transition name="slide-fade">
                    <div class="col-md-10 offset-1" v-if="showResults">
                        <div v-if="latestJob.steps.has(task.id)">
                            <!--
                            <span
                            :class="getClassesForDecor(task.step? task.step.status : 'PENDING')"></span>
                            -->
                            <template v-for="step in latestJob.steps.get(task.id)">
                                <div class="step-log" v-for="log in step.logs" :key="log.id">
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
                            </template>
                        </div>
                    </div>
                </transition>
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
    import stand from '../services/stand.js';
    import WorkflowService from '../services/workflow.js';
    import InputHeader from '../components/InputHeader.vue';

    import ModalSaveWorkflowAs from './modal/ModalSaveWorkflowAs.vue'
    import ModalWorkflowProperties from './modal/ModalWorkflowProperties.vue'
    import ModalTaskResults from './modal/ModalTaskResults.vue'
    import ModalWorkflowHistory from './modal/ModalWorkflowHistory.vue'
    import ModalExecuteWorkflow from './modal/ModalExecuteWorkflow.vue'

    import Notifier from '../mixins/Notifier';
    import Vue from 'vue';
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';

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
    import Markdown from '../components/widgets/Markdown.vue'

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const standUrl = process.env.VUE_APP_STAND_URL

    export default {
        mixins: [Notifier],
        components: {

            'workflow-toolbar': WorkflowToolbar,

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
            VuePerfectScrollbar,
            InputHeader,
            Markdown,
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

                newName: '',
                operations: [],
                operationsLookup: new Map(),

                resultTask: { step: {} },
                saveOption: 'new',
                selectedTask: { task: { operation: {} } },
                showResults: true,

                validationErrors: [],
                workflow: { tasks: [], flows: [], platform: {} },

                atmosphereExtension: false,
                performanceModel: {
                    cores: null,
                    setup: null
                },
                busEvents: [], // turn on/off bus events
                latestJob: { steps: new Map(), results: new Map() }, // latest job execution
                inputPortsByInterface: new Map(),
                outputPortsByInterface: new Map(),
            }
        },
        created() {
            window.addEventListener('beforeunload', this.leaving)
        },
        mounted() {
            const self = this

            //self.updateAttributeSuggestion();
            this.on('on-error', this.error);
            this.on('onsave-as-image', this.saveAsImage);
            this.on('onsave-workflow', () => this.saveWorkflow(false));
            this.on('onsave-workflow-as', (saveOption, newName) => {
                if (saveOption === 'new') {
                    this.saveWorkflow(true, newName);
                } else if (saveOption === 'image') {
                    this.saveAsImage();
                }
            });
            // Modal
            this.on('onsaveas-workflow', this.showSaveAs);
            this.on('onupdate-workflow-properties', this.saveWorkflowProperties);
            this.on('onrestore-workflow', this.restore);
            this.on('onchange-cluster', this.changeCluster);
            this.on('onexecute-workflow', this.execute);


            this.on('onclick-export', () => WorkflowService().exportWorkflow(this.workflow));
            this.on('onclick-execute', this.showExecuteWindow);
            this.on('onset-isDirty', this.setIsDirty);

            this.on('update-form-field-value', (field, value, labelValue) => {
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
            this.on('update-workflow-form-field-value', (field, value, labelValue) => {
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
            this.on('addTask', (task) => {
                task.step = null;
                this.workflow.tasks.push(task);
                this.isDirty = true;
            });
            this.on('addFlow', (flow, jsPlumbConn) => {
                flow.id = `${flow.source_id}/${flow.source_port}-${flow.target_id}/${flow.target_port}`;
                this.workflow.flows.push(flow);
                this.isDirty = true;
            });
            this.on('removeFlow', (flowId) => {
                const inx = this.workflow.flows.findIndex((n) => {
                    const id = `${n.source_id}/${n.source_port}-${n.target_id}/${n.target_port}`;
                    return id === flowId;
                });
                if (inx > -1) {
                    this.workflow.flows.splice(inx, 1);
                }
                this.isDirty = true;
            });
            this.on('onshow-history', this.showHistory);
            this.on('onshow-result', this.showTaskResult);
            self.getLatestJob(this.$route.params.id);
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
            const self = this;
            self.busEvents.forEach(event => { self.$root.$off(event); })
            window.removeEventListener('beforeunload', this.leaving)
        },
        watch: {
            '$route.params.id': function (id) {
                this.$refs.diagram.clearWorkflow();
                this.load(id);
            }
        },
        methods: {
            scrollToTask(){

            },
            moveUp() {
                const selected = this.selectedTask.task;
                if (selected && selected.display_order > 1) {
                    selected.display_order--;
                    this.workflow.tasks.some((task, inx) => {
                        if (task != selected && task.display_order === selected.display_order) {
                            task.display_order++;
                            const moved = this.workflow.tasks.splice(inx, 1); // remove item from old location
                            this.workflow.tasks.splice(inx + 1, 0, moved[0]) // reinsert it at new location
                            return true;
                        }
                        return false;
                    });
                }
            },
            moveDown() {
                const selected = this.selectedTask.task;
                if (selected && selected.display_order < this.workflow.tasks.length) {
                    selected.display_order++;
                    this.workflow.tasks.some((task, inx) => {
                        if (task != selected && task.display_order === selected.display_order) {
                            task.display_order--;
                            const moved = this.workflow.tasks.splice(inx, 1); // remove item from old location
                            this.workflow.tasks.splice(inx - 1, 0, moved[0]) // reinsert it at new location
                            return true;
                        }
                        return false;
                    });
                }
            },
            fillPortsByInterface() {
                const self = this;
                self.workflow.tasks.forEach(task => {
                    task.operation.ports.forEach(port => {
                        port.interfaces.forEach(ifce => {
                            let ports = [];
                            if (port.type === 'INPUT') {
                                ports = self.inputPortsByInterface;
                            } else if (port.type === 'OUTPUT') {
                                ports = self.outputPortsByInterface;
                            }
                            if (!ports.has(ifce.name)) {
                                ports.set(ifce.name, new Map());
                            }
                            ports.get(ifce.name).set(task.id, { task, portId: port.id });
                        });
                    });
                });
            },
            on(event, action) {
                this.busEvents.push(event);
                this.$root.$on(event, action);
            },
            getLatestJob(workflowId) {
                const self = this;
                stand.getLatestJob(workflowId)
                    .then(result => { self.latestJob = result })
                    .catch(error => { console.debug("Not found") });
            },
            selectTask(task) {
                this.selectedTask = { task };
            },
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
            align(prop, fn) {
                this.$refs.diagram.align(prop, fn);
            },
            load() {
                let self = this;
                axios.get(`${tahitiUrl}/workflows/${this.$route.params.id}`).then(
                    (resp) => {
                        const workflow = resp.data;
                        workflow.tasks = workflow.tasks.sort((a, b) => { return a.display_order - b.display_order; });

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
                                self.fillPortsByInterface();
                                self.loaded = true;
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
            _generateId() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
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
            getSuggestions(taskcomputeId) {
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
            removeTask(task) {
                const inx = this.workflow.tasks.findIndex((n) => n.id === task.id);
                if (inx > -1) {
                    this.workflow.tasks.splice(inx, 1);
                    const flows = this.workflow.flows;
                    const flowCount = flows.length;
                    for (let i = flowCount - 1; i >= 0; i--) {
                        if (flows[i].source_id === task.id || flows[i].target_id === task.id) {
                            flows.splice(i, 1);
                        }
                    }
                }
                this.isDirty = true;
            },
            toggleResults() {
                this.showResults = !this.showResults;
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
        height: 92vh;
        overflow: auto;
        zoom: 90%;
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

    .flex-props {
        align-items: top;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        padding: 2px 4px;
    }

    div.property {
        flex-grow: 1;
        flex: 1 1 20%;
        margin: 0 15px 5px 5px !important;
        border: 0px dashed green;
    }

    div.selected-row {
        box-shadow: inset 0px 0px 20px 20px #dfe9f2;
    }

    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter,
    .slide-fade-leave-to
        {
            line-height: 0;
    }
</style>