<!-- Modal.vue -->

<template>
    <div class="modal show" tabindex="-1" ref="modal" id="modal" role="dialog">
        <div class="modal-dialog" :class="modalClass">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }} {{ modalClass }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot />
                </div>
                <div class="modal-footer">
                    <slot name="footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>
                        <button type="button" class="btn btn-primary">{{ cancelTitle || 'Cancel' }}</button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { Modal } from 'bootstrap';
import { reactive, onMounted, computed } from 'vue'
import { ref, defineProps, defineExpose } from 'vue';

const state = reactive({
    modal: null,
})
// Props
const props = defineProps(['title', 'size', 'hideHeader', 'cancelTitle',]);

const modal = ref();

onMounted(() => {
    state.modal = new Modal(modal.value, { backdrop: true })
})

const modalClass = computed(() => {
    if (props.size !== '') {
        return `modal-${props.size}`;
    }
    return '';
});
const show = () => {
    state.modal.show();
};
const hide = () => {
    state.modal.hide();
};
defineExpose({ show, hide });
</script>
  
<style scoped>
.modal {
    z-index: 1000001;
}
</style>
  