<template>
    <h2>
        <input :title="$t('actions.rename')" :value="value" :size="titleSize == 0 ? 100 : ttleSize" :maxlength="maxlength"
            @input="$emit('input', $event.target.value)">
    </h2>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    title: { type: String, default: '' },
    maxlength: { type: Number, default: 100 },
    size: { type: Number, default: 100 },
    value: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue', 'input']);
const titleSize = computed(() => {
    return (props.value || '').length;
})
/*
export default {
    name: 'InputHeader',
    props: {
        value: {type: String, default: null},
        maxlength: {type: Number}
    },
    emits: ['input'],
    computed: {
        titleSize() {
            return (this.value || '').length;
        }
    }
};
*/
</script>

<style scoped>
.input-header>>>h2 {
    display: inline
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
