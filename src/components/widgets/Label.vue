<template>
    <span class="label">
        <span :data-order="field.order" :data-name="field.name" :class="{'font-weight-bold': field.required, 'text-danger': error}" :title="error">{{field.label}}</span>
        <span v-show="field.required">*</span>
        <span class="fa fa-question-circle float-right" :title="field.help"></span>
    </span>
</template>

<script>
    export default {
        props: {
            field: {},
            value: {}
        },
        computed: {
            error() {
                if (this.field.required && (this.value === undefined || this.value === null || this.value === '' || this.value === {})){
                    return this.$tc('errors.missingRequiredValue');
                }
                return null;
            },
        }
    }
</script>
<style scoped>
</style>