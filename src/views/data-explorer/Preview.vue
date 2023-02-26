<template>
    <div>
        <v-style v-if="rightAlignedAttributes && rightAlignedAttributes.length">
            {{ rightAlignedAttributes }} {
            text-align: right;
            }
        </v-style>
        <div v-show="loading" class="preview-loading">
            <font-awesome-icon icon="lemon" spin class="text-success" />
            {{ $t('common.wait') }}
        </div>
        <template v-if="items">
            <div style="position: relative">
                <div ref="colOverlay" class="col-overlay" @click="resetMenuData">
                    <div />
                </div>
                <b-table ref="table" :no-border-collapse="false" :items="items" :fields="['#'].concat(attributes)"
                    tbody-class="body" sticky-header="90vh" table-class="table-preview"
                    class="border scroll-area table-preview" outlined small hover bordered responsive
                    @row-contextmenu="tableContextMenu" @row-clicked="tableClick">
                    <!-- A custom formatted column -->
                    <template #cell(#)="data">
                        {{ data.index + 1 }}
                    </template>

                    <template #head()="scope">
                        <div class="grabbable" draggable="true" @click.prevent="customOpen($event, scope)"
                            @dragstart="dragStart(scope.field, $event)" @dragend.prevent="dragEnd(scope.field, $event)"
                            @dragenter="dragEnter(scope.field, $event)" @dragleave="dragLeave(scope.field, $event)"
                            @dragover.prevent="dragOver(scope.field, $event)" @drop="drop(scope.field, $event)">
                            <div style="pointer-events: none;">
                                <div class="clearfix no-wrap">
                                    <div class="attribute-name mr-2">
                                        {{ scope.label }}
                                    </div>
                                    <font-awesome-icon v-if="scope.field.locked" class="" icon="lock" />
                                    <!--<font-awesome-icon v-else class="right" icon="chevron-down" />-->
                                </div>
                                <div class="data-type">
                                    <!--<select>
                        <option v-for="dt in dataTypes" :value="dt" :key="dt">{{dt}}</option>
                    </select>-->
                                    {{ scope.field.generic_type }}
                                    <br />
                                    {{ scope.field.type }}<span v-if="scope.field.inner">({{
                                        scope.field.inner
                                    }})</span>
                                    <span v-if="scope.field.truncated">(trunc.)</span>
                                </div>
                                <!--
                                <div>
                                    <quality-bar :attribute="scope.field" />
                                </div>
                                -->
                            </div>
                        </div>
                    </template>
                    <!--
                    <template #table-colgroup="scope">
                        <col v-for="field, inx in scope.fields" :key="field.key" :style="{border: '1px solid red'}">
                    </template>
                    -->
                </b-table>
            </div>
        </template>
        <template v-else />

        <!-- FIXME: translation -->
        <context-menu ref="ctxCellMenu" class="menu" @ctx-open="(data) => cellMenuData = data"
            @ctx-cancel="resetCellCtxLocals">
            <template v-if="cellMenuData">
                <li class="ctx-item"
                    @click="onCellContextMenuAction('filter', cellMenuData.name, '!=', cellMenuData.value)">
                    <font-awesome-icon icon="fa fa-times" class="text-danger" /> <b>Remover</b> registros onde
                    <b><code>{{ cellMenuData.name }}={{ cellMenuData.value }}</code></b>
                </li>
                <li class="ctx-item" @click="onCellContextMenuAction('filterNull', cellMenuData.name, '!', null)">
                    <font-awesome-icon icon="fa fa-times" class="text-secondary" /> <b>Remover</b> registros onde
                    <b><code>{{ cellMenuData.name }} é nulo</code></b>
                </li>
                <li class="ctx-divider" />

                <li class="ctx-item"
                    @click="onCellContextMenuAction('filter', cellMenuData.name, '==', cellMenuData.value)">
                    <font-awesome-icon icon="fa fa-check" class="text-success" /> <b>Manter</b> apenas registros onde
                    <b><code>{{ cellMenuData.name }}={{ cellMenuData.value }}</code></b>
                </li>
                <li class="ctx-item" @click="onCellContextMenuAction('filterNull', cellMenuData.name, '', null)">
                    <font-awesome-icon icon="fa fa-check text-secondary" /> <b>Manter</b> apenas registros onde
                    <b><code>{{ cellMenuData.name }} é nulo</code></b>
                </li>

                <li class="ctx-divider" />

                <li class="ctx-item"
                    @click="onCellContextMenuAction('flag', cellMenuData.name, '==', cellMenuData.value)">
                    <font-awesome-icon icon="fa fa-flag text-primary" />
                    <b>Sinalizar</b> quando
                    <b><code>{{ cellMenuData.name }}={{ cellMenuData.value }}</code></b>
                </li>
                <li class="ctx-item"
                    @click="onCellContextMenuAction('flag', cellMenuData.name, '!=', cellMenuData.value)">
                    <font-awesome-icon icon="fa fa-flag text-danger" />
                    <b>Sinalizar</b> quando
                    <b><code>{{ cellMenuData.name }} 	&#8800; {{ cellMenuData.value }}</code></b>
                </li>
                <li class="ctx-item" @click="onCellContextMenuAction('flag', cellMenuData.name, '', null)">
                    <font-awesome-icon icon="fa fa-flag" calss="text-warning" />
                    <b>Sinalizar</b> quando
                    <b><code>{{ cellMenuData.name }} é nulo</code></b>
                </li>
                <li class="ctx-item" @click="onCellContextMenuAction('flag', cellMenuData.name, '!', null)">
                    <font-awesome-icon icon="fa fa-flag" class="text-secondary" />
                    <b>Sinalizar </b> quando
                    <b><code>{{ cellMenuData.name }} não é nulo</code></b>
                </li>
                <li class="ctx-divider" />

                <li class="ctx-item"
                    @click="onCellContextMenuAction('clean', cellMenuData.name, '==', cellMenuData.value)">
                    <font-awesome-icon icon="fa fa-eraser" class="text-warning" /> <b>Limpar</b> dados do atributo
                    onde <b><code>{{ cellMenuData.name }}={{ cellMenuData.value }}</code></b>
                </li>
                <!--
                <li class="ctx-divider"></li>
                <li class="ctx-item"><font-awesome-icon icon="fa fa-search" />
                    <b>Localizar</b> <code>{{cellMenuData.value}}</code> on
                    <code>{{cellMenuData.name}}</code> e substituir ...
                </li>
            -->
            </template>
        </context-menu>
    </div>
