<template>
    <div>
        <v-style v-if="rightAlignedAttributes && rightAlignedAttributes.length">
            {{rightAlignedAttributes}} {
            text-align: right;
            }
        </v-style>
        <div v-show="loading" class="preview-loading border">
            <h1 class="text-secondary  border-radius p-4">
                <font-awesome-icon icon="spinner" spin class="text-success" />
                {{$t('common.wait')}}
            </h1>
        </div>
        <template v-if="items">
            <div style="position: relative">
                <div ref="colOverlay" class="col-overlay" @click="resetMenuData">
                    <div></div>
                </div>
                <b-table :no-border-collapse="false" :items="items" :fields="attributes" tbody-class="body"
                    sticky-header="80vh" table-class="table-preview " class="table border scroll-area"
                    @row-contextmenu="tableContextMenu" outlined small hover bordered responsive ref="table"
                    @row-clicked="tableClick">
                    <template #head()="scope">
                        <div @click.prevent="customOpen($event, scope)" class="grabbable" draggable="true"
                            v-on:dragstart="dragStart(scope.field, $event)"
                            v-on:dragend.prevent="dragEnd(scope.field, $event)"
                            v-on:dragenter="dragEnter(scope.field, $event)"
                            v-on:dragleave="dragLeave(scope.field, $event)"
                            v-on:dragover.prevent="dragOver(scope.field, $event)" v-on:drop="drop(scope.field, $event)">
                            <div style="pointer-events: none;">
                                <div class="clearfix no-wrap">
                                    <div class="attribute-name mr-2">{{scope.label}} </div>
                                    <font-awesome-icon v-if="scope.field.locked" class="" icon="lock" />
                                    <!--<font-awesome-icon v-else class="right" icon="chevron-down" />-->
                                </div>
                                <div class="data-type">
                                    <!--<select>
                        <option v-for="dt in dataTypes" :value="dt" :key="dt">{{dt}}</option>
                    </select>-->
                                    {{scope.field.type}} <span v-if="scope.field.truncated">(trunc.)</span>
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
            <div><small>{{$tc('common.pagerShowing', 0, {from: 1, to: 500, count: total})}}</small></div>
        </template>
        <template v-else></template>

        <!-- FIXME: translation -->
        <context-menu ref="ctxCellMenu" class="menu" @ctx-open="(data) => cellMenuData = data"
            @ctx-cancel="resetCellCtxLocals">
            <template v-if="cellMenuData">
                <li class="ctx-item"
                    @click="onCellContextMenuAction('filter', cellMenuData.name, '!=', cellMenuData.value)">
                    <span class="fa fa-times text-danger"></span> <b>Remover</b> registros onde
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
                <li class="ctx-item" @click="onCellContextMenuAction('filterNull', cellMenuData.name, '!', null)">
                    <span class="fa fa-times text-secondary"></span> <b>Remover</b> registros onde
                    <b><code>{{cellMenuData.name}} é nulo</code></b>
                </li>
                <li class="ctx-divider"></li>

                <li class="ctx-item"
                    @click="onCellContextMenuAction('filter', cellMenuData.name, '==', cellMenuData.value)">
                    <span class="fa fa-check text-success"></span> <b>Manter</b> apenas registros onde
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
                <li class="ctx-item" @click="onCellContextMenuAction('filterNull', cellMenuData.name, '', null)">
                    <span class="fa fa-check text-secondary"></span> <b>Manter</b> apenas registros onde
                    <b><code>{{cellMenuData.name}} é nulo</code></b>
                </li>

                <li class="ctx-divider"></li>

                <li class="ctx-item"
                    @click="onCellContextMenuAction('flag', cellMenuData.name, '==', cellMenuData.value)"><span
                        class="fa fa-flag text-primary"></span>
                    <b>Sinalizar</b> quando
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
                <li class="ctx-item"
                    @click="onCellContextMenuAction('flag', cellMenuData.name, '!=', cellMenuData.value)"><span
                        class="fa fa-flag text-danger"></span>
                    <b>Sinalizar</b> quando
                    <b><code>{{cellMenuData.name}} 	&#8800; {{cellMenuData.value}}</code></b>
                </li>
                <li class="ctx-item" @click="onCellContextMenuAction('flag', cellMenuData.name, '', null)"><span
                        class="fa fa-flag text-warning"></span>
                    <b>Sinalizar</b> quando
                    <b><code>{{cellMenuData.name}} é nulo</code></b>
                </li>
                <li class="ctx-item" @click="onCellContextMenuAction('flag', cellMenuData.name, '!', null)"><span
                        class="fa fa-flag text-secondary"></span>
                    <b>Sinalizar </b> quando
                    <b><code>{{cellMenuData.name}} não é nulo</code></b>
                </li>
                <li class="ctx-divider"></li>

                <li class="ctx-item"
                    @click="onCellContextMenuAction('clean', cellMenuData.name, '==', cellMenuData.value)">
                    <span class="fa fa-eraser text-warning"></span> <b>Limpar</b> dados do atributo
                    onde <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
                <li class="ctx-divider"></li>

                <li class="ctx-item"><span class="fa fa-search"></span>
                    <b>Localizar</b> <code>{{cellMenuData.value}}</code> on
                    <code>{{cellMenuData.name}}</code> e substituir ...</code>
                </li>
            </template>
        </context-menu>
    </div>
