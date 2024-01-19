<template>
    <div style="display: flex;" class="step" :class="stepClass">
        <div class="float-start text-secondary step-drag-handle">
            <font-awesome-icon v-if="!locked && index > 0" icon="fa fa-grip-vertical" />
        </div>
        <div v-if="hasProblems" class="pulse-item text-danger"
            title="Existem problemas na configuração. Edite para corrigir.">
            <font-awesome-icon icon="fa fa-question-circle" />
            {{ hasProblems.label }}
        </div>
        <div ref="step" class="float-start step" style="width: calc(100% - 25px)">
            <div class="step-description">
                <input v-if="!locked && index > 0" v-model="editableStep.selected" type="checkbox" @input="select">&nbsp;
                <span class="step-number">#{{ index + 1 }}</span> -
                <del v-if="!step.enabled">
                    <span v-html="step.getLabel()" />
                </del>
                <span v-else v-html="step.getLabel()" />
            </div>
            <div>
                <font-awesome-icon v-if="step.error" v-b-tooltip.html icon="fa fa-exclamation-circle text-danger"
                    :title="step.error" />

                <small v-if="step?.forms?.comment?.value" class="step-comment">{{ step?.forms?.comment?.value }}</small>
                <div class="btn-group" role="group" aria-label="Step commands" />
                <div v-if="!editableStep.editing" role="group" class="btn-group zoom-buttom float-end">
                    <button v-if="editableStep.editable" class="btn btn-sm btn-light text-primary"
                        :title="$t('actions.edit')" @click="edit('execution')">
                        <font-awesome-icon icon="fa fa-edit" />
                    </button>

                    <button class="btn btn-sm btn-light text-secondary" :title="$t('common.previewUntilHere')"
                        @click="$emit('preview', step)">
                        <font-awesome-icon :icon="`fa ${step.previewable ? 'fa-eye' : 'fa-eye-slash'}`" />
                    </button>

                    <button v-if="index > 0" class="btn btn-sm btn-light text-secondary" :title="$t('actions.delete')"
                        @click="$emit('delete', step)">
                        <font-awesome-icon icon="fa fa-trash" />
                    </button>
                    <button v-if="index > 0" class="btn btn-sm btn-light"
                        :title="step.enabled ? $t('actions.disable') : $t('actions.enable')" @click="$emit('toggle', step)">
                        <font-awesome-icon v-if="step.enabled" icon="fa fa-toggle-on text-success" />
                        <font-awesome-icon v-else icon="fa fa-toggle-off text-secondary" />
                    </button>
                    <dropdown-button size="lg" variant="light" no-caret>
                        <template #button-content>
                            <font-awesome-icon icon="fa fa-ellipsis-h" />
                        </template>
                        <template #content>
                            <b-dropdown-item href="#" @click.prevent="edit('appearance')">
                                {{ $t('titles.comment') }} &amp;
                                {{ $t('titles.color').toLowerCase() }}
                            </b-dropdown-item>
                            <b-dropdown-item href="#" @click.prevent="$emit('duplicate', step)">
                                {{ $t('actions.duplicate') }}
                                {{ $t('dataExplorer.step').toLowerCase() }}
                            </b-dropdown-item>
                        </template>
                    </dropdown-button>
                </div>
                <div v-else ref="form" class="border-top" style="width: 100%; padding: 2px; zoom:90%">
                    <div class="mb-3">
                        <template v-for="form in currentForm">
                            <div v-for="field in form.fields" :key="`${step.id}:${field.name}`"
                                class="mb-2 step-properties">
                                <component :is="getWidget(field)" v-if="field.editable && field.enabled !== false"
                                    :field="field" :value="getValue(field.name)" :language="language"
                                    :type="field.suggested_widget" :read-only="!field.editable" context="context"
                                    :suggestion-event="() => suggestionEvent(step.id)"
                                    :extended-suggestion-event="() => extendedSuggestionEvent(step.id)"
                                    @update="updateField" />
                            </div>
                        </template>
                    </div>

                    <div class="btn-group float-end mb-2">
                        <button class="btn btn-sm btn-light text-primary" :title="$t('actions.save')" @click="save">
                            <font-awesome-icon icon="fa fa-save" />
                        </button>
                        <button class="btn btn-sm btn-light" :title="$t('actions.cancel')" @click="cancelEdit">
                            <font-awesome-icon icon="fa fa-undo-alt" />
                        </button>
                        <button class="btn btn-sm btn-light text-secondary" :title="$t('actions.delete')"
                            @click="$emit('delete', step)">
                            <font-awesome-icon icon="fa fa-trash" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
;
import { deepToRaw } from '@/util.js';
import DropdownButton from '@/components/DropdownButton.vue';

