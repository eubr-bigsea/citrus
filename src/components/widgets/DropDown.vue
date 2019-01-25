<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <select class="form-control input-sm" v-bind:data-field="field.name" v-model="selected" @change="updated">
            <option v-if="!field.default"></option>
            <option v-for="opt in pairOptionValueList" :value="opt.key">
                {{opt[language] || opt.value}}
            </option>
        </select>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default {
        components: { LabelComponent },
        mounted() {
            this.$root.$emit(this.message,
                this.field, this.value || this.field.default);
        },
        computed: {
            pairOptionValueList() {
                return JSON.parse(this.field.values);
            },
            selected: {
                get() {
                    return this.value || this.field.default;
                },
                set(value) {
                }
            }
        },
        methods: {
            updated(e) {
                this.selected = e.target.value;
                this.$root.$emit(this.message, this.field, e.target.value);
            }
        },
        props: {
            value: 0, field: null, language: { default: 'en' }, message: {
                type: String,
                default: 'update-form-field-value'
            }        
        },
        ready: function () {
            //console.debug(this.field, this.field['default'], this.value)
            if (this.field['default'] && (this.value === null || this.value === '')) {
                this.value = this.field['default'];
            }
        },

    }

</script>