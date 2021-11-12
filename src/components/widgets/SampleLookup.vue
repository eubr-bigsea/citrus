<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <div>
            <v-select :options="suggestions" :multiple="multiple"
                :value.sync="value" @input="updated" label="label" :taggable="false" :closeOnSelect="true"
                :reduce="option => option.value">
                <div slot="no-options"></div>
            </v-select>
        </div>
    </div>
</template>
<script>
    import vSelect from "vue-select";
    import axios from 'axios';
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';

    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    /**
     * Used to select value(s) from lookups filled with data 
     * from Limonero. 
     */
    export default {
        mixins: [Widget],
        components: {
            'v-select': vSelect,
            LabelComponent
        },
        computed: {
            multiple(){
                return this.field.multiplicity === 'ONE_OR_MORE' || 
                    this.field.multiplicity == 'ZERO_OR_MORE';
            }
        },
        methods: {
            updated(val) {
                console.debug('Valor', val, this.field)
                this.$root.$emit(this.message, this.field, val);
            },
            _loadLookup() {
                const self = this;
                const result = axios.get(`${limoneroUrl}/datasources/sample/${self.field.lookup}?limit=1000`, {})
                    .then(result => {
                        self.suggestions = result.data.data;
                    });
            }
        },
        mounted() {
            this._loadLookup()
        },
        data() {
            return {
                values: [],
                suggestions: [],
            }
        },
        props: {
            dataSourceId: null,
            value: { default: [] },
        },
        watch: {
            value(v){
                console.debug(v);
            }
        }
    }
</script>
<style>
    .v-select ul.dropdown-menu {
        font-size: 1em;
    }
</style>