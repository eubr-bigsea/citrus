<template>
    <div class="lemonade-toolbox">
        <div>
            <ul class="list-group">
                <li class="list-group-item truncate sidebar-separator-title text-muted d-flex align-items-center menu-collapsed">
                    <input v-model="search"
                           type="text"
                           class="form-control"
                           :placeholder="$t('actions.search')"
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
                                                           class="float-end" />
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
                                        <span class="menu-collapsed ps-2">
                                            <strong> {{subGroup.subGroup}}</strong>
                                        </span>
                                    </b-button>
                                    <b-collapse :id="`subsubmenu_${index}+${index2}`">
                                        <a v-for="op in subGroup.operations"
                                           :key="op.operation.id"
                                           :title="op.operation.name"
                                           class="list-group-item truncate list-group-item-action bg-white text-dark"
                                           draggable="true"
                                           :data-id="op.operation.id"
                                           href="#"
                                           @dblclick="dbClickAddTask"
                                           @dragstart="startDrag"
                                           @dragend="stopDrag">
                                            <span :data-id="op.operation.id"
                                                  class="ms-3"
                                                  v-text="op.operation.name" />
                                            <font-awesome-icon icon="fa fa-bars fa-1x"
                                                               class="float-end" />
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
                                               class="float-end" />
                        </b-link>
                    </span>
                </div>
            </ul>
        </div>
        <!-- <div class="me-2 mt-4">
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
        <div ref="opDrag"
             class="drag-template" />
    </div>
</template>
<script>
import ToolboxMixin from '../mixins/Toolbox.js';

export default {
    name: 'ToolboxComponent',

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
        };
    },
    computed: {
        groupedOperations() {
            const ops = this.operations
                .filter(op => op.enabled && op.type !== 'SHORTCUT' && op.name != null)
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
            let grouped = Object.entries(Object.groupBy(ops, x => x.group)).map(([group, items]) => {
                if (items[0].subGroup === '') {
                    return {
                        group,
                        operations: items.sort((a, b) =>
                            a.operation.name.localeCompare(b.operation.name)
                        )
                    };
                } else {
                    return {
                        group,
                        subGroups: Object.entries(Object.groupBy(items, x => x.subGroup))
                            .map(([subGroup, subItems]) => {
                                return {
                                    group,
                                    subGroup,
                                    subGroupOrder: items[0].subGroupOrder,
                                    subGroupDefaultOrder: items[0].subGroupDefaultOrder,
                                    operations: subItems.sort((a, b) =>
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
        }
    },
    methods: {
        toggle() { }
    }
};
</script>
