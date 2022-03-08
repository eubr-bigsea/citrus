<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <textarea disabled :value="displayValue" class="form-control code" rows="4"></textarea>
        <b-link v-if="!readOnly" @click.prevent="openModal" variant="sm">
            {{$t('property.editValue')}}
        </b-link>
        <b-modal id="expressionModal" size="xl" :title="field.label" :hide-header="true"
            :cancel-title="$t('actions.cancel')" ref="modal">
            <div class="context-help" :class="{'d-none': !help}" v-html="help"
                :style="{top: positionTop + 'px', left: positionLeft + 'px'}">
            </div>
            <div class="row" @click="closeTooltip">
                <div class="col-md-4 reference">
                    <h6>Referência</h6>
                    <b-tabs card>
                        <b-tab title="Funções" class="p-1">
                            <select class="form-control shadow-none" @change="changeFunctionType($event)">
                                <option value="all">Todas</option>
                                <option v-for="f in treeData" :key="f.key" :value="f.key">{{f.name}}</option>
                            </select>
                            <select class="form-control shadow-none" size="10" @change="displayFunctionHelp($event)" @dblclick="copyPasteValue">
                                <option v-for="f in displayFunctions" :key="f" :value="f">{{f}}</option>
                            </select>
                            <div class="function-help" v-html="currentFunctionHelp"> </div>
                        </b-tab>
                        <b-tab title="Atributos">
                            <select class="form-control shadow-none" size="18" @dblclick="copyPasteValue">
                                <option v-for="sg in suggestions">{{sg}}</option>
                            </select>
                        </b-tab>
                        <b-tab title="Operadores" class="p-0">
                            <table class="table operators-table table-sm table-borderless" v-if="operators">
                                <template v-for="(group, groupName) in operators">
                                    <tr>
                                        <th colspan="2">{{groupName}}</th>
                                    </tr>
                                    <tr v-for="(description, op) in group">
                                        <td style="width:20px" class="text-center">{{op}}</td>
                                        <td>{{description}}</td>
                                    </tr>
                                </template>
                            </table>
                        </b-tab>
                    </b-tabs>
                    <small>{{$t('property.copyAttributeName')}}</small>
                </div>
                <div class="col-md-8">
                    <form v-if="expressionList && expressionList.length" onsubmit="return false" ref="form" action="">
                        <table class="table table-sm expression-table">
                            <thead>
                                <th> {{$t('property.expression.title')}}</th>
                                <th v-if="values.alias !== false"> {{$t('property.expression.alias')}}</th>
                                <th style="width:12%"></th>
                            </thead>
                            <tbody>
                                <template v-for="(row, index) in expressionList">
                                    <tr>
                                        <td class="expression-editor-area autocomplete">
                                            <input type="text" class="form-control" :class="{'text-danger': row.error}"
                                                @keyup="onKeyUp($event, row, 'expression')" ref="expr"
                                                @blur="elementBlur(row, $event)" v-focus
                                                @paste="changed($event, row, 'expression')" :value="row.expression"
                                                required @dblclick="debugExpression(row)"/>
                                            <ul v-show="isOpen" class="autocomplete-results">
                                                <li v-for="(result, i) in suggestionResults" :key="i"
                                                    @click="setResult(result)" class="autocomplete-result"
                                                    :class="{ 'is-active': i === arrowCounter }">
                                                    {{ result }}
                                                </li>
                                            </ul>
                                            <small class="label text-danger" v-html="row.error"></small>
                                            <!-- <small>{{row}}</small> -->
                                        </td>
                                        <td v-if="values.alias !== false" style="width: 20%">
                                            <input class="form-control" :value="row.alias" required
                                                @change="updated($event, row, 'alias')" />
                                        </td>
                                        <td style="width:2%" class="text-center">
                                            <a href="#" @click.prevent="remove($event, index)"
                                                class="btn btn-danger btn-sm">
                                                <!-- <span class="fa fa-minus-circle text-danger"></span> -->
                                                <font-awesome-icon icon="trash"></font-awesome-icon>
                                            </a>
                                        </td>
                                    </tr>

                                </template>
                            </tbody>
                        </table>
                    </form>
                    <div v-else class="border pt-5 pb-5 pl-3">
                        <div class="label label-info">{{$t('property.noExpressions')}}</div>
                    </div>

                </div>
                <div class="col-md-12">
                    <button class="btn btn-success btn-sm float-right" @click.prevent="add">
                        <span class="fa fa-plus"></span> {{$t('actions.simpleAdd')}}</button>
                </div>
                <!-- <div class="col-md-4 border-left">
                    <strong>{{$tc('property.expression.availableAttribute', 2)}}:</strong>
                    <select class="form-control no-border mt-2" size="10" @dblclick="copyPasteValue"
                        style="font-size:.9em">
                        <option v-for="sg in suggestions">{{sg}}</option>
                    </select>
                    <small>{{$t('property.copyAttributeName')}}</small>
                </div> -->


            </div>


            <small class="mt-2">
                {{$t('property.expression.explanation')}}
                <span v-html="$t('property.expression.tip')"></span> &nbsp;
                <span v-html="$t('property.expression.validExpressions')"></span>
                
            </small>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn @click.prevent="okClicked" variant="primary" class="btn-sm mr-1">{{$t('common.ok')}}</b-btn>
                <b-btn @click.prevent="cancelClicked" variant="secondary" class="btn-sm ">{{$t('actions.cancel')}}</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import jsep from 'jsep';
    import LabelComponent from './Label.vue';
    import Widget from '../../mixins/Widget.js';
    import { debounce } from '../../util.js';
    import functionsHelp from '../../i18n/functions.js';
    import TreeItemComponent from '../TreeItem.vue';
    import Notifier from '../../mixins/Notifier';

    export default {
        mixins: [Widget, Notifier],
        computed: {
            displayValue() {
                if (this.value && this.value.map) {
                    return this.value.map((v) => {
                        if (this.values.alias !== false) {
                            return `${v.alias} = ${v.expression}`
                        } else {
                            return v.expression;
                        }
                    }).join('\n')
                } else {
                    return ''
                }
            },
            values() {
                return this.field.values ? JSON.parse(this.field.values) : {}
            },
        },
        components: { LabelComponent, TreeItemComponent },
        data() {
            return {
                expressionValue: '',
                expressionList: null,
                help: null,
                lastEdited: {},
                positionLeft: 0,
                positionTop: 0,
                suggestions: [],
                suggestionResults: ['abs', 'acos', 'asin'],
                isOpen: false,
                arrowCounter: 0,
                treeData: [],
                operators: [],
                displayFunctions: [],
                currentFunctionHelp: null,
            }
        },
        methods: {
            openModal() {
                this.$refs.modal.show();
                if (this.suggestionEvent) {
                    this.suggestions = this.suggestionEvent();
                }
                this.expressionList = this.value && this.value.map
                    ? this.value.map(a => ({ ...a })) : []; // copy values
                if (this.expressionList.length === 0) {
                    this.add();
                }
            },
            elementBlur(row, event) {
                this.lastEdited = { row, el: event.target };
                //this.help = '';
            },
            updated(e, row, attr) {
                row[attr] = e.target.value;
                if (attr === 'expression') {
                    try {

                        jsep.addBinaryOp(">=", 1);
                        jsep.removeBinaryOp('^');
                        const tree = jsep(e.target.value || '');
                        row['error'] = null;
                        row['tree'] = tree
                        if (tree.type.includes("Compound")) {
                            row['error'] = this.$t('widgets.expressionEditor.unsupportedCompounded')
                        }
                    } catch (e) {
                        const error = e.toString();
                        const pos = error.lastIndexOf("at ");
                        let position = error.substring(pos, error.length);
                        position = position.replace('at character', this.$t('widgets.expressionEditor.atPosition'))
                        if (error.includes("Unclosed quote")) {
                            row['error'] = this.$t('widgets.expressionEditor.unclosedQuoteAfter') +
                                ' ' + position;
                        } else if (error.includes("Expected expression")) {
                            row['error'] = this.$t('widgets.expressionEditor.expectedExpression') +
                                ' ' + position;
                        } else if (error.includes("Expected")) {
                            row['error'] = this.$t('widgets.expressionEditor.expected') +
                                ' <b>' + error.substring(16, pos) + '</b> ' + position;
                        } else if (error.includes("Unexpected")) {
                            row['error'] = this.$t('widgets.expressionEditor.unexpected') +
                                ' ' + position;
                        } else {
                            row['error'] = error;
                        }
                    }
                }
            },
            validate() {
                return this.expressionList.filter(expr => {
                    return !(expr.expression && (!this.values.alias || expr.alias) && !expr.error);
                }).length == 0;
            },
            okClicked(e) {
                const result = this.$refs.form && this.$refs.form.reportValidity() & this.validate();
                if (result) {
                    this.triggerUpdateEvent(this.message, this.field,
                        this.expressionList);

                        this.triggerUpdateEvent(this.message, this.field, this.expressionList);

                    this.$refs.modal.hide();
                } else {
                    this.error(null, this.$t('errors.missingRequiredValueOrInvalid'));
                }
                return result;
            },
            cancelClicked(e) {
                this.expressionList = this.expressionList = this.value && this.value.map
                    ? this.value.map(a => ({ ...a })) : []; // copy values
                this.$refs.modal.hide();
            },
            onKeyUp(e, row, attr) {
                const value = e.target.value;
                if (e.ctrlKey && e.key === ' ') {
                    const pos = e.target.selectionStart;
                    if (pos > 0) {
                        const parts = value.substring(0, pos).split(/\b/);
                        if (parts.length) {
                            const triggerValue = parts.slice(-1)[0];
                            //console.debug('CTRL Space ', triggerValue);
                            this.isOpen = true;
                        }
                    }
                    return true;
                } else {
                    return this.changed(e, row, attr);
                }
            },
            closeTooltip() {
                this.help = '';
            },
            changed: debounce(function (e, row, attr) {
                const pos = e.target.selectionStart;
                const value = e.target.value;
                if (pos > 0 && value.charAt(pos - 1) === '(') {
                    let parts = value.substring(0, pos - 1).split(/\b/);
                    const resources = functionsHelp[this.$i18n.locale]['functions'];
                    if (parts.length) {
                        const functionName = parts.slice(-1)[0];
                        this.help = resources[functionName];
                        const bodyRect = document.body.getBoundingClientRect();
                        const elemRect = e.target.getBoundingClientRect();
                        this.positionTop = parseInt(elemRect.top + elemRect.height - 15);
                        this.positionLeft = 10;//parseInt(elemRect.left - bodyRect.left);
                    }
                } else {
                    this.help = '';
                }
                this.updated(e, row, attr);
                return true;
            }, 100),
            add(e) {
                if (this.expressionList === null || this.expressionList === '') {
                    this.expressionList = [];
                }
                this.expressionList.push({
                    alias: '', expression: '', error: '', tree: ''
                });
                this.$nextTick(() => {
                    this.$nextTick(() => {
                        let j = this.expressionList.length - 1;
                        if (this.$refs.expr[j])
                            this.$refs.expr[j].focus()
                    })
                })
            },
            remove(e, index) {
                const removed = this.expressionList.splice(index, 1);
                if (this.lastEdited && removed[0] === this.lastEdited.row) {
                    this.lastEdited = null;
                }
            },
            copyPasteValue(v) {
                if (this.$refs.expr && this.$refs.expr.length > 0 && ! (this.lastEdited)){
                    this.lastEdited = {
                        el: this.$refs.expr[this.$refs.expr.length - 1], 
                        row: this.expressionList[this.$refs.expr.length - 1]};
                }
                if (this.lastEdited && this.lastEdited.el) {
                    // console.debug(this.lastEdited.row)
                    // if (this.lastEdited.row && 
                    //     this.expressionList.includes(this.lastEdited.row)){
                    //     this.lastEdited.row.expression += ' ' + v.target.value;
                    // }
                    const el = this.lastEdited.el;
                    const startPos = el.selectionStart;
                    const endPos = el.selectionEnd;
                    const value = el.value.substring(0, startPos) +
                        v.target.value + el.value.substring(endPos, el.value.length);
                    el.value = value;
                    // this.lastEdited.row.expression = value;
                    this.updated({ target: el }, this.lastEdited.row, 'expression')
                    this.lastEdited.el.focus();
                }
            },
            updateDisplayedFunctions(functionType) {
                if (functionType === 'all') {
                    this.displayFunctions = [... new Set(this.treeData.flatMap(ft => ft.children))]
                        .sort((a, b) => a.localeCompare(b));

                } else {
                    this.displayFunctions = this.treeData.filter(f => f.key === functionType)
                        .flatMap(ft => ft.children)
                        .sort((a, b) => a.localeCompare(b));
                }
                this.displayFunctionHelp(null);
            },
            changeFunctionType(event) {
                this.updateDisplayedFunctions(event.target.value);
            },
            displayFunctionHelp(event) {
                let current;
                if (event === null) {
                    current = this.displayFunctions[0];
                } else {
                    current = event.target.value;
                }
                this.currentFunctionHelp = functionsHelp[this.$i18n.locale].functions[current];
            },
            debugExpression(row) {
                console.debug(row);
                console.debug(JSON.stringify(row));
            }
        },
        props: {
            addOperators: {},
            removeOperators: {},
        },
        mounted() {
            const resources = functionsHelp[this.$i18n.locale];
            this.treeData = resources.tree.functions.sort((a, b) => a.name.localeCompare(b.name));
            this.operators = resources.operators;
            this.updateDisplayedFunctions('all');
            this.lastEdited =  this.expressionList && this.expressionList.length > 0 ? this.expressionList.length - 1: {};
        }
    }
