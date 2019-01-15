<template>
  <div style="height: 100%; padding: 0 5px 5px 0">
    <l-map ref="mapRef">
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
          url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          points: [],
          mode: null,
      }
  },
  methods: {
    getBounds(points) {
      var cornerBottomLeft = [90, 180];
      var cornerUpperRight = [-90, -180];

      points.forEach(point => {
        if (point.lat < cornerBottomLeft[0])
          cornerBottomLeft[0] = point.lat;
        if (point.lon < cornerBottomLeft[1])
          cornerBottomLeft[1] = point.lon;
        if (point.lat > cornerUpperRight[0])
          cornerUpperRight[0] = point.lat;
        if (point.lon > cornerUpperRight[1])
          cornerUpperRight[1] = point.lon;
      })

      return [
        cornerBottomLeft,
        cornerUpperRight
      ];
    }
  },
  mounted() {
    this.points = this.visualizationData.data;
    this.mode = this.visualizationData.mode;

    this.$nextTick(() => {
      if (this.mode.points) {
        this.points.slice(0, 100).forEach(point => {      // TODO: Find a way to show larger datasets
          L.marker([point.lat, point.lon])
          .addTo(this.$refs.mapRef.mapObject);
        });

        console.log("Attention: The number of markers shown in the map are being limited.")
      }

      if (this.mode.heatmap) {
        L.heatLayer(
          this.points.map(point => [point.lat, point.lon, 1])
        ).addTo(this.$refs.mapRef.mapObject);
      }

      this.$refs.mapRef.mapObject.fitBounds(this.getBounds(this.points))
    })
  }
};
</script>