</template>
<script>
    import { debounce } from '../../util.js';
    import Vue from 'vue';
    import contextMenu from 'vue-context-menu';
    import Notifier from '../../mixins/Notifier.js';
    import PreviewMenu from './PreviewMenu.vue';

    export default {
        mixins: [Notifier],
        components: { contextMenu, PreviewMenu },
        data() {
            return {
                menuData: { field: { label: '', position: -1 } },
                cellMenuData: { row: 0, attribute: 0, value: null, name: null },
                handleTableScroll: null,
                lastHeader: null,
                scrollEventSet: false,
                rightAlignedAttributes: { type: String },
                dragTimeout: null,
            }
        },
        props: {
            attributes: { type: Array, default: () => [''] },
            invalid: { type: Object },
            items: { type: Array },
            loading: { type: Boolean },
            missing: { type: Object },
            store: { type: Object },
            serviceBus: { type: Object },
            total: { type: Number },
        },
        watch: {
            attributes() {
                const self = this;
                const rightAlignedTypes = new Set(['integer', 'date', 'decimal', 'boolean', 'time']);
                const rightAlignedAttributes = [];

                const attributeIndexes = new Map();
                this.attributes.forEach((attr, inx) => {
                    if (rightAlignedTypes.has(attr.type.toLowerCase())) {
                        rightAlignedAttributes.push(inx)
                    }
                    attributeIndexes.set(attr.key, inx);
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
            this.handleTableScroll = debounce(this.handleScroll, 100);
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.resize);
            this.$refs.table &&
                this.$refs.table.$el.removeEventListener(
                    'scroll', this.handleTableScrollEvent);
        },
        methods: {
            resize(ev) {
                const th = this.lastHeader;
                if (th) {
                    const clipRec = th.getBoundingClientRect();
                    this.$refs.colOverlay.style.left = `${th.offsetLeft}px`;
                    this.$refs.colOverlay.style.width = `${clipRec.width}px`;
                    this.$refs.colOverlay.style.display = '';
                    this.$refs.colOverlay.style.height = `${this.$refs.table.$el.offsetHeight}px`;
                }
            },
            tableClick(item, rowIndex, event) {

                this.$refs.colOverlay.style.left = -10;
                this.$refs.colOverlay.style.width = 0;
                this.$refs.colOverlay.style.display = 'none';
                this.resetMenuData();
                return;
                const cell = event.target.closest('td');
                const index = parseInt(cell.getAttribute('aria-colindex')) - 1;

                //this.customOpen(event, this.attributes[index], index);

                this.lastHeader && this.lastHeader.classList.remove('bg-info', 'text-white');
                const data = {
                    attribute: index, field: this.attributes[index],
                    label: this.attributes[index].key
                };
                const th = this.$refs.table.$el.querySelectorAll('th')[index];
                if (this.menuData.field !== data.field) {
                    this.lastHeader = th;
                    this.lastHeader.classList.add('bg-info', 'text-white')
                    this.menuData = data;
                    this.moveSelectionOverlay(th);
                } else {
                    this.$refs.colOverlay.style.left = -10;
                    this.$refs.colOverlay.style.width = 0;
                    this.$refs.colOverlay.style.display = 'none';
                    this.resetMenuData();
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
            },

            customOpen(event, data, index) {
                let th;
                if (index !== undefined) {
                    th = this.$refs.table.$el.querySelectorAll('th')[index];
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
                /*const rect = th.getBoundingClientRect();
                const clientX = rect.left + window.pageXOffset;
                 this.$refs.ctxMenu.open(this._eventModifier(event,
                    {
                        clientX: clientX > 0 ? clientX : 0,
                        clientY: th.offsetTop + 125
                    }), data);
                    */
                //console.debug(event.clientX, rect.left + window.pageXOffset, clientX > 0 ? clientX : 0)
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
            resetCellCtxLocals(data) {
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
                const attribute = this.attributes[attributeIndex - 1];
                const cellText = event.target.innerText;
                // Users cannot filter using garge text and context menu
                if (cellText.length <= 40) {
                    let value;
                    if (['Text', 'Date', 'Datetime', 'Time'].includes(attribute.type)) {
                        value = `"${cellText.substring(0, 40)}"`
                    } else {
                        // Convert to Number
                        value = Number(event.target.innerText);
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
            dragEnd(item, e) {
                this.resetMenuData();
            },
            dragOver(item, e) {
                return true;
            },
            dragEnter(item, e) {
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

<style scoped>
    div.menu>>>li {
        font-size: .9em;
        margin: 0;
        min-width: 200px;
    }

    div.menu>>>li.ctx-item>span {
        margin-right: 5px
    }

    .table-preview {
        position: relative;
    }

    .table {
        color: #aaa;
        font-size: 10pt;
        xwhite-space: pre-wrap;
        /*
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none*/
    }

    .table>>>td.invalid-data {
        background-color: #fee;
    }

    .table>>>td.missing-data {
        background-color: #fffdeb;
    }

    .no-wrap {
        overflow: auto;
        white-space: nowrap;
    }

    .no-wrap * {
        display: inline-block;
    }

    .table>>>td {
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

    .preview-loading {
        background: #fff;
        margin: 0 auto;
        width: 30%;
        left: 25%;
        text-align: center;
        position: absolute;
        top: 100px;
        z-index: 101;
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