<template>
    <div ref="base" class="base" />
</template>
<script>
export default {
    name: 'PulseComponent'
}
</script>
<style scoped>
    .base {
        background: #FF4136;
        border-radius: 50%;
        margin: 4px;
        height: 8px;
        width: 8px;

        box-shadow: 0 0 0 0 rgba(255, 0, 0, 1);
        transform: scale(1);
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(0.9);
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
        }

        80% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
        }

        100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
        }
    }
</style>