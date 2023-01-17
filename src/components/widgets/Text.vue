<template>
    <div v-if="readOnly">
        {{value === null ? field.default: value}}
    </div>
    <div v-else>
        <LabelComponent :field="field"
                        :value="value"
                        :show-help="showHelp" />
        <input type="text"
               maxlength="100"
               class="form-control input-sm"
               :value="value === null ? field.default: value"
               :required="field.required"
               :class="{'form-control-sm': small}"
               @input="updated">
    </div>
</template>
<script>
import LabelComponent from './Label.vue';
import Widget from '../../mixins/Widget.js';
import { debounce } from '../../util.js';
export default {
    name: 'TextComponent',
    components: { LabelComponent },
    mixins: [Widget],
    mounted() {
        const value = (this.field['default'] ? this.field['default']: null);
        this.$root.$emit(this.message,
            this.field, this.value || value);
    },
    methods: {
        updated: debounce(function (e) {
            this.triggerUpdateEvent(this.message, this.field, e.target.value);
        }, 500)
    },
};
</script>
