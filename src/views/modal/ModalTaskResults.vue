<template>
    <b-modal ref="modal" size="xl" :ok-only="true" scrollable :title="task.name" header-bg-variant="dark"
        header-text-variant="light" :hide-footer="true">
        <p>{{task.step.status}}</p>
        <div>
            <div class="step-log" v-for="log in task.step.logs" :key="log.id">
                <div class="step-date">{{log.date | formatJsonDate}}</div>
                <div v-if="log.type==='TEXT'">
                    <small>{{log.message}}</small>
                </div>
                <div v-if="log.type === 'HTML'">
                    <div class="html-div" v-html="log.message"></div>
                </div>
                <div v-if="log.type === 'IMAGE'">
                    <img class="image" :src="'data:image/png;base64,' + log.message">
                </div>
            </div>
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