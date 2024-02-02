<template>
    <div class="editPage-page">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="mt-2">
                <h6 class="editPage-pretitle">
                    Pipeline #{{pipeline.id}}
                </h6>
                <h1 class="editPage-title">
                    <InputHeader v-model="pipeline.name" />
                </h1> 
            </div>
            <div>
                <button class="btn btn-primary btn-lemonade-primary" @click="saveChanges">
                    <font-awesome-icon icon="fa fa-save" class="mr-1" /> Salvar
                </button>
            </div>
        </div>

        <div class="editPage-body">
            <div class="editPage-container">
                <div>
                    <div v-b-toggle.collapse-1 class="editPage-collapse-trigger" :class="collapse1">
                        Informações da Pipeline
                    </div>
                    <b-card class="editPage-infos">
                        <div class="editPage-infos-body">
                            <div class="editPage-infos-body-column">
                                <span class="left">ID</span> | <span class="right">{{pipeline.id}}</span>
                            </div>
                            <div class="editPage-infos-body-column">
                                <span class="left">Descrição</span> | <span class="right-identifier">{{pipeline.description === '' ? 'Pipeline sem descrição.' : pipeline.description}}</span>
                            </div>
                            <div class="editPage-infos-body-column">
                                <span class="left">Criado em</span> | <span class="right">{{pipeline.created | formatJsonDate}}</span>
                            </div>
                            <div class="editPage-infos-body-column">
                                <span class="left">Atualizado em</span> | <span class="right">{{pipeline.updated | formatJsonDate}}</span>
                            </div>
                            <!-- <div class="editPage-infos-body-column">
                                <span class="left">Habilitado</span> | <span class="right">{{pipeline.enabled ? 'Sim' : 'Não'}}</span>
                            </div> -->
                            <div class="editPage-infos-body-column">
                                <span class="left">Versão</span> | <span class="right">{{pipeline.version}}</span>
                            </div>
                        </div>
                    </b-card>
                </div>
                <div>
                    <div aria-controls="collapse-2"
                         :class="collapseVisible2 ? null : 'collapsed'" 
                         :aria-expanded="collapseVisible2 ? 'true' : 'false'" 
                         class="editPage-collapse-trigger" 
                         @click="collapseVisible2 = !collapseVisible2">
                        Etapas da Pipeline
                        <font-awesome-icon v-if="collapseVisible2" icon="fa fa-chevron-up" />
                        <font-awesome-icon v-else icon="fa fa-chevron-down" />
                    </div>
                    <b-collapse id="collapse-2" v-model="collapseVisible2" visible>
                        <b-card class="editPage-stepsDiv">
                            <div class="editPage-collapse-div">
                                <div class="editPage-tabs">
                                    <div class="editPage-etapas-header">
                                        <button id="popover-trigger" class="editPage-tab-button">
                                            <font-awesome-icon icon="info-circle" />
                                        </button>
                                        <b-popover target="popover-trigger" triggers="hover">
                                            Segure e arraste as etapas abaixo para reordená-las.
                                        </b-popover>
                                        <div class="editPage-etapas-header-column">
                                            Ordem da Etapa
                                        </div>
                                        <div class="editPage-etapas-header-column">
                                            Nome
                                        </div>
                                        <div class="editPage-etapas-header-column">
                                            Status
                                        </div>
                                        <div class="editPage-etapas-header-column" :class="acoesDrag">
                                            Ações
                                        </div>
                                    </div>
                                    <div v-if="pipeline.steps && pipeline.steps.length === 0" class="editPage-no-steps">
                                        Adicione etapas a sua pipeline
                                        <button class="ml-1 btn btn-sm btn-warning" title="Adicionar etapa" @click="openAddStepModal(0)">
                                            <font-awesome-icon icon="plus" />
                                        </button>
                                    </div>
                                    <draggable v-model="pipeline.steps" :options="dragOptions" @end="onDragEnd">
                                        <div v-for="(step, index) in orderedPipelineSteps"
                                             :key="step.id" 
                                             class="editPage-dragDiv" 
                                             :class="selectedStep == step.name ? 'editPage-dragDiv-selected' : null">
                                            <font-awesome-icon class="editPage-dragIcon" icon="fa fa-grip-vertical" />
                                            <div class="editPage-drag-column" :class="ordem">
                                                # {{index + 1}}
                                            </div>
                                            <div class="editPage-drag-column" :class="ident">
                                                <span class="editPage-stepButton" @click="redirectToWorkflow(step)">
                                                    {{step.name}}
                                                </span>
                                            </div>
                                            <div class="editPage-drag-column">
                                                <font-awesome-icon v-if="step.status == 'concluido'" 
                                                                   icon="check-circle"
                                                                   class="text-success" 
                                                                   title="Concluído" 
                                                                   size="lg" />
                                                <font-awesome-icon v-if="step.status == 'erro'" 
                                                                   icon="xmark-circle" 
                                                                   class="text-danger" 
                                                                   title="Erro" 
                                                                   size="lg" />
                                                <font-awesome-icon v-if="step.status == 'executando'" 
                                                                   icon="spinner" 
                                                                   spin 
                                                                   class="text-secondary" 
                                                                   title="Executando" 
                                                                   size="lg" />
                                                <font-awesome-icon v-if="step.status == 'pendente'" 
                                                                   icon="exclamation-circle" 
                                                                   class="text-warning" 
                                                                   title="Pendente" 
                                                                   size="lg" />
                                                <font-awesome-icon icon="exclamation-circle" 
                                                                   class="text-warning" 
                                                                   title="Pendente" 
                                                                   size="lg" />
                                            </div>
                                            <div class="editPage-drag-column" :class="acoes">
                                                <div>
                                                    <button class="ml-1 btn btn-sm btn-primary" title="Executar etapa">
                                                        <font-awesome-icon icon="play" />
                                                    </button>
                                                    <button class="ml-1 btn btn-sm btn-info" title="Agendar execução" @click="setSelectedStep(step.name, index)">
                                                        <font-awesome-icon icon="clock" />
                                                    </button>
                                                    <button class="ml-1 btn btn-sm btn-secondary" title="Editar etapa" @click="openEditModal(step)">
                                                        <font-awesome-icon icon="pen" />
                                                    </button>
                                                    <button class="ml-1 btn btn-sm btn-danger" title="Excluir etapa" @click="deleteStep(step.id, step.name)">
                                                        <font-awesome-icon icon="trash" />
                                                    </button>
                                                    <button class="ml-1 btn btn-sm btn-warning" title="Adicionar etapa" @click="openAddStepModal(step.order)">
                                                        <font-awesome-icon icon="plus" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </draggable>
                                    <b-modal ref="editStepModal" title="Editar etapa" size="lg" ok-only 
                                             scrollable @hidden="closeStepModal" @ok="editStep">
                                        <div class="configPage-card-modal">
                                            <div>
                                                <label class="editPage-label" for="nome">Nome</label>
                                                <input id="nome" v-model="editedStep.name" class="editPage-input" type="text"
                                                       placeholder="Nome da etapa">
                                            </div>

                                            <div>
                                                <label class="editPage-label" for="descricao">Descrição</label>
                                                <textarea id="descricao" v-model="editedStep.description" class="editPage-textarea" type="text"
                                                          placeholder="Descrição da etapa" />
                                            </div>
                                        </div>
                                        <hr class="mt-4 mb-3">
                                        <div v-if="editedStep.workflow !== undefined" class="d-flex flex-column">
                                            <label class="editPage-label">Etapa vinculada a um workflow:</label>
                                            <b-card class="w-50 my-2 clickable d-flex justify-content-between" @click="redirectToWorkflow(editedStep)">
                                                <font-awesome-icon icon="fa fa-flask" class="mr-1" size="lg" />
                                                <span class="editPage-workflow-label">
                                                    {{editedStep.workflow.id}} - {{editedStep.workflow.name}}
                                                </span>
                                            </b-card>
                                            <b-button class="mr-auto" @click="editedStep.workflow = undefined">
                                                Alterar
                                            </b-button>
                                        </div>
                                        <div v-if="editedStep.workflow === undefined">
                                            <label class="editPage-label mb-2">Vincular etapa a um workflow</label>
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
                                                        Novo workflow
                                                    </span>
                                                </b-card>
                                            </div>
                                            <div v-if="showWorkflowOps == 1" class="mb-3">
                                                <label>Escolha um workflow existente para vincular a esta etapa:</label>
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
                                                    <label class="editPage-label mb-2" for="identificador">Criação do workflow</label>
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
                                        </div>
                                    </b-modal>
                                    <b-modal ref="addStepModal" title="Adicionar etapa" size="lg" ok-only
                                             scrollable @hidden="closeStepModal" @ok="addStep">
                                        <div class="configPage-card-modal">
                                            <div>
                                                <label class="editPage-label" for="nome">Nome</label>
                                                <input id="nome" v-model="newStep.name" class="editPage-input" type="text"
                                                       placeholder="Nome da etapa">
                                            </div>

                                            <div>
                                                <label class="editPage-label" for="descricao">Descrição</label>
                                                <textarea id="descricao" v-model="newStep.description" class="editPage-textarea" type="text"
                                                          placeholder="Descrição da etapa" />
                                            </div>
                                        </div>
                                        <hr class="mt-4 mb-4">
                                        <label class="editPage-label mb-2" for="descricao">Vincular etapa a um workflow</label>
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
                                                    Novo workflow
                                                </span>
                                            </b-card>
                                        </div>

                                        <div v-if="showWorkflowOps == 1" class="mb-3">
                                            <label>Escolha um workflow existente para vincular a esta etapa:</label>
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
                                                <label class="editPage-label mb-2" for="identificador">Criação do workflow</label>
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
                                </div>
                                </div>

                                <PipelineStepScheduler :selected-step="selectedStep" :selected-step-index="selectedStepIndex" />
                            </div>
                        </b-card>
                    </b-collapse>
                </div>
                <div>
                    <div v-b-toggle.collapse-3 class="editPage-collapse-trigger" @click="collapseVisible3 = !collapseVisible3">
                        Histórico de Execuções
                        <font-awesome-icon v-if="collapseVisible3" icon="fa fa-chevron-up" />
                        <font-awesome-icon v-else icon="fa fa-chevron-down" />
                    </div>
                    <b-collapse id="collapse-3">
                        <b-card class="editPage-historico-body">
                            <v-client-table v-model="data" class="editPage-historico-table" :columns="columns" :options="options">
                                <template #id="props">
                                    {{props.row.id}}
                                </template>
                                <template #status="props">
                                    <div class="editPage-status" :class="props.row.status.toLowerCase()">
                                        {{props.row.status}}
                                    </div>
                                </template>
                                <template #log>
                                    <div class="btn-group" role="group">
                                        <button class="btn btn-spinner btn-primary btn-sm" title="Exibir log" @click="openLogModal">
                                            <font-awesome-icon icon="fa-eye" />
                                        </button>
                                    </div>
                                    <b-modal ref="logModal" size="lg" title="Log de execução da etapa" hide-footer>
                                        <b-card class="editPage-logCard">
                                            <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                            <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                            <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                            <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                            <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                            <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                        </b-card>
                                    </b-modal>
                                </template>
                            </v-client-table>
                        </b-card>
                    </b-collapse>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PipelineEditMixin from '../mixins/PipelineEditMixin.js';
