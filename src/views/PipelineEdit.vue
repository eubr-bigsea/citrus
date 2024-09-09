<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="mt-2">
                <h6 class="header-pretitle">
                    Pipeline #{{ pipeline.id }}
                </h6>
                <h1>
                    <InputHeader v-model="pipeline.name" @input="isDirty = true" />
                </h1>
            </div>
            <div class="btn-group">
                <button class="btn btn-sm btn-outline-secondary float-left" @click="redirectToRuns">
                    <font-awesome-icon icon="fa fa-history" /> Histórico
                </button>
                <button class="btn btn-sm btn-outline-success" :disabled="!isDirty" @click="saveChanges">
                    <font-awesome-icon icon="fa fa-save" class="mr-1" /> {{ $tc('actions.save') }}
                </button>
            </div>
        </div>


        <div>
            <div class="editPage-container">
                <div class="w-25">
                    <h5>
                        Informações básicas
                    </h5>
                    <b-card class="editPage-infos">

                        <div class="d-flex flex-row">
                            <div class="font-weight-bold mr-2">
                                <div>Criado em:</div>
                                <div>Atualizado em:</div>
                            </div>
                            <div>
                                <div>{{ pipeline.created | formatJsonDate }}</div>
                                <div>{{ pipeline.updated | formatJsonDate }}</div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="font-weight-bold">Descrição:</span>
                            <textarea v-model="pipeline.description" @input="isDirty = true" rows="4"
                                class="form-control form-control-sm" />
                        </div>
                        <div class="mt-4">
                            <b-form-checkbox v-model="pipeline.enabled" class="d-flex align-items-center"
                                name="check-button" size="sm" switch @change="isDirty = true">
                                Habilitada
                            </b-form-checkbox>
                        </div>
                        <div class="mt-4" v-if="pipeline.periodicity">
                            <div>
                                <label class="font-weight-bold">Periodicidade da execução:</label>
                                <b-form-select v-model="pipeline.periodicity" class="mt-0" size="sm"
                                    @input="isDirty = true" :options="periodicityOptions" />
                            </div>
                            <div class="mt-2">
                                <div>
                                    <label class="font-weight-bold mr-2">
                                        Iniciar:
                                    </label>
                                    <input id="iniciar-data" v-model.number="pipeline.periodicity_start"
                                        class="form-control mr-auto form-control-sm w-75" type="number" max="31"
                                        min="1">
                                </div>
                                <div class="mt-2">
                                    <label class="font-weight-bold mr-2">
                                        Intervalo (opcional):
                                    </label>
                                    <input v-model.number="pipeline.periodicity_interval"
                                        class="form-control form-control-sm mr-auto w-75" type="number" min="0"
                                        max="30">
                                </div>
                            </div>
                        </div>
                    </b-card>
                </div>
                <div class="w-75">
                    <h5>
                        Etapas
                    </h5>
                    <b-card class="editPage-stepsDiv scroll-area">
                        <div class="editPage-collapse-div">
                            <div class="editPage-left-container">
                                <div class="editPage-etapas-header">
                                    <button id="popover-trigger" class="editPage-tab-button">
                                        <font-awesome-icon icon="info-circle" />
                                    </button>
                                    <b-popover target="popover-trigger" triggers="hover">
                                        Segure e arraste as etapas abaixo para reordená-las.
                                    </b-popover>
                                    <div class="editPage-etapas-header-column">
                                        Ordem
                                    </div>
                                    <div class="editPage-etapas-header-column">
                                        Nome
                                    </div>
                                    <div class="editPage-etapas-header-column">
                                        Ações
                                    </div>
                                </div>
                                <div v-if="pipeline.steps && pipeline.steps.length === 0" class="editPage-no-steps">
                                    Adicione etapas à sua pipeline
                                    <button class="ml-1 btn btn-sm btn-secondary" title="Adicionar etapa"
                                        @click="openAddStepModal(0)">
                                        <font-awesome-icon icon="plus" />
                                    </button>
                                </div>
                                <draggable v-model="pipeline.steps" :options="dragOptions" @end="onDragEnd">
                                    <div v-for="(step, index) in orderedPipelineSteps" :key="step.id"
                                        class="editPage-dragDiv"
                                        :class="{ 'editPage-dragDiv-selected': selectedStep.id === step.id }"
                                        @dragstart="onDragStart" @click="setSelectedStep(step, index)">
                                        <font-awesome-icon class="editPage-dragIcon" icon="fa fa-grip-vertical" />
                                        <div class="editPage-drag-column">
                                            # {{ index + 1 }}
                                        </div>
                                        <div class="editPage-drag-column" :class="ident">
                                            <span class="editPage-stepButton" @click="redirectToWorkflow(step)">
                                                {{ step.name }}
                                            </span>
                                        </div>
                                        <div class="editPage-drag-column">
                                            <div>
                                                <button class="ml-1 btn btn-sm btn-danger" title="Excluir etapa"
                                                    @click="deleteStep(step.id, step.name)">
                                                    <font-awesome-icon icon="trash" />
                                                </button>
                                                <button class="ml-1 btn btn-sm btn-secondary" title="Adicionar etapa"
                                                    @click="openAddStepModal(step.order)">
                                                    <font-awesome-icon icon="plus" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </draggable>
                                <ModalAddPipelineStep ref="addStepModal" :pipeline="pipeline"
                                    @onupdate-pipeline="updatePipeline" />
                            </div>

                            <div class="editPage-right-container">
                                <div v-if="pipelineWithoutSteps" class="w-100 h-100 d-flex justify-content-center">
                                    <b-card class="w-100 h-25 text-center p-5">
                                        <div class="editPage-empty-step ">
                                            Adicione etapas à sua pipeline para acessar suas informações de agendamento
                                            e configurações.
                                        </div>
                                    </b-card>
                                </div>
                                <b-tabs v-if="selectedStepIndex !== null" class="w-100" justified>
                                    <b-tab active>
                                        <template #title>
                                            <span class="editPage-tabs-title-text">
                                                Agendador
                                            </span>
                                        </template>
                                        <PipelineStepScheduler ref="stepScheduler" :selected-step="selectedStep"
                                            :selected-step-index="selectedStepIndex" :pipeline-id="pipeline.id"
                                            @send-scheduler-changes="schedulerUpdate" />
                                    </b-tab>
                                    <b-tab>
                                        <template #title>
                                            <span class="editPage-tabs-title-text">
                                                Configurações
                                            </span>
                                        </template>
                                        <EditPipelineStep ref="editStepModal" :edited-step="editedStep"
                                            :pipeline="pipeline" :selected-step-index="selectedStepIndex"
                                            @send-step-changes="schedulerUpdate" />
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
            pipelineWithoutSteps: false,
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
                { value: null, text: 'Selecione a periodicidade' },
                { value: 'daily', text: 'Diário' },
                { value: 'weekly', text: 'Semanal' },
                { value: 'monthly', text: 'Mensal' },
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
    created() {
        window.addEventListener('beforeunload', this.leaving);
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
            this.editPipeline('Pipeline editada com sucesso.');
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
            if (step.workflow === undefined) this.warning('Etapa não associada a um workflow.');
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
            this.$router.push(
                {
                    name: 'pipelineRunsList', query: {
                        id: this.pipeline.id, name: this.pipeline.name
                    }
                });
        },
        editPipeline(msg) {
            axios
                .patch(`${tahitiUrl}/pipelines/${this.pipeline.id}`, this.pipeline)
                .then((resp) => {
                    this.pipeline = resp.data.data[0];
                    if (this.pipeline.steps.length === 0) this.pipelineWithoutSteps = true;
                    this.success(msg);
                    this.isDirty = false;
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
                    if (!this.pipelineWithoutSteps) this.setSelectedStep(this.pipeline.steps[0], 0);
                    this.pipeline.steps = this.pipeline.steps.filter(step => step.id !== stepId);
                    this.selectedStepIndex = null;
                    this.editPipeline('Etapa excluída com sucesso.');
                }
            );
        },
    },
};

</script>

<style lang="scss">
.editPage-container {
    display: flex;
    flex-direction: row;
    gap: 16px;
    width: 100%;
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

.editPage-tabs-title-text {
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    font-size: 14px;
}

.editPage-empty-step {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 16px;
}
</style>
