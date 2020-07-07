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
        <b-modal ref="modal" size="xl" :title="$tc('common.filter', 2)" centered :ok-only="true" modal-class="full_modal_width-dialog">
           <table class="table table-bordered table-sm sheet text-center" v-if="valueList && valueList.length">
               <thead>
                   <th style="width:2%"></th>
                   <th style="width:10%">{{$t('variables.name')}}</th>
                   <th style="width:10%">{{$t('variables.label')}}</th>
                   <th style="width:12%">{{$t('variables.help')}}</th>
                   <th style="width:12%">{{$tc('variables.operator', 1)}}</th>
                   <th style="width:8%">{{$t('variables.defaultValue')}}</th>
                   <th style="width:8%">{{$t('variables.multiplicity')}}</th>
                   <th style="width:18%">{{$t('variables.suggestedWidget')}}</th>
                   <th style="width:10%">{{$t('variables.type')}}</th>
                   <th style="width: 15%">{{$tc('variables.associateToLookup')}}</th>
                   <!--th>{{$tc('variables.parameter', 2)}}</th-->
               </thead>
               <tbody>
                   <tr v-for="(row, index) in valueList">
                       <td>
                           <a href="#" @click.prevent.stop="remove($event, index)" :title="$t('actions.delete')" >
                               <span class="fa fa-minus-circle"></span>
                           </a>
                       </td>
                       <td>
                           <select v-model="row.name">
                                <option></option>
                                <option v-for="suggestion in suggestions" :key="suggestion">{{suggestion}}</option>
                           </select>
                       </td>
                       <td>
                           <input v-model="row.label" maxlength="40" name="label" autocomplete="off"/>
                       </td>
                       <td>
                           <input v-model="row.help" maxlength="100" name="help" autocomplete="off"/>
                       </td>
                       <td>
                           <select class="form-input" v-model="row.operator" tabindex="0">
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
                       </td>
                       <td>
                           <input v-model="row.default_value" maxlength="50" name="default_value" autocomplete="off"/>
                       <td>
                           <select class="form-input" v-model="row.multiplicity" tabindex="0">
                               <option value="OPTIONAL">Opcional</option>
                               <option value="ZERO_OR_MORE">0 ou mais</option>
                               <option value="ONE">Exatamente 1</option>
                               <option value="ONE_OR_MORE">Mais de 1</option>
                           </select>
                       </td>
                       <td>
                           <select class="form-input" v-model="row.suggested_widget">
                               <option value="checkbox">{{$t('widgets.checkbox')}}</option>
                               <option value="date">{{$t('widgets.date')}}</option>
                               <option value="decimal">{{$t('widgets.decimal')}}</option>
                               <option value="dropdown">{{$t('widgets.dropdown')}}</option>
                               <option value="integer">{{$t('widgets.integer')}}</option>
                               <option value="lookup">{{$t('widgets.lookup')}}</option>
                               <option value="text">{{$t('widgets.text')}}</option>
                               <option value="textarea">{{$t('widgets.textarea')}}</option>
                           </select>
                       </td>
    
                       <td>
                           <select class="form-input" v-model="row.type">
	       					<option></option>
                               <option v-for="dt in dataTypes" :key="dt" :value="dt">
                                   {{$t('dataTypes.' + dt)}}
                               </option>
                           </select>
                       </td>
                       <td>
                           <v-select :options="lookups" :multiple="false" 
                                   v-model="row.lookup" 
                                   height="25px"
                                   :create-option="ds => ({ ds, id: null })"
                                         :reduce="option => option.id"
                                   label="name" :taggable="true" :close-on-select="true">
                               <div slot="no-options"></div>
                           </v-select>
 
                       </td>
                   </tr>
               </tbody>
               </table>
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
            openModal() {
                this.$refs.modal.show();
                if (this.suggestionEvent) {
                    this.suggestions = this.suggestionEvent();
                }
                if (this.lookupsMethod){
                    this.lookupsMethod();
                }
            },
            updateDisplayValue(v) {
                if (v) {
                    this.displayValue = v.map((v) => v.name).join('\n')
                } else {
                    this.displayValue = '';
                }
            },
            updated(e, row, attr) {
                row[attr] = e.target.value;
            },
            attrUpdated(row, attr, val) {
                row[attr] = val;
            },
            add(e) {
                if (this.valueList === null) {
                    this.valueList = [];
                }
                const id = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
                this.valueList.push({id, alias: '', attribute: '', f: '' })
            },
            remove(e, index) {
                this.valueList.splice(index, 1);
                e.stopPropagation();
                e.preventDefault();
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
            lookups: {type: Array, default: () => []},
            lookupsMethod: null
        },
    }
</script>
