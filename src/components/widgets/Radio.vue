<template>
    <div v-if="readOnly">
        {{value === null ? field.default: value}}
    </div>
    <div v-else>
        <LabelComponent :field="field" :value="value" :show-help="showHelp"></LabelComponent>
        <b-form-group>
            <b-form-radio v-for="opt in pairOptionValueList" :key="opt.key" class="item" :value="opt.key"
                :name="field.name" size="" @input="updated(opt)">{{opt[language] || opt.value}}
            </b-form-radio>
        </b-form-group>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    export default {
        components: { LabelComponent },
        mixins: [Widget],
        computed: {
            pairOptionValueList() {
                try {
                    if (typeof this.field.values === 'string' || this.field.values instanceof String) {
                        return JSON.parse(this.field.values);
                    } else {
                        return this.field.values;
                    }
                } catch (ex) {
                    console.error(ex);
                    return [];
                }
            },
            selected: {
                get() {
                    return this.value || this.field.default;
                },
                set(value) { // eslint-disable-line no-unused-vars
                }
            }
        },
        mounted() {
            this.$root.$emit(this.message,
                this.field, this.value || this.field['default']);
        },
        methods: {
            updated(value) {
                this.selected = value.key;
                this.$root.$emit(this.message, this.field, value.key, value.value);
            }
        },
        ready: function () {
            if (this.field['default'] && (this.value === null || this.value === '')) {
                this.value = this.field['default'];
            }
        },

    }
</script>
<style scoped>
    /deep/ .item label {
        margin-top: 0;
        margin-left: 5px;
        font-weight: normal;
    }
</style>
