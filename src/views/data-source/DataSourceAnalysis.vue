<template>
    <main role="main">
        <div class="row">
            <div class="title col-md-3">
                <h1>{{$tc('titles.dataSource', 1)}}</h1>
            </div>
        </div>

        <div class="row">
            <div class="col-md-2">
                <data-source-options selected="dataSourceAnalysis" />
            </div>

            <div class="col-md-10">
                <div class="row">
                    <div class="col-md-12 d-flex flex-row justify-content-between">
                        <div>{{dataSource.name}}</div>
                        <button v-b-modal.add-analysis type="button" class="btn btn-primary">
                            Adicionar...
                        </button>
                        <b-modal id="add-analysis" title="Adicionar Análise">
                            <label for="exampleFormControlSelect1">Atributos</label>
                            <select id="exampleFormControlSelect1" class="form-control">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                            <label for="exampleFormControlSelect1">Tipo</label>
                            <select class="form-control" id="exampleFormControlSelect1">
                                <option>Unidimensional</option>
                                <option>Bidimensional</option>
                                <option>Multidimensional</option>
                                <option>Testes Estatísticos</option>
                                <option>5</option>
                            </select>
                            <p>Análises:</p>

                        </b-modal>
                    </div>
                </div>

                <div class="row">
                    Teste testando
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import axios from 'axios';
import DataSourceOptions from '../../components/data-source/DataSourceOptions.vue';
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    components: {
        DataSourceOptions
    },
    data() {
        return {
            dataSource: null,
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            const resp = await axios.get(
                `${limoneroUrl}/datasources/${this.$route.params.id}`);
            this.dataSource = resp.data;
        },
    },
};
</script>

<style scoped>
.right_box {
  background-color: blueviolet;
}
</style>