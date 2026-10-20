<template>
    <div v-if="cells.length > 1" ref="root" class="cell-map" role="group" aria-label="Mapa de células">
        <button v-for="(cell, i) in cells" :key="cell.id" type="button" class="cell-map-item"
            :class="{
                'is-disabled': !cell.enabled, 'is-active': cell.id === activeId, 'is-dragging': cell.id === dragId,
                'drop-before': dropIndex === i && dropSide === 'before', 'drop-after': dropIndex === i && dropSide === 'after',
            }"
            :data-type="cell.operation.slug" :data-id="cell.id" draggable="true"
            :title="label(cell, i)" :aria-label="label(cell, i)" :aria-current="cell.id === activeId ? 'true' : undefined"
            @click="emit('select', cell.id)"
            @dragstart="onDragStart($event, cell)" @dragover.prevent="onDragOver($event, i)"
            @dragleave="dropIndex = null" @drop.prevent="onDrop(i)" @dragend="reset"
            @keydown.alt.left.prevent="moveBy(i, -1)" @keydown.alt.right.prevent="moveBy(i, 1)">
            <font-awesome-icon :icon="CELL_TYPE_ICONS[cell.operation.slug]" />
        </button>
    </div>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { CELL_TYPE_ICONS } from './cellStatus.js';

const props = defineProps({
    cells: { type: Array, default: () => [] },
    activeId: { type: String, default: null },
});
// move: the cell goes to position toIndex among the cells
const emit = defineEmits(['select', 'move']);

const root = ref();
const dragId = ref(null);
const dropIndex = ref(null);
const dropSide = ref('before');

// the comment identifies the cell in the tooltip; the name is the fallback when there is none
const text = (cell) => (cell.forms.comment?.value || '').trim() || cell.name || '';
const label = (cell, i) => `${i + 1} · ${cell.operation.slug.substring(8).toUpperCase()} · ${text(cell)}`;

const reset = () => {
    dragId.value = null;
    dropIndex.value = null;
};
const onDragStart = (e, cell) => {
    dragId.value = cell.id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cell.id);
};
const onDragOver = (e, i) => {
    if (!dragId.value) return;
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    dropIndex.value = i;
    dropSide.value = e.clientX < rect.left + rect.width / 2 ? 'before' : 'after';
};
const onDrop = (i) => {
    const from = props.cells.findIndex(c => c.id === dragId.value);
    const position = dropSide.value === 'before' ? i : i + 1;
    const to = position > from ? position - 1 : position;
    if (from > -1 && to !== from) emit('move', dragId.value, to);
    reset();
};
const moveBy = (i, step) => {
    const to = i + step;
    if (to < 0 || to >= props.cells.length) return;
    const id = props.cells[i].id;
    emit('move', id, to);
    // moving the node can drop the focus
    nextTick(() => root.value?.querySelector(`[data-id="${id}"]`)?.focus());
};
</script>

<style scoped>
.cell-map {
    flex: 0 1 auto;
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    max-height: 4.5rem;
    overflow-y: auto;
    padding: 5px; /* room for the active outline and the drop line, which overflow would clip */
}

.cell-map-item {
    --type: var(--cell-sql);
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    background: var(--type);
    color: #fff;
    font-size: .7rem;
}

.cell-map-item[data-type="execute-python"] { --type: var(--cell-python); }
.cell-map-item[data-type="execute-script"] { --type: var(--cell-script); }
.cell-map-item.is-disabled { --type: #8a8f98; }

.cell-map-item.is-dragging {
    opacity: .4;
}

.cell-map-item.drop-before::before,
.cell-map-item.drop-after::before {
    content: '';
    position: absolute;
    top: -3px;
    bottom: -3px;
    width: 3px;
    background: #212529;
}

.cell-map-item.drop-before::before { left: -5px; }
.cell-map-item.drop-after::before { right: -5px; }

.cell-map-item.is-active,
.cell-map-item:focus-visible {
    outline: 2px solid #495057;
    outline-offset: 2px;
}
</style>
