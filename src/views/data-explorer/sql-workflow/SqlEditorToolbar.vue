<template>
    <div class="w-100">
        <div class="float-left">
            <button class="btn btn-sm btn-outline-secondary" :title="$t('actions.save')" @click="handleShowModal">
                <font-awesome-icon v-if="task.forms.save.value" icon="fa fa-check" />
                <span v-if="task.forms.save.value == 1"> Editar opções para salvar...</span>
                <span v-else> Habilitar salvar dados...</span>
            </button>
        </div>
        <div class="float-left ml-4">
            <select class="form-control form-control-sm" @change="emit('on-toggle-use-hwc', task, useHWCVal)"
                v-model="useHWCVal">
                <option>Não usar HWC</option>
                <option value="execute">Usar método execute() do HWC</option>
                <option value="executeQuery">Usar método executeQuery() do HWC</option>
                <option value="executeUpdate">Usar método executeUpdate() do HWC</option>
            </select>
        </div>
        <div class="float-right" role="group">
            <button v-if="showMoveDown" class="btn btn-sm" :title="$t('actions.moveDown')"
                @click="emit('on-move', task.id, 'down')"><font-awesome-icon icon="fa fa-caret-down" /></button>
            <button v-if="showMoveUp" class="btn btn-sm" :title="$t('actions.moveUp')"
                @click="emit('on-move', task.id, 'up')"><font-awesome-icon icon="fa fa-caret-up" /></button>
            <button class="btn btn-sm" :title="$t('actions.delete')"
                @click="emit('on-remove', task.id)"><font-awesome-icon icon="fa fa-times" /></button>
            <button class="btn btn-sm" :title="$t('actions.add')" @click="emit('on-add', task.id)">
                <font-awesome-icon icon="fa fa-plus" /></button>
            <button class="btn btn-sm" :title="$t('actions.indent')" @click="emit('on-indent', task.id)">
                <font-awesome-icon icon="fa fa-indent" />
            </button>
            <b-dropdown id="dropdown-dropright" text="Drop-Right" variant="outline-success" class="m-2" size="sm">
                <template #button-content>
                    <font-awesome-icon icon="fa fa-caret-right" />
                    Executar ...
                </template>
                <b-dropdown-item href="#" @click="emit('on-execute', task.id, false)">Até aqui</b-dropdown-item>
                <b-dropdown-item href="#" @click="emit('on-execute', task.id, true)">Só este</b-dropdown-item>
            </b-dropdown>
        </div>
        <div v-if="status" class="text-center text-info">
            <small>{{ status }}</small>
        </div>
        <sql-editor-save-as-modal ref="modal" :task="task" />
    </div>
</template>
<script setup>
import { ref } from 'vue';
import SqlEditorSaveAsModal from './SqlEditorSaveAsModal.vue';

const status = ref(false);
const emit = defineEmits(['on-add', 'on-remove', 'on-move', 'on-execute',
    'on-toggle-use-hwc']);
const props = defineProps({
    showMoveUp: { type: Boolean, default: true },
    showMoveDown: { type: Boolean, default: true },
    task: { type: Object, required: true },
    useHWC: { type: String, default: null },
});
const useHWCVal = ref(props.useHWC)
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