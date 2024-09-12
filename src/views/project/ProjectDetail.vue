<template>
    <main role="main">
        <div class="border-bottom">
            <b-nav>
                <b-nav-item active>
                    {{$t('titles.list', {what: $t('titles.project', 2)})}}
                </b-nav-item>
                <b-nav-item>Link</b-nav-item>
                <b-nav-item>Another Link</b-nav-item>
                <b-nav-item disabled>
                    Disabled
                </b-nav-item>
            </b-nav>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <h1>{{$t('titles.project', 1)}}</h1>
        </div>
        <div class="row">
            <div class="col-10">
                <div class="diagram-limit">
                    <div id="query-diagram-lemonade" class="query-diagram">
                        <template v-for="table in tables" :key="`${table.type}-${table.id}`">
                            <project-item :item="table"
                                          :jsplumb-instance="jsplumbInstance" @click="handleItemClick" />
                        </template>
                    </div>
                </div>
            </div>
            <div class="col-2 border-left">
                Teste
            </div>
        </div>
    </main>
</template>
<script>
import { jsPlumb } from 'jsplumb';
import dagre from 'dagre';
import ProjectGraphItem from './ProjectGraphItem.vue';
import { ref, computed, onBeforeUnmount, onMounted } from 'vue';

export default {
    components: {
        projectItem: ProjectGraphItem
    },
    setup() {

        const activeItem = ref(null);
        let jsplumbInstance = null;
        const tables = ref(
            [
                {
                    id: 1, name: 'Titanic',
                    type: 'data-source',
                    icon: 'database',

                },
                {
                    id: 1, name: 'Dashboard de teste',
                    type: 'dashboard',
                    icon: 'chart-line',

                },
                {
                    id: 1, name: 'Fluxo Titanic',
                    icon: 'project-diagram',
                    type: 'workflow',

                },
                {
                    id: 1, name: 'Análise exploratória titanic',
                    icon: 'table',
                    type: 'data-explorer',

                },
                {
                    id: 1, name: 'Model builder',
                    left: 20, top: 600,
                    icon: 'robot',
                    type: 'model-builder',

                },
                {
                    id: 1, name: 'Deployment',
                    icon: 'server',
                    type: 'deployment',

                },
                {
                    id: 2, name: 'Fonte de dados com nome bem longo para teste',
                    type: 'data-source',
                    icon: 'database',

                },
                {
                    id: 1, name: 'Modelo 11',
                    icon: 'check-square',
                    type: 'model',

                },

                {
                    id: 3, name: 'Amostra titanic tratada',
                    type: 'data-source',
                    icon: 'database',

                },
                {
                    id: 2, name: 'Análise exploratória 2',
                    icon: 'table',
                    type: 'data-explorer',

                },

                {
                    id: 2, name: 'Deployment 2',
                    icon: 'server',
                    type: 'deployment',

                },
                {
                    id: 2, name: 'Fluxo Titanic 2',
                    icon: 'project-diagram',
                    type: 'workflow',

                },
                {
                    id: 3, name: 'Fluxo Titanic 3',
                    icon: 'project-diagram',
                    type: 'workflow',

                },
                {
                    id: 4, name: 'Fluxo Titanic 4',
                    icon: 'project-diagram',
                    type: 'workflow',

                },
                {
                    id: 4, name: 'Passageiros',
                    type: 'data-source',
                    icon: 'database',

                },
                {
                    id: 1, name: 'Trilha de fraudes',
                    type: 'app',
                    icon: 'microscope',

                },
                {
                    id: 1, name: 'Código Python',
                    type: 'python',
                    icon: 'python',
                    entity: '&#128013'

                },
            ]
        );
        const links = computed(() => {
            return [
                ['lemonade-data-source-1', 'lemonade-workflow-1', 'queried by'],
                ['lemonade-data-source-4', 'lemonade-workflow-1', 'queried by'],
                ['lemonade-data-source-1', 'lemonade-data-explorer-1', 'queried by'],
                ['lemonade-data-source-1', 'lemonade-model-builder-1', 'queried by'],
                ['lemonade-workflow-1', 'lemonade-dashboard-1', 'produces'],
                ['lemonade-model-1', 'lemonade-deployment-1', 'deployed by'],
                ['lemonade-workflow-1', 'lemonade-data-source-2', 'produces'],
                ['lemonade-model-builder-1', 'lemonade-model-1', 'produces'],
                ['lemonade-data-explorer-1', 'lemonade-data-source-3', 'produces'],
                ['lemonade-dashboard-1', 'lemonade-deployment-2', 'deployed by'],
                //['lemonade-workflow-4', 'lemonade-deployment-2', 'deployed by'],
                ['lemonade-data-source-3', 'lemonade-workflow-2', 'queried by'],
                ['lemonade-data-source-1', 'lemonade-workflow-3', 'queried by'],
                ['lemonade-data-source-3', 'lemonade-workflow-4', 'queried by'],
                ['lemonade-data-source-1', 'lemonade-data-explorer-2', 'queried by'],
                ['lemonade-data-explorer-2', 'lemonade-workflow-3', 'generated'],

                ['lemonade-workflow-4', 'lemonade-app-1', 'defines'],
                ['lemonade-data-source-2', 'lemonade-python-1', 'queried by'],
            ];
        });
            // Layout graph
        const g = new dagre.graphlib.Graph();
        // Set an object for the graph label
        g.setGraph({ rankdir: 'LR', edgesep: 0, ranksep: 140, nodesep: 0 });
        // Default to assigning a new object as a label for each new edge.
        g.setDefaultEdgeLabel(function () { return {}; });

        tables.value.forEach((table) => {
            g.setNode(`lemonade-${table.type}-${table.id}`,
                { table, width: 100, height: 100 });
        });
        links.value.forEach(link => {
            g.setEdge(link[0], link[1]);
        });
        dagre.layout(g);
        g.nodes().forEach(function (v) {
            //this.tables.log("Node " + v + ": " + JSON.stringify(g.node(v)));
            const node = g.node(v);
            if (node) {
                const table = node.table;
                table.top = node.y;
                table.left = node.x;
            }
        });
        onBeforeUnmount(() => {
            if (jsplumbInstance != null) {
                jsplumbInstance.reset();
                jsplumbInstance = null;
            }
        });
        onMounted(() => {
            jsplumbInstance = jsPlumb.getInstance({
                PaintStyle: {
                    strokeWidth: 1,
                    stroke: '#3E7E9C',
                    dashstyle: "6 2"
                    /*outlineStroke: "transparent",
                        gradient: {
                            stops: [[0, "#3E7E9C"], [1, "red"]]
                        },*/
                },
                Connector: ["Bezier", { curviness: 70 }],
                DragOptions: { cursor: "crosshair" },
                //Endpoints: [["Dot", { radius: 7 }], ["Dot", { radius: 11 }]],
                //EndpointStyles: [{ fill: "#225588" }, { fill: "#558822" }],
                connectionOverlays: [
                    ['Arrow', { location: 1, id: 'arrow' }]
                ],
            });
            jsplumbInstance.setContainer('query-diagram-lemonade');

            links.value.forEach(link => {
                jsplumbInstance.connect({
                    source: link[0],
                    target: link[1],
                    anchors: ["Right", "Left"],
                    endpointStyle: { fill: "transparent" },
                    overlays: [
                        ["PlainArrow", { location: 1, width: 7, length: 5 }],
                        ["Label", { label: link[2], id: "label", cssClass: 'connectorLabel', location: -40 }]
                    ],
                });
            });

        });
        const handleItemClick = (item) => {
            if (activeItem.value) {
                activeItem.value.removeClass('active');
            }
            activeItem.value = item;
            item.addClass('active');
        };
        return {
            activeItem,
            jsplumbInstance,
            tables, links,
            handleItemClick
        };
    },
};
</script>
<style scoped>
    #query-diagram-lemonade>>>.connectorLabel {
        font-size: 7pt;
        margin-top: -10px;
        text-align: center;
        width: 140px;
    }

    .query-diagram {
        xbackground: url('../../assets/grid1.png');
        background-color: #fcfcfc;
        border: 1px solid #aaa;
        height: 2000px;
        position: relative;
        width: 2000px;
    }

    .diagram-limit {
        width: 100%;
        height: 82vh;
        overflow: auto;
    }

    .diagram-limit::-webkit-scrollbar {
        height: 10px;
        width: 10px;
        background: #eee;
    }

    .diagram-limit::-webkit-scrollbar-thumb {
        background: #aaa;
        -webkit-border-radius: 1ex;
    }

    .diagram-limit::-webkit-scrollbar-corner {
        background: #000;
    }
</style>