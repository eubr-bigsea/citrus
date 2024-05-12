<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="mt-2">
                <h6 class="editPage-pretitle">
                    Pipeline #{{pipeline.id}}
                </h6>
                <h1 class="editPage-title">
                    <InputHeader v-model="pipeline.name" @input="isDirty = true" />
                </h1> 
            </div>
            <div class="btn-group">
                <div class="editPage-enabled-checkbox-div" :class="{'editPage-disabled-checkbox-div': !pipeline.enabled}">
                    <b-form-checkbox v-model="pipeline.enabled" 
                                     class="d-flex align-items-center" 
                                     name="check-button" 
                                     size="sm"
                                     switch 
                                     @change="isDirty = true">
                        {{$t('common.enabled')}}
                    </b-form-checkbox>
                </div>
                <button class="btn btn-sm btn-outline-secondary float-left border-right-0" @click="showPeriodicityDiv = !showPeriodicityDiv"> 
                    <font-awesome-icon icon="fa fa-calendar-alt" class="" /> {{$t('pipeline.edit.periodicity')}}
                </button>
                <button class="btn btn-sm btn-outline-secondary float-left" @click="redirectToRuns">
                    <font-awesome-icon icon="fa fa-history" class="" /> {{$t('common.history')}}
                </button>
                <button class="btn btn-sm btn-outline-success" :disabled="!isDirty" @click="saveChanges">
                    <font-awesome-icon icon="fa fa-save" class="" /> {{$t('actions.save')}}
                </button>
            </div>
        </div>

        <div class="editPage-periodicity-div" :class="{'editPage-periodicity-div-hidden': !showPeriodicityDiv}">
            <div class="mb-2 d-flex align-items-center justify-content-between">
                <span class="font-weight-bold">
                    {{$t('pipeline.edit.pipelinePeriodicity')}}
                </span>
                <font-awesome-icon icon="fa fa-x" size="sm" class="editPage-periodicity-x" @click="showPeriodicityDiv = false" />
            </div>
            <div class="">
                <p>{{$t('pipeline.edit.definePeriodicity')}}:</p>
                <b-form-select v-model="pipelinePeriodicity" 
                               class="mt-0" 
                               :options="periodicityOptions" />
            </div>
            <div v-if="pipelinePeriodicity === 'daily'">
                <hr>
                <div class="d-flex flex-row">
                    <p class="font-weight-bold mr-2">
                        {{$t('titles.start')}}:
                    </p>
                    <input id="iniciar-data" v-model="startDate" class="editPage-input" type="date" 
                           :min="minDate">
                </div>
                <div class="d-flex flex-row">
                    <p class="font-weight-bold mr-2">
                        {{$t('pipeline.edit.intervalDays')}}:
                    </p>
                    <input id="repetir-dias" v-model="intervalDays" class="editPage-input" 
                           type="number" min="0">
                </div>
            </div>
            <div v-if="pipelinePeriodicity === 'weekly'">
                <hr>
                <div class="d-flex flex-row">
                    <p class="font-weight-bold mr-2">
                        {{$t('titles.start')}}:
                    </p>
                    <input id="iniciar-data" v-model="startDate" class="editPage-input" type="date" 
                           :min="minDate">
                </div>
                <div class="d-flex flex-row">
                    <p class="font-weight-bold">
                        {{$t('pipeline.edit.intervalWeeks')}}:
                    </p>
                    <input id="repetir-dias" v-model="intervalWeeks" class="editPage-input" 
                           type="number" min="0">
                </div>
            </div>
            <div v-if="pipelinePeriodicity === 'monthly'">
                <hr>
                <div class="d-flex flex-row">
                    <p class="font-weight-bold mr-2">
                        {{$t('titles.start')}}:
                    </p>
                    <input id="iniciar-data" v-model="startDate" class="editPage-input" type="date" 
                           :min="minDate">
                </div>
                <div class="d-flex flex-row">
                    <p class="font-weight-bold">
                        {{$t('pipeline.edit.intervalMonths')}}:
                    </p>
                    <input id="repetir-dias" v-model="intervalMonths" class="editPage-input" 
                           type="number" min="0">
                </div>
            </div>
        </div>

        <div class="editPage-body">
            <div class="editPage-container">
                <div class="w-25">
                    <div class="editPage-collapse-title">
                        {{$t('pipeline.edit.pipelineInfo')}}
                    </div>
                    <b-card class="editPage-infos">
                        <div class="editPage-infos-container">
                            <div class="d-flex flex-row">
                                <div class="editPage-infos-left">
                                    <div>{{$t('common.created')}}</div>
                                    <div>{{$t('common.updated')}}</div>
                                </div>
                                <div class="editPage-infos-right">
                                    <div>{{pipeline.created | formatJsonDate}}</div>
                                    <div>{{pipeline.updated | formatJsonDate}}</div>
                                </div>
                            </div>
                            <div class="editPage-infos-bottom mt-2">
                                {{$t('common.description')}}
                                <TextAreaCustom v-model="pipeline.description" @input="isDirty = true" />
                            </div>
                        </div>
                    </b-card>
                </div>
                <div class="w-75">
                    <div class="editPage-collapse-title">
                        {{$t('pipeline.edit.pipelineSteps')}}
                    </div>
                    <b-card class="editPage-stepsDiv scroll-area">
                        <div class="editPage-collapse-div">
                            <div class="editPage-left-container">
                                <div class="editPage-etapas-header">
                                    <button id="popover-trigger" class="editPage-tab-button">
                                        <font-awesome-icon icon="info-circle" />
                                    </button>
                                    <b-popover target="popover-trigger" triggers="hover">
                                        {{$t('pipeline.template.holdAndDragSteps')}}
                                    </b-popover>
                                    <div class="editPage-etapas-header-column">
                                        {{$t('titles.order')}}
                                    </div>
                                    <div class="editPage-etapas-header-column">
                                        {{$t('common.name')}}
                                    </div>
                                    <div class="editPage-etapas-header-column">
                                        {{$t('common.action', 2)}}
                                    </div>
                                </div>
                                <div v-if="pipeline.steps && pipeline.steps.length === 0" class="editPage-no-steps">
                                    {{$t('pipeline.edit.addStepsToPipeline')}}
                                    <button class="ml-1 btn btn-sm btn-secondary" title="Adicionar etapa" @click="openAddStepModal(0)">
                                        <font-awesome-icon icon="plus" />
                                    </button>
                                </div>
                                <draggable v-model="pipeline.steps" :options="dragOptions" @end="onDragEnd">
                                    <div v-for="(step, index) in orderedPipelineSteps"
                                         :key="step.id" 
                                         class="editPage-dragDiv" 
                                         :class="{'editPage-dragDiv-selected': selectedStep.id === step.id}"
                                         @dragstart="onDragStart"
                                         @click="setSelectedStep(step, index)">
                                        <font-awesome-icon class="editPage-dragIcon" icon="fa fa-grip-vertical" />
                                        <div class="editPage-drag-column">
                                            # {{index + 1}}
                                        </div>
                                        <div class="editPage-drag-column" :class="ident">
                                            <span class="editPage-stepButton" @click="redirectToWorkflow(step)">
                                                {{step.name}}
                                            </span>
                                        </div>
                                        <div class="editPage-drag-column">
                                            <div>
                                                <button class="btn btn-sm btn-danger" 
                                                        :title="$t('actions.delete') + ' ' + $t('titles.step', 1)" 
                                                        @click="deleteStep(step.id, step.name)">
                                                    <font-awesome-icon icon="trash" />
                                                </button>
                                                <button class="ml-1 btn btn-sm btn-secondary" 
                                                        :title="$t('actions.addItem') + ' ' + $t('titles.step', 1)" 
                                                        @click="openAddStepModal(step.order)">
                                                    <font-awesome-icon icon="plus" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </draggable>
                                <ModalAddPipelineStep ref="addStepModal" :pipeline="pipeline" @onupdate-pipeline="updatePipeline" />
                            </div>

                            <div class="editPage-right-container">
                                <div v-if="pipelineWithoutSteps" class="w-100 h-100 d-flex justify-content-center"> 
                                    <b-card class="w-100 h-25 text-center p-5">
                                        <div class="editPage-empty-step ">
                                            {{$t('pipeline.edit.addStepsToAccess')}}
                                        </div>
                                    </b-card>
                                </div>
                                <b-tabs v-if="selectedStepIndex !== null" class="w-100" justified>
                                    <b-tab active>
                                        <template #title>
                                            <span class="editPage-tabs-title-text">
                                                {{$t('pipeline.edit.schedulerLabel')}}
                                            </span>
                                        </template>
                                        <PipelineStepScheduler ref="stepScheduler" 
                                                               :selected-step="selectedStep" 
                                                               :selected-step-index="selectedStepIndex" 
                                                               :pipeline-id="pipeline.id" 
                                                               @send-scheduler-changes="schedulerUpdate" />
                                    </b-tab>
                                    <b-tab>
                                        <template #title>
                                            <span class="editPage-tabs-title-text">
                                                {{$t('pipeline.edit.settingsLabel')}}
                                            </span>
                                        </template>
                                        <EditPipelineStep ref="editStepModal" 
                                                          :edited-step="editedStep" 
                                                          :pipeline="pipeline" 
                                                          :selected-step-index="selectedStepIndex" @send-step-changes="schedulerUpdate" />
                                    </b-tab>
                                </b-tabs>
                            </div>
                        </div>
                    </b-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PipelineEditMixin from '../mixins/PipelineEditMixin.js';
