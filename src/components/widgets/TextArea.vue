<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <textarea class="form-control input-sm" @keyup="updated" autocomplete="off" autocorrect="off"
            autocapitalize="off" spellcheck="false" :value="value === null ? field.default: value" rows="3"
            :readonly="readonly"></textarea>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default {
        components: { LabelComponent },
        methods: {
            updated: _.debounce(function (e) { this.$root.$emit(this.message, this.field, e.target.value); }, 500)
        },
        computed: {
            normalizedValue: () => {
                return this.field.value || this.field.default;
            }
        },
        props: {
            value: '',
            field: {},
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