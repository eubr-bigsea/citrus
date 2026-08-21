<template>
    <b-modal ref="templateModal"
             :title="editing ? $t('pipeline.template.templateEdition') : $t('pipeline.template.templateCreation')"
             size="lg"
             scrollable
             @ok="submit"
             @hidden="closeModal">
        <div class="templatePage-card-modal">
            <div class="position-relative">
                <label class="templatePage-label" for="nome">{{$t('common.name')}}</label>
                <input id="nome"
                       v-model="form.name"
                       class="templatePage-input"
                       type="text"
                       maxlength="50"
                       :placeholder="$t('pipeline.template.templateName')"
                       data-test="input"
                       @input="handleInput">
                <div v-if="invalidInputLength" class="templatePage-invalid-length" data-test="invalidInputLength">
                    - {{$t('pipeline.template.templateNameMinLength')}}
                </div>
            </div>

            <div>
                <label class="templatePage-label" for="descricao">{{$t('common.description')}}</label>
                <textarea id="descricao"
                          v-model="form.description"
                          class="templatePage-textarea"
                          type="text"
                          maxlength="200"
                          :placeholder="$t('pipeline.template.templateDescription')"
                          data-test="textarea" />
            </div>
            <div class="position-relative">
                <label class="templatePage-label" for="descricao">
                    {{$t('titles.step', 2)}}
                    <button id="popover-trigger" class="templatePage-tab-button">
                        <font-awesome-icon icon="info-circle" />
                    </button>
                    <b-popover target="popover-trigger" triggers="hover">
                        {{$t('pipeline.template.holdAndDragSteps')}}
                    </b-popover>
                </label>
                <div class="templatePage-input-container">
                    <draggable v-model="form.steps" @end="onDragEnd">
                        <div v-for="(input, index) in form.steps" :key="index" class="templatePage-input-box">
                            <font-awesome-icon class="templatePage-dragIcon" icon="fa fa-grip-vertical" />
                            {{setOrder(input, index)}}
                            #{{index + 1}}
                            <input v-model="input.name"
                                   :placeholder="$t('pipeline.template.stepName')"
                                   class="templatePage-input"
                                   maxlength="50"
                                   data-test="stepInput"
                                   :class="stepInput">
                            <textarea v-model="input.description"
                                      :placeholder="$t('pipeline.template.stepDescription')"
                                      class="templatePage-textarea"
                                      maxlength="200"
                                      data-test="stepTextarea"
                                      :class="stepTextarea" />
                            <button class="btn btn-sm btn-danger" @click="removeStep(index)">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </div>
                    </draggable>
                    <button class="btn btn-sm btn-primary mt-2" data-test="addStepButton" @click="addStep">
                        <font-awesome-icon icon="plus" />
                    </button>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script>
import axios from 'axios';
import { VueDraggableNext as draggable } from 'vue-draggable-next';
import Notifier from '../../mixins/Notifier.js';
import { reorder } from '../../util.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        draggable
    },
    mixins: [Notifier],
    emits: ['onupdate-template-list'],
    data() {
        return {
            stepInput: 'stepInput',
            stepTextarea: 'stepTextarea',
            invalidInputLength: false,
            editing: null,
            form: { name: '', description: '', steps: [] },
        };
    },
    methods: {
        // pass a template row to edit it, or call with no argument to create one
        show(template) {
            this.editing = template || null;
            this.invalidInputLength = false;
            this.form = this.editing
                ? {
                    name: this.editing.name,
                    description: this.editing.description,
                    steps: [...this.editing.steps].sort((a, b) => a.order - b.order)
                }
                : { name: '', description: '', steps: [] };
            this.$refs.templateModal.show();
        },
        closeModal() {
            this.invalidInputLength = false;
        },
        onDragEnd() {
            reorder(this.form.steps);
        },
        setOrder(input, index) {
            input.order = index + 1;
        },
        handleInput() {
            this.invalidInputLength = this.form.name.length < 3;
        },
        addStep() {
            this.form.steps.push(this.editing ? { enabled: true } : { id: 0, enabled: true, name: '' });
        },
        removeStep(index) {
            this.form.steps.splice(index, 1);
        },
        async submit(e) {
            if (this.invalidInputLength) {
                e.preventDefault();
                return;
            }
            const data = {
                name: this.form.name,
                description: this.form.description,
                enabled: true,
                steps: this.form.steps
            };
            try {
                if (this.editing) {
                    await axios.patch(`${tahitiUrl}/pipeline-templates/${this.editing.id}`, data);
                    this.success(this.$t('pipeline.alerts.templateEditionSuccess'));
                } else {
                    await axios.post(`${tahitiUrl}/pipeline-templates`, data);
                    this.success(this.$t('pipeline.alerts.templateCreationSuccess'));
                }
                this.$emit('onupdate-template-list');
            } catch (err) {
                this.error(err);
            }
        },
    }
};
</script>