import EditPipelineStep from '../components/EditPipelineStep.vue'; 
import ModalAddPipelineStep from './modal/ModalAddPipelineStep.vue';
import PipelineStepScheduler from '../components/PipelineStepScheduler.vue';
import axios from 'axios';
import draggable from 'vuedraggable';
import InputHeader from '../components/InputHeader.vue';
import TextAreaCustom from '../components/TextAreaCustom.vue';
import Notifier from '../mixins/Notifier.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        draggable,
        InputHeader,
        TextAreaCustom,
        EditPipelineStep,
        ModalAddPipelineStep,
        PipelineStepScheduler,
    },
    mixins: [PipelineEditMixin, Notifier],
    beforeRouteLeave(to, from, next) {
        if (this.isDirty) {
            if (confirm(this.$t('warnings.dirtyCheck'))) {
                next();
            }
        } else {
            next();
        }
    },
    data() {
        return {
            pipeline: {},
            pipelineCopy: {},
            pipelineWithoutSteps: false,
            pipelinePeriodicity: null,
            showPeriodicityDiv: false,
            deleteResponse: null,
            isDirty: false,
            ident: 'ident',
            collapse1: 'collapse1',
            selectedStep: {},
            selectedStepIndex: null,
            collapseVisible2: true,
            collapseVisible3: false,
            editedStep: { id: null, name: '', description: '', workflow: {} },
            stepOrder: null,
            startDate: "",
            intervalDays: null,
            intervalWeeks: null,
            intervalMonths: null,
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost',
            },
            periodicityOptions: [
                { value: null, text: this.$t('pipeline.edit.selectPeriodicity') },
                { value: 'daily', text: this.$t('pipeline.edit.daily') },
                { value: 'weekly', text: this.$t('pipeline.edit.weekly') },
                { value: 'monthly', text: this.$t('pipeline.edit.monthly') },
            ]
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
        minDate() {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 1);
            const currentDateFormatted = currentDate.toISOString().split('T')[0];
            return currentDateFormatted;
        }
    },
    watch: {
        pipelinePeriodicity() {
            this.isDirty = true;
        }
    },
    created() {
        window.addEventListener('beforeunload', this.leaving);
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
                    if(this.pipeline.steps.length !== 0) this.setSelectedStep(this.pipeline.steps[0], 0);
                    else this.pipelineWithoutSteps = true;
                    this.pipelineCopy = JSON.parse(JSON.stringify(this.pipeline));
                    console.log(this.pipeline);
                })
                .catch(
                    function (e) {
                        this.$Progress.finish();
                        this.error(e);
                    }.bind(this)
                );
        },
        saveChanges() {
            this.editPipeline(this.$t('pipeline.alerts.pipelineEditionSuccess'));
            this.isDirty = false;
        },
        openAddStepModal(stepOrder) {
            this.$refs.addStepModal.show();
            this.stepOrder = stepOrder;
        },
        setSelectedStep(step, index) {
            this.editedStep.id = step.id;
            this.editedStep.name = step.name;
            this.editedStep.description = step.description;
            this.editedStep.workflow = step.workflow;
            this.selectedStep = step;
            this.selectedStepIndex = index;
        },
        redirectToWorkflow(step) {
            if (step.workflow === undefined) this.warning(this.$t('pipeline.alerts.stepNotAssociated'));
            else this.$router.push({ name: 'editWorkflow', params: { id: step.workflow.id, platform: 1 } });
        },
        onDragStart() {
            this.isDirty = true;
        },
        onDragEnd(event) {
            this.pipeline.steps.forEach((step, index) => {
                step.order = index + 1;
            });
            this.isDirty = true;
        },
        updatePipeline(pipelineData) {
            this.pipeline = pipelineData;
            this.pipelineWithoutSteps = false;
            this.setSelectedStep(this.pipeline.steps[this.pipeline.steps.length - 1], this.pipeline.steps.length - 1);
        },
        schedulerUpdate(childData) {
            this.isDirty = true;
            const foundStep = this.pipeline.steps.find(step => step.id === childData.id);
            Object.assign(foundStep, childData);
        },
        leaving(event) {
            if (this.isDirty) {
                event.preventDefault();
                event.returnValue = false;
            }
        },
        redirectToRuns() {
            this.$router.push({ name: 'pipelineRunsList', params: { id: this.pipeline.id, name: this.pipeline.name, from: 'PipelineEdit' } });
        },
        editPipeline(msg) {
            axios
                .patch(`${tahitiUrl}/pipelines/${this.pipeline.id}`, this.pipeline)
                .then((resp) => {
                    this.pipeline = resp.data.data[0];
                    if(this.pipeline.steps.length === 0) this.pipelineWithoutSteps = true;
                    this.success(msg);
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
                this.$t('pipeline.edit.wantToDeleteStep'),
                () => {
                    if(!this.pipelineWithoutSteps) this.setSelectedStep(this.pipeline.steps[0], 0);
                    this.pipeline.steps = this.pipeline.steps.filter(step => step.id !== stepId);
                    this.selectedStepIndex = null;
                    this.editPipeline(this.$t('pipeline.alerts.stepDeletionSuccess'));
                }
            );
        },
    },
};

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

