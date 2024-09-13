<template>
    <b-modal ref="modal" button-size="sm" size="lg" :title="$t('actions.save')"
             :ok-disabled="!valid" @ok="handleSubmit">
        <div class="row">
            <div class="col-6">
                <b-form-checkbox v-model="task.forms.save.value" value="1" unchecked-value="0"
                                 @input="doEmit('save', $event)">
                    Salvar dados
                </b-form-checkbox>
                <div v-if="task.forms.save.value == 1" class="row">
                    <div class="col-12">
                        <label>Nome da nova fonte de dados:</label>
                        <input v-model="task.forms.new_name.value" type="text" class="form-control form-control-sm"
                               maxlength="100">
                    </div>
                    <div class="col-12 mt-2">
                        <label>Armazenamento:</label>
                        <select v-model.number="task.forms.storage.value" class="form-control form-control-sm"
                                name="storage">
                            <option />
                            <option v-for="st in storages" :key="st.id" :value="st.id">
                                {{st.name}} ({{st.type}})
                            </option>
                        </select>
                    </div>
                    <div class="col-12 mt-2">
                        <label>Caminho / pasta (opcional):</label>
                        <input v-model="task.forms.path.value" type="text" class="form-control form-control-sm"
                               maxlength="100">
                    </div>
                </div>
            </div>
            <div v-if="task.forms.save.value == 1" class="col-6">
                <!--
                    <div class="col-12 mt-2">
                        <label>Descrição (opcional):</label>
                        <textarea v-model="task.forms.description.value" class="form-control form-control-sm"></textarea>
                    </div>
                    <div class="col-12 mt-2">
                        <label>Tags (opcional):</label>
                        <b-form-tags input-id="tags-basic" v-model="task.forms.tags.value" :add-button-text="$t('actions.add')"
                        duplicate-tag-text="tag já existe" placeholder=""></b-form-tags>
                    </div>
                -->
                <div class="col-12 mt-2">
                    <label>Opção de sobrescrita (se existir):</label>
                    <select v-model.number="task.forms.mode.value" class="form-control form-control-sm"
                            name="mode">
                        <option value="error">
                            Gerar erro (não salvar)
                        </option>
                        <option value="ignore">
                            Ignorar (não salvar)
                        </option>
                        <option value="append">
                            Acrescentar (append)
                        </option>
                        <option value="overwrite">
                            Sobrescrever (overwrite)
                        </option>
                    </select>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script setup>
import axios from 'axios';
import { defineExpose, defineProps, onBeforeMount, ref } from 'vue';
const handleSubmit = () => { };
const modal = ref({});
const valid = ref(true);

const props = defineProps({
    task: { type: Object, required: true },
});

const storages = ref([]);
const loadStorages = async () => {
    const fields = "&fields=id,name,type";
    const response = await axios.get(
        `${import.meta.env.VITE_LIMONERO_URL}/storages?size=100${fields}`);
    storages.value = response.data.data;
};
onBeforeMount(async () => {
    await loadStorages();
});

const show = () => {
    modal.value.show();
};
const emit = defineEmits(['update:save', 'update:value']);
const doEmit = (name, value) => {
    emit(`update:${name}`, value);
};
defineExpose({ show });
</script>