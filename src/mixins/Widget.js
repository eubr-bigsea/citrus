/* Common props and methods for all widgets */
export default {
    props: {
        field: {
            default: function () { return {}; },
            required: true,
            type: Object,
        },
        language: {
            default: 'en',
            type: String
        },
        message: { default: 'update-form-field-value', type: String },
        options: {
            default: function () { return {}; },
            type: Object
        },
        readOnly: { default: false, type: Boolean },
        suggestionEvent: {
            type: Function,
        },
        value: { 
            default: '',
        },
    }
}
