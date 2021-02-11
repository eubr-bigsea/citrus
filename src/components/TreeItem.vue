<template>
    <ul class="folders">
        <li>
            <div v-if=" item.name" :class="{folder: isFolder, 'tree-selected': item.selected}" @click="toggle(item)">
                <span v-if="isFolder">
                    <font-awesome-icon :icon="isOpen ? ['fa', 'chevron-down'] : ['fa', 'chevron-right']" size="xs" />
                </span>
                {{ item.name }}
            </div>
            <ul v-show="isOpen" v-if="isFolder" class="folders">
                <tree-item class="item" v-for="(child, index) in item.children" :key="index" :item="child"
                    :opened="child.opened" @make-folder="$emit('make-folder', $event)" :handleClick="handleClick"
                    :bus="bus" />
            </ul>
        </li>
    </ul>
</template>
<script>
    export default {
        name: "tree-item",
        props: {
            bus: { type: Object, default: {} },
            item: { type: Object, default: {} },
            opened: false,
            handleClick: { type: Function },
            selected: false,
        },
        data() {
            return {
                isOpen: this.opened
            };
        },
        computed: {
            isFolder() {
                return this.item.children && this.item.children.length;
            }
        },
        mounted() {
            this.bus.$on('unselect', this.unselect);
        },
        beforeDestroy() {
            this.bus.$off('unselect');
        },
        methods: {
            toggle(item) {
                this.bus.$emit('unselect');
                item.selected = true,
                    this.handleClick(item);
                if (this.isFolder) {
                    this.isOpen = !this.isOpen;
                }
            },
            unselect() {
                this.item.selected = false;
            },
        }
    }
</script>
<style scoped>
    ul.folders {
        padding: 0 0 0 10px;
        list-style-type: none;
        cursor: pointer;
    }

    .folder {
        font-weight: normal;
    }

    .folders .fa-chevron-down,
    .fa-chevron-right {
        display: inline-block;
        min-width: 12px
    }
</style>