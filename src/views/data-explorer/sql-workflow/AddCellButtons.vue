<template>
    <div class="add-cell-buttons">
        <div v-for="opt in options" :key="opt.type" class="add-cell-option">
            <button type="button" class="btn btn-sm add-cell-btn" :data-type="opt.type" @click="emit('add', opt.type)">
                <font-awesome-icon icon="fa fa-plus" /> {{ opt.label }}
            </button>
            <small v-if="captions" class="text-muted">{{ opt.caption }}</small>
        </div>
    </div>
</template>

<script setup>
defineProps({
    captions: { type: Boolean, default: false },
});
const emit = defineEmits(['add']);

const options = [
    { type: 'sql', label: 'SQL', caption: 'Consulta Spark SQL' },
    { type: 'python', label: 'Python', caption: 'Código PySpark' },
    { type: 'script', label: 'Script externo', caption: 'Arquivo no servidor' },
];
</script>

<style scoped>
.add-cell-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: .75rem;
}

.add-cell-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .25rem;
}

/* same colors as the cell borders (SqlCell.vue) */
.add-cell-btn {
    --c: var(--primary-color);
    --c-text: var(--primary-color);
    --c-hover-text: #fff;
    border: 1px solid var(--c);
    background: transparent;
    color: var(--c-text);
}

.add-cell-btn[data-type="python"] {
    --c: #e0b92e;
    --c-text: #8a6d0b;
    --c-hover-text: #212529;
}

.add-cell-btn[data-type="script"] {
    --c: #d9822b;
    --c-text: #b4631a;
}

.add-cell-btn:hover,
.add-cell-btn:focus-visible {
    background: var(--c);
    color: var(--c-hover-text);
}
</style>
