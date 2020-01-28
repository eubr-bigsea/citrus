<template>
    <div>
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <LabelComponent :field="field" :value="value"></LabelComponent>
            <input type="number" maxlenght="10" class="form-control input-sm"
                :value="value === null ? field['default']: value" pattern="\\d*" @input="updated"
                :required="field.required" />
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
            value: '', field: {},
            message: {
                type: String,
                default: 'update-form-field-value'
            }
        },

    }
</script>