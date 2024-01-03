<template>
    <div class="function-editor">
        <span v-if="!readOnly">
            <LabelComponent :field="field"
                            :value="value" />
            <textarea disabled
                      :value="displayValue"
                      class="form-control"
                      rows="4" />
            <b-link variant="sm"
                    @click.prevent="openModal">
                {{$t('actions.chooseOption')}}
            </b-link>
        </span>
        <span v-else>{{displayValue}}</span>
        <b-modal ref="modal"
                 size="xl"
                 :title="$tc('common.filter', 2)"
                 hide-header>
            <div class="p-1">
                <div class="row user-filter">
                    <div class="col-md-4 mt-4">
                        {{$tc('common.filter', 2)}}
                        <div class="values pb-1 border">
                            <div v-for="(row, index) in valueList"
                                 :key="index"
                                 class="clear-fix item-list"
                                 :class="{selected: selected && selected.index === row.index }"
                                 @click.prevent="select(row, index)">
                                <small>{{row.name}} <em v-if="! row.name">&lt;nenhum atributo&gt;</em>
                                    <span v-if="row.label">/ {{row.label}}</span>
                                </small>
                                <a href="#"
                                   :title="$t('actions.delete')"
                                   class="ml-1 float-right btn btn-sm py-0 btn-light text-danger"
                                   @click.prevent.stop="remove($event, index)">
                                    <font-awesome-icon icon="fa fa-minus-circle" />
                                </a>
                            </div>
                        </div>
                        <button class="btn btn-success btn-sm mt-2"
                                @click.prevent="add">
                            <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                        </button>
                    </div>
                    <div class="col-md-8">
                        <div v-if="selected"
                             class="form-filter ">
                            <b-tabs class="filter-field">
                                <b-tab title="Básico">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <label>{{$t('variables.attribute')}}:</label>
                                            <select ref="name"
                                                    v-model="selected.name"
                                                    class="form-control"
                                                    @change="selectAttribute">
                                                <option />
                                                <option v-for="suggestion in suggestions"
                                                        :key="suggestion">
                                                    {{suggestion}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <label>{{$t('variables.id')}}:</label>
                                            <input v-model="selected.id"
                                                   maxlength="40"
                                                   autocomplete="off"
                                                   disabled
                                                   class="form-control">
                                        </div>
                                        <div class="col-md-4">
                                            <label>{{$t('variables.label')}}:</label>
                                            <input v-model="selected.label"
                                                   maxlength="40"
                                                   autocomplete="off"
                                                   class="form-control">
                                        </div>
                                        <div class="col-md-4">
                                            <label>{{$t('variables.type')}}:</label>
                                            <select v-model="selected.type"
                                                    class="form-control">
                                                <option />
                                                <option v-for="dt in dataTypes"
                                                        :key="dt"
                                                        :value="dt">
                                                    {{$t('dataTypes.' + dt)}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <label>{{$tc('variables.operator', 1)}}:</label>
                                            <select v-model="selected.operator"
                                                    class="form-control"
                                                    tabindex="0">
                                                <option value="eq">
                                                    {{$t('variables.operators.eq')}}
                                                </option>
                                                <option value="ne">
                                                    {{$t('variables.operators.ne')}}
                                                </option>
                                                <option value="gt">
                                                    {{$t('variables.operators.gt')}}
                                                </option>
                                                <option value="lt">
                                                    {{$t('variables.operators.lt')}}
                                                </option>
                                                <option value="ge">
                                                    {{$t('variables.operators.ge')}}
                                                </option>
                                                <option value="le">
                                                    {{$t('variables.operators.le')}}
                                                </option>
                                                <option value="in">
                                                    {{$t('variables.operators.in')}}
                                                </option>
                                                <option value="ni">
                                                    {{$t('variables.operators.ni')}}
                                                </option>
                                                <option value="user">
                                                    {{$t('variables.operators.user')}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <label>{{$t('variables.defaultValue')}}:</label>
                                            <input v-model="selected.default_value"
                                                   maxlength="40"
                                                   autocomplete="off"
                                                   class="form-control">
                                        </div>
                                        <div class="col-md-4">
                                            <label>{{$t('variables.multiplicity')}}:</label>
                                            <select v-model="selected.multiplicity"
                                                    class="form-control"
                                                    tabindex="0">
                                                <option value="OPTIONAL">
                                                    Opcional
                                                </option>
                                                <option value="ZERO_OR_MORE">
                                                    0 ou mais
                                                </option>
                                                <option value="ONE">
                                                    Exatamente 1
                                                </option>
                                                <option value="ONE_OR_MORE">
                                                    1 ou mais
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <label>{{$t('variables.index')}}:</label>
                                            <input v-model="selected.display_index"
                                                   maxlength="4"
                                                   autocomplete="off"
                                                   class="form-control w-50"
                                                   type="number"
                                                   min="0"
                                                   max="100">
                                        </div>
                                        <div class="col-md-12">
                                            <label>{{$t('variables.help')}}:</label>
                                            <textarea v-model="selected.help"
                                                      maxlength="300"
                                                      autocomplete="off"
                                                      class="form-control"
                                                      rows="2" />
                                        </div>
                                    </div>
                                </b-tab>
                                <b-tab title="Listas">
                                    <label>{{$t('variables.associateToLookup')}}:</label>
                                    <!-- <v-select :options="lookups" :multiple="false" v-model="selected.lookup" height="25px"
                                :create-option="ds => ({ ds, id: null })" :reduce="option => option.id" label="name"
                                :taggable="true" :close-on-select="true">
                                <div slot="no-options"></div>
                            </v-select> -->
                                    <select v-model="selected.lookup"
                                            class="w-50 form-control">
                                        <option />
                                        <option v-for="opt in lookups"
                                                :key="opt.id"
                                                :value="opt.id">
                                            {{opt.name}}
                                        </option>
                                    </select>
                                    <div v-if="!lookups"
                                         class="text-danger">
                                        <em>Não há tabelas de referência
                                            cadastradas</em>
                                    </div>
                                    <label>Lista de valores personalizados (use JSON):</label>
                                    <textarea v-model="selected.customList"
                                              class="form-control"
                                              rows="5" />
                                    <em>Exemplo:</em>
                                    <br>
                                    <code>[
                                        {"key": 1, "value": "Primeira escolha"},
                                        {"key": 2, "value": "Segunda escolha"}
                                        ]</code>
                                    <br>
                                    O valor de <code>key</code> será atribuído à variável e <code>value</code> é
                                    exibido.
                                </b-tab>
                                <b-tab :title="$tc('variables.text', 2)">
                                    <label>{{$t('variables.textBefore')}}:</label>
                                    <textarea v-model="selected.textBefore"
                                              maxlength="300"
                                              autocomplete="off"
                                              class="form-control"
                                              rows="4" />
                                    <label>{{$t('variables.textAfter')}}:</label>
                                    <textarea v-model="selected.textAfter"
                                              maxlength="300"
                                              autocomplete="off"
                                              class="form-control"
                                              rows="4" />
                                </b-tab>
                            </b-tabs>
                        </div>
                        <div v-else>
                            <h5 class="text-secondary text-center lead mt-5">
                                <span class="text-warning fa fa-2x fa-exclamation-triangle" />
                                <br>
                                <span v-html="$t('variables.addOrEdit')" />
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
            <template #modal-footer>
                <div class="w-100 text-right">
                    <b-btn variant="primary"
                           size="sm"
                           class="mr-1 pl-5 pr-5"
                           @click="okClicked">
                        {{$t('common.ok')}}
                    </b-btn>
                </div>
            </template>
        </b-modal>
    </div>
</template>
<script>
import LabelComponent from './Label.vue';
import Widget from '../../mixins/Widget.js';
import Notifier from '../../mixins/Notifier.js';

export default {
    components: {
        LabelComponent
    },
    mixins: [Widget, Notifier],
    props: {
        //lookups: { type: Array, default: () => [] },
        lookupsMethod: {type: Function, default: () => null},
    },
    data() {
        return {
            currentTab: 'editor',
            displayValue: '',
            showModal: false,
            valueList: JSON.parse(JSON.stringify(this.value || [])),
            ok: this.okClicked,
            lookups: [],
            suggestions: [],
            selected: null,
            dataTypes: [
                'DATE',
                'DECIMAL',
                'INTEGER',
                'CHARACTER',
                'STATIC_TEXT',
                'BOOLEAN',
            ],
        };
    },
    computed: {
        parameters() {
            return JSON.parse(this.field.values);
        },
    },
    mounted() {
        this.updateDisplayValue(this.value);
    },
    methods: {
        selectAttribute() {
            let name;
            let counter = 0;
            do {
                name = this.selected.name + '_' + counter;
                counter++;
            } while (this.valueList.find(v => v.id === name));
            if (!this.selected.label) {
                this.selected.label = this.selected.name.charAt(0).toUpperCase()
                        + this.selected.name.slice(1).replace('-', ' ');
            }
            this.selected.id = name;
        },
        async openModal() {
            this.$refs.modal.show();
            if (this.suggestionEvent) {
                this.suggestions = this.suggestionEvent();
            }
            if (this.lookupsMethod) {
                this.lookups = await this.lookupsMethod();
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
                this.displayValue = v.map((v) => (v.name || '') + (ops.get(v.operator) || '') + "?").join('\n');
            } else {
                this.displayValue = '';
            }
        },
        select(row, index) {
            row.index = index;
            this.selected = row;

        },
        add() {
            if (this.valueList === null) {
                this.valueList = [];
            }
            const value = { id: '', name: '', operator: 'eq', multiplicity: 'OPTIONAL', customList: '',
                key: Math.random().toString(36).substring(2)};
            this.selected = value;
            value.index = this.valueList.length;
            this.valueList.push(value);
        },
        remove(e, index) {
            this.valueList.splice(index, 1);
            e.stopPropagation();
            e.preventDefault();
            this.selected = null;
            return false;
        },
        okClicked() {
            if (this.validate()) {
                this.$root.$emit(this.message, this.field,
                    this.valueList);
                this.$refs.modal.hide();
                this.valueList.forEach(v => v.key = v.key || Math.random().toString(36).substring(2));
                this.updateDisplayValue(this.valueList);
            } else {
                this.error(null, this.$t('errors.missingRequiredValue'));
            }
        },
        validate() {
            const r = this.valueList.filter(v => {
                return !(v.name && v.label &&
                        v.operator && v.type);
            }).length == 0;
            return r;
        }
    },
};
</script>
<style>
    div.values {
        height: 300px;
        min-height: 300px;
        ;
        overflow: auto;
    }

    .form-filter,
    .form-filter select,
    .form-filter input {
        font-size: .9em
    }

    .user-filter .item-list {
        border-bottom: 1px solid #ccc;
        margin-top: 1px;
        padding: 2px 5px;
        cursor: pointer;
    }

    .user-filter .selected {
        background: #007bff;
        border: none;
        color: white;
    }

    .filter-field .nav-tabs {
        padding-left: 15px;
        margin-bottom: 0;
        border: none;
    }

    .filter-field .tab-content {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 15px;
    }
</style>
