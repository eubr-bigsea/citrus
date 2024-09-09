<template>
    <b-modal ref="editTemplateModal" 
             :title="$t('pipeline.template.templateEdition')" 
             size="lg" 
             @ok="editTemplate">
        <div class="templatePage-card-modal">
            <div class="position-relative">
                <label class="templatePage-label" for="nome">{{$t('common.name')}}</label>
                <input id="nome" 
                       v-model="editedTemplate.name" 
                       class="templatePage-input" 
                       type="text" 
                       maxlength="50" 
                       :placeholder="$t('pipeline.template.templateName')"
                       @input="handleInput">
                <div v-if="invalidInputLength" class="templatePage-invalid-length">
                    - Nome do template deve ter pelo menos 3 caracteres.
                </div>
            </div>

            <div>
                <label class="templatePage-label" for="descricao">{{$t('common.description')}}</label>
                <textarea id="descricao" 
                          v-model="editedTemplate.description" 
                          class="templatePage-textarea" 
                          type="text" 
                          maxlength="200" 
                          :placeholder="$t('pipeline.template.templateDescription')" />
            </div>
            <div>
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
                    <draggable v-model="editedTemplate.steps" :options="dragOptions" @end="onDragEnd">
                        <div v-for="(input, index) in orderedTemplateSteps" :key="index" class="templatePage-input-box">
                            <font-awesome-icon class="templatePage-dragIcon" icon="fa fa-grip-vertical" />
                            {{setOrder(input, index)}}
                            #{{index + 1}}
                            <input v-model="input.name" 
                                   :placeholder="$t('pipeline.template.stepName')" 
                                   class="templatePage-input" 
                                   maxlength="50"
                                   :class="stepInput">
                            <textarea v-model="input.description" 
                                      :placeholder="$t('pipeline.template.stepDescription')" 
                                      class="templatePage-textarea" 
                                      maxlength="200"
                                      :class="stepTextarea" />
                            <button class="btn btn-sm btn-danger" @click="removeEditTemplateInput(index)">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </div>
                    </draggable>
                    <button class="btn btn-sm btn-primary mt-2" @click="addEditTemplateInput">
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
    props: {
        editedTemplate: { type: Object, default: () => {} },
    },
    emits: ['onupdate-template-list'],
    data() {
        return {
            stepInput: 'stepInput',
            stepTextarea: 'stepTextarea',
            invalidInputLength: false,
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            },
        };
    },
    computed: {
        orderedTemplateSteps() {
            return this.editedTemplate.steps.slice().sort((a, b) => a.order - b.order);
        },
    },
    methods: {
        show() {
            this.$refs.editTemplateModal.show();
        },
        onDragEnd(event) {
            this.editedTemplate.steps.forEach((step, index) => {
                step.order = index + 1;
            });
        },
        setOrder(input, index) {
            input.order = index + 1;
        },
        handleInput() {
            this.invalidInputLength = this.editedTemplate.name.length < 3;
        },
        addEditTemplateInput() {
            // eslint-disable-next-line vue/no-mutating-props
            this.editedTemplate.steps.push({ enabled: true });
        },
        removeEditTemplateInput: function(index) {
            // eslint-disable-next-line vue/no-mutating-props
            this.editedTemplate.steps.splice(index, 1);
        },
        editTemplate() {
            axios
                .patch(`${tahitiUrl}/pipeline-templates/${this.editedTemplate.id}`, this.editedTemplate)
                .then(() => {
                    this.$emit('onupdate-template-list');
                    this.success(this.$t('pipeline.alerts.templateEditionSuccess'));
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