<template>
    <b-modal ref="modal" size="lg" :title="$t('common.history')" ok-disabled>
        <div class="historyArea">
            <table class="table table-sm table-striped text-center">
                <tr>
                    <th>{{$t('common.version')}}</th>
                    <th>{{$t('common.date')}}</th>
                    <th>{{$t('common.author')}}</th>
                    <th>{{$t('common.action')}}</th>
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
        <template #modal-footer>
            <div class="w-100">
                <b-button variant="secondary_sm" class="float-right btn-outline-secondary" @click="close">
                    {{$t('actions.cancel')}}
                </b-button>
            </div>
        </template>
    </b-modal>
</template>
<script>
export default {
    props: {
        history: { type: Array, default: () => [] },
    },
    emits: ['onrestore-workflow',],
    methods: {
        restore(version) {
            this.$emit('onrestore-workflow', version);
        },
        show() {
            this.$refs.modal.show();
        },
        close() {
            this.$refs.modal.hide();
        }
    }
};
</script>