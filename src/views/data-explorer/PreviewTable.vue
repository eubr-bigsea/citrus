<template>
    <table :class="tableClass" role="table" @click.prevent="handleRowClick" @contextmenu.prevent="handleContext">
        <thead>
            <tr>
                <th v-for="header in headers" :key="header">
                    <slot name="head" :field="header">
                        <div>{{header}}</div>
                    </slot>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row, inx in rows" :key="inx" @click.prevent="handleRowClick">
                <td v-for="header in headers" :key="header">
                    <slot name="cell" :row="row" :field="header" :index="inx">
                        {{row[header.name]}}
                    </slot>
                </td>
            </tr>
        </tbody>
    </table>
</template>
  
<script setup>
import { ref, computed, defineProps } from 'vue';
const emits = defineEmits(['row-clicked', 'row-contextmenu']);
const props = defineProps({
    'headers': { type: Array, required: true },
    'rows': { type: Array, required: true },
    'stickHeader': { type: Boolean, required: true },
    'tableClass': { type: String, required: true }
});

const tableStyle = computed(() => ({
    overflowY: props.stickHeader ? 'auto' : 'initial',
}));
const handleRowClick = (event) => {
    const tr = event.target.closest('tr');
    const inx = tr.rowIndex;

    emits('row-clicked', props.rows[inx], inx, event);
};
const handleContext = (event) => {
    const tr = event.target.closest('tr');
    const inx = tr.rowIndex;
    emits('row-contextmenu', props.rows[inx], inx, event);
};
</script>
  
<style>
.preview-table-container {
    position: relative;
}

.preview-table-container table {
    width: 100%;
    border-collapse: collapse;
}

.preview-table-container th,
.preview-table-container td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.preview-table-container th {
    background-color: #f2f2f2;
}

/* Add sticky header styles */
.preview-table-container .sticky-header {
    position: sticky;
    top: 0;
    background-color: #f2f2f2;
}

div.table-preview {
    color: #222;
    position: relative;
    max-width: calc(95vw - 301px)
}

.table-preview td {
    white-space: pre
}

.table-preview {
    font-size: 10pt;
}

.table-preview td.invalid-data {
    background-color: #fee
}

.table-preview td.missing-data {
    background-color: #fffdeb
}

.table-preview td:hover {
    background-color: #666;
    color: #fff
}
</style>
  