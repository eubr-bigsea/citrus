<template>
    <b-modal ref="modal" size="lg" :title="$t('workflow.execute')">
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
                                <option v-for="option in clusters" :key="option.id" :value="option.id">
                                    {{option.name}}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-8">
                            <label>{{$t('workflow.jobName')}}
                                ({{$t('common.optional')}}):</label>
                            <input v-model="clusterInfo.jobName" type="text" class="form-control form-control-sm"
                                   maxlength="50">
                        </div>
                        <div class="col-md-12">
                            <small>{{clusterInfo.description}}</small>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div v-else class="alert alert-danger">
            <font-awesome-icon icon="fa fa-exclamation-circle" /> {{$t("workflow.errorNoCluster")}}
        </div>
        <div slot="modal-footer" class="w-100 text-right">
            <button v-if="clusters && clusters.length" id="mdl-execute-wf" ref="executeBtn"
                    class="btn btn-sm btn-outline-success" @click="execute($event)">
                <font-awesome-icon icon="fa fa-play" /> {{$t('actions.execute')}}
            </button>
            <button class="ml-1 btn btn-sm btn-outline-dark" @click="close">
                {{$t('actions.cancel')}}
            </button>
        </div>
    </b-modal>
</template>
<script>
export default {
    props: {
        clusterInfo: { type: Object, default: () => null },
        clusters: { type: Array, default: () => null },
        validationErrors: { type: Array, default: () => null },
        workflow: { type: Object, default: () => { } },
    },
    emits: ['onexecute-workflow', 'onchange-cluster'],
    methods: {
        changeCluster() {
            const cluster = this.clusters.find((c) => c.id === this.clusterInfo.id);
            this.$emit("onchange-cluster", cluster);
        },
        close() {
            this.$refs.modal.hide();
        },
        execute(event) {
            event.target.disabled = true;
            this.$emit("onexecute-workflow");
        },
        show() {
            this.$refs.modal.show();
        },
    }
}
</script>