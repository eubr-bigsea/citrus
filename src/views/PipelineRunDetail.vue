<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="mt-2">
                <h6 class="pretitle">
                    Execução #{{pipelineRunId}}
                </h6>
                <h1 v-if="pipelineRun">
                    <span class="pipeline-runs-status" :class="pipelineRun.status.toLowerCase()">
                        <font-awesome-icon v-if="pipelineRun.status === 'RUNNING'" icon="fa fa-refresh" spin />
                        {{$t(`status.${pipelineRun.status}`)}}
                    </span> <span class="ml-2">{{pipelineRun.pipeline_name}}</span>
                </h1>
            </div>
            <div>
                <router-link v-if="true || pipelineRunId" :to="{ name: 'pipelineRunsList' }"
                             class="btn btn-outline-secondary d-print-none float-left btn-sm">
                    <font-awesome-icon icon="fa-chevron-right" />
                    {{$t('actions.back', 2)}}
                </router-link>
                <button v-if="pipelineRun.status !== 'CANCELED'" class="btn btn-sm btn-outline-danger ml-2"
                        @click="cancelRun">
                    <font-awesome-icon icon="fa fa-ban" class="" /> {{$t('actions.cancel')}}
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-2">
                <div class="border p-3">
                    <label class="font-weight-bold">
                        {{$t('common.period')}}:
                    </label>
                    <span>
                        {{pipelineRun.start | formatJsonDate('dd/MM/yyyy')}} a

                        {{pipelineRun.finish | formatJsonDate('dd/MM/yyyy')}}
                    </span>
                    <br>
                    <label class="font-weight-bold">
                        {{$t('common.updated')}}:
                    </label>
                    <span>
                        {{pipelineRun.updated | formatJsonDate}}
                    </span>
                </div>
                <div class="border p-2 mt-2">
                    <h6>Notificações</h6>
                    <pipeline-run-notifications :notifications="notifications" height="61vh" />
                </div>
            </div>
            <div class="col-5">
                <b-card :header="$t('pipeline.step', 2)" no-body>
                    <b-card-body class="pipeline-run-steps scroll-area">
                        <button id="popover-trigger" class="btn btn-sm text-info">
                            <font-awesome-icon icon="info-circle" />
                        </button>
                        <b-popover target="popover-trigger" triggers="hover">
                            Selecione uma das etapas abaixo para mostrar seus detalhes da execução.
                        </b-popover>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th> Ordem </th>
                                    <th> {{$t('common.name')}} </th>
                                    <th class="text-center">
                                        Tentativas
                                    </th>
                                    <th class="text-center">
                                        {{$t('common.status')}}
                                    </th>
                                    <th class="text-center">
                                        {{$t('common.action', 2)}}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(step, index) in pipelineRun.steps" :key="step.id" class="steps-body"
                                    :class="{ 'table-selected': selectedStep.id === step.id }"
                                    role="button" @click="setSelectedStep(step)">
                                    <td>
                                        # {{index + 1}}
                                    </td>
                                    <td>
                                        {{step.name}}
                                    </td>
                                    <td class="text-center">
                                        {{step.jobs.length}}
                                    </td>
                                    <td class="text-center">
                                        <div :class="step.status.toLowerCase()"
                                             class="pipeline-runs-status status-small">
                                            <font-awesome-icon v-if="step.status === 'RUNNING'" icon="fa fa-refresh"
                                                               spin />
                                            {{$t(`status.${step.status}`)}}
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <div>
                                            <button class="btn btn-sm btn-primary" :title="$t('actions.execute')"
                                                    @click="execute(step.id, step.name)">
                                                <font-awesome-icon icon="fa-play" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-card-body>
                </b-card>
            </div>
            <div class="col-5">
                <b-card :header="`Relatório de Execução - Etapa #${selectedStep.order}  -${selectedStep.name}`" no-body>
                    <b-card-body class="scroll-area execution-report">
                        <div v-for="(job, index) in orderedJobs" :key="index" class="mb-3 border-left border-info pl-2">
                            <div v-b-toggle="`collapse-${index.toString()}`" class="d-flex">
                                <div class="text-start font-weight-bold">
                                    Tentativa #{{orderedJobs.length - index}}
                                </div>
                                <div class="flex-grow-1 d-flex justify-content-end" role="button">
                                    <div :class="job.status.toLowerCase()"
                                         class="pipeline-runs-status small text-right">
                                        <font-awesome-icon v-if="job.status === 'RUNNING'" icon="fa fa-refresh" spin />
                                        {{$t(`status.${job.status}`)}}
                                    </div>
                                    <div v-if="job.steps && job.steps.length">
                                        <font-awesome-icon icon="fa-chevron-down" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="p-2 small">
                                    Início: {{job.started | formatJsonDate('dd/MM/yyyy HH:mm:ss')}}
                                    <span v-if="job.finished">
                                        | Fim: {{job.finished | formatJsonDate('dd/MM/yyyy HH:mm:ss')}} |
                                        Tempo:
                                        {{job.finished | elapsedMinutes(job.started)}}:{{job.finished |
                                            elapsedSeconds(job.started)}}
                                    </span>
                                </div>

                                <b-collapse v-if="job.steps && job.steps.length" :id="`collapse-${index.toString()}`"
                                            :visible="index === 0">
                                    <div v-for="step, counter_step in job.steps" :key="counter_step"
                                         class="border-bottom mb-3 pl-4 job-step">
                                        <div class="flex-grow-1 d-flex justify-content-start">
                                            <h6>
                                                Tarefa #{{counter_step + 1}}: <span class="font-weight-normal">{{step.operation.name}}</span>
                                            </h6>
                                            <!--
                                        <span class="pipeline-runs-status" :class="step.status.toLowerCase()">
                                            <font-awesome-icon v-if="step.status === 'RUNNING'"
                                                icon="fa fa-refresh" spin />
                                            {{ $t(`status.${step.status}`) }}
                                        </span>
                                    -->
                                        </div>
                                        <div v-for="log, counter_log in step.logs" :key="counter_log">
                                            <span v-if="log.type === 'TEXT'">
                                                {{log.message}}
                                            </span>
                                            <span v-else-if="log.type === 'HTML'" v-html="log.message" />
                                            <span v-else-if="log.type === 'OBJECT'">
                                                {{log.message}}
                                            </span>
                                            <span v-else-if="log.type === 'USER'" class="text-info">
                                                {{log.message}}
                                            </span>
                                        </div>
                                    </div>
                                    <code v-if="job.exception_stack">
                                        <pre>
                                                {{job.exception_stack}}
                                            </pre>
                                    </code>
                                </b-collapse>
                            </div>
                        </div>
                    </b-card-body>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, computed, onBeforeMount, onUnmounted, onMounted } from 'vue';
