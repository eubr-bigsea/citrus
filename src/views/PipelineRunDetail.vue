<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="mt-2">
                <h6 class="pretitle">
                    Execução #{{$route.params.id}}
                </h6>
                <h1>
                    Pipeline Teste 
                </h1> 
            </div>
            <div>
                <router-link v-if="$route.params.id"
                             :to="{name: 'pipelineRunsList'}"
                             class="btn btn-outline-primary d-print-none float-left btn-sm">
                    <font-awesome-icon icon="fa-chevron-left" />
                    &nbsp; {{$t('actions.back')}} -
                    {{$t('titles.pipelineRuns', 2)}}
                </router-link>
                <button class="btn btn-sm btn-outline-danger ml-2" @click="cancelRun">
                    <font-awesome-icon icon="fa fa-ban" class="" /> {{$t('actions.cancel')}}
                </button>
            </div>
        </div>

        <div class="body">
            <div class="page-container">
                <div class="left-container">
                    <div class="mb-4">
                        <div class="collapse-title">
                            Informações da Execução
                        </div>
                        <b-card class="infos">
                            <div class="infos-container">
                                <div class="d-flex flex-row">
                                    <div class="infos-left">
                                        Período
                                    </div>
                                    <div class="infos-right">
                                        01/04/2024 a <br> 08/04/2024
                                    </div>
                                </div>

                                <div class="d-flex flex-row">
                                    <div class="infos-left">
                                        Atualizado Em
                                    </div>
                                    <div class="infos-right">
                                        08/02/2025 16:02
                                    </div>
                                </div>

                                <div class="d-flex flex-row">
                                    <div class="infos-left">
                                        Status
                                    </div>
                                    <div class="infos-right">
                                        <div class="runDetail-status" :class="'completed'">
                                            COMPLETED
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-card>
                    </div>
                    <div>
                        <div class="collapse-title">
                            Etapas da Execução
                        </div>
                        <b-card class="steps-div scroll-area">
                            <div class="steps-div-container">
                                <div class="steps-header">
                                    <button id="popover-trigger" class="tab-button">
                                        <font-awesome-icon icon="info-circle" />
                                    </button>
                                    <b-popover target="popover-trigger" triggers="hover">
                                        Selecione uma das etapas abaixo para mostrar seus detalhes da execução.
                                    </b-popover>
                                    <div class="steps-header-column">
                                        Ordem
                                    </div>
                                    <div class="steps-header-column">
                                        Nome
                                    </div>
                                    <div class="steps-header-column">
                                        Tentativas
                                    </div>
                                    <div class="steps-header-column">
                                        Status
                                    </div>
                                    <div class="steps-header-column">
                                        Ações
                                    </div>
                                </div>
                                <div v-for="(step, index) in pipelineRunSteps" 
                                     :key="step.id" 
                                     class="steps-body" 
                                     :class="{'steps-body-selected': selectedStep.id === step.id}" 
                                     @click="setSelectedStep(step)">
                                    <div class="steps-column">
                                        # {{index + 1}}
                                    </div>
                                    <div class="steps-column">
                                        {{step.name}}
                                    </div>
                                    <div class="steps-column">
                                        {{step.retries}}
                                    </div>
                                    <div class="steps-column">
                                        <font-awesome-icon v-if="step.status == 'COMPLETED'" 
                                                           icon="check-circle"
                                                           class="text-success" 
                                                           title="Concluído" 
                                                           size="lg" />
                                        <font-awesome-icon v-if="step.status == 'ERROR'" 
                                                           icon="xmark-circle" 
                                                           class="text-danger" 
                                                           title="Erro" 
                                                           size="lg" />
                                        <font-awesome-icon v-if="step.status == 'CANCELED'" 
                                                           icon="ban" 
                                                           class="text-danger" 
                                                           title="Cancelado" 
                                                           size="lg" />
                                        <font-awesome-icon v-if="step.status == 'RUNNING'" 
                                                           icon="spinner" 
                                                           spin 
                                                           class="text-secondary" 
                                                           title="Executando" 
                                                           size="lg" />
                                        <font-awesome-icon v-if="step.status == 'PENDING'" 
                                                           icon="exclamation-circle" 
                                                           class="text-warning" 
                                                           title="Pendente" 
                                                           size="lg" />
                                    </div>
                                    
                                    <div class="steps-column">
                                        <div>
                                            <button class="btn btn-sm btn-primary" title="Executar">
                                                <font-awesome-icon icon="fa-play" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-card>
                    </div>
                </div>
                <div class="right-container">
                    <div class="right-container-body">
                        <div class="collapse-title">
                            Relatório da Execução
                        </div>
                        <b-card class="log-div scroll-area">
                            <div class="log-div-container">
                                <div v-for="(job, index) in orderedJobs" :key="index">
                                    <div>
                                        <b-card no-body>
                                            <div header-tag="header" class="p-0 collapse-header">
                                                <div v-b-toggle="index.toString()" class="collapse-button">
                                                    #{{selectedStep.retries - index}} Tentativa
                                                    <div class="d-flex align-items-center">
                                                        <font-awesome-icon v-if="job.status == 'COMPLETED'"
                                                                           icon="check-circle"
                                                                           class="text-success mr-3" 
                                                                           title="Concluído" 
                                                                           size="lg" />
                                                          
                                                        <font-awesome-icon v-if="job.status == 'ERROR'" 
                                                                           icon="xmark-circle" 
                                                                           class="text-danger mr-3" 
                                                                           title="Erro" 
                                                                           size="lg" />
                                                        <button class="advanced-info-button">
                                                            <font-awesome-icon icon="fa-info-circle" class="fa-sm" title="Mostrar Stack Trace" />
                                                        </button>
                                                        <font-awesome-icon icon="fa-chevron-down" />
                                                    </div>
                                                </div>
                                            </div>
                                            <b-collapse :id="index.toString()" :visible="index === 0">
                                                <b-card-body>
                                                    <div>Mar 25 20:10:01 localhost CRON[579]: (root) INFO (file cron)</div>
                                                    <div>Mar 25 20:10:02 localhost CRON[579]: Will run job 'cron.daily' in 5 min.</div>
                                                    <div>Mar 25 20:10:03 localhost CRON[579]: Will run job 'cron.weekly' in 15 min.</div>
                                                    <div>Mar 25 20:10:04 localhost CRON[579]: Will run job 'cron.monthly' in 25 min.</div>
                                                </b-card-body>
                                            </b-collapse>
                                        </b-card>
                                    </div>
                                </div>
                            </div>
                        </b-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pipelineRunSteps: [
                {
                    "id": 1,
                    "name": "Raw",
                    "created": "23/04/2023 04:04",
                    "updated": "18/04/2023 02:04",
                    "workflow_id": 3,
                    "comment": "dapibus quam quis diam. Pellentesque habitant morbi tristique senectus et",
                    "status": "PENDING",
                    "final_status": "INTERRUPTED",
                    "retries": 8,
                    "jobs": [
                        {
                            "id": 1,
                            "status": "ERROR"
                        },
                        {
                            "id": 2,
                            "status": "ERROR"
                        },
                        {
                            "id": 3,
                            "status": "ERROR"
                        },
                        {
                            "id": 4,
                            "status": "ERROR"
                        },
                        {
                            "id": 5,
                            "status": "ERROR"
                        },
                        {
                            "id": 6,
                            "status": "ERROR"
                        },
                        {
                            "id": 7,
                            "status": "ERROR"
                        },
                        {
                            "id": 8,
                            "status": "COMPLETED"
                        },
                    ]
                },
                {
                    "id": 2,
                    "name": "Stage",
                    "created": "18/07/2023 00:07",
                    "updated": "09/07/2024 19:07",
                    "workflow_id": 7,
                    "comment": "vel quam dignissim pharetra. Nam ac nulla. In tincidunt congue",
                    "status": "CANCELED",
                    "final_status": "WAITING",
                    "retries": 2,
                    "jobs": [
                        {
                            "id": 1,
                            "status": "ERROR"
                        },
                        {
                            "id": 2,
                            "status": "COMPLETED"
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "Dataset",
                    "created": "30/05/2023 01:05",
                    "updated": "30/09/2024 02:09",
                    "workflow_id": 5,
                    "comment": "ante lectus convallis est, vitae sodales nisi magna sed dui.",
                    "status": "COMPLETED",
                    "final_status": "WAITING",
                    "retries": 3,
                    "jobs": [
                        {
                            "id": 1,
                            "status": "ERROR"
                        },
                        {
                            "id": 2,
                            "status": "ERROR"
                        },
                        {
                            "id": 3,
                            "status": "COMPLETED"
                        }
                    ]
                },
                {
                    "id": 4,
                    "name": "MDM",
                    "created": "17/02/2025 10:02",
                    "updated": "15/06/2024 00:06",
                    "workflow_id": 8,
                    "comment": "malesuada ut, sem. Nulla interdum. Curabitur dictum. Phasellus in felis.",
                    "status": "RUNNING",
                    "final_status": "INTERRUPTED",
                    "retries": 5,
                    "jobs": [
                        {
                            "id": 1,
                            "status": "ERROR"
                        },
                        {
                            "id": 2,
                            "status": "ERROR"
                        },
                        {
                            "id": 3,
                            "status": "ERROR"
                        },
                        {
                            "id": 4,
                            "status": "ERROR"
                        },
                        {
                            "id": 5,
                            "status": "COMPLETED"
                        },
                    ]
                },
            ],
            selectedStep: null,
        };
    },
    computed: {
        orderedJobs() {
            if (this.selectedStep) {
                return this.selectedStep.jobs.slice().sort((a, b) => b.id - a.id);
            } else {
                return [];
            }
        },
    },
    mounted() {
        this.selectedStep = this.pipelineRunSteps[this.pipelineRunSteps.length - 1];
    },
    methods: {
        setSelectedStep(step) {
            this.selectedStep = step;
        },
        cancelRun() {
            console.log("Cancel Run.");
        }
    }
};

