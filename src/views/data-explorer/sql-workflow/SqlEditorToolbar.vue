<template>
    <div class="w-100">
        <div class="float-left">
            <button class="btn btn-sm btn-outline-  secondary" :title="$t('actions.save')" @click="handleShowModal">
                <font-awesome-icon v-if="task.forms.save.value" icon="fa fa-check" />
                    <span v-if="task.forms.save.value"> Salvar dados</span>
                    <span v-else> Habilitar salvar dados ...</span>
            </button>
        </div>
        <div class="float-right" role="group">
            <button v-if="showMoveDown" class="btn btn-sm" :title="$t('actions.moveDown')"
                @click="emit('on-move', task.id, 'down')"><font-awesome-icon icon="fa fa-caret-down" /></button>
            <button v-if="showMoveUp" class="btn btn-sm" :title="$t('actions.moveUp')"
                @click="emit('on-move', task.id, 'up')"><font-awesome-icon icon="fa fa-caret-up" /></button>
            <button class="btn btn-sm" :title="$t('actions.delete')" @click="emit('on-remove', task.id)"><font-awesome-icon
                    icon="fa fa-times" /></button>
            <button class="btn btn-sm" :title="$t('actions.add')" @click="emit('on-add', task.id)">
                <font-awesome-icon icon="fa fa-plus" /></button>
            <button class="btn btn-sm" :title="$t('actions.indent')" @click="emit('on-indent', task.id)">
                <font-awesome-icon icon="fa fa-indent" />
            </button>
            <button class="btn btn-sm btn-success" :title="$t('actions.execute')" @click="emit('on-execute', task.id)">
                <font-awesome-icon icon="fa fa-caret-right" /></button>
        </div>
        <div v-if="status" class="text-center text-info">
            <small>{{status}}</small>
        </div>
        <sql-editor-save-as-modal ref="modal" :task="task" />
    </div>
</template>
<script setup>
import { ref } from 'vue';
import SqlEditorSaveAsModal from './SqlEditorSaveAsModal.vue';

const status = ref(false);
const emit = defineEmits(['on-add', 'on-remove', 'on-move', 'on-execute']);
const props = defineProps({
    showMoveUp: { type: Boolean, default: true },
    showMoveDown: { type: Boolean, default: true },
    task: { type: Object, required: true },
});

const modal = ref();
const handleShowModal = () => {
    modal.value.show()
}
const showStatus = (state) => {
    status.value = state;
    setTimeout(() => {
        status.value = null;
    }, 2000);
}
defineExpose({ showStatus })
</script>
<style scoped></style>