export default {
    name: 'StepComponent',
    components: {
        DropdownButton
    },
    props: {
        attributes: { type: Array, required: true },
        index: { type: Number, required: true },
        language: { type: String, required: true },
        locked: { type: Boolean, default: false },
        step: { type: Object, required: true },
        suggestionEvent: { type: Function, default: () => null },
        extendedSuggestionEvent: { type: Function, default: () => null },

    },
    emits: ['preview', 'delete', 'toggle', 'duplicate', 'update', 'cancel', 'select', 'edit',],
    data() {
        return {
            displayFormCategory: 'execution', //what kind of form to display and edit
            functionName: '',
            editableStep: {},
        };
    },
    computed: {
        stepClass() {
            if (!this.step.enabled) {
                return 'hard-disabled';
            } else if (!this.step.previewable) {
                return 'soft-disabled';
            } else if (this.editableStep.editing) {
                return 'editing-step';
            }
            return '';
        },
        hasProblems() {
            const self = this;
            const executionForm = this.step.operation.forms.find(f => f.category === 'execution');
            return executionForm && executionForm.fields.find(field => {
                return field.enabled &&
                    (field.required && (!self.step.forms[field.name] || !self.step.forms[field.name].value));
            });
        },
        suggestedAttributes() {
            return this.attributes.map(a => a.key);
        },
        currentForm() {
            return this.step.operation.forms.filter(
                f => f.category === this.displayFormCategory);
        }
    },
    mounted() {
        this.functionName = this.step.functionName;
        this.editableStep = structuredClone(deepToRaw(this.step));
        this.enableDisableFields();
    },
    methods: {
        obterSugestao() {
            console.debug(this.suggestionEvent(this.step.id));
        },
        _evalInContext(js, context) {
            return new Function(`return ${js};`).call(context);
        },
        setEditable(value) {
            this.editableStep.editable = value;
        },
        setEnabled(value) {
            this.editableStep.enabled = value;
        },
        select(ev) {
            this.$emit('select', this.step, ev.target.checked);
            this.editableStep.selected = ev.target.checked;
        },
        updateField(field, value) {
            this.editableStep.forms[field.name] = { value };
            this.enableDisableFields();
        },
        enableDisableFields() {
            /* Enable/disable fields according to the new value*/
            const self = this;
            const conditional = /\bthis\..+?\b/g;
            const allFields = {};

            this.step.operation.forms.forEach((f) => {
                f.fields.forEach((field) => {
                    if (this.editableStep.forms[field.name]) {
                        allFields[field.name] = this.editableStep.forms[field.name];
                        allFields[field.name].internalValue = allFields[field.name]?.value;
                    }
                });
                f.fields.forEach((field) => {
                    field.category = f.category;
                    field.enabled = true;
                    if (field.enable_conditions) {
                        if (field.enable_conditions === 'false') {
                            field.enabled = false;
                        } else {
                            field.enable_conditions.match(conditional).forEach(() => {
                                /*const key = v.replace('this.', '');
                                    if (!self.conditionalFields.has(key)) {
                                        self.conditionalFields.set(key, []);
                                    }
                                    self.conditionalFields.get(key).push(field);*/
                                field.enabled = Boolean(self._evalInContext(field.enable_conditions, allFields));
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
            if (field.suggested_widget.endsWith(':read-only')) {
                const s = field.suggested_widget;
                return s.substring(0, s.length - 10) + '-component';
            } else {
                return field.suggested_widget + '-component';
            }
        },
        cancelEdit() {
            this.editableStep.editing = false;
            this.editableStep = structuredClone(deepToRaw(this.step));
            this.$emit('cancel', this.step);
        },
        edit(category) {
            this.enableDisableFields();
            this.displayFormCategory = category;
            this.editableStep.editing = true;
            this.$emit('edit', this.step);
            this.$nextTick(() => {
                const elem = this.$refs.form.querySelector('input, select');
                elem && elem.focus();
                try {
                    this.$refs.step.scrollIntoView();
                } catch (ignore) { console.debug(ignore); }
            });
        },
        save() {
            this.editableStep.editing = false;
            this.$emit('update', this.editableStep, 'saved');
        },
        getStepClass(step) {
            if (step === undefined) { return ''; }
            else if (step.status === 'ERROR') { return 'fa text-danger fa-times-circle'; }
            else if (step.status === 'COMPLETED') { return 'fa text-success fa-check-circle'; }
            else if (step.status === 'CANCELED') { return 'fa text-secondary fa-hand-paper'; }
        }
    },
};
</script>
<style scoped>
.step {
    font-size: 10pt;
    padding: 2px 0;
    position: relative;
}

.step-description * {
    color: #222;
    font-size: 9pt;
    font-weight: normal;
}

.step-comment {
    font-size: 8.5pt;
    font-style: italic;
}

.step-description>>>input {
    vertical-align: middle;
    position: relative;
    bottom: 2px;
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
    bottom: 10px;
    font-size: 9pt !important;
    left: 5px;
    position: absolute;
}

.editing-step {
    background-color: #f0f0f0;
}
</style>