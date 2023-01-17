<template>
    <div v-if="readOnly">
        {{selected}}
    </div>
    <div v-else>
        <LabelComponent :field="field"
                        :value="value" />aa
        <b-form-tags v-model="selected"
                     name="field.name"
                     class="lemonade-tag-input pt-3"
                     placeholder=""
                     add-button-text="+"
                     :input-type="inputType"
                     @input="updatedTag" />
    </div>
</template>
<script>
import LabelComponent from './Label.vue'
import Widget from '../../mixins/Widget.js';
export default {
    name: 'TagComponent',
    components: { LabelComponent },
    mixins: [Widget],
    computed: {
        selected: {
            get() {
                if (this.field.multiplicity === 2 || this.field.multiplicity === 3) {
                    /*this.tags = [];
                        if (this.value) {
                            try {
                                this.tags = JSON.parse(this.value);
                            } catch (e) {
                                console.log(e);
                            }
                        }*/
                    return this.tags;
                } else {
                    return this.value || this.field.default;
                }
            },
            set(value) {// eslint-disable-line no-unused-vars
            }
        },
        inputType() {
            return this.field.data_type || 'text';
        }
    },
    mounted() {
        this.$root.$emit(this.message,
            this.field, this.value || this.field['default']);
    },
    methods: {
        updatedTag(values) {
            this.$root.$emit(this.message, this.field, values, values);

        },
    },
    ready: function () {
        if (this.field['default'] && (this.value === null || this.value === '')) {
            this.value = this.field['default'];
        }
    },
}

</script>
<style scoped>
    /* Chrome, Safari, Edge, Opera */
    .lemonade-tag-input>>>input::-webkit-outer-spin-button,
    .lemonade-tag-input>>>input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    .lemonade-tag-input>>>input[type=number] {
        -moz-appearance: textfield;
    }
</style>
