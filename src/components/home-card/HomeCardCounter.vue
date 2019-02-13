<template>
    <span class="float-right" title="Total">
        <animated-number 
            :value="value" 
            :formatValue="formatValue" 
            :duration="4000"
            :easing="'easeOutCirc'"
        />
    </span>
</template>

<style scoped>

span {
    background-image: linear-gradient(-56.47deg,#ff4b95,#ffca26);
    color: white;
    padding: 5px;
    font-family: monospace;
    border-radius: 5px;
}
</style>

<script>

import AnimatedNumber from "animated-number-vue";
import Humanize from 'humanize-plus';

export default {
    name: 'home-card-counter',
    props: ['value'],
    components: {
        AnimatedNumber
    },
    methods: {
        formatValue(value) {
            return Humanize.compactInteger(value)
        }
    }
}
</script>
