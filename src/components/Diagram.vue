<template>
    <div class="border" tabindex="0">
        <diagram-toolbar :workflow="workflow" v-if="showToolbar"></diagram-toolbar>
        <div class="lemonade-container not-selectable" id="lemonade-container" :class="{'with-grid': showGrid}"
            v-on:click="diagramClick">
            <VuePerfectScrollbar class="scroll-area" :settings="settings" @ps-scroll-y="scrollHandle">
                <div class="lemonade" v-on:drop="drop" v-on:dragover="allowDrop" :show-task-decoration="true"
                    id="lemonade-diagram" v-if="loaded" ref="diagram"
                    :style="{'pointer-events': showToolbarInternal && showToolbar ? 'auto': 'auto'}">
                    <task-component v-for="task of tasks" :task="task" :instance="instance"
                        :key="`${$parent.version} - ${task.id}`" :enableContextMenu="editable" :draggable="editable"
                        :show-decoration="showTaskDecoration || showTaskDecorationInternal" :metaTaskId="metaTaskId" 
                        :environment="environment"/>

                    <div class="ghost-select" ref="ghostSelect">
                        <span></span>
                    </div>
                </div>
            </VuePerfectScrollbar>
        </div>
        <modal-component v-if="showExecutionModal" @close="showExecutionModal = false">
            <div slot="header">
                <h4>Execution of workflow</h4>
                Please, complete the required information for the execution of the workflow:
            </div>
            <div class="body" slot="body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-12">
                            <label>Job name (optional):</label>
                            <input type="text" class="form-control" v-model="name" />
                        </div>
                        <div class="col-md-6">
                            <label>Cluster:</label>
                            <select v-model="cluster" class="form-control" v-on:change="changeCluster">
                                <option v-for="option in clusters" v-bind:value="option.id" :key="option.id">
                                    {{ option.name }}
                                </option>
                            </select>
                            <span>{{clusterDescription}}</span>
                        </div>
                        <div class="col-md-12">
                            <label>Missing required parameters:</label>
                            <p>
                                There is no missing required parameter
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <button class="btn btn-primary" @click="execute">
                    <span class="fa fa-play"></span> Execute</button>
                <button class="btn btn-danger" @click="cancelExecute">Cancel</button>
            </div>
        </modal-component>
    </div>
</template>

