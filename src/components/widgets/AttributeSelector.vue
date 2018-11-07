<template>
    <div>
        <LabelComponent :field="field"></LabelComponent>
        <div>
            <v-select :options="suggestions" :multiple="true || (!params || params.multiple)" :value.sync="value" :on-change="updated"
                :taggable="true">
                <slot name="no-options">Sorry, no matching options.!!!</slot>
            </v-select>
        </div>
    </div>
</template>
<script>
    import vSelect from "vue-select";
    import LabelComponent from './Label.vue'
    export default {
        components: {
            'v-select': vSelect,
            LabelComponent
        },
        computed: {
            params() {
                let result = null;
                if (this.field.values) {
                    result = JSON.parse(this.field.values);
                }
                return result;
            }
        },
        methods: {
            updated(val) {
                this.$root.$emit(this.message, this.field, val);
            }
        },
        props: {
            value: "", field: null, suggestions: { required: true },
            message: {
                type: String,
                default: 'update-form-field-value'
            }
        },
    }
</script>