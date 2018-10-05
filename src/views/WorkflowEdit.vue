<template>
    <div class="row" style="overflow:hidden">
        <div class="col-md-12">
            <diagram-toolbar :workflow="workflow"></diagram-toolbar>
        </div>
        <div class="col-md-2">
            <toolbox :operations="operations"></toolbox>
            <button @click="showProperties=!showProperties">Exibir</button>
        </div>
        <div class="col-md-10" style="position: relative">
            <diagram :workflow="workflow" ref="diagram"></diagram>
            <slideout-panel :opened="showProperties">
                <property-window :task="selectedTask.task"></property-window>
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
    </div>
</template>

<script>
    import axios from 'axios'
    import SlideOut from 'vue-slideout-panel'
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import DiagramComponent from '../components/Diagram.vue'
    import PropertyWindow from '../components/PropertyWindow.vue'
    import DiagramToolbarComponent from '../components/DiagramToolbar.vue'
    import ToolboxComponent from '../components/Toolbox.vue'
    import SlideOutPanel from '../components/SlideOutPanel.vue'

    let tahitiUrl = process.env.VUE_APP_TAHITI_URL
    export default {
        components: {
            'diagram': DiagramComponent,
            'diagram-toolbar': DiagramToolbarComponent,
            'toolbox': ToolboxComponent,
            'slideout-panel': SlideOutPanel,
            'property-window': PropertyWindow,
            VuePerfectScrollbar,

        },
        data() {
            return {
                workflow: {},
                operations: [],
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
            axios.get(`${tahitiUrl}/workflows/${this.$route.params.id}`).then(
                (resp) => {
                    let workflow = resp.data;
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
                        }
                    ).catch(function (e) {
                        this.dispatch('error', e);
                    }.bind(this));
                }
            ).catch(function (e) {
                this.dispatch('error', e);
            }.bind(this));
        },
    }
</script>
<style>
    .blackout {
        background-color: rgba(0, 0, 0, 0) !important;
    }
</style>