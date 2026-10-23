<template>
    <div class="editPage-step-config-body step-config">
        <div class="mb-3">
            <label for="nome" class="form-label small fw-bold mb-1">{{$t('common.name')}}</label>
            <input id="nome" v-model="editedStep.name" class="form-control form-control-sm" type="text"
                   :placeholder="$t('pipeline.template.stepName')" maxlength="50" @input="handleInput">
        </div>
        <div class="mb-3">
            <label for="descricao" class="form-label small fw-bold mb-1">{{$t('common.description')}}</label>
            <textarea id="descricao" v-model="editedStep.description" class="form-control form-control-sm"
                      rows="3" :placeholder="$t('pipeline.template.stepDescription')" maxlength="200"
                      @input="handleInput" />
            <div class="form-text text-end">
                {{(editedStep.description || '').length}}/200
            </div>
        </div>

        <div class="step-config-section">
            <h3 class="step-config-title">
                <font-awesome-icon icon="fa fa-flask" class="me-1" />
                {{$t('pipeline.edit.settings.linkStepToWorkflow')}}
            </h3>

            <div v-if="editedStep.workflow !== undefined && showWorkflowOps < 0"
                 class="d-flex align-items-center gap-2 step-workflow-row">
                <div class="flex-grow-1 text-truncate">
                    <div class="small text-muted">
                        {{$t('pipeline.edit.settings.stepLinkedToWorkflow')}}
                    </div>
                    <strong>#{{editedStep.workflow.id}} - {{editedStep.workflow.name}}</strong>
                </div>
                <button type="button" class="btn btn-sm btn-outline-secondary flex-shrink-0"
                        @click="redirectToWorkflow(editedStep)">
                    {{$t('actions.edit')}}
                </button>
                <button type="button" class="btn btn-sm btn-link flex-shrink-0" @click="showWorkflowOps = 0">
                    {{$t('actions.change')}}
                </button>
            </div>

            <div v-if="showWorkflowOps > -1">
                <div v-if="showWorkflowOps == 0" class="d-flex flex-wrap align-items-center gap-2">
                    <b-button variant="outline-primary" size="sm" @click="showWorkflowOps = 1">
                        <font-awesome-icon icon="fa fa-flask" class="me-1" />
                        {{$t('pipeline.edit.settings.existingWorkflow')}}
                    </b-button>
                    <b-button variant="outline-success" size="sm" @click="showWorkflowOps = 2">
                        <font-awesome-icon icon="fa fa-plus" class="me-1" />
                        {{$t('pipeline.edit.settings.newWorkflow')}}
                    </b-button>
                    <b-button v-if="editedStep.workflow" variant="link" size="sm" @click="showWorkflowOps = -1">
                        {{$t('actions.cancel')}}
                    </b-button>
                </div>
                <div v-if="showWorkflowOps == 1">
                    <label class="form-label small mb-1">{{$t('pipeline.edit.settings.chooseExistingWorkflow')}}</label>
                    <vue-select v-model="selectedWorkflow" :filterable="false" :options="workflowList" label="name"
                                class="w-100" @search="loadWorkflowList" @input="handleInput">
                        <template #no-options="{}">
                            <small>{{$t('common.typeToSearch')}}</small>
                        </template>
                        <template #option="option">
                            <div class="container">
                                <div class="row align-items-center">
                                    <font-awesome-icon icon="fa fa-flask" />
                                    <div class="col-9">
                                        {{pad(option.id, 4, '&nbsp;')}} - {{option.name}}
                                    </div>
                                    <div class="col-2">
                                        {{option.type}}
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template #default="option">
                            {{pad(option.id, 4, '&nbsp;')}} - {{option.name}} - {{option.type}}
                        </template>
                        <template #selected-option="option">
                            <div class="selected d-center">
                                <font-awesome-icon icon="fa fa-flask" class="me-2" />
                                {{pad(option.id, 4, '&nbsp;')}} - {{option.name}} | {{option.type}}
                            </div>
                        </template>
                    </vue-select>
                    <div class="d-flex justify-content-end gap-2 mt-3">
                        <b-button size="sm" variant="outline-secondary" @click="showWorkflowOps = -1">
                            {{$t('actions.cancel')}}
                        </b-button>
                        <b-button :disabled="!selectedWorkflow" variant="primary" size="sm" @click="editStepWorkflow">
                            {{$t('actions.confirm')}}
                        </b-button>
                    </div>
                </div>
                <div v-if="showWorkflowOps == 2">
                    <div class="row g-2">
                        <div class="col-8">
                            <label for="name" class="form-label small mb-1">{{$t('common.name')}}</label>
                            <input id="name" v-model="workflowName" v-focus type="text"
                                   class="form-control form-control-sm" maxlength="100">
                        </div>
                        <div class="col-4">
                            <label for="workflow-type" class="form-label small mb-1">{{$t('common.type')}}</label>
                            <input id="workflow-type" v-model="selectedWorkflowType" type="text" disabled
                                   class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="d-flex justify-content-end gap-2 mt-3">
                        <b-button size="sm" variant="outline-secondary" @click="showWorkflowOps = 0">
                            {{$t('actions.cancel')}}
                        </b-button>
                        <b-button size="sm" variant="success" @click="createWorkflow">
                            {{$t('actions.confirm')}}
                        </b-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import PipelineEditMixin from '../mixins/PipelineEditMixin.js';
import vSelect from 'vue-select';
import Notifier from '../mixins/Notifier.js';
import { buildWorkflowPayload, META_PLATFORM_ID } from '@/views/data-explorer/entities.js';

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
    emits: ['update-step'],
    data() {
        return {
            showWorkflowOps: this.editedStep.workflow === undefined ? 0 : -1,
            selectedWorkflow: null,
            workflowName: '',
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

            this.$emit('update-step', this.editedStep);
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
                return;
            }
            const stepWorkflow = {
                id: this.selectedWorkflow?.id, //may be null
                name: this.selectedWorkflow?.name,
                type: this.selectedWorkflow?.type,
                platform_id: META_PLATFORM_ID, // the list only offers META (SQL) workflows
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
        async createWorkflow() {
            const workflow = buildWorkflowPayload(this.workflowName, this.selectedWorkflowType);

            try {
                const resp = await axios.post(`${tahitiUrl}/workflows`, workflow);
                // eslint-disable-next-line vue/no-mutating-props
                this.editedStep.workflow_id = resp.data.id;
                // eslint-disable-next-line vue/no-mutating-props
                this.editedStep.workflow = resp.data;
                this.editStep();
                this.success('Workflow criado e associado com sucesso à etapa.');
                this.showWorkflowOps = -1;
                this.workflowName = '';
                this.selectedWorkflowType = 'SQL';
            } catch (e) {
                this.error(e);
            }
        }
    }

};


</script>

<style scoped>
.step-config-section {
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
}

.step-config-title {
    margin: 0 0 0.75rem;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #6c757d;
}

.step-workflow-row {
    padding: 0.5rem 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    background: #f8f9fa;
}
</style>
