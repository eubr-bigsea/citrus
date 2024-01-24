<template>
    <div class="confirm-overlay">
        <div class="confirm-modal p-4">
            <h6 class="border-bottom mb-3">
                {{title}}
            </h6>
            <p class="p-2">
                {{question}}
            </p>

            <div class="text-center border-top pt-2 btn-flex">
                <b-button size="sm" :class="yesButton?.cssClass" @click="emit('confirm')">
                    {{$t('common.yes')}}
                </b-button>
                <b-button size="sm" class="noButton.cssClass" @click="emit('cancel')">
                    {{$t('common.no')}}
                </b-button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(
    {
        question: { type: String, required: true },
        title: { type: String, required: false, default: '' },
        yesButton: {type: Object, required: false, default: () => ({'cssClass': 'btn-danger'})},
        noButton: {type: Object, required: false, default: () => ({'cssClass': 'btn-secondary'})},
    }
);
const emit = defineEmits(['confirm', 'cancel']);
</script>
<style scoped>
.confirm-overlay {
    position: fixed;
    z-index: 100000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px
}

.btn-flex button {
    flex: auto;
}

.confirm-modal {
    background: white;
    z-index: 100001;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}</style>