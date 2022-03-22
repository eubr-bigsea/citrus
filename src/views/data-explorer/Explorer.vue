<template>
    <div>
        <TahitiSuggester />
        <div class="row">
            <div class="col noselect step-list p-1">
                <div class="p-2">
                    <h6>{{$t('dataExplorer.title')}}</h6>
                    <div>
                        <small>{{$tc('common.name')}}</small>
                        <input type="text" class="form-control form-control-sm" v-model="workflowObj.name"
                            maxlength="50" />
                    </div>
                    <div class="mb-">
                        <small>{{$tc('titles.cluster')}}</small>
                        <v-select :options="clusters" v-model="clusterId" label="name" :reduce="(opt) => opt.id"
                            :taggable="false" :close-on-select="true" :filterable="false">
                            <template #option="{ description, id, name, type }">
                                {{ name }}<br />
                                <small><em>{{ description }}</em></small>
                            </template>
                        </v-select>
                    </div>
                    <b-dropdown class="more-actions mr-1 mt-1 border rounded" size="sm" variant="btn" split>
                        <template #button-content>
                            <input type="checkbox" @change="handleSelectAll($event)" />
                        </template>
                        <b-dropdown-item @click="handleToggleSelected(true)">{{$t('dataExplorer.enableSelected')}}
                        </b-dropdown-item>
                        <b-dropdown-item @click="handleToggleSelected(false)">{{$t('dataExplorer.disableSelected')}}
                        </b-dropdown-item>
                        <b-dropdown-item @click="handleRemoveSelected">{{$t('dataExplorer.removeSelected')}}
                        </b-dropdown-item>
                    </b-dropdown>
                    <!-- FIXME 
                    <b-dropdown :disabled="false && loadingData" variant="secondary" size="sm"
                        class="float-right mt-2 ml-1" @click="saveWorkflow">
                        <template #button-content>
                            <span class="fa fa-cog"></span>
                        </template>
                        <b-dropdown-item href="#" @click.prevent="handleExport">
                            {{$tc('actions.export')}} ...
                        </b-dropdown-item>
                    </b-dropdown>
                    -->
                    <b-button :disabled="loadingData" variant="primary" size="sm" class="float-right mt-2"
                        @click="saveWorkflow"><span class="fa fa-save"></span> {{$t('actions.save')}}
                    </b-button>
                    <b-button :disabled="false && loadingData" size="sm" variant="outline-secondary"
                        class="float-right mt-2 mr-1" @click="loadData">
                        <span class="fa fa-redo"></span> {{$t('actions.refresh')}}
                    </b-button>
                    <!--
                    <b-button @click="loadingData = !loadingData" class="btn btn-sm">OK</b-button>
                -->
                </div>
                <!-- Steps -->
                <div v-if="workflowObj" class="clearfix mt-2">
                    <div id="step-container">
                        <div class="step-scroll-area scroll-area" style="overflow-y: auto;">
                            <draggable @start="drag=true" @end="endSortSteps" class="list-group" ghost-class="ghost"
                                handle=".step-drag-handle" :list="workflowObj.tasks" :move="handleStepDrag">
                                <div v-for="task, inx in workflowObj.tasks" :key="task.id"
                                    xv-if="task.operation.slug !== 'read-data'"
                                    class="list-group-item steps clearfix p-0" :title="task.name"
                                    :style="{'border-left': '4px solid ' + task.backgroundColor}">
                                    <step :step="task" :language="language" :attributes="tableData.attributes"
                                        :index="inx" @toggle="task.enabled = !task.enabled; isDirty=true"
                                        :protected="inx <=1 "
                                        :schema="inx > 0 && workflowObj.schema ? workflowObj.schema[inx - 1] : null"
                                        @delete="workflowObj.deleteTask(task)" @update="updateStep"
                                        @previewUntilHere="previewUntilHere(task)" @duplicate="duplicate"
                                        :suggestionEvent="() => getSuggestions(task.id)" />
                                </div>
                            </draggable>
                        </div>
                    </div>
                    <div class="text-secondary">
                        <small>{{jobStatus}} (p. {{page}})</small>
                        <br />
                        <small class="text-info" v-if="loadedDataSize > 1">
                            {{$tc('common.pagerShowing', 0,
                            {from: 1,
                            to: Math.min(pageSize * page, tableData.total), count: tableData.total
                            })}}.</small>
                    </div>
                </div>
            </div>
            <!-- Preview area -->
            <div class="col border-left fill-height mt-3">
                <PreviewMenu :selected="selected" @select="performAction" :menus="menus" />
                <preview :attributes="tableData.attributes" :items="rows" :missing="tableData.missing"
                    :invalid="tableData.invalid" :loading="loadingData" :total="tableData.total" @select="select"
                    @drop="performAction" @context-menu="handleContextMenu" ref="preview" @scroll="handleScroll" />
            </div>

            <ModalExport v-if="!loadingData" ref="modalExport" :name="workflowObj.name" @ok="handleExport" />

        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import jsep from 'jsep';
    import io from 'socket.io-client';
    import axios from 'axios';
    import { debounce } from '../../util';
    import draggable from 'vuedraggable';
    import Preview from './Preview';
    import PreviewMenu from './PreviewMenu';
    import Step from './Step';
    import Notifier from '../../mixins/Notifier.js';
    import contextMenu from 'vue-context-menu';
    import { Workflow, Platform, Operation, OperationList, Task, Constants } from './entities.js'
    import ModalExport from './ModalExport.vue';

    jsep.addBinaryOp(">=", 1);
    jsep.removeBinaryOp('^');
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const standUrl = process.env.VUE_APP_STAND_URL
    const standNamespace = process.env.VUE_APP_STAND_NAMESPACE;

    const META_PLATFORM_ID = 1000;
    const PAGE_SIZE = 100;
    const WORKFLOW_OFFSET = 800000;

    export default {
        name: "DataExplorer",
        mixins: [Notifier],
        components: {
            Preview, draggable,
            contextMenu, Step, PreviewMenu, ModalExport,
            TahitiSuggester: () => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.setAttribute('id', 'tahiti-script');
                    script.async = true;
                    document.head.appendChild(script)
                })
            }
        },
        props: {
            //attributes: { type: Array, default: () => [] },
            //items: { type: Array },
            //workflowId: { type: Number },
        },
        data() {
            return {
                attributeSelection: [], // used to select attributes
                clusters: [],
                clusterId: null,
                dataSource: {}, // current data source
                dataSourceLabel: null,
                dataTypes: Constants.DATA_TYPES,
                internalWorkflowId: null, // workflow id
                isDirty: false,  //check if workflow is dirty before leaving page
                job: null,  //last job details
                jobStatus: null,
                language: this.$store.getters.user.locale,
                loadingData: true,  //data loading state
                operations: [],
                operationLookup: new Map(),
                schemas: {},
                selected: { field: {} }, // selected attribute in table preview
                socket: null, // used by socketio (web sockets)

                tableData: { attributes: [] }, // data used to render preview table
                workflowObj: { cluster: null },
                //
                menus: [],
                attributeSuggestion: {},
                loadedDataSize: 0,
                page: 1,
                pageSize: PAGE_SIZE,
                rows: []
            }
        },
        beforeRouteLeave(to, from, next) {
            if (!this.isDirty || (confirm(this.$tc('warnings.dirtyCheck')))) {
                next();
            }
        },
        async mounted() {
            this.internalWorkflowId = (this.$route) ? this.$route.params.id : 0;

            const job_id = WORKFLOW_OFFSET + parseInt(this.internalWorkflowId);
            this.job = { id: job_id }

            await this.loadClusters();
            await this.loadOperations();
            await this.loadWorkflow();

            this.connectWebSocket();
            await this.loadData();
        },
        beforeDestroy() {
            this.disconnectWebSocket();
        },
        methods: {
            /**/
            handleScroll: debounce(function (el) {
                if ((el.srcElement.offsetHeight + el.srcElement.scrollTop) >= el.srcElement.scrollHeight) {
                    if (this.loadedDataSize < this.tableData?.total) {
                        if (this.socket) {
                            const workflow_id = this.workflowObj.id;
                            const job_id = WORKFLOW_OFFSET + parseInt(workflow_id);
                            // Get the last visible and enabled task
                            const task_id = [... this.workflowObj.tasks].reverse().find(
                                task => task.enabled && task.previewable)['id'];
                            this.socket.emit("more data", {
                                workflow_id, job_id, room: `${job_id}`, task_id,
                                size: PAGE_SIZE, page: this.page + 1, type: "more data",
                            });
                            this.loadingData = true;
                        }
                    }
                }
            }, 500),
            /* Data loading */
            async loadWorkflow() {
                const self = this;
                self.loadingData = true;
                this.$Progress.start()
                try {
                    const resp = await axios.get(`${tahitiUrl}/workflows/${this.internalWorkflowId}?type=DATA_EXPLORER`);
                    const workflow = resp.data;
                    workflow.tasks = workflow.tasks.sort(
                        (a, b) => { return a.display_order - b.display_order; });
                    workflow.tasks.forEach(t => {
                        t.operation = self.operationLookup.get(t.operation.id)
                    });

                    const user = this.$store.getters.user;
                    workflow.user_id = user.id;
                    workflow.user_login = user.login;
                    workflow.user_name = user.name;
                    this.workflowObj = new Workflow(workflow);
                    if (this.clusters && this.clusters.length && !this.workflowObj.preferred_cluster_id) {
                        this.workflowObj.preferred_cluster_id = this.clusters[0].id;
                    }
                    this.clusterId = this.workflowObj.preferred_cluster_id;

                    this.workflowObj.tasks.forEach((task, inx) => {
                        task.previewable = task?.forms?.$meta?.value?.previewable != false;
                    });

                    //To be compatible:
                    // 1 - First task must be data reader
                    // 2 - Second task must be a sample
                    // 3 - Last task must emit samples
                    // 4 - No output can be used more than once (?)
                    // 5 - Only some operations are supported
                    const readerTask = workflow.tasks[0]; //workflow.tasks.find(t => t.operation.slug === 'read-data');
                    const sampleTask = workflow.tasks[1];
                    this.dataSourceLabel = `${readerTask.forms.data_source.value} - ${readerTask.forms.data_source.labelValue}`

                    const hasUnsupported = workflow.platform.slug !== 'meta' //tasks.some((t) => !SUPPORTED_OPERATIONS.includes(t.operation.slug));
                    if (hasUnsupported || readerTask?.operation?.slug !== 'read-data') {
                        self.error({ message: 'FIXME: Invalid workflow. It is not compatible with data explorer format.' });
                        self.$router.push({ name: 'index-explorer' })
                        return;
                    }
                    if (sampleTask?.operation?.slug !== 'sample') {
                        const op = this.operationLookup.get(2110) // FIXME;
                        const sample = Workflow.createSampleTask(1, op, this.$tc);
                        self.warning('FIXME: Invalid workflow. Tried to fix it.');
                        this.workflowObj.tasks.splice(1, 0, sample);
                    }
                    self.loadingData = false;
                    document.getElementById('tahiti-script').setAttribute(
                        'src', `${tahitiUrl}/public/js/tahiti.js?platform=${this.workflowObj.platform.id}`);

                } catch (e) {
                    console.debug(e)
                    self.error(e);
                    self.$router.push({ name: 'index-explorer' })
                } finally {
                    Vue.nextTick(() => {
                        this.$Progress.finish();
                        this.loadingData = false;
                        this.isDirty = false;
                    });
                }
                //self.loadData();
            },
            async loadData() {
                const self = this;
                self.loadingData = true;
                const cloned = JSON.parse(JSON.stringify(this.workflowObj));
                cloned.platform_id = cloned.platform.id; //FIXME: review
                cloned.preferred_cluster_id = self.clusterId;

                const enableTasksForPreview = []
                cloned.tasks.forEach((task) => {
                    if (task.enabled && task.previewable) {
                        // Remove unnecessary attributes from operation
                        task.operation = { id: task.operation.id };
                        delete task.version;
                        enableTasksForPreview.push(task);
                    }
                });
                cloned.tasks = enableTasksForPreview;
                const body = {
                    workflow: cloned,
                    cluster: { id: 1 }, //FIXME: How to determine the cluster?
                    name: `## explorer ${self.workflowObj.id} ##`,
                    user: this.$store.getters.user, //: { id: user.id, login: user.login, name: user.name },
                    persist: false, // do not save the job in db.
                    app_configs: { verbosity: 0, sample_size: PAGE_SIZE, sample_page: 1, target_platform: 'scikit-learn' },
                }
                //console.debug(new Date());

                try {
                    const response = await axios.post(`${standUrl}/jobs`, body,
                        { headers: { 'Locale': self.$root.$i18n.locale, } })
                    self.job = response.data.data;
                    self.page = 1;
                    self.connectWebSocket();
                } catch (ex) {
                    if (ex.data) {
                        self.error(ex.data.message);
                    } else if (ex.status === 0) {
                        self.$root.$refs.toastr.e(`Error connecting to the backend (connection refused).`);
                    } else {
                        self.error(`Unhandled error: ${JSON.stringify(ex)}`);
                    }
                } finally {
                    self.$Progress.finish();
                }
            },
            async loadClusters() {
                try {
                    const resp = await axios.get(`${standUrl}/clusters?enable=true&fields=id,name,description,type,platforms`);
                    this.clusters = resp.data.data;
                } catch (e) {
                    this.error(e);
                }
            },
            async loadOperations() {
                const self = this
                // Platform is always META_OPERATION_ID
                try {
                    const resp = await axios.get(`${tahitiUrl}/operations?platform=${META_PLATFORM_ID}`);
                    const operations = resp.data.data;
                    const menuCategories = new Map();
                    this.operations = operations;
                    operations.forEach(op => {
                        const dataType = op.categories.find(c => c.type === 'data-type');
                        op.dataType = (dataType) ? dataType.name : 'all'; //FIXME
                        const menu = op.categories.find(c => c.type.substring(0, 4) === 'menu');

                        if (menu) {
                            if (!menuCategories.has(menu.id)) {
                                menuCategories.set(menu.id, { operations: [op], menu });
                            } else {
                                menuCategories.get(menu.id).operations.push(op);
                            }
                        }
                        self.operationLookup.set(op.id, new Operation(op));
                    });

                    this.menus = Array.from(menuCategories.values()).sort((a, b) => a.menu.order - b.menu.order);
                    this.menus.forEach(menu => {
                        menu.operations.sort((a, b) => a.id - b.id);
                        // type contains 3 parts: menu/enableCondition/icon
                        const parts = menu.menu.type.split('/');
                        menu.enableCondition = parts[1];
                        menu.icon = parts[2];
                    });

                } catch (e) {
                    this.error(e);
                }

            },

            handleStepDrag(e) {
                // Disable some steps to be dragged
                return (e?.relatedContext?.element?.display_order > 1);
            },
            /* Step group actions */
            handleSelectAll(ev) {
                this.workflowObj.tasks.forEach((task) => {
                    task.selected = (task.display_order > 1) && ev.target.checked;
                })
            },
            handleToggleSelected(value) {
                this.workflowObj.tasks.forEach((task) => {
                    task.enabled = (task.selected && value) || (task.display_order <= 1);
                    this.isDirty = true;
                })
            },
            handleRemoveSelected() {
                this.confirm(
                    this.$t('actions.delete'), this.$t('dataExplorer.doYouWantToDeleteStep'),
                    () => {
                        this.workflowObj.tasks.forEach((task) => {
                            if (task.display_order > 1 && task.selected) {
                                this.workflowObj.deleteTask(task);
                                this.isDirty = true;
                            }
                        })
                    }
                );
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
            updateAttributeSuggestion() {
                const self = this;
                let attributeSuggestion = {};
                try {
                    // Add sequential flows to compute attribute suggestion
                    const clonedWorkflow = JSON.parse(JSON.stringify(self.workflowObj));
                    clonedWorkflow.flows = [];
                    clonedWorkflow.tasks = clonedWorkflow.tasks.sort((a, b) => a.display_order - b.display_order);
                    let task = clonedWorkflow.tasks[0];
                    for (let i = 1; i < clonedWorkflow.tasks.length; i++) {
                        clonedWorkflow.flows.push({
                            source_id: task.id,
                            target_id: clonedWorkflow.tasks[i].id
                        });
                        task = clonedWorkflow.tasks[i];
                    }
                    window.TahitiAttributeSuggester.compute(clonedWorkflow, this._queryDataSource,
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
            _unique(data) {
                return Array.from(new Set(data))
            },
            getSuggestions(taskId) {
                const extendedSuggestions = this.getExtendedSuggestions(taskId);
                return extendedSuggestions;
                /*
                if (extendedSuggestions && extendedSuggestions.inputs?.length) {
                    return this._unique(Array.prototype.concat.apply([],
                        extendedSuggestions.inputs.map(
                            (item) => { return item.attributes; }))).sort(this._caseInsensitiveComparator);
                } else {
                    return [];
                }
                */
            },
            getExtendedSuggestions(taskId) {
                const allSuggestions = new Set();
                const self = this;
                if (window.hasOwnProperty('TahitiAttributeSuggester')) {
                    if (window.TahitiAttributeSuggester.processed === undefined
                        || this.attributeSuggestion[taskId] === undefined
                        || this.attributeSuggestion[taskId].length === 0) {
                        this.updateAttributeSuggestion();
                    }
                    Object.keys(this.attributeSuggestion).forEach(key => {
                        self.attributeSuggestion[key] && 
                            self.attributeSuggestion[key].output.forEach(v => allSuggestions.add(v));
                    });
                    Object.keys(this.schemas).forEach(key => {
                        self.schemas[key] && 
                            self.schemas[key].forEach(v => allSuggestions.add(v.name));
                    });
                    /*if (this.attributeSuggestion[taskId]) {
                        return this.attributeSuggestion[taskId];
                    } else {
                        return [];
                    }*/
                    return Array.from(allSuggestions).sort(this._caseInsensitiveComparator);
                }
            },
            /* Trigged by the step action */
            duplicate(step) {
                // Clone tasks instance
                const cloned = new Task(JSON.parse(JSON.stringify(step)));
                cloned.id = Operation.generateTaskId();
                this.workflowObj.tasks.splice(step.display_order, 0, cloned);
                // Update the display_order
                this.workflowObj.tasks.slice(step.display_order + 1).forEach(
                    (task) => task.display_order++);
                this.isDirty = true;
            },
            previewUntilHere(step) {
                this.workflowObj.tasks.forEach((task) => {
                    const previewable = (task.display_order <= step.display_order);
                    task.previewable = previewable;
                    if (task.forms?.$meta?.value) {
                        task.forms.$meta.value.previewable = previewable;
                    } else {
                        task.forms.$meta = { value: { previewable } };
                    }
                });
                this.isDirty = true;
            },
            updateStep(step) {
                const task = this.workflowObj.tasks.find(t => t.id === step.id);
                if (task) {
                    Object.assign(task.forms, step.forms);
                }
                this.updateAttributeSuggestion();
                this.loadData();
            },

            resetMenuData() {
                this.selected = { field: {} };
                this.$refs.preview.resetMenuData();
            },
            select(attr) {
                this.selected = attr;
            },

            //
            saveWorkflow() {
                let self = this
                let cloned = JSON.parse(JSON.stringify(self.workflowObj));
                let url = `${tahitiUrl}/workflows`;
                let method = 'post'

                if (cloned.id !== 0) {
                    url = `${url}/${cloned.id}`;
                    method = 'patch'
                }
                cloned.preferred_cluster_id = self.clusterId;
                cloned.platform_id = META_PLATFORM_ID;
                cloned.tasks.forEach((task) => {
                    task.operation = { id: task.operation.id };
                    delete task.version;
                    delete task.step;
                    delete task.status;
                });
                return axios[method](url, cloned, { headers: { 'Content-Type': 'application/json' } }).then(
                    (resp) => {
                        self.isDirty = false;
                        self.success(self.$t('messages.savedWithSuccess',
                            { what: self.$tc('titles.workflow') }));
                    }
                ).catch(function (e) {
                    this.error(e);
                }.bind(this));
            },

            /* Handle Preview component context menu event */
            handleContextMenu(action, attributeName, operator, attributeValue) {
                //Formula using JSep syntax (https://ericsmekens.github.io/jsep/)
                let op = null;
                let expression = null;
                let alias = attributeName;

                if (action === 'filter') {
                    op = this.operations.find(op => op.slug === 'filter');
                    expression = `${attributeName} ${operator} ${attributeValue}`;
                } else if (action === 'filterNull') {
                    op = this.operations.find(op => op.slug === 'filter');
                    const f = operator === '!' ? 'isnotnull' : 'isnull';
                    expression = `${f}(${attributeName}) `;
                } else if (action === 'flag') {
                    op = this.operations.find(op => op.slug === 'add-by-formula');
                    if (operator == '==' || operator == '!=') {
                        expression = `${attributeName} ${operator} ${attributeValue}`;
                    } else {
                        const f = operator === '!' ? 'isnotnull' : 'isnull';
                        expression = `${f}(${attributeName}) `;
                    }
                    alias = `${attributeName}_flag`;
                } else if (action === 'clean') {
                    op = this.operations.find(op => op.slug === 'add-by-formula');
                    expression = `when(${attributeName} == ${attributeValue}, null, ${attributeName})`;
                }

                const formula = { alias, expression };
                formula['tree'] = jsep(expression);
                this.performAction({
                    action: 'menu',
                    fields: { formula: { value: [formula] } },
                    params: [op], 'selected': attributeName,
                });
            },
            /* Handle Preview component menu clicks */
            performAction(options) {
                if (options.action === 'export') {
                    this.$refs.modalExport.show();
                } else if (options.action === 'menu') {
                    this.workflowObj.addTask(this.operationLookup.get(options.params[0].id),
                        options.selected, options.fields);
                    this.isDirty = true;
                    this.loadData();
                } else {
                    console.log(`Unknown action: ${options.action}`);
                }
            },
            /* to be removed*/
            dateTruncate(attributeName) {
                const modal = this.$refs.simpleInput;
                const modalConfig =
                {
                    format: 'options',
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informFormat'),
                    title: this.$t('actions.formatDate'),
                    options: [
                        { value: 'YEAR', text: this.$tc('common.periods.year') },
                        { value: 'MONTH', text: this.$tc('common.periods.month') },
                        { value: 'DAY', text: this.$tc('common.periods.day') },
                        { value: 'HOUR', text: this.$tc('common.periods.hour') },
                        { value: 'MINUTE', text: this.$tc('common.periods.minute') },
                        { value: 'SECOND', text: this.$tc('common.periods.seconds') },
                        { value: 'WEEK', text: this.$tc('common.periods.week') },
                        //maybe quarter
                    ],
                    value: null,
                    ok: () => {
                        this.store.transformWithFunction(
                            attributeName,
                            this.selected.field.position,
                            ['dateTruncate', 'date_trunc', attributeName, `'${modal.value}'`]);
                    }
                };
                modal.show(modalConfig);
            },
            disconnectWebSocket() {
                if (this.socket) {
                    this.socket.emit('leave', { room: this.job.id });
                    this.socket.close();
                }
            },
            endSortSteps({ originalEvent }) {
                let elem = null;
                this.workflowObj.tasks.forEach((task, i) => {
                    task.display_order = i;
                    if (task.previewable) {
                        elem = task;
                        return false
                    }
                })
                this.isDirty = true;
                this.previewUntilHere(elem);
                this.loadData();
            },
            handleExport({ newName, exportDisabled, platform }) {

                const cloned = JSON.parse(JSON.stringify(this.workflowObj));
                cloned.platform_id = META_PLATFORM_ID;

                if (!exportDisabled) {
                    cloned.tasks = cloned.tasks.filter((t) => t.enabled);
                }
                cloned.tasks.forEach((task) => {
                    task.operation = { id: task.operation.id };
                    delete task.version;
                    delete task.step;
                    delete task.status;
                });
                const workflow_id = this.workflowObj.id;
                const job_id = WORKFLOW_OFFSET + parseInt(workflow_id);

                this.socket.emit("export", {
                    workflow_id, job_id, room: `${job_id}`,
                    app_id: workflow_id,
                    format: 'JSON',
                    ticket: new Date().getTime(),
                    target_platform: platform, name: newName,
                    app_configs: { persist: false },
                    workflow: cloned,
                    type: "export",
                });
                this.info('Exportando o fluxo de trabalho. Quando a exportação terminar, você será notificado.', 10000);
            },
            /* WebSocket Handling */
            connectWebSocket() {
                const self = this;
                if (self.socket === null) {
                    const socket = io(standNamespace, { upgrade: true, });
                    self.socket = socket;

                    socket.on('connect', () => { socket.emit('join', { cached: false, room: self.job.id }); });

                    socket.on('exported result', (msg) => {
                        console.debug(msg)
                    });
                    socket.on('update task', (msg, callback) => {

                        // Meta add a suffix to task id when converting tasks to other platform.
                        const task = self.workflowObj.getTaskById(msg.id.substring(0, 36));
                        if (task) {
                            task.error = (msg.status === 'ERROR') ? msg.message : '';
                        }

                        if (msg.type === 'OBJECT') {
                            if (msg.meaning === 'sample') {
                                //console.debug(new Date());
                                // Update must be done before assigning to observable self.tableData!
                                const messageJson = msg.message;
                                const truncated = messageJson.truncated || [];
                                messageJson.attributes.forEach((attr, index) => {
                                    attr['selected'] = true;
                                    attr['truncated'] = truncated.indexOf(attr.key) > -1;
                                    attr['position'] = index;
                                });

                                const attributeIds = messageJson.attributes.map(attr => attr.key);
                                const mapped = messageJson.rows.map(
                                    row => Object.assign(...attributeIds.map((attr, i) => { return { [attr]: row[i] } })));


                                if (messageJson.page === 1) {
                                    self.tableData = messageJson;
                                    // Update selected attribute (may have its time changed during processing)
                                    const selected = self.tableData.attributes.find(t => t?.key === self.selected.column)
                                    if (selected) {
                                        self.select({ field: selected, column: selected.key, label: selected.key })
                                    }
                                    self.rows = mapped;
                                    self.page = 1;
                                    self.loadedDataSize = messageJson.size;
                                } else if (messageJson.page === self.page + 1 && mapped.length > 0) {
                                    self.rows.push.apply(self.rows, mapped);
                                    self.page = messageJson.page;
                                    self.loadedDataSize += Math.min(self.tableData.size, mapped.length);
                                    self.loadingData = false;
                                } else {
                                    self.loadingData = false;
                                }
                                //console.debug(new Date());
                            } else if (msg.meaning === 'schema') {
                                self.schemas[msg.id] = msg.message;
                                /*
                                const task = self.workflowObj.tasks.find(t => t.id == msg.id)
                                if (task) {
                                    task.forms.$meta = (task.forms.$meta || { value })['value']['schema'] = self.schemas[msg.id];
                                }
                                */
                            }
                        }
                    });
                    socket.on('update job', msg => {
                        self.jobStatus = '';
                        if (msg.status === 'ERROR') {
                            self.error(msg);
                            self.loadingData = false;
                        }
                        if (msg.status === 'COMPLETED') {
                            self.jobStatus = msg.message;
                            self.loadingData = false;
                        }
                    });
                } else {
                    //self.socket.emit('join', { room: self.job.id });
                }
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

    .steps {
        border-radius: 0 !important;
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
    }

    #step-scroll {
        position: relative;
        margin: auto;
        height: 60vh;
    }

    .fill-height {
        height: 75vh
    }

    .step-list {
        -ms-flex: 0 0 305px;
        flex: 0 0 305px;
    }

    .step-scroll-area {
        width: 300px;
        height: 64vh;
    }
</style>