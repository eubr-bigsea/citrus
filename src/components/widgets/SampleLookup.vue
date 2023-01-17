<template>
    <div>
        <LabelComponent :field="field"
                        :value="value" />
        <div>
            <v-select v-model:value="value"
                      :options="suggestions"
                      :multiple="multiple"
                      label="label"
                      :taggable="false"
                      :close-on-select="true"
                      :reduce="option => option.value"
                      @input="updated">
                <div slot="no-options" />
            </v-select>
        </div>
    </div>
</template>
<script>
import vSelect from "vue-select";
import axios from 'axios';
import LabelComponent from './Label.vue'
import Widget from '../../mixins/Widget.js';

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
/**
     * Used to select value(s) from lookups filled with data
     * from Limonero.
     */
export default {
    components: {
        'v-select': vSelect,
        LabelComponent
    },
    mixins: [Widget],
    props: {
        dataSourceId: {type: Number, default: () => null},
        value: { default: () => [], type: Array },
    },
    data() {
        return {
            values: [],
            suggestions: [],
        }
    },
    computed: {
        multiple(){
            return this.field.multiplicity === 'ONE_OR_MORE' ||
                    this.field.multiplicity == 'ZERO_OR_MORE';
        }
    },
    watch: {
        value(v){
            console.debug(v);
        }
    },
    mounted() {
        this._loadLookup()
    },
    methods: {
        updated(val) {
            console.debug('Valor', val, this.field)
            this.$root.$emit(this.message, this.field, val);
        },
        _loadLookup() {
            const self = this;
            axios.get(`${limoneroUrl}/datasources/sample/${self.field.lookup}?limit=1000`, {})
                .then(result => {
                    self.suggestions = result.data.data;
                });
        }
    }
}
</script>
<style>
    .v-select ul.dropdown-menu {
        font-size: 1em;
    }
</style>
