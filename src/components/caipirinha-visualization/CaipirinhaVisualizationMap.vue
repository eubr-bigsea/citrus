<template>
    <div>
        <h2 style="margin-bottom: 5px;">{{ visualizationData.title }}</h2>
        <div style="height: 800px; padding: 0px 5px 5px 0;">
            <l-map ref="mapRef">
                <l-tile-layer :url="url"></l-tile-layer>
            </l-map>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import palette from 'google-palette';
    import axios from "axios";
    export default {
        name: "caipirinha-visualization-map",
        props: ["visualizationData"],
        data: function () {
            const protocol = location.protocol;
            return {
                url: `${protocol}//{s}.tile.osm.org/{z}/{x}/{y}.png`,
                points: [],
                mode: null,
            }
        },
        methods: {
            _addGeoJsonLegend(colors, values) {
                const legend = L.control({ position: 'bottomright' });
                legend.onAdd = function (map) {
                    const div = L.DomUtil.create('div', 'info legend');
                    div.classList.add("legend-geoj")
                    // loop through our density intervals and generate a label with a colored square for each interval
                    for (let i = 0; i < values.length; i++) {
                        div.innerHTML +=
                            '<i class="l-geoj" style="background:#' + colors[i] + '"></i> ' +
                            values[i] + '<br>';
                    }
                    return div;
                };
                legend.addTo(this.$refs.mapRef.mapObject);
            },
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
            const self = this;
            this.points = this.visualizationData.data;
            this.mode = this.visualizationData.mode;

            this.$nextTick(() => {
                if (this.mode.points || this.mode == 'points') {
                    this.points.forEach(point => {      // TODO: Find a way to show larger datasets
                        L.marker([point.lat, point.lon])
                            .addTo(this.$refs.mapRef.mapObject).bindTooltip(point.name,
                                {
                                    permanent: true
                                });
                    });
                }

                if (this.mode.heat || this.mode.heatmap || this.mode == 'heatmap') {
                    L.heatLayer(
                        this.points.map(point => [point.lat, point.lon, point.value | 1])
                    ).addTo(this.$refs.mapRef.mapObject);
                }
                this.$refs.mapRef.mapObject.fitBounds(this.getBounds(this.points));
                if (this.mode.polygon) {
                    axios
                        .get(this.visualizationData.geojson.url)
                        .then(response => {
                            const mapStyle = {
                                stroke: true,
                                weight: .5,
                                fill: true,
                                fillColor: '#fff',
                                fillOpacity: 1
                            }
                            const idProperty = self.visualizationData.geojson.idProperty;
                            const distinctValues = Array.from(
                                new Set(this.visualizationData.data.map(v => v.value))).sort();
                            const colors = palette('tol-sq', distinctValues.length);

                            let jsonLayer = L.geoJson(response.data, {
                                //clickable: false,
                                onEachFeature: (feature, layer) => {
                                    if (feature.properties) {
                                        layer.bindPopup(JSON.stringify(feature.properties),
                                            { closeButton: false, offset: L.point(0, -10) });
                                        layer.on('click', function () { layer.openPopup(); });
                                        //layer.on('mouseout', function () { layer.closePopup(); });
                                    }
                                },
                                style: function (feature) {
                                    var d = JSON.parse(JSON.stringify(mapStyle));
                                    let found = self.points.find((row) => row.id === feature.properties[idProperty]);
                                    if (found) {
                                        feature.properties['value'] = found.value;
                                        d['fillColor'] = '#' + colors[distinctValues.indexOf(found.value)];
                                        d['fillOpacity'] = .5;
                                        counter++;
                                    }
                                    return d;
                                }
                            });
                            self.$refs.mapRef.mapObject.fitBounds(jsonLayer.getBounds());
                            jsonLayer.addTo(self.$refs.mapRef.mapObject);
                            window.setTimeout(() => {
                                self.$refs.mapRef.mapObject.fitBounds(jsonLayer.getBounds());
                            }, 500);
                            self._addGeoJsonLegend(colors, distinctValues);
                        })
                        .catch(response => {
                            console.debug(response);
                            this.error = true;
                            this.errorMessage = response.message;
                        });
                }
            })
        }
    };
</script>
<style>
    .legend-geoj {
        border: 1px solid #aaa;
        padding: 10px 5px 10px 30px;
        text-align: right;
    }

    .l-geoj {
        height: 10px;
        width: 20px;
        display: inline-block;

    }
</style>