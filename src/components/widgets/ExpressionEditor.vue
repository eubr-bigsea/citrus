<template>
    <div>
        <LabelComponent :field="field"></LabelComponent>
        <textarea disabled :value="displayValue" class="form-control" rows="4"></textarea>
        <b-link v-b-modal="'lookupModal'" variant="sm">
            {{$t('actions.editValue')}}
        </b-link>

        <b-modal id="lookupModal" size="lg" :title="field.label" :cancel-title="$t('actions.cancel')" ref="modal">
            <div slot="header">
                <h4>Expression</h4>
                <em>Construct an expression to transform data</em>
            </div>

            <div class="body" slot="body">
                <div>
                    <table class="table table-bordered" v-if="expressionList && expressionList.length">
                        <thead>
                            <th>Attribute</th>
                            <th>Alias</th>
                            <th style="width:15%"></th>
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
                                    <td style="width:10%" rowspan="2">
                                        <a href="#" @click.prevent="remove($event, index)">
                                            <span class="fa fa-2x fa-minus-circle"></span>
                                        </a>
                                        <a href="#" @click.prevent="moveUp($event, index)" v-if="index !== 0">
                                            <span class="fa fa-2x fa-chevron-circle-up"></span>
                                        </a>
                                        <a href="#" @click.prevent="moveDown($event, index)" v-if="index !== (expressionList.length-1)">
                                            <span class="fa fa-2x fa-chevron-circle-down"></span>
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
                        <button class="btn btn-success btn-sm" @click="add">
                            <span class="fa fa-plus-circle"></span> Add</button>
                    </div>
                </div>

            </div>
            <div slot="modal-footer" class="w-100 text-right">
                    <b-btn @click="okClicked" variant="primary" class="mr-1">{{$t('common.ok')}}</b-btn>
                    <b-btn @click="cancelClicked" variant="secondary">{{$t('actions.cancel')}}</b-btn>
                </div>
        </b-modal>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default {
        computed: {
            displayValue() {
                if (this.value) {
                    return this.value.map((v) => {
                        if (this.parameters.options.show_alias) {
                            return `${v.alias} = ${v.f}(${v.attribute})`
                        } else {
                            return `${v.f}(${v.attribute})`
                        }
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
                dateFunctions: [
                    'current_date', 'current_timestamp',
                    'date_add', 'date_format', 'date_sub',
                    'datediff', 'dayofmonth', 'dayofyear',
                ],
                showModal: false,
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
                $this.$root.$emit('update-expression',
                    this.expressionList);
                this.showModal = false;
            },
            cancelClicked(e) {
                this.showModal = false;
            },
            changed: _.debounce(function (e, row, attr) {
                this.updated(e, row, attr);
            }),
            selectTab(tab) {
                this.currentTab = tab;
            },
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
            moveUp(e, index) {
                let tmp = this.expressionList.splice(index, 1)[0];
                this.expressionList.splice(index - 1, 0, tmp);
                e.stopPropagation();
                return false;
            },
            moveDown(e, index) {
                let tmp = this.expressionList.splice(index, 1)[0]
                this.expressionList.splice(index + 1, 0, tmp);
                e.stopPropagation();
                return false;
            },
        },
        props: {
            addOperators: {},
            value: {},
            removeOperators: {},
            field: {}
        },
    }
</script>