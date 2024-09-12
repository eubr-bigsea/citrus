<template>
    <div>
        <v-style v-if="rightAlignedAttributes && rightAlignedAttributes.length">
            .table-preview td:nth-child(1), {{rightAlignedAttributes}} {
            text-align: right;
            }
            .table-preview td:nth-child(1) {
            background: #efefef;
            }
        </v-style>
        <div v-show="loading">
            <div class="preview-loading">
                <font-awesome-icon icon="lemon" spin class="text-success" />
                {{$t('common.wait')}}
            </div>
        </div>

        <template v-if="items && items.length > 0">
            <div style="position: relative">
                <div ref="colOverlay" class="col-overlay" @click="resetMenuData">
                    <div />
                </div>
                <div class="border scroll-area table-preview b-table-sticky-header table-responsive"
                     style="max-height: 85vh;" @scroll="handleTableScroll">
                    <preview-table ref="table" :headers="headersWithLineNumber" :stick-header="true" :rows="items"
                                   table-class="table b-table table-preview table-hover table-bordered table-sm border"
                                   @row-contextmenu="tableContextMenu" @row-clicked="tableClick">
                        <template #head="scope">
                            <div class="user-select-none" @click.prevent="customOpen($event, scope)">
                                <div class="clearfix no-wrap">
                                    <div class="attribute-name me-2">
                                        {{scope.field.label}}
                                    </div>
                                    <!--
                                    <font-awesome-icon v-if="scope?.field.locked" class="" icon="lock" />
                                    -->
                                </div>
                                <div class="data-type">
                                    {{scope.field.generic_type}}
                                    <br>
                                    {{scope.field.type}}<span v-if="scope.field.inner">({{scope.field.inner}})</span>
                                    <span v-if="scope.field.truncated">(trunc.)</span>
                                </div>
                            </div>
                        </template>
                        <template #cell="scope">
                            <template v-if="scope.field.name === 'lineno'">
                                {{scope.index + 1}}
                            </template>
                            <template v-else>
                                {{scope.row[scope.field.name]}}
                            </template>
                        </template>
                    </preview-table>
                </div>
                <!--
                <b-table ref="table" :no-border-collapse="false" :items="items" :fields="['#'].concat(attributes)"
                         tbody-class="body" sticky-header="85vh" table-class="table-preview"
                         class="border scroll-area table-preview" outlined small hover
                         bordered responsive
                         @row-contextmenu="tableContextMenu" @row-clicked="tableClick">
                    
                    <template #cell(#)="data">
                        {{data.index + 1}}
                    </template>

                    <template #head()="scope">
                        <div class="grabbable" draggable="false" @click.prevent="customOpen($event, scope)"
                             @dragstart="dragStart(scope.field, $event)" @dragend.prevent="dragEnd(scope.field, $event)"
                             @dragenter="dragEnter(scope.field, $event)" @dragleave="dragLeave(scope.field, $event)"
                             @dragover.prevent="dragOver(scope.field, $event)" @xdrop="drop(scope.field, $event)">
                            <div style="pointer-events: none;">
                                <div class="clearfix no-wrap">
                                    <div class="attribute-name me-2">
                                        {{scope.label}}
                                    </div>
                                    <font-awesome-icon v-if="scope.field.locked" class="" icon="lock" />
                                </div>
                                <div class="data-type">
                                    {{scope.field.generic_type}}
                                    <br>
                                    {{scope.field.type}}<span v-if="scope.field.inner">({{scope.field.inner}})</span>
                                    <span v-if="scope.field.truncated">(trunc.)</span>
                                </div>

                            </div>
                        </div>
                    </template>
                </b-table>
                -->
            </div>
        </template>
    </div>
</template>

<script>
//import contextMenu from 'vue-context-menu';
import VStyle from '@/components/VStyle.vue';
import Notifier from '@/mixins/Notifier.js';
import { h } from 'vue';
import PreviewTable from './DataExplorerPreviewTable.vue';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ContextMenu from '@imengyu/vue3-context-menu';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';

