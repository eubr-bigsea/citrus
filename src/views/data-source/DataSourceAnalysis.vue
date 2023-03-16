<template>
    <main role="main">
        <div class="row header">
            <div class="title col-md-3">
                <h1>{{$tc('titles.dataSource', 1)}}</h1>
            </div>
            <div>{{dataSource.name}}</div>
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
                    <option>Unidimensional</option>
                    <option>Bidimensional</option>
                    <option>Multidimensional</option>
                    <option>Testes Estatísticos</option>
                    <option>Ajustar (fit) a uma distribuição</option>
                    <option>Séries temporais</option>
                </select>
                <p>Análises:</p>
                <div v-if="choice == unidimensional" class="flex column">
                    <div class="form-check">
                        <input id="defaultCheck1" class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label" for="defaultCheck1">
                            Histograma
                        </label>
                        <input id="defaultCheck1" class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label" for="defaultCheck1">
                            Quantile table
                        </label>
                        <input id="defaultCheck1" class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label" for="defaultCheck1">
                            Frequency table
                        </label>
                        <input id="defaultCheck1" class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label" for="defaultCheck1">
                            Summary stats
                        </label>
                        <input id="defaultCheck1" class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label" for="defaultCheck1">
                            Box Plot
                        </label>
                        <input id="defaultCheck1" class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label" for="defaultCheck1">
                            Cumulative Distribution Function
                        </label>
                    </div>
                </div>
            </b-modal>
        </div>

        <div class="row">
            <div class="col-md-2">
                <data-source-options selected="dataSourceAnalysis" />
            </div>

            <div class="col-md-8">
                <div class="analysis">
                    <h4>Unidimensional</h4>
                    <div class="analysis_box">
                        <div class="analysis_card">
                            <div class="analysis_card_header">
                                <h6>Atributo</h6>
                                <b-dropdown id="dropdown-right" right class="m-2">
                                    <b-dropdown-item href="#">
                                        Excluir
                                    </b-dropdown-item>
                                    <b-dropdown-item href="#">
                                        Editar
                                    </b-dropdown-item>
                                    <b-dropdown-item href="#">
                                        Atualizar
                                    </b-dropdown-item>
                                </b-dropdown>
                            </div>
                            <h6>Histograma</h6>
                            <ul class="measurements">
                                <li>Max:</li>
                                <li>Min:</li>
                                <li>Avg:</li>
                                <li>Std:</li>
                                <li>Median:</li>
                            </ul>
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
        DataSourceOptions,
    },
    data() {
        return {
            dataSource: null,
            choice: null,
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            const resp = await axios.get(
                `${limoneroUrl}/datasources/${this.$route.params.id}`
            );
            this.dataSource = resp.data;
        },
        select(option) {
            this.choice = option;
        },
    },
};
</script>

<style scoped>
.analisys {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10% 0 0;
}

.analysis_box {
  height: 60vh;
  border: 1px solid #d9dadb;
  border-radius: 4px;
}

.analysis_card {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 300px;
  border-right: 1px solid #d9dadb;
  padding: 20px;
}

.analysis_card>h6 {
  text-align: center;
}

.analysis_card_header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.measurements {
  height: fit-content;
  width: 100%;
  text-decoration: none;
  list-style: none;
  text-align: start;
  padding: 0 0 0 0;
}
</style>
