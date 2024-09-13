<template>
    <b-modal ref="modal" title="Sugestão de arquivo GeoJSON" size="lg" hide-footer>
        <div v-if="options.length > 0">
            <h6>Os seguintes arquivos são sugestões cadastradas para arquivos GeoJSON</h6>
            <div class="selection-area scroll-area border">
                <template v-for="opt in options" :key="opt.key">
                    <div v-if="opt.enabled" class="row border-bottom p-2">
                        <div class="col-9">
                            <input type="radio" class="pt-4" name="geo-opt" @click="confirm(opt.url)">
                            {{opt.description}}
                        </div>
                        <div class="col-3">
                            Identificador: {{opt.key}}
                        </div>
                        <div class="col-12">
                            Disponível em <a :href="opt.url" target="_blank">{{opt.url}}</a>
                        </div>
                        <div class="col-12">
                            Exemplo de propriedades: {{opt.properties}}
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div v-else class="alert alert-warning">
            <font-awesome-icon icon="fa fa-info-circle" size="1x" />
            Nenhuma sugestão de GeoJSON cadastrada. Solicite ao administrador do
            Lemonade para adicionar sugestões.
        </div>
    </b-modal>
</template>
<script setup>
import { ref }  from 'vue';
import axios from 'axios';
const thornUrl = import.meta.env.VITE_THORN_URL;

const props = defineProps({
    value: { type: String, required: true }
});
const emit = defineEmits(['input']);
const modal = ref();

const show = async () => {
    await load();
    modal.value.show();
};
const confirm = (newValue) => {
    emit('input', newValue);
    modal.value.hide();
};
defineExpose({ show });
// Methods
const options = ref([]);
const load = async () => {
    try {
        const resp = await axios.get(`${thornUrl}/public/configurations/GEO_JSON_URLS`);
        options.value = resp.data.data; //.sort((a, b) => a.description.localeCompare(b.description));
    } catch (e) {
        console.debug(e);
    }
};

</script>
<style scoped>
.selection-area {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 400px;
    font-size: .9em;

}

</style>