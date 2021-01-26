<template>
    <div>
        <b-table :no-border-collapse="false" :items="items" :fields="fields" tbody-class="body" sticky-header="500px"
            class="table" @row-contextmenu="tableContextMenu" outlined small hover striped bordered responsive
            ref="table">
            <template #head()="scope">
                <div style="cursor: default;" @click.prevent="customOpen($event, scope)" class="clearfix">
                    <div class="float-left column-name">{{scope.label}}</div>
                    <font-awesome-icon v-if="scope.field.locked" class="float-right" icon="lock" />
                    <font-awesome-icon v-else class="float-right" icon="chevron-down" />
                </div>
                <div class="data-type">
                    <!--<select>
                        <option v-for="dt in dataTypes" :value="dt" :key="dt">{{dt}}</option>
                    </select>-->
                    {{scope.field.type}}
                </div>
                <div>
                    <quality-bar></quality-bar>
                </div>
            </template>
        </b-table>

        <context-menu ref="dataTypeCtxMenu" @ctx-cancel="resetCtxLocals" class="menu">
            <li v-for="dt in dataTypes" :key="dt" class="ctx-item" @click.prevent="changeColumnType(dt)">{{dt}}</li>
            <!--<li class="ctx-item"> Email </li>
            <li class="ctx-item"> Geospatial </li>
            <li class="ctx-item"> Object </li>-->
        </context-menu>

        <context-menu ref="ctxCellMenu" class="menu" @ctx-open="onCellCtxOpen" @ctx-cancel="resetCellCtxLocals">
            <template v-if="cellMenuData">
                <li class="ctx-item"><span class="fa fa-times text-danger"></span> <b>Remove</b> rows where
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
                <li class="ctx-item"><span class="fa fa-check text-success"></span> <b>Keep</b> only rows equal to
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
                <li class="ctx-item"><span class="fa fa-eraser text-warning"></span> <b>Clear</b> cells equal to
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
                <li class="ctx-item"><span class="fa fa-filter text-primary"></span> <b>Filter</b> on
                    <b><code>{{cellMenuData.name}}={{cellMenuData.value}}</code></b>
                </li>
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
                    <li class="ctx-item" key="transformAction">
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
                <li class="ctx-item" @click="$refs.modalMoreActions.show()">
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

        <b-modal ref="modalMoreActions">
            <ul>
                <li>DATA CLEASING</li>
                <li><b>Move</b> invalid cells for meaning Integer to column_invalid</li>
                <li><b>Remove</b> rows with no value</li>
                <li><b>Fill</b> empty rows with ...</li>
                <li><b>Fill</b> empty rows with previous value</li>
                <li>TRANSFORMATION</li>
                <li><b>Duplicate</b> column</li>
                <li><b>Find</b> and <b>replace</b>...</li>

                <li>Remove invalid rows for meaning</li>
                <li>Clear invalid cells for meaning</li>


                <li>Discretize (bin) (fixed, with/without start; custom)</li>
            </ul>


        </b-modal>
    </div>
