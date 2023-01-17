<template>
    <div ref="table"
         class="table node noselect"
         :style="{left: table.left + 'px', top: table.top + 'px'}">
        <div class="name">
            <div class="delete"
                 title="Click to delete">
                <i class="fa fa-trash" />
            </div>
            <span>{{table.name}}</span>
            {{table.left}} {{table.top}}
        </div>
        <ul ref="attributes"
            class="table-columns">
            <template v-for="attr in table.attributes">
                <table-attribute :key="attr.name"
                                 :jsplumb-instance="jsplumbInstance"
                                 :attribute="attr" />
            </template>
        </ul>
    </div>
</template>
<script>
import TableAttribute from './TableAttribute.vue';
export default {
    components: {
        tableAttribute: TableAttribute,
    },
    props: {
        draggable: { default: true, type: Boolean},
        jsplumbInstance: { default: null, type: Object },
        table: {default: ()=> null, type: Object},
    },
    watch: {
        jsplumbInstance(instance) {
            console.debug('Table', instance)
            if (instance !== null) {
                console.debug('Table ' + this.table.name)
                const self = this;
                if (self.draggable && instance && instance.addEndpoint) {
                    const elem = self.$refs.table;
                    instance.draggable(elem, {
                        lineWidth: 3,
                        containment: "parent",
                        grid: [1, 1],
                        drag() {
                            self.table.left = elem.offsetLeft;
                            self.table.top = elem.offsetTop;
                        },
                        stop() {
                            //self.$root.$emit('onset-isDirty', true);
                        }
                    });
                    /*
                        const endpointOptions = {
                            isSource: true,
                            isTarget: true,
                            endpoint: ["Dot", { radius: 5 }],
                            style: { fillStyle: 'blue' },
                            maxConnections: -1,
                            connector: "Straight",
                            connectorStyle: { lineWidth: 5, strokeStyle: 'blue' },
                            //scope: "blueline",
                            dropOptions: {
                                drop: function (e, ui) {
                                    alert('drop!');
                                }
                            }
                        };*/
                    /*
                        const endpointOptions = {
                            isSource: true,
                            isTarget: true,
                            connector: 'Flowchart',
                            maxConnections: -1,
                            endpoint: ["Dot", { radius: 5 }],
                        }
                        */
                    //instance.addEndpoint(elem, { anchor: "Top" }, endpointOptions);
                    const attributesElem = this.$refs.attributes;
                    const options2 = {
                        anchor: "Continuous",
                        paintStyle: {
                            fill: "red", radius: 8, fillStyle: "red",
                        },
                        allowLoopback:false,
                        //connectorStyle: { lineWidth: 1, strokeStyle: 'red', stroke:5 },
                        xstroke: 5,
                        xstrokeStyle: "blue", lineWidth: 10, dashstyle: '3 3',
                        connectorPaintStyle:{ stroke:"blue", strokeWidth:10 }

                    }
                    instance.makeSource(attributesElem, options2);
                    instance.makeTarget(attributesElem, options2);


                }
            }
        }
    }
}
</script>
<style scoped>
    /* ----------------------------------------------------------------------------------------------------- */
    /* --- Node common -------------------------------------------------------------------------------- */
    /* ----------------------------------------------------------------------------------------------------- */
    .table {
        background-color: #3E7E9C;
        border-radius: 5px;
        cursor: pointer;
        font-size: 10px;
        position: absolute;
        z-index: 11;
        overflow: hidden;
        min-width: 60px;
        min-height: 20px;
        width: auto;
        border: 1px solid #ccc;
        flex-direction: column;
    }

    .table .name,
    .table .jtk-draggable {
        background-color: #3E7E9C;
        color: #f7ebca;
        cursor: move;
        font-size: 13px;

        padding: 6px;
        display: flex;
        align-items: left;
    }


    .table .jtk-draggable {
        min-width: 100px;
        border-radius: 14px;
    }

    .table .name span {
        cursor: pointer;
        margin-left: 5px;
    }

    .table .name .buttons {
        display: flex;
        align-items: left;
        cursor: pointer;
    }

    /* ----------------------------------------------------------------------------------------------------- */
    /* --- Table nodes -------------------------------------------------------------------------------- */
    /* ----------------------------------------------------------------------------------------------------- */


    .table {
        margin-bottom: 0;
        min-width: 200px;
        align-items: stretch;
    }

    .table-columns {
        display: flex;
        flex-direction: column;
        margin: 0 0 2px 0;
        overflow: auto;
        padding: 2px;
        position: relative;
    }

    .table-columns li {
        background: #fff;
        margin: 0 0 1px 0;
        padding: 1px 6px;
        display: flex;
        align-items: center;
    }
</style>
