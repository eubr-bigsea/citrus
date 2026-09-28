<template>
    <div class="text-center"
         style="width:100%;overflow:auto; display:flex">
        <iframe :src="visualizationData.data.link"
                frameBorder="0"
                style="overflow:hidden;height:100%;width:100%;position: absolute;"
                height="100%"
                width="100%" />
    </div>
</template>
<script>
import VisualizationMixin from "./VisualizationMixin.vue";
export default {
    mixins: [VisualizationMixin],
};
</script>
