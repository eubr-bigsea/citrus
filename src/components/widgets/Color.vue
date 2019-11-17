<template>
    <div>
        <label-component :field="field" :value="value" />
        <div class="color-items" :class="{ disabled: readonly }">
            <div v-for="(opt, index) in pairOptionValueList" @click="doUpdate(opt)" :key="index" class="color-item"
                :class="{active: value && opt && opt.background === value.background && opt.foreground == value.foreground && opt.foreground == value.foreground}"
                :style="{background: opt.background}">
            </div>
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default {
        components: { 'label-component': LabelComponent },
        computed: {
            pairOptionValueList() {
                return JSON.parse(this.field.values);
            }
        },
        methods: {
            doUpdate(value) {
                if (!readonly) {
                    this.$root.$emit(this.message, this.field, value)
                }
            }
        },
        props: {
            value: '', field: {},
            message: {
                type: String,
                default: 'update-form-field-value'
            },
            readonly: {
                type: Boolean,
                default: true
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
        height: 27px;
        margin-right: 0px;
        width: 27px;
        border: 1px solid #CCC;
    }

    .color-item:hover {
        border: 2px solid #777;
        cursor: pointer;
    }

    .active {
        border: 2px double #111;
    }

    .disabled .color-item:hover {
        border: 1px solid #CCC;
        cursor: default;
    }
</style>