<template>
    <ul class="folders">
        <li>
            <div :class="{folder: isFolder}" @click="toggle" @dblclick="makeFolder">
                <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
                {{ item.name }}
            </div>
            <ul v-show="isOpen" v-if="isFolder" class="folders">
                <tree-item class="item" v-for="(child, index) in item.children" :key="index" :item="child"
                    :opened="child.opened" @make-folder="$emit('make-folder', $event)"
                    @add-item="$emit('add-item', $event)"></tree-item>
            </ul>
        </li>
    </ul>
</template>
<script>
    export default {
        name: "tree-item",
        props: {
            item: Object,
            opened: false,
        },
        data: function () {
            return {
                isOpen: this.opened
            };
        },
        computed: {
            isFolder: function () {
                return this.item.children && this.item.children.length;
            }
        },
        methods: {
            toggle: function () {
                if (this.isFolder) {
                    this.isOpen = !this.isOpen;
                }
            },
            makeFolder: function () {
                if (!this.isFolder) {
                    this.$emit("make-folder", this.item);
                    this.isOpen = true;
                }
            }
        }
    }
</script>
<style scoped>
    ul.folders {
        padding: 0 0 0 15px;
        list-style-type: none;
        cursor: pointer;
    }

    .folder {
        font-weight: bold;
    }
</style>