</script>
<style>
    .expression-editor-area {
        width: 85%;
        position: relative;
    }

    .expression-editor-area textarea{
        font-size: 9pt;
    }
    table.operators-table td, table.operators-table th {
        font-size: 9pt;
        padding: 1px 4px;
    }

    .context-help {
        background: #f9ffcc;
        border: 1px solid #888;
        color: #222;
        font-size: .8em;
        margin: 0 20px;
        padding: 2px 4px;
        position: absolute;
        z-index: 99;
    }

    .context-help i,
    .function-help i {
        font-style: normal !important;
        color: navy;
        font-family: 'Courier New', Courier, monospace;
        font-size: 10pt;
    }

    .expression-table input {
        height: 30px;
    }

    .expression-table input,
    textarea {
        font-size: .8em;
    }

    .reference,
    .reference select,
    .reference input {
        font-size: 9pt;
    }

    .reference .nav-link {
        padding: 5px;
    }

    .function-help {
        border: 1px solid #ddd;
        background-color: #fafafa;
        height: 120px;
        margin-top: 5px;
        padding: 5px;
        overflow: auto;
    }
</style>
<style>
    .autocomplete {
        position: relative;
        width: 130px;
    }

    .autocomplete-results {
        padding: 0;
        margin: 0;
        border: 1px solid #eeeeee;
        height: 120px;
        overflow: auto;
        width: 100%;
    }

    .autocomplete-result {
        list-style: none;
        text-align: left;
        padding: 4px 2px;
        cursor: pointer;
    }

    .autocomplete-result.is-active,
    .autocomplete-result:hover {
        background-color: #4aae9b;
        color: white;
    }
</style>
