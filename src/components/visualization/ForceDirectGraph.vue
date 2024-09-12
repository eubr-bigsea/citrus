<template>
    <div class="text-center">
        <div ref="mainDiv"
             class="border main-div">
            <h1>Teste</h1>
            <b-link v-if="!inFullScreen"
                    @click="fullScreen">
                Full screen
            </b-link>
            <div style="width: 100%;">
                <div style="margin: 0px auto; width: 100%; border: 1px solid; height: 100vh;overflow:hidden">
                    <div ref="graphDiv" />
                </div>
            </div>
            <!--
            <div style="float: left;width: 25vh;border: solid 1px red;">
                OK
            </div>
            -->
        </div>
    </div>
</template>
<script>
import VisualizationMixin from "./VisualizationMixin.vue";
//import ForceGraph from 'force-graph';
export default {
    mixins: [VisualizationMixin],
    data() {
        return {
            inFullScreen: false
        };
    },
    mounted() {
        /*
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
                .linkDirectionalParticles(0)
                .nodeAutoColorBy('group')
                .linkAutoColorBy(d => gData.nodes[d.source].group)
                // .nodeRelSize(1)
                .centerAt(400, 120)
                .graphData(gData);
            */

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
};
</script>
<style>
    .main-div {
        background-color: white;
        user-select: none;
        width: 100%;
    }
</style>
