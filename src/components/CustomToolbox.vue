<template>
    <div class="lemonade-toolbox">
        <VuePerfectScrollbar class="scroll-area" :settings="settings">
            <div>
                <ul class="list-group">
                    <!-- <li
                        class="list-group-item truncate sidebar-separator-title text-muted d-flex align-items-center menu-collapsed">
                        <input v-model="search" type="text" class="form-control" :placeholder="$tc('actions.search')"
                            @input="searchOperation" />
                    </li> -->
                    <div>
                        <span v-for="item in items" :key="item.op.id + ':' + item.id">
                            <b-link
                                class="list-group-item truncate list-group-item-action flex-column align-items-start"
                                draggable="true" :data-id="item.op.id" :data-lookup-id="item.id" :data-name="item.name" :data-lookup-name="item.fieldName"
                                @dblclick="dbClickAddTask" @dragstart="startDrag2"
                                @dragend="stopDrag">
                                {{ item.name }}
                                <span class="fa fa-bars fa-1x float-right"></span>
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
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';
    import ToolboxMixin from '../mixins/Toolbox';
    import Notifier from '../mixins/Notifier';
    import axios from 'axios';

    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    const thornUrl = process.env.VUE_APP_THORN_URL;
    const standUrl = process.env.VUE_APP_STAND_URL;

    export default {
        mixins: [ToolboxMixin, Notifier],
        name: 'CustomToolbox',
        components: {
            VuePerfectScrollbar
        },
        props: {
            operations: {
                type: Array,
                default: () => { return []; }
            },
            selectedTask: {
                type: Object,
                default: () => { return {}; }
            },
            workflow: {
                type: Object,
                default: () => { return {}; }
            }
        },
        data() {
            return {
                filteredOperations: [],
                search: '',
                settings: { maxScrollbarLength: 100 },
                expandedOperations: [],
                items: [],
                alreadyLoaded: new Set(),
            };
        },
        watch: {
            operations(v) {
                const self = this;
                this.expandedOperations = this.operations.filter(op => op.type === 'SHORTCUT');
                if (this.expandedOperations.length) {
                    this.expandedOperations = this.expandedOperations.filter(
                        op => {
                            const f = op.forms.find(f => f.category === 'execution');
                            return f && op.enabled && op.type === 'SHORTCUT' &&
                                f.fields.find(field => field.values_url !== null);
                        }
                    );
                }
                this.expandedOperations.forEach(op => {
                    const f = op.forms.find(f => f.category === 'execution');
                    if (!this.alreadyLoaded.has(op.id) && f) {
                        const field = f.fields.find(field => field.values_url !== null);
                        if (field && field.values_url) {
                            let url = field.values_url;
                            
                            if (url.startsWith('`')) {
                                url = self.replacer(url.substring(1, url.length - 1),
                                    {
                                        LIMONERO_URL: limoneroUrl,
                                        TAHITI_URL: tahitiUrl,
                                        STAND_URL: standUrl,
                                        THORN_URL: thornUrl,
                                    });
                                    console.debug(url);
                            }
                            axios.get(url).then((resp) => {
                                const values = resp.data;
                                values.forEach(v => {
                                    v['op'] = op;
                                    v['fieldName'] = field.name;
                                });
                                this.items.push(... resp.data);
                                this.alreadyLoaded.add(op.id);
                            }).catch(function (e) {
                                this.$root.$emit('on-error', e);
                            }.bind(this));;
                        }
                    }
                });
            }
        },
        computed: {
            shortcutOperations() {
                return this.operations.filter(op => op.enabled && op.type === 'SHORTCUT');
            },
            searcheableOperations() {
                let result = new Map();
                if (this.search) {
                    this.operations.forEach(op => {
                        result[op.id] = op.name
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .toLowerCase();
                    });
                }
                return result;
            }
        },
        methods: {
            startDrag2(event){
                const target = event.target;
                event.dataTransfer.setData('defaults', 
                    JSON.stringify({
                        name: target.dataset.name, 
                        lookupId: target.dataset.lookupId,
                        lookupName: target.dataset.lookupName,
                    }));
                this.startDrag(event);
            },
            replacer(tpl, data) {
                let re = /(\$\{(.+)\})/g;
                let match = null;
                while (match = re.exec(tpl)) {
                    if (data[match[2]]) {
                        tpl = tpl.replace(match[1], data[match[2]])
                    }
                    re.lastIndex = 0;
                }
                return tpl;
            },
            searchOperation: _.debounce(function () {
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

        }
    };
</script>