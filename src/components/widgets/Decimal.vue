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
                   max="999999999999"
                   min="-999999999"
                   step="any"
                   class="form-control input-sm"
                   onkeypress="return this.value.length <=15"
                   :value="value === null ? field['default']: value"
                   pattern="\\d{1,10}\\.\\d{2}"
                   :required="field.required"
                   :class="{'form-control-sm': small, 'w-25': small}"
                   @input="updated">
        </div>
    </div>
</template>
<script>
import LabelComponent from './Label.vue'
import Widget from '../../mixins/Widget.js';
import { debounce } from '../../util.js';
export default {
    name: 'DecimalComponent',
    components: { LabelComponent },
    mixins: [Widget],
    methods: {
        updated: debounce(function (e) {
            this.triggerUpdateEvent(this.message, this.field, e.target.value);
        }, 500)
    },
}
</script>