<template>
    <b-modal ref="modal" size="lg" :title="$t('common.history')" ok-disabled>
        <div class="historyArea">
            <table class="table table-sm table-striped text-center">
                <tr>
                    <th>{{$tc('common.version')}}</th>
                    <th>{{$tc('common.date')}}</th>
                    <th>{{$tc('common.author')}}</th>
                    <th>{{$tc('common.action')}}</th>
                </tr>
                <tr v-for="h in history" :key="h.id">
                    <td>{{h.version}}</td>
                    <td>{{h.date}}</td>
                    <td>{{h.user_name}}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" @click="restore(h.version)">
                            {{$t('actions.restore')}}
                        </button>
                    </td>
                </tr>
            </table>
        </div>
        <div slot="modal-footer" class="w-100">
            <b-btn variant="secondary_sm" class="float-right btn-outline-secondary" @click="close">
                {{$t('actions.cancel')}}
            </b-btn>
        </div>
    </b-modal>
</template>
<script>
export default {
    props: {
        history: { type: Array, default: () => [] },
    },
    methods: {
        restore(version) {
            this.$root.$emit('onrestore-workflow', version);
        },
        show() {
            this.$refs.modal.show();
        },
        close() {
            this.$refs.modal.hide();
        }
    }
}
</script>