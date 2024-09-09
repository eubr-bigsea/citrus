<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="mt-2">
                <h6 class="pretitle">
                    Execução #{{ pipelineRunId }}
                </h6>
                <h1>
                    Pipeline Teste
                </h1>
            </div>
            <div>
                <router-link v-if="true || pipelineRunId" :to="{ name: 'pipelineRunsList' }"
                    class="btn btn-outline-primary d-print-none float-left btn-sm">
                    <font-awesome-icon icon="fa-chevron-left" />
                    &nbsp; {{ $t('actions.back') }} -
                    {{ $t('titles.pipelineRuns', 2) }}
                </router-link>
                <button class="btn btn-sm btn-outline-danger ml-2" @click="cancelRun">
                    <font-awesome-icon icon="fa fa-ban" class="" /> {{ $t('actions.cancel') }}
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
                                        {{ $tc('common.period') }}
                                    </div>
                                    <div class="infos-right">
                                        {{ pipelineRun.start | formatJsonDate('dd/MM/yyyy') }} a
                                        <br />
                                        {{ pipelineRun.finish | formatJsonDate('dd/MM/yyyy') }}
                                    </div>
                                </div>

                                <div class="d-flex flex-row">
                                    <div class="infos-left">
                                        {{ $tc('common.updated') }}
                                    </div>
                                    <div class="infos-right">
                                        {{ pipelineRun.updated | formatJsonDate }}
                                    </div>
                                </div>

                                <div class="d-flex flex-row">
                                    <div class="infos-left">
                                        {{ $tc('common.status') }}
                                    </div>
                                    <div class="infos-right">
                                        <div v-if="pipelineRun.status" class="runDetail-status status-small"
                                            :class="pipelineRun.status.toLowerCase()">
                                            {{ $tc(`status.${pipelineRun.status}`).toUpperCase() }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-card>
                    </div>
                    <div>
                        <div class="collapse-title">
                            {{ $tc('pipeline.step', 2) }}
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
                                        {{ $tc('common.name') }}
                                    </div>
                                    <div class="steps-header-column">
                                        Tentativas
                                    </div>
                                    <div class="steps-header-column">
                                        {{ $tc('common.status') }}
                                    </div>
                                    <div class="steps-header-column">
                                        {{ $tc('common.action', 2) }}
                                    </div>
                                </div>
                                <div v-for="(step, index) in pipelineRun.steps" :key="step.id" class="steps-body"
                                    :class="{ 'steps-body-selected': selectedStep.id === step.id }"
                                    @click="setSelectedStep(step)">
                                    <div class="steps-column">
                                        # {{ index + 1 }}
                                    </div>
                                    <div class="steps-column">
                                        {{ step.name }}
                                    </div>
                                    <div class="steps-column">
                                        {{ step.retries }}
                                    </div>
                                    <div class="steps-column">
                                        <div class="d-flex align-items-center">
                                            <div :class="step.status.toLowerCase()"
                                                class="runDetail-status status-small">
                                                {{ $tc(`status.${step.status}`).toUpperCase() }}
                                            </div>
                                        </div>

                                    </div>

                                    <div class="steps-column">
                                        <div>
                                            <button class="btn btn-sm btn-primary" :title="$tc('actions.execute')" @click="execute(step.id, step.name)">
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
                                                    Tentativa #{{ orderedJobs.length - index }}
                                                    <div class="d-flex align-items-center">
                                                        <div :class="job.status.toLowerCase()"
                                                            class="runDetail-status status-small">
                                                            {{ $tc(`status.${job.status}`).toUpperCase() }}
                                                        </div>
                                                        <button class="advanced-info-button">
                                                            <font-awesome-icon icon="fa-chevron-down" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="p-2">
                                                    Início: {{ job.started | formatJsonDate }}
                                                    Fim: {{ job.finished | formatJsonDate }}
                                                </div>
                                            </div>
                                            <b-collapse :id="index.toString()" :visible="index === 0">
                                                <b-card-body>
                                                    <div v-for="step in job.steps" class="border-bottom">
                                                        {{ step.status }}
                                                        {{ step.operation.name }}
                                                        <div v-for="log in step.logs">
                                                            <span v-if="log.type === 'TEXT'">
                                                                {{ log.message }}
                                                            </span>
                                                            <span v-else-if="log.type === 'HTML'" v-html="log.message">
                                                            </span>
                                                            <span v-else-if="log.type === 'OBJECT'">
                                                                {{ log.message }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <code v-if="job.exception_stack">
                                                        <pre>
                                                            {{ job.exception_stack }}
                                                        </pre>
                                                    </code>
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

<script setup>
import { ref, getCurrentInstance, computed, onBeforeMount, onMounted } from 'vue';
import useNotifier from '@/composables/useNotifier.js';

import axios from 'axios';
import io from 'socket.io-client';
import { mergician } from 'mergician';

const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;

const standUrl = import.meta.env.VITE_STAND_URL;

const vm = getCurrentInstance();

const { confirm, success, error } = useNotifier(vm.proxy);
const router = vm.proxy.$router;

const route = vm.proxy.$route;

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
const room = ref();
const socket = ref();
onBeforeMount(async () => {
    if (socket.value) {
        socket.value.emit('leave', { room: root.value.id });
    }
    pipelineRunId.value = (route) ? route.params.id : 0;
    await load();
    await connectWebSocket();
});

const progress = vm.proxy.$Progress;
const pipelineRun = ref({ status: '' });
// Methods
const execute = async(id, name) => {
    const callback = async () => {
        console.debug('id', id)
    };
    confirm('Executar', `Executar etapa "${name}"?`, callback)
};
const connectWebSocket = async () => {
    const opts = { upgrade: true, };
    if (standSocketIoPath !== '') {
        opts['path'] = standSocketIoPath;
    }
    socket.value = io(`${standSocketServer}${standNamespace}`, opts);

    socket.value.on('disconnect', () => {
        console.debug('You are not connected');
    });
    socket.value.on('response', msg => {
        console.debug('response', msg);
    });
    socket.value.on('connect', () => {
        const room = `run:${pipelineRunId.value}`;
        console.debug('Connecting to room', room);
        socket.value.emit('join', { room: room });
    });
    socket.value.on('connect_error', () => {
        console.debug('Web socket server offline');
    });
    socket.value.on('update run', (msg) => {
        const mergedObj = mergician({
            appendArrays: true,
        })(pipelineRun.value, msg.msg);
        pipelineRun.value = mergedObj;
        console.debug(mergedObj);
    });
}
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
    const callback = (result) => {
        console.debug('Cancelando....', result)
    };
    confirm('Cancelar execução', 'Você quer realmente cancelar esta execução?',
        callback);
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
    //text-transform: uppercase;
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

.status-small {
    font-size: 9pt;
    text-transform: lowercase
}
</style>