<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <div>
            <v-select v-model="values" :multiple="multiple" label="value"
                :taggable="true" :close-on-select="true" :options="formats" @input="updated">
                <div slot="no-options"></div>
            </v-select>
            <small>Você pode personalizar o formato, digitando-o conforme a sintaxe da linguagem Java (<a href="https://bit.ly/3tbPJTK">https://bit.ly/3tbPJTK</a>)</small>
        </div>
    </div>
</template>
<script>
    import vSelect from "vue-select";
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    export default {
        components: {
            'v-select': vSelect,
            LabelComponent
        },
        mixins: [Widget],
        props: {
            multiple: {type: Boolean, default: () => false},
            type: {type: String, default: () => null},
            value: { type: Array, default: () => [] },
        },
        data() {
            return {
                values: [],
                formats: [
                    'dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy/MM/dd',
                    'ddMMyyyy', 'MMddyyyy', 'yyyyMMdd',
                    'dd-MM-yyyy', 'MM-dd-yyyy', 'yyyy-MM-dd',
                    'dd.MM.yyyy', 'MM.dd.yyyy', 'yyyy.MM.dd',

                    'dd/MM/yyyy HH:mm', 'MM/dd/yyyy HH:mm', 'yyyy/MM/dd HH:mm',
                    'ddMMyyyy HH:mm', 'MMddyyyy HH:mm', 'yyyyMMdd HH:mm',
                    'dd-MM-yyyy HH:mm', 'MM-dd-yyyy HH:mm', 'yyyy-MM-dd HH:mm',
                    'dd.MM.yyyy HH:mm', 'MM.dd.yyyy HH:mm', 'yyyy.MM.dd HH:mm',

                    'dd/MM/yyyy HH:mm:ss', 'MM/dd/yyyy HH:mm:ss', 'yyyy/MM/dd HH:mm:ss',

                    'EEE, d MMM yyyy HH:mm:ss Z',
                ]
            }
        },
        mounted() {
            this.values = this.value;
        },
        methods: {
            updated(val) {
                this.$root.$emit(this.message, this.field, val);
                this.$emit('updated', this.field, val);
            }
        },
    }
</script>
<style>
    .v-select ul.dropdown-menu {
        font-size: 1em;
    }
</style>
