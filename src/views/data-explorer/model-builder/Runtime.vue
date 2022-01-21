<template>
    <div>
        <div>
            <h5>Ambiente de processamento</h5>
            <hr />
            <label class="font-weight-bold">{{$tc('deployment.target')}}:</label>
            <v-select :options="clusters" v-model="target" label="name" :reduce="option => option.id" class="w-25" />
            <small class="form-text text-muted">
                Escolha em qual conjunto de máquinas você vai executar a construção dos modelos.
            </small>
        </div>
    </div>
</template>
<script>
    import VueSelect from 'vue-select';
    export default {
        components: { 'v-select': VueSelect, },
        props: {
            clusters: { type: Array }
        },
        data() {
            return {
                target: 1
            }
        }

    }
</script>