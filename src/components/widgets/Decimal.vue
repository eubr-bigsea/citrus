<template>
    <div>
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <LabelComponent :field="field" <LabelComponent :field="field" :value="value"></LabelComponent>
            <input type="number" max="999999999999" min="-999999999" step="0.01" class="form-control input-sm"
                :value="value === null ? field['default']: value" @input="updated" pattern="\\d{1,10}\\.\\d{2}" />
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    export default {
        mixins: [Widget],
        components: { LabelComponent },
        methods: {
            updated: _.debounce(function (e) { this.$root.$emit(this.message, this.field, e.target.value); }, 500)
        },
    }
</script>
