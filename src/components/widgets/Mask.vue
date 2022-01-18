<template>
    <div>
        <LabelComponent :field="field" />
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <input v-mask="mask"  type="text" maxlength="100" class="form-control input-sm" :value="value === null ? field.default: value"
            @input="updated" :required="field.required" :class="{'form-control-sm': small}"/>
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    import { debounce } from '../../util.js';
    export default {
        mixins: [Widget],
        components: { LabelComponent },
        props: {
            mask: { type: Array, default: () => [] }
        },
        data() {
            return {
                internalValue: ''
            }
        },
        methods: {
            updated: _.debounce(function (e) {
                this.triggerUpdateEvent(this.message, this.field, e.target.value);
            }, 500)
        },
        computed: {
            normalizedValue: () => {
                return this.field.value || this.field.default;
            }
        },
        mounted() {
            const value = (this.field['default'] ? this.field['default'] : null)
            this.$root.$emit(this.message,
                this.field, this.value || value);
        },
    }
</script>