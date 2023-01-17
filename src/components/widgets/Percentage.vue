<template>
    <div>
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <LabelComponent :field="field"
                            :value="value"
                            :show-help="showHelp" />
            <input type="number"
                   max="100"
                   min="0"
                   step="0.01"
                   class="form-control input-sm form-control-sm w-25"
                   onkeypress="return this.value.length <=15"
                   :value="value === null ? field['default']: value"
                   pattern="\\d{1,3}\\.\\d{2}"
                   :required="field.required"
                   @input="updated">
        </div>
    </div>
</template>
<script>
import LabelComponent from './Label.vue'
import Widget from '../../mixins/Widget.js';
import { debounce } from '../../util.js';
export default {
    name: 'PercentageComponent',
    components: { LabelComponent },
    mixins: [Widget],
    methods: {
        updated: debounce(function (e) {
            this.triggerUpdateEvent(this.message, this.field, e.target.value);
        }, 500)
    },
}
</script>