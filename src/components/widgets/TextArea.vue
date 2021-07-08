<template>
    <div>
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <LabelComponent :field="field" :value="value" :show-help="showHelp"></LabelComponent>
            <textarea class="form-control input-sm" @keyup="updated" autocomplete="off" autocorrect="off"
                autocapitalize="off" spellcheck="false" :value="value === null ? field.default: value"
                rows="3"></textarea>
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
        computed: {
            normalizedValue: () => {
                return this.field.value || this.field.default;
            }
        },
    }
</script>
