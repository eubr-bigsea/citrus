<template>
    <h2>
        <input :title="$t('actions.rename')" :value="modelValue" :size="titleSize == 0 ? 100 : titleSize" :maxlength="maxlength"
            @input="emit('update:modelValue', $event.target.value); emit('input', $event.target.value)">
    </h2>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    maxlength: { type: Number, default: 100 },
    size: { type: Number, default: 100 },
})

const emit = defineEmits(['update:modelValue', 'input']);
const titleSize = computed(() => {
    return (props.modelValue || '').length;
})
</script>

<style scoped>
.input-header :deep(h2) {
  display: inline;
}

input:placeholder-shown {
    font-style: italic;
}

input {
    background-color: transparent;
    border: 1px solid transparent;
    font-size: 30px;
    font-weight: 300;
    display: inline-block;
    width: 90%;
}

input:hover {
    border-color: #CCC;
}
</style>
