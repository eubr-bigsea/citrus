<template>
    <b-modal ref="modal" button-size="sm" size="lg" title="Biblioteca de código" @ok="handleSubmit" :okOnly="true">
        <div class="row">
            <div class="col-12">
                <p>Selecione uma ou mais bibliotecas de código para adicionar ao código gerado. Ao adicionar uma biblioteca
                de código, ela estará disponível para todas as células do tipo Python.</p>
                <div class="scrollable-area code-library">
                    <div v-for="opt, i in codeLibraries" class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" :value="opt.id" :id="`sql_code_lib_opt-${i}`"
                            v-model="task.forms.code_libraries.value">
                        <label :for="`sql_code_lib_opt-${i}`" class="custom-control-label">
                            <span>{{ opt.name }}</span>
                            <br /><small>{{ opt.help }}</small>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script setup>
import axios from 'axios';
import { defineExpose, defineProps, onBeforeMount, ref, computed } from 'vue';

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const props = defineProps({
    task: { type: Object, required: true },
    modelValue: { type: Array }
});

const modal = ref({})
const selected = ref(props.modelValue);

const codeLibraries = ref([])
const loadCodeLibraries = async () => {
    const response = await axios.get(`${tahitiUrl}/source-codes`,
        { params: { fields: 'id,name,help' } });
    codeLibraries.value = response.data.data;
}
onBeforeMount(async () => {
    await loadCodeLibraries();
});

const show = () => {
    loadCodeLibraries();
    modal.value.show();
}
const emit = defineEmits(['update:modelValue'])
const handleSubmit = () => {
    emit('update:modelValue', selected.value);
}
defineExpose({ show })
</script>
<style scoped>
    .code-library {
        max-height: 200px;
        overflow-y: auto;
    }
</style>
