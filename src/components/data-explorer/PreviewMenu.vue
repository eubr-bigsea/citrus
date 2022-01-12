<template>
    <div>
        <div class="border preview-menu">
            <b-nav v-if="menus">
                <b-nav-item-dropdown v-for="menu in menus" :key="menu.menu.id" toggle-class="nav-link-custom"
                    :disabled="'always' !== menu.enableCondition && selected.label === undefined">
                    <template slot="button-content">
                        <span :class="menu.icon"></span> {{menu.menu.name}}
                    </template>
                    <template v-for="op in menu.operations">
                        <template
                            v-if="op.css_class === 'separator' || op.css_class === '' || op.css_class.includes(selected.field.type)">
                            <b-dropdown-item @click="trigger('menu', op)">
                                <span :class="op.icon"></span> {{op.name}}
                            </b-dropdown-item>
                            <b-dropdown-item v-if="op.css_class.includes('separator')" class="ctx-divider">
                            </b-dropdown-item>
                        </template>
                    </template>
                </b-nav-item-dropdown>
            </b-nav>
        </div>
    </div>
</template>
<script>
    /*
     * Menu for Data Explorer
     */
    export default {
        props: {
            selected: { type: Object, default: () => ({}) },
            menus: null
        },
        methods: {
            trigger(action, ...params) {
                this.$emit('select', { action, params, 'selected': this.selected })
            }
        }
    }
</script>
<style scoped>
    .preview-menu>>>.nav-pills a.dropdown-toggle {
        border-radius: 0 !important;
        padding: 1px inherit;
        font-size: 10pt;
    }

    .preview-menu>>>li {
        font-size: 10pt;
        padding: 1px inherit;
    }

    .preview-menu>>>.dropdown-menu li {
        font-size: 10pt;
        padding: 0px;
        margin: 0px;
    }

    .preview-menu>>>.dropdown-menu li a {
        padding: 3px 24px;
    }

    .preview-menu>>>li hr {
        padding: 0;
        margin: 0;
    }

    .preview-menu {
        display: flex;
        justify-content: space-between;
    }
</style>