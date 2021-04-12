<template>
    <div class="chart-builder-axis">
        <div>

            <div class="axis-box" v-if="axis.x.visible">
                <span>{{ axis.x.label }}</span>
                <draggable class="axis-box-draggable" v-model="axis.x.data" @change="axisChanged" :group="{name: 'chart'}" @start="drag=true" @end="drag=false">
                    <chart-builder-column-item v-for="item in axis.x.data" :key="item.name" v-bind:column="item" :remove="{axis: 'x', data: item }" />
                </draggable>
            </div>

            <div class="axis-box" v-if="axis.y.visible">
                <span>{{ axis.y.label }}</span>
                <draggable class="axis-box-draggable" v-model="axis.y.data" @change="axisChanged" :group="{name: 'chart'}" @start="drag=true" @end="drag=false">
                    <chart-builder-column-item v-for="item in axis.y.data" :key="item.name" v-bind:column="item" :remove="{axis: 'y', data: item }" />
                </draggable>
            </div>

            <div class="axis-box" v-if="axis.z.visible">
                <span>{{ axis.z.label }}</span>
                <draggable class="axis-box-draggable" v-model="axis.z.data" @change="axisChanged" :group="{name: 'chart'}" @start="drag=true" @end="drag=false">
                    <chart-builder-column-item v-for="item in axis.z.data" :key="item.name" v-bind:column="item" :remove="{axis: 'z', data: item }" />
                </draggable>
            </div>

            
        </div>
    </div>
</template>
<script>

  import ChartBuilderColumnItem from './ChartBuilderColumnItem.vue';
  import draggable from 'vuedraggable'

  export default {
    components: {
        ChartBuilderColumnItem,
        draggable
    },
    props: {},
    data() {
    	return {
            axis: {
                x: {
                    label: "Eixo X",
                    visible: true,
                    limit: 1,
                    data: []
                },
                y: {
                    label: "Eixo Y",
                    visible: true,
                    limit: Infinity,
                    data: []
                },
                z: {
                    label: "Eixo Z",
                    visible: true,
                    limit: Infinity,
                    data: []
                }
            }
    	}
    },
    watch: {
        axis: {
            handler: 'changeData',
            deep: true
        }
    },
    mounted() {
        this.$root.$on('chartBuilderUpdateChart', this.updateChart)
        this.$root.$on('chartBuilderRemoveAxisItem', this.removeAxisItem)
    },
    beforeDestroy() {
        this.$root.$off('chartBuilderUpdateChart');
        this.$root.$off('chartBuilderRemoveAxisItem');
    },
    computed: {
    },
    methods: {
        resetAxis() {
            this.axis.x.data = [];
            this.axis.y.data = [];
            this.axis.z.data = [];
        },

        changeData() {
            this.$root.$emit('chartBuilderUpdateChart', {
                type: "axis", 
                value: this.axis
            });
        },

        axisChanged() {
            this.checkLimits();
        },

        checkLimits() {
            this.checkLimitsByAxis('x');
            this.checkLimitsByAxis('y');
            this.checkLimitsByAxis('z');
        },

        checkLimitsByAxis(axis) {
            if(this.axis[axis].limit)
            this.axis[axis].data = this.axis[axis].data.slice(0, this.axis[axis].limit);
        },

        removeAxisItem(remove) {
            let i = this.axis[remove.axis].data.findIndex(v=>v.name==remove.data.name);
            this.axis[remove.axis].data.splice(i, 1);
        },

        updateChart(data) {
            if(data.type=="type") {
                this.resetAxis();
                switch(data.value) {
                    case "pie":
                        this.axis.x.label = "Rótulos";
                        this.axis.x.visible = true;
                        this.axis.x.limit = 1;
                        
                        this.axis.y.label = "Valores";
                        this.axis.y.visible = true;
                        this.axis.y.limit = 1;
                        
                        this.axis.z.visible = false;

                        break;

                    case "bubble":
                        this.axis.x.label = "Eixo X";
                        this.axis.x.visible = true;
                        this.axis.x.limit = 1;
                        
                        this.axis.y.label = "Eixo Y";
                        this.axis.y.visible = true;
                        this.axis.y.limit = 1;
                        
                        this.axis.z.label = "Tamanho";
                        this.axis.z.visible = true;
                        this.axis.z.limit = 1;

                        break;

                    case "scatter":
                        this.axis.x.label = "Eixo X";
                        this.axis.x.visible = true;
                        this.axis.x.limit = 1;
                        
                        this.axis.y.label = "Eixo Y";
                        this.axis.y.visible = true;
                        this.axis.y.limit = 1;
                        
                        this.axis.z.label = "Rótulos";
                        this.axis.z.visible = true;
                        this.axis.z.limit = 1;
                        break;


                    default:
                        this.axis.x.label = "Eixo X";
                        this.axis.x.visible = true;
                        this.axis.x.limit = 1;
                        
                        this.axis.y.label = "Eixo Y";
                        this.axis.y.visible = true;
                        this.axis.y.limit = Infinity;
                        
                        this.axis.z.visible = false;

                        break;
                }
            }
        }
    }
  }
  </script>
  <style scoped lang="scss">
      .axis-box {
        background-color: #fff;
        border: 1px solid rgba(#000, .08);
        padding: .25rem;
        margin: .5rem 0;

        display: flex;
        flex-direction: row;
        align-items: center;

        .axis-box-draggable {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .chart-builder-column-item {
            margin: .25rem;
            padding: .5rem;
            cursor: inherit;
        }

        &:first-child {
            margin-top: 0;
        }

        span {
            white-space: nowrap;
            padding: .75rem;
            font-weight: bold;
            color: rgba(#000, .35);
        }
      }
  </style>
  