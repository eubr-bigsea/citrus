<template>
    <div class="small-notifications scroll-area" :style="{'height': props.height}">
        <template v-if="props.notifications.length">
            <div v-for="notification,i in props.notifications" :key="i">
                {{$filters.formatJsonDate(notification.date.substring(0, 19) , 'dd/MM/yyyy HH:mm:ss')}} #{{notification.id}}:
                Etapa/passo {{notification.order}}:
                {{$t(`status.${notification.status}`)}}
            </div>
        </template>
        <template v-else>
            Sem notificações recentes
        </template>
    </div>
</template>
<script setup>
const props = defineProps({
    notifications: { type: Array, required: true },
    height: {
        type: String, default: "100%"
    },
});
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