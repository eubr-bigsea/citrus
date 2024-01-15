<template>
    <div v-if="readOnly">
        <span>{{value?(multiple? value.join(', '): value): ''}}</span>
    </div>
    <div v-else>
        <LabelComponent :field="field" :value="value" />
        <div v-if="multiple">
            <textarea readonly :value="displayValue" class="form-control pointer" :rows="rows"
                      @click.prevent="openModal" />
            <b-modal ref="modal" size="xl" :title="field.label" ok-disabled
                     :cancel-title="$t('actions.cancel')"
                     no-fade>
                <template #default>
                    <div class="row">
                        <div class="col-12">
                            <div class="alert alert-info">
                                <font-awesome-icon icon="fa fa-info-circle" />
                                <small>
                                    {{$t('property.clickToMove', 2)}}.
                                    {{$t('property.multipleTimes')}}
                                </small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <small>{{$t('property.availableAttribute', 2)}}:</small>
                            <div class="left options border mt-1 p-2">
                                <div v-for="(suggestion, index) in available" :key="suggestion"
                                     class="border mb-1 p-1 suggested-attr" role="button" :title="suggestion"
                                     @click="move('right', index)">
                                    {{suggestion}}
                                </div>
                            </div>
                            <label class="m-0 mt-2"><small>{{$t('property.informAttributeName')}}:</small></label>
                            <b-input-group class="">
                                <b-form-input v-model="extra" class="form-control-sm" maxlength="50" />
                                <b-input-group-append>
                                    <b-button size="sm" :disabled="extra === null || extra.trim() === ''" @click="add">
                                        {{$t('actions.addItem')}}
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                        <div class="text-center mt-5 text-center actions col-md-1">
                            <div v-if="!single">
                                <b-button class="mb-1" variant="" size="sm" @click="move('all-right', null)">
                                    &gt;&gt;
                                </b-button>
                                <br>
                                <b-button class="mb-1" variant="" size="sm" @click="move('all-left', null)">
                                    &lt;&lt;
                                </b-button>
                            </div>
                        </div>
                        <div class="p-0 col-md-7">
                            <div class="row">
                                <div class="col-6">
                                    <small>
                                        {{$t('property.selectedAttribute', 2)}}:
                                    </small>
                                </div>
                                <div class="col-6">
                                    <small>{{$t('property.alias', 2)}}
                                        ({{$t('common.optional')}}):</small>
                                </div>
                                <div class="col-12">
                                    <div class="options border mt-1 p-2">
                                        <div v-for="(item, index) in selected" :key="index" class="row">
                                            <div class="mb-1 col-6 border-right">
                                                <div class="border selected-attr" role="button" :title="item.attribute"
                                                     @click="move('left', index)">
                                                    {{item.attribute}}
                                                </div>
                                            </div>
                                            <div :key="index + 'a'" class="col-5">
                                                <input v-model="item.alias" type="text"
                                                       class="form-control form-control-sm" :placeholder="item.attribute">
                                            </div>
                                            <div>
                                                <a v-if="index !== 0" href="#" :title="$t('actions.moveUp')"
                                                   class="me-2" @click.prevent="moveUp($event, index)">
                                                    <font-awesome-icon icon="fa fa-arrow-up" />
                                                </a>
                                                <a v-if="index !== (value.length - 1)" href="#"
                                                   :title="$t('actions.moveDown')"
                                                   @click.prevent="moveDown($event, index)">
                                                    <font-awesome-icon icon="fa fa-arrow-down" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #modal-footer>
                    <b-button variant="outline-secondary" size="sm" class="float-end" @click="cancelModal">
                        {{$t('actions.cancel')}}
                    </b-button>
                    <b-button variant="primary me-1" size="sm" class="float-end" @click="okModal">
                        {{$t('common.ok')}}
                    </b-button>
                </template>
            </b-modal>
        </div>
        <div v-else>
            <v-select v-model="select2Value" :options="suggestions" :multiple="false" :taggable="true"
                      :close-on-select="true" @input="updated" />
        </div>
        <b-link v-if="!readOnly" variant="sm" @click.prevent="openModal">
            {{$t('property.editValue')}}
        </b-link>
    </div>
