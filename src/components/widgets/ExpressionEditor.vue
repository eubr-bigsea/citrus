<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <textarea disabled :value="displayValue" class="form-control code" rows="4"></textarea>
        <b-link v-b-modal="'expressionModal'" variant="sm">
            {{$t('property.editValue')}}
        </b-link>
        <b-modal id="expressionModal" size="lg" :title="field.label" :hide-header="true" :cancel-title="$t('actions.cancel')"
            ref="modal">
            <div class="row">
                <div class="col-md-9">
                    <table class="table table-sm" v-if="expressionList && expressionList.length">
                        <thead>
                            <th> {{$t('property.expression.title')}}</th>
                            <th v-if="values.alias !== false"> {{$t('property.expression.alias')}}</th>
                            <th style="width:12%"></th>
                        </thead>
                        <tbody>
                            <template v-for="(row, index) in expressionList">
                                <tr>
                                    <td style="width: 65%">
                                        <textarea type="text" class="form-control" @keyup="changed($event, row, 'expression')"
                                            @blur="elementBlur(row, $event)" style="height: 40px" @paste="changed($event, row, 'expression')">{{row.expression}}</textarea>
                                        <div class="label label-danger" v-if="row.error">{{row.error}}</div>
                                    </td>
                                    <td v-if="values.alias !== false" style="width: 35%">
                                        <input class="form-control" :value="row.alias" @change="updated($event, row, 'alias')" />
                                    </td>
                                    <td style="width:2%" class="text-center">
                                        <a href="#" @click.prevent="remove($event, index)">
                                            <span class="fa fa-2x fa-minus-circle"></span>
                                        </a>
                                    </td>
                                </tr>

                            </template>
                        </tbody>
                    </table>
                    <div v-else class="border pt-5 pb-5 pl-3">
                        <div class="label label-info">{{$t('property.noExpressions')}}</div>
                    </div>
                </div>
                <div class="col-md-3 border-left">
                    <strong>{{$tc('property.expression.availableAttribute', 2)}}:</strong>
                    <select class="form-control no-border mt-2" size="10" @dblclick="copyAttributeName">
                        <option v-for="sg in suggestions">{{sg}}</option>
                    </select>
                    <small>{{$t('property.copyAttributeName')}}</small>
                </div>
            </div>

            <div class="margin-top-10">
                <div class="push-right">
                    <button class="btn btn-success btn-sm text-right" @click.prevent="add">
                        <span class="fa fa-plus"></span> {{$t('actions.simpleAdd')}}</button>
                </div>
            </div>
            <p class="mt-2">
                {{$t('property.expression.explanation')}}
                <span v-html="$t('property.expression.tip')"></span> &nbsp;
                <span v-html="$t('property.expression.validExpressions')"></span>

            </p>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn @click.prevent="okClicked" variant="primary" class="mr-1">{{$t('common.ok')}}</b-btn>
                <b-btn @click.prevent="cancelClicked" variant="secondary">{{$t('actions.cancel')}}</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue';
    import jsep from 'jsep';
    export default {
        computed: {
            displayValue() {
                if (this.value) {
                    return this.value.map((v) => {
                        if (this.values.alias !== false){
                            return `${v.alias} = ${v.expression}`
                        } else {
                            return v.expression;
                        }
                    }).join('\n')
                } else {
                    return ''
                }
            },
            values(){
                return this.field.values ? JSON.parse(this.field.values): {}
            },
        },
        components: {
            LabelComponent
        },
        data() {
            return {
                expressionValue: '',
                expressionList: this.value,
                lastEdited: {},
            }
        },
        methods: {
            elementBlur(row, event) {
                this.lastEdited = { row, el: event.target }
            },
            updated(e, row, attr) {
                row[attr] = e.target.value;

                if (attr === 'expression') {
                    try {
                        let tree = jsep(e.target.value || '');
                        jsep.addBinaryOp("=>", 1);
                        jsep.removeBinaryOp('^');
                        row['error'] = null;
                        row['tree'] = tree
                    } catch (e) {
                        row['error'] = e.toString();
                    }
                }
            },
            okClicked(e) {
                this.$root.$emit(this.message, this.field,
                    this.expressionList);
                this.$refs.modal.hide();
            },
            cancelClicked(e) {
                this.$refs.modal.hide();
            },
            changed: _.debounce(function (e, row, attr) {
                this.updated(e, row, attr);
            }),
            add(e) {
                if (this.expressionList === null) {
                    this.expressionList = [];
                }
                this.expressionList.push({
                    alias: '', expression: '', error: '',
                    tree: ''
                })
            },
            remove(e, index) {
                this.expressionList.splice(index, 1);
                e.stopPropagation();
                e.preventDefault();
                return false;
            },
            copyAttributeName(v) {
                if (this.lastEdited && this.lastEdited.el){
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
                    this.updated({target: el}, this.lastEdited.row, 'expression')
                    this.lastEdited.el.focus();
                }
            }
        },
        props: {
            addOperators: {},
            value: {},
            removeOperators: {},
            field: {},
            suggestions: {
                type: Array,
                default: []
            },
            message: {
                type: String,
                default: 'update-form-field-value'
            }
        },
    }
</script>