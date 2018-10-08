<template>
    <div>
        <LabelComponent :field="field"></LabelComponent>
        <div class="color-items">
            <div v-for="(opt, index) in pairOptionValueList" @click="doUpdate(opt)" 
                :key="index"
                class="color-item" :class="{active: value && opt && opt.background === value.background && opt.foreground == value.foreground}"
                :style="{background: opt.background}"></div>
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default {
        components: { LabelComponent },
        computed: {
            pairOptionValueList() {
                return JSON.parse(this.field.values);
            }
        }, 
        methods: {
            doUpdate(value) {
                this.$root.$emit('update-form-field-value', this.field, value)
            }
        },
        props: { value: '', field: {} },
    }
</script>
<style scoped>
    .color-items {
        overflow: hidden;
    }

    .color-item {
        float: left;
        height: 27px;
        margin-right: 0px;
        width: 27px;
        border: 1px solid #CCC;
    }

    .color-item:hover {
        border: 2px solid #777
    }
</style>