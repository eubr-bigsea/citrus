<template>
    <div>
        <TahitiSuggester />
        <div class="row">
            <div class="col noselect step-list p-1">
                <div class="p-2">
                    <div class="title">
                        <h5>{{$t('dataExplorer.title')}}</h5>
                    </div>
                    <div class="mb-2">
                        <small>{{$tc('titles.cluster')}}:</small>
                        {{clusterId}}
                        <v-select :options="clusters" v-model="clusterId" label="name" :reduce="(opt) => opt.id"
                            :taggable="false" :close-on-select="true" :filterable="false">
                            <template #option="{ description, id, name, type }">
                                {{ name }}<br />
                                <small><em>{{ description }}</em></small>
                            </template>
                        </v-select>
                        <!--
                        <small>{{$tc('titles.dataSource')}}:</small>
                        <b-input-group>
                            <b-input size="sm" v-model="dataSourceLabel" disabled />
                            <b-input-group-append>
                                <b-button :title="$t('dataExplorer.selectDataSource')" variant="outline-secondary"
                                    size="sm" @click="warning('Under development')">
                                    <span class="fa fa-database"></span>
                                </b-button>
                                <b-button :title="$t('dataExplorer.setupSample')" variant="outline-secondary" size="sm"
                                    @click="warning('Under development')">
                                    <span class="fa fa-filter"></span>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                        -->
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

                    <b-button :disabled="false && loadingData" variant="primary" size="sm" class="float-right mt-2"
                        @click="saveWorkflow"><span class="fa fa-save"></span> {{$t('actions.save')}}
                    </b-button>
                    <b-button :disabled="false && loadingData" size="sm" variant="outline-secondary"
                        class="float-right mt-2 mr-1" @click="loadData">
                        <span class="fa fa-redo"></span> {{$t('actions.refresh')}}
                    </b-button>
                </div>
                <!-- Steps -->
                <div v-if="workflowObj" class="clearfix mt-2">
                    <div id="step-container">
                        <div class="step-scroll-area scroll-area" style="overflow-y: auto;">
                            <draggable @start="drag=true" @end="endSortSteps" class="list-group" ghost-class="ghost"
                                handle=".step-drag-handle" :list="workflowObj.tasks">
                                    <div v-for="task, inx in workflowObj.tasks" :key="task.id"
                                        xv-if="task.operation.slug !== 'read-data'"
                                        class="list-group-item steps clearfix p-0" :title="task.name"
                                        :style="{'border-left': '4px solid ' + task.backgroundColor}">
                                        <step :step="task" :language="language" :attributes="tableData.attributes"
                                            :index="inx - 1" @toggle="task.enabled = !task.enabled"
                                            @delete="workflowObj.deleteTask(task)" @update="updateStep"
                                            @previewUntilHere="previewUntilHere(task)" @duplicate="duplicate"
                                            @custom-open="store.customOpen"
                                            :suggestionEvent="() => getSuggestions(task.id)" />
                                    </div>
                            </draggable>
                        </div>
                    </div>
                    <small class="text-secondary">{{jobStatus}}</small>
                    <!--FIXME -->
                </div>
            </div>
            <!-- Preview area -->
            <div class="col border-left fill-height mt-3">
                <PreviewMenu :selected="selected" @select="performAction" :menus="menus" />
                <preview :attributes="tableData.attributes" :items="tableData.rows" :store="store"
                    :missing="tableData.missing" :invalid="tableData.invalid" :loading="loadingData"
                    :total="tableData.total" :service-bus="store.serviceBus" @select="select" @drop="performAction"
                    @context-menu="handleContextMenu" ref="preview" />
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
    import jsep from 'jsep';
    import io from 'socket.io-client';
    import axios from 'axios';
    import draggable from 'vuedraggable';
    import Preview from '../../components/data-explorer/Preview';
    import Step from '../../components/data-explorer/Step';
    import Notifier from '../../mixins/Notifier.js';
    import Commands from '../../components/data-explorer/Commands.js';
    import PreviewMenu from '../../components/data-explorer/PreviewMenu.vue';
    import contextMenu from 'vue-context-menu';
    import SimpleInput from '../../components/data-explorer/SimpleInput';
    import FindReplace from '../../components/data-explorer/FindReplace';
    import ConcatInput from '../../components/data-explorer/ConcatInput';
    import { Workflow, Platform, Operation, OperationList, Task } from './entities.js'

    jsep.addBinaryOp(">=", 1);
    jsep.removeBinaryOp('^');
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const standUrl = process.env.VUE_APP_STAND_URL
    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;
    const standNamespace = process.env.VUE_APP_STAND_NAMESPACE;

    /* Remove 
    const SUPPORTED_OPERATIONS = ['cast', 'read-data',
        'filter-selection', 'projection', 'sort', 'transformation',
        'sample', 'clean-missing'];
    */

    const META_PLATFORM_ID = 1000;
    export default {
        name: "DataExplorer",
        mixins: [Notifier],
        components: {
            SimpleInput, Preview, draggable,
            contextMenu, Step, PreviewMenu, FindReplace, ConcatInput,
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
            attributes: { type: Array, default: () => [] },
            items: { type: Array },
            workflowId: { type: Number },
        },
        data() {
            return {
                attributeSelection: [], // used to select attributes
                clusters: [],
                clusterId: null,
                dataSource: {}, // current data source
                dataSourceLabel: null,
                dataTypes: [
                    'Array', 'Boolean', 'Date', 'Decimal', 'Integer', 'JSON', 'Text', 'Time',],
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
                store: new Commands(new Vue(), 'pt'),  //store rules implementation
                socket: null, // used by socketio (web sockets)
                simpleInput: {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    okClicked: () => { },
                    title: null,
                    initial: null,
                    message: null,
                },
                findReplace: {
                    okTitle: this.$t('actions.replace'),
                    cancelTitle: this.$t('actions.cancel'),
                    okClicked: () => { },
                    title: null,
                    initial: null,
                    message: null,
                },
                tableData: { attributes: [] }, // data used to render preview table
                workflowObj: { cluster: null },
                //
                menus: [],
                attributeSuggestion: {},
            }
        },
        async mounted() {
            this.internalWorkflowId = (this.$route) ? this.$route.params.id : 0;
            await this.loadClusters();
            await this.loadOperations();
            await this.loadWorkflow();
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
                if (extendedSuggestions && extendedSuggestions.inputs?.length) {
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
                        return [];
                    }
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
            },
            updateStep(step) {
                const task = this.workflowObj.tasks.find(t => t.id === step.id);
                if (task) {
                    Object.assign(task.forms, step.forms);
                }
                this.updateAttributeSuggestion();
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
                        this.operationLookup.set(op.id, new Operation(op));
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
                //let cloned = JSON.parse(JSON.stringify(self.store.workflow));
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
                        //self.store.setWorkflow(resp.data.data, false);

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
                if (typeof this[options.action] === 'function') { //FIXME: remove
                    debugger
                    this[options.action](options.params);
                } else if (options.action === 'menu') {
                    this.workflowObj.addTask(this.operationLookup.get(options.params[0].id),
                        options.selected, options.fields);
                    console.debug(options);
                } else {
                    console.log(`Unknown action: ${options.action}`);
                }
            },
            move(params) {
                this.store.moveAttribute(params[0], params.slice(1))
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
            /*
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
            },*/
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
                    format: 'text',
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
            findAndReplaceAttribute() {
                const attributeName = this.selected.field.label;
                const position = this.selected.field.position;
                const isNumber = this.selected.field.type === 'Integer' || this.selected.field.type === 'Decimal';
                const quotes = !isNumber;
                const actionName = this.$t('actions.findAndReplace');

                const modalConfig =
                {
                    attribute: this.selected.field,
                    message: actionName,
                    title: actionName,
                    okTitle: this.$t('actions.replace'),
                    cancelTitle: this.$t('actions.cancel'),
                    value: attributeName,
                    format: isNumber ? 'number' : 'text',
                    ok: () => {
                        const handle = (str, quotes) => {
                            if (str == null || str.length === 0) {
                                return 'null'; //Must be str
                            } else if (quotes) {
                                return `"${str}"`;
                            }
                            return str;
                        };
                        this.store.findAndReplaceAttribute(
                            attributeName,
                            handle(this.$refs.findReplace.valueFind, quotes),
                            handle(this.$refs.findReplace.valueReplace, quotes),
                            this.$refs.findReplace.alias,
                            this.$refs.findReplace.removeOriginal,
                            position);
                    }
                };
                this.$refs.findReplace.show(modalConfig);
                this.resetMenuData();
                /*
                this.$refs.modalRenameAttribute.show();
                const col = this.attributes.find((f) => f.key === this.selected.field.key);
                col.label = this.selected.field.label;
                this.store.renameAttribute();*/
            },
            concat() {
                const modalConfig =
                {
                    attributes: this.attributes,
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informNewName'),
                    options: this.dataTypes,
                    title: this.$t('actions.changeDataType'),
                    value: this.selected.field.type,
                    ok: () => {
                        this.store.changeAttributeType(
                            this.selected.field.label,
                            'changeAttributeType',
                            this.$refs.simpleInput.value,
                            'ignore');
                    }
                };
                this.$refs.concatInput.show(modalConfig);
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
                            'changeAttributeType',
                            this.$refs.simpleInput.value,
                            'ignore');
                    }
                };
                this.$refs.simpleInput.show(modalConfig);
            },
            castToDate(attributeName) {
                const modal = this.$refs.simpleInput;
                const modalConfig =
                {
                    taggable: true,
                    multiple: true,
                    format: 'dateformatpicker',
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informFormat'),
                    title: this.$t('actions.parseDate'),
                    value: null,
                    ok: () => {
                        this.store.changeAttributeType(this.selected.field.label,
                            'parseToDate', 'DateTime', 'coerce',
                            modal.value[0]);
                    }
                };
                modal.show(modalConfig);
            },
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
            dateExtract(attributeName) {
                const modal = this.$refs.simpleInput;
                const modalConfig =
                {
                    format: 'options',
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informFormat'),
                    title: this.$t('actions.formatDate'),
                    options: [
                        { value: 'year', text: this.$tc('common.periods.year') },
                        { value: 'month', text: this.$tc('common.periods.month') },
                        { value: 'dayofmonth', text: this.$tc('common.periods.day') },
                        { value: 'weekofyear', text: this.$tc('common.periods.weekOfYear') },
                        { value: 'dayofweek', text: this.$tc('common.periods.weekDay') },
                        { value: 'hour', text: this.$tc('common.periods.hour') },
                        { value: 'minute', text: this.$tc('common.periods.minute') },
                        { value: 'seconds', text: this.$tc('common.periods.seconds') },
                    ],
                    value: null,
                    ok: () => {
                        this.store.transformWithFunction(
                            attributeName,
                            this.selected.field.position,
                            ['dateExtract', modal.value, attributeName]);
                    }
                };
                modal.show(modalConfig);
            },
            dateFormat(attributeName) {
                const modal = this.$refs.simpleInput;
                const modalConfig =
                {
                    taggable: true,
                    multiple: false,
                    format: 'dateformatpicker',
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informFormat'),
                    title: this.$t('actions.formatDate'),
                    value: null,
                    ok: () => {
                        this.store.transformWithFunction(
                            attributeName,
                            this.selected.field.position,
                            ['dateFormat', 'date_format',
                                attributeName, `"${modal.value}"`]);
                    }
                };
                modal.show(modalConfig);
            },
            truncateTextAttribute() {
                const attributeName = this.selected.field.label;
                const modalConfig =
                {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informNewName'),
                    title: this.$t('actions.rename'),
                    value: '20',
                    format: 'number',
                    ok: () => {
                        const val = parseInt(this.$refs.simpleInput.value);
                        this.store.transformWithFunction(
                            attributeName,
                            this.selected.field.position,
                            ['truncateTextAttribute', 'substring',
                                attributeName, 0, val]);
                    }
                };
                this.$refs.simpleInput.show(modalConfig);
            },
            splitTextAttribute() {
                const attributeName = this.selected.field.label;
                const modalConfig =
                {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informNewName'),
                    title: this.$t('actions.rename'),
                    value: '20',
                    format: 'number',
                    ok: () => {
                        const val = parseInt(this.$refs.simpleInput.value);
                        this.store.transformWithFunction(
                            attributeName,
                            this.selected.field.position,
                            ['truncateTextAttribute', 'substring',
                                attributeName, 0, val]);
                    }
                };
                this.$refs.simpleInput.show(modalConfig);
            },
            sort(direction) {
                this.store.sort(this.selected.field.label, direction[0]);
            },
            limit() {
                const modalConfig =
                {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('actions.limit'),
                    title: this.$t('actions.limit'),
                    value: '1000',
                    format: 'number',
                    ok: () => {
                        const val = parseInt(this.$refs.simpleInput.value);
                        this.store.limit(val);
                    }
                };
                this.$refs.simpleInput.show(modalConfig);
            },
            cleanMissing(params) {
                this.store.cleanMissing(this.selected.field.label, params);
            },
            /* Data loading */
            async loadWorkflow() {
                const self = this;
                self.loadingData = true;
                this.$Progress.start()
                try {
                    const resp = await axios.get(`${tahitiUrl}/workflows/${this.internalWorkflowId}`);
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
                        const sample = Workflow.createSampleTask(1, op);
                        self.warning('FIXME: Invalid workflow. Tried to fix it.');
                        this.workflowObj.tasks.splice(1, 0, sample);
                    }
                    self.loadingData = false;
                    document.getElementById('tahiti-script').setAttribute(
                        'src', `${tahitiUrl}/public/js/tahiti.js?platform=${this.workflowObj.platform.id}`);

                    //self.store.setWorkflow(workflow, true);
                } catch (e) {
                    console.debug(e)
                    self.error(e);
                } finally {
                    Vue.nextTick(() => {
                        this.$Progress.finish();
                        this.loadingData = false;
                    });
                }
                //self.loadData();
            },
            async loadData() {
                const self = this;
                self.loadingData = true;
                //const cloned = JSON.parse(JSON.stringify(this.store.workflow));
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
                    app_configs: { sample_size: 200, },
                }
                //self.disconnectWebSocket();
                //self.store.prepareSampleProperties();

                axios.post(`${standUrl}/jobs`, body, {
                    headers: { 'Locale': self.$root.$i18n.locale, }
                }).then((response) => {
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
            endSortSteps({originalEvent }){
                let elem = null;
                this.workflowObj.tasks.forEach((task, i) => {
                    task.display_order = i;
                    if (task.previewable) {
                        elem = task;
                        return false
                    }
                })
                this.previewUntilHere(elem)
            },
            connectWebSocket() {
                const self = this;
                if (self.socket === null) {
                    const socket = io(standNamespace, { upgrade: true, });
                    self.socket = socket;

                    socket.on('connect', () => { socket.emit('join', { cached: false, room: self.job.id }); });

                    socket.on('update task', (msg, callback) => {
                        if (msg.type === 'OBJECT') {
                            if (msg.meaning === 'sample') {
                                // Update must be done before assigning to observable self.tableData!
                                const messageJson = JSON.parse(msg.message);
                                const truncated = messageJson.truncated || [];
                                messageJson.attributes.forEach((attr, index) => {
                                    attr['selected'] = true;
                                    attr['truncated'] = truncated.indexOf(attr.key) > -1;
                                    attr['position'] = index;
                                });
                                self.tableData = messageJson;

                                const attributeIds = self.tableData.attributes.map(attr => attr.key);
                                //self.store.setAttributes(self.tableData.attributes);

                                self.tableData.rows = self.tableData.rows.map(
                                    row => Object.assign(...attributeIds.map((attr, i) => { return { [attr]: row[i] } })));
                            } else if (msg.meaning === 'schema') {
                                self.schemas[msg.id] = JSON.parse(msg.message);
                            }
                        }
                        //self.store.changeStepStatus(msg.id, msg.status);
                    });
                    socket.on('update job', msg => {
                        self.jobStatus = '';
                        if (msg.status === 'ERROR') {
                            self.error(msg);
                        }
                        if (msg.status === 'COMPLETED') {
                            self.loadingData = false;
                            self.jobStatus = msg.message;
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