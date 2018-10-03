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
            <diagram :workflow="workflow" :operations="operations" ref="diagram"></diagram>
            <slideout-panel :opened="showProperties">
                <property-window></property-window>
            </slideout-panel>
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