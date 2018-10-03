<template>
    <VuePerfectScrollbar>
        <div class="props">
            <h4>{{$tc('titles.property', 2)}}</h4>
        </div>
    </VuePerfectScrollbar>
</template>
<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    export default {
        name: 'PropertyWindow',
        components: {
            VuePerfectScrollbar
        },
    }
</script>
<style scoped>
    .props {
        background: #fff;
        border: 1px solid #aaa;
        padding: 10px 15px;
        width: 350px;
        height: calc(82vh + 2px)
    }
</style>