import useNotifier from '@/composables/useNotifier.js';
import { useWebSocket } from '@/composables/websocket.js';
import PipelineRunNotifications from '@/components/PipelineRunNotifications.vue';

import axios from 'axios';

const standUrl = import.meta.env.VITE_STAND_URL;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;

const vm = getCurrentInstance();

const { confirm, success, error } = useNotifier(vm.proxy);
const router = vm.proxy.$router;

const route = vm.proxy.$route;

const { connectWebSocket, disconnectWebSocket, joinRoom } = useWebSocket();
const notifications = ref([]);
let currentState = null;
onBeforeMount(async () => {
    pipelineRunId.value = (route) ? route.params.id : 0;
    await load();
});
onUnmounted(() => {
    disconnectWebSocket();
});
onMounted(() => {
    const eventHandlers = {
        'connect': () => {
            joinRoom('pipeline_runs', true);
        },
        'update pipeline run': async (msg) => {
            if (msg.message === 'status') {
                pipelineRun.value.status = msg.value;
            } else {
                notifications.value.unshift({
                    id: msg.pipeline_run.id,
                    status: msg.pipeline_step_run.status, date: msg.date,
                    order: msg.pipeline_step_run.order
                });
                notifications.value.length = notifications.value.length > 100 ? 100
                    : notifications.value.length;
                if (!msg.cache) {
                    if (currentState != msg.job.status) {
                        await load();
                    }
                    currentState = msg.job.status;
                }
            }
        },
    };
    connectWebSocket(standSocketServer, standNamespace, standSocketIoPath,
        eventHandlers);
});
router.beforeEach(function (to, from, next) {
    if (!isDirty.value || (confirm(confirmMsg))) {
        isDirty.value = false;
        next();
    } else {
        next(false);
    }
});
const isDirty = ref(false);
const selectedStep = ref({ jobs: [] });

const orderedJobs = computed(() => {
    if (selectedStep.value) {
        return selectedStep.value.jobs.slice().sort((a, b) => b.id - a.id);
    } else {
        return [];
    }
}
);

const pipelineRunId = ref(0);

const progress = vm.proxy.$Progress;
const pipelineRun = ref({ status: '' });
// Methods
const execute = async (id, name) => {
    const callback = async (result) => {
        if (result){
            const url = `${standUrl}/pipeline-runs/execute`;
            const payload = {
                id,
                variables: '{}'
            };
            try {
                const resp = await axios.post(url, payload);
                success('Execução disparada com sucesso!');
            } catch (e) {
                error(e);
                router.push({ name: 'pipelineRunsList' });
            }
        }
    };
    confirm('Executar', `Executar etapa "${name}"?`, callback);
};
const load = async () => {
    progress.start();
    try {
        const resp = await axios.get(`${standUrl}/pipeline-runs/${pipelineRunId.value}`);
        pipelineRun.value = resp.data.data[0];
        if (pipelineRun.value.steps.length) {
            selectedStep.value = pipelineRun.value.steps[pipelineRun.value.steps.length - 1];
        }
    } catch (e) {
        error(e);
        router.push({ name: 'pipelineRunsList' });
    } finally {
        Vue.nextTick(() => {
            progress.finish();
            isDirty.value = false;
        });
    }
};
const setSelectedStep = (step) => {
    selectedStep.value = step;
};
const cancelRun = () => {
    const callback = async (result) => {
        try {
            pipelineRun.value.status = 'CANCELED';
            const resp = await axios.patch(
                `${standUrl}/pipeline-runs/${pipelineRunId.value}/status/CANCELED`);
            success(resp.data.message);
        } catch (e) {
            error(e);
        }
    };
    confirm('Cancelar execução', 'Você quer realmente cancelar esta execução?',
        callback);
};

</script>

<style lang="scss" scoped>
.status-small {
    font-size: 8pt;
}

.execution-report,
.pipeline-run-steps {
    height: 75vh;
    overflow-y: scroll;
}

.table-selected {
    background: #f9f9f9;
    font-weight: bold
}

.notifications {
    height: 66vh;
    overflow-y: scroll;
}

.job-step {
    font-size: 9pt;
}
</style>