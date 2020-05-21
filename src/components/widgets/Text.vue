<template>
    <div v-if="readOnly">
        {{value === null ? field.default: value}}
    </div>
    <div v-else>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <input type="text" maxlenght="100" class="form-control input-sm" :value="value === null ? field.default: value"
            @input="updated" />
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
            readOnly: false,
            value: '', field: {},
            message: {
                type: String,
                default: 'update-form-field-value'
            }
        },

    }
</script>