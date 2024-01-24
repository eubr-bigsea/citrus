<template>
    <div class="input-header mb-2">
        <font-awesome-icon icon="fa fa-edit" class="text-primary" />
        <h2>
            <input :title="$t('actions.rename')" :value="props.modelValue" maxlength="50"
                   placeholder="Informe o nome"
                   @input="emit('update:modelValue', $event.target.value)">
        </h2>
    </div>
</template>

<script setup>
const props = defineProps({modelValue: {type: String, default: ''}});
const emit = defineEmits(['update:modelValue']);
/*
export default {
    name: 'InputHeader',
    props: {
        value: {type: String, default: null}
    },
    data(){
        return {
            internalValue: this.value,
        }
    },
    emits: ['update:modelValue'],
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
