<template>
    <div class="row" style="overflow:hidden">
        <TahitiSuggester />
        <div class="col-md-12">
            <diagram-toolbar :workflow="workflow" :disabled="!loaded"></diagram-toolbar>
            <b-tabs @input="updateSelectedTab" ref="formTabs" v-model="selectedTab" nav-class="justify-content-center">
                <b-tab v-for="form of workflow.platform.forms" :title-item-class="'tab-order-' + form.order"
                    :active="form.order === minFormOrder" :key="form.id">
                    <template slot="title">
                        <span class="fa fa-cogs"></span> {{form.name}}
                    </template>
                    <div class="card mt-1" style="min-height: 90vh">
                        <div class="card-body">
                            <WorkflowProperty v-if="loaded" :form="form" :workflow="workflow" :loaded="loaded">
                            </WorkflowProperty>
                        </div>
                    </div>
                </b-tab>
                <b-tab :title="$tc('titles.workflow', 1)" title-item-class="tab-order-5">
                    <div class="row pt-1">
                        <div class="col-md-2">
                            <toolbox :operations="operations"></toolbox>
                        </div>
                        <div class="col-md-10 pl-0 lemonade with-grid" style="position: relative">
                            <diagram :workflow="workflow" ref="diagram" id="main-diagram" :operations="operations"
                                v-if="loaded" :loaded="loaded" :version="workflow.version"></diagram>
                            <slideout-panel :opened="showProperties">
                                <property-window :task="selectedTask.task"
                                    :suggestions="getSuggestions(selectedTask.task.id)" />
                            </slideout-panel>
                        </div>
                        <b-modal id="history" size="lg" :title="$t('common.history')" ok-disabled ref="historyModal">
                            <div class="historyArea">
                                <table class="table table-sm table-striped text-center">
                                    <tr>
                                        <th>{{$tc('common.version')}}</th>
                                        <th>{{$tc('common.date')}}</th>
                                        <th>{{$tc('common.author')}}</th>
                                        <th>{{$tc('common.action')}}</th>
                                    </tr>
                                    <tr v-for="h in history" :key="h.id">
                                        <td>{{h.version}}</td>
                                        <td>{{h.date}}</td>
                                        <td>{{h.user_name}}</td>
                                        <td>
                                            <button class="btn btn-sm btn-danger"
                                                @click="restore(h.version)">{{$t('actions.restore')}}</button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div slot="modal-footer" class="w-100">
                                <b-btn @click="closeHistory" variant="secondary_sm" class="float-right">
                                    {{$t('actions.cancel')}}</b-btn>
                            </div>
                        </b-modal>
                        <b-modal id="executeModal" size="lg" :title="$t('workflow.execute')" ref="executeModal">
                            <div>
                                {{$t('workflow.required')}}:
                            </div>
                            <div class="mt-3">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <label>{{$t('workflow.jobName')}} ({{$t('common.optional')}}):</label>
                                            <input type="text" class="form-control" v-model="clusterInfo.jobName"
                                                maxlength="50" />
                                        </div>
                                        <div class="col-md-6 mt-3">
                                            <label>{{$tc('titles.cluster')}}:</label>
                                            <select v-model="clusterInfo.id" class="form-control"
                                                v-on:change="changeCluster">
                                                <option v-for="option in clusters" v-bind:value="option.id">
                                                    {{ option.name }}
                                                </option>
                                            </select>
                                            <small>{{clusterInfo.description}}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div slot="modal-footer" class="w-100 text-right">
                                <button class="btn btn-success" @click="execute" id="mdl-execute-wf">
                                    <span class="fa fa-play"></span> {{$t('actions.execute')}}</button>
                                <button class="ml-1 btn" @click="cancelExecute">{{$t('actions.cancel')}}</button>
                            </div>
                        </b-modal>
                        </b-modal>
                        <b-modal id="saveAsModal" size="lg" :title="$t('actions.saveAs')" ok-disabled ref="saveAsModal">
                            <b-form-radio-group v-model="saveOption">
                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <b-form-radio name="saveOption" v-model="saveOption" value="new">
                                            {{$t('workflow.newName')}}
                                        </b-form-radio>
                                        <input type="text" maxlength="40" class="form-control"
                                            :disabled="saveOption != 'new'" v-model="newName" />
                                    </div>
                                    <div class="col-md-12 mb-3">
                                        <b-form-radio name="saveOption" v-model="saveOption" value="image">
                                            {{$t('workflow.asImage')}}</b-form-radio>
                                    </div>
                                    <!--
                                    <div class="col-md-12 mb-3">
                                        <b-form-radio name="saveOption" v-model="saveOption" value="template">
                                            {{$t('workflow.asTemplate')}}</b-form-radio>
                                        <p>
                                            <label>Description</label>
                                            <textarea class="form-control" :disabled="saveOption != 'template'"></textarea>
                                        </p>
                                    </div>
                                    -->
                                </div>
                            </b-form-radio-group>
                            <div slot="modal-footer" class="w-100">
                                <b-btn @click="closeSaveAs" variant="secondary_sm" class="float-right">
                                    {{$t('actions.cancel')}}</b-btn>
                                <b-btn @click="okClicked" variant="primary" class="float-right mr-2">{{$t('common.ok')}}
                                </b-btn>
                            </div>
                        </b-modal>
                    </div>
                </b-tab>
                <b-tab :title="$tc('titles.job', 2)" title-item-class="tab-order-6" @click="showJobs">
                    <WorkflowExecution :workflow-id="workflow.id" v-if="showPreviousJobs" />
                </b-tab>

            </b-tabs>
            <b-modal id="taskResultModal" ref="taskResultModal" :title="resultTask.name">
                <p>{{resultTask.step.status}}</p>
                <div v-for="log in resultTask.step.logs" :key="log.id">
                    {{log}}
                </div>
                <div>
                    {{resultTask.result}}
                </div>
            </b-modal>
            <b-modal id="validationErrorsModal" size="lg" ref="validationErrorsModal" :ok-only="true"
                :title="$tc('titles.validationErrors', 1)">
                <p>{{$tc('workflow.validationExplanation', validationErrors.length)}}</p>
                <table class="table table-sm">
                    <tr>
                        <th>{{$tc('titles.tasks')}}</th>
                        <th>{{$tc('titles.value')}}</th>
                        <th>{{$tc('titles.error')}}</th>
                    </tr>
                    <tr v-for="err in validationErrors" :key="err.sequential">
                        <td>{{err.task.name}}</td>
                        <td>{{err.field}}</td>
                        <td>{{err.message}}</td>
                    </tr>
                </table>
            </b-modal>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import DiagramComponent from '../components/Diagram.vue'
    import PropertyWindow from '../components/PropertyWindow.vue'
    import DiagramToolbarComponent from '../components/DiagramToolbar.vue'
    import ToolboxComponent from '../components/Toolbox.vue'
    import SlideOutPanel from '../components/SlideOutPanel.vue'
    import WorkflowProperty from '../components/WorkflowProperty.vue'
    import WorkflowExecution from '../components/WorkflowExecution.vue'
    import html2canvas from 'html2canvas';
    import Notifier from '../mixins/Notifier'

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const standUrl = process.env.VUE_APP_STAND_URL

    // let TahitiAttributeSuggester = undefined;
    export default {
        mixins: [Notifier],
        components: {
            'diagram': DiagramComponent,
            'diagram-toolbar': DiagramToolbarComponent,
            'toolbox': ToolboxComponent,
            'slideout-panel': SlideOutPanel,
            'property-window': PropertyWindow,
            WorkflowProperty,
            WorkflowExecution,
            VuePerfectScrollbar,
            TahitiSuggester: () => {

                let tahitiUrl = process.env.VUE_APP_TAHITI_URL
                return new Promise((resolve, reject) => {
                    let script = document.createElement('script')
                    // script.onload = () => {
                    //     resolve(import('TahitiAttributeSuggester'))
                    // }
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
                    jobName: '',
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
                // propertyStyles: [
                //     {
                //         top: '112px',
                //         height: 'calc(92vh - 112px)'
                //     },
                //     {

                //         backgroundColor: '#fff',
                //         paddingTop: '2rem',
                //         paddingBottom: '1rem',
                //         overflow: 'hidden'
                //     },
                //     {
                //         overflow: 'hidden'
                //     },
                //     {

                //         color: '#555',
                //         textDecoration: 'none',
                //         top: '8px',
                //         right: '1rem'
                //     }
                // ],
            }
        },
        mounted() {
            let self = this
            this.$root.$on('onclick-task', (taskComponent, showProperties) => {
                this.showProperties = showProperties;
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
            this.$root.$on('onsaveas-workflow', this.showSaveAs);
            this.$root.$on('onalign-tasks', this.align);
            this.$root.$on('ontoggle-tasks', this.toggleTasks);
            this.$root.$on('ondistribute-tasks', this.distribute);
            this.$root.$on('onclick-execute', this.showExecuteWindow);

            this.$root.$on('onblur-selection', () => {
                this.showProperties = false;
                this.selectedTask = { task: {} };
            });

            this.$root.$on('update-form-field-value', (field, value) => {
                if (self.selectedTask.task.forms[field.name]) {
                    self.selectedTask.task.forms[field.name].value = value
                } else {
                    self.selectedTask.task.forms[field.name] = { value: value }
                }
                self._validateTasks([self.selectedTask.task]);
                this.isDirty = true;
            });
            this.$root.$on('update-workflow-form-field-value', (field, value) => {
                const self = this;
                if (self.workflow)
                    if (!self.workflow.forms || !(self.workflow.forms instanceof Object)) {
                        self.workflow.forms = {}
                    }
                try {
                    self.workflow.forms[field.name] = { value };
                } catch (e) {
                    console.debug(e)
                }
                this.isDirty = true;
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
                const inx = this.workflow.tasks.findIndex((n, inx, arr) => n.id === task.id);
                if (inx > -1) {
                    this.workflow.tasks.splice(inx, 1);
                    const flows = this.workflow.flows;
                    for (let i = flows.length - 1; i > 0; i--) {
                        if (flows[i].source_id === task.id) {
                            state.workflow.flows.splice(i, 1);
                        }
                    }
                }
                this.isDirty = true;
            });

            this.$root.$on('addFlow', (flow, jsPlumbConn) => {
                flow.id = `${flow.source_id}/${flow.source_port}-${flow.target_id}/${flow.target_port}`;
                this.workflow.flows.push(flow);
                this.isDirty = true;
            });
            this.$root.$on('removeFlow', (flowId) => {
                const self = this;
                const inx = this.workflow.flows.findIndex((n, inx, arr) => {
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
        },
        watch: {
            '$route.params.id': function (id) {
                this.$refs.diagram.clearWorkflow();
                this.load();
            }
        },
        methods: {
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
                        let workflow = resp.data;
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
                                        task.warning = $t('workflow.usingDisabledOperation');
                                    } else {
                                        task.warning = null;
                                    }
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
                                    // form.fields.forEach((field) => {
                                    //     // console.debug("Aqui", workflow.forms[field.name])
                                    //     // workflow.forms[field.name] = workflow.forms[field.name].value ||
                                    //     //     field['default'] || ''
                                    // });
                                });
                                self.workflow = workflow;
                                self._validateTasks(self.workflow.tasks);

                                this.updateAttributeSuggestion();
                                self.loaded = true;
                                self.$nextTick(() => {
                                });
                                const params = { workflow_id: this.$route.params.id }
                                axios.get(`${standUrl}/jobs/latest`, { params })
                                    .then((resp2 => {
                                        const job = resp2.data;
                                        const tasks = self.workflow.tasks;
                                        job.steps.forEach((step, i) => {
                                            const foundTask = tasks.find((t) => {
                                                return t.id === step.task.id;
                                            });
                                            if (foundTask) {
                                                foundTask.step = step;
                                            }
                                        });
                                        job.results.forEach((result, i) => {
                                            const foundTask = tasks.find((t) => {
                                                return t.id === result.task.id;
                                            });
                                            if (foundTask) {
                                                foundTask.result = result;
                                            }
                                        });
                                    })).catch((e) => { });
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
            getSuggestions() {
                if (this.attributeSuggestion && this.selectedTask) {
                    return this.attributeSuggestion[this.selectedTask.task.id]
                } else {
                    return []
                }
            },
            saveAsImage() {
                let self = this
                let $elem = this.$refs.diagram.$el.querySelector('#lemonade-container')
                html2canvas($elem, {
                    width: 3000, height: 3000, logging: false, allowTaint: false,
                    logging: false,
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

                        let ctx = canvas.getContext('2d');
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
                        if (!savingCopy) {
                            let workflow = resp.data.data;
                            workflow.tasks.forEach((task) => {
                                task.operation = self.operationsLookup[task.operation.id]
                            });
                            self.workflow = workflow;
                            self.success(self.$t('messages.savedWithSuccess',
                                { what: self.$tc('titles.workflow') }));
                            self.isDirty = false;
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
                    if (TahitiAttributeSuggester.processed === undefined) {
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
                let self = this;
                let attributeSuggestion = {};
                try {
                    TahitiAttributeSuggester.compute(self.workflow, this._queryDataSource,
                        (result) => {
                            Object.keys(result).forEach(key => {
                                attributeSuggestion[key] = result[key].uiPorts;
                            });
                            Object.assign(self.attributeSuggestion, attributeSuggestion);
                            TahitiAttributeSuggester.processed = true;
                            if (callback) {
                                callback();
                            }
                        });
                } catch (e) {
                    console.log(e);
                }
            },
            showHistory() {
                let self = this;
                let url = `${tahitiUrl}/workflows/history/${this.workflow.id}`
                axios.get(url)
                    .then((resp) => {
                        self.history = resp.data.data
                    })
                    .catch(function (e) {
                        self.error(e);
                    }.bind(this));
                if (this.$refs.historyModal) {
                    this.$refs.historyModal.show();
                }
            },
            closeHistory() {
                this.$refs.historyModal.hide();
            },
            showSaveAs() {
                if (this.$refs.saveAsModal) {
                    this.newName = `${this.$t('workflow.copyOf')} ${this.workflow.name}`;
                    this.$refs.saveAsModal.show();
                }
            },
            okClicked() {
                if (this.saveOption === 'new') {
                    this.saveWorkflow(true, this.newName);
                } else if (this.saveOption === 'image') {
                    this.saveAsImage();
                } else if (this.saveOption === 'template') {
                }
                this.$refs.saveAsModal.hide();
            },
            closeSaveAs() {
                this.$refs.saveAsModal.hide();
            },
            cancelExecute() {
                this.$refs.executeModal.hide();
            },
            changeCluster() {
                const c = this.clusters.find((c) => c.id === this.clusterInfo.id)
                if (c) {
                    this.clusterInfo.description = c.description;
                }
            },
            showExecuteWindow() {
                const self = this;
                if (self._validateTasks(self.workflow.tasks)) {
                    const d = new Date().toLocaleString().slice(0, -5);
                    this.clusterInfo.jobName = `${d} - ${this.workflow.name}`;
                    axios.get(`${standUrl}/clusters`, {})
                        .then((response) => {
                            self.clusters.length = 0;
                            Array.prototype.push.apply(self.clusters, response.data);
                            if (self.clusters.length) {
                                self.clusterInfo.id = self.clusters[0].id;
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
                } else {
                    self.$refs.validationErrorsModal.show();
                }
            },
            execute() {
                const self = this;
                this.saveWorkflow(false).then(() => {
                    self.$refs.executeModal.hide();
                    self._execute();
                });
            },

            _execute() {
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
                                    if (field.enabled) {
                                        if (field.required) {
                                            const value = t.forms[field.name] ? t.forms[field.name].value : null;
                                            if (value === null || value === '' || value === {}) {
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
                if (TahitiAttributeSuggester.cached === undefined) {
                    TahitiAttributeSuggester.cached = {};
                }
                if (TahitiAttributeSuggester.cached[id]) {
                    attributes = TahitiAttributeSuggester.cached[id];
                    callback(attributes);
                } else {
                    let url = `${limoneroUrl}/datasources/${id}`;
                    axios.get(url).then(
                        (response) => {
                            let ds = response.data;
                            attributes = ds.attributes.map(function (attr) { return attr.name });
                            TahitiAttributeSuggester.cached[id] = attributes;
                            callback(attributes);
                        },
                        (error) => {
                            self.warning('At least one data source is invalid in workflow');
                            callback([]);
                        }
                    );
                }
            },
        }
    }
</script>
<style>
    .blackout {
        background-color: rgba(0, 0, 0, 0) !important;
    }

    .historyArea {
        height: 60vh;
        overflow: auto
    }

    .edit-area {
        -ms-flex: 0 0 230px;
        flex: 0 0 230px;
        background-color: greenyellow;
    }

    .sidebar {
        -ms-flex: 0 0 230px;
        flex: 0 0 230px;
        background-color: greenyellow;
        max-width: 250px;
    }
</style>