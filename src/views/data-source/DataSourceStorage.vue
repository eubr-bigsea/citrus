<!-- eslint-disable vue/html-indent -->
<template>
  <main role="main">
    <div class="row">
      <div class="col">
        <div>
          <div class="title">
            <h1>{{ $tc('titles.dataSource', 1)}}</h1>
          </div>
          <div class="row">
            <div class="col-md-2">
              <data-source-options selected="dataSourceStorage" />
            </div>
            <div class="col-md-10">
              <div v-if="dataSource.format === 'CSV'" class="box">
                <p>Formato</p>
                <div>
                  <h3>CSV</h3>
                  <p>
                    <b>Importante:</b> Atualmente, a fonte de dados está
                    armazenada usando o formato <b>CSV</b>.
                  </p>
                  <br>
                  <p>
                    Esse formato não é otimizado para leitura, processamento e
                    espaço em disco. Recomenda-se que seja usado um formato mais
                    otimizado, especialmente quando a fonte de dados contiver
                    milhares de registros ou centenas de atributos. O lemonade
                    suporta a conversão para o formato <b>Parquet</b>.
                  </p>
                  <br>
                  <p>Você poderá posteriormente exportar a fonte de dados novamente no formato CSV.</p>
                  <button @click="convert()">Converter para Parquet</button>
                </div>
              </div>
              <div v-if="dataSource.format === 'PARQUET'" class="box">
                <p>Formato</p>
                <div>
                  <h3>Parquet</h3>
                  <p>
                    <b>Importante:</b> Atualmente, a fonte de dados está
                    armazenada usando o formato <b>Parquet</b>.
                  </p>
                  <br>
                  <p>
                    Esse formato já é o formato recomendado para o uso do Lemonade, por ser otimizado para leitura,
                    processamento e espaço em disco.<br><br> Você poderá posteriormente exportar a fonte de dados
                    novamente no formato CSV.
                  </p>
                </div>
              </div>
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
  },
};
</script>

<style scoped>
.box {
  display: flex;
  flex-direction: row;
  gap: 30px;
  padding: 20px;
  border: solid 1px rgba(0, 0, 0, .125);
  border-radius: 0.25rem;
}

button {
  border-radius: 5px;
  border: none;
  padding: 10px;
}

p {
  text-align: justify;
}
</style>