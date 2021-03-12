<template>
    <div>
        <v-style v-if="rightAlignedColumns">
            {{rightAlignedColumns}} {
            text-align: right;
            }
        </v-style>
        <div v-show="loading" class="preview-loading">
            <h1 class="text-secondary  border-radius p-4">
                <font-awesome-icon icon="spinner" spin class="text-success" />
                {{$t('common.wait')}}
            </h1>
        </div>
        <template v-if="items">
            <PreviewMenu :selected="menuData.field" @select="menuAction" />
            <b-table :no-border-collapse="false" :items="items" :fields="attributes" tbody-class="body"
                sticky-header="80vh" table-class="table-preview" class="table border"
                @row-contextmenu="tableContextMenu" outlined small hover striped bordered responsive ref="table"
                @row-clicked="tableClick" style>
                <template #head()="scope">
                    <div @click.prevent="customOpen($event, scope)">
                        <div style="cursor: default;" class="clearfix no-wrap">
                            <div class="column-name mr-2">{{scope.label}} </div>
                            <font-awesome-icon v-if="scope.field.locked" class="" icon="lock" />
                            <!--<font-awesome-icon v-else class="right" icon="chevron-down" />-->
                        </div>
                        <div class="data-type">
                            <!--<select>
                        <option v-for="dt in dataTypes" :value="dt" :key="dt">{{dt}}</option>
                    </select>-->
                            {{scope.field.type}} <span v-if="scope.field.truncated">(trunc.)</span>
                        </div>
                        <div>
                            <quality-bar :attribute="scope.field" />
                        </div>
                    </div>
                </template>
                <template #table-colgroup="scope">
                    <col v-for="field, inx in scope.fields" :key="field.key" :style="{border: '1px solid red'}">
                </template>
            </b-table>
            <div><small>{{$tc('common.pagerShowing', 0, {from: 1, to: 500, count: total})}}</small></div>
        </template>


        <context-menu ref="dataTypeCtxMenu" @ctx-cancel="resetCtxLocals" class="menu">
            <li v-for="dt in dataTypes" :key="dt" class="ctx-item" @click.prevent="changeColumnType(dt)">{{dt}}</li>
            <!--<li class="ctx-item"> Email </li>
            <li class="ctx-item"> Geospatial </li>
            <li class="ctx-item"> Object </li>-->
        </context-menu>

        <context-menu ref="ctxCellMenu" class="menu" @ctx-open="onCellCtxOpen" @ctx-cancel="resetCellCtxLocals">
            <template v-if="cellMenuData">
                <li class="ctx-item" @click="onFilter(cellMenuData.name, '!=', cellMenuData.value)">
                    <span class="fa fa-times text-danger"></span> <b>Remove</b> rows where
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
                <li class="ctx-item" @click="onFilter(cellMenuData.name, '==', cellMenuData.value)">
                    <span class="fa fa-check text-success"></span> <b>Keep</b> only rows where
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
                <li class="ctx-item"><span class="fa fa-eraser text-warning"></span> <b>Clear</b> cells where
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
                <!--
                <li class="ctx-item"><span class="fa fa-filter text-primary"></span> <b>Filter</b> on
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
                -->
                <li class="ctx-item"><span class="fa fa-flag"></span> <b>Flag</b> on
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
            </template>
        </context-menu>

        <context-menu ref="ctxMenu" @ctx-open="onCtxOpen" @ctx-cancel="resetCtxLocals" class="menu"
            @ctx-close="onCtxClose">
            <!--<li class="ctx-header">{{menuData && menuData.label}}</li>-->
            <template v-if="menuData && menuData.field && !menuData.field.locked">

                <li class="ctx-item" @click="renameColumn">
                    <span class="fa fa-edit text-secondary"></span> {{$t('actions.rename')}}
                </li>
                <li class="ctx-item" @click="changeColumnType">
                    {{$t('actions.changeDataType')}}
                </li>
                <li class="ctx-divider"></li>
                <!--
                <li class="ctx-item" @click="deleteColumn" key="actionSelect">
                    <span class="fa fa-columns"></span> Select columns to <b>keep</b> or to <b>delete</b>...
                </li>
                -->
                <li class="ctx-item" @click="deleteColumn" key="actionDelete">
                    <span class="fa fa-times text-danger"></span> {{$t('actions.delete')}}...
                </li>
                <!--
            <li class="ctx-item" @click="deleteColumn">
                <span class="fa fa-check text-success"></span> {{$t('actions.keep')}}...
            </li>
            -->
                <li class="ctx-item" @click="duplicateColumn">
                    <span class="fa fa-copy text-secondary"></span> {{$t('actions.duplicate')}}
                </li>
                <li class="ctx-item" @click="deleteColumn" key="actionMove">
                    <span class="fa fa-arrows-alt-h "></span> {{$t('actions.move')}}...
                </li>
                <!--<li class="ctx-item disabled">option two (disabled)</li>-->
                <!--
                <template v-if="menuData.field.type === 'Text' ">
                    <li class="ctx-divider"></li>
                    <li class="ctx-item">
                        <b>Convert</b> to lowercase
                    </li>
                    <li class="ctx-item">
                        <b>Convert</b> to uppercase
                    </li>
                </template>
                -->
                <!--
                <template v-if="menuData.field.type === 'Array' ">
                    <li class="ctx-divider"></li>
                    <li class="ctx-item" key="parseAction">
                        <span class="fa fa-exclamation"></span> <b>Parse</b> with numerical range ...
                    </li>
                </template>
                <template v-if="menuData.field.type === 'Boolean'">
                    <li class="ctx-divider"></li>
                    <li class="ctx-item" key="negateAction">
                        <span class="fa fa-exclamation"></span> <b>Negate/invert</b> boolean values ...
                    </li>
                </template>

                <template v-if="menuData.field.type === 'Date' || menuData.field.type == 'Time' ">
                    <li class="ctx-divider"></li>
                    <li class="ctx-item">
                        <span class="fa fa-calendar"></span> <b>Parse</b> with numerical range ...
                    </li>
                    <li class="ctx-item">
                        <b>Format</b> date ...
                    </li>
                    <li class="ctx-item" v-if="menuData.field.type === 'Date'">
                        <b>Extract</b> date components ...
                    </li>
                    <li class="ctx-item" v-if="menuData.field.type === 'Time'">
                        <b>Extract</b> time components ...
                    </li>
                </template>
                -->
                <li class="ctx-divider"></li>
                <li class="ctx-item" key="sortAsc" @click="sort('asc')">
                    <span class="fa fa-sort-alpha-up text-secondary"></span> <b>{{$t('actions.sort')}}</b> (ASC)
                </li>
                <li class="ctx-item" key="sortDesc" @click="sort('desc')">
                    <span class="fa fa-sort-alpha-down text-secondary"></span> <b>{{$t('actions.sort')}}</b> (DESC)
                </li>
                <li class="ctx-divider"></li>
                <template>
                    <li class="ctx-item" key="removeRowsEmptyCellsAction">
                        <span class="fa fa-fill-drip text-secondary"></span> Treat <b>empty value(s)</b>...
                    </li>
                    <li class="ctx-item" key="fillRowsEmptyCellsAction">
                        <span class="fa fa-exclamation-triangle text-warning"></span> Treat <b>invalid value(s)</b>...
                    </li>
                    <!--
                    <li class="ctx-item" key="removeRowsEmptyCellsAction">
                        <span class="fa fa-times text-danger"></span> <b>Remove rows</b> with empty cell(s)
                    </li>
                    <li class="ctx-item" key="fillRowsEmptyCellsAction">
                        <span class="fa fa-fill-drip text-secondary"></span> <b>Fill empty cells</b> with ...
                    </li>
                    -->
                    <!--
                    <li class="ctx-item">
                        <b>Remove invalid rows</b> for meaning <em>{{menuData.field.type}}</em>
                    </li>
                    <li class="ctx-item">
                        <b>Clear invalid cells</b> for meaning <em>{{menuData.field.type}}</em>
                    </li>
                    -->
                </template>
                <template v-if="menuData.field.type === 'Integer' || menuData.field.type == 'Decimal'">
                    <li class="ctx-divider"></li>
                    <li class="ctx-item">
                        <b>Redefine scale</b> ...
                    </li>
                    <li class="ctx-item" v-if="menuData.field.type == 'Decimal'">
                        <b>Round</b> to integer
                    </li>
                </template>
                <template>
                    <li class="ctx-divider"></li>
                    <li class="ctx-item" key="transformAction" @click="transform">
                        <span class="fa fa-cogs text-primary"></span> <b>Transform</b> with custom function ...
                    </li>
                    <!--
                    <li class="ctx-item" key="changeRepresentationAction">
                        <span class="fa fa-cogs text-primary"></span> <b>Change represention</b> with (One-Hot-Encoding)
                        ...
                    </li>
                    -->
                    <li class="ctx-item">
                        <span class="fa fa-filter text-success"></span> {{$t('actions.filter')}} ...
                    </li>
                    <!--
                    <li class="ctx-item">
                        <span class="fa fa-exchange-alt"></span> Replace value with...
                    </li>
                    -->
                    <!--
                    <li class="ctx-item">
                        <span class="fa fa-flag"></span> <b>New flag column </b> based on ...
                    </li>
                    -->


                    <li class="ctx-divider"></li>
                    <li class="ctx-item" @click="$refs.modalAnalyse.show()">
                        <span class="fa fa-chart-bar text-info"></span> {{$t('actions.analyse')}}...
                    </li>
                    <!--
                    <li class="ctx-item">
                        <span class="fa fa-palette text-warning"></span> <b>Color</b> column by value ...
                    </li>
                    -->
                </template>

                <li class="ctx-divider"></li>
                <li class="ctx-item" @click="$refs.modalOtherActions.show()">
                    <span class="fa fa-angle-double-right"></span> <b>More</b> actions...
                </li>
                <!--
                <li class="ctx-divider"></li>
                <li class="ctx-item" @click="toggleLock(true)">
                    <span class="fa fa-lock"></span> <b>Lock</b> column
                </li>
                -->
            </template>
            <template v-if="menuData && menuData.field && menuData.field.locked">
                <li class="ctx-item" @click="toggleLock(false)" key="unlock">
                    <span class="fa fa-lock-open"></span> <b>Unlock</b> column
                </li>
            </template>
        </context-menu>

        <b-modal ref="modalRenameColumn" :centered="true" button-size="sm" :title="$t('actions.rename')"
            :cancel-title="$t('actions.cancel')" @ok="renameColumn">
            <b-form-input class="form-control" v-model="menuData.field.label" autofocus></b-form-input>
        </b-modal>

        <simple-input ref="simpleInput" :cancel-title="simpleInput.cancelTitle" :ok-title="simpleInput.okTitle"
            :title="simpleInput.title" :message="simpleInput.message" :ok="simpleInput.okClicked"
            :initial="simpleInput.initial" />

        <b-modal ref="modalDeleteColumn" :centered="true" button-size="sm" :title="$t('actions.rename')"
            :cancel-title="$t('common.no')" :ok-title="$t('common.yes')">
            <b-form-input class="form-control" autofocus></b-form-input>
        </b-modal>

        <b-modal ref="modalAnalyse" :centered="true" button-size="sm" :title="$t('actions.analyse')" :ok-only="true"
            :ok-title="$t('common.yes')">
            <b-form-input class="form-control" autofocus></b-form-input>
        </b-modal>

        <b-modal ref="modalChangeDataType" :centered="true" button-size="sm" :title="$t('actions.analyse')"
            :ok-only="true">
            <b-form-select class="form-control" :options="dataTypes" v-model="menuData.field.type" autofocus />
        </b-modal>

        <modal-other-actions :attribute="menuData.field" @ok="otherActionsOk" ref="modalOtherActions" />

        <expression-editor :as-widget="false" :multiple="false" :field="propertyField" ref="expressionEditor"
            message="click" @click="saveExpression" />
    </div>
