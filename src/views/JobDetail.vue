<template>
    <div class="row mb-5">
        <div class="col-md-12">
            <h3>{{job.name}}</h3>
        </div>
        <div class="col-md-12">
            <!-- Diagram></Diagram -->
            <div v-for="(step, inx) in sortedSteps" :key="inx">
                {{step.status}}
                <div v-for="log in step.logs" :key="log.id" class="ml-5" style="font-size:.9em">
                    <span class="badge-custom" :class="'badge badge-' + log.level.replace('ERROR', 'danger').toLowerCase()">
                        {{log.level}}
                    </span> &nbsp;
                    <span>{{step.date}}</span>
                    <span v-if="log.type === 'TEXT'">
                        {{log.message}}
                    </span>
                    <span v-else-if="log.type === 'HTML'">
                        HTML content
                        <div class="ml-5 html-div" v-html="log.message"></div>
                    </span>
                    <span v-else-if="log.type === 'STATUS'">
                        &#9733;{{log.message}} 
                    </span>
                    <div v-else>
                        {{log}}
                    </div>
                </div>
                <div v-for="(result, taskId) in getResults(step.task.id)" :key="taskId">
                    <div v-if="result && result.type === 'VISUALIZATION'">
                        <Visualization :url="getCaipirinhaLink(job.id, result.task.id)"></Visualization>
                    </div>
                    <div v-else>
                    {{result}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Diagram from '../components/Diagram.vue'
    import Visualization from '../components/Visualization.vue'
    import Notifier from '../mixins/Notifier'
    import axios from 'axios'
    let standUrl = process.env.VUE_APP_STAND_URL
    let caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL
    export default {
        mixins: [Notifier],
        components: {
            Diagram,
            Visualization
        },
        data(){
            return {
                job: {},
                results: new Map(),
                sortedSteps: []
            }
        },
        methods:{
            getResults(taskId){
                return {taskId: this.results[taskId]}
            },
            getCaipirinhaLink(jobId, taskId){
                return `${caipirinhaUrl}/visualizations/${jobId}/${taskId}?token=123456`
            }
        },
        mounted(){
            let self = this
            axios.get(`${standUrl}/jobs/${this.$route.params.id}`).then(
                (resp) => {
                    self.job = resp.data
                    self.sortedSteps = resp.data.steps.sort((s1, s2) => {
                        let result = -1
                        if (s1.logs.length){
                            if (s2.logs.length){
                                result = s1.logs[0].id - s2.logs[0].id
                            } else {
                                result = 1
                            }
                        }
                        return result
                    })
                    resp.data.results.forEach(result => {
                        self.results[result.task.id] = result
                    });
                }
            ).catch(function (e) {
                self.error(e);
            });
        }
    }
</script>
<style>
    .badge-custom {
        min-width: 80px
    }
    .html-div {
        border: 1px solid #ccc;
        margin: 10px;
        width: 90%;
        overflow: auto;
        font-size: .8em;
    }
    .html-div .table td, .html-div .table th {
        padding: .3rem;
    }
</style>

