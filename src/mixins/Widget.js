/* Common props and methods for all widgets */
export default {
    props: {
            field: {},
            language: {default: 'en', type: String},
            message: { default: 'update-form-field-value', type: String},
            options: {},
            readOnly: {default: false},
            suggestionEvent: { },
            value: '',
    }
}
