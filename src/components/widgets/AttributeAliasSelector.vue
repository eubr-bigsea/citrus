<template>
    <div v-if="readOnly">
        <span>{{value ? (multiple ? value.join(', '): value): ''}}</span>
    </div>
    <div v-else>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <div v-if="multiple">
            <textarea readonly :value="displayValue" class="form-control pointer" @click.prevent="openModal"
                :rows="rows"></textarea>
            <b-modal size="xl" :title="field.label" ok-disabled :cancel-title="$t('actions.cancel')" ref="modal"
                no-fade>
                <div slot="default">
                    <div class="row">
                        <div class="col-12">
                            <div class="alert alert-info"><span class="fa fa-info-circle"></span>
                                <small>
                                {{$tc('property.clickToMove', 2)}}.
                                {{$tc('property.multipleTimes')}}
                            </small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <small>{{$tc('property.availableAttribute', 2)}}:</small>
                            <div class="left options border mt-1 p-2">
                                <div v-for="(suggestion, index) in available" class="border mb-1 p-1 suggested-attr"
                                    role="button" :key="suggestion" @click="move('right', index)" :title="suggestion">
                                    {{suggestion}}
                                </div>
                            </div>
                            <label class="m-0 mt-2"><small>{{$t('property.informAttributeName')}}:</small></label>
                            <b-input-group class="">
                                <b-form-input v-model="extra" class="form-control-sm" maxlength="50" />
                                <b-input-group-append>
                                    <b-button size="sm" @click="add" :disabled="extra === null || extra.trim() === ''">
                                        {{$t('actions.addItem')}}</b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                        <div class="text-center mt-5 text-center actions col-md-1">
                            <div v-if="!single">
                                <b-btn @click="move('all-right', null)" class="mb-1" variant="" size="sm">&gt;&gt;
                                </b-btn>
                                <br />
                                <b-btn @click="move('all-left', null)" class="mb-1" variant="" size="sm">&lt;&lt;
                                </b-btn>
                            </div>
                        </div>
                        <div class="p-0 col-md-7">
                            <div class="row">
                                <div class="col-6"><small>
                                        {{$tc('property.selectedAttribute', 2)}}:
                                    </small></div>
                                <div class="col-6"><small>{{$tc('property.alias', 2)}}
                                        ({{$tc('common.optional')}}):</small></div>
                                <div class="col-12">
                                    <div class="options border mt-1 p-2">
                                        <div class="row">
                                            <template v-for="(item, index) in selected">
                                                <div class="mb-1 col-6 border-right">
                                                    <div class="border selected-attr" role="button"
                                                        @click="move('left', index)" :title="item.attribute">
                                                        {{item.attribute}}
                                                    </div>
                                                </div>
                                                <div class="col-5">
                                                    <input type="text" class="form-control form-control-sm"
                                                        :placeholder="item.attribute" v-model="item.alias"/>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div slot="modal-footer">
                    <b-btn @click="cancelModal" variant="outline-secondary" size="sm" class="float-right">
                        {{$t('actions.cancel')}}
                    </b-btn>
                    <b-btn @click="okModal" variant="primary mr-1" size="sm" class="float-right">{{$t('common.ok')}}
                    </b-btn>
                </div>
            </b-modal>
        </div>
        <div v-else>
            <v-select :options="suggestions" :multiple="false" v-model="select2Value" @input="updated" :taggable="true"
                :closeOnSelect="true">
            </v-select>
        </div>
    </div>

</template>
<script>
    import vSelect from "vue-select";
    import LabelComponent from './Label.vue';
    import Widget from '../../mixins/Widget.js';
    export default {
        mixins: [Widget],
        components: {
            'v-select': vSelect,
            LabelComponent
        },
        computed: {
            displayValue() {
                return this.value ? this.value.map(v => 
                    v?.alias ? `${v.attribute} => ${v.alias}` : v.attribute).join('\n') : '';
            },
            multiple() {
                return this.fieldParameters.multiple !== false
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
        data() {
            return {
                aliases: [],
                extra: '',
                select2Value: '',
                originalValue: { default: [] },
                suggestions: [],
                fieldParameters: {}
            }
        },
        mounted() {
            let value = this.value || [];
            if (value && Array.isArray(value) && value.length && typeof(value[0]) !== 'object') {
                // Handle legacy format
                value = value.map(v => { return { attribute: v, alias: null} });
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
                    sel.push({attribute: this.extra, alias: null});
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
                            sel.push({attribute: v, alias: null})
                    });
                    this.updated(sel);
                } else if (direction === 'all-left') {
                    this.updated([]);
                } else if (direction === 'right') {
                    const attribute = this.available[index];
                    const newItem = {attribute};
                    // Prevent duplicated aliases
                    const repetition = this.value.filter(a => a.attribute === attribute || a.alias === attribute).length;
                    if (repetition > 0){
                        newItem['alias'] = `${attribute}${repetition}`
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
            updated(val) {
                if (Array.isArray(val)) {
                    this.triggerUpdateEvent(this.message, this.field, val);
                } else {
                    this.triggerUpdateEvent(this.message, this.field, [val])
                }
                this.$forceUpdate();
            },
            okModal() {
                this.originalValue = [... this.value]
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
        props: {
            single: { default: false },
        },
    }
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