<script>
    import Vue from 'vue';

    import lodash from 'lodash';

    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import TaskComponent from './Task.vue';
    import DiagramToolbar from './DiagramToolbar.vue'
    import jsplumb from 'jsplumb'

    const DiagramComponent = Vue.extend({
        computed: {
            flows() {
                if (this.renderFrom) {
                    if (this.renderFrom && this.renderFrom.flows) {
                        return this.renderFrom.flows;
                    } else {
                        return {};
                    }
                } else {
                    return this.workflow.flows;
                }
            },
            tasks() {
                return this.workflow.tasks;
                const self = this;
                if (this.renderFrom) {
                    if (this.renderFrom && this.renderFrom.tasks) {
                        return this.renderFrom.tasks;
                    } else {
                        return {};
                    }
                } else {
                    const displayInEnvironment = [];
                    const hide = [];
                    this.workflow.tasks.forEach((t) => {
                        if (this.environment === undefined
                            || t.environment === undefined
                            || t.environment === this.environment) {
                            if (this.metaTaskId !== t.group_id) {
                                hide.push(t);
                            } else {
                                self.instance.hide(t.id, false);
                                displayInEnvironment.push(t);
                            }
                        } else {
                            hide.push(t);
                        }
                    });
                    // hide tasks according to meta task operation
                    // null means main workflow, otherwise, it is a child of 
                    // meta task
                    // if (self.instance) {
                    //     hide.forEach(t => {
                    //         self.instance.hide(t.id, true);
                    //         // const d = document.getElementById(t.id);
                    //         // if (d)
                    //         //     d.style.display = "none";
                    //     });
                    // }
                    return displayInEnvironment;
                }
            },
            zoomPercent: function () {
                return `${Math.round(100 * this.zoom, 0)}%`;
            },
        },
        components: {
            'task-component': TaskComponent,
            'diagram-toolbar': DiagramToolbar,
            VuePerfectScrollbar,
        },
        props: {
            metaTaskId: null,
            environment: null,
            formContainer: null,
            hack: {
                default: false
            },
            title: {},
            initialZoom: { default: 1.0 },
            loaded: false,
            multipleSelectionEnabled: { default: true },
            operations: Array,
            renderFrom: null,
            showGrid: { default: true },
            showTaskDecoration: false,
            editable: {
                default: true
            },
            multipleSelectionEnabled: {
                default: true,
            },
            initialZoom: {
                default: 1.0
            },
            shink: {
                default: false,
            },
            showToolbar: { default: true },
            title: {},
            workflow: { name: '' },
        },
        watch: {
            workflow() {
                this.tasksRendered = false;
            }
        },
        updated() {
            this.$nextTick(() => {
                this.tasksRendered = true;
            });
        },
        data() {
            return {
                clusters: [],
                clusterDescription: '',
                cluster: null,
                deployInfo: {},
                name: '',
                readyTasks: new Set(),

                selectedTask: null,
                selectedElements: [],

                settings: {
                    maxScrollbarLength: 60,
                },
                showDeployModal: false,
                showExecutionModal: false,
                tasksRendered: false,
                showToolbarInternal: true,
                showTaskDecorationInternal: false,

                zoomInEnabled: true,
                zoomOutEnabled: true,
                zoom: this.initialZoom,
            }
        },
        created() {
            const self = this;
            if (this.$route.params.id) {
                this.changeWorkflowId(this.$route.params.id);
                this.init();
            }

            this.$root.$on('onclick-task', (taskComponent) => {
                this.selectedTask = taskComponent.task;
                this.$el.focus({ preventScroll: true });
            });
            // this.$on('oncancel-deploy', () => {
            //     this.setZoomPercent(null, this.oldZoom);
            //     this.showToolbarInternal = true;
            //     this.showTaskDecorationInternal = false;
            // });
            this.$root.$on('onremove-task', (task) => {
                this.removeTask(task);
            });
            this.$root.$on('on-align-tasks', (pos, fn) => {
                this.align(pos, fn)
            });
            // this.$on('xupdate-form-field-value', (field, value) => {
            //     this.$emit('update-form-field-value-in-diagram', field, value);
            //     this.updateAttributeSuggestion();
            // });

            // Highlight which operations can be target for a new flow.
            this.$root.$on('onstart-flow', (interfaceName) => {
                this.clearSelection(null);
                let sourceInterfaces = new Set(interfaceName.split(' '));
                this.instance.selectEndpoints().each((endPoint) => {
                    if (endPoint.isTarget) {
                        let intersection = endPoint.scope.split(' ').filter(
                            Set.prototype.has, sourceInterfaces);
                        if (intersection.length > 0) {
                            endPoint.element.classList.add('selected');
                        }
                    }
                });
            });
            this.$root.$on('onstop-flow', (interfaceName) => {
                this.instance.selectEndpoints().each((endPoint) => {
                    if (endPoint.isTarget) {
                        endPoint.element.classList.remove('selected');
                    }
                });
            });
            self.$root.$on('ontask-ready', (task) => {
                self.readyTasks.add(task.id);
                //Evaluates if flow can be draw now (both endpoints were created)
                const candidates = self.workflow.flows.filter((flow) => {
                    return (flow['target_id'] === task.id || flow['source_id'] === task.id)
                        && self.readyTasks.has(flow['target_id'])
                        && self.readyTasks.has(flow['source_id']);
                });

                candidates.forEach((flow) => {
                    let uuids = flow.uuids ||
                        [`${flow['source_id']}/${flow['source_port']}`,
                        `${flow['target_id']}/${flow['target_port']}`];

                    const connection = self.instance.connect({ uuids, cssClass: this.metaTaskId });
                    if (connection) {
                        connection.bind('mouseover', (c, originalEvent) => {
                            //var arr = self.instance.select({ source: con.sourceId, target: con.targetId });
                            if (originalEvent) {
                                const currentStyle = c ? c.getPaintStyle() : null;
                                currentStyle.lineWidth = 20;
                                currentStyle.outlineColor = "#ed8";
                                c.setPaintStyle(currentStyle);
                                self.instance.repaintEverything();
                            }
                        });
                        const currentStyle = connection ? connection.getPaintStyle() : null;
                        if (currentStyle) {
                            currentStyle['strokeStyle'] = connection.endpoints[0].getPaintStyle().fillStyle;
                            currentStyle['stroke'] = connection.endpoints[0].getPaintStyle().fill;
                            connection.setPaintStyle(currentStyle);
                        }
                    }
                });
            });
        },
        beforeDestroy() {
            this.$root.$off('ontask-ready');
            this.readyTasks = new Set();
        },
        mounted() {
            const self = this;

            // Required, otherwise zoom will not work.
            // It seems that jsplumb is loosing this setting between
            // calls to init() and mounted()
            this.instance.setContainer("lemonade-diagram");

            this.readyTasks = new Set();
            // this.$root.$refs.toastr.defaultPosition = 'toast-bottom-full-width';
            this.currentZIndex = 10;

            //this.init();
            self.diagramElement = self.$refs.diagram;
            this.setZoom(parseFloat(self.zoom), self.instance, null, self.diagramElement);

            /* scroll bars */
            // @FIXME PerfectScrollbar.initialize(self.diagramElement.parentElement);

            self.$el.addEventListener('keyup', this.keyboardAction, true);
            /* selection by dragging */
            self.diagramElement.addEventListener("mousedown", (ev) => {
                if (self.$refs.diagram === ev.target) {
                    let rightClick = (ev.which === 3)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                        || (ev.button == 2); // IE, Opera

                    if (rightClick) {
                        return;
                    }
                    self.clearSelection(ev);
                    let ghostSelect = self.$refs.ghostSelect;
                    ghostSelect.classList.add("ghost-active");
                    ghostSelect.style.left = ev.offsetY + 'px';
                    ghostSelect.style.top = ev.offsetX + 'px';
                    ghostSelect.style.width = '0px';
                    ghostSelect.style.height = '0px';


                    self.initialW = ev.offsetX;
                    self.initialH = ev.offsetY;
                    document.addEventListener("mouseup", self.selectElements);
                    document.addEventListener("mousemove", self.openSelector);
                }
            });
            if (self.shink) {
                const z = parseFloat(self.zoom);
                const width = z * (Math.max.apply(null, self.workflow.tasks.map((t) => t.left)) + 200);
                const height = z * (Math.max.apply(null, self.workflow.tasks.map((t) => t.top)) + 200);
                self.$refs.diagram.style.width = '100%'; //width + 'px';
                self.$refs.diagram.style.height = '100%';
            }

        },
        methods: {
            scrollHandle() {

            },
            changeCluster() {
                let self = this;
                let c = self.clusters.filter((c) => c.id === self.cluster)
                if (c.length) {
                    this.clusterDescription = c[0].description;
                }
            },
            toggleTasks() {
                this.workflow.tasks.forEach((task) => {
                    if (lodash.includes(this.selectedElements, task.id)) {
                        task.enabled = !task.enabled;
                    }
                });
            },
            deploy(ev) {
                this.$emit('onshow-deploy');
                this.oldZoom = this.zoom;
                this.setZoomPercent(ev, 0.85);
                this.showToolbarInternal = false;
                this.showTaskDecorationInternal = true;
                if (false) {
                    let self = this;
                    let dataSources = self.tasks.filter((task) => {
                        return task.operation.categories.filter((cat) => {
                            return cat.type === 'data source';
                        }).length > 0;
                    });
                    let ports = self.tasks.map((task) => {
                        let dataPorts = task.operation.ports.filter((port) => {
                            let itfs = port.interfaces.filter((iface) => {
                                return iface.name === 'Data' || iface.name === 'IData';
                            });
                            return itfs.length > 0 && port.type === 'OUTPUT';
                        });
                        return [task, dataPorts];
                    });
                    self.showDeployModal = true;
                    self.deployInfo['dataSources'] = dataSources;
                    self.deployInfo['ports'] = ports;
                }
                ev.preventDefault();
                return false;
            },
            addTask(task) {
                task.forms = {};
                task.operation.forms.forEach((f) => {
                    f.fields.forEach((field) => {
                        task[field.name] = field['default'] || '';
                    });
                });
                task.name = `${task.operation.name} ${this.workflow.tasks.length}`;
                task.enabled = true;
                this.$root.$emit('addTask', task)
            },

            removeTask(task) {
                const self = this;
                //this.instance.detachAllConnections(task.id);
                this.instance.deleteConnectionsForElement(task.id);
                this.instance.removeAllEndpoints(task.id);
                //this.instance.detach(task.id);
                let elem = document.getElementById(task.id)
                elem.parentNode.removeChild(elem);

                //console.debug(this.instance.getConnections());
                this.instance.repaintEverything();

                Vue.nextTick(function () {
                    self.$root.$emit('removeTask', task);
                    self.clearSelection();
                    self.instance.repaintEverything();
                })

            },
            repaint() {
                this.$nextTick(() => {
                    this.instance.repaintEverything();
                });
            },
            clearWorkflow() {
                return new Promise((resolve, reject) => {
                    let oldInstance = this.instance;
                    oldInstance.deleteEveryEndpoint();
                    oldInstance.deleteEveryConnection();
                    oldInstance.reset();
                    /*
                    this.instance = this.getJsPlumbInstance();
                    //this._bindJsPlumbEvents();
                    this.$nextTick(() => {
                       this.instance.repaintEverything();
                    });*/
                    resolve();
                });
            },
            clearTasks() {
                this.$root.$emit('clearTasks');
            },
            // addFlow(flow) {
            //    this.$root.$emit('addFlow', flow)
            // },
            removeFlow(flow) {
                this.$root.$emit('removeFlow', flow);
            },
            clearFlows() {
                this.$root.$emit('clearFlow');
            },
            changeWorkflowName(name) {
                this.$root.$emit('changeWorkflowName', name)
            },
            changeWorkflowId(id) {
                //@FIXME
                //this.$store.dispatch('changeWorkflowId', id);
            },
            getOperationFromId(id) {
                let result = this.operations.find(v => {
                    return v.id === parseInt(id);
                });
                return result;
            },
            getJsPlumbInstance() {
                const instance = jsPlumb.getInstance({
                    //Anchors: anchors,
                    Endpoints: [["Dot", { radius: 2 }], ["Dot", { radius: 1 }]],
                    EndpointHoverStyle: { fillStyle: "orange" },
                    HoverPaintStyle: { strokeStyle: "blue" },
                });
                if (this.initialZoom)
                    instance.setZoom(this.initialZoom)
                return instance;
            },
            init() {
                const self = this;
                self.platform = self.$route.params.platform;

                if (self.instance && self.showToolbar) {
                    this.instance.reset();
                }
                self.instance = self.getJsPlumbInstance();
                self._bindJsPlumbEvents();
                //self.instance.setRenderMode(jsPlumb.CANVAS);
                window.addEventListener('resize', (e) => {
                    self.instance.repaintEverything();
                });

            },
            selectElements(ev) {
                if (this.multipleSelectionEnabled) {
                    //$("#score>span").text('0');
                    let self = this;
                    document.removeEventListener("mousemove", self.openSelector);
                    document.removeEventListener("mouseup", self.selectElements);

                    self.initialW = 0;
                    self.initialH = 0;

                    let ghostSelect = self.$refs.ghostSelect;
                    let x1 = parseInt(ghostSelect.style.left);
                    let y1 = parseInt(ghostSelect.style.top);
                    let x2 = parseInt(ghostSelect.style.width) + x1;
                    let y2 = parseInt(ghostSelect.style.height) + y1;

                    ghostSelect.classList.remove("ghost-active");
                    ghostSelect.style.width = 0;
                    ghostSelect.style.height = 0;

                    this.$emit('onclear-selection');

                    self.workflow.tasks.forEach((task) => {
                        let taskElem = document.getElementById(task.id);
                        if (taskElem) {
                            let bounds = taskElem.getBoundingClientRect();

                            // Uses task left and top because offset calculation
                            // was already done
                            /*console.debug(x1 <= task.left,  x2 >= task.left + bounds.width,
                                    y1 <= task.top, y2 >= task.top + bounds.height,
                                    bounds.width, bounds.height, x1, x2, y1, y2)
                                    */
                            if (x1 <= task.left && x2 >= task.left + bounds.width
                                && y1 <= task.top && y2 >= task.top + bounds.height) {
                                // console.debug(`overlap with ${task.operation.name}`)
                                self.instance.addToDragSelection(task.id);
                                self.selectedElements.push(task.id);
                            }
                            //console.debug (bounds.left, task.left)
                            //console.debug(task)
                        }
                    });
                }
            },
            openSelector(ev) {
                if (ev.which === 1 && this.multipleSelectionEnabled) { //left mouse
                    const self = this;
                    const rect = this.diagramElement.getBoundingClientRect();
                    const x = ev.pageX - rect.left;
                    const y = ev.pageY - rect.top;
                    const w = Math.abs(self.initialW - x);
                    const h = Math.abs(self.initialH - y);

                    let ghostSelect = self.$refs.ghostSelect;
                    ghostSelect.style.display = ''

                    ghostSelect.style.width = w + 'px';
                    ghostSelect.style.height = h + 'px';

                    ghostSelect.style.left = Math.min(x, self.initialW) + 'px';
                    ghostSelect.style.top = Math.min(y, self.initialH) + 'px';

                }
            },
            clearSelection(ev) {
                if (ev && ev.target.taskName === 'path') {
                    // click on flow
                    return;
                }
                let self = this;
                let tasks = document.querySelectorAll(".task");

                self.instance.clearDragSelection();
                self.selectedElements.length = 0;
                Array.prototype.slice.call(tasks, 0).forEach((e) => {
                    e.classList.remove('selected');
                    //self.instance.clearDragSelection();
                    self.selectedTask = null;
                    self.selectedFlow = null;
                });
                this.$root.$emit('onblur-selection');
            },
            doChangeWorkflowName(ev) {
                this.changeWorkflowName(ev.target.value);
            },
            doChangeWorkflowId(ev) {
                /** Debug */
                this.changeWorkflowId(ev.target.value);
            },
            flowClick(connection, e) {
                var self = this;
                self.selectedFlow = connection;
                self.instance.select().setPaintStyle(connectorPaintStyle)
                connection.setPaintStyle({
                    lineWidth: 2,
                    radius: 1,
                    strokeStyle: "rgba(242, 141, 0, 1)"
                })
                let tasks = document.querySelectorAll(".task.selected");
                Array.prototype.slice.call(tasks, 0).forEach(e => {
                    e.classList.remove('selected');
                });
                e.stopPropagation();
                e.preventDefault();
            },
            drop(ev) {
                const self = this;
                ev.preventDefault();

                let operation = this.getOperationFromId(
                    ev.dataTransfer.getData('id'));

                if (!operation) {
                    return;
                }

                let classes = operation.categories.map((c) => {
                    return c.type.replace(' ', '-');
                }).join(' ');
                self.addTask({
                    id: self.generateId(), operation, operation_id: operation.id,
                    left: ev.offsetX, top: ev.offsetY, z_index: ++self.currentZIndex, classes,
                    status: 'WAITING'
                });
            },
            allowDrop(ev) {
                ev.preventDefault();
            },

            clear() {
                let self = this;
                self.clearFlows();
                self.clearTasks();
            },
            keyboardAction(ev) {
                const self = this;
                if (self.selectedTask) {
                    ev.stopPropagation();
                    ev.preventDefault();

                    let elem = document.getElementById(self.selectedTask.id);
                    let inc = ev.ctrlKey ? 10 : 1;
                    let v = 0;
                    switch (ev.code) {
                        case 'Delete':
                            this.removeTask(self.selectedTask);
                            break;
                        case 'ArrowRight':
                            v = parseInt(elem.style.left, 10) + inc;
                            elem.style.left = `${v}px`;
                            self.selectedTask.left = v;
                            self.instance.repaintEverything();
                            break
                        case 'ArrowLeft':
                            v = parseInt(elem.style.left, 10) - inc;
                            elem.style.left = `${v}px`;
                            self.selectedTask.left = v;
                            self.instance.repaintEverything();
                            break
                        case 'ArrowUp':
                            v = parseInt(elem.style.top, 10) - inc;
                            elem.style.top = `${v}px`;
                            self.selectedTask.top = v;
                            self.instance.repaintEverything();
                            break
                        case 'ArrowDown':
                            v = parseInt(elem.style.top, 10) + inc;
                            elem.style.top = `${v}px`;
                            self.selectedTask.top = v;
                            self.instance.repaintEverything();
                            break
                    }

                }
            },
            /*
            deleteSelected(ev) {
                let self = this;
                if (self.selectedTask) {
                    //self.instance.remove(self.selectedTask);
                    //self.removeTask({ id: self.selectedTask.id });
                    self.removeTask(self.selectedTask);
                    self.selectedTask = null;
                } else if (self.selectedFlow) {
                    self.instance.detach(self.selectedFlow);
                    self.selectedFlow = null;
                }
            },*/
            diagramClick(ev) {
                if (ev.target.classList.contains("diagram")) {
                    ev.preventDefault();
                    this.clearSelection(ev);
                }
                this.$emit('onclear-selection');
            },
            generateId() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },

            setZoom(zoom, instance, transformOrigin, el) {
                transformOrigin = transformOrigin || [0.5, 0.5];
                //instance = instance || jsPlumb;
                el = el || instance.getContainer();
                var p = ["webkit", "moz", "ms", "o"],
                    s = "scale(" + zoom + ")",
                    oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

                for (var i = 0; i < p.length; i++) {
                    el.style[p[i] + "Transform"] = s;
                    el.style[p[i] + "TransformOrigin"] = oString;
                }
                //instance.setZoom(zoom);

                el.style["transform"] = s;
                el.style["transformOrigin"] = '0% 0% 0px'; //oString;

                let adjust = ((1.0 / zoom) * 5000) + 'px'
                el.style.width = adjust;
                el.style.height = adjust;
                // @FIXME PerfectScrollbar.update(this.diagramElement.parentElement);
            },
            setZoomPercent(zoom) {
                this.zoom = zoom;
                this.setZoom(this.zoom, this.instance, null, this.diagramElement);
            },
            zoomIn(ev) {
                let self = this;
                self.zoom += .1;
                if (self.zoom > 1.3) {
                    self.zoomInEnabled = false;
                }
                self.zoomOutEnabled = true;
                this.setZoom(self.zoom, self.instance, null, self.diagramElement);
                ev.preventDefault();
                return false;
            },
            zoomOut(ev) {
                let self = this;
                self.zoom -= .1;
                if (self.zoom < 0.8) {
                    self.zoomOutEnabled = false;
                }
                self.zoomInEnabled = true;
                this.setZoom(self.zoom, self.instance, null, self.diagramElement);
                ev.preventDefault();
                return false;
            },
            distribute(mode, prop) {
                if (this.selectedElements.length < 3) {
                    return;
                }
                let self = this;
                let selectedTasks = this.workflow.tasks.filter((task) => {
                    return lodash.includes(this.selectedElements, task.id);
                }).sort((a, b) => {
                    return a[prop] - b[prop];
                })
                if (selectedTasks.length) {
                    let gap = 0;
                    let pos = 0;
                    selectedTasks.forEach((t, inx) => {
                        let elem = document.getElementById(t.id);
                        if (inx !== 0) {
                            gap += t[prop] - pos
                        }
                        pos = t[prop] + parseInt(elem.offsetWidth);
                    });
                    let distance = gap * 1.0 / (selectedTasks.length - 1);
                    let finalPos = 0;
                    selectedTasks.forEach((t, inx) => {
                        let elem = document.getElementById(t.id);
                        if (inx !== 0) {
                            t[prop] = finalPos;
                        }
                        finalPos = t[prop] + distance + parseInt(elem.offsetWidth);
                    });
                    Vue.nextTick(function () {
                        self.instance.repaintEverything();
                    })
                }
            },
            showHistory() {
                let self = this;
                let url = `${tahitiUrl}/workflows/${self.workflow.id}/history`;
                let headers = { 'X-Auth-Token': authToken };

                self.$http.get(url, { headers }).then(response => {
                    console.debug(response);
                });

            },
            align(pos, fn) {
                let self = this;
                let selectedTasks = this.workflow.tasks.filter((task) => {
                    return lodash.includes(this.selectedElements, task.id);
                })
                if (selectedTasks.length) {
                    let minPosTask = selectedTasks.reduce((prev, cur, inx, arr) => {
                        if (fn === 'min') {
                            return prev[pos] < cur[pos] ? prev : cur;
                        } else {
                            return prev[pos] > cur[pos] ? prev : cur;
                        }
                    });
                    selectedTasks.forEach((task, inx) => {
                        task[pos] = minPosTask[pos];
                    });
                    Vue.nextTick(function () {
                        self.instance.repaintEverything();
                    })
                }
            },
            /*
            scrollToTask(taskId) {
                let elemTask = document.getElementById(taskId);
                let container = self.diagramElement.parentElement;
                container.scrollTop = parseInt(elemTask.style.top);
                container.scrollLeft = parseInt(elemTask.style.left);
            },*/
            cancelExecute() {
                this.showExecutionModal = false;
            },
            execute() {
                this.showExecutionModal = false;

                let cloned = JSON.parse(JSON.stringify(this.workflow));
                cloned.platform_id = cloned.platform.id;
                cloned.tasks.forEach((task) => {
                    task.operation = { id: task.operation.id };
                    delete task.version;
                });

                let body = {
                    workflow: cloned,
                    cluster: { id: this.cluster },
                    name: this.name,
                    user: {
                        id: 1, login: 'waltersf@gmail.com',
                        name: 'Walter dos Santos Filho'
                    }
                }
                let self = this;

                let locale = this.$store.getters.getLanguage;
                let headers = {
                    'X-Auth-Token': authToken,
                    'Locale': locale,
                };
                Vue.http.post(`${standUrl}/jobs`, body, { headers })
                    .then(function (response) {
                        self.$router.push({
                            name: 'job-child-diagram',
                            params: {
                                id: response.body.data.id,
                                platform: self.platform
                            }
                        });
                    }).catch((ex) => {
                        if (ex.body) {
                            self.$root.$refs.toastr.e(ex.body.message);
                        } else if (ex.status === 0) {
                            self.$root.$refs.toastr.e(`Error connecting to the backend (connection refused).`);
                        } else {
                            self.$root.$refs.toastr.e(`Unhandled error: ${JSON.stringify(ex)}`);
                        }
                    });
            },
            onClickExecute() {
                let self = this;
                let headers = {
                    'X-Auth-Token': authToken,
                };
                // Retrieve clusters
                Vue.http.get(`${standUrl}/clusters`, { headers })
                    .then((response) => {
                        self.clusters.length = 0;
                        Array.prototype.push.apply(self.clusters, response.body);
                        if (self.clusters.length) {
                            self.cluster = self.clusters[0].id;
                            self.clusterDescription = self.clusters[0].description;
                            self.showExecutionModal = true;
                            if (self.name === '') {
                                self.name = self.workflow.name;
                            }
                        } else {
                            self.$root.$refs.toastr.e("Unable to execute workflow: There is not cluster available.");
                        }
                    }).catch((ex) => {
                        if (ex.body) {
                            self.$root.$refs.toastr.e(ex.body.message);
                        } else if (ex.status === 0) {
                            self.$root.$refs.toastr.e(`Error connecting to the backend (connection refused).`);
                        } else {
                            self.$root.$refs.toastr.e(`Unhandled error: ${JSON.stringify(ex)}`);
                        }
                    });

            },
            _bindJsPlumbEvents() {
                let self = this;
                self.instance.bind('connectionDetached', (info, originalEvent) => {
                    let source = info.sourceEndpoint.getUuid();
                    let target = info.targetEndpoint.getUuid();
                    this.removeFlow(`${source}-${target}`);
                });
                self.instance.bind('contextmenu', (component, originalEvent) => {
                    console.debug(component);
                });
                self.instance.bind('connectionMoved', (info, originalEvent) => {
                    let source = info.originalSourceEndpoint.getUuid();
                    let target = info.originalTargetEndpoint.getUuid();
                    self.removeFlow(`${source}-${target}`);
                });
                /*
                self.instance.bind('beforeDrop', (info) => {
                  console.debug(info.sourceId !== info.targetId);
                  return info.sourceId !== info.targetId;
                });
                */
                self.instance.bind('connection', (info, originalEvent) => {
                    const con = info.connection;
                    if (originalEvent) {
                        //self.instance.detach(con);
                        let [source_id, source_port] = info.sourceEndpoint.getUuid().split('/');
                        let [target_id, target_port] = info.targetEndpoint.getUuid().split('/');
                        let source_port_name = '';
                        let target_port_name = '';
                        // self.instance.detach(con);
                        const flow = {
                            source_id, source_port,
                            target_id, target_port,
                            source_port_name, target_port_name,
                        };
                        self.$root.$emit("addFlow", flow, con);
                    }
                });
                self.instance.setContainer("lemonade-diagram");
            },
        },
    });

    export default DiagramComponent;

</script>
<style scoped lang="scss">
    .scroll-area {
        width: 100%;
        height: 82vh;
    }

    .ghost-active {
        display: block !important;
    }

    .ghost-select>span {
        border: 1px dashed #000;
        width: 100%;
        height: 100%;
        float: left;
    }

    .ghost-select {
        display: none;
        width: 100px;
        height: 100px;
        z-index: 100000;
        position: absolute !important;
        cursor: default !important;
    }

    .not-selectable {
        user-select: none;
    }

    .news {
        margin-left: 5px;
        color: #888;
    }
</style>
