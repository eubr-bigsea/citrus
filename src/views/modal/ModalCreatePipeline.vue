<template>
    <b-modal ref="addModal" 
             title="Criação de pipeline" 
             size="lg" 
             hide-footer
             scrollable 
             @hidden="closeAddModal">
        <div class="lemonPage-wizard">
            <div v-if="wizardStep === 1" class="lemonPage-wizard-stepBox">
                <div class="lemonPage-wizard-header">
                    <div class="lemonPage-wizard-title">
                        <font-awesome-icon class="mr-1" icon="fa fa-file" />
                        Informações gerais
                    </div>
                    <div>
                        Etapa 1 de 2
                    </div>
                </div>
                <div class="position-relative">
                    <label class="lemonPage-label" for="identificador">Nome</label>
                    <input id="identificador" 
                           v-model="pipelineName" 
                           class="lemonPage-input"
                           type="text"
                           maxlength="100" 
                           placeholder="Nome da pipeline" 
                           @input="handleInput">
                    <div v-if="invalidInputLength" class="lemonPage-invalid-length">
                        - Nome da pipeline deve ter pelo menos 3 caracteres.
                    </div>
                </div>

                <label class="lemonPage-label" for="descricao">Descrição</label>
                <textarea id="descricao" 
                          v-model="pipelineDescription"
                          class="lemonPage-textarea" 
                          type="text"
                          maxlength="200" 
                          placeholder="Descrição da pipeline" />

                <div class="lemonPage-wizard-stepBox-buttons" :class="first">
                    <b-button size="sm" variant="secondary" @click="firstWizardStep">
                        Avançar
                    </b-button>
                </div>
            </div>
            <div v-if="wizardStep === 2" class="lemonPage-wizard-stepBox">
                <div class="lemonPage-wizard-header">
                    <div class="lemonPage-wizard-title">
                        <font-awesome-icon class="mr-1" icon="fa fa-folder" />
                        Template
                    </div>
                    <div>
                        Etapa 2 de 2
                    </div>
                </div>
                
                Deseja utilizar algum template de pipeline?
                <b-form-select v-model="selectedTemplate" :options="templateOptions" class="mt-1 mb-1" />

                <div v-if="selectedTemplate !== null">
                    <b-card class="lemonPage-infos">
                        <div class="lemonPage-infos-body">
                            <div class="lemonPage-infos-body-column">
                                <span class="left">Identificador:</span><span class="right">{{findTemplate().name}}</span>
                            </div>
                            <div class="lemonPage-infos-body-column">
                                <span class="left">Descrição:</span><span class="right-description">{{findTemplate().description}}</span>
                            </div>
                            <div class="lemonPage-infos-body-column">
                                <span class="left">Etapas:</span> 
                                <b-container class="lemonPage-etapas-table">
                                    <b-row class="lemonPage-etapas-header">
                                        <b-col>
                                            Ordem da Etapa
                                        </b-col>
                                        <b-col>
                                            Identificador
                                        </b-col>
                                        <b-col>
                                            Descrição
                                        </b-col>
                                    </b-row>
                                    <b-row v-for="(etapa, index) in findTemplate().steps" :key="etapa.id" class="lemonPage-dragDiv">
                                        <b-col>
                                            # {{index + 1}}
                                        </b-col>
                                        <b-col>
                                            {{etapa.name}}
                                        </b-col>
                                        <b-col>
                                            {{etapa.description}}
                                        </b-col>
                                    </b-row>
                                </b-container>
                            </div>
                        </div>
                    </b-card>
                </div>

                <div class="lemonPage-wizard-stepBox-buttons">
                    <b-button size="sm" variant="secondary" @click="wizardStep = 1">
                        Voltar
                    </b-button>
                    <b-button size="sm" variant="secondary" @click="secondWizardStep">
                        Finalizar
                    </b-button>
                </div>
            </div>
            <div v-if="wizardStep === 3" class="lemonPage-wizard-stepBox">
                <div class="lemonPage-wizard-header">
                    <div class="lemonPage-wizard-title">
                        <font-awesome-icon class="mr-1" icon="fa fa-square-check" />
                        Processo de criação da pipeline finalizada.
                    </div>
                </div>

                <div>
                    Ao fechar este modal, você será redirecionado para a página da pipeline criada.
                </div>

                <div class="lemonPage-wizard-stepBox-buttons">
                    <b-button size="sm" variant="primary" @click="closeAddModal">
                        Fechar
                    </b-button>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script>
import axios from 'axios';
import { BModal } from 'bootstrap-vue';
import Notifier from '../../mixins/Notifier.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        BModal,
    },
    mixins: [Notifier],
    props: {
        pipelineTemplates: { type: Array, default: () => [] },
        templateOptions: { type: Array, default: () => [] },
    },
    emits: ['onupdate-pipeline'],
    data() {
        return {
            first: 'first',
            wizardStep: 1,
            pipelineName: '',
            pipelineDescription: '',
            selectedTemplate: null,
            createdPipelineId: null,
            invalidInputLength: true,
            pipelineData: {
                name: '',
                description: '',
                enabled: true,
                steps: [],
            },
        };
    },
    methods: {
        show() {
            this.$refs.addModal.show();
        },
        closeAddModal() {
            if (this.wizardStep === 3) this.$router.push({ name: 'pipelineEdit', params: {id: this.createdPipelineId}});
            this.$refs.addModal.hide();
            this.pipelineName = '';
            this.pipelineDescription = '';
            this.invalidInputLength = true;
            this.selectedTemplate = null;
            this.wizardStep = 1;
        },
        firstWizardStep() {
            if (this.invalidInputLength) return;
            else this.wizardStep = 2;
        },
        secondWizardStep() {
            this.wizardStep = 3;
            this.pipelineData.name = this.pipelineName;
            this.pipelineData.description = this.pipelineDescription;
            if (this.selectedTemplate !== null) this.pipelineData.steps = JSON.parse(JSON.stringify(this.findTemplate().steps, (key, value) => (key === 'id' ? undefined : value)));
            this.createPipeline();
        },
        findTemplate() {
            const selectedTemplate = this.pipelineTemplates.find(template => template.id == this.selectedTemplate);
            return selectedTemplate ? { ...selectedTemplate } : null;
        },
        handleInput() {
            this.invalidInputLength = this.pipelineName.length < 3;
        },
        createPipeline() {
            axios
                .post(`${tahitiUrl}/pipelines`, this.pipelineData)
                .then((resp) => {
                    this.createdPipelineId = resp.data.id;
                    this.success('Pipeline criada com sucesso');})
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );
        },
    }

};


</script>