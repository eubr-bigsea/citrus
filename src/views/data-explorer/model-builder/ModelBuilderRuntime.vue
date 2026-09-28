<template>
    <div>
        <div>
            <h5 class="pb-3 border-bottom">
                Ambiente de processamento
            </h5>
            <b-form-group label="Cluster de processamento:">
                <vue-select v-model="preferred_cluster_id" :options="clusters" label="name" :reduce="option => option.id"
                            class="w-50" />
                <div class="form-text text-muted">
                    Escolha em qual conjunto de máquinas você vai executar a construção dos modelos.
                </div>
            </b-form-group>
        </div>
    </div>
</template>
<script setup>
const preferred_cluster_id = defineModel('preferred_cluster_id');

import VueSelect from 'vue-select';

const props = defineProps({
    clusters: { type: Array, required: true },
});
</script>
