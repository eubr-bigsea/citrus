<template>
    <div>
        
    </div>
</template>
<script>
    import Plotly from './Plotly.vue';
    export default {
        components: {
            Plotly
        },
        props: {
            visualizationData: {}, 
            task: {},
            height: {default: 1450}
        },
        data(){
            return {
                resizeListener: null,
            }
        },
    }
</script>
