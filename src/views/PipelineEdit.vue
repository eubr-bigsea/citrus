<template>
    <div>
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div class="mt-2">
                <h6 class="header-pretitle">
                    Pipeline #{{pipeline.id}}
                </h6>
                <h1>
                    <InputHeader v-model="pipeline.name" :maxlength="50" @input="isDirty = true; nameError = ''" />
                </h1>
                <div v-if="nameError" class="text-danger small" role="alert">
                    {{nameError}}
                </div>
            </div>

            <div class="d-flex align-items-center gap-2">
                <span v-if="isDirty" class="text-warning-emphasis small" role="status">
                    <font-awesome-icon icon="fa fa-circle" /> {{$t('pipeline.edit.unsaved')}}
                </span>
                <div class="btn-group">
                    <router-link :to="{ name: 'pipelines' }"
                                 class="btn btn-outline-secondary d-print-none btn-sm">
                        <font-awesome-icon icon="fa-chevron-left" />
                        {{$t('actions.back')}}
                    </router-link>
                    <button class="btn btn-sm btn-outline-secondary" @click="redirectToRuns">
                        <font-awesome-icon icon="fa fa-history" /> {{$t('common.history')}}
                    </button>
                    <button class="btn btn-sm btn-success" :disabled="!isDirty" @click="saveChanges">
                        <font-awesome-icon icon="fa fa-save" class="me-1" /> {{$t('actions.save')}}
                    </button>
                </div>
            </div>
        </div>

        <div class="row g-3">
            <div class="col-12 col-lg-4 col-xl-3">
                <h5>
                    {{$t('common.basicInformation')}}
                </h5>
                <b-card class="editPage-infos">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <b-form-checkbox v-model="pipeline.enabled" name="check-button" size="sm" switch
                                         @change="isDirty = true">
                            {{$t('common.enabled')}}
                        </b-form-checkbox>
                    </div>
                    <div class="mb-3">
                        <label for="identifier" class="form-label small fw-bold mb-1">{{$t('common.identifier')}}</label>
                        <input id="identifier" v-model="pipeline.identifier" type="text"
                               class="form-control form-control-sm" @input="isDirty = true">
                    </div>
                    <div class="mb-3">
                        <label for="pipeline-description" class="form-label small fw-bold mb-1">
                            {{$t('common.description')}}
                        </label>
                        <textarea id="pipeline-description" v-model="pipeline.description" rows="4"
                                  class="form-control form-control-sm" maxlength="200" @input="isDirty = true" />
                        <div class="form-text text-end">
                            {{(pipeline.description || '').length}}/200
                        </div>
                    </div>
                    <!-- Periodicity hidden for now
                    <div class="sidebar-section">
                        <label for="pipeline-periodicity" class="form-label small fw-bold mb-1">
                            <font-awesome-icon icon="fa fa-clock" class="text-secondary me-1" />
                            {{$t('pipeline.edit.executionPeriodicity')}}
                        </label>
                        <b-form-select id="pipeline-periodicity" v-model="pipeline.periodicity" size="sm"
                                       :options="periodicityOptions" @change="isDirty = true" />
                        <div v-if="pipeline.periodicity" class="row g-2 mt-1">
                            <div class="col-6">
                                <label for="pipeline-periodicity-start" class="form-label small mb-1">
                                    {{$t('pipeline.edit.periodicityStart')}}
                                </label>
                                <input id="pipeline-periodicity-start" v-model.number="pipeline.periodicity_start"
                                       class="form-control form-control-sm" type="number" max="31" min="1"
                                       @input="isDirty = true">
                            </div>
                            <div class="col-6">
                                <label for="pipeline-periodicity-interval" class="form-label small mb-1">
                                    {{$t('pipeline.edit.periodicityIntervalOptional')}}
                                </label>
                                <input id="pipeline-periodicity-interval" v-model.number="pipeline.periodicity_interval"
                                       class="form-control form-control-sm" type="number" min="0" max="30"
                                       @input="isDirty = true">
                            </div>
                        </div>
                    </div>
                    -->
                    <dl class="row small text-muted mb-0 sidebar-section">
                        <dt class="col-5 fw-normal">
                            {{$t('common.created')}}
                        </dt>
                        <dd class="col-7 mb-1">
                            {{$filters.formatJsonDate(pipeline.created)}}
                        </dd>
                        <dt class="col-5 fw-normal">
                            {{$t('common.updated')}}
                        </dt>
                        <dd class="col-7 mb-0">
                            {{$filters.formatJsonDate(pipeline.updated)}}
                        </dd>
                    </dl>
                </b-card>
            </div>
            <div class="col-12 col-lg-8 col-xl-9">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0">
                        {{$t('pipeline.step', 2)}}
                        <span class="badge text-bg-secondary steps-count">{{orderedPipelineSteps.length}}</span>
                    </h5>
                    <button class="btn btn-sm btn-primary" @click="openAddStepModal(orderedPipelineSteps.length)">
                        <font-awesome-icon icon="plus" /> {{$t('pipeline.edit.addStep')}}
                    </button>
                </div>
                <b-card class="editPage-stepsDiv">
                    <div class="row g-3">
                        <div class="col-12 col-xl-5">
                            <div v-if="pipeline.steps && pipeline.steps.length === 0" class="editPage-no-steps">
                                {{$t('pipeline.edit.addStepsToPipeline')}}
                            </div>
                            <div v-else class="form-text mb-2">
                                <font-awesome-icon icon="info-circle" /> {{$t('pipeline.template.holdAndDragSteps')}}
                            </div>
                            <draggable v-model="pipeline.steps" handle=".step-handle" @end="onDragEnd">
                                <div v-for="(step, index) in orderedPipelineSteps" :key="step.id"
                                     class="step-row" :class="{ selected: selectedStep.id === step.id }"
                                     tabindex="0" role="button" @dragstart="onDragStart"
                                     @click="setSelectedStep(step, index)"
                                     @keydown.enter.self="setSelectedStep(step, index)">
                                    <font-awesome-icon class="step-handle" icon="fa fa-grip-vertical"
                                                       :title="$t('pipeline.edit.dragHandle')" />
                                    <span class="step-order">{{index + 1}}</span>
                                    <div class="step-main">
                                        <div class="step-name text-truncate">
                                            {{step.name}}
                                        </div>
                                        <div v-if="step.workflow && step.workflow.id" class="step-workflow text-muted text-truncate">
                                            <font-awesome-icon icon="fa fa-flask" />
                                            {{step.workflow.type}} · #{{step.workflow.id}} {{step.workflow.name}}
                                        </div>
                                        <div v-else class="step-workflow text-warning-emphasis">
                                            <font-awesome-icon icon="fa fa-exclamation-triangle" />
                                            {{$t('pipeline.edit.noWorkflow')}}
                                        </div>
                                    </div>
                                    <div class="step-actions">
                                        <button type="button" class="btn btn-sm btn-link text-secondary"
                                                :title="$t('pipeline.edit.insertStepAfter')"
                                                :aria-label="$t('pipeline.edit.insertStepAfter')"
                                                @click.stop="openAddStepModal(step.order)">
                                            <font-awesome-icon icon="plus" />
                                        </button>
                                        <button type="button" class="btn btn-sm btn-link text-secondary step-delete"
                                                :title="$t('pipeline.edit.deleteStep')"
                                                :aria-label="$t('pipeline.edit.deleteStep')"
                                                @click.stop="deleteStep(step.id, step.name)">
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                    </div>
                                </div>
                            </draggable>
                            <ModalAddPipelineStep ref="addStepModal" :pipeline="pipeline" :step-order="stepOrder"
                                                  @onadd-step="addStep" />
                        </div>

                        <div class="col-12 col-xl-7">
                            <div v-if="pipelineWithoutSteps" class="w-100 d-flex justify-content-center">
                                <b-card class="w-100 text-center p-5">
                                    <div class="editPage-empty-step">
                                        {{$t('pipeline.edit.addStepsToAccess')}}
                                    </div>
                                </b-card>
                            </div>
                            <template v-if="selectedStepIndex !== null">
                                <div class="card mb-3" :class="{ 'border-warning': !hasWorkflow(selectedStep) }">
                                    <div class="card-body d-flex align-items-center gap-3">
                                        <font-awesome-icon :icon="hasWorkflow(selectedStep) ? 'fa fa-flask' : 'fa fa-exclamation-triangle'"
                                                           size="lg"
                                                           :class="hasWorkflow(selectedStep) ? 'text-secondary' : 'text-warning-emphasis'" />
                                        <div class="flex-grow-1 text-truncate">
                                            <template v-if="hasWorkflow(selectedStep)">
                                                <div class="small text-muted">
                                                    {{$t('pipeline.edit.settings.stepLinkedToWorkflow')}}
                                                </div>
                                                <strong>#{{selectedStep.workflow.id}} - {{selectedStep.workflow.name}}</strong>
                                                <span class="text-muted"> · {{selectedStep.workflow.type}}</span>
                                            </template>
                                            <template v-else>
                                                <strong>{{$t('pipeline.edit.noWorkflow')}}</strong>
                                                <div class="small text-muted">
                                                    {{$t('pipeline.edit.noWorkflowHint')}}
                                                </div>
                                            </template>
                                        </div>
                                        <button v-if="hasWorkflow(selectedStep)" type="button"
                                                class="btn btn-sm btn-outline-secondary flex-shrink-0"
                                                @click="openWorkflow(selectedStep)">
                                            {{$t('pipeline.edit.openWorkflow')}}
                                        </button>
                                    </div>
                                </div>
                                <b-tabs class="w-100" nav-class="pipeline-tabs" content-class="pipeline-tab-content">
                                    <b-tab active>
                                        <template #title>
                                            <span class="editPage-tabs-title-text">
                                                <font-awesome-icon icon="fa fa-cog" class="me-1" />
                                                {{$t('pipeline.edit.settingsLabel')}}
                                            </span>
                                        </template>
                                        <EditPipelineStep ref="editStepModal" :edited-step="editedStep"
                                                          :pipeline="pipeline" :selected-step-index="selectedStepIndex"
                                                          @update-step="schedulerUpdate" />
                                    </b-tab>
                                    <b-tab>
                                        <template #title>
                                            <span class="editPage-tabs-title-text">
                                                <font-awesome-icon icon="fa fa-calendar-alt" class="me-1" />
                                                {{$t('pipeline.edit.schedulerLabel')}}
                                            </span>
                                        </template>
                                        <PipelineStepScheduler ref="stepScheduler" :selected-step="selectedStep"
                                                               :selected-step-index="selectedStepIndex" :pipeline-id="pipeline.id"
                                                               @update-step="schedulerUpdate" />
                                    </b-tab>
                                </b-tabs>
                            </template>
                        </div>
                    </div>
                </b-card>
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
import { VueDraggableNext } from 'vue-draggable-next';
import InputHeader from '../components/InputHeader.vue';
import Notifier from '../mixins/Notifier.js';
import { reorder } from '../util.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        draggable: VueDraggableNext,
        InputHeader,
        EditPipelineStep,
        ModalAddPipelineStep,
        PipelineStepScheduler,
    },
    mixins: [PipelineEditMixin, Notifier],
    beforeRouteLeave(to, from, next) {
        if (this.isDirty) {
            next(confirm(this.$t('warnings.dirtyCheck')) ? undefined : false);
        } else {
            next();
        }
    },
    data() {
        return {
            pipeline: {},
            pipelineWithoutSteps: false,
            isDirty: false,
            nameError: '',
            selectedStep: {},
            selectedStepIndex: null,
            editedStep: { id: null, name: '', description: '', workflow: {} },
            stepOrder: null,
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
        }
    },
    created() {
        window.addEventListener('beforeunload', this.leaving);
    },
    unmounted() {
        window.removeEventListener('beforeunload', this.leaving);
    },
    async mounted() {
        this.load();
    },
    methods: {
        async load() {
            this.$Progress.start();
            try {
                const resp = await axios
                    .get(`${tahitiUrl}/pipelines/${this.$route.params.id}`);
                this.$Progress.finish();
                this.pipeline = resp.data.data[0];
                this.pipeline.steps.sort((a, b) => a.order - b.order);
                if (this.pipeline.steps.length !== 0) {
                    this.setSelectedStep(this.pipeline.steps[0], 0);
                } else {
                    this.pipelineWithoutSteps = true;
                }
            } catch (e) {
                this.$Progress.finish();
                this.error(e);
            }
        },
        saveChanges() {
            if (!this.pipeline.name?.trim()) {
                this.nameError = this.$t('pipeline.edit.nameRequired');
                return;
            }
            this.editPipeline(this.$t('messages.savedWithSuccess', { what: this.$t('titles.pipeline', 1) }));
        },
        hasWorkflow(step) {
            return Boolean(step.workflow && step.workflow.id);
        },
        openWorkflow(step) {
            // leaving with unsaved changes is confirmed by beforeRouteLeave
            const name = step.workflow.type === 'DATA_EXPLORER' ? 'data-explorer-panel' : 'sql-workflow';
            this.$router.push({ name, params: { id: step.workflow.id } });
        },
        openAddStepModal(stepOrder) {
            this.$refs.addStepModal.show();
            this.stepOrder = stepOrder;
        },
        addStep(newStep, stepOrder) {
            this.pipeline.steps.sort((a, b) => a.order - b.order);
            newStep.order = stepOrder;
            this.pipeline.steps.splice(stepOrder, 0, newStep);
            //updates steps after adding a new step to ensure the order is correct
            this.pipeline.steps.forEach((step, index) => {
                step.order = index + 1;
            });
            this.editPipeline(this.$t('pipeline.edit.stepAdded'));
        },
        setSelectedStep(step, index) {
            this.editedStep.id = step.id;
            this.editedStep.name = step.name;
            this.editedStep.description = step.description;
            this.editedStep.workflow = step.workflow;
            this.selectedStep = step;
            this.selectedStepIndex = index;
        },
        onDragStart() {
            this.isDirty = true;
        },
        onDragEnd(event) {
            reorder(this.pipeline.steps);
            this.isDirty = true;
        },
        updatePipeline(pipelineData) {
            this.pipeline = pipelineData;
            this.pipelineWithoutSteps = false;
            this.setSelectedStep(this.pipeline.steps[this.pipeline.steps.length - 1], this.pipeline.steps.length - 1);
        },
        schedulerUpdate(childData) {
            this.isDirty = true;
            const foundStep = this.selectedStep;
            Object.assign(foundStep, childData);
        },
        leaving(event) {
            if (this.isDirty) {
                event.preventDefault();
                event.returnValue = false;
            }
        },
        redirectToRuns() {
            this.$router.push(
                {
                    name: 'pipelineRunsList', query: {
                        id: this.pipeline.id, name: this.pipeline.name
                    }
                });
        },
        async editPipeline(msg) {
            this.pipeline.steps.sort((a, b) => a.order - b.order);
            try {
                const resp = await axios.patch(`${tahitiUrl}/pipelines/${this.pipeline.id}`, this.pipeline);
                this.pipeline = resp.data.data[0];
                if (this.pipeline.steps.length === 0) this.pipelineWithoutSteps = true;
                this.success(msg);
                this.isDirty = false;
            } catch (e) {
                this.error(e);
            }
        },
        deleteStep(stepId, stepName) {
            this.confirm(
                this.$t('actions.delete') + " '" + stepName + "'",
                this.$t('pipeline.edit.confirmDeleteStep'),
                () => {
                    this.pipeline.steps = this.pipeline.steps.filter(step => step.id !== stepId);
                    this.selectedStepIndex = null;
                    this.editPipeline(this.$t('pipeline.edit.stepDeleted'));
                }
            );
        },
    },
};

