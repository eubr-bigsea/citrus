<template>
  <v-client-table :data="data" :columns="columns" :options="options"></v-client-table>
</template>

<script>
export default {
  name: "caipirinha-visualization-scatter",
  props: ["visualizationData"],
  data: function() {
    return {
      options: {
        filterable: false,
        perPage: 10,
        perPageValues: [],
        skin:'table-smallest table-bordered table-sm table table-striped',
      },
      columns: this.visualizationData.data.attributes,
      data: this.visualizationData.data.rows.map(row => {
        const columns = this.visualizationData.data.attributes;

        return row.reduce((data, column, i) => {
          return {
            ...data,
            [columns[i]]: column,
          }
        }, {})
      })
    };
  }
};
</script>