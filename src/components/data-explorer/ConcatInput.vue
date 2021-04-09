<template>
    <b-modal ref="modal" :centered="true" button-size="sm" :title="title" :cancel-title="cancelTitle"
        :ok-title="okTitle" @ok="localOkClicked">
        <b-radiogroup>
            <b-radio>
                Atributo:
                <b-select v-if="attributes" :options="attributes" v-model="attribute"></b-select>
            </b-radio>
            <b-radio>
                Valor constante:
                <b-form-input  class="form-control" v-model="constant" autofocus></b-form-input>
            </b-radio>
        </b-radiogroup>
    </b-modal>
</template>
<script>
    export default {
        data() {
            return {
                attribute: null,
                attributes: null,
                constant: null,
                cancelTitle: null,
                format: null,
                message: null,
                okTitle: null,
                ok: null,
                title: null,

            }
        },
        methods: {
            localOkClicked() {
                this.ok && this.ok(this.attribute, this.constant);
            },
            show(config) {
                Object.assign(this, this, config);
                this.$refs.modal.show();
            }
        },
    }
</script>