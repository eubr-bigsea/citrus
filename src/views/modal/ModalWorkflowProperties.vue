<template>
    <b-modal ref="modal" size="xl" :title="$tc('titles.property', 2)">
        <b-form v-if="loaded">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-7">
                            <label>{{$tc('common.name', 1)}}:</label>
                            <b-form-input v-model="workflow.name" type="text" required />
                        </div>
                        <div class="col-md-5">
                            <label>{{$t('workflow.preferredCluster')}}:</label>
                            <select v-model="workflow.preferred_cluster_id" class="form-control w-75">
                                <option v-for="cluster in clusters" :key="cluster.id" :value="cluster.id">
                                    {{cluster.name}}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label>{{$tc('common.description', 1)}}:</label>
                            <b-form-textarea v-model="workflow.description" :rows="3" :max-rows="6" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mt-2">
                <div class="card-body">
                    <b-form-checkbox v-model="workflow.is_template">
                        <small><strong>{{$t('workflow.useAsTemplate')}}</strong></small>
                    </b-form-checkbox>
                    <small><em>{{$t('workflow.useAsTemplateExplanation')}}</em></small>
                    <div v-if="userPermissions.includes && userPermissions.includes('ADMINISTRATOR')">
                        <b-form-checkbox v-model="workflow.is_system_template">
                            <small><strong>{{$t('workflow.useAsSystemTemplate')}}</strong></small>
                        </b-form-checkbox>
                        <small><em>{{$t('workflow.useAsSystemTemplateExplanation')}}</em></small>
                    </div>
                </div>
            </div>

            <div v-if="hasAnyPermission(['APP_EDIT']) || isAdmin" class="card mt-2">
                <div class="card-body">
                    <b-form-checkbox v-model="workflow.publishing_enabled">
                        <small><strong>{{$t('workflow.publishingEnabled')}}</strong></small>
                    </b-form-checkbox>
                    <small><em>{{$t('workflow.publishingEnabledExplanation')}}</em></small>
                    <div v-if="workflow.publishing_enabled" class="mt-1">
                        <label>{{$t('workflow.publishingStatus')}}:</label>
                        <select v-model="workflow.publishing_status" class="form-control w-50">
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
        <div slot="modal-footer">
            <b-btn variant="primary btn-sm" class="float-right mr-1" :disabled="(workflow.name === '')"
                   @click="okClicked">
                {{$t('common.ok')}}
            </b-btn>
        </div>
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
    data() {
        return { userPermissions: {} };
    },
    computed: {
        ...mapGetters(['hasAnyPermission', 'isAdmin', 'user']),
    },
    mounted() {
        this.userPermissions = this.$store.getters.userPermissions;
    },
    methods: {
        okClicked() {
            if (this.workflow.name && this.workflow.name.trim()) {
                this.$root.$emit('onupdate-workflow-properties');
                this.$refs.modal.hide();
            } else {
                this.warning(this.$tc('titles.validationErrors', 2));
            }
        },
        show() {
            this.$refs.modal.show();
        }
    }
}
</script>