<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <div>
            <v-select :options="suggestions" :multiple="true || (!params || params.multiple)" :value.sync="value" :on-change="updated"
                :taggable="true" :close-on-select="false">
                <slot name="no-options">{{ $t('messages.noMatching') }}</slot>
            </v-select>
        </div>
    </div>
</template>
<script>
    // Deprecated
    import vSelect from "vue-select";
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    export default {
        components: {
            'v-select': vSelect,
            LabelComponent
        },
        mixins: [Widget],
        computed: {
            params() {
                let result = null;
                if (this.field.values) {
                    result = JSON.parse(this.field.values);
                }
                return result;
            }
        },
        methods: {
            updated(val) {
                this.$root.$emit(this.message, this.field, val);
            }
        },
    }
</script>
