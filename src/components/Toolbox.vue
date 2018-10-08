<template>
    <div id="sidebar-container" class="sidebar-expanded d-none d-md-block">
        <VuePerfectScrollbar class="scroll-area" :settings="settings">
            <div class="mr-2">
                <ul class="list-group">
                    <li class="list-group-item sidebar-separator-title text-muted d-flex align-items-center menu-collapsed">
                        <small>MAIN MENU</small>
                    </li>
                    <div v-for="(group, index) in groupedOperations" class="unstyled"  v-bind:key="index">
                        <b-link data-parent="submenus" v-b-toggle="'submenu' + index" class="bg-dark text-white list-group-item list-group-item-action flex-column align-items-start">
                            <span class="fa fa-layer-group"></span> {{group[0]}}
                        </b-link>
                        <b-collapse :id="'submenu' + index" data-parent="submenus">
                            <div v-for="(subgroup, index2) in group[1]" v-bind:key="index2">
                                <div v-if="subgroup[0] && subgroup[0].split('#')[1].length">
                                    <b-link v-b-toggle="'subsubmenu' + index2" class="bg-secondary text-white list-group-item list-group-item-action flex-column align-items-start">
                                        <span class="menu-collapsed">
                                            &nbsp;&nbsp;&nbsp;
                                            <span class="fa fa-layer-group"></span> {{ subgroup[0].split('#')[1] }}
                                        </span>
                                    </b-link>
                                    <b-collapse :id="'subsubmenu' + index2" v-for="op in subgroup[1]"  v-bind:key="op.id" :title="op.name">
                                        <a href="#" class="list-group-item list-group-item-action bg-white text-dark ml-30">
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span v-text="op.name"></span>
                                        </a>
                                    </b-collapse>
                                </div>
                                <div v-else>
                                    <span v-for="op in subgroup[1]" v-bind:key="op.id"  :title="op.name">
                                        <a href="#" class="list-group-item list-group-item-action text-dark">
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <span v-text="op.name" :title="op.name"></span>
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </b-collapse>
                    </div>
                </ul>
            </div>
        </VuePerfectScrollbar>
    </div>
</template>
<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    const groupBy = function (xs, keySelector) {
        return xs.reduce(function (rv, x) {
            var key = keySelector(x);
            rv.set(key, rv.get(key) || []);
            rv.get(key).push(x);
            return rv;
        }, new Map());
    };
    export default {
        name: 'Toolbox',
        components: {
            VuePerfectScrollbar
        },
        data() {
            return {
                filtered: false,
                settings: {
                    maxScrollbarLength: 100
                }
            }
        },
        props: {
            operations: { type: Array, default: [] }
        },
        computed: {
            groupedOperations() {
                let g = [...groupBy(this.operations, (op) => {
                    let groups = op.categories.filter((cat) => {
                        return cat.type === 'group';
                    })
                    let subGroups = op.categories.filter((cat) => {
                        return cat.type === 'subgroup';
                    })
                    return (groups.length ? groups[0].name : '') + "#" + (subGroups.length ? subGroups[0].name : '');
                })];
                g.sort((a, b) => a[0].localeCompare(b[0]));

                return [...groupBy(g, (x) => x[0].split('#')[0])];
            },
        },
        methods: {
            toggle(e) {
                debugger
                e.target.nextSibling.removeClass('collapse')
            }
        }
    }
</script>
<style scoped lang="scss">
    .scroll-area {
        width: 100%;
        height: 80vh;
    }
    .list-group {
        font-size: .75rem
    }
    .list-group-item {
        width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>