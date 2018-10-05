<template>
    <span class="label">
        <span :class="{'font-weight-bold': field.required}">{{field.label}}</span>
        <!--span class="fa fa-asterisk" v-show="field.required"></span -->
        <span class="fa fa-question-circle float-right" :title="field.help"></span>
    </span>
</template>

<script>
    export default {
        props: {
            field: {}
        }
    }
</script>
<style scoped>
</style>