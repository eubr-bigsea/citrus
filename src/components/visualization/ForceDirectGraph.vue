<template>
    <div class="text-center main-div">
        <div class="border" style="width: 100%; height: 500px;" ref="mainDiv" id="mainDiv">
            <h1>Teste</h1>
            <b-link v-if="!inFullScreen" @click="fullScreen">
                Full screen
            </b-link>
            <div ref="graphDiv"></div>
        </div>
    </div>
</template>
<script>
    import VisualizationMixin from "./VisualizationMixin";
    import ForceGraph from 'force-graph';
    export default {
        mixins: [VisualizationMixin],
        data() {
            return {
                inFullScreen: false
            };
        },
        mounted() {
            const N = 100;
            const GROUPS = 12;
            const gData = {
                nodes: [...Array(N).keys()].map(i => ({ id: i, val: Math.random() * 20, group: Math.ceil(Math.random() * GROUPS) })),
                links: [...Array(N).keys()]
                    .filter(id => id)
                    .map(id => ({
                        source: id,
                        target: Math.round(Math.random() * (id - 1))
                    }))
            };

            const Graph = ForceGraph()
                (this.$refs.graphDiv)
                .linkDirectionalParticles(2)
                .nodeAutoColorBy('group')
                .linkAutoColorBy(d => gData.nodes[d.source].group)
                // .nodeRelSize(1)
                .graphData(gData);
        },
        methods: {
            fullScreen() {
                const elem = this.$refs.mainDiv;

                const tests = ['requestFullscreen', 'msRequestFullscreen',
                    'mozRequestFullScreen', 'webkitRequestFullscreen'];
                tests.forEach(test => {
                    if (elem[test]) {
                        elem[test]();
                    }
                });
            },
            getData() {
                const result = this.visualizationData.data;
                return result;
            }
        },
    }
</script>
<style>
    div#mainDiv {
        background-color: white;
        overflow: auto;
    }
</style>