<template>
    <div :class="'platform-' + platform" class="border">
        <diagram-toolbar v-if="showToolbar" :workflow="workflow" />
        <div id="lemonade-container" :class="{'with-grid': showGrid}" class="lemonade-container not-selectable"
            @click="diagramClick">
            <VuePerfectScrollbar :settings="settings" class="scroll-area" @ps-scroll-y="scrollHandle">
                <div v-if="loaded" id="lemonade-diagram" ref="diagram" :show-task-decoration="true"
                    :style="{'pointer-events': showToolbarInternal && showToolbar ? 'auto': 'auto'}" class="lemonade"
                    @drop="drop" @dragover="allowDrop">
                    <task-component v-for="task of workflow.tasks" :key="`${$parent.version} - ${task.id}`" :task="task"
                        :instance="instance" :enable-context-menu="editable" :draggable="editable"
                        :show-decoration="showTaskDecoration || showTaskDecorationInternal" />
                    <div ref="ghostSelect" class="ghost-select">
                        <span />
                    </div>
                    <div v-for="group in groups" :key="group.id">
                        <group-component :key="group.id" :group="group" :instance="instance" />
                    </div>
                </div>
            </VuePerfectScrollbar>
        </div>
        <modal-component v-if="showExecutionModal" @close="showExecutionModal = false">
            <div slot="header">
                <h4>Execution of workflow</h4>Please, complete the required information for the execution of the
                workflow:
            </div>
            <div slot="body" class="body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-12">
                            <label>Job name (optional):</label>
                            <input v-model="name" type="text" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label>Cluster:</label>
                            <select v-model="cluster" class="form-control" @change="changeCluster">
                                <option v-for="option in clusters" :key="option.id" :value="option.id">{{ option.name }}
                                </option>
                            </select>
                            <span>{{ clusterDescription }}</span>
                        </div>
                        <div class="col-md-12">
                            <label>Missing required parameters:</label>
                            <p>There is no missing required parameter</p>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <button class="btn btn-primary" @click="execute">
                    <span class="fa fa-play" /> Execute
                </button>
                <button class="btn btn-danger" @click="cancelExecute">Cancel</button>
            </div>
        </modal-component>
    </div>
</template>

