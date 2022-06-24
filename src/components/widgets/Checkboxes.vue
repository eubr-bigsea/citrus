<template>
    <div v-if="readOnly">
        {{selected}}
    </div>
    <div v-else>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <b-form-group class="checks">
            <b-form-checkbox-group v-model="internalValue" :name="field.name" switches
                >
                <b-form-checkbox v-for="opt in pairOptionValueList" :key="opt.key" class="col-3" :value="opt.key"
                    @input="handleCheckboxChange(opt[language] || opt.value, $event)">
                    {{opt[language] || opt.value}}
                </b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    export default {
        components: { LabelComponent },
        mixins: [Widget],
        data() {
            return {
                internalValue: []
            }
        },
        computed: {
            pairOptionValueList() {
                let v;
                if (this.field.suggested_widget === 'checkbox') {
                    // To allow multiple selection of boolean values
                    return [
                        { key: true, value: this.$tc('common.yes') },
                        { key: false, value: this.$tc('common.no') },
                    ]
                } else {
                    try {
                        if (typeof this.field.values === 'string' || this.field.values instanceof String) {
                            v = JSON.parse(this.field.values);
                        } else {
                            v = this.field.values;
                        }
                        // test if it is an object, instead of a list
                        if (v && !Array.isArray(v)) {
                            //this.helpLink = v.help;
                            v = v.values;
                        }
                        return v;
                    } catch (ex) {
                        console.error(ex);
                        return [];
                    }
                }
            },

        },
        mounted() {
            if (Array.isArray(this.value)) {
                this.internalValue = this.value;
            } else {
                this.internalValue = [this.value];
            }
        },
        methods: {
            handleCheckboxChange(v, ev) {
                this.triggerUpdateEvent(this.message, this.field, ev.filter(v => v !== null));
            },
        }
    }
</script>
