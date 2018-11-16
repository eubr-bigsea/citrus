<template>
    <div id="sidebar-container" class="sidebar-expanded d-none d-md-block">
        <VuePerfectScrollbar class="scroll-area" :settings="settings">
            <div class="mr-2">
                <ul class="list-group">
                    <li class="bg-dark text-white list-group-item sidebar-separator-title d-flex align-items-center menu-collapsed">
                        {{$tc('common.operation', 2).toUpperCase()}}
                    </li>
                    <li class="list-group-item sidebar-separator-title text-muted d-flex align-items-center menu-collapsed">
                        <input @input="searchOperation" v-model="search" type="text" class="form-control" :placeholder="$tc('actions.search')" />
                    </li>
                    <div v-if="search === ''">
                        <div v-for="(group, index) in groupedOperations" :title="group.order" class="unstyled" v-bind:key="group.group" >
                            <b-link draggable="false" data-parent="submenus" v-b-toggle="'submenu' + index" class="bg-dark text-white list-group-item list-group-item-action flex-column align-items-start">
                                <span class="fa fa-layer-group"></span> {{group.group}}
                            </b-link>
                            
                            <b-collapse :id="'submenu' + index" data-parent="submenus">
                                 <div v-if="group.operations">
                                    <span v-for="op in group.operations" v-bind:key="op.operation.id" :title="op.operation.name">
                                        <a draggable="true" :data-id="op.operation.id" @dragstart="startDrag" @dragend="stopDrag" href="#" class="list-group-item list-group-item-action text-dark">
                                            <span v-text="op.operation.name" :title="op.operation.name"></span>
                                        </a>
                                    </span>
                                </div>
                                <div v-else>
                                    <div v-for="(subGroup, index2) in group.subGroups" v-bind:key="subGroup.subGroup">
                                        <b-link draggable="false" v-b-toggle="'subsubmenu' + index2" class="bg-secondary text-white list-group-item list-group-item-action flex-column align-items-start">
                                            <span class="menu-collapsed">
                                                <span class="fa fa-layer-group"></span> {{subGroup.subGroup }}
                                            </span>
                                        </b-link>
                                        <b-collapse :id="'subsubmenu' + index2" v-for="op in subGroup.operations" v-bind:key="op.operation.id" :title="op.operation.name">
                                            <a draggable="true" :data-id="op.operation.id" @dragstart="startDrag" @dragend="stopDrag" href="#" class="list-group-item list-group-item-action bg-white text-dark ml-30">
                                                <span v-text="op.operation.name"></span>
                                            </a>
                                        </b-collapse>
                                    </div>
                                </div>
                               
                            </b-collapse>
                        </div>
                    </div>
                    <div v-else>
                        <span v-for="op in filteredOperations" :key="op.id">
                            <b-link draggable="true" :data-id="op.id" @dragstart="startDrag" @dragend="stopDrag" class="list-group-item list-group-item-action flex-column align-items-start">
                                {{op.name}}
                            </b-link>
                        </span>
                    </div>
                </ul>
            </div>
        </VuePerfectScrollbar>
        <div ref="opDrag"></div>
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
                filteredOperations: [],
                search: '',
                settings: {
                    maxScrollbarLength: 100
                }
            }
        },
        props: {
            operations: { type: Array, default: []}
        },
        computed: {
            groupedOperations() {
                /*
                let g = [...groupBy(this.operations, (op) => {
                    let groups = op.categories.filter((cat) => {
                        return cat.type === 'group';
                    })
                    let subGroups = op.categories.filter((cat) => {
                        return cat.type === 'subgroup';
                    })
                    let result = {}
                    if (groups.length){
                        result = {order: groups[0].order, group: groups[0].name};
                        if (subGroups.length){
                            result['subGroup'] = subGroups[0].name;
                        } else {
                            result['subGroup'] = '';
                        }
                    }
                    return result;
                })];
                */
                
                const ops = this.operations.map((op) =>{
                    const group = op.categories.find((cat) => {
                        return cat.type === 'group';
                    }) || {name: '', order: 0}
                    const subGroup = op.categories.find((cat) => {
                        return cat.type === 'subgroup';
                    }) || {name: ''}
                    return {group: group.name, operation: op, subGroup: subGroup.name, order: group.order}
                });
                ops.sort((a, b) => {
                    if (a.order < b.order) return -1;
                    if (a.order > b.order) return 1;
                    if (a.default_order < b.default_order) return -1;
                    if (a.default_order > b.default_order) return 1;
                    const groupComapare = a.group.localeCompare(b.group)
                    if (groupComapare != 0) return groupComapare;
                    return a.subGroup.localeCompare(b.subGroup);
                });
                let grouped = [...groupBy(ops, (x) => x.group)].map((item) => {
                    if (item[1][0].subGroup === ''){
                        return {group: item[0], operations: item[1]};
                    } else {
                        return {group: item[0], 
                            subGroups: [...groupBy(item[1], (x) => x.subGroup)].map((subItem) => {
                                return {group: item[0], subGroup: subItem[0], operations: subItem[1]};
                            })
                        };
                    }
                });
                return grouped;
                /*
                console.debug(grouped)
                g.sort((a, b) => {
                    if (a[0].order < b[0].order) return -1;
                    if (a[0].order > b[0].order) return 1;
                    const groupComapare = a[0].group.localeCompare(b[0].group)
                    if (groupComapare != 0) return groupComapare;
                    return a[0].subGroup.localeCompare(b[0].subGroup);
                });
                const result = [...groupBy(g, (x) => x[0].group)];
                result.forEach(group => {
                    //group[1] = [...groupBy(group[1], (x) => x[0].subGroup)]
                    if (group[1][0][0].subGroup !== ''){
                        //console.debug(group[1] )
                    }
                });
                //console.debug(result)
                return result*/
            },
            searcheableOperations() {
                let self = this
                let result = new Map()
                if (this.search) {
                    this.operations.forEach(op => {
                        result[op.id] = op.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
                    });
                }
                return result
            }
        },
        methods: {
            startDrag(event) {
                ///event.target.classList.add('draggable');
                //var crt = ev.target.cloneNode(true);
                const target = event.target;
                let crt = this.$refs.opDrag;
                crt.innerHTML = target.innerHTML;
                //document.body.appendChild(crt);

                crt.classList.add('dragging');
                crt.classList.add('operation');
                crt.style.position = 'absolute';
                crt.style.left = '-1000px';
                //event.dataTransfer.setData("text", target.innerHTML);
                event.dataTransfer.setData("id", target.dataset.id);

                event.dataTransfer.setDragImage(crt, 0, 0);
            },
            stopDrag(event) {
                event.target.classList.remove('draggable');
            },
            toggle(e) {
                e.target.nextSibling.removeClass('collapse')
            },
            searchOperation: _.debounce(function () {
                let search = this.search.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
                let searcheable = this.searcheableOperations

                this.filteredOperations = this.operations.filter((op) => {
                    return searcheable[op.id].indexOf(search) > -1
                });
            }, 500)
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
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    [draggable="true"] {
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    .dragging {
        display: block;
        width: 120px;
        height: 50px;
        font-size: 8pt;
        background-color: #fff;
        border: 1px solid #222;
        font-family: Verdana, Tahoma, Geneva, sans-serif;
        text-align: center;
        transform: rotate(90deg);
    }
</style>