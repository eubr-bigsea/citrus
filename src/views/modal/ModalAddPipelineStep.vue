<template>
    <b-modal ref="addStepModal"
             title="Adicionar etapa"
             size="lg"
             :cancel-title="$t('actions.cancel')"
             scrollable
             @hidden="closeStepModal"
             @ok="addStep">
        <div class="configPage-card-modal">
            <div>
                <label for="nome">{{$t('common.name')}}:</label>
                <input id="nome" v-model="newStep.name" class="form-control form-control-sm" type="text"
                       placeholder="Nome da etapa" maxlength="50">
            </div>

            <div class="mt-2">
                <label for="descricao">{{$t('common.description')}}</label>
                <textarea id="descricao" v-model="newStep.description" class="form-control form-control-sm" type="text"
                          placeholder="Descrição da etapa" maxlength="200" />
            </div>
        </div>
        <hr class="mt-4 mb-4">
        <label class="editPage-label mb-2" for="descricao">Vincular etapa a um fluxo de trabalho</label>
        <div v-if="showWorkflowOps == 0" class="d-flex">
            <b-card class="w-50 mr-2 clickable" @click="showWorkflowOps = 1">
                <span class="editPage-workflow-label">
                    <font-awesome-icon icon="fa fa-flask" class="mr-2" size="xl" />
                    Workflow existente
                </span>
            </b-card>
            <b-card class="w-50 ml-2 clickable" @click="showWorkflowOps = 2">
                <span class="editPage-workflow-label">
                    <font-awesome-icon icon="fa fa-plus" class="mr-2" size="xl" />
                    Novo fluxo de trabalho
                </span>
            </b-card>
        </div>

        <div v-if="showWorkflowOps == 1" class="mb-3">
            <label>Escolha um fluxo de trabalho existente para vincular a esta etapa:</label>
            <vue-select v-model="selectedWorkflow" :filterable="false" :options="workflowList" label="name"
                        class="w-100" @search="loadWorkflowList">
                <template #no-options="{ }">
                    <small>Digite parte do nome para pesquisar...</small>
                </template>
                <template #option="option">
                    <b-container>
                        <b-row class="align-items-center">
                            <font-awesome-icon icon="fa fa-flask" />
                            <b-col cols="9">
                                {{pad(option.id, 4, '&nbsp;')}} - {{option.name}}
                            </b-col>
                            <b-col cols="2">
                                {{option.type}}
                            </b-col>
                        </b-row>
                    </b-container>
                </template>
                <template #default="option">
                    {{pad(option.id, 4, '&nbsp;')}} - {{option.name}} - {{option.type}}
                </template>
                <template #selected-option="option">
                    <div class="selected d-center">
                        <font-awesome-icon icon="fa fa-flask" class="mr-2" />
                        {{pad(option.id, 4, '&nbsp;')}} - {{option.name}} | {{option.type}}
                    </div>
                </template>
            </vue-select>
            <b-button class="mt-3" @click="showWorkflowOps = 0">
                Cancelar
            </b-button>
        </div>
        <div v-if="showWorkflowOps == 2" class="d-flex flex-column">
            <b-container class="editPage-workflow-box p-3">
                <label class="editPage-label mb-2" for="identificador">Criação do fluxo de trabalho</label>
                <b-row>
                    <b-col>
                        <label class="" for="name">Nome:</label>
                        <input id="name" v-model="workflowName" v-focus type="text"
                               class="form-control w-100 form-control-sm mb-2"
                               maxlength="100">
                    </b-col>
                    <b-col>
                        <label class="" for="platform">Plataforma:</label>
                        <input id="platform" v-focus value="SPARK" type="text"
                               class="form-control w-100 form-control-sm mb-2"
                               maxlength="100" disabled>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <label>Tipo:</label>
                        <b-form-select v-model="selectedWorkflowType" :options="workflowTypeOptions" class="w-100 mb-2" />
                    </b-col>
                    <b-col class="position-relative">
                        <b-button class="position-absolute" style="right: 15px; bottom: 0;" variant="success" @click="createWorkflow">
                            Confirmar
                        </b-button>
                        <b-button class="position-absolute" style="right: 120px; bottom: 0;" @click="showWorkflowOps = 0">
                            Cancelar
                        </b-button>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </b-modal>
</template>

<script>
import axios from 'axios';
import PipelineEditMixin from '../../mixins/PipelineEditMixin.js';
import vSelect from 'vue-select';
import Notifier from '../../mixins/Notifier.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        'vue-select': vSelect,
    },
    mixins: [PipelineEditMixin, Notifier],
    props: {
        pipeline: { type: Object, default: () => {} },
    },
    emits: ['onupdate-pipeline'],
    data() {
        return {
            newStep: { name: '', description: '', enabled: true, order: null },
            showWorkflowOps: 0,
            selectedWorkflow: null,
            workflowName: '',
            workflowPlatform: 1,
            selectedWorkflowType: null,
            workflowTypeOptions: [
                { value: 'DATA_EXPLORER', text: 'Explorador de dados' },
                { value: 'WORKFLOW', text: 'Fluxo de trabalho' },
                { value: 'SQL', text: 'Fluxo baseado em SQL' },
            ],
        };
    },
    methods: {
        closeStepModal() {
            this.selectedWorkflow = null;
            this.showWorkflowOps = 0;
            this.selectedWorkflowType = null;
            this.newStep.name = '';
            this.newStep.description = '';
        },
        show() {
            this.$refs.addStepModal.show();
        },
        redirectToWorkflow(step) {
            if(step.workflow === undefined) this.warning('Etapa não associada a um fluxo de trabalho.');
            else this.$router.push({ name: 'editWorkflow', params: { id: step.workflow.id, platform: 1 } });
        },
        editPipeline(msg) {
            const changedPipeline = { ...this.pipeline };
            axios
                .patch(`${tahitiUrl}/pipelines/${this.pipeline.id}`, changedPipeline)
                .then((resp) => {
                    // eslint-disable-next-line vue/no-mutating-props
                    const pipelineData = resp.data.data[0];
                    this.$emit('onupdate-pipeline', pipelineData);
                    this.success(msg);
                    this.selectedWorkflow = null;
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );
        },
        addStep() {
            this.newStep.order = this.pipeline.steps.length+1;

            if (this.selectedWorkflow !== null) this.newStep.workflow_id = this.selectedWorkflow.id;

            const copy = {... this.newStep};
            // this.pipeline.steps.splice(this.stepOrder, 0, copy);

            // eslint-disable-next-line vue/no-mutating-props
            this.pipeline.steps.push(copy);

            this.editPipeline('Etapa adicionada com sucesso.');
        },
        createWorkflow() {
            const workflow = {
                name: this.workflowName,
                platform_id: this.workflowPlatform,
                type: this.selectedWorkflowType
            };

            axios
                .post(`${tahitiUrl}/workflows`, workflow)
                .then(() => {
                    this.success('Fluxo de trabalho criado com sucesso.');
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );

            this.showWorkflowOps = 0;
            this.workflowName = '';
            this.selectedWorkflowType = null;
        }
    }

};


</script>