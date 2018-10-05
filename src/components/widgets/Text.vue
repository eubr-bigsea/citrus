<template>
    <div>
        <LabelComponent :field="field" <LabelComponent :field="field"></LabelComponent>
        <input type="text" maxlenght="100" class="form-control input-sm" :value="value === null ? field.default: value" @input="updated" />
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default {
        components: { LabelComponent },
        methods: {
            updated: _.debounce(function (e) { this.$root.$emit('update-form-field-value', this.field, e.target.value); }, 500)
        },
        computed: {
            normalizedValue: () => {
                return this.field.value || this.field.default;
            }
        },
        props: { value: '', field: {} },

    }
</script>