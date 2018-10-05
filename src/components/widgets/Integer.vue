<template>
    <div>
        <LabelComponent :field="field" <LabelComponent :field="field"></LabelComponent>
        <input type="number" maxlenght="10" class="form-control input-sm" 
            :value="value === null ? field['default']: value" pattern="\\d*"
            @input="updated" 
            :required="field.required"/>
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