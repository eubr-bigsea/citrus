<template lang="">
    <div>
        <b-card>
            <b-tabs card>
                <b-tab title="Query">
                    <b-card-text>Tab contents 1</b-card-text>
                    <div>
                        <div class="query-diagram" style="position:relative" id="query-diagram-lemonade">
                            <template v-for="table in tables">
                                <db-table :table="table" :jsplumbInstance="jsplumbInstance" :key="table.id"
                                    class="db-table" />
                            </template>
                        </div>
                    </div>
                </b-tab>
                <b-tab title="Personalização">

                </b-tab>
                <b-tab title="Resultados">

                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>
<script>
    import DBTable from './DBTable';
    import jsplumb from 'jsplumb';

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    const standUrl = process.env.VUE_APP_STAND_URL;
    const authToken = process.env.AUTH_TOKEN;

    export default {
        components: {
            dbTable: DBTable
        },
        data() {
            return {
                jsplumbInstance: null,
                tables: [
                    {
                        id: 1, name: 'proposta',
                        left: 100, top: 100,
                        attributes: [
                            { name: 'id' },
                            { name: 'nome' },
                            { name: 'endereco' }
                        ]
                    },
                    {
                        id: 2, name: 'empresa',
                        left: 1, top: 1,
                        attributes: [
                            { name: 'id' },
                            { name: 'nome' },
                            { name: 'endereco' }
                        ]
                    },
                    {
                        id: 3, name: 'licitacao',
                        left: 200, top: 200,
                        attributes: [
                            { name: 'id' },
                            { name: 'nome' },
                            { name: 'endereco' }
                        ]
                    },
                ]
            }
        },
        beforeDestroy() {
            if (this.jsplumbInstance) {
                this.jsplumbInstance.reset();
            }
            this.jsplumbInstance = null;
        },
        mounted() {
            const instance = jsPlumb.getInstance({
                Endpoints: [['Dot', { radius: 2 }], ['Dot', { radius: 1 }]],
                EndpointHoverStyle: { fillStyle: 'orange' },
                HoverPaintStyle: { strokeStyle: 'blue' },

                PaintStyle: {
                    strokeWidth: 8,
                    stroke: '#222'
                },
                DragOptions: { cursor: "crosshair" },
                Endpoints: [["Dot", { radius: 7 }], ["Dot", { radius: 11 }]],
                EndpointStyles: [{ fill: "#225588" }, { fill: "#558822" }]
            });
            const container = document.getElementById('query-diagram-lemonade');
            instance.setContainer('query-diagram-lemonade');
            console.debug('Set Container', container)
            this.jsplumbInstance = instance;

        },
    }
</script>
<style scoped lang="scss">
    .query-diagram {
        border: 1px solid #aaa;
        height: 65vh;
        position: relative;
    }

    .db-table {
        position: absolute
    }
</style>