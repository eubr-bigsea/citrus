<template>
    <div>
        <label-component :field="field" :value="value" />
        <input type="number" maxlenght="10" step="0.01" class="form-control input-sm"
            :value="value === null ? field['default']: value" @input="updated" pattern="\\d*\\.\\d{2}"
            readonly="readonly" />
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default {
        components: { 'label-component': LabelComponent },
        methods: {
            updated: _.debounce(function (e) { this.$root.$emit(this.message, this.field, e.target.value); }, 500)
        },
        props: {
            value: '', field: {}, message: {
                type: String,
                default: 'update-form-field-value'
            },
            readonly: {
                type: Boolean,
                default: true
            }
        },

    }
</script>