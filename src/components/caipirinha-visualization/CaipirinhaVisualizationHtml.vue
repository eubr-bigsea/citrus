<template>
  <div v-html="html"></div>
</template>

<script>
export default {
  name: "CaipirinhaVisualizationHtml",
  props: {
     "visualizationData": {type: Object, default: () => null}
  },
  data: function() {
    return {
      html: this.visualizationData.html
    }
  }
};
</script>