</template>
<script>
    import Vue from 'vue';
    import QualityBar from './QualityBar';
    import SimpleInput from './SimpleInput';
    import contextMenu from 'vue-context-menu';
    import { debounce } from '../../util.js';
    import Notifier from '../../mixins/Notifier.js';
    import ModalOtherActions from './ModalOtherActions.vue';
    import PreviewMenu from './PreviewMenu.vue';

    import ExpressionEditor from '../widgets/ExpressionEditor.vue';

    export default {
        mixins: [Notifier],
        components: { QualityBar, SimpleInput, contextMenu, ModalOtherActions, ExpressionEditor, PreviewMenu },
        data() {
            return {
                dataTypes: [
                    'Array', 'Boolean', 'Date', 'Decimal', 'Integer', 'JSON', 'Text', 'Time',],
                menuData: { field: { label: '', position: -1 } },
                cellMenuData: { row: 0, column: 0, value: null, name: null },
                currentColumnLabel: null,
                handleTableScroll: null,
                lastHeader: null,
                propertyField: { label: '' },
                simpleInput: {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    okClicked: () => { },
                    title: null,
                    initial: null,
                    message: null,
                },
                scrollEventSet: false,
                rightAlignedColumns: { type: String }
            }
        },
        props: {
            attributes: { type: Array, default: () => ['a'] },
            items: { type: Array },
            loading: { type: Boolean },
            service: { type: Object },
            total: { type: Number },
            serviceBus: { type: Object },
            missing: { type: Object },
            invalid: { type: Object },
        },
        watch: {
            attributes() {
                const rightAlinedTypes = new Set(['integer', 'date', 'decimal', 'boolean', 'time']);
                const rightAlignedColumns = [];

                const attributeIndexes = new Map();
                this.attributes.forEach((attr, inx) => {
                    if (rightAlinedTypes.has(attr.type.toLowerCase())) {
                        rightAlignedColumns.push(inx)
                    }
                    attributeIndexes.set(attr.key, inx);
                });
                if (rightAlignedColumns.length) {
                    this.rightAlignedColumns = rightAlignedColumns.map(v => `.table-preview td:nth-child(${v + 1})`).join(', ');
                } else {
                    this.rightAlignedColumns = null;
                }
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
            },
            items() {
                if (!this.scrollEventSet) {
                    this.$nextTick(() => this.$refs.table.$el.addEventListener('scroll', this.handleTableScrollEvent));
                    this.scrollEventSet = true;
                }
            }
        },
        mounted: function () {
            this.handleTableScroll = debounce(this.handleScroll, 100);
        },
        created() {
        },

        beforeDestroy() {
            this.$refs.table &&
                this.$refs.table.$el.removeEventListener(
                    'scroll', this.handleTableScrollEvent);
        },
        methods: {
            tableClick(item, rowIndex, event) {
                const cell = event.target.closest('td');
                const index = parseInt(cell.getAttribute('aria-colindex')) - 1;
                //this.customOpen(event, this.attributes[index], index);
                
                this.lastHeader && this.lastHeader.classList.remove('bg-info', 'text-white');
                const data = {column: index, field: this.attributes[index], 
                    label: this.attributes[index].key};
                const th = this.$refs.table.$el.querySelectorAll('th')[index];
                if (this.menuData.column !== data.column) {
                    this.lastHeader = th;
                    this.lastHeader.classList.add('bg-info', 'text-white')
                    this.menuData = data;
                } else {
                    this.resetMenuData();
                }
            },
            resetMenuData() {
                this.menuData = { field: { label: '', position: -1 } };
            },
            menuAction(options) {
                if (typeof this[options.action] === 'function') {
                    options.params.action = options.action;
                    this[options.action](...options.params);
                } else {
                    console.log(`Unknown action: ${options.action}`);
                }
            },
            otherActionsOk(data) {
                console.debug('Other actions', data)
            },
            handleTableScrollEvent() {
                this.$refs.ctxMenu.ctxVisible = false;
                this.$refs.ctxCellMenu.ctxVisible = false;
                this.$refs.dataTypeCtxMenu.ctxVisible = false;
            },

            customOpen(event, data, index) {
                let th;
                if (index !== undefined) {
                    th = this.$refs.table.$el.querySelectorAll('th')[index];
                } else {
                    th = event.target.closest('th');
                }
                this.lastHeader && this.lastHeader.classList.remove('bg-info', 'text-white');
                if (this.menuData.column !== data.column) {
                    this.lastHeader = th;
                    this.lastHeader.classList.add('bg-info', 'text-white')
                    this.menuData = data;
                } else {
                    this.resetMenuData();
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
            onCtxOpen(data) {
                this.menuData = data;
            },
            onCtxClose(data) {
                if (data.close === undefined || data.close)
                    this.lastHeader.classList.remove('bg-info', 'text-white');
            },
            onCellCtxOpen(data) {
                this.cellMenuData = data;
            },

            resetCtxLocals(data) {
                this.resetMenuData();
                this.lastHeader.classList.remove('bg-info', 'text-white')
            },
            resetCellCtxLocals(data) {
                this.cellMenuData = { row: 0, column: 0, value: null, name: null };
            },
            _eventModifier(evt, obj) {
                const proxy = new Proxy(evt, {
                    get: (target, prop) => obj[prop] || target[prop]
                })
                return new evt.constructor(evt.type, proxy)
            },
            /* Column actions */
            transform(functionName, ...params) {
                const alias = `${this.menuData.field.label}_${functionName}`;
                this.service.transformWithFunction(this.menuData.field.label,
                    alias, this.menuData.field.position, functionName, params);
                //this.$refs.expressionEditor.openModal();
            },
            saveExpression(expressionList) {
                this.service.transform(this.menuData.field.label,
                    this.menuData.field.position, expressionList);
            },
            deleteColumn() {
                //OK
                //this.$refs.modalDeleteColumn.show();
                const msg = this.$t('messages.confirmRemoveIt', '',
                    { what: `a coluna "${this.menuData.field.key}"` });
                const self = this;
                this.$bvModal.msgBoxConfirm(msg, {
                    title: this.$t('actions.confirm'),
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: this.$t('common.yes'),
                    cancelTitle: this.$t('common.no'),
                    centered: true
                }).then(value => {
                    if (value) {
                        self.service.deleteColumn(this.menuData.field.label);
                        this.resetMenuData();
                    }
                }).catch(err => {
                });
            },
            duplicateColumn() {
                //OK
                const modalConfig =
                {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informNewName'),
                    title: this.$t('actions.duplicate'),
                    value: this.menuData.field.label,
                    options: null,
                    ok: () => {
                        this.service.duplicateColumn(
                            this.menuData.field.label,
                            this.$refs.simpleInput.value);
                    }
                };
                this.$refs.simpleInput.show(modalConfig);
            },
            renameColumn() {
                //OK
                const modalConfig =
                {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informNewName'),
                    title: this.$t('actions.rename'),
                    value: this.menuData.field.label,
                    ok: () => {
                        this.service.renameColumn(
                            this.menuData.field.label,
                            this.$refs.simpleInput.value);
                    }
                };
                this.$refs.simpleInput.show(modalConfig);
                this.resetMenuData();
                /*
                this.$refs.modalRenameColumn.show();
                const col = this.attributes.find((f) => f.key === this.menuData.field.key);
                col.label = this.menuData.field.label;
                this.service.renameColumn();*/
            },
            changeColumnType() {
                const modalConfig =
                {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    message: this.$t('dataExplorer.informNewName'),
                    options: this.dataTypes,
                    title: this.$t('actions.changeDataType'),
                    value: this.menuData.field.type,
                    ok: () => {
                        this.service.changeColumnType(
                            this.menuData.field.label,
                            this.$refs.simpleInput.value);
                    }
                };
                this.$refs.simpleInput.show(modalConfig);
                /*if (this.dataTypes.includes(newType)) {
                    const col = this.attributes.find((f) => f.key === this.menuData.field.key);
                    if (col) {
                        this.service.changeColumnType(
                            this.menuData.field.label,
                            newType);
                        ///col.type = newType;
                    }
                }*/
            },
            sort(direction) {
                this.service.sort(this.menuData.field.label, direction);
            },

            toggleLock(state) {
                const col = this.attributes.find((f) => f.key === this.menuData.field.key);
                if (col) {
                    col.locked = state;
                }
            },

            /**/
            tableContextMenu(item, index, event) {
                event.preventDefault();
                const columnIndex = parseInt(event.target.getAttribute('aria-colindex'));
                const attribute = this.attributes[columnIndex - 1];
                this.$refs.ctxCellMenu.open(this._eventModifier(event, {}),
                    {
                        row: index + 1,
                        column: columnIndex,
                        value: ['Text', 'Date', 'Datetime', 'Time'].includes(attribute.type)
                            ? `"${event.target.innerText.substring(0, 80)}"`
                            : event.target.innerText,
                        name: attribute.label,
                    })
            },
            // Cell context menu
            onFilter(attributeName, operator, attributeValue) {
                this.serviceBus.$emit('onFilter', attributeName, operator, attributeValue);
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

    .table {
        color: #aaa;
        font-size: 10pt;
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
        /*min-width: 100px;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        */
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
        width: 50%;
        left: 25%;
        text-align: center;
        position: absolute;
        top: 100px;
    }
</style>