<template>
    <div ref="visualItem" class="item node noselect" :style="{left: item.left + 'px', top: item.top + 'px'}"
        :id="`lemonade-${item.type}-${item.id}`" @click="handleClick">
        <template v-if="item">
            <div v-if="item.entity" :class="`item-icon item-${item.icon}`">
                <span v-html="item.entity" style="font-size:20pt" />
            </div>
            <div v-else :class="`item-icon item-${item.icon}`">
                <font-awesome-icon :icon="'fa fa-' + (item.icon || 'database')" size="3x" fixed-width />
            </div>
            <div class="name">
                <span>{{item.name}}</span>
            </div>
        </template>
    </div>
</template>
<script>
    import { ref, /*onBeforeUnmount, onMounted*/ } from 'vue';

    export default {
        props: {
            draggable: { default: true, type: Boolean },
            jsplumbInstance: { default: null, type: Object },
            item: { default: () => null, type: Object },
        },
        setup(props, {emit, expose}) {
            const visualItem = ref(null);

            const addClass = (className) => {
                visualItem.value.classList.add(className);
            }
            const removeClass = (className) => {
                visualItem.value.classList.remove(className);
            }
            const handleClick = () => {
                emit('click', {addClass, removeClass});
            }
            expose({addClass, removeClass});
            return {
                visualItem,
                handleClick,
                addClass,
                removeClass
            }
        },
        
        xwatch: {
            jsplumbInstance(instance) {
                //console.debug('item', instance)
                if (instance !== null) {
                    //console.debug('item ' + this.item.name)
                    const self = this;
                    if (self.draggable && instance && instance.addEndpoint) {
                        /*
                        const elem = self.$refs.item;
                        instance.draggable(elem, {
                            lineWidth: 3,
                            containment: "parent",
                            grid: [1, 1],
                            drag() {
                                self.item.left = elem.offsetLeft;
                                self.item.top = elem.offsetTop;
                            },
                            stop() {
                                //self.$root.$emit('onset-isDirty', true);
                            }
                        });
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
                        /*
                        const options2 = {
                            anchor: "Continuous",
                            paintStyle: {
                                fill: "red", radius: 8, fillStyle: "red",
                            },
                            allowLoopback: false,
                            //connectorStyle: { lineWidth: 1, strokeStyle: 'red', stroke:5 },
                            xstroke: 5,
                            xstrokeStyle: "blue", lineWidth: 10, dashstyle: '3 3',
                            connectorPaintStyle: { stroke: "blue", strokeWidth: 10 }

                        }*/
                        //instance.makeSource(this.$refs.item, options2);
                        //instance.makeTarget(this.$refs.item, options2);


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
    .item {
        padding-top: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;

        cursor: pointer;
        font-size: 10px;
        position: absolute;
        z-index: 11;
        overflow: hidden;
        min-width: 40px;
        min-height: 90px;
        max-height: 90px;
        width: 90px;
        overflow: hidden;
        xborder: 1px dotted #ccc;
    }

    .item:hover {
        max-height: inherit;
    }

    .item.active {
        border: 1px dashed #222;
    }

    .item>>>.item-icon {
        background-color: var(--color-nav);
        border-radius: 40px;
        min-width: 50px;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        /*color: var(--forecolor-nav);*/
    }

    .item>>>.item-icon.item-database {
        background-color: green;
    }

    .item>>>.item-icon.item-check-square {
        background-color: goldenrod;
    }

    .item>>>.item-icon.item-robot {
        background-color: orange;
    }

    .item>>>.item-icon.item-table {
        background-color: blueviolet;
    }

    .item>>>.item-icon.item-project-diagram {
        background-color: red;
    }

    .item>>>.item-icon.item-chart-line {
        background-color: blue;
    }

    .item>>>.item-icon.item-server {
        background-color: black;
    }

    .item>>>.item-icon.item-python {
        background-color: white;
        border: 1px solid #aaa;
    }

    .item .name {
        margin-top: 5px;
        color: #222;
        cursor: move;
        font-size: 10px;

        display: flex;
        align-items: left;
        max-width: 100px;
        line-height: 16px;
        /*max-height: 30px;*/
        text-align: center;
    }

    .item .jtk-draggable {
        min-width: 100px;
        border-radius: 14px;
    }
</style>