<template>
    <div>
        <TreeItem :item="tree" :opened="opened" :handle-click="selected" :bus="bus"/>
    </div>
</template>
<script>
    import Vue from "vue";
    import TreeItem from './TreeItem';
    export default {
        name: 'TreeComponent',
        components: { TreeItem },
        props: {
            tree: { type: Object, default: () => { } },
            opened: {default: ()=> false, type: Boolean},
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
