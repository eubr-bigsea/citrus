<template>
    <div ref="fieldElement"
         class="mt-3 mb-2"
         style="width: 100%">
        <div v-if="readOnly">
            {{value === null ? field.default: (value === '0' ? $t('common.false') : $t('common.true'))}}
        </div>
        <div v-else
             class="clearfix">
            <div class="float-start"
                 :data-name="field.name">
                <b-form-checkbox v-if="visualStyle === 'explorer'"
                                 switch
                                 :checked="checked"
                                 @input="changed">
                    {{field.label
                        || field.name}}
                </b-form-checkbox>
                <SwitchComponent v-else
                                 class="float-start"
                                 :checked="checked"
                                 :onchange="changed">
                    {{field.label ||
                        field.name}}
                </SwitchComponent>
            </div>
            <span v-if="(showHelp === undefined || showHelp) && field.help"
                  class="data-help">
                <font-awesome-icon icon="fa fa-question-circle float-end"
                                   :title="field.help" />
            </span>
            <!-- <div style="clear: both">
                <b-form-checkbox v-model="checked" value="true" switch @change="changed"
                    unchecked-value="false">
                    {{field.label || field.name}}
                </b-form-checkbox>
            </div> -->
        </div>
    </div>
</template>
<script>
import SwitchComponent from './Switch.vue';
import Widget from '../../mixins/Widget.js';
export default {
    name: 'CheckboxComponent',
    components: { SwitchComponent },
    mixins: [Widget],
    data() {
        return {
            id: '',
            checked: false,
        };
    },
    watch: {
        value: function () {
            this.checked = this.value === 1 || this.value === '1';
        }
    },
    mounted() {
        let input = this.$refs.fieldElement; //this.$el.querySelector('input[type="checkbox"]');
        input.id = `checkboxComponentInput-${this.field.name}`;
        this.checked = this.value === 1 || this.value === '1' || this.value === 'true';
        if (this.value === null && this.field.default === '1') {
            this.checked = true;
            this.changed(this.field.default);
        }
        this.id = `check_${this._uid}`;
    },
    methods: {
        changed(newValue) {
            this.triggerUpdateEvent(this.message, this.field, newValue ? '1' : '0',
                newValue ? this.$t('common.yes') : this.$t('common.no'));
        }
    }
};
</script>
