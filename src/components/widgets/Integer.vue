<template>
    <div>
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <LabelComponent :field="field" :value="value"></LabelComponent>
            <input type="number" maxlength="10" class="form-control input-sm"
                :value="value === null ? field['default']: value" pattern="\\d*" @input="updated"
                :required="field.required" />
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue';
    import Widget from '../../mixins/Widget.js';
    export default {
        mixins: [Widget],
        components: { LabelComponent },
        methods: {
            updated: _.debounce(function (e) { this.$root.$emit(this.message, this.field, e.target.value); }, 500)
        },
        mounted() {
            const value = (this.field['default'] ? parseInt(this.field['default']): null)
            this.$root.$emit(this.message,
                 this.field, this.value || value);
        },
    }
</script>
