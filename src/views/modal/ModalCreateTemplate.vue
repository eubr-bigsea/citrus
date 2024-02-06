<template>
    <b-modal ref="addTemplateModal" 
             title="Criação de template" 
             size="lg" 
             scrollable 
             @ok="createTemplate">
        <div class="templatePage-card-modal">
            <div class="position-relative">
                <label class="templatePage-label" for="nome">Nome</label>
                <input id="nome"
                       v-model="createTemplateName" 
                       class="templatePage-input" 
                       type="text"
                       maxlength="50"
                       placeholder="Nome do template"
                       @input="handleInput">
                <div v-if="invalidInputLength" class="templatePage-invalid-length">
                    - Nome do template deve ter pelo menos 3 caracteres.
                </div>
            </div>

            <div>
                <label class="templatePage-label" for="descricao">Descrição</label>
                <textarea id="descricao" 
                          v-model="createTemplateDescription" 
                          class="templatePage-textarea" 
                          type="text"
                          maxlength="200" 
                          required
                          placeholder="Descrição do template" />
            </div>
            <div class="position-relative">
                <label class="templatePage-label" for="descricao">
                    Etapas
                    <button id="popover-trigger" class="templatePage-tab-button">
                        <font-awesome-icon icon="info-circle" />
                    </button>
                    <b-popover target="popover-trigger" triggers="hover">
                        Segure e arraste as etapas abaixo para reordená-las.
                    </b-popover>
                </label>
                <div class="templatePage-input-container">
                    <draggable v-model="stepsInputs" :options="dragOptions" @end="onDragEnd">
                        <div v-for="(input, index) in stepsInputs" :key="`step-${index}-${addModalKey}`" class="templatePage-input-box">
                            <font-awesome-icon class="templatePage-dragIcon" icon="fa fa-grip-vertical" />
                            {{setOrder(input, index)}}
                            #{{index + 1}}
                            <input v-model="input.name" 
                                   placeholder="Nome da etapa" 
                                   class="templatePage-input" 
                                   maxlength="50"
                                   :class="stepInput">
                            <textarea v-model="input.description" 
                                      placeholder="Descrição da etapa" 
                                      class="templatePage-textarea" 
                                      maxlength="200"
                                      :class="stepTextarea" />
                            <button class="btn btn-sm btn-danger" @click="removeCreateTemplateInput(index)">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </div>
                    </draggable>
                    <button class="btn btn-sm btn-primary mt-2" @click="addCreateTemplateInput">
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
                    this.success('Template criado com sucesso');
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