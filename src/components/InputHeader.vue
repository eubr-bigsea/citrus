<template>
    <h2 class="input-header">
        <input ref="inputRef" :title="$t('actions.rename')" :value="modelValue" :size="inputSize"
            :maxlength="maxlength" :placeholder="placeholderText" :aria-label="$t('actions.rename')"
            @input="emit('update:modelValue', $event.target.value); emit('input', $event.target.value)">
        <font-awesome-icon icon="fa fa-pen" class="edit-icon" :title="$t('actions.rename')" @click="inputRef.focus()" />
    </h2>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    modelValue: { type: String, default: '' },
    maxlength: { type: Number, default: 100 },
    size: { type: Number, default: 100 },
    placeholder: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'input']);
const inputRef = ref();
const { t } = useI18n();
const placeholderText = computed(() => props.placeholder || t('common.name'));
const inputSize = computed(() => Math.max((props.modelValue || '').length, placeholderText.value.length, 1));
</script>

<style scoped>
.input-header {
    max-width: 100%;
    display: flex;
    align-items: center;
    gap: .5rem;
}

input:placeholder-shown {
    font-style: italic;
}

input {
    background-color: transparent;
    border: 1px solid transparent;
    border-bottom: 1px dashed #bbb;
    font-size: 30px;
    font-weight: 300;
    min-width: 0;
    max-width: calc(100% - 2rem);
    cursor: text;
}

input:hover {
    border-color: #CCC;
    border-bottom-style: solid;
}

input:focus {
    outline: none;
    border-color: var(--primary-color, #568f32);
    background-color: #fff;
}

.edit-icon {
    font-size: 16px;
    color: #999;
    cursor: pointer;
    flex: none;
}

.input-header:hover .edit-icon,
.input-header:focus-within .edit-icon {
    color: var(--primary-color, #568f32);
}
</style>
