<template>
    <b-modal size="lg" ref="modal" :title="$tc('titles.property', 2)">
        <b-form v-if="loaded">
            <b-form-group :label="$tc('common.name', 1) + ':'">
                <b-form-input type="text" v-model="workflow.name" required />
            </b-form-group>
            <b-form-group :label="$tc('common.description', 1) + ':'">
                <b-form-textarea v-model="workflow.description" :rows="3" :max-rows="6" />
            </b-form-group>
            <SwitchComponent v-model="workflow.is_template" :checked="workflow.is_template" class="mt-3">
                <strong>{{$t('workflow.useAsTemplate')}}</strong>
            </SwitchComponent>
            <small><em>{{$t('workflow.useAsTemplateExplanation')}}</em></small>
            <div v-if="userPermissions.includes('ADMINISTRATOR')">
                <SwitchComponent v-model="workflow.is_system_template" :checked="workflow.is_system_template" class="mt-3">
                    <strong>{{$t('workflow.useAsSystemTemplate')}}</strong>
                </SwitchComponent>
                <small><em>{{$t('workflow.useAsSystemTemplateExplanation')}}</em></small>
            </div>

            <SwitchComponent v-model="workflow.publishing_enabled" :checked="workflow.publishing_enabled" class="mt-3">
                <strong>{{$t('workflow.publishingEnabled')}}</strong>
            </SwitchComponent>
            <small><em>{{$t('workflow.publishingEnabledExplanation')}}</em></small>
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
    export default {
        components: {
            SwitchComponent
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
