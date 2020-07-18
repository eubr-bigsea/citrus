<template>
    <div class="function-editor">
        <span v-if="!readOnly">
            <LabelComponent :field="field" :value="value"></LabelComponent>
            <textarea disabled :value="displayValue" class="form-control" rows="4"></textarea>
            <b-link variant="sm" @click.prevent="openModal">
                {{$t('actions.chooseOption')}}
            </b-link>
        </span>
        <span v-else>{{displayValue}}</span>
        <b-modal ref="modal" size="xl" :title="$tc('common.filter', 2)" centered :ok-only="true" modal-class="">
            <div class="row">
                <div class="col-md-4">
                    <div class="values border p-2">
                        <div v-for="(row, index) in valueList" class="border-bottom">
                            <a href="#" @click.prevent.stop="remove($event, index)" :title="$t('actions.delete')">
                                <span class="fa fa-minus-circle"></span>
                            </a>&nbsp;
                            <a href="#" @click.prevent="select(row)"><span class="fa fa-edit"></span></a>
                            <small>{{row.name}}
                                <span v-if="row.label">({{row.label}})</span></small>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div v-if="selected" class="form-filter ">
                        <div class="row">
                            <div class="col-md-4">
                                <label>{{$t('variables.attribute')}}</label>
                                <select v-model="selected.name" @change="selectAttribute" class="form-control"
                                    ref="name">
                                    <option></option>
                                    <option v-for="suggestion in suggestions" :key="suggestion">{{suggestion}}</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label>{{$t('variables.id')}}</label>
                                <input v-model="selected.id" maxlength="40" autocomplete="off" disabled
                                    class="form-control" />
                            </div>
                            <div class="col-md-4">
                                <label>{{$t('variables.label')}}</label>
                                <input v-model="selected.label" maxlength="40" autocomplete="off"
                                    class="form-control" />
                            </div>
                            <div class="col-md-4">
                                <label>{{$t('variables.type')}}</label>
                                <select class="form-control" v-model="selected.type">
                                    <option></option>
                                    <option v-for="dt in dataTypes" :key="dt" :value="dt">
                                        {{$t('dataTypes.' + dt)}}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label>{{$tc('variables.operator', 1)}}</label>
                                <select class="form-control" v-model="selected.operator" tabindex="0">
                                    <option value="eq">{{$t('variables.operators.eq')}}</option>
                                    <option value="ne">{{$t('variables.operators.ne')}}</option>
                                    <option value="gt">{{$t('variables.operators.gt')}}</option>
                                    <option value="lt">{{$t('variables.operators.lt')}}</option>
                                    <option value="ge">{{$t('variables.operators.ge')}}</option>
                                    <option value="le">{{$t('variables.operators.le')}}</option>
                                    <option value="in">{{$t('variables.operators.in')}}</option>
                                    <option value="ni">{{$t('variables.operators.ni')}}</option>
                                    <option value="user">{{$t('variables.operators.user')}}</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label>{{$t('variables.defaultValue')}}</label>
                                <input v-model="selected.default_value" maxlength="40" autocomplete="off"
                                    class="form-control" />
                            </div>
                            <div class="col-md-4">
                                <label>{{$t('variables.multiplicity')}}</label>
                                <select class="form-control" v-model="selected.multiplicity" tabindex="0">
                                    <option value="OPTIONAL">Opcional</option>
                                    <option value="ZERO_OR_MORE">0 ou mais</option>
                                    <option value="ONE">Exatamente 1</option>
                                    <option value="ONE_OR_MORE">Mais de 1</option>
                                </select>
                            </div>
                            <div class="col-md-8">
                                <label>{{$t('variables.associateToLookup')}}</label>
                                <v-select :options="lookups" :multiple="false" v-model="selected.lookup" height="25px"
                                    :create-option="ds => ({ ds, id: null })" :reduce="option => option.id" label="name"
                                    :taggable="true" :close-on-select="true">
                                    <div slot="no-options"></div>
                                </v-select>
                            </div>
                            <div class="col-md-12">
                                <label>{{$t('variables.help')}}</label>
                                <textarea v-model="selected.help" maxlength="300" autocomplete="off"
                                    class="form-control" rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <h5 class="text-secondary text-center mt-5">
                            <span class="fa fa-exclamation-triangle"></span>
                            <br />
                            <span v-html="$t('variables.addOrEdit')"></span>
                        </h5>
                    </div>
                </div>
            </div>
            <div class="mt-2 border-top pt-2">
                <button class="btn btn-success btn-sm" @click.prevent="add">
                    <span class="fa fa-plus"></span> {{$t('actions.addItem')}}</button>
            </div>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn @click="okClicked" variant="primary" class="mr-1">{{$t('common.ok')}}</b-btn>
                <b-btn @click="cancelClicked" variant="secondary">{{$t('actions.cancel')}}</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import vSelect from "vue-select";
    import LabelComponent from './Label.vue';
    import Widget from '../../mixins/Widget.js';
    export default {
        mixins: [Widget],
        computed: {
            parameters() {
                return JSON.parse(this.field.values);
            },
        },
        components: {
            LabelComponent, 'v-select': vSelect
        },
        data() {
            return {
                currentTab: 'editor',
                displayValue: '',
                showModal: false,
                valueList: JSON.parse(JSON.stringify(this.value || [])),
                ok: this.okClicked,
                cancel: this.cancelClicked,
                suggestions: [],
                selected: null,
                dataTypes: [
                    'DATE',
                    'DECIMAL',
                    'INTEGER',
                    'CHARACTER',
                ],
            }
        },
        mounted() {
            this.updateDisplayValue(this.value);
        },
        methods: {
            selectAttribute() {
                let name = this.selected.name;
                let counter = 0;
                while (this.valueList.find(v => v.id === name)) {
                    name = row.name + '_' + counter;
                    counter++;
                }
                this.selected.id = name;
            },
            openModal() {
                this.$refs.modal.show();
                if (this.suggestionEvent) {
                    this.suggestions = this.suggestionEvent();
                }
                if (this.lookupsMethod) {
                    this.lookupsMethod();
                }
            },
            updateDisplayValue(v) {
                const ops = new Map([
                    ['eq', ' = '],
                    ['ne', ' != '],
                    ['gt', ' > '],
                    ['lt', ' < '],
                    ['ge', ' >= '],
                    ['le', ' <= '],
                    ['in', ' in '],
                    ['ni', ' not in '],
                    ['user', ' ? '],
                ]);
                if (v) {
                    this.displayValue = v.map((v) => v.name + ops.get(v.operator) + "?").join('\n')
                } else {
                    this.displayValue = '';
                }
            },
            select(row) {
                this.selected = row;
            },
            add(e) {
                if (this.valueList === null) {
                    this.valueList = [];
                }
                const value = { id: '', attribute: '' };
                this.selected = value;
                this.valueList.push(value);
            },
            remove(e, index) {
                this.valueList.splice(index, 1);
                e.stopPropagation();
                e.preventDefault();
                this.selected = null;
                return false;
            },
            okClicked(ev) {
                this.$root.$emit(this.message, this.field,
                    this.valueList);
                this.$refs.modal.hide();
                this.updateDisplayValue(this.valueList);
            },
            cancelClicked(ev) {
                this.$refs.modal.hide();
            }
        },
        props: {
            lookups: { type: Array, default: () => [] },
            lookupsMethod: null
        },
    }
</script>
<style>
    div.values {
        height: 300px;
        min-height: 300px;;
        overflow: auto;
    }

    .form-filter,
    .form-filter select,
    .form-filter input {
        font-size: .9em
    }
</style>