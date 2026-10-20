<template>
    <div v-if="cells.length > 1" class="cell-map" role="group" aria-label="Mapa de células">
        <button v-for="(cell, i) in cells" :key="cell.id" type="button" class="cell-map-item"
            :class="[`status-${(cell.status || 'none').toLowerCase()}`, { 'is-disabled': !cell.enabled, 'is-active': cell.id === activeId }]"
            :data-type="cell.operation.slug"
            :title="label(cell, i)" :aria-label="label(cell, i)" :aria-current="cell.id === activeId ? 'true' : undefined"
            @click="emit('select', cell.id)">
            <font-awesome-icon :icon="CELL_TYPE_ICONS[cell.operation.slug]" />
        </button>
    </div>
</template>

<script setup>
import { CELL_TYPE_ICONS, getCellStatusLabel } from './cellStatus.js';

defineProps({
    cells: { type: Array, default: () => [] },
    activeId: { type: String, default: null },
});
const emit = defineEmits(['select']);

const label = (cell, i) => `${i + 1} · ${cell.operation.slug.substring(8).toUpperCase()} · ${getCellStatusLabel(cell)}`;
</script>

<style scoped>
.cell-map {
    flex: none;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    max-height: 4.5rem;
    overflow-y: auto;
    padding: 5px; /* room for the active outline and the status dot, which overflow is clipped otherwise */
}

.cell-map-item {
    --type: var(--cell-sql);
    --status: transparent;
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

/* status dot, bottom-right corner */
.cell-map-item::after {
    content: '';
    position: absolute;
    right: -4px;
    bottom: -4px;
    width: 9px;
    height: 9px;
    border: 1px solid #fff;
    border-radius: 50%;
    background: var(--status);
}

.cell-map-item.status-running { --status: #0759a5; }
.cell-map-item.status-completed { --status: #176b36; }
.cell-map-item.status-error { --status: #a4262c; }
.cell-map-item.status-pending,
.cell-map-item.status-waiting { --status: #d39e00; }
.cell-map-item.status-none::after { display: none; }

.cell-map-item.is-active,
.cell-map-item:focus-visible {
    outline: 2px solid #495057;
    outline-offset: 2px;
}
</style>
