<template>
    <div>
        <label-component :field="field" :value="value" />
        <div>
            <v-select :options="suggestions" :multiple="true || (!params || params.multiple)" :value.sync="value"
                :on-change="updated" :taggable="true" :close-on-select="false" :disabled="readonly">
                <slot name="no-options">{{ $t('messages.noMatching') }}</slot>
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
            'label-component': LabelComponent
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
            },
            readonly: {
                type: Boolean,
                default: true
            }
        },
    }
</script>