ContextMenu.compatConfig = { MODE: 3 };
export default {
    name: 'PreviewComponent',
    components: {
        PreviewTable, VStyle, //'context-menu-2': ContextMenu,
        //ContextMenuGroup, ContextMenuItem, ContextMenuSeparator
    },
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
    emits: ['select', 'scroll', 'context-menu', 'drop', 'render-complete'],
    data() {
        return {
            optionsMenu: {
                zIndex: 3000,
                minWidth: 230,
                x: 500,
                y: 200
            },
            showContextMenu: false,
            menuData: { field: { label: '', position: -1 } },
            cellMenuData: { row: 0, attribute: 0, value: null, name: null },
            handleTableScroll: null,
            lastHeader: null,
            scrollEventSet: false,
            rightAlignedAttributes: { type: String },
            dragTimeout: null,
            columnTypes: new Map(),
        };
    },
    computed: {
        headersWithLineNumber() {
            return [{ name: 'lineno', label: '#' }].concat(this.attributes);
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
                        attr.formatter = (v) => v === 0 ? self.$t('common.no') : self.$t('common.yes');
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
                this.$nextTick(() => {
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
                this.$nextTick(() => this.$refs.table.$el.parentElement.addEventListener('scroll', this.handleTableScrollEvent));
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
            this.$refs.table.$el.parentElement.removeEventListener(
                'scroll', this.handleTableScrollEvent);
    },
    methods: {
        onContextMenu(e) {
            //prevent the browser's default menu
            e.preventDefault();
            //show your menu
            let value = this.cellMenuData.value;
            if (value.length > 40)
                value = `${value.substring(0, 40)} ...`;
            if (value.trim() == '') {
                value = `"${value}"`;
            }

            ContextMenu.showContextMenu({
                x: e.x,
                y: e.y,
                class: 'teste',
                items: [
                    {
                        label: h(
                            'span', {}, [
                                h('b', 'Manter'), " apenas registros onde ",
                                h('b', {}, [h('code', {}, `${this.cellMenuData.name} = ${value}`)]),
                            ]),
                        icon: h(FontAwesomeIcon, { icon: 'fa-check', 'class': 'text-success' }),

                        onClick: () =>
                            this.onCellContextMenuAction('filter', this.cellMenuData.name, '==',
                                this.cellMenuData.value),
                    },
                    {
                        label: h(
                            'span', {}, [
                                h('b', 'Manter'), " apenas registros onde ",
                                h('b', {}, [h('code', {}, `${this.cellMenuData.name} é nulo`)]),
                            ]),
                        icon: h(FontAwesomeIcon, { icon: 'fa-check', 'class': 'text-success' }),

                        onClick: () =>
                            this.onCellContextMenuAction('filterNull', this.cellMenuData.name, '', null),
                        divided: true
                    },
                    {
                        label: h(
                            'span', {}, [
                                h('b', 'Remover'), " registros onde ",
                                h('b', {}, [h('code', {}, `${this.cellMenuData.name} ≠ ${value}`)]),
                            ]),
                        iconFontClass: 'text-danger',
                        icon: h(FontAwesomeIcon, { icon: 'fa-times', 'class': 'text-danger' }),

                        onClick: () =>
                            this.onCellContextMenuAction('filter', this.cellMenuData.name, '!=',
                                this.cellMenuData.value),
                    },
                    {
                        label: h(
                            'span', {}, [
                                h('b', 'Remover'), " registros onde ",
                                h('b', {}, [h('code', {}, `${this.cellMenuData.name} não é nulo`)]),
                            ]),
                        iconFontClass: 'text-danger',
                        icon: h(FontAwesomeIcon, { icon: 'fa-times', 'class': 'text-danger' }),

                        onClick: () =>
                            this.onCellContextMenuAction('filterNull', this.cellMenuData.name, '!', null),
                        divided: true
                    },

                    {
                        label: h(
                            'span', {}, [
                                h('b', 'Sinalizar'), " registros onde ",
                                h('b', {}, [h('code', {}, `${this.cellMenuData.name} = ${value}`)]),
                            ]),
                        icon: h(FontAwesomeIcon, { icon: 'fa-flag   ', 'class': 'text-primary' }),

                        onClick: () =>
                            this.onCellContextMenuAction('flag', this.cellMenuData.name, '=',
                                this.cellMenuData.value),
                    },
                    {
                        label: h(
                            'span', {}, [
                                h('b', 'Sinalizar'), " registros onde ",
                                h('b', {}, [h('code', {}, `${this.cellMenuData.name} é nulo`)]),
                            ]),
                        icon: h(FontAwesomeIcon, { icon: 'fa-flag   ', 'class': 'text-primary' }),

                        onClick: () =>
                            this.onCellContextMenuAction('flag', this.cellMenuData.name, '', null),
                        divided: true
                    },
                    {
                        label: h(
                            'span', {}, [
                                h('b', 'Sinalizar'), " registros onde ",
                                h('b', {}, [h('code', {}, `${this.cellMenuData.name} ≠ ${value}`)]),
                            ]),
                        icon: h(FontAwesomeIcon, { icon: 'fa-flag   ', 'class': 'text-primary' }),

                        onClick: () =>
                            this.onCellContextMenuAction('flag', this.cellMenuData.name, '!=',
                                this.cellMenuData.value),
                    },
                    {
                        label: h(
                            'span', {}, [
                                h('b', 'Sinalizar'), " registros onde ",
                                h('b', {}, [h('code', {}, `${this.cellMenuData.name} não é nulo`)]),
                            ]),
                        icon: h(FontAwesomeIcon, { icon: 'fa-flag   ', 'class': 'text-primary' }),

                        onClick: () =>
                            this.onCellContextMenuAction('flag', this.cellMenuData.name, '!', null),
                        divided: true
                    },
                    {
                        label: h(
                            'span', {}, [
                                h('b', 'Limpar'), " dados do atributo onde ",
                                h('b', {}, [h('code', {}, `${this.cellMenuData.name} = ${value}`)]),
                            ]),
                        icon: h(FontAwesomeIcon, { icon: 'fa-eraser   ', 'class': 'text-warning' }),

                        onClick: () =>
                            this.onCellContextMenuAction('clean', this.cellMenuData.name, '==', value),
                        divided: false
                    },

                ]
            });
        },
        customTdClass(value, key, item, a, b) {
            if (item[key] == null) {
                return 'null-cell';
                //} else if (this.columnTypes.get(key) == 'Decimal' || this.columnTypes.get(key) == 'Integer') {
                //    return 'text-end'
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
                this.$refs.colOverlay.style.height = `${this.$refs.table.$el.parentElement.offsetHeight}px`;
            }
        },
        tableClick(item, rowIndex, event) { // eslint-disable-line no-unused-vars

            this.$refs.colOverlay.style.left = -10;
            this.$refs.colOverlay.style.width = 0;
            this.$refs.colOverlay.style.display = 'none';
            this.resetMenuData();
            const cell = event.target.closest('td,th');
            const index = cell.cellIndex;
            if (index > 0) { 
                // 0 = row number, not an attribute
                const field = this.attributes[index - 1];
                this.customOpen(event, { field, column: field.name, label: field.name }, index);
            } else {
                this.resetMenuData();
            }
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

            this.lastHeader && this.lastHeader.classList.remove('bg-secondary', 'text-white');
            if (this.menuData.field !== data.field &&  event.target.tagName !== 'TD') {
                this.lastHeader = th;
                this.moveSelectionOverlay(th);
                this.lastHeader.classList.add('bg-secondary', 'text-white');
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
            const elem = document.querySelector('th.bg-secondary');
            elem && elem.classList.remove('bg-secondary', 'text-white');
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
            //FIXME this.$refs.ctxCellMenu.ctxVisible = false;
            //this.$refs.dataTypeCtxMenu.ctxVisible = false;
            this.$emit('scroll', ev);
        },
        scroll(opts) {
            this.$refs.table && this.$refs.table.$el.scroll(opts);
        },

        moveSelectionOverlay(th, showBorder) {
            const scrollOffset = this.$refs.table.$el.parentElement.scrollLeft;
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
                this.$refs.colOverlay.style.height = `${this.$refs.table.$el.parentElement.offsetHeight}px`;
                this.$refs.colOverlay.style.display = '';
            }
        },
        resetCellCtxLocals() {
            this.cellMenuData = { row: 0, attribute: 0, value: null, name: null };
        },
        _eventModifier(evt, obj) {
            const proxy = new Proxy(evt, {
                get: (target, prop) => obj[prop] || target[prop]
            });
            return new evt.constructor(evt.type, proxy);
        },
        /**/
        tableContextMenu(item, index, event) {
            event.preventDefault();
            const cell = event.target.closest('td,th');
            const attributeIndex = cell.cellIndex - 1;
            // Users cannot filter using garge text and context menu
            if (attributeIndex > -1) {
                const cellText = event.target.innerText;
                const attribute = this.attributes[attributeIndex];
                this.cellMenuData.name = attribute.name;
                this.cellMenuData.value = cellText;
                let value;
                if (!['Text', 'Date', 'Datetime', 'Time', 'Boolean'].includes(attribute.generic_type)) {
                    // Convert to Number
                    value = Number(event.target.innerText);
                } else if (attribute.generic_type === 'Boolean') {
                    value = event.target.innerText === 'true';
                } else {
                    value = `"${cellText.substring(0, 40)}"`;
                }
                const raw = `"{value}"`;
                this.onContextMenu(event);
                return;
                this.$refs.ctxCellMenu.open(this._eventModifier(event, {}),
                    {
                        row: index + 1,
                        attribute: attributeIndex,
                        value,
                        raw,
                        name: attribute.label,
                    });
            }
        },
        // Cell context menu
        onCellContextMenuAction(action, attributeName, operator, attributeValue) {
            this.$emit('context-menu', action, attributeName, operator, attributeValue);
        },
        dragStart(item, e) {
            e.dataTransfer.setData('position', item.position);
            e.dataTransfer.dropEffect = 'move';
            e.dataTransfer.effectAllowed = 'move';
            this.resetMenuData();
        },
        dragEnd(item, e) { // eslint-disable-line no-unused-vars
            this.resetMenuData();
        },
        dragOver(item, e) {// eslint-disable-line no-unused-vars
            return true;
        },
        dragEnter(item, e) {// eslint-disable-line no-unused-vars
            e.dataTransfer.dropEffect = 'move';
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
        /* TODO: review
        drop(item, e) {
            debugger
            const position = parseInt(e.dataTransfer.getData('position'));

            this.attributes.splice(item.position, 0,
                this.attributes.splice(position, 1)[0]);
            this.attributes.forEach((attr, i) => attr.position = i);
            this.$refs.table.refresh();

            this.$emit('drop', {
                action: 'move',
                params: [this.attributes[item.position].label, item.position]
            });
        }*/

    },
};
</script>
<style>
.null-cell {
    background: #eee;
}

:root {
    --mx-menu-backgroud-radius: 2px;
}

.mx-context-menu {
    font-size: 10pt;
}

.mx-context-menu code {
    font-family: Verdana, Geneva, Tahoma, sans-serif
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
    xcolor: #aaa;
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

.table-preview>>>th {
    background-color: #fff;
    padding: 0;
    flex-direction: column;
}

.table-preview>>>th>div {
    border-bottom: 1px solid #888;
    padding: 5px;
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
    z-index: 1;
}

.col-overlay div {
    opacity: .1;
    background-color: rgb(14, 101, 235);
    height: 83vh;
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