<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <div>
            <v-select v-if="type !== 'tag'" :options="suggestions" :multiple="true || (!params || params.multiple)" 
               :value.sync="values" :on-change="updated"
               label="value"
                :taggable="false" :closeOnSelect="false">
                <div slot="no-options"></div>
            </v-select>
            <v-select v-else :multiple="true" 
            :value.sync="values" :on-change="updated"
            label="value"
            :taggable="true" :closeOnSelect="true">
            <div slot="no-options"></div>
        </v-select>
        </div>
    </div>
</template>
<script>
    import vSelect from "vue-select";
    import LabelComponent from './Label.vue'
    export default {
        components: {
            'v-select': vSelect,
            LabelComponent
        },
        computed: {
            suggestions() {
                let obj = JSON.parse(this.field.values);
                return obj || [];
            }
        },
        methods: {
            updated(val) {
                // console.debug(val)
                // this.$root.$emit(this.message, this.field, val);
            }
        },
        mounted(){
            this.values = this.value;
        },
        data(){
            return {
                values: []
            }
        },
        props: {
            type: "",
            value: {default: []}, 
            field: null, 
            message: {
                type: String,
                default: 'update-form-field-value'
            }      
        },
    }
</script>