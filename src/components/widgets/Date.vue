<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <input type="date" class="form-control" v-model="dateValue" @change="updated" max="2199-12-31" />
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    import { format, parse } from 'date-fns';
    import { debounce } from '../../util.js';

    export default {
        mixins: [Widget],
        components: { LabelComponent },
        methods: {
            updated: debounce(function (e) { this.$root.$emit(this.message, this.field, e.target.value); }, 500)
        },
        computed: {
            normalizedValue: () => {
                return this.field.value || this.field.default;
            }
        },
        data() {
            return {
                dateValue: null,
            };
        },
        mounted() {
            const value = (this.field['default'] ? this.field['default'] : null)
            this.$root.$emit(this.message,
                this.field, this.value || value);
            let d = null;
            if (this.value !== null) {
                d = parse(this.value);
            } else if (this.field.default_value !== null) {
                d = parse(this.field.default_value);
            }
            if (d) {
                this.dateValue = format(d, 'YYYY-MM-DD');
            }
        },
    }
</script>