<template>
    <b-modal ref="modal" button-size="sm" size="xl" :title="$t('actions.save')"
             :ok-disabled="!valid" @ok="handleOk">
        <div class="row">
            <div class="col-6">
                <h6>Salvar como nova fonte de dados</h6>
                <div class="row">
                    <div class="col-12">
                        <label>Nome da nova fonte de dados:</label>
                        <input v-model="newName" type="text" class="form-control form-control-sm" maxlength="100">
                    </div>
                    <div class="col-12 mt-2">
                        <label>Armazenamento:</label>
                        <select v-model.number="storage" class="form-control form-control-sm" name="storage">
                            <option />
                            <option v-for="st in storages" :key="st.id" :value="st.id">
                                {{st.name}} ({{st.type}})
                            </option>
                        </select>
                    </div>
                    <div class="col-12 mt-2">
                        <label>Caminho / pasta (opcional)):</label>
                        <input v-model="path" type="text" class="form-control form-control-sm" maxlength="100">
                    </div>
                    <div class="col-12 mt-2">
                        <label>Descrição (opcional):</label>
                        <textarea v-model="description" class="form-control form-control-sm" />
                    </div>
                    <div class="col-12 mt-2">
                        <label>Tags (opcional):</label>
                        <b-form-tags v-model="tags" input-id="tags-basic" :add-button-text="$t('actions.add')"
                                     duplicate-tag-text="tag já existe" placeholder="" />
                    </div>
                </div>
            </div>
            <div class="col-6">
                <h6>Salvar sobre fonte de dados anteriormente criada</h6>
                <small><a href="#" @click.prevent="originalId = null">{{$t('actions.clear')}}</a></small>
                <div v-if="relatedDataSources.data && relatedDataSources.data.length > 0" class="related-data-source">
                    <div v-for="ds in relatedDataSources.data" :key="ds.id">
                        <b-form-radio v-model.number="originalId" name="ds" :value="ds.id">
                            {{ds.path}} {{ds.name}}
                        </b-form-radio>
                        <small>{{ds.description}}<br>Atualizada em {{$filters.formatJsonDate(ds.updated)}}</small>
                    </div>
                </div>
                <div v-else>
                    Não há fontes de dados anteriormente criadas
                </div>
            </div>
            <div class="col-12 mt-2">
                <b-form-checkbox v-model="complete" name="complete">
                    Ignorar "amostrar" e salvar todos os dados
                </b-form-checkbox>
                <small>pode demorar, dependendo da quantidade de dados</small>
            </div>
        </div>
    </b-modal>
</template>
<script setup>
import axios from 'axios';
import { ref, defineProps, onMounted, defineExpose, computed } from "vue";

const emit = defineEmits(['complete', 'confirm']);

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

const props = defineProps(
    {
        name: { type: String, required: true },
        workflowId: { type: Number, required: true }
    }
);
const newName = ref(props.name);
const relatedDataSources = ref([]);
const storages = ref([]);

const path = ref();
const description = ref();
const storage = ref();
const complete = ref(true);
const tags = ref([]);
const originalId = ref();

const valid = computed(() => 
    !!((newName.value !== '' && storage.value) || originalId.value));
onMounted(async () => {
    storages.value = await loadStorages();
});

const modal = ref();
const show = async () => {
    relatedDataSources.value = await loadRelatedDataSources();
    modal.value.show();
};
const handleOk = () => {
    emit("confirm", {
        name: newName.value, path: path.value,
        description: description.value, storage:
            storage.value, complete: complete.value, tags: tags.value,
        data_source_id: originalId.value
    });
    originalId.value = null;
};
const loadStorages = async () => {
    const fields = "&fields=id,name,type";
    const response = await axios.get(
        `${limoneroUrl}/storages?size=100${fields}`);
    return response.data.data;
};
const loadRelatedDataSources = async () => {
    try {
        const fields = "&fields=id,name,updated,description";
        const response = await axios.get(
            `${limoneroUrl}/datasources?size=100&workflow_id=${props.workflowId}${fields}`);
        return response.data;
    } catch (e) {
        // FIXME: Use notifier
        console.debug(e);
    }
};
defineExpose({
    show
});
</script>
<style scoped>
.related-data-source {
    max-height: 50vh;
    overflow: auto;
    border: 1px solid #ccc;
    padding: 5px;
    
}
.related-data-source>>>small {
    font-size: .7em;
}
</style>