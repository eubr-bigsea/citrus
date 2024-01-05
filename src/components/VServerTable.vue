<!-- VServerTable.vue -->
<template>
    <div class="v-server-table-area">
        <slot name="filters">
            <div class="filters">
                <div class="col-md-12">
                    <div class="form-group float-left">
                        <div class="">
                            <label for="filter font-weight-bold">Filtro</label>
                            <input type="text" placeholder="Busca" name="filter" autocomplete="off" class="form-control"
                                maxlength="50" @input="search($event)" />
                        </div>
                    </div>
                    <div class="form-group form-inline float-right VueTables__limit">
                        <div class=""><label for="limit">Limite</label>
                            <select name="limit" class="form-control form-control-sm" v-model="perPage">
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </slot>
        <b-skeleton-table v-if="loading" :rows="10" :columns="columns.length" :table-props="{ bordered: true, striped: true }"></b-skeleton-table>

        <table v-if="!loading" :class="options.skin" class="server-table" ref="table">
            <thead>
                <tr>
                    <th v-for="(heading, index) in columns" :key="index" class="header"
                        :class="{ [options.sortIcon.is]: sortableColumns.includes(heading), 'can-be-sorted': sortableColumns.includes(heading) }"
                        @click="handleSort(heading, $event)">
                        {{ getTableHeader(heading) }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
                    <td v-for="colName in columns" :key="colName" :class="getColumnClass(columnClasses, colName)">
                        <slot :name="colName" :row="row">
                            <span :class="`${getColumnClass(columnClasses, colName)}-scoped`">
                                {{ row[colName] }}
                            </span>
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
        <slot name="pagination">
            <div v-if="paginationEnabled" class="pagination-text text-center">
                <b-pagination v-model="currentPage" :total-rows="tableCount" :per-page="perPage" align="center"
                    aria-controls="my-table"></b-pagination>
                <p class="pagination-message">
                    {{ pagerMessage }}
                </p>
            </div>
        </slot>
        <div class="text-center preview-loading" v-if="loading" style="background: transparent">
            <b-spinner variant="primary" label="Text Centered"></b-spinner>
        </div>
    </div>
</template>
  
<script setup>
import { debounce } from '@/util.js';

import { ref, onMounted, computed, defineProps, watch } from 'vue';
const props = defineProps({
    options: { type: Object, required: true },
    columns: { type: Array, required: true },
    sortColumn: { type: Object, required: false, default: () => { } },
    sortDirection: { type: Object, required: false, default: () => { } },
    sortIcon: { type: Object, required: false, default: () => { } },

    skin: { type: Object, required: false, default: () => { } },
    columnClasses: { type: Object, required: false, default: () => { } },
    saveState: { type: Object, required: false, default: () => { } },
});

const getTableHeader = (col) => props.options.headings[col] || col;

const loading = ref(false);
const paginationEnabled = computed(() => {
    return true;
});
const tableHeadings = ref([]);
const tableData = ref([]);
const tableCount = ref(0);
const currentPage = ref(1);
const perPage = ref(10);
const sortableColumns = ref(props.options.sortable || []);
const sortDirection = ref('asc');
const sortColumn = ref(props.columns[0]);
const table = ref();

const query = ref();
const setQuery = (value) => { query.value = value };
const search = debounce((ev) => {
    query.value = ev.target.value;
    populateTable();
}, 500);

const pagerMessage = computed(() => {
    const parts = (
        props.options.texts.count || "Showing {from} to {to}, of {count} records{|}{count} records{|}One record")
        .split(/\|/);

    if (tableCount.value === 0) {
        return props.options.texts.noResults || 'No records found';
    } else if (tableCount.value === 1) {
        return parts[2];
    } else if (perPage.value < tableCount.value) {
        return parts[0].replace("{from}", (currentPage.value - 1) * perPage.value + 1)
            .replace("{to}", Math.min((currentPage.value) * perPage.value, tableCount.value))
            .replace("{count}", tableCount.value);
    } else {
        return parts[1].replace("{count}", tableCount.value);
    }
});
const populateTable = async () => {
    if (typeof props.options.requestFunction === 'function') {
        const defaultOptions = {
            orderBy: sortColumn.value,
            ascending: (sortDirection.value === 'asc') ? 1 : 0,
            limit: perPage.value,
            query: query.value,
            fields: null,
            page: currentPage.value,
        };
        loading.value = true;
        const { data, count } = await props.options.requestFunction(defaultOptions);
        loading.value = false;

        tableData.value = data || [];
        tableCount.value = count;
    } else {
        console.error('Invalid requestFunction specified in options');
    }
};

const getColumnClass = (columnClasses, columnName) => {
    return ''
    return columnClasses[columnName] || '';
};

const handleSort = (column, event) => {
    if (sortableColumns.value.includes(column)) {
        if (sortColumn.value !== column) {
            sortColumn.value = column;
            table.value.querySelectorAll('th.can-be-sorted').forEach((el) => {
                el.classList.remove('sort-up', 'sort-down');
                el.classList.add('sort-is');
            })
        } else {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
        }
        if (sortDirection.value === 'desc') {
            event.currentTarget.classList.add('sort-up');
            event.currentTarget.classList.remove('sort-down');
        } else {
            event.currentTarget.classList.add('sort-down');
            event.currentTarget.classList.remove('sort-up');
        }
        event.currentTarget.classList.remove('sort-is');
        populateTable();
    }
};
onMounted(() => {
    populateTable();
});


watch(currentPage, populateTable);
watch(perPage, populateTable);

defineExpose({
    setQuery
});
</script>
  
<style scoped>
.server-table td,
.server-table th {
    padding: 8px 5px;
    font-size: .9em;
}

/* Add your component-specific styles here */
.sortable {
    cursor: pointer;
}

.sort-icon {
    margin-left: 5px;
}

/* Add scoped styles for each column */
/*[tableHeadings[colIndex]]-scoped {
  }*/

.pagination {
    margin-top: 10px;
    /* Add styles for pagination container */
}

.pagination-text {
    font-size: .9em;
}

.filters {
    background-color: #fafafa;
    padding: 5px;
    display: flex;
    border-top: 1px solid #eee;
}

.filters>>>label {
    font-weight: bold;
}
</style>
  