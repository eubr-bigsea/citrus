<template>
        <div>
            <LabelComponent :field="field" <LabelComponent :field="field"></LabelComponent>
            <div>
                <v-select :options="suggestions" :multiple="true || (!params || params.multiple)" :value.sync="value" :on-change="updated"
                    :taggable="true" :closeOnSelect="false">
                    <div slot="no-options"></div>
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
                    this.$root.$emit('update-form-field-value', this.field, val);
                }
            },
            props: { value: "", field: null, suggestions: { required: true } },
        }
    </script>