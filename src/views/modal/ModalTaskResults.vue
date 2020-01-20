<template>
    <b-modal ref="modal" size="lg" :title="task.name" :ok-only="true">
        <p>{{task.step.status}}</p>
        <div v-for="log in task.step.logs" :key="log.id">
            {{log}}
        </div>
        <div>
            {{task.result}}
        </div>
    </b-modal>
</template>
<script>
    export default {
        props: {
            task: {},
        },
        methods: {
            show() {
                this.$refs.modal.show();
            }
        }
    }
</script>