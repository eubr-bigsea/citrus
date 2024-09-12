<template>
    <div class="text-center"
         i
         style="width:100%;overflow:auto; display:flex">
        <markdown :text="visualizationData.data.text" />
    </div>
</template>
<script>
import MarkdownWidget from "../widgets/MarkdownComponent.vue";
import VisualizationMixin from "./VisualizationMixin.vue";
export default {
    name: 'MarkdownVisualization',
    components: {
        "markdown": MarkdownWidget,
    },
    mixins: [VisualizationMixin]
};
</script>
