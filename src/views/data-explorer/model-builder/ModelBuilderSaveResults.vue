<template>
    <div class="row">
        <div class="col-12 mb-2">
            <h5>Salvar resultados</h5>
            <hr />
            <p>
                Você poderá salvar os dados resultados da aplicação do melhor modelo.
                Também poderá salvar o melhor modelo. Todos os outros modelos são descartados.
                <br />
                Observe a opção de sobrescrita, pois dependendo da escolha, a operação
                de salvamento poderá falhar!
            </p>
        </div>
        <div class="col-6">
            <b-form-checkbox v-model.number="formData.saveData" value="1" unchecked-value="0" @input="doEmit('saveData', $event)">
                Aplicar e salvar os dados resultantes
            </b-form-checkbox>
            <div v-if="formData.saveData == 1" class="row">
                <div class="col-12">
                    <label>Nome da nova fonte de dados:</label>
                    <input v-model="formData.dataName" @input="doEmit('dataName', $event)" type="text"
                        class="form-control form-control-sm" maxlength="100" />
                </div>
                <div class="col-12 mt-2">
                    <label>Armazenamento:</label>
                    <select class="form-control form-control-sm" name="storage" v-model.number="formData.dataStorage"
                        @change="doEmit('dataStorage', $event)">
                        <option></option>
                        <option v-for="st in storages" :key="st.id" :value="st.id">
                            {{ st.name }} ({{ st.type }})
                        </option>
                    </select>
                </div>
                <div class="col-12 mt-2">
                    <label>Caminho / pasta (opcional):</label>
                    <input v-model="formData.dataPath" @input="doEmit('dataPath', $event)" type="text"
                        class="form-control form-control-sm" maxlength="100">
                </div>
                <div class="col-12 mt-2">
                    <label>Opção de sobrescrita (se existir):</label>
                    <select class="form-control form-control-sm" name="mode" v-model.number="formData.dataOverwrite"
                        @change="doEmit('dataOverwrite', $event)">
                        <option value="error">Gerar erro (não salvar)</option>
                        <option value="ignore">Ignorar (não salvar)</option>
                        <option value="append">Acrescentar (append)</option>
                        <option value="overwrite">Sobrescrever (overwrite)</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col-6">
            <b-form-checkbox v-model.number="formData.saveModel" @input="doEmit('saveModel', $event)" value="1"
                unchecked-value="0">
                Salvar o melhor modelo
            </b-form-checkbox>
            <div v-if="formData.saveModel == 1" class="row">
                <div class="col-12">
                    <label>Nome do modelo:</label>
                    <input v-model="formData.modelName" @input="doEmit('modelName', $event)" type="text"
                        class="form-control form-control-sm" maxlength="100">
                </div>
                <div class="col-12 mt-2">
                    <label>Armazenamento:</label>
                    <select class="form-control form-control-sm" name="storage" v-model.number="formData.modelStorage"
                        @change="doEmit('modelStorage', $event)">
                        <option></option>
                        <option v-for="st in storages" :key="st.id" :value="st.id">
                            {{ st.name }} ({{ st.type }})
                        </option>
                    </select>
                </div>
                <div class="col-12 mt-2">
                    <label>Caminho / pasta (opcional):</label>
                    <input v-model="formData.modelPath" @input="doEmit('modelPath', $event)" type="text"
                        class="form-control form-control-sm" maxlength="100">
                </div>
                <div class="col-12 mt-2">
                    <label>Opção de sobrescrita (se existir):</label>
                    <select class="form-control form-control-sm" name="mode" v-model.number="formData.modelOverwrite"
                        @change="doEmit('modelOverwrite', $event)">
                        <option value="error">Gerar erro (não salvar)</option>
                        <option value="ignore">Ignorar (não salvar)</option>
                        <option value="append">Acrescentar (append)</option>
                        <option value="overwrite">Sobrescrever (overwrite)</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { defineProps, onBeforeMount, ref, watch } from 'vue';

const modal = ref({})

const props = defineProps({
    form: { type: Object, required: true }
});
const formData = ref({
    saveData: props.form.saveData?.value,
    saveModel: props.form.saveModel?.value,
    dataName: props.form.dataName?.value,
    modelName: props.form.modelName?.value,
    dataStorage: props.form.dataStorage?.value,
    modelStorage: props.form.modelStorage?.value,
    dataPath: props.form.dataPath?.value,
    modelPath: props.form.modelPath?.value,
    dataOverwrite: props.form.dataOverwrite?.value || 'overwrite',
    modelOverwrite: props.form.modelOverwrite?.value  || 'overwrite',
});

const storages = ref([]);
const loadStorages = async () => {
    const fields = "&fields=id,name,type"
    const response = await axios.get(
        `${import.meta.env.VITE_LIMONERO_URL}/storages?size=100${fields}`);
    storages.value = response.data.data;
}
onBeforeMount(async () => {
    await loadStorages();
});

const emit = defineEmits([
    'update'
]);
const doEmit = (action) => {
    //emit(`update:${action}`, value)
    emit('update', action, formData.value[action]);
};
</script>