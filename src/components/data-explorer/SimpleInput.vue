<template>
    <b-modal ref="modal" :centered="true" button-size="sm" :title="title" :cancel-title="cancelTitle"
        :ok-title="okTitle" @ok="localOkClicked">
        <p>{{message}}:</p>
        <b-select v-if="options" :options="options" v-model="value"></b-select>
        <b-form-input v-else class="form-control" v-model="value" autofocus></b-form-input>
    </b-modal>
</template>
<script>
    export default {
        data() {
            return {
                cancelTitle: null,
                message: null,
                okTitle: null,
                ok: null,
                options: null,
                title: null,
                value: null,
            }
        },
        methods: {
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