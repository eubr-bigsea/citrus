<template>
    <div>
        <LabelComponent :field="field"></LabelComponent>
        <textarea disabled :value="displayValue" class="form-control code" rows="4"></textarea>
        <b-link v-b-modal="'expressionModal'" variant="sm">
            {{$t('property.editValue')}}
        </b-link>

        <b-modal id="expressionModal" size="lg" :title="field.label" :cancel-title="$t('actions.cancel')" ref="modal">

            <p>
                {{$t('property.expression.explanation')}}
                <span v-html="$t('property.expression.tip')"></span>
                <span v-html="$t('property.expression.validExpressions')"></span>

            </p>

            <table class="table table-bordered table-sm table-stripe" v-if="expressionList && expressionList.length">
                <thead>
                    <th> {{$t('property.expression.title')}}</th>
                    <th> {{$t('property.expression.alias')}}</th>
                    <th style="width:12%"></th>
                </thead>
                <tbody>
                    <template v-for="(row, index) in expressionList">
                        <tr>
                            <td style="width: 60%">
                                <textarea type="text" class="form-control" @keyup="changed($event, row, 'expression')" style="height: 40px" @paste="changed($event, row, 'expression')">{{row.expression}}</textarea>
                                <div class="label label-danger" v-if="row.error">{{row.error}}</div>
                            </td>
                            <td>
                                <input class="form-control" :value="row.alias" @change="updated($event, row, 'alias')" />
                            </td>
                            <td style="width:2%" class="text-center">
                                <a href="#" @click.prevent="remove($event, index)">
                                    <span class="fa fa-2x fa-minus-circle"></span>
                                </a>
                            </td>
                        </tr>
                        <!--
                                    <tr>
                                        <td colspan="2">
                                            <pre style="height: 80px; overflow:auto"><code>{{ row.tree }}</code></pre>
                                        </td>
                                    </tr>
                                    -->
                    </template>
                </tbody>
            </table>
            <div v-else>
                <div class="label label-info">Click the Add button to include a new filter.</div>
            </div>
            <div class="margin-top-10">
                <button class="btn btn-success btn-sm" @click.prevent="add">
                    <span class="fa fa-plus"></span> {{$t('actions.add', {type: $t('property.expression.title').toLowerCase()})}}</button>
            </div>
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
                        return `${v.alias} = ${v.expression}`
                    }).join('\n')
                } else {
                    return ''
                }
            }
        },
        components: {
            LabelComponent
        },
        data() {
            return {
                expressionValue: '',
                expressionList: this.value,
            }
        },
        methods: {
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
        },
        props: {
            addOperators: {},
            value: {},
            removeOperators: {},
            field: {},
            message: {
                type: String,
                default: 'update-form-field-value'
            }
        },
    }
</script>