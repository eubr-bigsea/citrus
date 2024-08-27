<template>
    <div class="small-notifications scroll-area" :style="{'height': props.height}">
        <template v-if="props.notifications.length">
            <div v-for="notification in props.notifications">
                {{ notification.date.substring(0, 19) | formatJsonDate('dd/MM/yyyy HH:mm:ss') }} #{{ notification.id }}:
                Etapa/passo {{ notification.order }}:
                {{ $tc(`status.${notification.status}`) }}
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
    height: {},
})
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