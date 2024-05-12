<template>
    <div class="editPage-step-config-body">
        <div>
            <div>
                <label class="editPage-label" for="nome">{{$t('common.name')}}</label>
                <input id="nome" 
                       v-model="editedStep.name" 
                       class="editPage-input" 
                       type="text"
                       :placeholder="$t('pipeline.template.stepName')" 
                       @input="handleInput">
            </div>

            <div>
                <label class="editPage-label" for="descricao">{{$t('common.description')}}</label>
                <textarea id="descricao" 
                          v-model="editedStep.description" 
                          class="editPage-textarea" 
                          type="text"
                          :placeholder="$t('pipeline.template.stepDescription')" 
                          @input="handleInput" />
            </div>
        </div>
        <hr class="mt-4 mb-3">
        <div v-if="editedStep.workflow !== undefined" class="d-flex flex-column">
            <label class="editPage-label">{{$t('pipeline.edit.settings.stepLinkedToWorkflow')}}:</label>

            <b-card class="w-100 my-2 clickable d-flex justify-content-between" @click="redirectToWorkflow(editedStep)">
                <font-awesome-icon icon="fa fa-flask" class="mr-1" size="lg" />
                <span class="editPage-workflow-label">
                    {{editedStep.workflow.id}} - {{editedStep.workflow.name}}
                </span>
            </b-card>
            <b-button class="mr-auto" @click="editedStep.workflow = undefined">
                {{$t('actions.change')}}
            </b-button>
        </div>
        <div v-if="editedStep.workflow === undefined">
            <label class="editPage-label mb-2">{{$t('pipeline.edit.settings.linkStepToWorkflow')}}</label>
            <div v-if="showWorkflowOps == 0" class="d-flex">
                <b-card class="w-50 mr-2 clickable" @click="showWorkflowOps = 1">
                    <span class="editPage-workflow-label">
                        <font-awesome-icon icon="fa fa-flask" class="mr-2" size="xl" />
                        {{$t('pipeline.edit.settings.existingWorkflow')}}
                    </span>
                </b-card>
                <b-card class="w-50 ml-2 clickable" @click="showWorkflowOps = 2">
                    <span class="editPage-workflow-label">
                        <font-awesome-icon icon="fa fa-plus" class="mr-2" size="xl" />
                        {{$t('actions.new')}} {{$t('titles.workflow')}}
                    </span>
                </b-card>
            </div>
            <div v-if="showWorkflowOps == 1" class="mb-3">
                <label>{{$t('pipeline.edit.settings.chooseExistingWorkflow')}}:</label>
                <vue-select v-model="selectedWorkflow" :filterable="false" :options="workflowList" label="name" 
                            class="w-100" @search="loadWorkflowList" @input="handleInput">
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
                <div>
                    <b-button class="float-right mt-3" style="right: 15px; bottom: 0;" variant="success" @click="editStepWorkflow">
                        {{$t('actions.confirm')}}
                    </b-button>
                    <b-button class="mt-3" @click="showWorkflowOps = 0">
                        {{$t('actions.cancel')}}
                    </b-button>
                </div>
            </div>
            <div v-if="showWorkflowOps == 2" class="d-flex flex-column">
                <b-container class="editPage-workflow-box p-3">
                    <label class="editPage-label mb-2" for="identificador">{{$t('pipeline.edit.settings.workflowCreation')}}</label>
                    <b-row>
                        <b-col>
                            <label class="" for="name">{{$t('common.name')}}:</label>
                            <input id="name" v-model="workflowName" v-focus type="text"
                                   class="form-control w-100 form-control-sm mb-2"
                                   maxlength="100">
                        </b-col>
                        <b-col>
                            <label class="" for="platform">{{$t('common.platform')}}:</label>
                            <input id="platform" v-focus value="SPARK" type="text"
                                   class="form-control w-100 form-control-sm mb-2"
                                   maxlength="100" disabled>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="6">
                            <label>{{$t('common.type', 1)}}:</label>
                            <b-form-select v-model="selectedWorkflowType" :options="workflowTypeOptions" class="w-100 mb-2" />
                        </b-col>
                        <b-col class="position-relative">
                            <b-button class="position-absolute" style="right: 15px; bottom: 0;" variant="success" @click="createWorkflow">
                                {{$t('actions.confirm')}}
                            </b-button>
                            <b-button class="position-absolute" style="right: 120px; bottom: 0;" @click="showWorkflowOps = 0">
                                {{$t('actions.cancel')}}
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
        editedStep: { type: Object, default: () => {} },
        selectedStepIndex: { type: Number, default: null },
        pipeline: { type: Object, default: () => {} },
    },
    emits: ['send-step-changes'],
    data() {
        return {
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
    watch: {
        showWorkflowOps() {
            this.editStep();
        },
        selectedStepIndex() {
            if(this.editedStep.workflow === undefined) this.showWorkflowOps = 0;
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
            if(step.workflow === undefined) this.warning(this.$t('pipeline.alerts.stepNotAssociated'));
            else this.$router.push({ name: 'editWorkflow', params: { id: step.workflow.id, platform: 1 } });
        },
        editStepWorkflow() {

            const stepWorkflow = {
                id: this.selectedWorkflow.id,
                name: this.selectedWorkflow.name,
                type: this.selectedWorkflow.type,
                platform_id: this.workflowPlatform,
            };

            // eslint-disable-next-line vue/no-mutating-props
            this.editedStep.workflow = stepWorkflow;

            const foundStep = this.pipeline.steps.find(step => step.id === this.editedStep.id);
            Object.assign(foundStep, this.editedStep);

            axios
                .patch(`${tahitiUrl}/pipelines/${this.pipeline.id}`, this.pipeline)
                .then((resp) => {
                    // eslint-disable-next-line vue/no-mutating-props
                    // this.pipeline = resp.data.data[0];
                    // eslint-disable-next-line vue/no-mutating-props
                    this.editedStep.workflow = this.pipeline.steps.find(step => step.id === this.editedStep.id).workflow;
                    this.editStep();
                    this.success(this.$t('pipeline.alerts.successfullyAssociated'));
                    this.selectedWorkflow = null;
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
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
                .then((resp) => {
                    // eslint-disable-next-line vue/no-mutating-props
                    this.editedStep.workflow_id = resp.data.id;
                    // eslint-disable-next-line vue/no-mutating-props
                    this.editedStep.workflow = resp.data;
                    this.editStep();
                    this.success(this.$t('pipeline.alerts.successfullyCreatedAssociated'));
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