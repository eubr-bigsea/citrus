<template>
    <div>
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <LabelComponent :field="field" :value="value" :show-help="showHelp"></LabelComponent>
            <textarea class="form-control input-sm" autocomplete="off" autocorrect="off" autocapitalize="off"
                spellcheck="false" :value="value === null ? field.default: value" rows="3"
                @keyup="updated"></textarea>
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    import { debounce } from '../../../util.js';
    export default {
        components: { LabelComponent },
        mixins: [Widget],
        computed: {
            normalizedValue: () => {
                return this.field.value || this.field.default;
            }
        },
        methods: {
            updated: debounce(function (e) {
                this.triggerUpdateEvent(this.message, this.field, e.target.value);
            }, 500)
        },
    }
</script>
