<template>
    <div class="row" style="overflow:hidden">
        <TahitiSuggester/>
        <div class="col-md-12">
            <diagram-toolbar :workflow="workflow"></diagram-toolbar>
        </div>
        <div class="col-md-2">
            <toolbox :operations="operations"></toolbox>
        </div>
        <div class="col-md-10 pl-0" style="position: relative">
            <diagram :workflow="workflow" ref="diagram" id="main-diagram" :operations="operations" v-if="loaded"></diagram>
            <slideout-panel :opened="showProperties">
                <property-window :task="selectedTask.task" :suggestions="getSuggestions(selectedTask.task.id)" />
            </slideout-panel>
            <!--
            <slideout-panel :opened="showProperties" style="position: absolute; right:360px; height:100px">
                <div class="p-3" style="font-size: .8rem; border: 1px solid; background: #fff; width: 500px; height: 400px; z-index: 0">
                    <VuePerfectScrollbar>
                        <div style="margin-right:20px">
                            <h5>{{selectedTask.task.operation.name}}</h5>
                            <div v-for="form in selectedTask.task.operation.forms">
                                <dl v-for="field in form.fields">
                                    <dt>{{field.label}}</dt>
                                    <dd>{{field.help}}</dd>
                                </dl>
                            </div>
                        </div>
                    </VuePerfectScrollbar>
                </div>
            </slideout-panel>
        -->
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
                            <button class="btn btn-sm btn-danger" @click="restore(h.version)">{{$t('actions.restore')}}</button>
                        </td>
                    </tr>
                </table>
            </div>
            <div slot="modal-footer" class="w-100">
                <b-btn @click="closeHistory" variant="secondary_sm" class="float-right">{{$t('actions.cancel')}}</b-btn>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import SlideOut from 'vue-slideout-panel'
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import DiagramComponent from '../components/Diagram.vue'
    import PropertyWindow from '../components/PropertyWindow.vue'
    import DiagramToolbarComponent from '../components/DiagramToolbar.vue'
    import ToolboxComponent from '../components/Toolbox.vue'
    import SlideOutPanel from '../components/SlideOutPanel.vue'
    import html2canvas from 'html2canvas';
    import Notifier from '../mixins/Notifier'
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL

    // let TahitiAttributeSuggester = undefined;
    export default {
        mixins: [Notifier],
        components: {
            'diagram': DiagramComponent,
            'diagram-toolbar': DiagramToolbarComponent,
            'toolbox': ToolboxComponent,
            'slideout-panel': SlideOutPanel,
            'property-window': PropertyWindow,
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
                workflow: {},
                loaded: true,
                operations: [],
                history: [],
                operationsLookup: new Map(),
                showProperties: false,
                selectedTask: { task: { operation: {} } },
                propertyStyles: [
                    {
                        top: '112px',
                        height: 'calc(92vh - 112px)'
                    },
                    {

                        backgroundColor: '#fff',
                        paddingTop: '2rem',
                        paddingBottom: '1rem',
                        overflow: 'hidden'
                    },
                    {
                        overflow: 'hidden'
                    },
                    {

                        color: '#555',
                        textDecoration: 'none',
                        top: '8px',
                        right: '1rem'
                    }
                ]
            }
        },
        mounted() {
            let self = this
            this.$root.$on('onclick-task', (taskComponent) => {
                this.showProperties = true;
                this.selectedTask = taskComponent;
                this.updateAttributeSuggestion();
            });
            this.$root.$on('on-error', (e) => {
                this.error(e);
            });
            this.$root.$on('onsave-as-image', () => {
                this.saveAsImage()
            });
            this.$root.$on('onsave-workflow', () => {
                this.saveWorkflow()
            });
            this.$root.$on('onblur-selection', () => {
                this.showProperties = false;
                this.selectedTask = { task: {} };
            });
            this.$root.$on('onalign-tasks', (pos, fn) => {
                this.$refs.diagram.align(pos, fn)
            });
            this.$root.$on('ondistribute-tasks', (how, prop) => {
                this.$refs.diagram.distribute(how, prop)
            });
            this.$root.$on('update-form-field-value', (field, value) => {
                if (self.selectedTask.task.forms[field.name]) {
                    self.selectedTask.task.forms[field.name].value = value
                } else {
                    self.selectedTask.task.forms[field.name] = { value: value }
                }
            });
            /* Task related */
            this.$root.$on('addTask', (task) => {
                this.workflow.tasks.push(task);
            });

            this.$root.$on('addFlow', (flow) => {
                flow.id = `${flow.source_id}/${flow.source_port}-${flow.target_id}/${flow.target_port}`;
                this.workflow.flows.push(flow);
            });
            this.$root.$on('onshow-history', this.showHistory);
            this.load();
        },
        watch: {
            '$route.params.id': function (id) {
                this.$refs.diagram.clearWorkflow();
                this.load();
            }
        },
        methods: {
            load() {
                let self = this;
                axios.get(`${tahitiUrl}/workflows/${this.$route.params.id}`).then(
                    (resp) => {
                        let workflow = resp.data;
                        this.$Progress.start()
                        axios.get(`${tahitiUrl}/operations?platform=${this.$route.params.platform}`).then(
                            (resp) => {
                                self.operations = resp.data
                                self.operations.forEach((op) => {
                                    self.operationsLookup[op.id] = op
                                })
                                workflow.tasks.forEach((task) => {
                                    task.operation = self.operationsLookup[task.operation.id]
                                });
                                self.workflow = workflow;
                                this.updateAttributeSuggestion();
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
            getSuggestions() {
                if (this.attributeSuggestion && this.selectedTask) {
                    return this.attributeSuggestion[this.selectedTask.task.id]
                } else {
                    return []
                }
            },
            saveAsImage() {
                let self = this
                let $elem = this.$refs.diagram.$el.querySelector('.lemonade')
                html2canvas($elem, {
                    width: 3000, height: 3000, logging: false, allowTaint: false,
                    onclone: (clone) => {
                        let elem = clone.getElementById($elem.id);
                        elem.parentElement.style.height = '10000px';
                        elem.style.transform = 'inherit';
                        elem.parentElement.scrollTop = 0;
                    }
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

                        let targetCanvas = document.createElement('canvas');
                        let targetCtx = targetCanvas.getContext('2d');
                        let padding = 100;
                        targetCanvas.width = x1 + 2 * padding;
                        targetCanvas.height = y1 + 2 * padding;
                        targetCtx.fillStyle = "white";
                        targetCtx.fillRect(0, 0, targetCanvas.width, canvas.height);


                        let ctx = canvas.getContext('2d');
                        let $flows = document.getElementsByClassName('jtk-connector'); //'jsplumb-connector'
                        for (var flow of $flows) {
                            //let xml = flow.innerHTML.replace(new RegExp('xmlns="http://www.w3.org/\\d+/(xhtml|svg)" ', 'g'), '').replace(
                            //    new RegExp('version="1.1"', 'g'), '');;
                            let xml = '<path d="M 0 -0.5 L 0 30.5 L 0 41 A 1 1 0 0,0 1 42 L 1.5 42 A 0.5 0.5 0 0,1 2 42.5 L 2 54.5 L 2 84 " transform="translate(1.9999999999999991,1)" pointer-events="visibleStroke" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#111" style=""></path>'
                            xml = `<svg width="${flow.width.baseVal.value}" height="${flow.height.baseVal.value}" xmlns="http://www.w3.org/2000/svg">${xml}</svg>`;
                            console.debug(xml)
                            let DOMURL = window.URL || window.webkitURL || window;
                            let img = new Image();
                            let svg = new Blob([xml], { type: 'image/svg+xml' });
                            let url = DOMURL.createObjectURL(svg);
                            let left = parseInt(flow.style.left);
                            let top = parseInt(flow.style.top);
                            img.onload = function () {
                                targetCtx.drawImage(img, left, top);
                                DOMURL.revokeObjectURL(url);
                            }

                            img.src = 'data:image/svg+xml;base64, ' + btoa(xml) //url;
                        }
                        /**/
                        let $endpoints = document.querySelectorAll('.jtk-endpoint > svg')
                        let b64Start = 'data:image/svg+xml;base64,';
                        for (var endpoint of $endpoints) {
                            let xml = endpoint.innerHTML.replace(new RegExp('xmlns="http://www.w3.org/1999/xhtml" ', 'g'), '');
                            xml = `<svg width="25" height="25" xmlns="http://www.w3.org/2000/svg">${xml}</svg>`;

                            let DOMURL = window.URL || window.webkitURL || window;
                            let img = new Image();
                            let svg = new Blob([xml], { type: 'image/svg+xml' });
                            let url = DOMURL.createObjectURL(svg);
                            let left = endpoint.parentElement.offsetLeft;
                            let top = endpoint.parentElement.offsetTop;
                            img.onload = function () {
                                targetCtx.drawImage(img, left, top);
                                DOMURL.revokeObjectURL(url);
                            }

                            img.src = url;
                        }
                        window.setTimeout(() => {
                            //document.body.appendChild(canvas);
                            //targetCtx.translate(-x0 + 50, -y0 + 50);


                            targetCtx.drawImage(canvas, 0, 0);

                            targetCtx.fillStyle = "black";
                            targetCtx.font = "12pt Verdana";
                            targetCtx.fillText(`${self.workflow.name}. Image generated at ${new Date()}`,
                                20, targetCanvas.height - 20);
                            targetCtx.lineWidth = 4;
                            targetCtx.strokeStyle = "#000000";
                            targetCtx.strokeRect(0, 0, targetCanvas.width, targetCanvas.height);
                            //document.body.appendChild(targetCanvas);
                            let link = document.createElement('a');
                            link.setAttribute('download', `workflow_${self.workflow.id}.png`);
                            link.setAttribute('href', targetCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
                            link.click();
                        }, 1000);
                    });

            },
            saveWorkflow() {
                let self = this
                let cloned = JSON.parse(JSON.stringify(self.workflow));
                let url = `${tahitiUrl}/workflows`;
                let headers = { 'Content-Type': 'application/json' }

                let method = 'post'
                if (cloned.id !== 0) {
                    url = `${url}/${cloned.id}`;
                    method = 'patch'
                }
                cloned.platform_id = this.$route.params.platform;
                cloned.tasks.forEach((task) => {
                    task.operation = { id: task.operation.id };
                    delete task.version; //
                });

                axios[method](
                    `${tahitiUrl}/workflows/${this.$route.params.id}`,
                    cloned,
                    { headers }).then(
                    (resp) => {
                        let workflow = resp.data.data;
                        workflow.tasks.forEach((task) => {
                            task.operation = self.operationsLookup[task.operation.id]
                        });
                        self.workflow = workflow;
                        self.success(self.$t('messages.savedWithSuccess',
                            { what: self.$tc('titles.workflow') }));
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
                                    });
                                    self.success(self.$t('workflow.versionRestored',
                                        { version, version2: 2343 }));
                                    
                                    self.workflow = workflow;
                                    self.closeHistory();
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
                            self.$root.$refs.toastr.w('At least one data source is invalid in workflow');
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
</style>