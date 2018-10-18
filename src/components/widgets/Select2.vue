<template>
    <div>
        <span>
            {{field.label}}
            <span class="fa fa-asterisk" v-show="field.required"></span>
            <!-- <span class="fa fa-question-circle-o" :title="field.help"></span> -->
        </span>
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
    export default {
        components: {
            'v-select': vSelect
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