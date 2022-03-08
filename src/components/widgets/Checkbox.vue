<template>
    <div ref="fieldElement" class="mt-3 mb-2" style="width: 100%">
        <div v-if="readOnly">
            {{value === null ? field.default: (value === '0' ? $t('common.false') : $t('common.true')) }}
        </div>
        <div v-else class="clearfix">
            <div class="float-left" :data-name="field.name">
                <b-form-checkbox v-if="visualStyle === 'explorer'" switch :checked="checked" @input="changed">{{field.label
                    || field.name}}</b-form-checkbox>
                <SwitchComponent v-else class="float-left" :checked="checked" :onchange="changed">{{field.label ||
                    field.name}}
                </SwitchComponent>
            </div>
            <span v-if="(showHelp === undefined || showHelp) && field.help" class="data-help">
                <span class="fa fa-question-circle float-right" :title="field.help"></span>
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
    import LabelComponent from './Label.vue'
    import SwitchComponent from './Switch.vue'
    import Widget from '../../mixins/Widget.js';
    export default {
        mixins: [Widget],
        name: 'checkbox-component',
        components: { LabelComponent, SwitchComponent },
        methods: {
            changed(newValue) {
                this.triggerUpdateEvent(this.message, this.field, newValue ? '1' : '0',
                    newValue ? this.$t('common.yes') : this.$t('common.no'));
            }
        },
        data() {
            return {
                id: '',
                checked: false,
            };
        },
        mounted() {
            let input = this.$refs.fieldElement //this.$el.querySelector('input[type="checkbox"]');
            input.id = `checkboxComponentInput-${this.field.name}`;
            this.checked = this.value === 1 || this.value === '1' || this.value === 'true';
            if (this.value === null && this.field.default === '1') {
                this.checked = true;
                this.changed(this.field.default);
            }
            this.id = `check_${this._uid}`;
        },
        watch: {
            value: function () {
                this.checked = this.value === 1 || this.value === '1';
            }
        }
    }
</script>