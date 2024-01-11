<template>
    <div class="function-editor">
        <span v-if="!readOnly">
            <LabelComponent :field="field" :value="value" />
            <textarea readonly :value="displayValue" class="form-control" rows="4"
                      @click.prevent="openModal" />
            <b-link variant="sm" @click.prevent="openModal">
                {{$t('actions.chooseOption')}}
            </b-link>
        </span>
        <span v-else>{{displayValue}}</span>
        <b-modal v-if="parameters" id="lookupModal" ref="modal" button-size="sm"
                 size="lg" :title="field.label"
                 :hide-header="true" :cancel-title="$t('actions.cancel')" no-fade centered>
            <p>
                {{field.label || field.name}}
            </p>
            <table v-if="valueList && valueList.length" ref="table" class="table table-sm">
                <thead>
                    <th class="text-center">
                        {{$t('property.attribute')}}
                    </th>
                    <th class="text-center">
                        {{$t('property.type')}}
                    </th>
                    <th />
                </thead>
                <tbody>
                    <tr v-for="(row, index) in valueList" :key="index">
                        <td style="width:50%">
                            <v-select :options="suggestions" :multiple="false" :value="row.attribute" :taggable="true"
                                      :close-on-select="true" size="sm" class="vue-select-small"
                                      @input="(v) => attrUpdated(row, 'attribute', v)">
                                <slot name="no-options">
                                    {{$t('messages.noMatching')}}
                                </slot>
                            </v-select>
                        </td>
                        <td style="width:20%">
                            <select class="form-control form-control-sm" :value="row.type" size="sm"
                                    @change="updated($event, row, 'type')">
                                <option v-for="v in dataTypes" :key="v.key" :value="v.key">
                                    {{v.value}}
                                </option>
                            </select>
                        </td>
                        <td style="width:10%" class="text-center">
                            <a href="#" :title="$t('actions.delete')" class="pr-1" @click="remove($event, index)">
                                <font-awesome-icon icon="fa fa-minus-circle" />
                            </a>
                            <a v-if="index !== 0" href="#" :title="$t('actions.moveUp')" class="pr-1"
                               @click="moveUp($event, index)">
                                <font-awesome-icon icon="fa fa-chevron-circle-up" />
                            </a>
                            <a v-if="index !== (valueList.length - 1)" href="#" :title="$t('actions.moveDown')"
                               @click="moveDown($event, index)">
                                <font-awesome-icon icon="fa fa-chevron-circle-down" />
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="mt-2 border-top pt-2">
                <button class="btn btn-success btn-sm" @click.prevent="add">
                    <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                </button>
            </div>
            <template #modal-footer>
                <div class="w-100 text-right">
                    <b-button variant="primary" size="sm" class="mr-1" @click="okClicked">
                        {{$t('common.ok')}}
                    </b-button>
                    <b-button variant="secondary" size="sm" @click="cancelClicked">
                        {{$t('actions.cancel')}}
                    </b-button>
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
    name: 'CastComponent',
    components: {
        LabelComponent, 'v-select': vSelect
    },
    mixins: [Widget],
    props: {
        schema: { type: Object, default: null },
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
                { "en": "Boolean", "value": "Boolean", "key": "Boolean", "pt": "Booleano (l\\u00f3gico)" },
                { "en": "Date", "value": "Date", "key": "Date", "pt": "Data" },
                { "en": "Datetime", "value": "Datetime", "key": "Datetime", "pt": "Data e Hora" },
                { "en": "Time", "value": "Time", "key": "Time", "pt": "Hora" },
                { "en": "Unsigned integer 8 bits", "value": "Unsigned integer 8 bits", "key": "UInt8", "pt": "Inteiro sem sinal de 8 bits" },
                { "en": "Unsigned integer 16 bits", "value": "Unsigned integer 16 bits", "key": "UInt16", "pt": "Inteiro sem sinal de 16 bits" },
                { "en": "Unsigned integer 32 bits", "value": "Unsigned integer 32 bits", "key": "UInt32", "pt": "Inteiro sem sinal de 32 bits" },
                { "en": "Unsigned integer 64 bits", "value": "Unsigned integer 64 bits", "key": "UInt64", "pt": "Inteiro sem sinal de 64 bits" },
                { "en": "Signed integer 8 bits", "value": "Signed integer 8 bits", "key": "Int8", "pt": "Inteiro com sinal de 8 bits" },
                { "en": "Signed integer 16 bits", "value": "Signed integer 16 bits", "key": "Int16", "pt": "Inteiro com sinal de 16 bits" },
                { "en": "Signed integer 32 bits", "value": "Signed integer 32 bits", "key": "Int32", "pt": "Inteiro com sinal de 32 bits" },
                { "en": "Signed integer 64 bits", "value": "Signed integer 64 bits", "key": "Int64", "pt": "Inteiro com sinal de 64 bits" },
                { "en": "Float 32 bits", "value": "Float 32 bits", "key": "Float32", "pt": "Ponto flutuante 32 bits" },
                { "en": "Float 64 bits", "value": "Float 64 bits", "key": "Float64", "pt": "Ponto flutuante 64 bits" },
                { "en": "Text", "value": "Text", "key": "Text", "pt": "Texto" },
                { "en": "Categorical", "value": "Categorical", "key": "Categorical", "pt": "Categórico" },
                { "en": "List", "value": "List", "key": "List", "pt": "Lista" },
                // { "en": "Object", "value": "Object", "key": "Object", "pt": "Objeto" },
                // { "en": "Binary", "value": "Binary", "key": "Binary", "pt": "Binário" },
            ]
        };
    },
    computed: {
        parameters() {
            if (this.field.values.constructor === Object || this.field.values.constructor === Array) {
                return this.field.values;
            } else {
                return JSON.parse(this.field.values);
            }
        },
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
                this.displayValue = v.map((v) => `${v.attribute} = (${v.type}) ${v.attribute}`).join('\n');
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
<style>
.vue-select-small .vs__dropdown-toggle {
    height: 30px;
}

.vue-select-small .vs__fade-enter-active,
.vue-select-small .vs__fade-leave-active {
    transition: none;
}
</style>
