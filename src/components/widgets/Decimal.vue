<template>
    <div>
        <LabelComponent :field="field" <LabelComponent :field="field"></LabelComponent>
        <input type="number" maxlenght="10" step="0.01" class="form-control input-sm" :value="value === null ? field['default']: value"
            @input="updated" pattern="\\d*\\.\\d{2}" />
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default {
        components: { LabelComponent },
        methods: {
            updated: _.debounce(function (e) { this.$root.$emit('update-form-field-value', this.field, e.target.value); }, 500)
        },
        props: { value: '', field: {} },

    }
</script>