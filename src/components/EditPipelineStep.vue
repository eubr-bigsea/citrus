<template>
    <div class="editPage-step-config-body">
        <div class="mt-2">
            <div>
                <label for="nome">{{ $tc('common.name') }}:</label>
                <input id="nome" v-model="editedStep.name" class="form-control form-control-sm" type="text"
                    placeholder="Nome da etapa" @input="handleInput" maxlength="50">
            </div>

            <div class="mt-2">
                <label for="descricao">{{ $tc('common.description') }}:</label>
                <textarea id="descricao" v-model="editedStep.description" class="form-control form-control-sm"
                    type="text" placeholder="Descrição da etapa" @input="handleInput" maxlength="200" />
            </div>
        </div>
        <hr class="mt-4 mb-3">
        <div v-if="editedStep.workflow !== undefined && showWorkflowOps < 0" class="d-flex flex-column">
            <label class="editPage-label">Etapa associada a um fluxo de trabalho:</label>
            <button class="btn text-center btn-outline-secondary my-2" @click="redirectToWorkflow(editedStep)">
                <font-awesome-icon icon="fa fa-flask" class="mr-1" size="lg" />
                <span class="editPage-workflow-label">
                    {{$tc('actions.edit')}} {{ editedStep.workflow.id }} - {{ editedStep.workflow.name }}
                </span>
            </button>
            <div>
                <b-button class="w-25" @click="showWorkflowOps = 0" size="sm" variant="outline-primary">
                    {{ $tc('actions.change') }}
                </b-button>
                <!--
                    <b-button class="w-25 ml-2" @click="removeWorkflow(editStep)" size="sm" variant="outline-danger">
                        {{ $tc('actions.delete') }}
                    </b-button>
                    -->
            </div>
        </div>
        <div v-if="showWorkflowOps > -1">
            <label class="editPage-label mb-2">Associar etapa a um workflow</label>
            <div v-if="showWorkflowOps == 0" class="d-flex">
                <b-button class="w-50 mr-2" @click="showWorkflowOps = 1" variant="outline-primary" size="sm">
                    <font-awesome-icon icon="fa fa-flask" class="mr-2" size="xl" />
                    Workflow existente
                </b-button>
                <b-button class="50 ml-2 clickable" @click="showWorkflowOps = 2" variant="outline-success" size="sm">
                    <span class="editPage-workflow-label">
                        <font-awesome-icon icon="fa fa-plus" class="mr-2" size="xl" />
                        Novo workflow
                    </span>
                </b-button>
                <b-button v-if="editedStep.workflow" class="ml-2" variant="outline-secondary" @click="showWorkflowOps = -1" size="sm">
                    {{ $tc('actions.cancel') }}
                </b-button>
            </div>
            <div v-if="showWorkflowOps == 1" class="mb-3">
                <label>Escolha um fluxo existente para associar a esta etapa:</label>
                <vue-select v-model="selectedWorkflow" :filterable="false" :options="workflowList" label="name"
                    class="w-100" @search="loadWorkflowList" @input="handleInput">
                    <template #no-options="{}">
                        <small>Digite parte do nome para pesquisar...</small>
                    </template>
                    <template #option="option">
                        <div class="container">
                            <div class="row align-items-center">
                                <font-awesome-icon icon="fa fa-flask" />
                                <div class="col-9">
                                    {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }}
                                </div>
                                <div class="col-2">
                                    {{ option.type }}
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #default="option">
                        {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }} - {{ option.type }}
                    </template>
                    <template #selected-option="option">
                        <div class="selected d-center">
                            <font-awesome-icon icon="fa fa-flask" class="mr-2" />
                            {{ pad(option.id, 4, '&nbsp;') }} - {{ option.name }} | {{ option.type }}
                        </div>
                    </template>
                </vue-select>
                <div>
                    <b-button :disabled="!selectedWorkflow" class="float-right mt-3" style="right: 15px; bottom: 0;" variant="primary" size="sm"
                        @click="editStepWorkflow">
                        Confirmar
                    </b-button>
                    <b-button class="mt-3" @click="showWorkflowOps = -1" size="sm" variant="outline-secondary">
                        Cancelar
                    </b-button>
                </div>
            </div>
            <div v-if="showWorkflowOps == 2" class="d-flex flex-column">
                <b-container class="editPage-workflow-box p-3">
                    <label class="editPage-label mb-2" for="identificador">Criação do fluxo de trabalho</label>
                    <b-row>
                        <b-col>
                            <label class="" for="name">Nome:</label>
                            <input id="name" v-model="workflowName" v-focus type="text"
                                class="form-control w-100 form-control-sm mb-2" maxlength="100">
                        </b-col>
                        <input type="hidden" id="platform" value="META" />
                        <b-col class="d-none">
                            <label class="" for="platform">Plataforma:</label>
                            <input id="platform" v-focus value="META" type="text"
                                class="form-control w-100 form-control-sm mb-2" maxlength="100" disabled>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="6">
                            <label>Tipo:</label>
                            <input type="text" v-model="selectedWorkflowType" value="SQL" disabled
                                class="form-control " />
                            <!-- b-form-select v-model="selectedWorkflowType" :options="workflowTypeOptions" class="w-100 mb-2" /-->
                        </b-col>
                        <b-col class="position-relative">
                            <b-button class="position-absolute" style="right: 15px; bottom: 0;" variant="success"
                                @click="createWorkflow">
                                Confirmar
                            </b-button>
                            <b-button class="position-absolute" style="right: 120px; bottom: 0;"
                                @click="showWorkflowOps = 0">
                                Cancelar
                            </b-button>
                        </b-col>
                    </b-row>
                </b-container>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import PipelineEditMixin from '../mixins/PipelineEditMixin.js';