</template>
<script>
import contextMenu from 'vue-context-menu';
import Notifier from '../../mixins/Notifier.js';

export default {
    name: 'PreviewComponent',
    components: { contextMenu },
    mixins: [Notifier],
    props: {
        attributes: { type: Array, default: () => [''] },
        invalid: { type: Object, default: () => null },
        items: { type: Array, default: () => [] },
        loading: { type: Boolean, default: () => false },
        missing: { type: Object, default: () => null },
        store: { type: Object, default: () => null },
        serviceBus: { type: Object, default: () => null },
        total: { type: Number, default: () => 0 },
    },
    data() {
        return {
            menuData: { field: { label: '', position: -1 } },
            cellMenuData: { row: 0, attribute: 0, value: null, name: null },
            handleTableScroll: null,
            lastHeader: null,
            scrollEventSet: false,
            rightAlignedAttributes: { type: String },
            dragTimeout: null,
            columnTypes: new Map(),
        }
    },
    watch: {
        attributes() {
            //const self = this;
            const rightAlignedTypes = new Set(['integer', 'date', 'datetime', 'decimal', 'boolean', 'time']);
            const rightAlignedAttributes = [];

            const attributeIndexes = new Map();
            this.attributes.forEach((attr, inx) => {
                if (rightAlignedTypes.has(attr.generic_type.toLowerCase())) {
                    rightAlignedAttributes.push(inx + 1); // +1 because there is a row index at column 0
                }
                attributeIndexes.set(attr.key, inx + 1);
                /*
                    if (attr.type.toLowerCase() === 'boolean'){
                        attr.formatter = (v) => v === 0 ? self.$tc('common.no') : self.$tc('common.yes');
                    }
                    */
            });
            if (rightAlignedAttributes.length) {
                this.rightAlignedAttributes = rightAlignedAttributes.map(v => `.table-preview td:nth-child(${v + 1})`).join(', ');
            } else {
                this.rightAlignedAttributes = null;
            }
            /*
                const self = this;
                Vue.nextTick(() => {
                    const tbody = self.$refs.table.$el.querySelector('tbody');
                    // Reset cells previously with invalid data
                    [].forEach.call(document.querySelectorAll('.invalid-data'),
                        elem => {
                            elem.classList.remove('invalid-data');
                        });

                    if (self.invalid) {
                        Object.entries(self.invalid).forEach(([row, cols], inx) => {
                            let tr = tbody.children[parseInt(row)];
                            cols.forEach(col => tr.children[col].classList.add('invalid-data'));
                        });
                    }
                    // Reset cells previously with missing data
                    [].forEach.call(document.querySelectorAll('.missing-data'),
                        elem => {
                            elem.classList.remove('missing-data');
                        });
                    if (self.missing) {
                        Object.entries(self.missing).forEach(([row, cols], inx) => {
                            let tr = tbody.children[parseInt(row)];
                            cols.forEach(col => {
                                if (tr && tr.children[col])
                                    tr.children[col].classList.add('missing-data');
                            });
                        });
                    }
                });
                */
                this.attributes.forEach(attr => this.columnTypes.set(attr.key, attr.generic_type));
        },
        items() {
            if (!this.scrollEventSet) {
                this.$nextTick(() => this.$refs.table.$el.addEventListener('scroll', this.handleTableScrollEvent));
                this.scrollEventSet = true;
            }
            this.$nextTick(() => {
                this.moveSelectionOverlay(this.lastHeader);
            });
        }
    },
    mounted: function () {
        window.addEventListener("resize", this.resize);
        //this.attributes.forEach(attr => attr['tdClass'] = this.customTdClass);
        //this.handleTableScroll = debounce(this.handleScroll, 100);
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.resize);
        this.$refs.table &&
            this.$refs.table.$el.removeEventListener(
                'scroll', this.handleTableScrollEvent);
    },
    methods: {
        customTdClass(value, key, item, a, b) {
            if (item[key] == null) {
                return 'null-cell';
            //} else if (this.columnTypes.get(key) == 'Decimal' || this.columnTypes.get(key) == 'Integer') {
            //    return 'text-right'
            }
            //return null;
        },

        resize() {
            const th = this.lastHeader;
            if (th) {
                const clipRec = th.getBoundingClientRect();
                this.$refs.colOverlay.style.left = `${th.offsetLeft}px`;
                this.$refs.colOverlay.style.width = `${clipRec.width}px`;
                this.$refs.colOverlay.style.display = '';
                this.$refs.colOverlay.style.height = `${this.$refs.table.$el.offsetHeight}px`;
            }
        },
        tableClick(item, rowIndex, event) { // eslint-disable-line no-unused-vars

            this.$refs.colOverlay.style.left = -10;
            this.$refs.colOverlay.style.width = 0;
            this.$refs.colOverlay.style.display = 'none';
            this.resetMenuData();
            const cell = event.target.closest('td');
            const index = parseInt(cell.getAttribute('aria-colindex')) - 1;
            const field = this.attributes[index - 1];
            this.customOpen(event, { field, column: field.name, label: field.name }, index);
            return;
        },
        customOpen(event, data, index) {
            let th;
            if (index !== undefined) {
                th = this.$refs.table.$el.querySelectorAll('th')[index];
            } else if (data.column === '#') {
                this.resetMenuData();
                this.$emit('select', { field: {} });
                return;
            } else {
                th = event.target.closest('th');
            }

            this.lastHeader && this.lastHeader.classList.remove('bg-info', 'text-white');
            if (this.menuData.field !== data.field) {
                this.lastHeader = th;
                this.moveSelectionOverlay(th);
                this.lastHeader.classList.add('bg-info', 'text-white')
                this.menuData = data;
                this.$emit('select', data);
            } else {
                this.resetMenuData();
                this.$emit('select', { field: {} });
            }
        },
        resetMenuData() {
            this.menuData = { field: { label: '', position: -1 } };
            if (this.$refs.colOverlay) {
                this.$refs.colOverlay.style.left = '-100px';
                this.$refs.colOverlay.style.display = 'none';
            }
            const elem = document.querySelector('th.bg-info');
            elem && elem.classList.remove('bg-info', 'text-white');
        },
        menuAction(options) {
            if (typeof this[options.action] === 'function') {
                this[options.action](options.params);
            } else {
                console.log(`Unknown action: ${options.action}`);
            }
        },
        handleTableScrollEvent(ev) {
            this.moveSelectionOverlay(this.lastHeader);
            this.$refs.ctxCellMenu.ctxVisible = false;
            //this.$refs.dataTypeCtxMenu.ctxVisible = false;
            this.$emit('scroll', ev);
        },
        scroll(opts) {
            this.$refs.table && this.$refs.table.$el.scroll(opts);
        },

        moveSelectionOverlay(th, showBorder) {
            const scrollOffset = this.$refs.table.$el.scrollLeft;
            if (th) {
                const clipRec = th.getBoundingClientRect();
                if (scrollOffset) {
                    this.$refs.colOverlay.style.left = `${th.offsetLeft - scrollOffset}px`;
                } else {
                    this.$refs.colOverlay.style.left = `${th.offsetLeft}px`;
                }
                this.$refs.colOverlay.style.width = `${clipRec.width}px`;
                if (showBorder) {
                    this.$refs.colOverlay.style.borderLeft = '5px solid #888';
                } else {
                    this.$refs.colOverlay.style.borderLeft = 'none';
                }
                this.$refs.colOverlay.style.height = `${this.$refs.table.$el.offsetHeight}px`;
                this.$refs.colOverlay.style.display = '';
            }
        },
        resetCellCtxLocals() {
            this.cellMenuData = { row: 0, attribute: 0, value: null, name: null };
        },
        _eventModifier(evt, obj) {
            const proxy = new Proxy(evt, {
                get: (target, prop) => obj[prop] || target[prop]
            })
            return new evt.constructor(evt.type, proxy)
        },
        /**/
        tableContextMenu(item, index, event) {
            event.preventDefault();
            const attributeIndex = parseInt(event.target.getAttribute('aria-colindex'));
            const attribute = this.attributes[attributeIndex - 2]; // -2 because starts in zero and first is the row number
            const cellText = event.target.innerText;
            // Users cannot filter using garge text and context menu
            if (cellText.length <= 40) {
                let value;
                if (!['Text', 'Date', 'Datetime', 'Time', 'Boolean'].includes(attribute.generic_type)) {
                    // Convert to Number
                    value = Number(event.target.innerText);
                } else if (attribute.generic_type === 'Boolean') {
                    value = event.target.innerText === 'true';
                } else {
                    value = `"${cellText.substring(0, 40)}"`
                }
                const raw = `"{value}"`;
                this.$refs.ctxCellMenu.open(this._eventModifier(event, {}),
                    {
                        row: index + 1,
                        attribute: attributeIndex,
                        value,
                        raw,
                        name: attribute.label,
                    })
            }
        },
        // Cell context menu
        onCellContextMenuAction(action, attributeName, operator, attributeValue) {
            this.$emit('context-menu', action, attributeName, operator, attributeValue);
        },
        dragStart(item, e) {
            e.dataTransfer.setData('position', item.position);
            e.dataTransfer.dropEffect = 'move'
            e.dataTransfer.effectAllowed = 'move'
            this.resetMenuData();
        },
        dragEnd(item, e) { // eslint-disable-line no-unused-vars
            this.resetMenuData();
        },
        dragOver(item, e) {// eslint-disable-line no-unused-vars
            return true;
        },
        dragEnter(item, e) {// eslint-disable-line no-unused-vars
            event.dataTransfer.dropEffect = 'move';
            if (this.dragTimeout) {
                clearTimeout(this.dragTimeout);
            }
            this.dragTimeout = setTimeout(
                () => {
                    const selectColumn = `th:nth-child(${item.position + 1})`;
                    const th = this.$refs.table.$el.querySelector(selectColumn);
                    this.moveSelectionOverlay(th, true);
                }, 100);

        },
        dragLeave(item, e) {
            e.target.style.background = 'inherit';
        },
        drop(item, e) {
            const position = parseInt(e.dataTransfer.getData('position'));

            this.attributes.splice(item.position, 0,
                this.attributes.splice(position, 1)[0]);
            this.attributes.forEach((attr, i) => attr.position = i);
            this.$refs.table.refresh();

            this.$emit('drop', {
                action: 'move',
                params: [this.attributes[item.position].label, item.position]
            })
        }

    },
}
</script>
<style>
    .null-cell {
        background: #eee;  
    } 
