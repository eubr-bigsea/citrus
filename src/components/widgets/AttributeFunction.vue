<template>
    <div class="function-editor">
        <LabelComponent :field="field"></LabelComponent>
        <textarea disabled :value="displayValue" class="form-control" rows="4"></textarea>

        <b-link v-b-modal="'lookupModal'" variant="sm">
            {{$t('actions.chooseOption')}}
        </b-link>

        <b-modal id="lookupModal" size="lg" :title="field.label" :cancel-title="$t('actions.cancel')" ref="modal">
            <p>
                <em>{{parameters.options.description}}</em>
            </p>
            <table class="table table-bordered table-sm table-striped" v-if="valueList && valueList.length">
                <thead>
                    <th class="text-center">{{$t('property.attribute')}}</th>
                    <th class="text-center">{{$t('property.function')}}</th>
                    <th class="text-center" v-if="parameters.options.show_alias">{{$t('property.alias')}}</th>
                    <th class="text-center" v-if="parameters.options.show_value">Value name of attribute without quotation</th>
                    <th class="text-center" style="width:15%"></th>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in valueList">
                        <td>
                            <input class="form-control" :value="row.attribute" @change="updated($event, row, 'attribute')">
                        </td>
                        <td>
                            <select class="form-control" :value="row.f" @change="updated($event, row, 'f')">
                                <option v-for="opt in parameters.functions" :value="opt.key">{{opt.value}}</option>
                            </select>
                        </td>
                        <td v-if="parameters.options.show_alias">
                            <input class="form-control" :value="row.alias" @change="updated($event, row, 'alias')" />
                        </td>
                        <td v-if="parameters.options.show_value">
                            <input class="form-control" :value="row.alias" @change="updated($event, row, 'alias')" />
                        </td>
                        <td style="width:15%" class="text-center">
                            <a href="#" @click="remove($event, index)">
                                <span class="fa fa-2x fa-minus-circle"></span>
                            </a>
                            <a href="#" @click="moveUp($event, index)" v-if="index !== 0">
                                <span class="fa fa-2x fa-chevron-circle-up"></span>
                            </a>
                            <a href="#" @click="moveDown($event, index)" v-if="index !== (valueList.length-1)">
                                <span class="fa fa-2x fa-chevron-circle-down"></span>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="mt-2 border-top pt-2">
                <button class="btn btn-success btn-sm" @click.prevent="add">
                    <span class="fa fa-plus"></span> {{$t('actions.add')}}</button>
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
            displayValue(){
                if (this.value) {
                    return this.value.map((v) =>{
                        if (this.parameters.options.show_alias){
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
            LabelComponent,
        },
        data() {
            return {
                currentTab: 'editor',
                showModal: false,
                valueList: JSON.parse(JSON.stringify(this.value || [])),
                ok: this.okClicked,
                cancel: this.cancelClicked
            }
        },
        methods: {
            updated(e, row, attr) {
                row[attr] = e.target.value;
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
                this.$root.$emit('update-form-field-value', this.field,
                    this.valueList);
                this.$refs.modal.hide();
            },
            cancelClicked(ev) {
                this.$refs.modal.hide();
            }
        },
        props: ['value', 'field', 'options'],
    }
</script>