<template>
    <span class="label">
        <span :data-order="field.order" :data-name="field.name"
            :class="{'text-danger': error, required: field.required}" :title="error">{{field.label || field.name}}</span>
        <span v-show="field.required">*</span>:
        <span v-if="(showHelp === undefined || showHelp) && field.help" class="data-help">
            <span class="fa fa-question-circle float-right" :title="field.help"></span>
        </span>
    </span>
</template>

<script>
    import Widget from '../../mixins/Widget.js';
    export default {
        mixins: [Widget],
        name: "property-label",
        props: {
            field: { required: true, type: Object },
            value: {},
            showHelp: true,
        },
        computed: {
            error() {
                if (this.field.required && (this.value === undefined || this.value === null || this.value === '' || this.value === {})) {
                    return this.$tc('errors.missingRequiredValue');
                }
                return null;
            },
        }
    }
</script>
<style scoped>
    .label {
        font-size: .9em;
    }
</style>
