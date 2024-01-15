<!-- Pagination.vue -->
<template>
    <nav class="pagination">
        <ul>
            <li :class="{ disabled: currentPage === 1 }" @click="gotoPage(1)">
                «
            </li>
            <li :class="{ disabled: currentPage === 1 }" @click="prevPage">
                ‹
            </li>
            <li v-for="pageNumber in displayedPages" :key="pageNumber" :class="{ active: currentPage === pageNumber }"
                @click="gotoPage(pageNumber)">
                {{pageNumber}}
            </li>
            <li :class="{ disabled: currentPage === totalPages }" @click="nextPage">
                ›
            </li>
            <li :class="{ disabled: currentPage === totalPages }" @click="gotoPage(totalPages)">
                »
            </li>
        </ul>
    </nav>
</template>
  
<script setup>
import { ref, onMounted, computed, } from 'vue';

const emit = defineEmits(['update:page']);
const props = defineProps({
    total: { type: Number, required: true },
    perPage: { type: Number, required: true },
    page: { type: Number, required: true },
});

const currentPage = ref(props.page);

const totalPages = computed(() => Math.ceil(props.total / props.perPage));

const displayRange = 10;
const halfRange = displayRange / 2;
const startPage = computed(() => Math.max(1, currentPage.value - halfRange));
const endPage = computed(() => Math.min(totalPages.value, startPage.value + displayRange - 1));
const displayedPages = computed(() => {
    const pages = [];
    for (let i = startPage.value; i <= endPage.value; i++) {
        pages.push(i);
    }
    return pages;
});


const gotoPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        //props.value = page;
        currentPage.value = page;
        emit('update:page', page);
    }
};

const prevPage = () => {
    gotoPage(currentPage.value - 1);
};

const nextPage = () => {
    gotoPage(currentPage.value + 1);
};

// Ensure the current page is valid on component mount
onMounted(() => {
    if (currentPage.value < 1) {
        currentPage.value = 1;
    } else if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;
    }
});
</script>
  
<style scoped>
.pagination {
    margin-top: 10px;
    justify-content: center !important;
}

ul {
    list-style: none;
    display: flex;
    padding-left: 0;
}

li {
    cursor: pointer;
    margin-right: 0px;
    padding: 8px 12px;
    user-select: none;
    position: relative;
    display: block;
    padding: 0.5rem 0.75rem;
    margin-left: -1px;
    line-height: 1.25;
    color: #007bff;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 2px;
}

li.active {
    background-color: #007bff;
    color: white;
}

li.disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>
  