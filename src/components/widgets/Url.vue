<template>
    <div v-if="readOnly">
        {{value === null ? field.default: value}}
    </div>
    <div v-else>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <input type="url" maxlength="100" class="form-control input-sm" :value="value === null ? field.default: value"
            @input="updated" />
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    import { debounce } from '../../util.js';
    export default {
        name: 'UrlComponent',
        components: { LabelComponent },
        mixins: [Widget],
        mounted() {
            const value = (this.field['default'] ? this.field['default']: null)
            this.$root.$emit(this.message,
                 this.field, this.value || value);
        },
        methods: {
            updated: debounce(function (e) { this.$root.$emit(this.message, this.field, e.target.value); }, 500)
        },
    }
</script>
