<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <textarea disabled :value="field.value" class="form-control code" rows="8"></textarea>
        <b-link v-b-modal="'queryBuilderModal'" variant="sm">
            {{$t('property.editValue')}}
        </b-link>

        <b-modal id="queryBuilderModal" size="lg" :title="field.label" :cancel-title="$t('actions.cancel')" ref="modal">
            <p>
                {{$t('property.queryBuilder.explanation')}}
            </p>
            <textarea class="form-control" v-model="sql" rows="10"></textarea>

            <div slot="modal-footer" class="w-100 text-right">
                <b-btn @click.prevent="okClicked" variant="primary" class="mr-1">{{$t('common.ok')}}</b-btn>
                <b-btn @click.prevent="cancelClicked" variant="secondary">{{$t('actions.cancel')}}</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue';
    import jsep from 'jsep';
    import Widget from '../../mixins/Widget.js';
    export default {
        mixins: [Widget],
        components: {
            LabelComponent
        },
        data() {
            return {
                sql: ''
            }
        },
        mounted() {
            this.sql = this.field.value;
        },
        methods: {
            okClicked(e) {
                this.$root.$emit(this.message, this.field,
                    this.sql);
                this.$refs.modal.hide();
            },
            cancelClicked(e) {
                this.$refs.modal.hide();
            },
        },
    }
</script>
