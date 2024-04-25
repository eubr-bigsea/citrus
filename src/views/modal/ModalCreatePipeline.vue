<template>
    <b-modal ref="addModal" 
             title="Criação de pipeline" 
             size="lg" 
             hide-footer
             scrollable 
             @hidden="closeAddModal">
        <div class="wizard">
            <div v-if="wizardStep === 1" class="wizard-stepBox">
                <div class="wizard-header">
                    <div class="wizard-title">
                        <font-awesome-icon class="mr-1" icon="fa fa-file" />
                        Informações gerais
                    </div>
                    <div>
                        Etapa 1 de 2
                    </div>
                </div>
                <div class="position-relative">
                    <label class="wizard-label" for="identificador">Nome</label>
                    <input id="identificador" 
                           v-model="pipelineName" 
                           class="wizard-input"
                           type="text"
                           maxlength="100" 
                           placeholder="Nome da pipeline" 
                           @input="handleInput">
                    <div v-if="invalidInputLength" class="wizard-invalid-length">
                        - Nome da pipeline deve ter pelo menos 3 caracteres.
                    </div>
                </div>

                <label class="wizard-label" for="descricao">Descrição</label>
                <textarea id="descricao" 
                          v-model="pipelineDescription"
                          class="wizard-textarea" 
                          type="text"
                          maxlength="200" 
                          placeholder="Descrição da pipeline" />

                <div class="wizard-stepBox-buttons" :class="first">
                    <b-button size="sm" variant="secondary" @click="firstWizardStep">
                        Avançar
                    </b-button>
                </div>
            </div>
            <div v-if="wizardStep === 2" class="wizard-stepBox">
                <div class="wizard-header">
                    <div class="wizard-title">
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
                    <b-card class="wizard-infos">
                        <div class="wizard-infos-body">
                            <div class="wizard-infos-body-column">
                                <span class="left">Nome:</span><span class="right">{{findTemplate().name}}</span>
                            </div>
                            <div class="wizard-infos-body-column">
                                <span class="left">Descrição:</span><span class="right-description">{{findTemplate().description}}</span>
                            </div>
                            <div class="wizard-infos-body-column">
                                <span class="left">Etapas:</span> 
                                <b-container class="wizard-steps-table">
                                    <b-row class="wizard-steps-header">
                                        <b-col>
                                            Ordem
                                        </b-col>
                                        <b-col>
                                            Nome
                                        </b-col>
                                        <b-col>
                                            Descrição
                                        </b-col>
                                    </b-row>
                                    <b-row v-for="(etapa, index) in findTemplate().steps" :key="etapa.id" class="wizard-dragDiv">
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

                <div class="wizard-stepBox-buttons">
                    <b-button size="sm" variant="secondary" @click="wizardStep = 1">
                        Voltar
                    </b-button>
                    <b-button size="sm" variant="secondary" @click="secondWizardStep">
                        Finalizar
                    </b-button>
                </div>
            </div>
            <div v-if="wizardStep === 3" class="wizard-stepBox">
                <div class="wizard-header">
                    <div class="wizard-title">
                        <font-awesome-icon class="mr-1" icon="fa fa-square-check" />
                        Processo de criação da pipeline finalizada.
                    </div>
                </div>

                <div>
                    Ao fechar este modal, você será redirecionado para a página da pipeline criada.
                </div>

                <div class="wizard-stepBox-buttons">
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

<style lang="scss">

.wizard-label {
    display: block;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.wizard-input {
    width: 100%;
    height: fit-content;
    padding: 12px 20px;
    margin-bottom: 25px;
    border-radius: 2px;
    border: none;
    background-color: #eff0f6;
}

.wizard-textarea {
    width: 100%;
    height: 100px;
    max-height: 150px;
    padding: 12px 20px;
    border-radius: 2px;
    border: none;
    background-color: #eff0f6;
}

.wizard {
    min-height: 500px;
    position: relative;
}

.wizard-header {
    padding: 5px 10px;
    background-color: #6c757d;
    border-radius: 0.25rem;
    font-weight: 700;
    font-size: 15px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 10px 10px;
}

.wizard-title {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: #fff;
    text-align: justify;
}

.wizard-stepBox {
    display: flex;
    flex-direction: column;
}

.wizard-stepBox-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    position: absolute;
    width: 100%;
    bottom: 0px;

    &.first {
        justify-content: end;
    }
}

.wizard-steps-table {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-left: 40px;
}

.wizard-steps-header {
    margin-bottom: -2px;
    border: 2px solid #dfdfdf;
    padding: 3px 0px;
    font-weight: 700;
    background-color: #FFF;
    text-align: center;
}

.wizard-dragDiv {
    justify-content: space-between;
    border: 2px solid #dfdfdf;
    padding: 10px 0px;
    background-color: #FFF;
    margin-bottom: -2px;
    text-align: center;
}

.wizard-infos {
    display: flex;
    flex-direction: row;
    border: 0px solid #dfdfdf;
    background-color: #f8f9f9;
    border-radius: 3px;
    max-height: 300px;
    overflow-y: auto;
}

.wizard-infos-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 14px;
    padding-bottom: 16px;
}

.wizard-infos-body-column {
    display: flex;

    span.left {
        color: black;
        font-family: sans-serif;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.6px;
        margin-bottom: 0;
        padding: 0px 4px;
        text-transform: uppercase;
        margin-right: 10px;
        width: 19%;
    }

    span.right {
        margin-left: 10px;
        font-size: 14px;
    }

    span.right-description {
        margin-left: 10px;
        font-size: 14px;
    }
}

.wizard-invalid-length {
    color: red;
    font-size: 12px;
    position: absolute;
    top: 4px;
    display: flex;
    justify-content: end;
    width: 100%;
}

</style>