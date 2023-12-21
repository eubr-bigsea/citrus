<template>
    <div class="float-right" role="group">
        <button v-if="showMoveDown" class="btn btn-sm" :title="$t('actions.moveDown')"
        @click="emit('on-move', taskId, 'down')"><font-awesome-icon icon="fa fa-caret-down" /></button>
        <button v-if="showMoveUp" class="btn btn-sm" :title="$t('actions.moveUp')"
        @click="emit('on-move', taskId, 'up')"><font-awesome-icon icon="fa fa-caret-up" /></button>
        <button class="btn btn-sm" :title="$t('actions.delete')"
        @click="emit('on-remove', taskId)"><font-awesome-icon icon="fa fa-times" /></button>
        <button class="btn btn-sm" :title="$t('actions.add')" 
        @click="emit('on-add', taskId)">
        <font-awesome-icon icon="fa fa-plus" /></button>
        <button class="btn btn-sm btn-success" :title="$t('actions.execute')"
            @click="emit('on-execute', taskId)">
            <font-awesome-icon icon="fa fa-caret-right" /></button>
    </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['on-add', 'on-remove', 'on-move', 'on-execute']);
const props = defineProps({
    showMoveUp: {type: Boolean, default: true},
    showMoveDown: {type: Boolean, default: true},
    taskId: {type: String, required: true},
});

</script>
<style scoped>

</style>