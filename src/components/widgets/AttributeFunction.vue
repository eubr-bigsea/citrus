<template>
    <div class="function-editor">
        <LabelComponent :field="field"></LabelComponent>
        <textarea disabled :value="displayValue" class="form-control" rows="4"></textarea>

        <b-link v-b-modal="'lookupModal'" variant="sm">
            {{$t('actions.chooseOption')}}
        </b-link>

        <b-modal id="lookupModal" size="lg" :title="field.label" :hide-header="true" :cancel-title="$t('actions.cancel')"
            no-fade ref="modal">
            <p>
                <em>{{parameters.options.description}}</em>
            </p>
            <table class="table table-bordered table-sm" v-if="valueList && valueList.length">
                <thead>
                    <th class="text-center">{{$t('property.attribute')}}</th>
                    <th class="text-center">{{$t('property.function')}}</th>
                    <th class="text-center" v-if="parameters.options.show_alias">{{$t('property.alias')}}</th>
                    <th class="text-center" v-if="parameters.options.show_value">Value name of attribute without
                        quotation</th>
                    <th class="text-center" style="width:15%"></th>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in valueList">
                        <td style="width:50%">
                            <v-select :options="suggestions" :multiple="false" :value="row.attribute" :on-change="attrUpdated.bind(this, row, 'attribute')"
                                :taggable="true" :closeOnSelect="true">
                                <slot name="no-options">{{ $t('messages.noMatching') }}</slot>
                            </v-select>
                            <!--
                            <input class="form-control" :value="row.attribute" @change="updated($event, row, 'attribute')">
                            -->
                        </td>
                        <td style="width:20%">
                            <select class="form-control" :value="row.f" @change="updated($event, row, 'f')">
                                <option v-for="opt in parameters.functions" :value="opt.key">{{opt.value}}</option>
                            </select>
                        </td>
                        <td v-if="parameters.options.show_alias"  style="width:20%">
                            <input class="form-control" :value="row.alias" @change="updated($event, row, 'alias')" />
                        </td>
                        <td v-if="parameters.options.show_value"  style="width:20%">
                            <input class="form-control" :value="row.alias" @change="updated($event, row, 'alias')" />
                        </td>
                        <td style="width:10%" class="text-center">
                            <a href="#" @click="remove($event, index)" :title="$t('actions.delete')">
                                <span class="fa fa-minus-circle"></span>
                            </a>
                            <a href="#" @click="moveUp($event, index)" v-if="index !== 0"  :title="$t('actions.moveUp')">
                                <span class="fa fa-chevron-circle-up"></span>
                            </a>
                            <a href="#" @click="moveDown($event, index)" v-if="index !== (valueList.length-1)"  :title="$t('actions.moveDown')">
                                <span class="fa fa-chevron-circle-down"></span>
                            </a>
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
    import LabelComponent from './Label.vue'
    export default {
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
                cancel: this.cancelClicked
            }
        },
        mounted() {
            this.updateDisplayValue(this.value);
        },
        methods: {
            updateDisplayValue(v) {
                if (v) {
                    this.displayValue = v.map((v) => {
                        if (this.parameters.options.show_alias) {
                            return `${v.alias} = ${v.f}(${v.attribute})`
                        } else {
                            return `${v.f}(${v.attribute})`
                        }
                    }).join('\n')
                } else {
                    this.displayValue = '';
                }
            },
            updated(e, row, attr) {
                row[attr] = e.target.value;
            },
            attrUpdated(row, attr, val) {
                row[attr] = val;
                /*eventHub.$emit('update-form-field-value', this.field, 
                    this.valueValue);*/
            },
            add(e) {
                if (this.valueList === null) {
                    this.valueList = [];
                }
                this.valueList.push({ alias: '', attribute: '', f: '' })
            },
            remove(e, index) {
                this.valueList.splice(index, 1);
                e.stopPropagation();
                e.preventDefault();
                return false;
            },
            moveUp(e, index) {
                let tmp = this.valueList.splice(index, 1)[0];
                this.valueList.splice(index - 1, 0, tmp)
                e.stopPropagation();
                return false;
            },
            moveDown(e, index) {
                let tmp = this.valueList.splice(index, 1)[0]
                this.valueList.splice(index + 1, 0, tmp)
                e.stopPropagation();
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
            suggestions: {
                type: Array,
                default: []
            },
            value: '',
            field: {},
            options: {},
            message: {
                default: 'update-form-field-value'
            }
        },
    }
</script>