<script>

    import Vue from 'vue';

    import lodash from 'lodash';

    import VuePerfectScrollbar from 'vue-perfect-scrollbar';

    import TaskComponent from './Task.vue';
    import DiagramToolbar from './DiagramToolbar.vue';
    // eslint-disable-next-line
    import jsplumb from 'jsplumb';

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL
    const standUrl = process.env.VUE_APP_STAND_URL
    const authToken = process.env.AUTH_TOKEN
    const connectorPaintStyle = {
        lineWidth: 1,
        radius: 8,
        strokeStyle: "#111",
        stroke: "#111",
        outlineColor: 'white',
        outlineWidth: 2,
    };

    const DiagramComponent = Vue.extend({
        components: {
            'task-component': TaskComponent,
            'diagram-toolbar': DiagramToolbar,
            VuePerfectScrollbar
        },
        props: {
            formContainer: {
                type: Boolean,
                default: () => { return null },
            },
            hack: {
                type: Boolean,
                default: () => { return false },
            },
            initialZoom: {
                type: Number,
                default: () => { return 1.0 },
            },
            loaded: {
                type: Boolean,
                default: () => { return false },
            },
            multipleSelectionEnabled: {
                type: Boolean,
                default: () => { return true },
            },
            operations: {
                type: Array,
                default: () => { return Array },
            },
            renderFrom: {
                type: Boolean,
                default: () => { return null },
            },
            showGrid: {
                type: Boolean,
                default: () => { return true },
            },
            showTaskDecoration: {
                type: Boolean,
                default: () => { return false },
            },
            editable: {
                type: Boolean,
                default: () => { return true },
            },
            shink: {
                type: Boolean,
                default: () => { return false },
            },
            showToolbar: {
                type: Boolean,
                default: () => { return true },
            },
            title: {
                type: String,
                default: () => { return '' },
            },
            workflow: {
                type: Object,
                default: () => { return {} },
                name: ''
            }
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
                copiedTask: null,
                selectedElements: [],
                copiedTasks: [],

                settings: {
                    maxScrollbarLength: 60,
                    handlers: ['click-rail', 'drag-scrollbar', 'wheel', 'touch']
                },
                showDeployModal: false,
                showExecutionModal: false,
                tasksRendered: false,
                showToolbarInternal: true,
                showTaskDecorationInternal: false,

                zoomInEnabled: true,
                zoomOutEnabled: true,
                zoom: this.initialZoom
            };
        },
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
                if (this.renderFrom) {
                    if (this.renderFrom && this.renderFrom.tasks) {
                        return this.renderFrom.tasks;
                    } else {
                        return {};
                    }
                } else {
                    return this.workflow.tasks;
                }
            },
            groups() {
                return this.$store.getters.getGroups;
            },
            zoomPercent: function () {
                return `${Math.round(100 * this.zoom, 0)}%`;
            }
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
        created() {
            const self = this;

            if (this.$route.params.id) {
                this.changeWorkflowId(this.$route.params.id);
                this.init();
            }
            this.$root.$on('onclick-task', taskComponent => {
                if (! this.selectedElements.includes(taskComponent.task.id)){
                    this.selectedTask = taskComponent.task;
                    this.selectedElements = [taskComponent.task.id];
                }
            });
            // this.$on('oncancel-deploy', () => {
            //   this.setZoomPercent(null, this.oldZoom);
            //   this.showToolbarInternal = true;
            //   this.showTaskDecorationInternal = false;
            // });
            this.$root.$on('onremove-task', task => {
                this.removeTask(task);
            });
            this.$root.$on('onkeyboard-keyup', ev => {
                this.keyboardKeyUpHandler(ev);
            });
            this.$root.$on('on-align-tasks', (pos, fn) => {
                this.align(pos, fn);
            });
            // this.$on('xupdate-form-field-value', (field, value) => {
            //   this.$emit('update-form-field-value-in-diagram', field, value);
            //   this.updateAttributeSuggestion();
            // });

            // Highlight which operations can be target for a new flow.
            this.$root.$on('onstart-flow', interfaceName => {
                this.clearSelection(null);
                let sourceInterfaces = new Set(interfaceName.split(' '));
                this.instance.selectEndpoints().each(endPoint => {
                    if (endPoint.isTarget) {
                        let intersection = endPoint.scope
                            .split(' ')
                            .filter(Set.prototype.has, sourceInterfaces);
                        if (intersection.length > 0) {
                            endPoint.element.classList.add('selected');
                        }
                    }
                });
            });

            this.$root.$on('onstop-flow', interfaceName => {
                this.instance.selectEndpoints().each(endPoint => {
                    if (endPoint.isTarget) {
                        endPoint.element.classList.remove('selected');
                    }
                });
            });

            self.$root.$on('ontask-ready', task => {
                self.readyTasks.add(task.id);
                //Evaluates if flow can be draw now (both endpoints were created)
                const candidates = self.workflow.flows.filter(flow => {
                    return (
                        (flow['target_id'] === task.id || flow['source_id'] === task.id) &&
                        self.readyTasks.has(flow['target_id']) &&
                        self.readyTasks.has(flow['source_id'])
                    );
                });

                candidates.forEach(flow => {
                    let uuids = flow.uuids || [
                        `${flow['source_id']}/${flow['source_port']}`,
                        `${flow['target_id']}/${flow['target_port']}`
                    ];

                    const connection = self.instance.connect({ uuids });
                    connection.bind('mouseover', (c, originalEvent) => {
                        //var arr = self.instance.select({ source: con.sourceId, target: con.targetId });
                        if (originalEvent) {
                            const currentStyle = c ? c.getPaintStyle() : null;
                            currentStyle.lineWidth = 20;
                            currentStyle.outlineColor = '#ed8';
                            c.setPaintStyle(currentStyle);
                            self.instance.repaintEverything();
                        }
                    });
                    const currentStyle = connection ? connection.getPaintStyle() : null;
                    if (currentStyle) {
                        currentStyle[
                            'strokeStyle'
                        ] = connection.endpoints[0].getPaintStyle().fillStyle;
                        currentStyle['stroke'] = connection.endpoints[0].getPaintStyle().fill;
                        connection.setPaintStyle(currentStyle);
                    }
                });
            });
        },

        beforeDestroy() {
            this.$root.$off('ontask-ready');
            this.$root.$off('onkeyboard-keyup');
            this.readyTasks = new Set();
        },

        mounted() {
            const self = this;
            // Required, otherwise zoom will not work.
            // It seems that jsplumb is loosing this setting between
            // calls to init() and mounted()
            this.instance.setContainer('lemonade-diagram');

            this.readyTasks = new Set();
            // this.$root.$refs.toastr.defaultPosition = 'toast-bottom-full-width';
            this.currentZIndex = 10;

            //this.init();
            self.diagramElement = self.$refs.diagram;
            this.setZoom(
                parseFloat(self.zoom),
                self.instance,
                null,
                self.diagramElement
            );

            /* scroll bars */
            // @FIXME PerfectScrollbar.initialize(self.diagramElement.parentElement);

            this.$el.addEventListener('keyup', this.keyboardKeyUpTrigger, true);

            /* selection by dragging */
            self.diagramElement.addEventListener('mousedown', ev => {
                if (self.$refs.diagram === ev.target) {
                    let rightClick =
                        ev.which === 3 || ev.button == 2; // Gecko (Firefox), WebKit (Safari/Chrome) & Opera // IE, Opera

                    if (rightClick) {
                        return;
                    }
                    self.clearSelection(ev);
                    let ghostSelect = self.$refs.ghostSelect;
                    ghostSelect.classList.add('ghost-active');
                    ghostSelect.style.left = ev.offsetY + 'px';
                    ghostSelect.style.top = ev.offsetX + 'px';
                    ghostSelect.style.width = '0px';
                    ghostSelect.style.height = '0px';

                    self.initialW = ev.offsetX;
                    self.initialH = ev.offsetY;
                    document.addEventListener('mouseup', self.selectElements);
                    document.addEventListener('mousemove', self.openSelector);
                }
            });
            if (self.shink) {
                // const z = parseFloat(self.zoom);
                // const width = z * (Math.max.apply(null, self.workflow.tasks.map(t => t.left)) + 200);
                // const height = z * (Math.max.apply(null, self.workflow.tasks.map(t => t.top)) + 200);
                self.$refs.diagram.style.width = '100%'; //width + 'px';
                self.$refs.diagram.style.height = '100%';
            }
        },
        methods: {
            scrollHandle() { },
            changeCluster() {
                let self = this;
                let c = self.clusters.filter(c => c.id === self.cluster);
                if (c.length) {
                    this.clusterDescription = c[0].description;
                }
            },
            removeSelectedTasks() {
                // Two steps, because this.removeTask changes the array used in the loop
                const tasksToRemove = this.workflow.tasks.filter(task => {
                    return lodash.includes(this.selectedElements, task.id);
                });
                tasksToRemove.forEach(this.removeTask);
            },
            toggleTasks() {
                this.workflow.tasks.forEach(task => {
                    if (lodash.includes(this.selectedElements, task.id)) {
                        task.enabled = !task.enabled;
                    }
                });
            },
            addGroup() {
                let self = this;
                let group = {};
                self.$store.dispatch('addGroup', group);
                return false;
            },
            deploy(ev) {
                this.$emit('onshow-deploy');
                this.oldZoom = this.zoom;
                this.setZoomPercent(ev, 0.85);
                this.showToolbarInternal = false;
                this.showTaskDecorationInternal = true;
                // if (false) {
                //     let self = this;
                //     let dataSources = self.tasks.filter(task => {
                //         return (
                //             task.operation.categories.filter(cat => {
                //                 return cat.type === 'data source';
                //             }).length > 0
                //         );
                //     });
                //     let ports = self.tasks.map(task => {
                //         let dataPorts = task.operation.ports.filter(port => {
                //             let itfs = port.interfaces.filter(iface => {
                //                 return iface.name === 'Data' || iface.name === 'IData';
                //             });
                //             return itfs.length > 0 && port.type === 'OUTPUT';
                //         });
                //         return [task, dataPorts];
                //     });
                //     self.showDeployModal = true;
                //     self.deployInfo['dataSources'] = dataSources;
                //     self.deployInfo['ports'] = ports;
                // }
                ev.preventDefault();
                return false;
            },
            addTask(task) {
                task.forms = {};
                task.operation.forms.forEach(f => {
                    f.fields.forEach(field => {
                        task[field.name] = field['default'] || '';
                    });
                });
                task.name = `${task.operation.name} ${this.workflow.tasks.length}`;
                task.enabled = true;
                this.$root.$emit('addTask', task);
            },

            removeTask(task) {
                const self = this;
                //this.instance.detachAllConnections(task.id);
                this.instance.deleteConnectionsForElement(task.id);
                this.instance.removeAllEndpoints(task.id);
                //this.instance.detach(task.id);
                /*let elem = document.getElementById(task.id)
                          if (elem){
                              elem.parentNode.removeChild(elem);
                          }*/

                //console.debug(this.instance.getConnections());
                this.instance.repaintEverything();
                const inx = this.workflow.tasks.indexOf(task);
                if (inx >= 0) {
                    this.workflow.tasks.splice(inx, 1);
                } else {
                    console.debug('Not found');
                }

                this.nextTick(function () {
                    self.clearSelection();
                    self.instance.repaintEverything();
                });
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
                this.$root.$emit('changeWorkflowName', name);
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
                    Endpoints: [['Dot', { radius: 2 }], ['Dot', { radius: 1 }]],
                    EndpointHoverStyle: { fillStyle: 'orange' },
                    HoverPaintStyle: { strokeStyle: 'blue' }
                });
                if (this.initialZoom) instance.setZoom(this.initialZoom);
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
                window.addEventListener('resize', e => {
                    self.instance.repaintEverything();
                });
            },
            selectElements(ev) {
                if (this.multipleSelectionEnabled) {
                    //$("#score>span").text('0');
                    let self = this;
                    document.removeEventListener('mousemove', self.openSelector);
                    document.removeEventListener('mouseup', self.selectElements);

                    self.initialW = 0;
                    self.initialH = 0;

                    let ghostSelect = self.$refs.ghostSelect;
                    let x1 = parseInt(ghostSelect.style.left);
                    let y1 = parseInt(ghostSelect.style.top);
                    let x2 = parseInt(ghostSelect.style.width) + x1;
                    let y2 = parseInt(ghostSelect.style.height) + y1;

                    ghostSelect.classList.remove('ghost-active');
                    ghostSelect.style.width = 0;
                    ghostSelect.style.height = 0;

                    this.$emit('onclear-selection');

                    self.workflow.tasks.forEach(task => {
                        let taskElem = document.getElementById(task.id);
                        if (taskElem) {
                            let bounds = taskElem.getBoundingClientRect();

                            // Uses task left and top because offset calculation
                            // was already done
                            // console.log(x1 <= task.left, x2 >= task.left + bounds.width,
                            //   y1 <= task.top, y2 >= task.top + bounds.height,
                            //   bounds.width, bounds.height, x1, x2, y1, y2)


                            if (
                                x1 <= task.left &&
                                x2 >= task.left + bounds.width &&
                                y1 <= task.top &&
                                y2 >= task.top + bounds.height
                            ) {
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
                if (ev.which === 1 && this.multipleSelectionEnabled) {
                    //left mouse
                    let self = this;
                    let rect = this.diagramElement.getBoundingClientRect();
                    let x = ev.pageX - rect.left;
                    let y = ev.pageY - rect.top;
                    let w = Math.abs(self.initialW - x);
                    let h = Math.abs(self.initialH - y);

                    let ghostSelect = self.$refs.ghostSelect;
                    ghostSelect.style.display = '';

                    ghostSelect.style.width = w + 'px';
                    ghostSelect.style.height = h + 'px';

                    ghostSelect.style.left = Math.min(x, self.initialW) + 'px';
                    ghostSelect.style.top = Math.min(y, self.initialH) + 'px';
                    /*
                    if (ev.offsetX <= self.initialW && ev.offsetY >= self.initialH) {
                    elem.style.left = ev.offsetX + 'px';
                    } else if (ev.offsetY <= self.initialH && ev.offsetX >= self.initialW) {
                        elem.style.top = ev.offsetY + 'px';
                    } else if (ev.offsetY < self.initialH && ev.offsetX < self.initialW) {
                        elem.style.left = ev.offsetX + 'px';
                        elem.style.top = ev.offsetY + 'px';
                        //console.debug('3bopenselector (x, y)', ev.offsetX, ev.offsetY, elem.style.left, elem.style.top)
                    }*/
                }
            },
            clearSelection(ev) {
                if (ev && ev.target.taskName === 'path') {
                    // click on flow
                    return;
                }
                let self = this;
                let tasks = document.querySelectorAll('.task');

                self.instance.clearDragSelection();
                self.selectedElements.length = 0;
                Array.prototype.slice.call(tasks, 0).forEach(e => {
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
                self.instance.select().setPaintStyle(connectorPaintStyle);
                connection.setPaintStyle({
                    lineWidth: 2,
                    radius: 1,
                    strokeStyle: 'rgba(242, 141, 0, 1)'
                });
                let tasks = document.querySelectorAll('.task.selected');
                Array.prototype.slice.call(tasks, 0).forEach(e => {
                    e.classList.remove('selected');
                });
                e.stopPropagation();
                e.preventDefault();
            },
            drop(ev) {
                const self = this;
                ev.preventDefault();

                let operation = this.getOperationFromId(ev.dataTransfer.getData('id'));

                if (!operation) {
                    return;
                }
                let classes = operation.categories
                    .map(c => {
                        return c.type.replace(' ', '-');
                    })
                    .join(' ');
                self.addTask({
                    id: self.generateId(),
                    operation,
                    operation_id: operation.id,
                    left: ev.offsetX,
                    top: ev.offsetY,
                    z_index: ++self.currentZIndex,
                    classes,
                    status: 'WAITING',
                    height: 0,
                    width: 0
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
            keyboardKeyUpTrigger(ev) {
                this.$root.$emit('onkeyboard-keyup', ev);
            },
            keyboardKeyUpHandler(ev) {
                let self = this;
                let task = self.selectedTask
                let tasks = self.workflow.tasks
                    .filter(task => {
                        return lodash.includes(self.selectedElements, task.id);
                    })
                let inc = ev.ctrlKey ? 10 : 1;


                switch (ev.code) {
                    case 'Delete':
                        if (task) {
                            this.deleteTask(task);
                        } else if (tasks.length) {
                            this.deleteTasks(tasks)
                        }
                        break;
                    case 'ArrowRight':
                        if (task) {
                            this.moveTask({ task, position: 'right', inc })
                        } else if (tasks.length) {
                            this.moveTasks({ tasks, position: 'right', inc })
                        }
                        break;
                    case 'ArrowLeft':
                        if (task) {
                            this.moveTask({ task, position: 'left', inc })
                        } else if (tasks.length) {
                            this.moveTasks({ tasks, position: 'left', inc })
                        }
                        break;
                    case 'ArrowUp':
                        if (task) {
                            this.moveTask({ task, position: 'up', inc })
                        } else if (tasks.length) {
                            this.moveTasks({ tasks, position: 'up', inc })
                        }
                        break;
                    case 'ArrowDown':
                        if (task) {
                            this.moveTask({ task, position: 'down', inc })
                        } else if (tasks.length) {
                            this.moveTasks({ tasks, position: 'down', inc })
                        }
                        break;
                    case 'KeyC':
                        if (ev.ctrlKey) {
                            if (task) {
                                this.copyTask(task)
                            } else if (tasks.length) {
                                this.copyTasks(tasks)
                            }
                        }
                        break;
                    case 'KeyV':
                        if (ev.ctrlKey) {
                            let offsetLeft = Math.floor(Math.random() * 50) + 30;
                            let offsetTop = Math.floor(Math.random() * 20) + 10;

                            if (self.copiedTask) {
                                this.pasteTask({ task: self.copiedTask, offsetLeft, offsetTop })
                            } else if (self.copiedTasks.length) {
                                this.pasteTasks({ tasks: self.copiedTasks, offsetLeft, offsetTop })
                            }
                        }
                        break;
                }

                self.instance.repaintEverything();
                ev.stopPropagation();
            },
            deleteTask(task) {
                let self = this;

                if (self.selectedTask.id == task.id) {
                    self.selectedTask = null;
                }

                self.$root.$emit('onremove-task', task);
            },
            deleteTasks(tasks) {
                let self = this;
                let tasks_ids = tasks.flatMap(task => { return task.id })

                tasks.forEach(task => {
                    self.$root.$emit('onremove-task', task);
                })

                self.selectedElements = self.selectedElements.filter((v, i, arr) => {
                    return !tasks_ids.includes(v)
                })
            },
            moveTask({ task, position, inc }) {
                let elem = document.getElementById(task.id);
                let v = 0;

                switch (position) {
                    case 'right':
                        v = parseInt(elem.style.left, 10) + inc;
                        elem.style.left = `${v}px`;
                        task.left = v;
                        break;
                    case 'left':
                        v = parseInt(elem.style.left, 10) - inc;
                        elem.style.left = `${v}px`;
                        task.left = v;
                        break;
                    case 'up':
                        v = parseInt(elem.style.top, 10) - inc;
                        elem.style.top = `${v}px`;
                        task.top = v;
                        break;
                    case 'down':
                        v = parseInt(elem.style.top, 10) + inc;
                        elem.style.top = `${v}px`;
                        task.top = v;
                        break;
                }
            },
            moveTasks({ tasks, position, inc }) {
                tasks.forEach(task => {
                    this.moveTask({ task, position, inc });
                })
            },
            copyTask(task) {
                this.copiedTasks = []
                this.copiedTask = task;
            },
            copyTasks(tasks) {
                this.copiedTask = null;
                this.copiedTasks = tasks;
            },
            pasteTask({ task, offsetLeft, offsetTop }) {
                let self = this;
                let copiedTask = JSON.parse(JSON.stringify(task));

                copiedTask.id = self.generateId();
                copiedTask.left = copiedTask.left + offsetLeft
                copiedTask.top = copiedTask.top + offsetTop
                copiedTask.z_index = ++self.currentZIndex;
                copiedTask.name = `${copiedTask.operation.name} ${self.workflow.tasks.length}`;
                copiedTask.enabled = true;

                this.$root.$emit('addTask', copiedTask);
                return copiedTask;
            },
            pasteTasks({ tasks, offsetLeft, offsetTop }) {
                const self = this;
                const dic = {};
                const tasksIds = tasks.flatMap(task => { return task.id });

                self.clearSelection();
                self.$emit('onclear-selection');

                tasks.forEach(task => {
                    let newTask = self.pasteTask({ task, offsetLeft, offsetTop });
                    dic[task.id] = newTask.id;
                })

                self.workflow.flows.forEach(flow => {
                    if (tasksIds.includes(flow.source_id) && tasksIds.includes(flow.target_id)) {
                        let copiedFlow = JSON.parse(JSON.stringify(flow));
                        copiedFlow.source_id = dic[flow.source_id];
                        copiedFlow.target_id = dic[flow.target_id];
                        self.$root.$emit('addFlow', copiedFlow);
                    }
                });
                self.$nextTick(() => {
                    Object.values(dic).forEach((v) => {
                        // Keep pasted tasks selected
                        self.instance.addToDragSelection(v);
                        self.selectedElements.push(v);
                    });
                });
                
            },
            diagramClick(ev) {
                if (ev.target.classList.contains('diagram')) {
                    ev.preventDefault();
                    this.clearSelection(ev);
                }
                this.$root.$emit('onclear-selection');
            },
            generateId() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
                    c
                ) {
                    let r = (Math.random() * 16) | 0,
                        v = c == 'x' ? r : (r & 0x3) | 0x8;
                    return v.toString(16);
                });
            },

            setZoom(zoom, instance, transformOrigin, el) {
                transformOrigin = transformOrigin || [0.5, 0.5];
                //instance = instance || jsPlumb;
                el = el || instance.getContainer();
                var p = ['webkit', 'moz', 'ms', 'o'],
                    s = 'scale(' + zoom + ')',
                    oString =
                        transformOrigin[0] * 100 + '% ' + transformOrigin[1] * 100 + '%';

                for (var i = 0; i < p.length; i++) {
                    el.style[p[i] + 'Transform'] = s;
                    el.style[p[i] + 'TransformOrigin'] = oString;
                }
                //instance.setZoom(zoom);

                el.style['transform'] = s;
                el.style['transformOrigin'] = '0% 0% 0px'; //oString;

                let adjust = (1.0 / zoom) * 5000 + 'px';
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
                self.zoom += 0.1;
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
                self.zoom -= 0.1;
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
                let selectedTasks = this.workflow.tasks
                    .filter(task => {
                        return lodash.includes(this.selectedElements, task.id);
                    })
                    .sort((a, b) => {
                        return a[prop] - b[prop];
                    });
                if (selectedTasks.length) {
                    let gap = 0;
                    let pos = 0;
                    selectedTasks.forEach((t, inx) => {
                        let elem = document.getElementById(t.id);
                        if (inx !== 0) {
                            gap += t[prop] - pos;
                        }
                        pos = t[prop] + parseInt(elem.offsetWidth);
                    });
                    let distance = (gap * 1.0) / (selectedTasks.length - 1);
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
                    });
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
                let selectedTasks = this.workflow.tasks.filter(task => {
                    return lodash.includes(this.selectedElements, task.id);
                });
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
                    });
                }
            },
            scrollToTask(taskId) {
                let elemTask = document.getElementById(taskId);
                let container = self.diagramElement.parentElement;
                container.scrollTop = parseInt(elemTask.style.top);
                container.scrollLeft = parseInt(elemTask.style.left);
            },
            cancelExecute() {
                this.showExecutionModal = false;
            },
            execute() {
                this.showExecutionModal = false;

                let cloned = JSON.parse(JSON.stringify(this.workflow));
                cloned.platform_id = cloned.platform.id;
                cloned.tasks.forEach(task => {
                    task.operation = { id: task.operation.id };
                    delete task.version;
                });

                let body = {
                    workflow: cloned,
                    cluster: { id: this.cluster },
                    name: this.name,
                    user: {
                        id: 0,
                        login: '',
                        name: ''
                    }
                };
                let self = this;

                let locale = this.$store.getters.getLanguage;
                let headers = {
                    'X-Auth-Token': authToken,
                    Locale: locale
                };
                Vue.http
                    .post(`${standUrl}/jobs`, body, { headers })
                    .then(function (response) {
                        self.$router.push({
                            name: 'job-child-diagram',
                            params: {
                                id: response.body.data.id,
                                platform: self.platform
                            }
                        });
                    })
                    .catch(ex => {
                        if (ex.body) {
                            self.$root.$refs.toastr.e(ex.body.message);
                        } else if (ex.status === 0) {
                            self.$root.$refs.toastr.e(
                                `Error connecting to the backend (connection refused).`
                            );
                        } else {
                            self.$root.$refs.toastr.e(`Unhandled error: ${JSON.stringify(ex)}`);
                        }
                    });
            },
            onClickExecute() {
                let self = this;
                let headers = {
                    'X-Auth-Token': authToken
                };
                // Retrieve clusters
                Vue.http
                    .get(`${standUrl}/clusters`, { headers })
                    .then(response => {
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
                            self.$root.$refs.toastr.e(
                                'Unable to execute workflow: There is not cluster available.'
                            );
                        }
                    })
                    .catch(ex => {
                        if (ex.body) {
                            self.$root.$refs.toastr.e(ex.body.message);
                        } else if (ex.status === 0) {
                            self.$root.$refs.toastr.e(
                                `Error connecting to the backend (connection refused).`
                            );
                        } else {
                            self.$root.$refs.toastr.e(`Unhandled error: ${JSON.stringify(ex)}`);
                        }
                    });
            },
            _fixGroupConnections(self) {
                return function (group) {
                    let members = group.getMembers();
                    let groupConnections = group.connections;
                    ['internal', 'source', 'target'].forEach(m => {
                        groupConnections[m].length = 0;
                    });
                    members.forEach(member => {
                        let connections = self.instance
                            .getConnections({ scope: '*', target: member.id })
                            .concat(
                                self.instance.getConnections({ scope: '*', source: member.id })
                            );
                        connections.forEach(conn => {
                            if (conn.target === member) {
                                if (members.indexOf(conn.source) > -1) {
                                    if (groupConnections.internal.indexOf(conn) === -1) {
                                        groupConnections.internal.push(conn);
                                    }
                                } else if (groupConnections.target.indexOf(conn) === -1) {
                                    groupConnections.target.push(conn);
                                }
                            } else if (conn.source === member) {
                                if (members.indexOf(conn.target) > -1) {
                                    if (groupConnections.internal.indexOf(conn) === -1) {
                                        groupConnections.internal.push(conn);
                                    }
                                } else if (groupConnections.source.indexOf(conn) === -1) {
                                    groupConnections.source.push(conn);
                                }
                            }
                        });
                    });
                };
            },
            _customUpdateConnectionsForGroup(_jsPlumb) {
                // return function (group) {
                //     var members = group.getMembers();
                //     var c1 = _jsPlumb.getConnections({ source: members, scope: '*' }, true);
                //     var c2 = _jsPlumb.getConnections({ target: members, scope: '*' }, true);
                //     var processed = {};
                //     group.connections.source.length = 0;
                //     group.connections.target.length = 0;
                //     var oneSet = function (c) {
                //         for (var i = 0; i < c.length; i++) {
                //             if (processed[c[i].id]) {
                //                 continue;
                //             }
                //             processed[c[i].id] = true;
                //             if (c[i].source._jsPlumbGroup === group) {
                //                 if (c[i].target._jsPlumbGroup !== group) {
                //                     group.connections.source.push(c[i]);
                //                 }
                //                 _connectionSourceMap[c[i].id] = group;
                //             }
                //             else if (c[i].target._jsPlumbGroup === group) {
                //                 group.connections.target.push(c[i]);
                //                 _connectionTargetMap[c[i].id] = group;
                //             }
                //         }
                //     };
                //     oneSet(c1); oneSet(c2);
                // }
            },
            _bindJsPlumbEvents() {
                let self = this;
                self.instance.getGroupManager().updateConnectionsForGroup = self._fixGroupConnections(
                    self
                );
                // self.instance.getContainer().addEventListener('click', function (ev) {
                //     //self.clearSelection(ev);
                // });
                // self.instance.bind("click", self.flowClick);

                self.instance.bind('group:removeMember', p => {
                    console.log('Group', p.group.id, 'removed', p.el.id);
                    self._fixGroupConnections(self, p);
                });
                self.instance.bind('group:addMember', p => {
                    p.el._katavorioDrag.setConstrain(false);
                    console.log('Group', p.group.id, 'added', p.el.id);
                    self._fixGroupConnections(self, p);
                });
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
                        let [source_id, source_port] = info.sourceEndpoint
                            .getUuid()
                            .split('/');
                        let [target_id, target_port] = info.targetEndpoint
                            .getUuid()
                            .split('/');
                        let source_port_name = '';
                        let target_port_name = '';
                        // self.instance.detach(con);
                        const flow = {
                            source_id,
                            source_port,
                            target_id,
                            target_port,
                            source_port_name,
                            target_port_name
                        };
                        self.$root.$emit('addFlow', flow, con);
                    }
                });
                self.instance.setContainer('lemonade-diagram');
            }
        },
    });

    export default DiagramComponent;
</script>

<style scoped lang="scss">
    .scroll-area {
        width: 100%;
        height: 82vh;
        max-height: calc(100vh - 300px);
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
        outline: none;

        section:focus,
        div:focus {
            outline: none;
        }
    }

    .news {
        margin-left: 5px;
        color: #888;
    }
</style>