import vSelect from 'vue-select';
import Notifier from '../mixins/Notifier.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        'vue-select': vSelect,
    },
    mixins: [PipelineEditMixin, Notifier],
    props: {
        editedStep: { type: Object, default: () => { } },
        selectedStepIndex: { type: Number, default: null },
        pipeline: { type: Object, default: () => { } },
    },
    emits: ['send-step-changes'],
    data() {
        return {
            showWorkflowOps: this.editedStep.workflow === undefined ? 0 : -1,
            selectedWorkflow: null,
            workflowName: '',
            workflowPlatform: 1000, // meta platform - FIXME
            selectedWorkflowType: 'SQL',
            workflowTypeOptions: [
                { value: 'DATA_EXPLORER', text: 'Explorador de dados' },
                { value: 'WORKFLOW', text: 'Fluxo de trabalho' },
                { value: 'SQL', text: 'Fluxo baseado em SQL' },
            ],
        };
    },
    watch: {
        showWorkflowOps() {
            this.editStep();
        },
        selectedStepIndex() {
            if (this.editedStep.workflow === undefined) this.showWorkflowOps = 0;
        }
    },
    methods: {
        editStep() {
            // eslint-disable-next-line vue/no-mutating-props
            if (this.selectedWorkflow !== null) this.editedStep.workflow_id = this.selectedWorkflow.id;

            this.$emit('send-step-changes', this.editedStep);
        },
        handleInput() {
            this.editStep();
        },
        redirectToWorkflow(step) {
            this.confirm(
                'Sair da edição da Pipeline',
                'Ir para edição do fluxo de trabalho?',
                () => {
                    this.$router.push({
                        name: 'sql-workflow', params: { id: step.workflow.id }
                    });
                }
            );
        },
        async removeWorkflow() {
            this.showWorkflowOps = 0;
            try {
                const resp = await axios
                    .patch(`${tahitiUrl}/pipelines/${this.pipeline.id}`, this.pipeline);
                this.editedStep.workflow = null;
                this.success("Fluxo de trabalho desassociado.");
                this.showWorkflowOps = -1;
                this.selectedWorkflow = null;
            } catch(e) {
                this.error(e);
            }
        },
        async editStepWorkflow() {
            if (! this.selectedWorkflow) {
                this.warning('Selecione um fluxo de trabalho');
                return
            }
            const stepWorkflow = {
                id: this.selectedWorkflow?.id, //may be null
                name: this.selectedWorkflow?.name,
                type: this.selectedWorkflow?.type,
                platform_id: this.workflowPlatform,
            };

            // eslint-disable-next-line vue/no-mutating-props
            this.editedStep.workflow = stepWorkflow;

            const foundStep = this.pipeline.steps.find(step => step.id === this.editedStep.id);
            Object.assign(foundStep, this.editedStep);

            try {
                const resp = await axios
                    .patch(`${tahitiUrl}/pipelines/${this.pipeline.id}`, this.pipeline);
                // eslint-disable-next-line vue/no-mutating-props
                // this.pipeline = resp.data.data[0];
                // eslint-disable-next-line vue/no-mutating-props
                this.editedStep.workflow = this.pipeline.steps.find(step => step.id === this.editedStep.id).workflow;
                this.editStep();
                this.success("Fluxo de trabalho associado com sucesso à etapa.");
                this.showWorkflowOps = -1;
                this.selectedWorkflow = null;
            } catch(e) {
                this.error(e);
            }
        },
        createWorkflow() {
            const workflow = {
                name: this.workflowName,
                platform_id: this.workflowPlatform,
                type: this.selectedWorkflowType
            };

            axios
                .post(`${tahitiUrl}/workflows`, workflow)
                .then((resp) => {
                    // eslint-disable-next-line vue/no-mutating-props
                    this.editedStep.workflow_id = resp.data.id;
                    // eslint-disable-next-line vue/no-mutating-props
                    this.editedStep.workflow = resp.data;
                    this.editStep();
                    this.success('Workflow criado e associado com sucesso à etapa.');
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );

            this.showWorkflowOps = -1;
            this.workflowName = '';
            this.selectedWorkflowType = null;
        }
    }

};


</script>