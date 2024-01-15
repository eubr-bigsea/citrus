<template>
    <b-modal ref="modal" size="xl" :title="$t('titles.property', 2)">
        <b-form v-if="loaded">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-7">
                            <label>{{$t('common.name', 1)}}:</label>
                            <b-form-input v-model="workflowCopy.name" type="text" required />
                        </div>
                        <div class="col-md-5">
                            <label>{{$t('workflow.preferredCluster')}}:</label>
                            <select v-model="workflowCopy.preferred_cluster_id" class="form-control w-75">
                                <option v-for="cluster in clusters" :key="cluster.id" :value="cluster.id">
                                    {{cluster.name}}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label>{{$t('common.description', 1)}}:</label>
                            <b-form-textarea v-model="workflowCopy.description" :rows="3" :max-rows="6" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mt-2">
                <div class="card-body">
                    <b-form-checkbox v-model="workflowCopy.is_template">
                        <small><strong>{{$t('workflow.useAsTemplate')}}</strong></small>
                    </b-form-checkbox>
                    <small><em>{{$t('workflow.useAsTemplateExplanation')}}</em></small>
                    <div v-if="userPermissions.includes && userPermissions.includes('ADMINISTRATOR')">
                        <b-form-checkbox v-model="workflowCopy.is_system_template">
                            <small><strong>{{$t('workflow.useAsSystemTemplate')}}</strong></small>
                        </b-form-checkbox>
                        <small><em>{{$t('workflow.useAsSystemTemplateExplanation')}}</em></small>
                    </div>
                </div>
            </div>

            <div v-if="hasAnyPermission(['APP_EDIT']) || isAdmin" class="card mt-2">
                <div class="card-body">
                    <b-form-checkbox v-model="workflowCopy.publishing_enabled">
                        <small><strong>{{$t('workflow.publishingEnabled')}}</strong></small>
                    </b-form-checkbox>
                    <small><em>{{$t('workflow.publishingEnabledExplanation')}}</em></small>
                    <div v-if="workflowCopy.publishing_enabled" class="mt-1">
                        <label>{{$t('workflow.publishingStatus')}}:</label>
                        <select v-model="workflowCopy.publishing_status" class="form-control w-50">
                            <option value="EDITING">
                                {{$t('workflow.publisingStatusEditing')}}
                            </option>
                            <option value="PUBLISHED">
                                {{$t('workflow.publisingStatusPublished')}}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </b-form>
        <template #modal-footer>
            <div>
                <b-button variant="primary btn-sm" class="float-right me-1" :disabled="(workflowCopy.name === '')"
                          @click="okClicked">
                    {{$t('common.ok')}}
                </b-button>
            </div>
        </template>
    </b-modal>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    components: {
    },
    props: {
        clusters: { type: Array, default: () => [] },
        loaded: Boolean,
        workflow: { type: Object, default: () => { } },
    },
    emits: ['update-value'],
    data() {
        return { userPermissions: {}, workflowCopy: { ... this.workflow } };
    },
    computed: {
        ...mapGetters(['hasAnyPermission', 'isAdmin', 'user']),
    },
    watch: {
        workflow: {
            deep: true,
            handler(newValue) {
                this.workflowCopy = { ...newValue };
            }
        }
    },
    mounted() {
        this.userPermissions = this.$store.getters.userPermissions;
    },
    methods: {
        okClicked() {
            if (this.workflow.name && this.workflow.name.trim()) {
                this.$root.$emit('onupdate-workflow-properties');
                this.$emit('update-value', this.workflowCopy);
                this.$refs.modal.hide();
            } else {
                this.warning(this.$t('titles.validationErrors', 2));
            }
        },
        show() {
            this.$refs.modal.show();
        },
    }
};
</script>