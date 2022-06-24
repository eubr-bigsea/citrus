<template>
    <div>
        <LabelComponent :field="field" :value="value" :show-help="showHelp"></LabelComponent>
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <input v-model="dateValue" :type="useDatetimeLocal ? 'datetime-local' : 'date'" class="form-control" max="2199-12-31" :required="field.required"
                step="1" @change="updated"/>
            <div class="invalid-feedback">
                Please provide a valid date.
            </div>
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    import { format, parse } from 'date-fns';
    import { debounce } from '../../util.js';

    export default {
        components: { LabelComponent },
        mixins: [Widget],
        data() {
            return {
                dateValue: null,
                useDatetimeLocal: false,
            };
        },
        computed: {
            normalizedValue: () => {
                return this.field.value || this.field.default;
            }
        },
        mounted() {
            const value = (this.field['default'] ? this.field['default'] : null)
            if (this.field.values) {
                const values = JSON.parse(this.field.values);
                this.useDatetimeLocal = values['use-datetime-local'] === true;
            }
            this.$root.$emit(this.message,
                this.field, this.value || value);
            let d = null;
            if (this.value !== null) {
                d = parse(this.value);
            } else if (this.field.default_value !== null) {
                d = parse(this.field.default_value);
            }
            if (d) {
                this.dateValue = this.useDatetimeLocal ? format(d, 'YYYY-MM-DDTHH:mm:ss') : format(d, 'YYYY-MM-DD');
            }
        },
        methods: {
            updated: debounce(function (e) { 
                this.triggerUpdateEvent(this.message, this.field, e.target.value); 
            }, 500)
        },
    }
</script>
