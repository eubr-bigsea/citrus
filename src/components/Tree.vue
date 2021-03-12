<template>
    <div>
        <TreeItem :item="tree" :opened="opened" :handle-click="selected" :bus="bus"/>
    </div>
</template>
<script>
    import Vue from "vue";
    import TreeItem from './TreeItem';
    export default {
        components: { TreeItem },
        props: {
            tree: { type: Object, default: () => { } },
            opened: false,
        },
        data(){
            return {bus: new Vue()}
        },
        methods: {
            selected(item) {
                this.$emit('selected', item)
            }
        }

    }
</script>