</script>

<style lang="scss">
.editPage-stepsDiv {
    border: 0;
    background-color: #f8f9f9;
    border-radius: 5px;
    min-height: 500px;
}

.steps-count {
    font-size: 0.65rem;
    vertical-align: middle;
}

.sidebar-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
}

.editPage-infos {
    border: 0px;
    background-color: #f8f9f9;
    border-radius: 0px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
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

.editPage-no-steps {
    display: flex;
    border: 2px solid #dfdfdf;
    padding: 15px 0px;
    background-color: #FFF;
    font-weight: 700;
    justify-content: center;
    align-items: center;
}

.editPage-dragIcon {
    position: absolute;
    left: 17px;
    top: 50%;
    transform: translateY(-50%);
    color: #212529;
    width: 12px;
}

.step-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0.75rem;
    margin-bottom: 0.4rem;
    background: #fff;
    border: 1px solid #dfdfdf;
    border-left: 4px solid transparent;
    border-radius: 4px;
    cursor: pointer;
}

.step-row:hover,
.step-row:focus-visible {
    border-color: #adb5bd;
    outline: none;
}

.step-row.selected {
    background: #eef3fb;
    border-left-color: #0d6efd;
}

.step-handle {
    flex: none;
    color: #6c757d;
    cursor: grab;
}

