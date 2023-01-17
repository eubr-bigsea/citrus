<template>
    <div class="lemonade-toolbox">
        <VuePerfectScrollbar class="scroll-area"
                             :settings="settings">
            <div>
                <ul class="list-group">
                    <li class="list-group-item truncate sidebar-separator-title text-muted d-flex align-items-center menu-collapsed">
                        <input v-model="search"
                               type="text"
                               class="form-control"
                               :placeholder="$tc('actions.search')"
                               @input="searchOperation">
                    </li>
                    <li v-if="loading"
                        class="text-center m-2">
                        <font-awesome-icon icon="spinner"
                                           pulse
                                           class="fa-2x icon" />
                    </li>
                    <div v-if="search === ''"
                         class="menu">
                        <div v-for="(group, index) in groupedOperations"
                             :key="group.group"
                             :title="group.order"
                             class="unstyled"
                             :data-category="JSON.stringify(group)">
                            <!-- https://github.com/bootstrap-vue/bootstrap-vue/issues/5352 -->
                            <b-button v-b-toggle="'submenu' + index"
                                      draggable="false"
                                      data-parent="submenus"
                                      class="list-group-item truncate list-group-item-action flex-column align-items-start">
                                <span class="when-closed"><font-awesome-icon icon="fa fa-angle-right" /></span>
                                <span class="when-opened"><font-awesome-icon icon="fa fa-angle-down" /></span>
                                <strong>
                                    {{group.group}}
                                </strong>
                            </b-button>

                            <b-collapse :id="'submenu' + index"
                                        data-parent="submenus">
                                <div v-if="group.operations">
                                    <span v-for="op in group.operations"
                                          :key="op.operation.id"
                                          :title="op.operation.name">
                                        <a class="list-group-item truncate list-group-item-action text-dark OLE"
                                           draggable="true"
                                           :data-id="op.operation.id"
                                           href="javascript:void(0)"
                                           @dblclick.prevent="dbClickAddTask"
                                           @dragstart="startDrag"
                                           @dragend="stopDrag">
                                            <span :data-id="op.operation.id"
                                                  :title="op.operation.name"
                                                  v-text="op.operation.name" />
                                            <font-awesome-icon icon="fa fa-bars fa-1x"
                                                               class="float-right" />
                                        </a>
                                    </span>
                                </div>
                                <div v-else>
                                    <div v-for="(subGroup, index2) in group.subGroups"
                                         :key="subGroup.subGroup">
                                        <b-button v-b-toggle="`subsubmenu_${index}+${index2}`"
                                                  draggable="false"
                                                  class="list-group-item truncate list-group-item-action flex-column align-items-start">
                                            <font-awesome-icon icon="fa fa-angle-right"
                                                               class="when-closed " />
                                            <font-awesome-icon icon="fa fa-angle-down"
                                                               class="when-opened" />
                                            <span class="menu-collapsed pl-2">
                                                <strong> {{subGroup.subGroup}}</strong>
                                            </span>
                                        </b-button>
                                        <b-collapse v-for="op in subGroup.operations"
                                                    :id="`subsubmenu_${index}+${index2}`"
                                                    :key="op.operation.id"
                                                    :title="op.operation.name">
                                            <a class="list-group-item truncate list-group-item-action bg-white text-dark"
                                               draggable="true"
                                               :data-id="op.operation.id"
                                               href="#"
                                               @dblclick="dbClickAddTask"
                                               @dragstart="startDrag"
                                               @dragend="stopDrag">
                                                <span :data-id="op.operation.id"
                                                      class="ml-3"
                                                      v-text="op.operation.name" />
                                                <font-awesome-icon icon="fa fa-bars fa-1x"
                                                                   class="float-right" />
                                            </a>
                                        </b-collapse>
                                    </div>
                                </div>
                            </b-collapse>
                        </div>
                    </div>
                    <div v-else>
                        <span v-for="op in filteredOperations"
                              :key="op.id">
                            <b-link class="list-group-item truncate list-group-item-action flex-column align-items-start"
                                    draggable="true"
                                    :data-id="op.id"
                                    @dblclick="dbClickAddTask"
                                    @dragstart="startDrag"
                                    @dragend="stopDrag">
                                {{op.name}}
                                <font-awesome-icon icon="fa fa-bars fa-1x"
                                                   class="float-right" />
                            </b-link>
                        </span>
                    </div>
                </ul>
            </div>
            <!-- <div class="mr-2 mt-4">
                <ul class="list-group">
                    <li
                        class="list-group-item sidebar-separator-title d-flex align-items-center menu-collapsed bg-dark text-white">
                        {{ $t('titles.news') }}
                    </li>
                    <li class="list-group-item">
                        <span class="news">
                            <font-awesome-icon icon="fa fa-lightbulb text-warning" />
                            {{ $t('diagram.showProperties') }}</span>
                    </li>
                </ul>
            </div> -->
        </VuePerfectScrollbar>
        <div ref="opDrag"
             class="drag-template" />
    </div>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import ToolboxMixin from '../mixins/Toolbox.js';