import PipelineStepScheduler from './PipelineStepScheduler.vue';
import axios from 'axios';
import vSelect from 'vue-select';
import draggable from 'vuedraggable';
import { BModal } from 'bootstrap-vue';
import InputHeader from '../components/InputHeader.vue';
import Notifier from '../mixins/Notifier.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        draggable,
        BModal,
        InputHeader,
        'vue-select': vSelect
        PipelineStepScheduler
    },
    mixins: [PipelineEditMixin, Notifier],
    data() {
        return {
            pipeline: {},
            deleteResponse: null,
            ident: 'ident',
            acoes: 'acoes',
            acoesDrag: 'acoesDrag',
            strong: 'strong',
            collapse1: 'collapse1',
            selectedStep: '',
            selectedStepIndex: '',
            showWorkflowOps: 0,
            collapseVisible2: true,
            collapseVisible3: false,
            onDrag: false,
            editedPipeline: { name: '', description: '', enabled: true, steps: [] },
            editedStep: { id: null, name: '', description: '', workflow: {} },
            newStep: { name: '', description: '', enabled: true, order: null },
            stepOrder: null,
            workflowName: '',
            workflowPlatform: 1,
            selectedWorkflowType: null,
            workflowTypeOptions: [
                { value: 'DATA_EXPLORER', text: 'Explorador de dados' },
                { value: 'WORKFLOW', text: 'Fluxo de trabalho' },
                { value: 'SQL', text: 'Fluxo baseado em SQL' },
            ],
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            },
            selectedWorkflow: null,
            columns: [
                'id',
                'etapa',
                'data_exec',
                'status',
                'log',
            ],
            data: getData(),
            options: {
                skin: 'table-sm table table-hover',
                columnsClasses: {
                    id: 'text-start',
                    etapa: '',
                    data_exec: 'text-start',
                    status: ' text-start',
                    log: 'text-start'
                },
                dateColumns: ['data_exec'],
                headings: {
                    id: 'ID',
                    etapa: 'Etapa',
                    data_exec: 'Data da execução',
                    status: 'Status',
                    log: 'Log de execução',
                },
                sortable: ['id','etapa','data_exec'],
                filterable: ['id','etapa','data_exec'],
                sortIcon: {
                    base: 'fa fas',
                    is: 'fa-sort ml-10',
                    up: 'fa-sort-amount-up',
                    down: 'fa-sort-amount-down'
                },
                texts: {
                    filter: this.$tc('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
                }
            }
        };
    },
    computed: {
        orderedPipelineSteps() {
            if (this.pipeline && this.pipeline.steps) {
                return this.pipeline.steps.slice().sort((a, b) => a.order - b.order);
            } else {
                return [];
            }
        },
    },
    mounted() {
        this.load();
    },
    methods: {
        load() {
            this.$Progress.start();
            return axios
                .get(`${tahitiUrl}/pipelines/${this.$route.params.id}`)
                .then(resp => {
                    this.$Progress.finish();
                    this.pipeline = resp.data.data[0];
                })
                .catch(
                    function (e) {
                        this.$Progress.finish();
                        this.error(e);
                    }.bind(this)
                );
        },
        saveChanges() {
            this.editPipeline('Pipeline editada com sucesso.');
        },
        openAddStepModal(stepOrder) {
            this.$refs.addStepModal.show();
            this.stepOrder = stepOrder;
        },
        openEditModal(step) {
            this.editedStep.id = step.id;
            this.editedStep.name = step.name;
            this.editedStep.description = step.description;
            this.editedStep.workflow = step.workflow;
            this.$refs.editStepModal.show();
        },
        setSelectedStep(stepName, index) {
            this.selectedStep = stepName;
            this.selectedStepIndex = index;
        },
        openLogModal() {
            this.$refs.logModal.show();
        },
        closeStepModal() {
            this.selectedWorkflow = null;
            this.showWorkflowOps = 0;
            this.selectedWorkflowType = null;
            this.newStep.name = '';
            this.newStep.description = '';
        },
        redirectToWorkflow(step) {
            if(step.workflow === undefined) this.warning('Etapa não associada a um workflow.');
            else this.$router.push({ name: 'editWorkflow', params: { id: step.workflow.id, platform: 1 } });
        },
        onDragEnd(event) {
            // const movedStep = this.pipeline.steps[event.newIndex];

            this.pipeline.steps.forEach((step, index) => {
                step.order = index + 1;
            });

            // movedStep.order = event.newIndex + 1;
        },
        editPipeline(msg) {
            axios
                .patch(`${tahitiUrl}/pipelines/${this.pipeline.id}`, this.pipeline)
                .then((resp) => {
                    this.pipeline = resp.data.data[0];
                    this.success(msg);
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
            this.pipeline.steps.push(copy);
            
            this.editPipeline('Etapa adicionada com sucesso.');
        },
        editStep() {
            if (this.selectedWorkflow !== null) this.editedStep.workflow_id = this.selectedWorkflow.id;

            axios
                .patch(`${tahitiUrl}/pipelines/steps/${this.editedStep.id}`, this.editedStep)
                .then((resp) => {
                    const foundStep = this.pipeline.steps.find(step => step.id === resp.data.data[0].id);
                    Object.assign(foundStep, resp.data.data[0]);
                    this.success('Etapa editada com sucesso.');
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );
        },
        deleteStep(stepId, stepName) {
            this.confirm(
                this.$t('actions.delete') + " '" + stepName + "'",
                'Tem certeza que deseja excluir esta etapa?',
                () => {
                    this.pipeline.steps = this.pipeline.steps.filter(step => step.id !== stepId);

                    this.editPipeline('Etapa excluída com sucesso.');
                }
            );
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
                    this.success('Workflow criado com sucesso.');
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
    },
};

function getData() {
    return [
        { 
            id: 1, 
            etapa: 'Landing', 
            data_exec: '10/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 2, 
            etapa: 'Raw', 
            data_exec: '07/05/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 3, 
            etapa: 'Raw', 
            data_exec: '15/10/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 4, 
            etapa: 'Landing', 
            data_exec: '24/10/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 5, 
            etapa: 'Stage_1', 
            data_exec: '10/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 6, 
            etapa: 'MDM', 
            data_exec: '07/05/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 7, 
            etapa: 'MDM', 
            data_exec: '15/10/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 8, 
            etapa: 'Stage_1', 
            data_exec: '24/10/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 9, 
            etapa: 'Landing', 
            data_exec: '10/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 10,
            etapa: 'Landing',  
            data_exec: '07/05/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 11,
            etapa: 'Raw',  
            data_exec: '15/10/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 12,
            etapa: 'Raw',  
            data_exec: '24/10/2023',   
            status: 'Sucesso',   
            log: "" 
        },
    ];
}
</script>

<style lang="scss">

.editPage-pretitle {
    color: black;
    font-family: sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.6px;
    margin-bottom: 0;
    padding: 0px 4px;
    text-transform: uppercase;
}

.editPage-title {
    color: #333;
    margin: 0px 0px;
}

.editPage-page {
    height: 80vh;
}

.editPage-body {
    display: flex;
    flex-direction: row;
    gap: 40px;
    height: fit-content;
    padding-bottom: 20px;
}

.editPage-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
}

.editPage-collapse-trigger {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    padding: 10px 5px;
    font-size: 24px;
    border-bottom: 1px solid #9c9c9c;

    &:hover {
        background-color: #f8f9f9;
        cursor: pointer;
    }

    &.collapse1 {
        cursor: default;
    }
}

.editPage-collapse-div {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 40px;
    background-color: #f8f9f9;
}

.editPage-stepsDiv {
    border: 0px solid #dfdfdf;
    background-color: #f8f9f9;
    border-radius: 0px;
}

.editPage-infos {
    display: flex;
    width: 100%;
    border: 0px solid #dfdfdf;
    background-color: #f8f9f9;
    border-radius: 0px;
}

.editPage-infos-title {
    font-weight: 400;
    font-size: 24px;
    margin-bottom: 10px;
}

.editPage-infos-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    font-size: 18px;
}

.editPage-infos-body-column {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span.left {
        color: black;
        font-family: sans-serif;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.6px;
        margin-bottom: 0;
        padding: 0px 4px;
        text-transform: uppercase;
        margin-right: 15px;
    }

    span.right {
        margin-left: 15px;
    }

    span.right-identifier {
        max-height: 100px;
        overflow-y: auto;
        margin-left: 15px;
        max-width: 250px;
    }

    &.radios {
        justify-content: start;
        margin-top: 10px;
        width: 450px;
        text-align: justify;
    }
}


.editPage-tabs {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.editPage-tab-button {
    background-color: #FFF;
    border: 0px;
    color: black;
    position: absolute;
}

.editPage-etapas-header {
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: -2px;
    border: 2px solid #dfdfdf;
    padding: 3px 0px;
    font-weight: 700;
    background-color: #FFF;
}

.editPage-etapas-header-column {
    display: flex;
    width: 25%;
    justify-content: center;
}

.editPage-dragDiv {
    display: flex;
    position: relative;
    justify-content: space-between;
    border: 2px solid #dfdfdf;
    padding: 15px 0px;
    background-color: #FFF;

    margin-bottom: -2px;
    font-weight: 700;
    border-radius: 4px;

    &:hover {
        cursor: grab;
    }
}

.editPage-no-steps {
    display: flex;
    border: 2px solid #dfdfdf;
    padding: 15px 0px;
    background-color: #FFF;
    font-weight: 700;
    justify-content: center;
    align-items: center;
}

.editPage-dragDiv-selected {
    background-color: #eeeeee;
}

.editPage-drag-column {
    display: flex;
    width: 25%;
    justify-content: center;
    align-items: center;

    /* &.ident {
        justify-content: flex-start;
        padding-left: 6.5%;
    } */
}

.editPage-stepButton {
    background-color: transparent;
    border: 0px;
    color: #007bff;
    font-weight: 700;
    text-align: center;
    /* width: calc(100% - 16px); */

    &:hover {
        color: #0056b3;
        cursor: pointer;
    }
}

.editPage-dragIcon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #212529;
    width: 12px;
}

.editPage-agendador {
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 50%;
    margin-top: 0px;
}

.editPage-agendador-title {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: #86B94B;
    padding: 20px;
    font-weight: 700;
    font-size: 1rem;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.editPage-agendador-body {
    display: flex;
    flex-direction: column;
    padding: 20px;
    padding-bottom: 10px;
    align-items: start;
    gap: 10px;
    border: 1px solid #cccccc;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #FFF;
}

.editPage-agendador-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;

    &.radios {
        flex-direction: row;
        gap: 20px;
    }

    &.dias {
        flex-direction: row;
        gap: 20px;
    }
}

.editPage-agendador-group {
    display: flex;
    flex-direction: row;
    gap: 30px;
    width: 100%;
}

.editPage-historico {
    display: flex;
    flex-direction: column;
    height: fit-content;
}

.editPage-historico-title {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #86B94B;
    padding: 20px;
    font-weight: 700;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.editPage-historico-body {
    border: 0px;
    background-color: #f8f9f9;
    border-radius: 0px;
}

.editPage-historico-table {
    width: 100%;
    background-color: #FFF;
}

.editPage-chackbox-div {
    display: flex;
    flex-direction: row;
    width: 100%;

    &.diasSemana {
        flex-direction: column;
    }

    &.meses {
        justify-content: space-between;
    }
}

.editPage-label {
    display: block;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.editPage-label-badge {
    padding: 5px 10px;
    background-color: #17a2b8;
    border-radius: 0.25rem;
    font-weight: 700;
    font-size: 15px;
    color: white;
}

.editPage-input {
    width: 100%;
    height: fit-content;
    padding: 12px 10px;
    margin-bottom: 25px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;

    &.dias {
        width: 5.625rem;
    }
}

.editPage-textarea {
    width: 100%;
    max-height: 150px;
    height: fit-content;
    padding: 12px 20px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;
}

.editPage-inputHeader {
    input {
        font-size: 18px;    
    }
    display: flex;
    margin-bottom: 17px;
}

.editPage-logCard {
    background-color: #f6f6f6;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: #767676;
    text-align: justify;
}

.editPage-workflow-box {
    background-color: #eff0f6;
    padding: 20px;
    border-radius: 4px;
}

.editPage-workflow-label {
    color: black;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.6px;
    margin-bottom: 0;
    padding: 0px 4px;
    text-transform: uppercase;
}

.editPage-invalid-length {
    color: red;
    font-size: 12px;
    position: absolute;
    top: 4px;
    display: flex;
    justify-content: end;
    width: 100%;
}

</style>