</style>

<style scoped>


div.menu>>>li {
    font-size: .9em;
    margin: 0;
    min-width: 200px;
}

div.menu>>>li.ctx-item>span {
    margin-right: 5px
}

div.table-preview {
    position: relative;
    max-width: calc(95vw - 301px);
}

/* .table-preview>>>table {
        min-width: 100% !important;
        width: 1500px;
    } */
.table-preview>>>td {
    white-space: pre;
}

.table-preview {
    color: #aaa;
    font-size: 10pt;
    xwhite-space: pre-wrap;
    /*
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none*/
}

.table-preview>>>td.invalid-data {
    background-color: #fee;
}

.table-preview>>>td.missing-data {
    background-color: #fffdeb;
}

.table-preview>>>td:hover {
    background-color: #666;
    color: #fff;
}

.no-wrap {
    overflow: auto;
    white-space: nowrap;
}

.no-wrap * {
    display: inline-block;
}

.table-preview>>>td {
    font-size: 9pt;
    /*min-width: 150px;*/
    padding: 1px 4px;
    /*font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;*/
}

div.data-type {
    font-weight: normal;
    font-size: .9em;
}

.smallest-icon {
    font-size: .9em;
}

.ctx-item {
    line-height: 1.2 !important;
}


.col-overlay {
    /*border: 1px solid rgb(14, 101, 235);*/
    border-bottom: 0;
    left: -10000px;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    height: 80vh;
    /*min-width: 100px;*/
}

.col-overlay div {
    opacity: .04;
    background-color: rgb(14, 101, 235);
    height: 80vh;
    width: 100%;
}

.grabbable {
    cursor: move;
    /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

/* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}

</style>