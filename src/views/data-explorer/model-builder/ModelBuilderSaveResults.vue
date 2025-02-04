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
            <b-form-checkbox v-model.number="formData.save_data" value="1" unchecked-value="0" @input="doEmit('save_data', $event)">
                Aplicar e salvar os dados resultantes
            </b-form-checkbox>
            <div v-if="formData.save_data == 1" class="row">
                <div class="col-12">
                    <label>Nome da nova fonte de dados:</label>
                    <input v-model="formData.data_name" @input="doEmit('data_name', $event)" type="text"
                        class="form-control form-control-sm" maxlength="100" />
                </div>
                <div class="col-12 mt-2">
                    <label>Armazenamento:</label>
                    <select class="form-control form-control-sm" name="storage" v-model.number="formData.data_storage"
                        @change="doEmit('data_storage', $event)">
                        <option></option>
                        <option v-for="st in storages" :key="st.id" :value="st.id">
                            {{ st.name }} ({{ st.type }})
                        </option>
                    </select>
                </div>
                <div class="col-12 mt-2">
                    <label>Caminho / pasta (opcional):</label>
                    <input v-model="formData.data_path" @input="doEmit('data_path', $event)" type="text"
                        class="form-control form-control-sm" maxlength="100">
                </div>
                <div class="col-12 mt-2">
                    <label>Opção de sobrescrita (se existir):</label>
                    <select class="form-control form-control-sm" name="mode" v-model.number="formData.data_overwrite"
                        @change="doEmit('data_overwrite', $event)">
                        <option value="error">Gerar erro (não salvar)</option>
                        <option value="ignore">Ignorar (não salvar)</option>
                        <option value="append">Acrescentar (append)</option>
                        <option value="overwrite">Sobrescrever (overwrite)</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col-6">
            <b-form-checkbox v-model.number="formData.save_model" @input="doEmit('save_model', $event)" value="1"
                unchecked-value="0">
                Salvar o melhor modelo
            </b-form-checkbox>
            <div v-if="formData.save_model == 1" class="row">
                <div class="col-12">
                    <label>Nome do modelo:</label>
                    <input v-model="formData.model_name" @input="doEmit('model_name', $event)" type="text"
                        class="form-control form-control-sm" maxlength="100">
                </div>
                <div class="col-12 mt-2">
                    <label>Armazenamento:</label>
                    <select class="form-control form-control-sm" name="storage" v-model.number="formData.model_storage"
                        @change="doEmit('model_storage', $event)">
                        <option></option>
                        <option v-for="st in storages" :key="st.id" :value="st.id">
                            {{ st.name }} ({{ st.type }})
                        </option>
                    </select>
                </div>
                <div class="col-12 mt-2">
                    <label>Caminho / pasta (opcional):</label>
                    <input v-model="formData.model_path" @input="doEmit('model_path', $event)" type="text"
                        class="form-control form-control-sm" maxlength="100">
                </div>
                <div class="col-12 mt-2">
                    <label>Opção de sobrescrita (se existir):</label>
                    <select class="form-control form-control-sm" name="mode" v-model.number="formData.model_overwrite"
                        @change="doEmit('model_overwrite', $event)">
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
    save_data: props.form.save_data?.value,
    save_model: props.form.save_model?.value,
    data_name: props.form.data_name?.value,
    model_name: props.form.model_name?.value,
    data_storage: props.form.data_storage?.value,
    model_storage: props.form.model_storage?.value,
    data_path: props.form.data_path?.value,
    model_path: props.form.model_path?.value,
    data_overwrite: props.form.data_overwrite?.value || 'overwrite',
    model_overwrite: props.form.model_overwrite?.value  || 'overwrite',
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