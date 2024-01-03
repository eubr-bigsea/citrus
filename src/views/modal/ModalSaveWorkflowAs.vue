<template>
    <b-modal ref="saveAsModal" size="lg" :title="$t('actions.saveAs')">
        <b-form-radio-group v-model="saveOption">
            <div class="row">
                <div class="col-md-12 mb-3">
                    <b-form-radio v-model="saveOption" name="saveOption" value="new">
                        {{$t('workflow.newName')}}
                    </b-form-radio>
                    <input v-model="newName" type="text" maxlength="40" class="form-control"
                           :disabled="saveOption != 'new'">
                </div>
                <div class="col-md-12 mb-3">
                    <b-form-radio v-model="saveOption" name="saveOption" value="image">
                        {{$t('workflow.asImage')}}
                    </b-form-radio>
                </div>
                <!--
                <div class="col-md-12 mb-3">
                    <b-form-radio name="saveOption" v-model="saveOption" value="template">
                        {{$t('workflow.asTemplate')}}</b-form-radio>
                    <p>
                        <label>Description</label>
                        <textarea class="form-control" :disabled="saveOption != 'template'"></textarea>
                    </p>
                </div>
                -->
            </div>
        </b-form-radio-group>
        <template #modal-footer>
            <b-btn variant="secondary_sm" size="sm" class="btn-outline-secondary float-right" @click="close">
                {{$t('actions.cancel')}}
            </b-btn>
            <b-btn variant="primary" class="float-right mr-1" size="sm" :disabled="(newName === '')"
                   @click="okClicked">
                {{$t('actions.save')}}
            </b-btn>
        </template>
    </b-modal>
</template>
<script>
import Notifier from '../../mixins/Notifier.js';
export default {
    mixins: [Notifier],
    emits: ['onsave-workflow-as'],
    data() {
        return {
            newName: '',
            saveOption: 'new',
        };
    },
    methods: {
        close() {
            this.$refs.saveAsModal && this.$refs.saveAsModal.hide();
        },
        okClicked() {
            if (this.newName && this.newName.trim()) {
                this.$emit('onsave-workflow-as', this.saveOption, this.newName);
                this.$refs.saveAsModal.hide();
            } else {
                this.warning(this.$tc('titles.validationErrors', 2));
            }
        },
        show(newName) {
            this.newName = newName;
            this.$refs.saveAsModal.show();
        }
    }
};
</script>