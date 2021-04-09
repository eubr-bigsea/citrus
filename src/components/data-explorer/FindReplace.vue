<template>
    <b-modal ref="modal" :centered="true" button-size="sm" :title="title + ': ' + attribute.label" :cancel-title="cancelTitle"
        :ok-title="okTitle" @ok="localOkClicked">
        <p>{{$t('actions.find')}}:
            <b-form-input v-if="format === 'number'" class="form-control" v-model="valueFind" type="number" autofocus maxlength="10" />
            <b-form-input v-else class="form-control" v-model="valueFind" autofocus maxlength="50" />
            <small>Um valor vazio significa valor nulo</small>
        </p>

        <p>{{$t('actions.replace')}}:
            <b-form-input v-if="format === 'number'" class="form-control" v-model="valueReplace" type="number" maxlength="10" />
            <b-form-input v-else class="form-control" v-model="valueReplace" maxlength="50" />
            <small>Um valor vazio significa valor nulo</small>
        </p>

        <p>
            Nome do atributo de destino:
            <b-form-input v-model="alias"></b-form-input>
        </p>
        <b-checkbox v-model="removeOriginal">Substituir atributo original</b-checkbox>
    </b-modal>
</template>
<script>
    export default {
        data() {
            return {
                attribute: {label: ''},
                alias: null,
                cancelTitle: null,
                format: null,
                messageFind: null,
                messageReplace: null,
                okTitle: null,
                ok: null,
                options: null,
                removeOriginal: false,
                title: null,
                valueFind: null,
                valueReplace: null,

            }
        },
        methods: {
            localOkClicked() {
                this.ok && this.ok(this.valueFind, this.valueReplace, this.alias, this.removeOriginal);
                this.valueFind = null;
                this.valueReplace = null;
                this.alias = null;
                this.removeOriginal = false;
            },
            show(config) {
                Object.assign(this, this, config);
                if (this.alias === null){
                    this.alias = this.attribute.label + '1'; // FIXME!!!!
                }
                this.$refs.modal.show();
            }
        },
    }
</script>