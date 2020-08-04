<template>
    <b-modal size="lg" ref="modal" :title="$tc('titles.property', 2)">
        <b-form v-if="loaded">
            <div class="card">
              <div class="card-body">
                <b-form-group :label="$tc('common.name', 1) + ':'">
                    <b-form-input type="text" v-model="workflow.name" required />
                </b-form-group>
                <b-form-group :label="$tc('common.description', 1) + ':'">
                    <b-form-textarea v-model="workflow.description" :rows="3" :max-rows="6" />
                </b-form-group>
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
              <div v-if="workflow.publishing_enabled" class="mt-3">
                <label>{{$t('workflow.publishingStatus')}}</label>
                <select class="form-control" v-model="workflow.publishing_status">
                    <option value="EDITING">{{$t('workflow.publisingStatusEditing')}}</option>
                    <option value="PUBLISHED">{{$t('workflow.publisingStatusPublished')}}</option>
                </select>
              </div>
            </div>
            </div>
        </b-form>
        <div slot="modal-footer">
            <b-btn variant="primary btn-sm" class="float-right mr-1" @click="okClicked" :disabled="(workflow.name === '')">
                {{$t('common.ok')}}
            </b-btn>
        </div>
    </b-modal>
</template>
<script>
    import SwitchComponent from '../../components/widgets/Switch.vue';
    import { mapGetters } from 'vuex';

    export default {
        components: {
            SwitchComponent
        },
        computed: {
            ...mapGetters(['hasAnyPermission', 'isAdmin','user']),
        },
        props: {
            loaded: false,
            workflow: {},
            submit: null,
        },
        data(){
            return {userPermissions: {}};
        },
        mounted(){
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
