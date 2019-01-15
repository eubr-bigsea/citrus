<template>
  <div class="myview">
    <p v-if="loading">Loading</p>

    <div v-if="error" class="alert alert-danger" role="alert">{{ errorMessage }}</div>

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

import CaipirinhaVisualizationHtml from "./CaipirinhaVisualizationHtml"
import CaipirinhaVisualizationTable from "./CaipirinhaVisualizationTable"
import CaipirinhaVisualizationLine from "./CaipirinhaVisualizationLine"
import CaipirinhaVisualizationBar from "./CaipirinhaVisualizationBar"
import CaipirinhaVisualizationPie from "./CaipirinhaVisualizationPie"
import CaipirinhaVisualizationArea from "./CaipirinhaVisualizationArea"
import CaipirinhaVisualizationScatter from "./CaipirinhaVisualizationScatter"
import CaipirinhaVisualizationMap from "./CaipirinhaVisualizationMap"
import CaipirinhaVisualizationDonut from "./CaipirinhaVisualizationDonut"

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
  created() {
    this.loading = true;
    this.error = false;

    axios
      .get(this.url)
      .then(response => {
        this.visualizationComponent = getVisualizationComponent(
          response.data.type.id
        );
        this.visualizationData = response.data;
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