<template>
    <div v-if="readOnly">
        {{ selected }}
    </div>
    <div v-else>
        <LabelComponent :field="field" :value="value" />
        <b-form-group class="checks">
            <b-form-checkbox-group v-model="internalValue" :name="field.name" switches @input="handleCheckboxChange">
                <b-form-checkbox v-for="opt in pairOptionValueList" :key="opt.key" class="col-3" :value="opt.key">
                    {{ opt[language] || opt.value }}
                </b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>
    </div>
</template>
<script>
import LabelComponent from './Label.vue';
import Widget from '@/mixins/Widget.js';
export default {
    name: 'CheckboxesComponent',
    components: { LabelComponent },
    mixins: [Widget],
    data() {
        return {
            internalValue: (Array.isArray(this.value)) ? this.value :
                (this.value) ? [this.value] : []
        };
    },
    computed: {
        pairOptionValueList() {
            let v;
            if (this.field.suggested_widget === 'checkbox') {
                // To allow multiple selection of boolean values
                return [
                    { key: true, value: this.$t('common.yes') },
                    { key: false, value: this.$t('common.no') },
                ];
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
    methods: {
        handleCheckboxChange(v) {
            this.triggerUpdateEvent(this.message, this.field, v);
        },
    }
};
</script>
