<template>
  <table class="table">
    <thead>
      <th v-for="attribute in attributes" v-bind:key="attribute">{{attribute}}</th>
    </thead>
    <tbody>
      <tr v-for="row in rows" v-bind:key="row">
        <td v-for="column in row" v-bind:key="column">{{column}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "caipirinha-visualization-scatter",
  props: ["visualizationData"],
  data: function() {
    return {
      attributes: this.visualizationData.data.attributes,
      rows: this.visualizationData.data.rows
    };
  }
};
</script>