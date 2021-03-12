<template>
    <div>
        <b-modal size="xl" ref="modal" @ok="okClicked" button-size="sm">

            <template #modal-header>
                <strong>{{attribute.label}} </strong>
                <small class="float-right">(#{{attribute.position}}) {{attribute.type}}</small>
            </template>

            <div class="row moreOptions">
                <div class="col-md-12">
                    <b-card no-body class="clearfix">
                        <div class="row">
                            <div class="col-md-6" style="height: 400px">
                                <TreeviewComponent :tree="tree" :opened="true" />
                            </div>
                            <div class="col-md-6 border-left">
                                Ok
                            </div>
                        </div>
                    </b-card>
                    <b-card no-body class="clearfix">
                        <b-tabs small pills card vertical>

                            <b-tab title="Transformar" active>
                                <b-card-text>
                                    <b-form-radio-group v-model="selected" stacked>
                                        <b-form-radio class="col-md-6" value="findReplace">
                                            Find
                                            <table>
                                                <tr>
                                                    <td>{{$t('titles.value')}}:</td>
                                                    <td><input class="form-control" /></td>
                                                    <td>and replace</td>
                                                    <td><input class="form-control" /></td>
                                                </tr>
                                            </table>
                                        </b-form-radio>

                                        <template v-if="attribute.type === 'Integer' || attribute.type == 'Decimal' ">
                                            <b-form-radio>Discretize (bin) (fixed, with/without start; custom)
                                            </b-form-radio>
                                            <b-form-radio>Normalize values using ... (FIXME: MinMax, etc)
                                            </b-form-radio>
                                            <b-form-radio>Force numerical range
                                            </b-form-radio>
                                            <b-form-radio>Round numbers... </b-form-radio>
                                            <b-form-radio>Timestamp to date ... </b-form-radio>
                                        </template>
                                        <template v-if="attribute.type === 'Text' ">
                                            <b-form-radio class="col-md-6" value="toLowerCase">
                                                {{$t('dataExplorer.toLowerCase')}}
                                            </b-form-radio>
                                            <b-form-radio class="col-md-6" value="toUpperCase">
                                                {{$t('dataExplorer.toUpperCase')}}
                                            </b-form-radio>
                                            <b-form-radio class="col-md-6">{{$t('dataExplorer.capitalizeFirst')}}
                                            </b-form-radio>
                                            <b-form-radio class="col-md-6">{{$t('dataExplorer.removeAccents')}}
                                            </b-form-radio>
                                            <b-form-radio>Generate n-grams </b-form-radio>
                                            <b-form-radio>Concatenate with... </b-form-radio>
                                            <b-form-radio>Parse to date with custom format... </b-form-radio>
                                            <b-form-input class="form-control" />
                                            <b-form-radio>Extract numbers... </b-form-radio>
                                            <table>
                                                <tr>
                                                    <td>
                                                        <b-form-radio>Para vetor</b-form-radio>
                                                    </td>
                                                    <td>
                                                        <b-form-radio>Para novos atributos</b-form-radio>
                                                    </td>
                                                </tr>
                                            </table>
                                            <b-form-radio>Extract with regex... </b-form-radio>
                                            <b-form-radio>Stemming ... </b-form-radio>
                                            <b-form-radio>Sort words... </b-form-radio>
                                            <b-form-radio>Remove initial and final spaces (trim) </b-form-radio>
                                            <b-form-radio value="truncateToNChars">
                                                {{$t('dataExplorer.truncateToNChars')}} </b-form-radio>
                                            <b-form-input></b-form-input>
                                            <b-form-radio>Encode/Decode URL </b-form-radio>
                                            <b-form-radio>Escape XML... </b-form-radio>
                                            <b-form-radio>Escape Unicode ... </b-form-radio>
                                            <b-form-radio>Split url... </b-form-radio>
                                        </template>
                                        <template v-if="attribute.type === 'Array' ">
                                            <b-form-radio>Extract from array </b-form-radio>
                                            <b-form-radio>Fold an array </b-form-radio>
                                            <b-form-radio>Sort array </b-form-radio>
                                        </template>
                                        <template v-if="attribute.type === 'Datetime' ">
                                            <b-form-radio>Update hour from ... </b-form-radio>
                                            <b-form-radio>Truncate hour to 00:00 </b-form-radio>
                                            <b-form-radio>Extract date elements... </b-form-radio>
                                            <b-form-radio>Compute difference between dates... </b-form-radio>
                                            <b-form-radio>Format date with custom format... </b-form-radio>
                                            <b-form-radio>Force date range </b-form-radio>
                                            <b-form-radio>Date to timestamp </b-form-radio>

                                        </template>
                                        <b-form-radio>Pseudoanonymization... </b-form-radio>
                                    </b-form-radio-group>
                                </b-card-text>

                            </b-tab>
                            <b-tab title="Limpeza dos dados">
                                <b-card-text>
                                    <b-form-radio-group stacked>
                                        <b-form-radio>
                                            <b>Move</b> invalid cells for meaning Integer to column_invalid.
                                        </b-form-radio>
                                        <b-form-radio>
                                            <b>Remove</b> invalid cells for meaning Integer to column_invalid.
                                        </b-form-radio>
                                        <b-form-radio>
                                            <b>Remove</b> rows with no value
                                        </b-form-radio>
                                        <b-form-radio>
                                            <b>Fill</b> empty rows with ...
                                        </b-form-radio>
                                        <b-form-select>
                                            <b-form-select-option :value="null">Constant value
                                            </b-form-select-option>
                                            <b-form-select-option :value="null">Custom expression
                                            </b-form-select-option>
                                            <b-form-select-option :value="null">Average value</b-form-select-option>
                                            <b-form-select-option :value="null">Min value</b-form-select-option>
                                            <b-form-select-option :value="null">Max value</b-form-select-option>
                                            <b-form-select-option :value="null">More common value (mode)
                                            </b-form-select-option>
                                            <b-form-select-option :value="null">Using median</b-form-select-option>
                                            <b-form-select-option :value="null">value from cell from previous row
                                                (1st is filled with last row) </b-form-select-option>
                                            <b-form-select-option :value="null">value from cell from next row (last
                                                is filled with 1st row) </b-form-select-option>
                                        </b-form-select>
                                    </b-form-radio-group>
                                </b-card-text>
                            </b-tab>
                            <b-tab title="Flag rows">
                                <b-form-radio-group stacked>
                                    <b-form-radio>
                                        <b>Flag</b> rows on range ...
                                    </b-form-radio>
                                    <b-form-radio>
                                        <b>Flag</b> rows with formula ...
                                    </b-form-radio>
                                    <b-form-radio>
                                        <b>Flag</b> invalid rows
                                    </b-form-radio>
                                    <b-form-radio>
                                        <b>Flag</b> rows with empty ...
                                    </b-form-radio>
                                </b-form-radio-group>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                    <b-form-radio-group v-model="target">
                        <b-form-radio value="change">Alterar o atributo original</b-form-radio>
                        <b-form-radio value="new">Criar novo atributo</b-form-radio>
                    </b-form-radio-group>
                    <b-form-input class="form-control" v-if="target === 'new'" v-model="targetName" maxlength="40" />
                    <!--
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
                                  -->

                </div>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import TreeviewComponent from '../Tree.vue';
    export default {
        components: { TreeviewComponent },
        props: {
            attribute: { type: Object },
        },
        data() {
            return {
                selected: '',
                target: 'change',
                targetName: '',
            }
        },
        computed: {
            tree() {
                const result = {
                    children: [
                        { name: "Transformar", selected: false },
                        { name: "Limpeza dos dados", selected: false },
                        { name: "Marcar linhas (flag)", selected: false }
                ]};
                result.children[0]['children'] = [
                    {name: 'Find and replace'},
                    {name: 'Find and replace'},
                    {name: 'Find and replace'},
                    {name: 'Find and replace'},
                    {name: 'Find and replace'},
                ]
                return result;
            }
        },
        methods: {
            okClicked() {
                let result;

                switch (this.selected) {
                    case 'toUpperCase':
                        result = { f: 'upper', attribute: this.attribute.label, params: [] };
                        break;
                    case 'toLowerCase':
                        break;
                }
                this.$emit('ok', result);
            },
            show() {
                this.$refs.modal.show();
            }
        },
    }
</script>
<style>
    .moreOptions {
        zoom: .90;
    }
</style>