<template>
    <div>
        <LabelComponent :field="field"
                        :value="value" />
        <textarea disabled
                  :value="field.value"
                  class="form-control code"
                  rows="8" />
        <b-link v-b-modal="'queryBuilderModal'"
                variant="sm">
            {{$t('property.editValue')}}
        </b-link>

        <b-modal id="queryBuilderModal"
                 ref="modal"
                 size="lg"
                 :title="field.label"
                 :cancel-title="$t('actions.cancel')">
            <p>
                {{$t('property.queryBuilder.explanation')}}
            </p>
            <textarea v-model="sql"
                      class="form-control"
                      rows="10" />

            <div slot="modal-footer"
                 class="w-100 text-right">
                <b-btn variant="primary"
                       class="mr-1"
                       @click.prevent="okClicked">
                    {{$t('common.ok')}}
                </b-btn>
                <b-btn variant="secondary"
                       @click.prevent="cancelClicked">
                    {{$t('actions.cancel')}}
                </b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
import LabelComponent from './Label.vue';
import Widget from '../../mixins/Widget.js';
export default {
    components: {
        LabelComponent
    },
    mixins: [Widget],
    data() {
        return {
            sql: ''
        }
    },
    mounted() {
        this.sql = this.field.value;
    },
    methods: {
        okClicked() {
            this.$root.$emit(this.message, this.field,
                this.sql);
            this.$refs.modal.hide();
        },
        cancelClicked() {
            this.$refs.modal.hide();
        },
    },
}
</script>