</script>

<style lang="scss" scoped>

.pretitle {
    color: black;
    font-family: sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.6px;
    margin-bottom: 0;
    padding: 0px 4px;
    text-transform: uppercase;
}

.body {
    display: flex;
    flex-direction: row;
    gap: 40px;
    padding-bottom: 20px;
}

.page-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 100%;
    height: 78vh;
}

.left-container {
    width: 50%;
    height: 78vh;
    gap: 20px;
}

.right-container {
    width: 50%;
    height: 78vh;
}

.right-container-body {
    max-height: 78vh;
}

.collapse-title {
    padding: 12px 16px;
    border-bottom: 1px solid #9c9c9c;
    background-color: #f8f9f9;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    position: relative;
}

.steps-div {
    border: 0px solid #dfdfdf;
    background-color: #f8f9f9;
    border-radius: 0px;
    height: 47vh;
    overflow: auto;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.infos {
    border: 0px;
    background-color: #f8f9f9;
    border-radius: 0px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.infos-container {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    justify-content: space-between;
}

.infos-left {
    color: black;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    border-right: 1px solid #9c9c9c;
    padding-right: 10px;
    display: flex;
    align-items: center;
}

.infos-right {
    padding-left: 10px;
    display: flex;
    align-items: center;
}

.steps-div-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-bottom: 20px;
}

.steps-header {
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

.steps-header-column {
    display: flex;
    width: 25%;
    justify-content: center;
}

.steps-body {
    display: flex;
    position: relative;
    justify-content: space-between;
    border: 2px solid #dfdfdf;
    padding: 10px 0px;
    background-color: #FFF;

    margin-bottom: -2px;
    border-radius: 4px;

    &:hover {
        cursor: pointer;
    }
}

.steps-body-selected {
    background-color: #eeeeee;
}

.steps-column {
    display: flex;
    width: 25%;
    justify-content: center;
    align-items: center;
    font-weight: 400;
}

.log-div {
    border: 0px;
    background-color: #f8f9f9;
    border-radius: 0px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    overflow: auto;
    height: 68vh;
}

.log-div-container {
    display: flex;
    flex-direction: column;
    // background-color: #f6f6f6;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.6px;
    color: #767676;
    text-align: justify;
    padding-bottom: 16px;
}

.collapse-header {
    background-color: transparent;
}

.collapse-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #eeeeee;
    color: black;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 500;
    padding: 12px 12px;
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
    border-radius: 0.2rem;

    &:hover {
        background-color: #dcdcdc;
    }
}

.advanced-info-button {
    margin-right: 15px;
    border: 0px;
    border-radius: 50%;
    background-color: transparent;
    color: black;

    &:hover {
        cursor: pointer;
        background-color: #b6b6b6;
    }
}

.tab-button {
    background-color: transparent;
    border: 0px;
    color: black;
    position: absolute;
    left: 5px;
    top: 8px;
}

</style>