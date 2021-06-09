<template>
    <div>
        <div :style="{'background-color': step.background }" class="mr-1 float-left text-secondary"></div>
        <div class="step-number">
            #{{index + 1}}
        </div>
        <div style="width:15px" class="pt-1 float-left text-secondary step-drag-handle">
            <span class="fa fa-grip-vertical"></span>
            <div class="mt-2">
                <span :class="getStepClass(step)"></span>
            </div>
        </div>
        <div class="float-left step" style="width: calc(100% - 25px)">
            <div class="mb-2">
                <b-form-checkbox v-model="step.selected" class="step-description">
                    <del v-if="!step.enabled">
                        <span v-html="step.description"></span>
                    </del>
                    <span v-else v-html="step.description"></span>
                </b-form-checkbox>
            </div>
            <div class="ml-4">
                <b-button-group v-if="!editing">
                    <b-button variant="light" size="sm" @click="$emit('toggle', step)" :title="$t('actions.enable')">
                        <span v-if="step.enabled" class="fa fa-toggle-on text-success"></span>
                        <span v-else class="fa fa-toggle-off text-secondary"></span>
                    </b-button>

                    <b-button variant="light" size="sm" class="text-primary" @click="edit" :title="$t('actions.edit')">
                        <span class="fa fa-edit"></span>
                    </b-button>

                    <b-button variant="light" size="sm" class="text-secondary" :title="$t('actions.view')"><span
                            class="fa fa-eye"></span>
                    </b-button>

                    <b-button variant="light" size="sm" class="text-secondary" @click="$emit('delete', step.id)"
                        :title="$t('actions.delete')">
                        <span class="fa fa-trash"></span>
                    </b-button>
                    
                    <!--
                    <b-button variant="light" size="sm" class="text-secondary"
                        @click.prevent="$emit('customOpen', $event, step)">
                        <span class="fa fa-ellipsis-h"></span>
                    </b-button>
                    -->
                </b-button-group>
                <div v-else class="border-top" style="width: 100%; padding: 2px">
                    <div class="mb-3">
                        <div v-for="field in step.forms.fields" :key="`${field.name}:${field.childName}`" class="mb-2">
                            |||{{field.value.__ob__ !== undefined}}|||
                            <strong>{{field.label}}:</strong>
                            <template v-if="field.type === 'single-attribute'">
                                <v-select :multiple="false" :taggable="true" :options="suggestedAttributes"
                                    v-model="field.value[0]">
                                    <div slot="no-options"></div>
                                </v-select>
                                <input type="text" v-model="field.value[0]">
                            </template>
                            <template v-if="field.type === 'multiple-attribute'">
                                <v-select :multiple="true" :taggable="true" :options="suggestedAttributes"
                                    v-model="field.value">
                                    <div slot="no-options"></div>
                                </v-select>
                            </template>

                            <template v-else-if="field.type === 'text'">
                                <b-input v-if="field.isList" v-model="field.value[0]" :maxlength="field.maxLength"
                                    size="sm" />
                                <b-input v-else v-model="field.value" :maxlength="field.maxLength" size="sm" />
                            </template>

                            <template v-else-if="field.type === 'dropdown'">
                                {{field.value}}
                                <b-form-select v-model="field.value" :options="field.options" size="sm" />
                            </template>
                            <!--
                            <b>{{field}}</b>
                            {{step.task.forms.$meta}}
                            {{step.task.forms[field.name]}}
                            -->
                        </div>
                        <!--
                        <template v-if="inputAttributes === 'single'">
                            {{$tc('common.attribute')}}:
                            <b-form-select size="sm" v-model="step.task.forms.$meta.attribute">
                                <b-form-select-option :value="attr.label" v-for="attr in validAttributes">
                                    {{attr.label}}
                                </b-form-select-option>
                            </b-form-select>
                        </template>
                        <template v-if="inputAttributes === 'single'">
                            {{$tc('common.attribute', 2)}}:
                            <v-select :multiple="true" :taggable="true" :options="attributes">
                                <div slot="no-options"></div>
                            </v-select>
                        </template>
                        <template v-if="inputAlias">
                            {{$tc('common.alias')}}:
                            <b-form-input size="sm" v-model="step.parameters.alias" />

                            <div v-if="functionName === 'round'">
                                Número de dígitos:
                                <b-form-input type="number" size="sm" />
                            </div>
                        </template>
                        <template v-if="showKeepAttribute" v-model="keepAttribute">
                            <b-form-checkbox>Manter atributo original</b-form-checkbox>
                        </template>
                        <template v-if="keepAttribute">
                            Adicionar novo atributo:
                            <b-form-radio-group plain>
                                <b-form-radio>Antes</b-form-radio>
                                <b-form-radio>Após</b-form-radio>
                            </b-form-radio-group>
                            <v-select :multiple="true" :taggable="true" :options="attributes">
                                <div slot="no-options"></div>
                            </v-select>
                        </template>
                    -->
                    </div>
                    <b-button-group class="float-right">
                        <b-button variant="light text-primary" size="sm" @click="save" :title="$t('actions.save')">
                            <span class="fa fa-save"></span>
                        </b-button>
                        <b-button variant="light" size="sm" @click="cancelEdit" :title="$t('actions.cancel')">
                            <span class="fa fa-undo-alt"></span>
                        </b-button>
                    </b-button-group>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    //import Pulse from '../Pulse';
    import Vue from 'vue';

    export default {
        //components: {Pulse, },
        props: {
            attributes: { type: Array, required: true },
            language: { type: String, required: true },
            inputAttributes: { type: String, default: 'single' },
            inputAlias: { type: Boolean, default: true },
            index: { type: Number, required: true },
            serviceBus: { type: Object },
            showKeepAttribute: { type: Boolean, default: true },
            step: { type: Object, required: true },
        },
        data() {
            return {
                editing: false,
                functionName: '',
                keepAttribute: true,
            }
        },
        computed: {
            // attributes that may be selected based on their type
            validAttributes() {
                switch (this.functionName) {
                    case 'round':
                        return this.attributes.filter(attr => attr.type === 'Decimal');
                    default:
                        return this.attributes;
                }
            },
            suggestedAttributes() {
                return this.attributes.map(a => a.key);
            }
        },
        mounted() {
            this.functionName = this.step.functionName;
        },
        methods: {
            cancelEdit() {
                this.editing = false;
                //this.step = JSON.parse(JSON.stringify(this.step));
            },
            edit() {
                const self = this;
                this.step.forms.fields.forEach((field) => {
                    if (self.step?.forms?.callbacks?.in) {
                        const value = field.isList ? self.step.task.forms[field.name]?.value[0] : self.step.task.forms[field.name]?.value;
                        self.step.forms.callbacks.in(
                            field, value,
                            self.step.task.forms['$meta']?.value);
                    } else if(self.step.task.forms[field.name]) {
                        field.value = JSON.parse(JSON.stringify(self.step.task.forms[field.name]?.value));
                    }
                });
                this.editing = true;
            },
            executeCallback() {
                if (this.step.forms.callback) {
                    this.step.forms.callback("Vamos testar")
                }
            },
            save() {
                //Cloned object doesn't carry function
                //this.step.parameters.i18nArgs = this.step.parameters.i18nArgs;
                //this.step.forms = this.step.parameters.getForms(this.step.parameters.alias,
                //    [this.step.parameters.attributeName,]);
                if (this.step?.forms?.callbacks?.out) {
                    this.step?.forms?.callbacks?.out(this.step, this.step.task.forms['$meta']?.value);
                }
                this.$emit('update', this.step, this.language);
                this.editing = false;
            },
            getStepClass(step) {
                if (step === undefined) { return ''; }
                else if (step.status === 'ERROR') { return 'fa text-danger fa-times-circle' }
                else if (step.status === 'COMPLETED') { return 'fa text-success fa-check-circle' }
                else if (step.status === 'CANCELED') { return 'fa text-secondary fa-hand-paper' }
            }
        },
    }
</script>
<style scoped>
    .step {
        font-size: 10pt;
        min-height: 60px;
        width: 3px;
    }

    .step-description {
        color: #888;
    }

    .step-number {
        color: #bbb;
        font-size: 8pt;
        padding: 4px;
        position: absolute;
        top: 0;
        right: 0;
    }

    .step-description>>>b {
        /*background-color: #17a2b8;*/
        /*border: 1px solid #17a2b8;
        border-radius: 3px;
        color: #17a2b8;*/
        color: #222;
        display: block;
        font-size: 9pt;
        /*
        font-weight: normal;
        padding: 1px 5px;*/
    }

    .step-description>>>code {
        color: #222;
        font-weight: lighter;
    }
</style>