<template>
    <div>
        <label-component :field="field" :value="value" />
        <div v-if="multiple">
            <textarea disabled :value="value ? value.join(', '): ''" class="form-control bold" :readonly="readonly" />

            <b-link v-if="!readonly" v-b-modal="'lookupModal' + field.order" variant="sm">
                <span v-if="selected === '' || selected === null ">{{$t('actions.chooseOption')}}</span>
                <span v-if="selected !== '' && selected !== null ">{{$t('actions.changeOption')}}</span>
            </b-link>
            <b-modal v-if="!readonly" :id="'lookupModal' + field.order" size="lg" :title="field.label" ok-disabled
                :cancel-title="$t('actions.cancel')" ref="modal" no-fade>
                <div slot="default">
                    <div class="row">
                        <!--
					<div class="col-md-12">
                        <b-form-group>
                          <b-form-checkbox-group id="checkbox-group-2" v-model="value" name="flavour-2">
                            <b-form-checkbox v-for="s in suggestions" :value="s" class="col-md-3">{{s}}</b-form-checkbox>
                          </b-form-checkbox-group>
                        </b-form-group>
					</div>
					-->
                        <div class="col-md-4 offset-md-1 p-0">
                            <span>{{$tc('property.availableAttribute', 2)}}:</span>
                            <div class="left options border mt-1 p-2">
                                <div v-for="(suggestion, index) in available" class="border mb-1 p-1 suggested-attr"
                                    :key="suggestion" @click="move('right', index)">
                                    {{suggestion}}
                                </div>
                            </div>
                            <label class="m-0 mt-2">{{$t('property.informAttributeName')}}:</label>
                            <b-input-group class="">
                                <b-form-input v-model="extra"></b-form-input>
                                <b-input-group-append>
                                    <b-button size="sm" @click="add" :disabled="extra === null || extra.trim() === ''">
                                        {{$t('actions.addItem')}}</b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                        <div class="col-md-2 text-center mt-5 actions">
                            <div v-if="!single">
                                <b-btn @click="move('all-right', null)" class="mb-1" variant="" size="sm">&gt;&gt;
                                </b-btn>
                                <br />
                                <b-btn @click="move('all-left', null)" class="mb-1" variant="" size="sm">&lt;&lt;
                                </b-btn>
                                <br />
                                <div class="border border-info">{{$tc('property.clickToMove', 2)}}</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <span>{{$tc('property.selectedAttribute', 2)}}:</span>
                            <div class="options border mt-1 p-2">
                                <div v-for="(suggestion, index) in value" class="border mb-1 p-1 selected-attr"
                                    :key="suggestion" @click="move('left', index)">
                                    {{suggestion}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div slot="modal-footer">
                    <b-btn @click="cancelModal" variant="" size="sm" class="float-right">{{$t('actions.cancel')}}
                    </b-btn>
                    <b-btn @click="okModal" variant="success mr-1" size="sm" class="float-right">{{$t('common.ok')}}
                    </b-btn>
                </div>
            </b-modal>
        </div>
        <div v-else>
            <v-select :options="suggestions" :multiple="multiple" :value.sync="value" :on-change="updated"
                :taggable="true" :close-on-select="true" :disabled="readonly">
                <slot name="no-options">{{ $t('messages.noMatching') }}</slot>
            </v-select>
        </div>
    </div>
</template>
<script>
    import vSelect from "vue-select";
    import LabelComponent from './Label.vue'
    export default {
        components: {
            'v-select': vSelect,
            'label-component': LabelComponent
        },
        computed: {
            multiple() {
                return true;
                /*
                if (this.field && this.field.values){
                    return JSON.parse(this.field.values).multiple !== false;
                } else {
                    return {};
                }
                */
            },
            params() {
                let result = null;
                if (this.field.values) {
                    result = JSON.parse(this.field.values);
                }
                return result;
            },
            available() {
                return this.suggestions.filter(x => this.value === null || !this.value.includes(x));
            },
            selected: {
                get() {
                    return this.value || this.field.default;
                },
                set(newValue) {
                    this.value = newValue;
                }
            }
        },
        data() {
            return {
                extra: '',
                originalValue: { default: [] }
            }
        },
        mounted() {
            this.originalValue = [... (this.value || [])];
        },
        methods: {
            add() {
                if (this.extra && this.value.indexOf(this.extra) === -1) {
                    this.value.push(this.extra);
                    this.extra = '';
                } else {
                    this.extra = '';
                }
            },
            move(direction, index) {
                if (direction === 'all-right') {
                    let sel = [... this.value];
                    this.suggestions.forEach((v) => {
                        if (sel.indexOf(v) === -1)
                            sel.push(v)
                    });
                    this.updated(sel);
                } else if (direction === 'all-left') {
                    this.updated([]);
                } else if (direction === 'right') {
                    if (!this.value) {
                        this.updated([this.available[index]]);
                    } else {
                        this.updated([... this.value.concat(this.available[index])]);
                    }
                } else if (direction == 'left') {
                    this.updated(this.value.filter((a, i) => i !== index));
                }
            },
            updated(val) {
                if (Array.isArray(val)) {
                    this.$root.$emit(this.message, this.field, val);
                } else {
                    this.$root.$emit(this.message, this.field, [val]);
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
        },
        props: {
            single: { default: false },
            value: "", field: null, suggestions: { required: true },
            message: {
                type: String,
                default: 'update-form-field-value'
            },
            suggestions: { default: [] },
            readonly: {
                type: Boolean,
                default: true
            }
        },
    }
</script>
<style scoped>
    div.options {
        height: 320px;
        overflow: auto;
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


    /* width */
    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #888;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    .bold {
        font-weight: bold;
    }

    div.actions>button {
        width: 50px;
        display: block;
        margin: 5px auto;
    }

    div.suggested-attr,
    div.selected-attr {
        border-radius: 4px;
        padding: 2px 10px !important;
        cursor: pointer;
    }

    div.selected-attr {
        background: #DDDDDD
    }
</style>