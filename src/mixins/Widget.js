/* Common props and methods for all widgets */
export default {
    props: {
        acceptExtendedInput: { default: false, type: Boolean },
        // Handle different versions
        compatibility: {
            default: '2.0.0',
            type: String
        },
        field: {
            default: function () { return {}; },
            required: true,
            type: Object,
        },
        asWidget: { default: true, type: Boolean },
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
        visualStyle: { type: String },
        suggestionEvent: {
            type: Function,
        },
        small: { default: false, type: Boolean },
        showHelp: { type: Boolean, default: true },
        extendedSuggestionEvent: {
            type: Function,
        },
        value: {
            default: '',
        },
    },
    methods: {
        triggerUpdateEvent(message, field, value, labelValue) {
            this.$root.$emit(message, field, value, labelValue);
            this.$emit('update', field, value, labelValue);
        }
    },
}
