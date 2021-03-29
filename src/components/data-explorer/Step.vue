<template>
    <div>

        <div :style="{'background-color': editableStep.background }" class="mr-1 float-left text-secondary"></div>
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
                <b-form-checkbox v-model="editableStep.selected" class="step-description">
                    <del v-if="!step.enabled">
                        <span v-html="editableStep.description"></span>
                    </del>
                    <span v-else v-html="editableStep.description"></span>
                </b-form-checkbox>
            </div>
            <div class="ml-4">
                <b-button-group v-if="!editing">
                    <b-button variant="light" size="sm" @click="$emit('toggle', step)">
                        <span v-if="step.enabled" class="fa fa-toggle-on text-success"></span>
                        <span v-else class="fa fa-toggle-off text-secondary"></span>
                    </b-button>

                    <b-button variant="light" size="sm" class="text-primary" @click="edit"><span
                            class="fa fa-edit"></span>
                    </b-button>

                    <b-button variant="light" size="sm" class="text-secondary"><span class="fa fa-eye"></span>
                    </b-button>

                    <b-button variant="light" size="sm" class="text-secondary"
                        @click="$emit('delete', editableStep.id)">
                        <span class="fa fa-trash"></span>
                    </b-button>

                    <b-button variant="light" size="sm" class="text-secondary"
                        @click.prevent="$emit('customOpen', $event, editableStep)">
                        <span class="fa fa-ellipsis-h"></span>
                    </b-button>
                </b-button-group>
                <div v-else class="border-top" style="width: 100%; padding: 2px">
                    <div class="mb-3">
                        <template v-if="inputAttributes === 'single'">
                            {{$tc('common.attribute')}}:
                            <b-form-select size="sm" v-model="editableStep.task.forms.$meta.attribute">
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
                            <b-form-input size="sm" v-model="editableStep.parameters.alias" />

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
                    </div>
                    <b-button-group class="float-right">
                        <b-button variant="light text-primary" size="sm" @click="save">
                            <span class="fa fa-save"></span>
                        </b-button>
                        <b-button variant="light" size="sm" @click="cancelEdit">
                            <span class="fa fa-undo-alt"></span>
                        </b-button>
                    </b-button-group>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            attributes: { type: Array, required: true },
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
                editableStep: JSON.parse(JSON.stringify(this.step)),
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
            }
        },
        mounted() {
            this.functionName = this.step.functionName;
        },
        methods: {
            cancelEdit() {
                this.editing = false;
                this.editableStep = JSON.parse(JSON.stringify(this.step));
            },
            edit() {
                this.editing = true;
            },
            save() {
                //Cloned object doesn't carry function
                this.editableStep.parameters.i18nArgs = this.step.parameters.i18nArgs;
                this.editableStep.forms = this.step.parameters.getForms(this.editableStep.parameters.alias,
                    [this.editableStep.parameters.attributeName,]);

                this.$emit('update', this.editableStep);
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