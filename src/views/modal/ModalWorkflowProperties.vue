<template>
    <b-modal size="lg" ref="modal" :title="$tc('titles.property', 2)">
        <b-form v-if="loaded">
            <b-form-group :label="$tc('common.name', 1) + ':'">
                <b-form-input type="text" v-model="workflow.name" required />
            </b-form-group>
            <b-form-group :label="$tc('common.description', 1) + ':'">
                <b-form-textarea v-model="workflow.description" :rows="3" :max-rows="6" />
            </b-form-group>
            <b-form-checkbox v-model="workflow.is_template">
                {{$t('workflow.useAsTemplate')}}
                <br />
                <small><em>{{$t('workflow.useAsTemplateExplanation')}}</em></small>
            </b-form-checkbox>
        </b-form>
        <div slot="modal-footer">
                <b-btn variant="primary" class="float-right mr-1" @click="okClicked" :disabled="(workflow.name === '')">
                    {{$t('common.ok')}}
                </b-btn>
            </div>
    </b-modal>
</template>
<script>
    export default {
        props: {
            loaded: false,
            workflow: {},
            submit: null,
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