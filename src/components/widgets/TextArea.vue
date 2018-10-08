<template>
    <div>
        <LabelComponent :field="field"></LabelComponent>
        <textarea class="form-control input-sm" @keyup="updated" 
            :value="value === null ? field.default: value" rows="3"></textarea>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default {
        components: {LabelComponent},
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