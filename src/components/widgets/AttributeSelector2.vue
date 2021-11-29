<template>
    <div v-if="readOnly">
        <span>{{value ? (multiple ? value.join(', '): value): ''}}</span>
    </div>
    <div v-else>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <div v-if="multiple">
            <textarea readonly :value="value ? value.join(', '): ''" class="form-control pointer"
                @click.prevent="openModal"></textarea>
            <b-modal size="lg" :title="field.label" ok-disabled :cancel-title="$t('actions.cancel')" ref="modal"
                no-fade>
                <div slot="default">
                    <div class="row">
                        <div class="col-md-4 offset-md-1 p-0">
                            <small>{{$tc('property.availableAttribute', 2)}}:</small>
                            <div class="left options border mt-1 p-2">
                                <div v-for="(suggestion, index) in available" class="border mb-1 p-1 suggested-attr"
                                    :key="suggestion" @click="move('right', index)">
                                    {{suggestion}}
                                </div>
                            </div>
                            <label class="m-0 mt-2"><small>{{$t('property.informAttributeName')}}:</small></label>
                            <b-input-group class="">
                                <b-form-input v-model="extra" class="form-control-sm"></b-form-input>
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
                            <small>{{$tc('property.selectedAttribute', 2)}}:</small>
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
                    <b-btn @click="cancelModal" variant="outline-secondary" size="sm" class="float-right">{{$t('actions.cancel')}}
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
            multiple() {
                return this.fieldParameters.multiple !== false
            },
            params() {
                return this.fieldParameters;
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
                select2Value: '',
                originalValue: { default: [] },
                suggestions: [],
                fieldParameters: {}
            }
        },
        mounted() {
            this.originalValue = [... (this.value || [])];
            if (this.field && this.field.values) {
                const o = this.field.values;
                if (o !== null && typeof o === 'object' && Array.isArray(o) === false){
                    this.fieldParameters = o;
                } else {
                    this.fieldParameters = JSON.parse(o);
                }
            }
            if (this.fieldParameters.multiple === false && this.suggestionEvent) {
                this.suggestions = this.suggestionEvent();
                this.select2Value = this.originalValue;
            }
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
                    
                    let sel = this.value ? [... this.value] : [];
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
            openModal() {
                this.$refs.modal.show();
                if (this.suggestionEvent) {
                    this.suggestions = this.suggestionEvent();
                }
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

    .pointer {
        cursor: pointer;
    }
</style>