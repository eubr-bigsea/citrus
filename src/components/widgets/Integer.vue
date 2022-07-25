<template>
    <div>
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <LabelComponent :field="field" :value="value" :show-help="showHelp"></LabelComponent>
            <input type="number" maxlength="10" class="form-control input-sm"
                :value="value === null ? field['default']: value" pattern="\\d*" onkeypress="return this.value.length <=15"
                :class="{'form-control-sm': small, 'w-25': small}" :required="field.required"
                @input="updated" />
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue';
    import Widget from '../../mixins/Widget.js';
    import { debounce } from '../../util.js';
    export default {
        name: 'IntegerComponent',
        components: { LabelComponent },
        mixins: [Widget],
        mounted() {
            const value = (this.field['default'] ? parseInt(this.field['default']) : null)
            this.$root.$emit(this.message,
                this.field, this.value || value);
        },
        methods: {
            updated: debounce(function (e) {
                //this.$root.$emit(this.message, this.field, e.target.value);
                this.triggerUpdateEvent(this.message, this.field, e.target.value);
            } , 500)
        },
    }
</script>
