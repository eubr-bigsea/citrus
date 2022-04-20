<template>
    <div style="display: flex;" :class="{'soft-disabled': !step.previewable, 'hard-disabled': !step.enabled}">
        <!--
        <div style="width:2px" :style="{'background-color': step.backgroundColor}"
            class="mr-1"></div>
        -->
        <div class="float-left text-secondary step-drag-handle">
            <span class="fa fa-grip-vertical" v-if="!protected"></span>
            <!--
            <div class="mt-2">
                <span :class="getStepClass(step)"></span>
            </div>
            -->
        </div>
        <div v-if="hasProblems" class="pulse-item">
            <Pulse title="Existem problemas na configuração. Edite para corrigir." />
        </div>
        <div class="float-left step" style="width: calc(100% - 25px)" ref="step">
            <div class="step-description">
                <input type="checkbox" v-model="step.selected" v-if="!protected" />&nbsp;
                <span class="step-number">#{{index + 1}}</span> -
                <del v-if="!step.enabled">
                    <span v-html="step.getLabel()"></span>
                </del>
                <span v-else v-html="step.getLabel()"></span>
            </div>
            <div>
                <span v-if="step.error" class="fa fa-exclamation-circle text-danger" v-b-tooltip.html
                    :title="step.error"></span>

                <small v-if="step.forms.comment.value" class="text-secondary">{{step.forms.comment.value}}</small>
                <b-button-group v-if="!step.editing" class="zoom-buttom float-right">
                    <b-button v-if="step.previewable" variant="light" size="sm" class="text-primary"
                        @click="edit('execution')" :title="$t('actions.edit')">
                        <span class="fa fa-edit"></span>
                    </b-button>
                    <b-button variant="light" size="sm" class="text-secondary"
                        @click="$emit('previewUntilHere', step.id)" :title="$t('common.previewUntilHere')">
                        <span class="fa"
                            :class="{'fa-eye': step.previewable, 'fa-eye-slash': !step.previewable}"></span>
                    </b-button>

                    <b-button v-if="!protected" variant="light" size="sm" class="text-secondary"
                        @click="$emit('delete', step.id)" :title="$t('actions.delete')">
                        <span class="fa fa-trash"></span>
                    </b-button>
                    <b-button v-if="index > 0" variant="light" size="sm" @click="$emit('toggle', step)"
                        :title="step.enabled ? $t('actions.disable') : $t('actions.enable')">
                        <span v-if="step.enabled" class="fa fa-toggle-on text-success"></span>
                        <span v-else class="fa fa-toggle-off text-secondary"></span>
                    </b-button>
                    <b-dropdown size="lg" variant="light" class="zoom-buttom" no-caret>
                        <template #button-content>
                            <span class="fa fa-ellipsis-h"></span>
                        </template>
                        <b-dropdown-item href="#" @click.prevent="edit('appearance')">{{$tc('titles.comment')}} &amp;
                            {{$tc('titles.color').toLowerCase()}} </b-dropdown-item>
                        <b-dropdown-item href="#" @click.prevent="$emit('duplicate', step)">{{$tc('actions.duplicate')}}
                            {{$tc('dataExplorer.step').toLowerCase()}}</b-dropdown-item>
                    </b-dropdown>
                    <!--
                    <b-button variant="light" size="sm" class="text-secondary"
                        @click.prevent="$emit('customOpen', $event, step)">
                        <span class="fa fa-ellipsis-h"></span>
                    </b-button>
                    -->
                </b-button-group>
                <div v-else class="border-top" style="width: 100%; padding: 2px; zoom:90%">
                    <div class="mb-3">
                        <template v-for="form in step.operation.forms" v-if="form.category === displayFormCategory">
                            <div v-for="field in form.fields" v-if="field.editable" :key="`${step.id}:${field.name}`"
                                class="mb-2 step-properties">
                                <component v-if="field.enabled !== false" :is="getWidget(field)" :field="field"
                                    :value="getValue(field.name)" :language="language" :type="field.suggested_widget"
                                    :read-only="!field.editable" context="context" @update="updateField"
                                    :suggestionEvent="suggestionEvent">
                                </component>
                            </div>
                        </template>
                    </div>
                    
                    <b-button-group class="float-right mb-2">
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
    import Pulse from '../../components/Pulse';
    import Vue from 'vue';
    export default {
        components: { Pulse, },
        props: {
            attributes: { type: Array, required: true },
            inputAttributes: { type: String, default: 'single' },
            inputAlias: { type: Boolean, default: true },
            index: { type: Number, required: true },
            language: { type: String, required: true },
            protected: { type: Boolean, default: false },
            serviceBus: { type: Object },
            showKeepAttribute: { type: Boolean, default: true },
            step: { type: Object, required: true },
            suggestionEvent: { type: Function },
        },
        data() {
            return {
                displayFormCategory: 'execution', //what kind of form to display and edit
                functionName: '',
                keepAttribute: true,
                editableStep: null,
            }
        },
        computed: {
            hasProblems() {
                const self = this;
                return this.step.operation.forms.find(f => f.category === 'execution')
                    .fields.find(field => {
                        return (field.required && (!self.step.forms[field.name] || !self.step.forms[field.name].value))
                    }) !== undefined;
            },
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
            },
        },
        mounted() {
            this.functionName = this.step.functionName;
            this.editableStep = JSON.parse(JSON.stringify(this.step));
            const op = this.step.operation;
        },
        methods: {
            evalInContext(js, context) {
                return new Function(`return ${js};`).call(context);
            },
            updateField(field, value, labelValue) {
                const self = this;
                this.editableStep.forms[field.name] = { value };

                this.enableDisableFields()
            },
            enableDisableFields() {
                /* Enable/disable fields according to the new value*/
                const self = this;
                const conditional = /\bthis\..+?\b/g;
                const allFields = {};

                this.step.operation.forms.forEach((f, i) => {
                    f.fields.forEach((field, j) => {
                        if (this.editableStep.forms[field.name]) {
                            allFields[field.name] = this.editableStep.forms[field.name];
                            allFields[field.name].internalValue = allFields[field.name]?.value;
                        }
                    });
                    f.fields.forEach((field, j) => {
                        field.category = f.category;
                        Vue.set(field, "enabled", true);
                        //field.enabled = true;
                        if (field.enable_conditions) {
                            if (field.enable_conditions === 'false') {
                                field.enabled = false;
                            } else {
                                field.enable_conditions.match(conditional).forEach(v => {
                                    /*const key = v.replace('this.', '');
                                    if (!self.conditionalFields.has(key)) {
                                        self.conditionalFields.set(key, []);
                                    }
                                    self.conditionalFields.get(key).push(field);*/
                                    field.enabled = Boolean(self.evalInContext(field.enable_conditions, allFields));
                                });
                            }
                        }

                    });
                });
            },
            getValue(name) {
                return this.editableStep
                    && this.editableStep.forms
                    && this.editableStep.forms[name]
                    ? this.editableStep.forms[name].value : null;
            },
            getWidget(field) {
                //if (field.suggested_widget === 'attribute-selector') {
                //    return 'text-component'
                //} else 
                if (field.suggested_widget.endsWith(':read-only')) {
                    const s = field.suggested_widget;
                    return s.substring(0, s.length - 10) + '-component';
                } else {
                    return field.suggested_widget + '-component';
                }
            },
            cancelEdit() {
                this.step.editing = false;
                this.editableStep = JSON.parse(JSON.stringify(this.step));
            },
            edit(category) {
                const self = this;
                this.enableDisableFields();
                this.displayFormCategory = category;
                this.step.editing = true;
                Vue.nextTick(() => {
                    try {
                        //self.$refs.step.scrollIntoView();
                    } catch (ignore) { }
                });
            },
            save() {
                //Cloned object doesn't carry function
                //this.step.parameters.i18nArgs = this.step.parameters.i18nArgs;
                //this.step.forms = this.step.parameters.getForms(this.step.parameters.alias,
                //    [this.step.parameters.attributeName,]);
                /*
                if (this.step?.forms?.callbacks?.out) {
                    this.step?.forms?.callbacks?.out(this.step, this.step.editableStep.forms['$meta']?.value);
                }*/
                this.step.editing = false;
                this.$emit('update', this.editableStep);
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
        padding: 2px 0;
        width: 3px;
    }

    .step-number {
        color: #bbb;
        font-size: 8pt;
        /*
        padding: 4px;
        position: absolute;
        top: 0;
        right: 0;
        */
    }

    .step-description * {
        color: #888;
        font-size: 8.5pt;
    }

    .step-description>>>input {
        vertical-align: middle;
        position: relative;
        bottom: 2px;
    }

    .step-description>>>b {
        /*background-color: #17a2b8;*/
        /*border: 1px solid #17a2b8;
        border-radius: 3px;
        color: #17a2b8;*/
        color: #3D9970;
        font-weight: normal;
        /*
        font-weight: normal;
        padding: 1px 5px;*/
    }

    .step-description>>>i {
        color: #0074D9;
    }

    .step-description>>>code {
        color: #222;
        font-weight: lighter;
        font-size: 8pt;
    }

    .zoom-buttom>>>.btn {
        font-size: 9pt;
        padding: 2px;
    }

    .zoom-buttom>>>.dropdown-menu {
        font-size: 9pt;
    }

    .step-properties>>>textarea,
    .step-properties>>>input,
    .step-properties>>>select {
        font-size: .9em;
    }

    .step-drag-handle {
        cursor: move;
        text-align: center;
        width: 14px;
    }

    .soft-disabled {
        color: black;
        background: repeating-linear-gradient(135deg,
                transparent,
                transparent 15px,
                #eee 15px,
                #eee 30px),
            linear-gradient(to bottom,
                #fff,
                #ddd)
    }

    .hard-disabled {
        background-color: rgb(248, 249, 250);
    }

    .pulse-item {
        position: absolute;
        left: 5px;
        bottom: 10px;
    }
</style>