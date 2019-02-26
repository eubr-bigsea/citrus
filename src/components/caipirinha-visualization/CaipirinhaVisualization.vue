<template>
  <div class="myview">
    <p v-if="loading">Loading</p>

    <div v-if="error">
        <div class="alert alert-danger" role="alert">{{ errorMessage }}</div>
        {{$t('visualization.tryRefresh')}}
    </div> 

    <component class="myview" v-bind:is="visualizationComponent" :visualizationData="visualizationData"></component>
  </div>
</template>

<style>
  .myview {
    height: 100%;
  }
</style>

<script>
import axios from "axios"
import Highcharts from 'highcharts'
 
import CaipirinhaVisualizationHtml from "./CaipirinhaVisualizationHtml"
import CaipirinhaVisualizationTable from "./CaipirinhaVisualizationTable"
import CaipirinhaVisualizationLine from "./CaipirinhaVisualizationLine"
import CaipirinhaVisualizationBar from "./CaipirinhaVisualizationBar"
import CaipirinhaVisualizationPie from "./CaipirinhaVisualizationPie"
import CaipirinhaVisualizationArea from "./CaipirinhaVisualizationArea"
import CaipirinhaVisualizationScatter from "./CaipirinhaVisualizationScatter"
import CaipirinhaVisualizationMap from "./CaipirinhaVisualizationMap"
import CaipirinhaVisualizationDonut from "./CaipirinhaVisualizationDonut"

let highchartsDefaultLang = undefined;

const highchartsPtLang = {
  months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  contextButtonTitle: 'Opções Avançadas',
  decimalPoint: ',',
  thousandsSep: '.',
  downloadJPEG: 'Salvar como JPEG',
  downloadPDF: 'Salvar como PDF',
  downloadPNG: 'Salvar como PNG',
  downloadSVG: 'Salvar como SVG',
  downloadCSV: 'Salvar como CSV',
  downloadXLS: 'Salvar como XLS',
  loading: 'Aguarde...',
  noData: 'Sem dados para exibir',
  viewData: 'Visualizar em tabela',
  printChart: 'Imprimir',
  resetZoom: 'Desfazer zoom',
  resetZoomTitle: 'Voltar zoom 1:1',
  openInCloud: "Abrir no Highcharts Cloud"
};

const getVisualizationComponent = function(typeId) {
  switch (typeId) {
    case 1:
      return "caipirinha-visualization-html";
    case 35:
      return "caipirinha-visualization-table";
    case 68:
      return "caipirinha-visualization-line";
    case 69:
      return "caipirinha-visualization-bar";
    case 70:
      return "caipirinha-visualization-pie";
    case 71:
      return "caipirinha-visualization-area";
    case 87:
      return "caipirinha-visualization-scatter";
    case 88:
      return "caipirinha-visualization-map";
    case 89:
      return "caipirinha-visualization-donut";

    default:
      throw new TypeError("Invalid visualization ID");
  }
};

const getVisualizationData = function(responseData) {
  if (responseData.x && responseData.x.type == "time") {
    responseData.data = responseData.data.map(serie => ({
      ...serie,
      values: serie.values.map(value => ({
          ...value,
          x: Date.parse(value.x)
        }))
    }))
  }

  return responseData;
}

export default {
  name: "caipirinha-visualization",
  props: ["url"],
  components: {
    CaipirinhaVisualizationHtml,
    CaipirinhaVisualizationTable,
    CaipirinhaVisualizationLine,
    CaipirinhaVisualizationBar,
    CaipirinhaVisualizationPie,
    CaipirinhaVisualizationArea,
    CaipirinhaVisualizationScatter,
    CaipirinhaVisualizationMap,
    CaipirinhaVisualizationDonut
  },
  data() {
    return {
      loading: true,
      error: false,
      errorMessage: false,
      visualizationData: null,
      visualizationComponent: null
    };
  },
  methods: {
    setLang() {
      if (highchartsDefaultLang === undefined)
        highchartsDefaultLang = {
          ...Highcharts.getOptions().lang
        };

      if (this.$locale == 'pt')
        Highcharts.setOptions({
          lang: highchartsPtLang
        });

      else
        Highcharts.setOptions({
          lang: highchartsDefaultLang
        });
    }
  },
  created() {
    this.loading = true;
    this.error = false;

    this.setLang();

    axios
      .get(this.url)
      .then(response => {
        this.visualizationComponent = getVisualizationComponent(
          response.data.type.id
        );
        this.visualizationData = getVisualizationData(response.data);
        this.loading = false;
      })
      .catch(response => {
        this.error = true;
        this.errorMessage = response.message;
        this.loading = false;
      });
  }
};
</script>