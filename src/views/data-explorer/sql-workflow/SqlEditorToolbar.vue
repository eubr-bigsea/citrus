<template>
    <div class="w-100">
        <div v-if="task.operation.slug === 'execute-sql'" class="float-left mt-1">
            <button class="btn btn-sm btn-outline-secondary" :title="$t('actions.save')" @click="handleShowModal">
                <font-awesome-icon icon="fa fa-save" :class="task.forms.save.value === '1' ? 'text-success': 'text-secondary'" />
                <span v-if="task.forms.save.value == 1"> Editar opções para salvar...</span>
                <span v-else> Habilitar salvar dados...</span>
            </button>
        </div>
        <div v-if="task.operation.slug === 'execute-sql'" class="float-left ml-4 mt-1">
            <select v-model="useHWCVal" class="form-control form-control-sm"
                    @change="emit('on-toggle-use-hwc', task, useHWCVal)">
                <optgroup label="Spark">
                    <option value="spark">
                        Usar o Spark SQLContext
                    </option>
                </optgroup>
                <optgroup label="Hive Warehouse Connector">
                    <option value="execute">
                        Usar método execute()
                    </option>
                    <option value="executeQuery">
                        Usar método executeQuery()
                    </option>
                    <option value="executeUpdate">
                        Usar método executeUpdate()
                    </option>
                </optgroup>
            </select>
        </div>

        <b-button-group class="float-right mt-1">
            <button v-if="showMoveDown" class="btn btn-sm btn-outline-secondary" :title="$t('actions.moveDown')"
                    @click="emit('on-move', task.id, 'down')">
                <font-awesome-icon icon="fa fa-caret-down" />
            </button>
            <button v-if="showMoveUp" class="btn btn-sm btn-outline-secondary" :title="$t('actions.moveUp')"
                    @click="emit('on-move', task.id, 'up')">
                <font-awesome-icon icon="fa fa-caret-up" />
            </button>
            <button class="btn btn-sm btn-outline-secondary" :title="$t('actions.delete')"
                    @click="emit('on-remove', task.id)">
                <font-awesome-icon icon="fa fa-times" />
            </button>
            <button class="btn btn-sm btn-outline-secondary" :title="$t('actions.indent')" @click="emit('on-indent', task.id)">
                <font-awesome-icon icon="fa fa-indent" />
            </button>
            <b-dropdown variant="outline-primary" right size="sm" no-caret
                        :title="$t('actions.add')">
                <template #button-content>
                    <font-awesome-icon icon="fa fa-plus" />
                </template>
                <b-dropdown-item href="#" @click="emit('on-add', task.id, 'sql')">
                    SQL
                </b-dropdown-item>
                <b-dropdown-item href="#" @click="emit('on-add', task.id, 'python')">
                    Python
                </b-dropdown-item>
            </b-dropdown>
            <b-dropdown variant="outline-success" right size="sm" no-caret
                        :title="$t('actions.execute')">
                <template #button-content>
                    <font-awesome-icon icon="fa fa-play" />
                </template>
                <b-dropdown-item href="#" @click="emit('on-execute', task.id, false)">
                    Até esta célula
                </b-dropdown-item>
                <b-dropdown-item href="#" @click="emit('on-execute', task.id, true)">
                    Só esta célula
                </b-dropdown-item>
            </b-dropdown>
        </b-button-group>
        <sql-editor-save-as-modal v-if="showSaveAs" ref="modalSaveAs" :task="task" />
        <div v-if="status" class="text-center text-info" style="line-height:15px">
            <small>{{status}}</small>
        </div>
    </div>
</template>
<script setup>
import { ref, nextTick } from 'vue';

import SqlEditorSaveAsModal from './SqlEditorSaveAsModal.vue';

const lixo = ref([1, 2]);
const status = ref(false);
const emit = defineEmits(['on-add', 'on-remove', 'on-move', 'on-execute',
    'on-toggle-use-hwc']);
const props = defineProps({
    showMoveUp: { type: Boolean, default: true },
    showMoveDown: { type: Boolean, default: true },
    task: { type: Object, required: true },
    useHWC: { type: String, default: null },
});
const useHWCVal = ref(props.useHWC);
const modalSaveAs = ref();
const showSaveAs = ref(false);
const handleShowModal = () => {
    showSaveAs.value = true;
    nextTick(() => modalSaveAs.value.show());
};
const modalUseCodeLibrary = ref();
const showUseCodeLibrary = ref(false);

const showStatus = (state) => {
    status.value = state;
    setTimeout(() => {
        status.value = null;
    }, 2000);
};
defineExpose({ showStatus });
</script>
<style scoped></style>