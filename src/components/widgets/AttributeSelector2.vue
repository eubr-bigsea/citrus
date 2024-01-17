<template>
    <div v-if="readOnly">
        <span>{{value?(multiple? value.join(', '): value): ''}}</span>
    </div>
    <div v-else>
        <LabelComponent :field="field" :value="value" />
        <div v-if="multiple">
            <textarea readonly :value="value ? value.join(', ') : ''" class="form-control pointer"
                      :rows="(value && value.length) ? Math.min(value.length / 3, 10) : 2" @click.prevent="openModal" />
            <b-modal ref="modal" size="lg" :title="field.label" ok-disabled
                     :cancel-title="$t('actions.cancel')"
                     no-fade>
                <template #default>
                    <div class="row">
                        <div class="col-md-4 offset-md-1 p-0">
                            <small>{{$t('property.availableAttribute', 2)}}:</small>
                            <div class="left options border mt-1 p-2">
                                <div v-for="(suggestion, index) in available" :key="suggestion"
                                     class="border mb-1 p-1 suggested-attr" @click="move('right', index)">
                                    {{suggestion}}
                                </div>
                            </div>
                            <label class="m-0 mt-2"><small>{{$t('property.informAttributeName')}}:</small></label>
                            <b-input-group class="">
                                <b-form-input v-model="extra" class="form-control-sm" />
                                <b-input-group-append>
                                    <b-button size="sm" :disabled="extra === null || extra.trim() === ''" @click="add">
                                        {{$t('actions.addItem')}}
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                        <div class="col-md-2 text-center mt-5 actions">
                            <div v-if="!single">
                                <b-button class="mb-1" variant="secondary" size="sm" @click="move('all-right', null)">
                                    &gt;&gt;
                                </b-button>
                                <br>
                                <b-button class="mb-1" variant="secondary" size="sm" @click="move('all-left', null)">
                                    &lt;&lt;
                                </b-button>
                                <br>
                                <div class="border border-info">
                                    {{$t('property.clickToMove', 2)}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <small>{{$t('property.selectedAttribute', 2)}}:</small>
                            <div class="options border mt-1 p-2">
                                <div v-for="(suggestion, index) in value" :key="suggestion"
                                     class="border mb-1 p-1 selected-attr" @click="move('left', index)">
                                    {{suggestion}}
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
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
            extra: '',
            select2Value: '',
            originalValue: { default: [] },
            suggestions: [],
            fieldParameters: {}
        };
    },
    computed: {
        multiple() {
            return this.fieldParameters.multiple !== false;
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
    mounted() {
        this.originalValue = [... (this.value || [])];
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
            this.select2Value = this.originalValue;
        }
    },
    methods: {
        add() {
            let sel = this.value ? [... this.value] : [];
            if (this.extra && sel.indexOf(this.extra) === -1) {
                sel.push(this.extra);
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
                        sel.push(v);
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