.editPage-body {
    display: flex;
    flex-direction: row;
    gap: 40px;
    height: fit-content;
    padding-bottom: 20px;
}

.editPage-container {
    display: flex;
    flex-direction: row;
    gap: 16px;
    width: 100%;
}

.editPage-collapse-title {
    padding: 12px 16px;
    border-bottom: 1px solid #9c9c9c;
    background-color: #f8f9f9;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.editPage-collapse-div {
    display: flex;
    flex-direction: row;
    gap: 20px;
    background-color: #f8f9f9;
    padding-bottom: 20px;
    min-height: 500px;
}

.editPage-stepsDiv {
    border: 0px solid #dfdfdf;
    background-color: #f8f9f9;
    border-radius: 0px;
    height: 70vh;
    overflow: auto;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.editPage-infos {
    border: 0px;
    background-color: #f8f9f9;
    border-radius: 0px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.editPage-infos-container {
    display: flex;
    flex-direction: column;
    font-size: 14px;
}

.editPage-infos-left {
    display: flex;
    flex-direction: column;
    text-align: left;
    width: 50%;
    color: black;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 0;
    text-transform: uppercase;
    border-right: 1px solid #9c9c9c;
}

.editPage-infos-right {
    display: flex;
    flex-direction: column;
    width: 50%;
    padding-left: 10px;
}

.editPage-infos-bottom {
    display: flex;
    flex-direction: column;
    text-align: left;
    color: black;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.6px;
    margin-bottom: 0;
    text-transform: uppercase;
}

.editPage-left-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.editPage-right-container {
    display: flex;
    width: 100%;
}

.editPage-tab-button {
    background-color: #FFF;
    border: 0px;
    color: black;
    position: absolute;
    left: 10px;
}

.editPage-etapas-header {
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: -2px;
    border: 2px solid #dfdfdf;
    padding: 3px 0px;
    font-weight: 700;
    background-color: #FFF;
    height: 42px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    font-size: 14px;
}

.editPage-etapas-header-column {
    display: flex;
    width: 33%;
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
    width: 33%;
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
    left: 17px;
    top: 50%;
    transform: translateY(-50%);
    color: #212529;
    width: 12px;
}

.editPage-agendador {
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 100%;
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
    border: 1px solid #dee2e6;
    border-top: none;
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
    background-color: #007bff;
    text-transform: none;
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
    padding: 12px 10px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;
    font-size: 14px;
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
    padding: 0px 8px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
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

.editPage-scheduler-save {
    position: absolute;
    top: -4px;
    right: 0px;
    background-color: #86B94B;
    border: none;
}

.warn-Button {
    border-radius: 50%;
    width: 30px;
    height: 30px;
}

.editPage-step-config-body {
    padding: 20px;
    align-items: start;
    gap: 10px;
    border: 1px solid #dee2e6;
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #FFF;
}

.editPage-tabs-title-text {
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    font-size: 14px;
}

.editPage-enabled-checkbox-div {
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
    border: 1px solid #007bff;
    color: #007bff;
    border-right: none;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
}

.editPage-disabled-checkbox-div {
    border: 1px solid #6c757d;
    color: #6c757d;
    border-right: none;
}

.editPage-toast {
    width: 500px;
}

.editPage-toast-title {
    font-size: 16px;
    color: #6c757d;
    font-weight: bolder;
    width: 500px;
}

.editPage-empty-step {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 16px;
}

.editPage-periodicity-div {
    position: fixed;
    width: 369px;
    background-color: #fff;
    left: 15px;
    bottom: 28px;
    padding: 10px;
    z-index: 1;
    border-radius: 5px;
    border: 1px solid #dee2e6;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, .1);
    transition: 0.3s;
}

.editPage-periodicity-div-hidden {
    left: -375px;
}

.editPage-periodicity-x {
    :hover {
        cursor: pointer;
    }
}

</style>