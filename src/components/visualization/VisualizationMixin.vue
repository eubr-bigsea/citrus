<template>
    <div> </div>
</template>
<script>
    import Plotly from './Plotly.vue';
    export default {
        components: {
            Plotly
        },
        props: {
            height: { type: Number, default: 450 },
            visualizationData: { type: Object },
            task: { type: Object },
        },
        data() {
            return {
                resizeListener: null,
            }
        },
    }
</script>