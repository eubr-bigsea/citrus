<!-- Pagination.vue -->
<template>
    <nav class="pagination">
        <ul>
            <li @click="gotoPage(1)" :class="{ disabled: currentPage === 1 }">«</li>
            <li @click="prevPage" :class="{ disabled: currentPage === 1 }">‹</li>
            <li v-for="page in displayedPages" :key="page" @click="gotoPage(page)"
                :class="{ active: currentPage === page }">{{
                    page }}</li>
            <li @click="nextPage" :class="{ disabled: currentPage === totalPages }">›</li>
            <li @click="gotoPage(totalPages)" :class="{ disabled: currentPage === totalPages }">»</li>
        </ul>
    </nav>
</template>
  
<script setup>
import { ref, onMounted, computed, } from 'vue';

const emit = defineEmits(['update:currentPage']);
const props = defineProps({
    total: { type: Number, required: true },
    perPage: { type: Number, required: true },
    currentPage: { type: Number },
});

const totalPages = computed(() => Math.ceil(props.total / props.perPage));

const displayRange = 10;
const halfRange = displayRange / 2;
const startPage = computed(() => Math.max(1, props.currentPage - halfRange));
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
        emit('update:currentPage', page);
    }
};

const prevPage = () => {
    gotoPage(props.currentPage - 1);
};

const nextPage = () => {
    gotoPage(props.currentPage + 1);
};

// Ensure the current page is valid on component mount
onMounted(() => {
    if (props.currentPage < 1) {
        props.currentPage = 1;
    } else if (props.currentPage > totalPages.value) {
        props.currentPage = totalPages.value;
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
  