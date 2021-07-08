<template>
    <b-modal size="lg" ref="modal" :title="$t('workflow.execute')">
        <template v-if="clusters && clusters.length">
            <em v-if="validationErrors.length === 0">
                {{$t('workflow.required')}}:
            </em>
            <div v-if="validationErrors.length > 0" class="border p-2">
                <b class="text-danger">
                    {{$tc('workflow.validationExplanation', validationErrors.length)}}
                </b>
                <table class="table table-sm">
                    <tr>
                        <th>{{$tc('titles.tasks')}}</th>
                        <th>{{$tc('titles.property')}}</th>
                        <th>{{$tc('titles.error')}}</th>
                    </tr>
                    <tr v-for="err in validationErrors" :key="err.sequential">
                        <td>{{err.task.name}}</td>
                        <td>{{err.field}}</td>
                        <td>{{err.message}}</td>
                    </tr>
                </table>
            </div>
            <div class="mt-2 p-2 border">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4">
                            <label>{{$tc('titles.cluster')}}:</label>
                            <select v-model="clusterInfo.id" class="form-control-sm form-control"
                                @change="changeCluster">
                                <option v-for="option in clusters" v-bind:key="option.id" v-bind:value="option.id">
                                    {{ option.name }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-8">
                            <label>{{$t('workflow.jobName')}}
                                ({{$t('common.optional')}}):</label>
                            <input type="text" class="form-control form-control-sm" v-model="clusterInfo.jobName"
                                maxlength="50" />
                        </div>
                        <div class="col-md-12">
                            <small>{{clusterInfo.description}}</small>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div v-else class="alert alert-danger">
            <span class="fa fa-exclamation-circle"></span> {{$t("workflow.errorNoCluster")}}
        </div>
        <!--
        <div class="mt-2 p-2 border atmosphere" v-if="atmosphereExtension">
            <PerformanceEstimation :platform="workflow.platform" :clusterId="clusterInfo.id" :cluster="clusterInfo"
                :cores="performanceModel.cores" :setup="performanceModel.setup" ref="performanceModel" />
        </div>
        -->
        <div slot="modal-footer" class="w-100 text-right">
            <button v-if="clusters && clusters.length" class="btn btn-sm btn-outline-success" @click="execute($event)" id="mdl-execute-wf"
                ref="executeBtn">
                <span class="fa fa-play"></span> {{$t('actions.execute')}}</button>
            <button class="ml-1 btn btn-sm btn-outline-dark" @click="close">{{$t('actions.cancel')}}</button>
        </div>
    </b-modal>
</template>
<script>
    export default {
        props: {
            clusterInfo: {},
            clusters: { type: Array },
            validationErrors: { type: Array },
            workflow: {},
        },
        methods: {
            changeCluster() {
                const cluster = this.clusters.find((c) => c.id === this.clusterInfo.id);
                this.$root.$emit("onchange-cluster", cluster);
            },
            close() {
                this.$refs.modal.hide();
            },
            execute(event) {
                event.target.disabled = true;
                this.$root.$emit("onexecute-workflow");
            },
            show() {
                this.$refs.modal.show();
            },
        }
    }
</script>