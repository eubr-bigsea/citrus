<template>
    <div ref="fieldElement">
        <div class="float-left">
            <SwitchComponent class="float-left" @change="changed" :checked="checked">{{field.label}}</SwitchComponent>
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
            changed(){
                debugger
                this.value = newValue;
                    this.$root.$emit(this.message, this.field,
                        this.checked ? '1' : '0');
            }
        },
        computed: {
            checked: {
                get() {
                    return (this.value === 1 || this.value === '1')
                        || (!this.value &&
                            (this.field['default'] === 1 ||
                                this.field['default'] === '1'));
                },
                set(newValue) {
                    this.value = newValue;
                    this.$root.$emit(this.message, this.field,
                        this.checked ? '1' : '0');
                }
            },
        },
        data() {
            return {
                id: '',
                value: 0
            };
        },
        mounted() {
            this.$on('input', () => {alert('fff')})
            let input = this.$refs.fieldElement //this.$el.querySelector('input[type="checkbox"]');
            input.id = `checkboxComponentInput-${this.field.name}`;
            this.checked = this.value === 1 || this.value === '1';
            this.id = `check_${this._uid}`;
        },
        props: {
            field: {},
            message: {
                default: 'update-form-field-value'
            }
        },
    }
</script>