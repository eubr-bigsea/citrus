<template>
    <div class="function-editor">
        <span v-if="!readOnly">
            <LabelComponent :field="field" :value="value"></LabelComponent>
            <textarea readonly :value="displayValue" class="form-control" rows="4"
                @click.prevent="openModal"></textarea>
            <b-link variant="sm" @click.prevent="openModal">
                {{$t('actions.chooseOption')}}
            </b-link>
        </span>
        <span v-else>{{displayValue}}</span>
        <b-modal id="lookupModal" button-size="sm" size="lg" :title="field.label" :hide-header="true"
            :cancel-title="$t('actions.cancel')" no-fade ref="modal" v-if="parameters" centered>
            <p>
                {{field.label||field.name}}
            </p>
            <table class="table table-sm" v-if="valueList && valueList.length" ref="table">
                <thead>
                    <th class="text-center">{{$t('property.attribute')}}</th>
                    <th class="text-center">{{$t('property.type')}}</th>
                    <th></th>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in valueList">
                        <td style="width:50%">
                            <v-select :options="suggestions" :multiple="false" :value="row.attribute"
                                @input="(v) => attrUpdated(row, 'attribute', v)" :taggable="true" :closeOnSelect="true"
                                size="sm" class="vue-select-small">
                                <slot name="no-options">{{ $t('messages.noMatching') }}</slot>
                            </v-select>
                        </td>
                        <td style="width:20%">
                            <select class="form-control form-control-sm" :value="row.type"
                                @change="updated($event, row, 'type')" size="sm">
                                <option v-for="v in JSON.parse(field.values)" :value="v.key">{{v.value}}</option>
                            </select>
                        </td>
                        <td style="width:10%" class="text-center">
                            <a href="#" @click="remove($event, index)" :title="$t('actions.delete')" class="pr-1">
                                <span class="fa fa-minus-circle"></span>
                            </a>
                            <a href="#" @click="moveUp($event, index)" v-if="index !== 0" :title="$t('actions.moveUp')"
                                class="pr-1">
                                <span class="fa fa-chevron-circle-up"></span>
                            </a>
                            <a href="#" @click="moveDown($event, index)" v-if="index !== (valueList.length-1)"
                                :title="$t('actions.moveDown')">
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
                <b-btn @click="okClicked" variant="primary" size="sm" class="mr-1">{{$t('common.ok')}}</b-btn>
                <b-btn @click="cancelClicked" variant="secondary" size="sm">{{$t('actions.cancel')}}</b-btn>
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
            },
            updateDisplayValue(v) {
                if (v) {
                    this.displayValue = v.map((v) => `${v.attribute} = (${v.type}) ${v.attribute}`).join('\n')
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
                this.valueList.push({ attribute: '', type: '' });
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
                this.triggerUpdateEvent(this.message, this.field,
                    this.valueList);
                this.$refs.modal.hide();
                this.updateDisplayValue(this.valueList);
            },
            cancelClicked(ev) {
                this.$refs.modal.hide();
            }
        },
        props: {
            schema: { type: Object, default: null },
        },
    }
</script>
<style>
    .vue-select-small .vs__dropdown-toggle {
        height: 30px;
    }

    .vue-select-small .vs__fade-enter-active,
    .vue-select-small .vs__fade-leave-active {
        transition: none;
    }
</style>