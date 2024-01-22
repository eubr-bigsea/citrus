<template>
    <button class="btn dropdown-toggle" :class="buttonClass" @click.stop="toggleDropdown"
        :aria-expanded="isDropdownOpen.toString()" ref="button" v-bind="$attrs">
        <slot name="button-content">
            {{ text }}
        </slot>
    </button>
    <ul class="dropdown-menu" role="menu" ref="content" :class="{ show: isDropdownOpen }">
        <slot name="content">
        </slot>
    </ul>
</template>  
<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { createPopper } from '@popperjs/core';

let popperInstance = null;

const button = ref();
const props = defineProps({
    variant: { type: String, required: false, default: 'secondary' },
    text: { type: String, required: false, default: 'Dropdown' },
    size: { type: String, required: true, default: '' },
    noCaret: { type: Boolean, required: false, default: false },
    keepOpen: { type: Boolean, required: false, default: false }
});
const isDropdownOpen = ref(false);

const buttonClass = computed(() => {
    let result = (props.variant) ? `btn-${props.variant}` : '';
    result += (props.size) ? ` btn-${props.size}` : '';
    result += (props.noCaret) ? ' dropdown-toggle-no-caret' : '';
    return result
});

const content = ref();
const toggleDropdown = () => {

    isDropdownOpen.value = !isDropdownOpen.value;
    if (isDropdownOpen.value) {
        document.body.addEventListener('click', closeDropdown);
        popperInstance = createPopper(button.value, content.value, {
            placement: 'bottom-start',
        });
    } else {
        document.body.removeEventListener('click', closeDropdown);
    }
};
const closeDropdown = (evt) => {
    
    const toClose = !props.keepOpen || content.value !== evt.target.closest('.dropdown-menu');
    if (toClose) {
        isDropdownOpen.value = false;
        document.body.removeEventListener('click', closeDropdown);
        if (popperInstance) {
            popperInstance.destroy();
            popperInstance = null;
        }
    }
};

onBeforeUnmount(() => {
    document.body.removeEventListener('click', closeDropdown);
});
</script>
  
<style scoped></style>
  