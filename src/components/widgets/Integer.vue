<template>
    <div>
        <label-component :field="field" :value="value" />
        <input type="number" maxlenght="10" class="form-control input-sm"
            :value="value === null ? field['default']: value" pattern="\\d*" @input="updated" :required="field.required"
            :readonly="readonly" />
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
            value: '', field: {},
            message: {
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