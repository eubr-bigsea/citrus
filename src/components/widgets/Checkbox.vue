<template>
    <div ref="fieldElement">
        <div class="float-left">
            <SwitchComponent class="float-left" :onchange="changed" :checked="checked">{{field.label}}</SwitchComponent>
        </div>
        <div class="float-right">
            <span class="fa fa-question-circle float-right" :title="field.help"></span>
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import SwitchComponent from './Switch.vue'
    export default {
        name: 'checkbox-component',
        components: { LabelComponent, SwitchComponent },
        methods: {
            changed(newValue){
                this.checked = newValue ? '1' : '0';
                this.$root.$emit(this.message, this.field, this.checked, 
                    this.checked? this.$t('common.yes'): this.$t('common.no'));
            }
        },
        data() {
            return {
                id: '',
                checked: false,
            };
        },
        mounted() {
            this.$on('input', () => {alert('fff')})
            let input = this.$refs.fieldElement //this.$el.querySelector('input[type="checkbox"]');
            input.id = `checkboxComponentInput-${this.field.name}`;
            this.checked = this.value === 1 || this.value === '1';
            if (this.value === null && this.field.default === '1') {
                this.checked = true;
                this.changed(this.field.default);
            }
            this.id = `check_${this._uid}`;
        },
        props: {
            value: 0,
            field: {},
            message: {
                default: 'update-form-field-value'
            }
        },
        watch: {
            value: function(val) {
                this.checked = this.value === 1 || this.value === '1';
            }
        }
    }
</script>