.step-order {
    flex: none;
    min-width: 1.6rem;
    padding: 0.1rem 0.4rem;
    border-radius: 1rem;
    background: #e9ecef;
    color: #343a40;
    font-size: 0.8rem;
    font-weight: 700;
    text-align: center;
}

.step-main {
    flex: 1 1 auto;
    min-width: 0;
}

.step-name {
    font-weight: 700;
}

.step-workflow {
    font-size: 0.8rem;
}

.step-actions {
    flex: none;
    display: flex;
}

.step-actions .step-delete {
    opacity: 0.45;
}

.step-row:hover .step-delete,
.step-row:focus-within .step-delete {
    opacity: 1;
    color: #b02a37 !important;
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

/* the frame comes from .pipeline-tab-content */
.editPage-agendador-body {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
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

.editPage-tabs-title-text {
    font-weight: 600;
    font-size: 0.9rem;
}

.pipeline-tabs {
    gap: 0.25rem;
    border-bottom: 1px solid #dee2e6;
}

.pipeline-tabs .nav-link {
    padding: 0.5rem 1rem;
    border: 0;
    border-bottom: 3px solid transparent;
    border-radius: 0;
    background: transparent;
    color: #495057;
}

.pipeline-tabs .nav-link:hover,
.pipeline-tabs .nav-link:focus-visible {
    border-bottom-color: #adb5bd;
    color: #212529;
}

.pipeline-tabs .nav-link.active {
    border-bottom-color: #0d6efd;
    color: #0d6efd;
}

.pipeline-tab-content {
    padding: 1rem;
    background: #fff;
    border: 1px solid #dee2e6;
    border-top: 0;
    border-radius: 0 0 5px 5px;
}

.editPage-empty-step {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 16px;
}
</style>
