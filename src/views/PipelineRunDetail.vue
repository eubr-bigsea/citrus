<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="mt-2">
                <h6 class="pretitle">
                    Execução #{{ pipelineRunId }}
                </h6>
                <h1 v-if="pipelineRun">
                    <span class="pipeline-runs-status" :class="pipelineRun.status.toLowerCase()">
                        <font-awesome-icon v-if="pipelineRun.status === 'RUNNING'" icon="fa fa-refresh" spin />
                        {{ $t(`status.${pipelineRun.status}`) }}
                    </span> <span class="ms-2">{{ pipelineRun.pipeline_name }}</span>
                </h1>
            </div>
            <div>
                <router-link v-if="true || pipelineRunId" :to="{ name: 'pipelineRunsList' }"
                    class="btn btn-outline-secondary d-print-none float-start btn-sm">
                    <font-awesome-icon icon="fa-chevron-right" />
                    {{ $t('actions.back', 2) }}
                </router-link>
                <button v-if="pipelineRun.status !== 'CANCELED'" class="btn btn-sm btn-outline-danger ms-2"
                    @click="cancelRun">
                    <font-awesome-icon icon="fa fa-ban" class="" /> {{ $t('actions.cancel') }}
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-2">
                <div class="border p-3">
                    <label class="font-weight-bold">
                        {{ $t('common.period') }}:
                    </label>
                    <span>
                        {{ $filters.formatJsonDate(pipelineRun.start, 'dd/MM/yyyy') }} a
                        {{ $filters.formatJsonDate(pipelineRun.finish, 'dd/MM/yyyy') }}
                    </span>
                    <br>
                    <label class="font-weight-bold">
                        {{ $t('common.updated') }}:
                    </label>
                    <span>
                        {{ $filters.formatJsonDate(pipelineRun.updated) }}
                    </span>
                    <div class="variables-header mt-2">
                        <strong>{{ $t('pipeline.schedule.contextData') }}</strong>
                        <button class="btn btn-sm btn-outline-primary" :title="$t('pipeline.schedule.addContextData')"
                            @click="openVariableEditor()">
                            <font-awesome-icon icon="plus" />
                            {{$t('pipeline.schedule.addContextData')}}
                        </button>
                    </div>
                    <div v-if="showVariables" class="context-data">
                        <table class="table table-sm table-smallest mb-0">
                            <thead>
                                <tr>
                                    <th>{{$t('pipeline.schedule.contextName')}}</th>
                                    <th>{{$t('pipeline.schedule.contextValue')}}</th>
                                    <th class="text-end">{{$t('common.action', 2)}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="vr in pipelineRun.context_data || []" :key="vr.name">
                                    <td class="variable-name">{{vr.name}}</td>
                                    <td class="variable-value">{{vr.value}}</td>
                                    <td class="text-end variable-actions">
                                        <button class="btn btn-sm btn-light" :title="$t('actions.edit')"
                                            @click="openVariableEditor(vr)">
                                            <font-awesome-icon icon="pen" />
                                        </button>
                                        <button class="btn btn-sm btn-light text-danger" :title="$t('actions.delete')"
                                            @click="removeVariable(vr)">
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="!pipelineRun.context_data?.length">
                                    <td colspan="3" class="text-muted text-center">
                                        {{$t('pipeline.schedule.noContextData')}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="border p-2 mt-2">
                    <h6>{{$t('titles.notification', 2)}}</h6>
                    <pipeline-run-notifications ref="notificationsRef"
                        :height="showVariables ? '45.5vh' : '63.3vh'" />
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
                        <table class="table text-center table-striped table-sm">
                            <thead>
                                <tr>
                                    <th> Ordem </th>
                                    <th> {{ $t('common.name') }} </th>
                                    <th class="text-center">
                                        Tentativas
                                    </th>
                                    <th class="text-center">
                                        {{ $t('common.status') }}
                                    </th>
                                    <th class="text-center">
                                        {{ $t('common.action', 2) }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(step, index) in pipelineRun.steps" :key="step.id"
                                    class="steps-body text-center"
                                    :class="{ 'table-selected': selectedStep.id === step.id }" role="button"
                                    @click="setSelectedStep(step)">
                                    <td>
                                        # {{ index + 1 }}
                                    </td>
                                    <td>
                                        {{ step.name }}
                                    </td>
                                    <td class="text-center">
                                        {{ step.jobs.length }}
                                    </td>
                                    <td class="text-center">
                                        <div :class="step.status.toLowerCase()"
                                            class="pipeline-runs-status status-small">
                                            <font-awesome-icon v-if="step.status === 'RUNNING'" icon="fa fa-refresh"
                                                spin />
                                            {{ $t(`status.${step.status}`) }}
                                        </div>
                                    </td>
                                    <td>
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
                        <div v-for="(job, index) in orderedJobs" :key="index" class="mb-3 border-left border-info ps-2">
                            <div v-b-toggle="`collapse-${index.toString()}`" class="d-flex">
                                <div class="text-start font-weight-bold">
                                    Tentativa #{{ orderedJobs.length - index }}
                                </div>
                                <div class="flex-grow-1 d-flex justify-content-end" role="button">
                                        <div :class="job.status.toLowerCase()"
                                            class="pipeline-runs-status small text-end">
                                            <font-awesome-icon v-if="job.status === 'RUNNING'" icon="fa fa-refresh" spin />
                                            {{ $t(`status.${job.status}`) }}
                                        </div>
                                        <div v-if="job.steps && job.steps.length">
                                            <font-awesome-icon icon="fa-chevron-down" />
                                        </div>
                                        <button type="button"
                                            class="btn btn-sm btn-outline-secondary ms-2"
                                            @click.stop="toggleJobLogs(job.id)">
                                            {{ $t('actions.view') }} {{ $t('job.logs', 2) }}
                                        </button>
                                    </div>
                                </div>
                            <div>
                                <div class="p-2 small">
                                    Início: {{ $filters.formatJsonDate(job.started, 'dd/MM/yyyy HH:mm:ss') }}
                                    <span v-if="job.finished">
                                        | Fim: {{ $filters.formatJsonDate(job.finished, 'dd/MM/yyyy HH:mm:ss') }} |
                                        Tempo:
                                        {{ $filters.elapsedMinutes(job.finished, job.started) }}:{{
                                            $filters.elapsedSeconds(job.finished, job.started) }}
                                    </span>
                                </div>

                                <b-collapse v-if="job.steps && job.steps.length" :id="`collapse-${index.toString()}`"
                                    :visible="index === 0">
                                    <div v-for="step, counter_step in job.steps" :key="counter_step"
                                        class="border-bottom mb-3 ps-4 job-step">
                                        <div class="flex-grow-1 d-flex justify-content-start">
                                            <h6>
                                                Tarefa #{{ counter_step + 1 }}: <span class="font-weight-normal">{{
                                                    step.operation.name }}</span>
                                            </h6>
                                            <!--
                                        <span class="pipeline-runs-status" :class="step.status.toLowerCase()">
                                            <font-awesome-icon v-if="step.status === 'RUNNING'"
                                                icon="fa fa-refresh" spin />
                                            {{ $t(`status.${step.status}`) }}
                                        </span>
                                    -->
                                        </div>
                                    </div>
                                </b-collapse>
                            </div>
                            <div v-if="isJobLogsVisible(job.id)" class="execution-logs mt-2">
                                <template v-if="hasJobLogs(job)">
                                    <div v-for="step, counter_step in job.steps" :key="counter_step"
                                        class="job-log-step border-start border-info ps-2 mb-3">
                                        <div class="fw-bold mb-1">
                                            {{ step.operation.name }}
                                        </div>
                                        <div v-for="log, counter_log in step.logs" :key="counter_log" class="log-entry">
                                            <span v-if="log.type === 'TEXT'">{{ log.message }}</span>
                                            <span v-else-if="log.type === 'HTML'" v-html="log.message" />
                                            <span v-else-if="log.type === 'OBJECT'">{{ log.message }}</span>
                                            <span v-else-if="log.type === 'USER'" class="text-info">{{ log.message }}</span>
                                        </div>
                                    </div>
                                    <code v-if="job.exception_stack">
                                        <pre>{{ job.exception_stack }}</pre>
                                    </code>
                                </template>
                                <p v-else class="text-muted mb-0">
                                    {{ $t('job.noLogs') }}
                                </p>
                            </div>
                        </div>
                    </b-card-body>
                </b-card>
            </div>
        </div>
        <dialog ref="variableDialog" class="variable-dialog" @cancel.prevent="closeVariableEditor">
            <form method="dialog" @submit.prevent="saveVariable">
                <div class="variable-dialog-header">
                    <h2 class="h5 mb-0">
                        {{$t('pipeline.schedule.contextData')}}
                    </h2>
                    <button type="button" class="btn-close" :aria-label="$t('actions.cancel')"
                        @click="closeVariableEditor" />
                </div>
                <div class="mb-3">
                    <label for="pipeline-run-variable-name" class="form-label">
                        {{$t('pipeline.schedule.contextName')}}
                    </label>
                    <input id="pipeline-run-variable-name" v-model="variableName" class="form-control"
                        maxlength="200" required :readonly="Boolean(editingVariable)" />
                </div>
                <div class="mb-3">
                    <label for="pipeline-run-variable-value" class="form-label">
                        {{$t('pipeline.schedule.contextValue')}}
                    </label>
                    <textarea id="pipeline-run-variable-value" v-model="variableValue" class="form-control"
                        rows="5" maxlength="4000" required />
                    <div class="form-text text-end">{{variableValue.length}}/4000</div>
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-secondary" :disabled="variableSaving"
                        @click="closeVariableEditor">
                        {{$t('actions.cancel')}}
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="variableSaving">
                        <font-awesome-icon v-if="variableSaving" icon="spinner" pulse />
                        {{$t('actions.save')}}
                    </button>
                </div>
            </form>
        </dialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, computed, nextTick, onBeforeMount, onUnmounted, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useNotifier from '@/composables/useNotifier.js';
import { useWebSocket } from '@/composables/websocket.js';
import PipelineRunNotifications from '@/components/PipelineRunNotifications.vue';

import axios from 'axios';

const standUrl = import.meta.env.VITE_STAND_URL;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;

const vm = getCurrentInstance();
const { t } = useI18n();

const { confirm, success, error } = useNotifier(vm.proxy);
const router = vm.proxy.$router;

const route = vm.proxy.$route;

const { connectWebSocket, disconnectWebSocket, joinRoom } = useWebSocket();
const notificationsRef = ref(null);
let currentState = null;
onBeforeMount(async () => {
    pipelineRunId.value = (route) ? route.params.id : 0;
    await load();
});
onUnmounted(() => {
    disconnectWebSocket();
});
const triggerModeDescription = (mode) => {
    const descriptions = {
        manual: 'Manual',
        user: 'Usuário',
        immediately: 'Imediato',
        scheduled: 'Agendado'
    };
    return descriptions[mode] || 'Desconhecido';
}
onMounted(() => {
    const eventHandlers = {
        'connect': () => {
            joinRoom('pipeline_runs', true);
        },
        'update pipeline run': async (msg) => {
            if (msg.message === 'status') {
                pipelineRun.value.status = msg.value;
            } else {
                notificationsRef.value?.push(msg);
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
const selectedStep = ref({ jobs: [] });
const variableDialog = ref(null);
const editingVariable = ref(null);
const variableName = ref('');
const variableValue = ref('');
const variableSaving = ref(false);
const visibleLogJobs = ref(new Set());

const hasJobLogs = (job) => Boolean(
    job.exception_stack || job.steps?.some(step => step.logs?.length)
);
const isJobLogsVisible = (jobId) => visibleLogJobs.value.has(jobId);
const toggleJobLogs = (jobId) => {
    const visibleJobs = new Set(visibleLogJobs.value);
    if (visibleJobs.has(jobId)) visibleJobs.delete(jobId);
    else visibleJobs.add(jobId);
    visibleLogJobs.value = visibleJobs;
};

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
        if (result) {
            const url = `${standUrl}/pipeline-runs/execute`;
            const context = Object.fromEntries(
                (pipelineRun.value.context_data || []).map(v => [v.name, v.value])
            );
            const payload = {
                id,
                variables: JSON.stringify(context)
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
        progress.finish();
    }
};
const setSelectedStep = (step) => {
    selectedStep.value = step;
};
const openVariableEditor = (variable = null) => {
    editingVariable.value = variable;
    variableName.value = variable?.name || '';
    variableValue.value = variable?.value || '';
    showVariables.value = true;
    nextTick(() => variableDialog.value?.showModal());
};
const closeVariableEditor = () => {
    if (variableDialog.value?.open) variableDialog.value.close();
    editingVariable.value = null;
    variableName.value = '';
    variableValue.value = '';
};
const saveVariable = async () => {
    const name = variableName.value.trim();
    if (!name || variableSaving.value) return;

    variableSaving.value = true;
    try {
        const resp = await axios.patch(
            `${standUrl}/pipeline-runs/${pipelineRunId.value}/context`,
            { name, value: variableValue.value }
        );
        const savedVariable = resp.data.data?.[0] || { name, value: variableValue.value };
        const contextData = pipelineRun.value.context_data || [];
        const index = contextData.findIndex(variable => variable.name === savedVariable.name);
        if (index === -1) contextData.push(savedVariable);
        else contextData.splice(index, 1, savedVariable);
        pipelineRun.value.context_data = contextData;
        const action = editingVariable.value
            ? t('actions.edit')
            : t('actions.add', { type: t('pipeline.schedule.contextData') });
        success(
            t('messages.savedWithSuccess', {
                what: t('pipeline.schedule.contextData')
            }),
            action,
            10000
        );
        closeVariableEditor();
    } catch (e) {
        error(e);
    } finally {
        variableSaving.value = false;
    }
};
const removeVariable = (variable) => {
    confirm(
        t('actions.delete'),
        `${t('actions.delete')} ${variable.name}?`,
        async () => {
            try {
                await axios.delete(
                    `${standUrl}/pipeline-runs/${pipelineRunId.value}/context/${encodeURIComponent(variable.name)}`
                );
                pipelineRun.value.context_data = (pipelineRun.value.context_data || [])
                    .filter(context => context.name !== variable.name);
                success(t('messages.successDeletion', { what: variable.name }));
            } catch (e) {
                error(e);
            }
        }
    );
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
const showVariables = ref(true)
</script>

<style lang="scss" scoped>
.status-small {
    font-size: 8pt;
}

.context-data {
    height: 16vh;
    overflow-y: auto
}

.variables-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.variable-name,
.variable-value {
    max-width: 10rem;
    overflow-wrap: anywhere;
}

.variable-actions {
    white-space: nowrap;
}

.variable-dialog {
    width: min(36rem, calc(100vw - 2rem));
    border: 0;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 2rem rgb(0 0 0 / 25%);
    padding: 1.25rem;
}

.variable-dialog::backdrop {
    background: rgb(0 0 0 / 45%);
}

.variable-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
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

.execution-logs {
    max-height: 32vh;
    overflow-y: auto;
    padding: 0.75rem;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    font-size: 0.85rem;
}

.job-log-step {
    overflow-wrap: anywhere;
}

.log-entry {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.execution-logs pre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    margin-bottom: 0;
}
</style>
