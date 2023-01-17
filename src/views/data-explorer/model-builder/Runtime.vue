<template>
    <div>
        <div>
            <h5>Ambiente de processamento</h5>
            <hr>
            <label class="font-weight-bold">Cluster de processamento:</label>
            <v-select v-model="workflow.preferred_cluster_id"
                      :options="clusters"
                      label="name"
                      :reduce="option => option.id"
                      class="w-25" />
            <small class="form-text text-muted">
                Escolha em qual conjunto de máquinas você vai executar a construção dos modelos.
            </small>
        </div>
    </div>
</template>
<script>
import VueSelect from 'vue-select';
export default {
    name: 'RuntimeComponent',
    components: { 'v-select': VueSelect, },
    props: {
        clusters: { type: Array, required: true },
        workflow: {type: Object, required: true}
    },
}
</script>
