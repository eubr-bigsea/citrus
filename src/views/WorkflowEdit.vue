<template>
    <div class="row" style="overflow:hidden">
        <div class="col-md-12">
            <diagram-toolbar :workflow="workflow"></diagram-toolbar>
        </div>
        <div class="col-md-2">
            <toolbox :operations="operations"></toolbox>
        </div>
        <div class="col-md-10">
            <diagram :workflow="workflow" :operations="operations" ref="diagram"></diagram>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import DiagramComponent from '../components/Diagram.vue'
    import DiagramToolbarComponent from '../components/DiagramToolbar.vue'
    import ToolboxComponent from '../components/Toolbox.vue'
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL
    export default {
        components: {
            'diagram': DiagramComponent,
            'diagram-toolbar': DiagramToolbarComponent,
            'toolbox': ToolboxComponent,
            VuePerfectScrollbar
        },
        data() {
            return {
                workflow: {},
                operations: [],
                operationsLookup: new Map()
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
                            self.operations.forEach((op) =>{
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