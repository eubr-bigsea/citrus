<template>
    <div>
        <div :style="{'background-color': step.background }" class="mr-1 float-left text-secondary"></div>
        <div class="step-number">
            #{{index + 1}}
        </div>
        <div style="width:15px" class="float-left text-secondary step-drag-handle">
            <span class="fa fa-grip-vertical"></span>
            <div class="mt-2">
                <span :class="getStepClass(step)"></span>
            </div>
        </div>
        <div class="float-left step" style="width: calc(100% - 25px)">
            <div class="mb-2">
                <b-form-checkbox v-model="step.selected" class="step-description">
                    <del v-if="!step.enabled">
                        <span v-html="step.name"></span>
                    </del>
                    <span v-else v-html="step.name"></span>
                </b-form-checkbox>
            </div>
            <div class="">
                <b-button-group v-if="!editing" class="zoom-85">
                    <b-button variant="light" size="sm" @click="$emit('toggle', step)" :title="$t('actions.enable')">
                        <span v-if="step.enabled" class="fa fa-toggle-on text-success"></span>
                        <span v-else class="fa fa-toggle-off text-secondary"></span>
                    </b-button>

                    <b-button variant="light" size="sm" class="text-secondary" @click="edit" :title="$t('actions.edit')">
                        <span class="fa fa-edit"></span>
                    </b-button>

                    <!--
                    <b-button variant="light" size="sm" class="text-secondary" :title="$t('actions.view')"><span
                            class="fa fa-eye"></span>
                    </b-button>
                    -->

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
                        <template v-for="form in step.operation.forms">
                            <div v-for="field in form.fields" :key="`${step.id}:${field.name}`" class="mb-2 zoom-85">
                                <component :is="getWidget(field)" :field="field" :value="getValue(field.name)"
                                    :type="field.suggested_widget" :read-only="!field.editable" context="context">
                                </component>
                            </div>
                        </template>
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
            getValue(name) {
                return this.task
                    && this.task.forms
                    && this.task.forms[name]
                    ? this.task.forms[name].value : null;
            },
            getWidget(field) {
                if (field.suggested_widget.endsWith(':read-only')) {
                    const s = field.suggested_widget;
                    return s.substring(0, s.length - 10) + '-component';
                } else {
                    return field.suggested_widget + '-component';
                }
            },
            cancelEdit() {
                this.editing = false;
                //this.step = JSON.parse(JSON.stringify(this.step));
            },
            edit() {
                this.editing = true;
            },
            edit2() {
                const self = this;
                this.step.forms.fields.forEach((field) => {
                    if (self.step?.forms?.callbacks?.in) {
                        const value = field.isList ? self.step.task.forms[field.name]?.value[0] : self.step.task.forms[field.name]?.value;
                        self.step.forms.callbacks.in(
                            field, value,
                            self.step.task.forms['$meta']?.value);
                    } else if (self.step.task.forms[field.name]) {
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
    .zoom-85 {
        zoom: 85%;
    }
</style>