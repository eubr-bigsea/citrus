<template>
    <main role="main">
        <div class="row">
            <div class="title col-md-3">
                <h1>{{ $tc('titles.dataSource', 1) }}</h1>
            </div>
        </div>

        <div class="row">
            <div class="col-md-2">
                <data-source-options selected="dataSourceAnalysis" />
            </div>

            <div class="col-md-8">
                <div class="row">
                    <div class="col d-flex flex-row justify-content-between">
                        <div>{{ dataSource.name }}</div>
                        <button v-b-modal.add-analysis type="button" class="btn btn-primary">
                            Adicionar...
                        </button>
                        <b-modal id="add-analysis" title="Adicionar Análise" class="row gx-5">
                            <label for="exampleFormControlSelect1">Atributos</label>
                            <select id="exampleFormControlSelect1" class="form-control">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                            <label for="exampleFormControlSelect1">Tipo</label>
                            <select id="exampleFormControlSelect1" class="form-control">
                                <option @click="select(unidimensional)">Unidimensional</option>
                                <option @click="select(bidimensional)">Bidimensional</option>
                                <option @click="select(multidimensional)">Multidimensional</option>
                                <option @click="select(testes)">Testes Estatísticos</option>
                                <option @click="select(ajustar)">Ajustar (fit) a uma distribuição</option>
                                <option @click="select(series)">Séries temporais</option>
                            </select>
                            <p>Análises:</p>
                            <div v-if="choice == unidimensional" class="flex column">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck1">
                                        Histograma
                                    </label>
                                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck1">
                                        Quantile table
                                    </label>
                                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck1">
                                        Frequency table
                                    </label>
                                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck1">
                                        Summary stats
                                    </label>
                                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck1">
                                        Box Plot
                                    </label>
                                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck1">
                                        Cumulative Distribution Function
                                    </label>
                                </div>
                            </div>
                        </b-modal>
                    </div>
                </div>

                <div class="row main_box">
                    <div class="card">
                        <h3>Atributo</h3>
                        <div class="card-body">
                            <div class="card-title">Histograma</div>

                        </div>
                    </div>
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
            choice: null
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
        select(option) {
            this.choice = option;
        }
    },
};
</script>

<style scoped>
.main_box {
    height: 60vh;
    border: 1px solid gray;
    border-radius: 4px;
}

.card {
    width: 300px;
}
</style>