</template>
<script>
import vSelect from "vue-select";
import LabelComponent from './Label.vue';
import Widget from '../../mixins/Widget.js';
export default {
    components: {
        'v-select': vSelect,
        LabelComponent
    },
    mixins: [Widget],
    props: {
        single: { default: false, type: Boolean },
    },
    data() {
        return {
            aliases: [],
            extra: '',
            select2Value: '',
            originalValue: { default: [] },
            suggestions: [],
            fieldParameters: {}
        };
    },
    computed: {
        displayValue() {
            return this.value ? this.value.map(v =>
                v?.alias ? `${v.attribute} => ${v.alias}` : v.attribute).join('\n') : '';
        },
        multiple() {
            return this.fieldParameters.multiple !== false;
        },
        params() {
            return this.fieldParameters;
        },
        available() {
            return this.suggestions;
        },
        rows() {
            return Math.min(Math.max(2, this?.value?.length || 0), 5);
        },
        selected: {
            get() {
                return this.value || this.field.default;
            },
            set(newValue) {
                this.value = newValue;
            }
        },

    },
    mounted() {
        let value = this.value || [];
        if (value && Array.isArray(value) && value.length && typeof (value[0]) !== 'object') {
            // Handle legacy format
            value = value.map(v => { return { attribute: v, alias: null }; });
        }
        this.updated(value);
        this.originalValue = value;
        if (this.field && this.field.values) {
            const o = this.field.values;
            if (o !== null && typeof o === 'object' && Array.isArray(o) === false) {
                this.fieldParameters = o;
            } else {
                this.fieldParameters = JSON.parse(o);
            }
        }
        if (this.fieldParameters.multiple === false && this.suggestionEvent) {
            this.suggestions = this.suggestionEvent() || [];
            this.select2Value = this.value;
        }
    },
    methods: {
        add() {
            let sel = this.value ? [... this.value] : [];
            if (this.extra && sel.indexOf(this.extra) === -1) {
                sel.push({ attribute: this.extra, alias: null });
                this.extra = '';
            } else {
                this.extra = '';
            }
            this.updated(sel);
        },
        move(direction, index) {
            if (direction === 'all-right') {

                let sel = this.value ? [... this.value] : [];
                this.suggestions.forEach((v) => {
                    if (sel.indexOf(v) === -1)
                        sel.push({ attribute: v, alias: null });
                });
                this.updated(sel);
            } else if (direction === 'all-left') {
                this.updated([]);
            } else if (direction === 'right') {
                const attribute = this.available[index];
                const newItem = { attribute };
                // Prevent duplicated aliases
                const repetition = this.value.filter(a => a.attribute === attribute || a.alias === attribute).length;
                if (repetition > 0) {
                    newItem['alias'] = `${attribute}${repetition}`;
                }
                if (!this.value) {
                    this.updated([newItem]);
                } else {
                    this.updated([... this.value.concat(newItem)]);
                }
            } else if (direction == 'left') {
                this.updated(this.value.filter((a, i) => i !== index));
            }
        },
        moveUp(e, index) {
            const sel = this.value ? [... this.value] : [];
            const tmp = sel.splice(index, 1)[0];
            sel.splice(index - 1, 0, tmp);
            this.updated(sel);
        },
        moveDown(e, index) {
            const sel = this.value ? [... this.value] : [];
            const tmp = sel.splice(index, 1)[0];
            sel.splice(index + 1, 0, tmp);
            this.updated(sel);
        },
        updated(val) {
            if (Array.isArray(val)) {
                this.triggerUpdateEvent(this.message, this.field, val);
            } else {
                this.triggerUpdateEvent(this.message, this.field, [val]);
            }
            this.$forceUpdate();
        },
        okModal() {
            this.originalValue = [... this.value];
            this.$refs.modal.hide();
        },
        cancelModal() {
            this.updated([... this.originalValue]);
            this.$refs.modal.hide();
        },
        async openModal() {
            if (this.suggestionEvent) {
                this.suggestions = this.suggestionEvent() || [];
            }
            this.$refs.modal.show();
        }
    },
};
</script>
<style scoped>
div.options {
    height: 320px;
    overflow-x: hidden;
    overflow-y: auto;
    margin-right: 15px;
    -webkit-user-select: none;
    /* Chrome all / Safari all */
    -moz-user-select: none;
    /* Firefox all */
    -ms-user-select: none;
    /* IE 10+ */
    user-select: none;
    /* Likely future */
}

div.options.left {
    height: 250px;
}

div.actions>button {
    width: 50px;
    display: block;
    margin: 5px auto;
}

div.suggested-attr,
div.selected-attr {
    font-size: 10pt;
    border-radius: 4px;
    max-height: 30px;
    overflow: hidden;
    padding: 4px 10px !important;
    text-overflow: ellipsis;
    white-space: nowrap;
    align-items: flex-start;
}

div.selected-attr {
    background: #DDDDDD
}

.pointer {
    cursor: pointer;
}
</style>
