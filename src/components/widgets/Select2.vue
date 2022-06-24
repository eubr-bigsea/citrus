<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <div>
            <v-select v-if="type !== 'tag' && type !== 'single-tag' " :options="suggestions" :multiple="true || (!params || params.multiple)"
                :value.sync="values" :on-change="updated" label="value" :taggable="false" :close-on-select="false">
                <div slot="no-options"></div>
            </v-select>
            <v-select v-else v-model="values" :multiple="type !== 'single-tag'" :options="suggestions" :on-change="updated"
                label="value" :taggable="true" :close-on-select="type === 'single-tag'" @input="updated">
                <div slot="no-options"></div>
            </v-select>
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
            type: {type: String, default: () => null},
            value: { default: ()=> [], type: Array },
        },
        data() {
            return {
                values: []
            }
        },
        computed: {
            suggestions() {
                const obj = (typeof (this.field.values) === 'object') ? this.field.values : JSON.parse(this.field.values);
                if (obj) {
                    return obj.sort((a, b) => a.value < b.value ? -1 : (a.value === b.value ? 0 : 1));
                } else {
                    return [];
                }
            }
        },
        mounted() {
            this.values = this.value;
        },
        methods: {
            updated(val) {
                //this.$root.$emit(this.message, this.field, val);
                this.triggerUpdateEvent(this.message, this.field, val);
            }
        },
    }
</script>
<style>
    .v-select ul.dropdown-menu {
        font-size: 1em;
    }
</style>
