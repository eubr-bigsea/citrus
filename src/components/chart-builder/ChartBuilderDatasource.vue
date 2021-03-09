<template>
    <div class="chart-builder-datasource">
        <draggable v-model="columnsList" :group="{name: 'chart', pull: 'clone'}" @start="drag=true" @end="drag=false">
            <chart-builder-column-item v-for="column in columnsList" v-bind:key="column.name" :column="column"></chart-builder-column-item>
        </draggable>
    </div>
</template>
<script>
  import draggable from 'vuedraggable'
  import ChartBuilderColumnItem from './ChartBuilderColumnItem';

  export default {
    components: {
        draggable,
        ChartBuilderColumnItem
    },
    props: {
        columns: { type: Array, default: () => [] }
    },
    data() {
      return {
          columnsList: this.columns
      }
    },
    computed: {
        
    },
    methods: {
    }
  }
  </script>
  <style scoped lang="scss">
  </style>
  