import { debounce } from '../util.js';

const groupBy = function (xs, keySelector) {
    return xs.reduce(function (rv, x) {
        var key = keySelector(x);
        rv.set(key, rv.get(key) || []);
        rv.get(key).push(x);
        return rv;
    }, new Map());
};

export default {
    name: 'ToolboxComponent',
    components: {
        VuePerfectScrollbar
    },
    mixins: [ToolboxMixin],
    props: {
        loading: {
            type: Boolean,
            default: () => true
        },
        operations: {
            type: Array,
            default: () => {
                return [];
            }
        },
        selectedTask: {
            type: Object,
            default: () => {
                return {};
            }
        },
        workflow: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            filteredOperations: [],
            search: '',
            settings: {
                maxScrollbarLength: 100
            }
        };
    },
    computed: {
        groupedOperations() {
            const ops = this.operations
                .filter(op => op.enabled && op.type !== 'SHORTCUT')
                .map(op => {
                    const group = op.categories.find(cat => {
                        return cat.type === 'group';
                    }) || { name: '', order: 0, default_order: 0 };
                    const subGroup = op.categories.find(cat => {
                        return cat.type === 'subgroup';
                    }) || { name: '', order: 0, default_order: 0 };
                    return {
                        group: group.name,
                        operation: op,
                        subGroup: subGroup.name,
                        order: group.order,
                        default_order: group.default_order,
                        subGroupOrder: subGroup.order,
                        subGroupDefaultOrder: subGroup.default_order
                    };
                });
            ops.sort((a, b) => {
                if (a.order < b.order) return -1;
                if (a.order > b.order) return 1;
                if (a.default_order < b.default_order) return -1;
                if (a.default_order > b.default_order) return 1;
                const groupCompare = a.group.localeCompare(b.group);
                if (groupCompare != 0) return groupCompare;
                return a.subGroup ? a.subGroup.localeCompare(b.subGroup) : -1;
            });
            let grouped = [...groupBy(ops, x => x.group)].map(item => {
                if (item[1][0].subGroup === '') {
                    return {
                        group: item[0],
                        operations: item[1].sort((a, b) =>
                            a.operation.name.localeCompare(b.operation.name)
                        )
                    };
                } else {
                    return {
                        group: item[0],
                        subGroups: [...groupBy(item[1], x => x.subGroup)]
                            .map(subItem => {
                                return {
                                    group: item[0],
                                    subGroup: subItem[0],
                                    subGroupOrder: item[1][0].subGroupOrder,
                                    subGroupDefaultOrder: item[1][0].subGroupDefaultOrder,
                                    operations: subItem[1].sort((a, b) =>
                                        a.operation.name.localeCompare(b.operation.name)
                                    )
                                };
                            })
                            .sort((a, b) => {
                                if (a.subGroupOrder < b.subGroupOrder) return -1;
                                if (a.subGroupOrder > b.subGroupOrder) return 1;
                                if (a.subGroupDefaultOrder < b.subGroupDefaultOrder) return -1;
                                if (a.subGroupDefaultOrder > b.subGroupDefaultOrder) return 1;
                                return a.subGroup ? a.subGroup.localeCompare(b.subGroup) : -1;
                            })
                    };
                }
            });
            return grouped;
        },
        searcheableOperations() {
            let result = new Map();
            if (this.search) {
                this.operations.forEach(op => {
                    result[op.id] = op.name
                        .replace('ı́', 'i')
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase();
                });
            }
            return result;
        }
    },
    methods: {
        toggle() { },
        searchOperation: debounce(function () {
            let search = this.search
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase();
            let searcheable = this.searcheableOperations;

            this.filteredOperations = this.operations.filter(op => {
                return (
                    op.enabled &&
                        searcheable[op.id] &&
                        searcheable[op.id].indexOf(search) > -1
                );
            });
        }, 500),
        getOperationFromId(id) {
            let result = this.operations.find(v => {
                return v.id === parseInt(id);
            });
            return result;
        },
    }
};
</script>
