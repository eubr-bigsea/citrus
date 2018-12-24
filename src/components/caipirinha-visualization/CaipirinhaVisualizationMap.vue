<template>
  <div style="height: 400px; margin: 10px">
    <l-map>
      <l-tile-layer :url="url"></l-tile-layer>
    </l-map>
  </div>
</template>

<script>
export default {
  name: "caipirinha-visualization-map",
  props: ["visualizationData"],
  data: function() {
      return {
          url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      }
  }
};
</script>