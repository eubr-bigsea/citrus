<template>
    <div>
        <label-component :field="field" :value="value" />
        <div>
            <v-select v-if="type !== 'tag'" :options="suggestions" :multiple="true || (!params || params.multiple)"
                :value.sync="values" :on-change="updated" label="value" :taggable="false" :close-on-select="false"
                :disabled="readonly">
                <div slot="no-options" />
            </v-select>
            <v-select v-else :multiple="true" :value.sync="values" :on-change="updated" label="value" :taggable="true"
                :close-on-select="true" :disabled="readonly">
                <div slot="no-options" />
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
            suggestions() {
                const obj = JSON.parse(this.field.values);
                if (obj) {
                    return obj.sort((a, b) => a.value < b.value ? -1 : (a.value === b.value ? 0 : 1));
                } else {
                    return [];
                }
            }
        },
        methods: {
            updated(val) {
                this.$root.$emit(this.message, this.field, val);
            }
        },
        mounted() {
            this.values = this.value;
        },
        data() {
            return {
                values: []
            }
        },
        props: {
            type: "",
            value: { default: [] },
            field: null,
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
<style>
    .v-select ul.dropdown-menu {
        font-size: 1em;
    }
</style>