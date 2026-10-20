<template>
    <div class="small-notifications scroll-area" :style="{'height': props.height}">
        <template v-if="notifications.length">
            <div v-for="notification,i in notifications" :key="i">
                {{$filters.formatJsonDate(notification.date.substring(0, 19) , 'dd/MM/yyyy HH:mm:ss')}} #{{notification.id}}:
                {{$t('pipeline.list.stepNumber', { n: notification.order })}}:
                <span class="notification-status" :style="{ color: statusOf(notification.status).color }">
                    <font-awesome-icon :icon="`fa ${statusOf(notification.status).icon}`"
                                       :spin="statusOf(notification.status).spin" />
                    {{$t(`status.${notification.status}`)}}
                </span>
            </div>
        </template>
        <template v-else>
            {{$t('pipeline.list.noNotifications')}}
        </template>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { statusOf } from '@/views/pipeline/run-status.js';

const props = defineProps({
    height: {
        type: String, default: "100%"
    },
});

const notifications = ref([]);

// receives a raw 'update pipeline run' websocket message and keeps the
// last 100 notifications, newest first
function push(msg) {
    notifications.value.unshift({
        id: msg.pipeline_run.id,
        status: msg.pipeline_step_run.status,
        date: msg.date,
        order: msg.pipeline_step_run.order
    });
    notifications.value.length = notifications.value.length > 100 ? 100 : notifications.value.length;
}

defineExpose({ push });
</script>
<style scoped>
.small-notifications>div {
    border-bottom: 1px solid #eee;
    margin-bottom: 5px;
    padding: 2px 0
}

.small-notifications {
    font-size: 9pt;
    overflow-y: auto;
    max-height: 80vh
}
</style>