</template>
<script>
    import QualityBar from './QualityBar';
    import SimpleInput from './SimpleInput';
    import contextMenu from 'vue-context-menu';
    import { debounce } from '../../util.js';
    import Notifier from '../../mixins/Notifier.js';

    export default {
        mixins: [Notifier],
        components: { QualityBar, SimpleInput, contextMenu },
        data() {
            return {
                dataTypes: [
                    'Array', 'Boolean', 'Date', 'Decimal', 'Integer', 'JSON', 'Text', 'Time',],
                menuData: { field: { label: '' } },
                cellMenuData: { row: 0, column: 0, value: null, name: null },
                currentColumnLabel: null,
                handleTableScroll: null,
                lastHeader: null,
                simpleInput: {
                    okTitle: this.$t('common.ok'),
                    cancelTitle: this.$t('actions.cancel'),
                    okClicked: () => { },
                    title: null,
                    initial: null,
                    message: null,
                }
            }
        },
        props: {
            fields: { type: Array, default: () => ['a'] },
            items: { type: Array },
            service: { type: Object },
        },
        mounted: function () {
            this.handleTableScroll = debounce(this.handleScroll, 100);
            this.$refs.table.$el.addEventListener('scroll', this.handleTableScrollEvent);
        },
        created() {
        },

        beforeDestroy() {
            this.$refs.table.$el.removeEventListener('scroll', this.handleTableScrollEvent);
        },
        methods: {
            handleTableScrollEvent() {
                this.$refs.ctxMenu.ctxVisible = false;
                this.$refs.ctxCellMenu.ctxVisible = false;
                this.$refs.dataTypeCtxMenu.ctxVisible = false;
            },

            customOpen(event, data) {
                const th = event.target.closest('th');
                this.lastHeader = th;
                this.lastHeader.classList.add('bg-info', 'text-white')
                const rect = th.getBoundingClientRect();
                const clientX = rect.left + window.pageXOffset;
                this.$refs.ctxMenu.open(this._eventModifier(event,
                    {
                        clientX: clientX > 0 ? clientX : 0,
                        clientY: th.offsetTop + 50
                    }), data);
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
                this.menuData = { field: { label: '' } };
                this.lastHeader.classList.remove('bg-info', 'text-white')
            },
            resetCellCtxLocals(data) {
                this.cellMenuData = { row: 0, column: 0, value: null, name: null };
            },
            getTdClass(value, key, item) {
                //console.debug(value, key, item)
                const col = this.fields.find((f) => f.key === key);
                if (col) {
                    return `dt-${col.type.toLowerCase()}`;
                }
                return '';
            },
            _eventModifier(evt, obj) {
                const proxy = new Proxy(evt, {
                    get: (target, prop) => obj[prop] || target[prop]
                })
                return new evt.constructor(evt.type, proxy)
            },
            /* Column actions */
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
                    if (value)
                        self.service.deleteColumn(this.menuData.field.label);
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
                /*
                this.$refs.modalRenameColumn.show();
                const col = this.fields.find((f) => f.key === this.menuData.field.key);
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
                    const col = this.fields.find((f) => f.key === this.menuData.field.key);
                    if (col) {
                        this.service.changeColumnType(
                            this.menuData.field.label,
                            newType);
                        ///col.type = newType;
                    }
                }*/
            },
            toggleLock(state) {
                const col = this.fields.find((f) => f.key === this.menuData.field.key);
                if (col) {
                    col.locked = state;
                }
            },
            tableContextMenu(item, index, event) {
                event.preventDefault();
                const columnIndex = parseInt(event.target.getAttribute('aria-colindex'));
                const field = this.fields[columnIndex - 1];
                this.$refs.ctxCellMenu.open(this._eventModifier(event, {}),
                    {
                        row: index + 1,
                        column: columnIndex,
                        value: ['Text', 'Date', 'Time'].includes(field.type)
                            ? `"${event.target.innerText.substring(0, 20)}"`
                            : event.target.innerText,
                        name: field.label,
                    })
            }
        },
    }
</script>
<!--
<style>
    ul.dropdown-menu {
        position: fixed;
        left: auto;
        top: auto;
    }
</style>
-->
<style scoped>
    div.menu>>>li {
        font-size: .9em;
        margin: 0;
        min-width: 200px;
    }

    .table {
        color: #aaa;
        font-size: .8em;

        -webkit-touch-callout: none;
        /* iOS Safari */
        -webkit-user-select: none;
        user-select: none
    }

    .table>>>td {
        min-width: 120px;
    }

    .table>>>td.dt-integer,
    .table>>>td.dt-date,
    .table>>>td.dt-decimal,
    .table>>>td.dt-boolean,
    .table>>>td.dt-time {
        text-align: right;
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
</style>