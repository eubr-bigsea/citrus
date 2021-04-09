<template>
    <b-modal ref="modal" :centered="true" button-size="sm" :title="title" :cancel-title="cancelTitle"
        :ok-title="okTitle" @ok="localOkClicked" :no-close-on-backdrop="true">
        <p>{{message}}:</p>
        <v-select v-if="format === 'select2' " :multiple="multiple" v-model="value" label="value" :taggable="taggable"
            :closeOnSelect="true" :options="options">
            <div slot="no-options"></div>
        </v-select>
        <DateFormatPicker v-if="format === 'dateformatpicker' " :multiple="multiple" v-model="value" label="value"
            :taggable="taggable" :closeOnSelect="true" :field="field" @updated="updated">
            <div slot="no-options"></div>
        </DateFormatPicker>
        <b-select v-else-if="options" :options="options" v-model="value"></b-select>
        <b-form-input v-else-if="format === 'number'" class="form-control" v-model="value" type="number" autofocus>
        </b-form-input>
        <b-form-input v-else class="form-control" v-model="value" autofocus></b-form-input>
    </b-modal>
</template>
<script>
    import vSelect from "vue-select";
    import DateFormatPicker from '../widgets/DateFormatPicker';
    export default {
        components: {
            'v-select': vSelect,
            DateFormatPicker,
        },
        data() {
            return {
                field:{},
                alias: null,
                cancelTitle: null,
                format: null,
                message: null,
                multiple: false,
                okTitle: null,
                ok: null,
                options: null,
                replace: false,
                title: null,
                value: null,
                taggable: false,
            }
        },
        methods: {
            updated(field, value){
                this.value = value;
            },
            localOkClicked() {
                this.ok && this.ok(this.value);
            },
            show(config) {
                Object.assign(this, this, config);
                this.$refs.modal.show();
            }
        },
    }
</script>