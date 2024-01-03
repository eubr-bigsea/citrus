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


        <b-modal id="lookupModal"
                 ref="modal"
                 size="xl"
                 :title="field.label"
                 :hide-header="true"
                 :cancel-title="$t('actions.cancel')"
                 no-fade
                 :no-close-on-backdrop="true">
            <p>
                <template v-if="parameters.options[language]">
                    <strong>{{parameters.options[language].title}}</strong>
                    <br>
                    <small>{{parameters.options[language].description}}</small>
                </template>
                <template v-else>
                    <strong>{{parameters.options.title}}</strong>
                    <br>
                    <small>{{parameters.options.description}}</small>
                </template>
            </p>
            <div class="row">
                <div class="col-md-3">
                    <strong>{{$t('common.help')}}</strong>
                    <div class="help-functions">
                        <div v-for="opt in parameters.functions"
                             :key="opt.value">
                            <small>
                                <strong>{{opt.value}}:</strong>
                                {{getHelp(opt)}}</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-9">
                    <table v-if="valueList && valueList.length"
                           class="table table-sm">
                        <thead>
                            <th class="text-center">
                                {{$t('property.attribute')}}
                            </th>
                            <th class="text-center">
                                {{$t('property.function')}}
                            </th>
                            <th v-if="parameters.options.show_alias"
                                class="text-center">
                                {{$t('property.alias')}}
                            </th>
                            <th v-if="parameters.options.show_value"
                                class="text-center">
                                Value name of attribute without
                                quotation
                            </th>
                            <th class="text-center"
                                style="width:15%" />
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in valueList"
                                :key="index">
                                <td style="width:40%">
                                    <v-select :options="suggestions"
                                              :multiple="false"
                                              :value="row.attribute"
                                              :taggable="true"
                                              :close-on-select="true"
                                              @input="(v) => attrUpdated(row, 'attribute', v)">
                                        <slot name="no-options">
                                            {{$t('messages.noMatching')}}
                                        </slot>
                                    </v-select>
                                </td>
                                <td style="width:30%">
                                    <select class="form-control form-control-sm"
                                            :value="row.f"
                                            @change="updated($event, row, 'f')">
                                        <option v-for="opt in parameters.functions"
                                                :key="opt.key"
                                                :value="opt.key">
                                            {{opt.value}}
                                        </option>
                                    </select>
                                </td>
                                <td v-if="parameters.options.show_alias"
                                    style="width:20%">
                                    <input class="form-control form-control-sm"
                                           :value="row.alias"
                                           @change="updated($event, row, 'alias')">
                                </td>
                                <td v-if="parameters.options.show_value"
                                    style="width:20%">
                                    <input class="form-control form-control-sm"
                                           :value="row.alias"
                                           @change="updated($event, row, 'alias')">
                                </td>
                                <td style="width:10%"
                                    class="text-center">
                                    <a href="#"
                                       :title="$t('actions.delete')"
                                       @click.prevent="remove($event, index)">
                                        <font-awesome-icon icon="fa fa-minus-circle" />
                                    </a>
                                    <a v-if="index !== 0"
                                       href="#"
                                       :title="$t('actions.moveUp')"
                                       @click.prevent="moveUp($event, index)">
                                        <font-awesome-icon icon="fa fa-chevron-circle-up" />
                                    </a>
                                    <a v-if="index !== (valueList.length-1)"
                                       href="#"
                                       :title="$t('actions.moveDown')"
                                       @click.prevent="moveDown($event, index)">
                                        <font-awesome-icon icon="fa fa-chevron-circle-down" />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="mt-2 border-top pt-2">
                        <button class="btn btn-success btn-sm"
                                @click.prevent="add">
                            <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                        </button>
                    </div>
                </div>
            </div>
            <template #modal-footer>
                <div class="w-100 text-right">
                    <b-btn variant="primary" class="btn-sm mr-1" @click="okClicked">
                        {{$t('common.ok')}}
                    </b-btn>
                    <b-btn variant="secondary" class="btn-sm " @click="cancelClicked">
                        {{$t('actions.cancel')}}
                    </b-btn>
                </div>
            </template>
        </b-modal>
    </div>
</template>
<script>
import vSelect from "vue-select";
import LabelComponent from './Label.vue';
import Widget from '../../mixins/Widget.js';
export default {
    components: {
        LabelComponent, 'v-select': vSelect
    },
    mixins: [Widget],
    props: {
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
        };
    },
    computed: {
        parameters() {
            try {
                if (this.field.values.constructor === Object) {
                    return this.field.values;
                } else {
                    return JSON.parse(this.field.values);
                }
            } catch (ex) {
                return { options: [] };
            }
        },
    },
    mounted() {
        this.updateDisplayValue(this.value);
    },
    methods: {
        getHelp(opt) {
            return opt.help[this.language];
        },
        openModal() {
            this.$refs.modal.show();
            if (this.suggestionEvent) {
                this.suggestions = this.suggestionEvent();
            }
        },
        updateDisplayValue(v) {
            if (v?.map) {
                this.displayValue = v.map((v) => {
                    if (this.parameters.options.show_alias) {
                        return `${v.alias} = ${v.f}(${v.attribute})`;
                    } else {
                        return `${v.f}(${v.attribute})`;
                    }
                }).join('\n');
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
        add() {
            if (this.valueList === null) {
                this.valueList = [];
            }
            this.valueList.push({ alias: '', attribute: '', f: '' });
        },
        remove(e, index) {
            this.valueList.splice(index, 1);
            e.stopPropagation();
            e.preventDefault();
            return false;
        },
        moveUp(e, index) {
            let tmp = this.valueList.splice(index, 1)[0];
            this.valueList.splice(index - 1, 0, tmp);
            e.stopPropagation();
            return false;
        },
        moveDown(e, index) {
            let tmp = this.valueList.splice(index, 1)[0];
            this.valueList.splice(index + 1, 0, tmp);
            e.stopPropagation();
            return false;
        },
        okClicked() {
            this.triggerUpdateEvent(this.message, this.field,
                this.valueList);
            this.$refs.modal.hide();
            this.updateDisplayValue(this.valueList);
        },
        cancelClicked() {
            this.$refs.modal.hide();
        }
    },
};
</script>
<style scoped>
    .help-functions {
        max-height: 350px;
        overflow: auto;
        border: 1px solid lightblue;
        padding: 4px;
    }

    .help-functions::-webkit-scrollbar {
        width: 5px;
    }

    /* Track */
    .help-functions::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    /* Handle */
    .help-functions::-webkit-scrollbar-thumb {
        background: #888;
    }

    /* Handle on hover */
    .help-functions::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
