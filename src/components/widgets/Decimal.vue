<template>
    <div>
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <LabelComponent :field="field" <LabelComponent :field="field" :value="value"></LabelComponent>
            <input type="number" maxlength="10" step="0.01" class="form-control input-sm"
                :value="value === null ? field['default']: value" @input="updated" pattern="\\d*\\.\\d{2}" />
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default {
        components: { LabelComponent },
        methods: {
            updated: _.debounce(function (e) { this.$root.$emit(this.message, this.field, e.target.value); }, 500)
        },
        props: {
            readOnly: false,
            value: '', field: {}, message: {
                type: String,
                default: 'update-form-field-value'
            }
        },

    }
</script>
