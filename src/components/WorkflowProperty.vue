<template>
    <div class="row">
        <div class="col-md-4 offset-md-4">
            <div v-for="(field, index2) in form.fields"
                 :key="index2"
                 class="mb-2 property">
                <component :is="field.suggested_widget + '-component'"
                           :field="field"
                           :value="getValue(field.name)"
                           :language="$root.$i18n.locale"
                           message="update-workflow-form-field-value" />
            </div>
        </div>
    </div>
</template>
<script>
// widget components (attribute-function-component, etc.) are already
// registered globally in main.js - no local components map needed
export default {
    props: {
        form: { type: Object, default: () => {} },
        workflow: { type: Object, default: () => {} },
        loaded: {type: Boolean, default: false},
    },
    methods: {
        getValue(name) {
            return this.workflow?.forms?.[name]?.value ?? null;
        },
    }
};
</script>
<style>
    .property {
        display: block;
        clear: both;
    }
</style>
