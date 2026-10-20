<template>
    <div class="editors" :class="{ 'disabled-cell': !cell.enabled }" :data-type="cell.operation.slug"
        :data-cell-container="cell.id">
        <div class="row">
            <div class="col-12">
                <div class="button-toolbar">
                    <sql-editor-toolbar ref="toolbarRef" :task="cell" :show-move-up="index > 0"
                        :data-task="cell.id" :show-move-down="index < total - 1"
                        :useHWC="isSql ? cell.forms.useHWC.value : null"
                        :opened="cell.forms?.opened.value"
                        @on-move="(id, direction) => emit('move', id, direction)"
                        @on-remove="(id) => emit('remove', id)"
                        @on-add="(id, type, command) => emit('add', id, type, command)"
                        @on-indent="indent"
                        @on-execute="(id, cached) => emit('execute', id, cached)"
                        @on-toggle-use-hwc="(task, value) => emit('toggle-use-hwc', task, value)"
                        @on-toggle="emit('toggle', cell)">
                        <template #end>
                            <span v-if="!cell.enabled" class="cell-disabled-tag">Desabilitada</span>
                            <span class="cell-badge" :title="`Célula ${index + 1} de ${total}`">
                                <span class="cell-badge-num">{{ index + 1 }}/{{ total }}</span>
                                <span class="cell-type-badge">
                                    <font-awesome-icon :icon="typeIcon" class="me-1" />{{ cell.operation.slug.substring(8) }}
                                </span>
                            </span>
                        </template>
                    </sql-editor-toolbar>
                </div>
            </div>
            <div class="col-12">
                <div class="cell-header">
                    <div v-if="isSql" class="cell-header-alias"
                        title="Nome usado para referenciar o resultado desta célula nos comandos SQL seguintes">
                        <label class="form-text" :for="`cell-alias-${cell.id}`">Nome no SQL:</label>
                        <input class="form-control form-control-sm" maxlength="50"
                            :id="`cell-alias-${cell.id}`" v-model="cell.name" @input="emit('dirty')" />
                    </div>
                    <div class="cell-header-comment">
                        <label class="form-text" :for="`cell-comment-${cell.id}`">{{ $t('titles.comment') }}:</label>
                        <input class="form-control form-control-sm" maxlength="100"
                            :id="`cell-comment-${cell.id}`" v-model="cell.forms.comment.value" @input="emit('dirty')" />
                    </div>
                    <div class="cell-header-enabled">
                        <b-form-checkbox v-model="cell.enabled" :value="true" switch
                            :unchecked-value="false" @change="emit('dirty')">
                            {{ $t('common.enabled') }}
                        </b-form-checkbox>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="editor p-2" style="overflow:hidden" :style="{display: cell.forms?.opened?.value ? '': 'none'}">
                    <sql-editor v-if="isSql" :query="cell.forms.query.value"
                        @update="(v) => { if (v !== cell.forms.query.value) { cell.forms.query.value = v; emit('dirty') } }" ref="editorRef"
                        :tables="dataSources" :functions="functions" :data-task="cell.id"
                        :format="{ language: 'spark', tabWidth: 2, keywordCase: 'upper', linesBetweenQueries: 2 }" />
                    <template v-else-if="cell.operation.slug === 'execute-script'">
                        <label>Caminho completo para o arquivo (visível no servidor)</label>
                        <input ref="scriptRef" class="form-control form-control-sm" type="text"
                            v-model="cell.forms.script.value" maxlength="400" @input="emit('dirty')" />
                    </template>
                    <python-editor v-else-if="cell.operation.slug === 'execute-python'" :query="cell.forms.code.value"
                        @update="(v) => { if (v !== cell.forms.code.value) { cell.forms.code.value = v; emit('dirty') } }" ref="editorRef"
                        :tables="dataSources" :functions="functions" :data-task="cell.id"
                        :format="{ language: 'spark', tabWidth: 2, keywordCase: 'upper', linesBetweenQueries: 2 }" />
                </div>
                <button v-if="!cell.forms?.opened.value" type="button" class="cell-preview"
                    @click="emit('toggle', cell)" title="Expandir">
                    <span class="cell-preview-code">{{ getPreview(cell) || '(vazio)' }}</span>
                    <font-awesome-icon icon="fa fa-expand" />
                </button>
            </div>
        </div>
        <div v-if="cell?.forms?.save?.value === 1" class="col-12 mt-1">
            <strong>Salvar habilitado. Pseudocódigo a ser executado:</strong>
            <div class="my-1">
                <code class="text-start"
                    style="white-space: pre-wrap">{{ getSaveCommand(cell) }}</code>
            </div>
            Modo de sobrescrita: {{ cell.forms.mode.value }}
        </div>
        <div class="row" v-if="cell.status && cell.status != ''">
            <div class="col-12 cell-status-bar">
                <div v-if="cell.status === 'ERROR'" class="alert alert-danger py-1 px-2 mb-0" role="alert">
                    <font-awesome-icon icon="fa fa-circle-exclamation" /> {{ cell.message }}
                    <span v-if="cell.duration" class="text-muted"> · {{ cell.duration }}</span>
                </div>
                <span v-else>
                    {{ cell.message }}
                    <font-awesome-icon icon="fa" :icon="getCellIcon(cell)"
                        :class="getCellClass(cell)" :spin="cell.status === 'RUNNING'"
                        :title="getCellStatusLabel(cell)" role="img" :aria-label="getCellStatusLabel(cell)" />
                    <span v-if="cell.duration" class="text-muted"> · {{ cell.duration }}</span>
                </span>
            </div>
            <div v-if="cell.userMessages && cell.userMessages != ''" class="col-12">
                <div class=" ms-4 mt-3 notifications px-4 py-2">
                    <div v-for="msg in cell.userMessages" class="mt-2 pt-2 border-top">
                        <div v-if="msg.type.toUpperCase() === 'HTML'">
                            <span v-html="msg.message" />
                        </div>
                        <div v-else>
                            {{ msg.message }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import SqlEditor from './SqlEditor.vue';
import PythonEditor from './PythonEditor.vue';
import SqlEditorToolbar from './SqlEditorToolbar.vue';
import { CELL_TYPE_ICONS, getCellStatusLabel } from './cellStatus.js';

const props = defineProps({
    cell: { type: Object, required: true },
    index: { type: Number, required: true },
    total: { type: Number, required: true },
    dataSources: { type: Array, default: () => [] },
    functions: { type: Array, default: () => [] },
});
const emit = defineEmits(['move', 'remove', 'add', 'execute', 'toggle-use-hwc', 'toggle', 'dirty']);

// the save-as modal edits these fields directly on the cell
watch(() => {
    const f = props.cell.forms;
    return [f.save?.value, f.new_name?.value, f.storage?.value, f.path?.value,
        f.description?.value, f.tags?.value, f.mode?.value];
}, () => emit('dirty'), { deep: true });

const toolbarRef = ref();
const editorRef = ref();
const isSql = computed(() => props.cell.operation.slug === 'execute-sql');
const scriptRef = ref();
const typeIcon = computed(() => CELL_TYPE_ICONS[props.cell.operation.slug]);

const indent = () => {
    if (toolbarRef.value && editorRef.value) {
        toolbarRef.value.showStatus('código formatado');
        editorRef.value.indent();
    }
};
const focus = () => (editorRef.value ?? scriptRef.value)?.focus();

const getPreview = (cell) => {
    const code = cell.forms.query?.value ?? cell.forms.code?.value ?? cell.forms.script?.value ?? '';
    return code.split('\n').map(l => l.trim()).find(l => l) || '';
};
const getCellIcon = (cell) => {
    switch (cell.status) {
        case 'RUNNING':
            return 'fa-sync';
        case 'COMPLETED':
            return 'fa-check-circle';
        case 'ERROR':
            return 'fa-circle-exclamation';
        case 'PENDING':
        case 'WAITING':
            return 'fa-clock';
        default:
            return 'fa-question';
    }
};
const getCellClass = (cell) => {
    switch (cell.status) {
        case 'RUNNING':
            return 'text-primary';
        case 'COMPLETED':
            return 'text-success';
        case 'ERROR':
            return 'text-danger';
    }
};
const indentString = (str, count, indent = " ") =>
    str.replace(/^/gm, indent.repeat(count));
const getSaveCommand = (cell) => {
    const result = [];
    const insert = `INSERT ${cell.forms.mode.value === 'overwrite' ? 'OVERWRITE' : 'INTO'} "${cell.forms.new_name.value}"`;
    const select = `${indentString(cell.forms?.query?.value?.trim(), 4)}`;
    if (cell.forms.mode.value === 'error' || cell.forms.mode.value === 'ignore') {
        result.push(`IF EXISTS TABLE "${cell.forms.new_name.value}"`);
        if (cell.forms.mode.value === 'error') {
            result.push('    ERROR');
        } else {
            result.push('    -- IGNORE');
        }
        result.push('ELSE');
        result.push(`   ${insert}`);
        result.push(`   ${select}`);
    } else {
        result.push(`${insert}`);
        result.push(`   ${select}`);
    }
    return result.join('\n');
};

defineExpose({ indent, focus });
</script>

<style scoped>
.button-toolbar {
    background-color: #fff;
    display: flex;
    justify-content: end;
    padding-bottom: 5px;
}

.editors[data-type="execute-script"] .editor {
    min-height: 0;
}

.cell-header {
    display: flex;
    align-items: flex-end;
    gap: .75rem;
    margin-bottom: .25rem;
}

.cell-header-alias {
    flex: 0 0 25%;
}

.cell-header-comment {
    flex: 1 1 auto;
    min-width: 0;
}

.cell-header-enabled {
    flex: none;
    margin-bottom: .3rem;
    font-size: .9rem;
}

.cell-header-enabled :deep(.form-check) {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin: 0;
    padding-left: 0;
}

.cell-header-enabled :deep(.form-check-input) {
    float: none;
    margin: 0;
}

.cell-header-enabled :deep(.form-check-label) {
    margin: 0;
}

.cell-badge {
    display: inline-flex;
    flex: none;
    font-size: .7rem;
    font-weight: 600;
    letter-spacing: .05em;
}

.cell-badge-num {
    padding: .15rem .5rem;
    background: #e9ecef;
    color: #495057;
    font-variant-numeric: tabular-nums;
}

.cell-disabled-tag {
    flex: none;
    padding: .15rem .5rem;
    border: 1px dashed #6c757d;
    font-size: .7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: #6c757d;
}

.editors.disabled-cell .cell-type-badge {
    text-decoration: line-through;
}

.cell-type-badge {
    padding: .15rem .5rem;
    text-transform: uppercase;
    color: #fff;
    background: var(--cell-color);
}

.cell-preview {
    display: flex;
    align-items: center;
    gap: .5rem;
    width: 100%;
    padding: .4rem .5rem;
    border: 0;
    background: #f8f9fa;
    color: #6c757d;
    text-align: left;
}

.cell-preview-code {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: monospace;
}

.editors {
    background-color: #fff;
    padding: 6px 10px;
    --cell-color: var(--cell-sql);
    border-right: 2px solid var(--cell-color);
    border-left: 4px solid var(--cell-color);
    margin-bottom: 1.5rem;
}

.editors[data-type="execute-python"] { --cell-color: var(--cell-python); }

.editors[data-type="execute-script"] { --cell-color: var(--cell-script); }

.editors.disabled-cell {
    border-left: 4px solid #8a8f98 !important;
    opacity: .8;
}

.editors .editor {
    background: #f8f9fa;
    width: 100%;
    min-height: 200px;
    overflow-x: hidden;
}

.cell-status-bar {
    padding: 4px 0 0 40px;
    line-height: 15px;
    margin-top: 2px;
    min-height: 16px;
    font-size: 9pt;
}

.notifications {
    font-size: .9em;
    background-color: #fafafa;
    width: 100%;
    overflow-x: auto;
}

.editor {
    display: block;
    position: relative;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
}

.form-text {
    font-size: 10pt;
}
</style>
