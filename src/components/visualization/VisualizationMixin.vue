<template>
    <div> </div>
</template>
<script>
    export default {
        components: {
        },
        props: {
            height: { type: Number, default: 450 },
            visualizationData: { type: Object, default: () => null },
            task: { type: Object , default: () => null},
        },
        data() {
            return {
                resizeListener: null,
            }
        },
    }
</script>
