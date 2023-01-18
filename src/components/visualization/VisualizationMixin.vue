<template>
    <div />
</template>
<script>
import Plotly from './Plotly.vue';
export default {
    components: {
        // eslint-disable-next-line vue/no-unused-components
        Plotly,
    },
    props: {
        height: { type: Number, default: 450 },
        visualizationData: { type: Object, default: () => null },
        task: { type: Object , default: () => null},
    },
    data() {
        return {
            resizeListener: null,
        };
    },
};
</script>
