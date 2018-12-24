<template>
  <div v-html="html"></div>
</template>

<script>
export default {
  name: "caipirinha-visualization-html",
  props: ["visualizationData"],
  data: function() {
    return {
      html: this.visualizationData.html
    }
  }
};
</script>