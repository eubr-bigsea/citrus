<template>
    <b-modal ref="addTemplateModal" 
             :title="$t('pipeline.template.templateCreation')" 
             size="lg" 
             scrollable 
             @ok="createTemplate">
        <div class="templatePage-card-modal">
            <div class="position-relative">
                <label class="templatePage-label" for="nome">{{$t('common.name')}}</label>
                <input id="nome"
                       v-model="createTemplateName" 
                       class="templatePage-input" 
                       type="text"
                       maxlength="50"
                       :placeholder="$t('pipeline.template.templateName')"
                       data-test="input"
                       @input="handleInput">
                <div v-if="invalidInputLength" class="templatePage-invalid-length">
                    - {{$t('pipeline.template.templateNameMinLength')}}
                </div>
            </div>

            <div>
                <label class="templatePage-label" for="descricao">{{$t('common.description')}}</label>
                <textarea id="descricao" 
                          v-model="createTemplateDescription" 
                          class="templatePage-textarea" 
                          type="text"
                          maxlength="200" 
                          required
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
                    <draggable v-model="stepsInputs" :options="dragOptions" @end="onDragEnd">
                        <div v-for="(input, index) in stepsInputs" :key="`step-${index}-${addModalKey}`" class="templatePage-input-box">
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
                            <button class="btn btn-sm btn-danger" @click="removeCreateTemplateInput(index)">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </div>
                    </draggable>
                    <button class="btn btn-sm btn-primary mt-2" data-test="addStepButton" @click="addCreateTemplateInput">
                        <font-awesome-icon icon="plus" />
                    </button>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script>
import axios from 'axios';
import { BModal } from 'bootstrap-vue';
import draggable from 'vuedraggable';
import Notifier from '../../mixins/Notifier.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        BModal,
        draggable
    },
    mixins: [Notifier],
    emits: ['onupdate-template-list'],
    data() {
        return {
            addModalKey: 0,
            stepInput: 'stepInput',
            stepTextarea: 'stepTextarea',
            invalidInputLength: true,
            createTemplateName: '',
            createTemplateDescription: '',
            stepsInputs: [],
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            },
        };
    },
    methods: {
        show() {
            this.createTemplateName = '';
            this.createTemplateDescription = '';
            this.stepsInputs = [];
            this.$refs.addTemplateModal.show();
        },
        onDragEnd(event) {
            this.stepsInputs.forEach((step, index) => {
                step.order = index + 1;
            });
        },
        setOrder(input, index) {
            input.order = index + 1;
        },
        handleInput() {
            this.invalidInputLength = this.createTemplateName.length < 3;
        },
        addCreateTemplateInput() {
            this.stepsInputs.push({ id: 0, enabled: true });
        },
        removeCreateTemplateInput: function(index) {
            this.stepsInputs.splice(index, 1);
        },
        createTemplate(e) {
            if (this.invalidInputLength) {
                e.preventDefault();
                return;
            }
            const data = {
                name: this.createTemplateName,
                description: this.createTemplateDescription,
                enabled: true,
                steps: this.stepsInputs
            };

            axios
                .post(`${tahitiUrl}/pipeline-templates`, data)
                .then(() => {
                    this.$emit('onupdate-template-list');
                    this.success(this.$t('pipeline.alerts.templateCreationSuccess'));
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );
        },
    }
};

</script>