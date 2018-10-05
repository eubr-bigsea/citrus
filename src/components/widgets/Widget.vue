<script>
    import Vue from 'vue'

    const fieldIsRequiredSymbol = '<span class="fa fa-asterisk" v-show="field.required"></span>'
    const baseLabel = '<p>{{field.label}} ' + fieldIsRequiredSymbol +
        '<span class="fa fa-question-circle-o pull-right" :title="field.help"></span></p>';

    const CodeComponent = Vue.extend({
        methods: {
            updated: _.debounce(function (e) {
                let content = e.target.value || e.target.textContent;
                eventHub.$emit('update-form-field-value', this.field, content);
            }, 500)
        },
        props: { value: 0, field: null },
        template:
            `<div>${baseLabel}
            <textarea autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" 
                class="form-control input-sm code" @keyup="updated" :value="value === null ? field.default: value"></textarea>
        </div>`
    });
    const CheckboxComponent = {
        name: 'checkbox-component',
        methods: {
            updated(e) {
                eventHub.$emit('update-form-field-value', this.field,
                    !this.checked ? '1' : '0');
            }
        },
        computed: {
            checked() {
                return (this.value === 1 || this.value === '1')
                    || (!this.value &&
                        (this.field['default'] === 1 ||
                            this.field['default'] === '1'));
            },
        },
        data() {
            return {
                id: '',
            };
        },
        mounted() {
            let input = this.$refs.fieldElement //this.$el.querySelector('input[type="checkbox"]');
            input.id = `checkboxComponentInput-${this.field.name}`;
            this.checked = this.value === 1 || this.value === '1';
            this.id = `check_${this._uid}`;
        },
        props: { value: 0, field: {} },
        template: `
    <div class="checkbox" ref="fieldElement"> 
        <input type="checkbox" v-model="checked" @change="updated" value="1" :id="id" data-algo="true"/>
        <label :for="id">{{field.label}}</label>
        <span class="fa fa-question-circle-o pull-right" :title="field.help"></span>
    </div>`
    };
    const TextComponent = Vue.extend({
        methods: {
            updated: _.debounce(function (e) { eventHub.$emit('update-form-field-value', this.field, e.target.value); }, 500)
        },
        props: { value: 0, field: null },
        template: '<div>' + baseLabel +
            '<input type="text" maxlenght="100" class="form-control input-sm" :value="value === null ? field.default: value" @input="updated" /></div>',
    });


    const TextAreaComponent = Vue.extend({
        methods: {
            updated: _.debounce(function (e) { eventHub.$emit('update-form-field-value', this.field, e.target.value); }, 500)
        },
        computed: {
            normalizedValue: () => {
                return this.field.value || this.field.default;
            }
        },
        props: { value: '', field: null },
        template: '<div>' + baseLabel +
            '<textarea class="form-control input-sm" @keyup="updated" :value="value === null ? field.default: value"></textarea></div>',

    });

    export default CheckboxComponent
</script>