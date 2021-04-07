<template>
    <div class="chart-builder-axis">
        <div>
            <div class="axis-box">
                <span>Eixo Y</span>
                <draggable class="axis-box-draggable" v-model="columnsList" :group="{name: 'chart'}" @start="drag=true" @end="drag=false">
                    <chart-builder-column-item v-bind:column="{name: 'age', label: 'Idade', type: 'int'}" />
                    <chart-builder-column-item v-bind:column="{name: 'age', label: 'Idade 2', type: 'int'}" />
                </draggable>
            </div>
            <div class="axis-box">
                <span>Eixo X</span>
                <draggable class="axis-box-draggable" v-model="columnsList" :group="{name: 'chart'}" @start="drag=true" @end="drag=false">
                    <chart-builder-column-item v-bind:column="{name: 'age', label: 'Idade', type: 'int'}" />
                    <chart-builder-column-item v-bind:column="{name: 'age', label: 'Idade 2', type: 'int'}" />
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
    	}
    },
    computed: {
    },
    methods: {
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
  