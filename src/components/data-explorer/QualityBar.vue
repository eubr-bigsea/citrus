<template>
    <div class="clearfix border">
        <div class="bar ok" :style="{width: percentOk + '%'}" :title="`OK: ${percentOk}`"></div>
        <div class="bar bg-warning" :style="{width: percentMissing + '%'}" :title="`Missing: ${percentMissing}`"></div>
        <div class="bar bg-danger" :style="{width: percentNOk + '%'}" :title="`NOK: ${percentNOk}`"></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            percentOk: 80,
            percentMissing: 15,
            percentNOk: 5
        }
    },
}
</script>
<style scoped>
    .bar { 
        cursor: pointer;
        float: left;
        height: 8px;
    }  
    .bar.ok {
        background: #3D9970;
    }
    .bar.nok {
        background: #FF4136;
    }
    .bar.missing {
        background: #FFDC00;
    }
</style>