<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <div class="color-items">
            <div v-for="(opt, index) in pairOptionValueList" @click="doUpdate(opt)"
             :key="index" class="color-item" :class="{active: value && opt && opt.background === value.background && opt.foreground == value.foreground && opt.foreground == value.foreground}"
                :style="{background: opt.background}" :title="opt.background">
            </div>
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue';
    import Widget from '../../mixins/Widget.js';
    export default {
        mixins: [Widget],
        components: { LabelComponent },
        computed: {
            pairOptionValueList() {
                if (typeof this.field.values === 'string' || this.field.values instanceof String) {
                    return JSON.parse(this.field.values);
                } else {
                    return this.field.values;
                }
            }
        },
        methods: {
            doUpdate(value) {
                this.triggerUpdateEvent(this.message, this.field, value)
            }
        },
        props: {
            value: '', field: {},
            message: {
                type: String,
                default: 'update-form-field-value'
            }
        },
    }
</script>
<style scoped>
    .color-items {
        overflow: hidden;
    }

    .color-item {
        float: left;
        height: 25px;
        margin-right: 0px;
        width: 25px;
        border: 1px solid #bbb;
    }

    .color-item:hover {
        border: 2px solid #444
    }
    .active {
        border: 2px double #111;
    }
</style>
