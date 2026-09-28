<template>
    <div class="editPage-agendador">
        <div class="editPage-agendador-body">
            <div class="editPage-agendador-box">
                <p class="font-weight-bold">
                    {{ $t('pipeline.edit.scheduler.chooseSchedulerFrequency') }}
                </p>
                <b-form-select v-model="schedulerData.selectedFreqOpt" class="mb-2" :options="selectFreqOpt"
                    data-test="select-frequency" @change="resetSelect" />
            </div>
            <div v-if="schedulerData.selectedFreqOpt === 'once'">
                <div class="editPage-agendador-box radios">
                    <p class="font-weight-bold">
                        {{ $t('titles.start') }}:
                    </p>
                    <input id="iniciar-data" v-model="schedulerData.startDate" class="editPage-input" type="date" :min="minDate">
                    <input id="iniciar-hora" v-model="schedulerData.startTime" class="editPage-input" type="time">
                </div>
            </div>

            <div v-if="schedulerData.selectedFreqOpt === 'daily'">
                <div class="editPage-agendador-box radios">
                    <p class="font-weight-bold">
                        {{ $t('titles.start') }}:
                    </p>
                    <input id="iniciar-data" v-model="schedulerData.startDate" class="editPage-input" type="date" :min="minDate">
                    <input id="iniciar-hora" v-model="schedulerData.startTime" class="editPage-input" type="time">
                </div>
                <div class="editPage-agendador-box dias">
                    <p class="font-weight-bold">
                        {{ $t('pipeline.edit.scheduler.repetitionInterval') }} ({{ $t('common.periods.day',
                            2).toLowerCase() }}):
                    </p>
                    <input id="repetir-dias" v-model="schedulerData.intervalDays" class="editPage-input dias" type="number"
                        min="0">
                </div>
            </div>

            <div v-if="schedulerData.selectedFreqOpt === 'weekly'">
                <div class="editPage-agendador-box radios">
                    <p class="font-weight-bold">
                        {{ $t('titles.start') }}:
                    </p>
                    <input id="iniciar-data" v-model="schedulerData.startDate" class="editPage-input" type="date" :min="minDate">
                    <input id="iniciar-hora" v-model="schedulerData.startTime" class="editPage-input" type="time">
                </div>
                <div class="editPage-agendador-box dias">
                    <p class="font-weight-bold">
                        {{ $t('pipeline.edit.scheduler.repetitionInterval') }} ({{ $t('common.periods.week',
                            2).toLowerCase() }}):
                    </p>
                    <input id="repetir-semanas" v-model="schedulerData.intervalWeeks" class="editPage-input dias"
                        type="number" min="0">
                </div>
                <b-form-group>
                    <div class="editPage-chackbox-div diasSemana">
                        <p class="font-weight-bold mb-2">
                            {{ $t('pipeline.edit.scheduler.selectWeekDays') }}:
                        </p>
                        <b-form-checkbox v-for="day in weekDays" :key="day.value" v-model="schedulerData.selectedWeekDays"
                            :value="day.value">
                            {{ day.label }}
                        </b-form-checkbox>
                    </div>
                </b-form-group>
            </div>

            <div v-if="schedulerData.selectedFreqOpt === 'monthly'">
                <div class="editPage-agendador-box radios">
                    <p class="font-weight-bold">
                        {{ $t('titles.day') }}:
                    </p>
                    <select class="form-control form-control-sm" v-model="schedulerData.startDay">
                        <option v-for="i in 31" :value="i" :key="i">{{ i }}</option>
                        <option value="last">{{$t('pipeline.edit.scheduler.lastDayOfMonth')}}</option>
                    </select>
                    <!--
                    <input id="iniciar-data" v-model="schedulerData.startDate" class="editPage-input" type="date"
                           :min="minDate">
                           -->
                    <input id="iniciar-hora" v-model="schedulerData.startTime" class="form-control form-control-sm" type="time">
                </div>
                <div class="row">
                    <div class="col-12">
                        <p class="font-weight-bold mb-2">
                            {{ $t('pipeline.edit.scheduler.selectMonths') }}:
                        </p>
                        <b-form-checkbox v-model="schedulerData.selectAllMonths" class="mb-2" @change="toggleAllMonths">
                            <span data-test="select-all-months">
                                {{ $t('pipeline.edit.scheduler.selectAll') }}
                            </span>
                        </b-form-checkbox>
                    </div>

                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="1" data-test="january">
                            {{ $t('common.months.january') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="2">
                            {{ $t('common.months.february') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="3">
                            {{ $t('common.months.march') }}
                        </b-form-checkbox>
                    </div>


                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="4">
                            {{ $t('common.months.april') }}
                        </b-form-checkbox>
                    </div>

                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="5">
                            {{ $t('common.months.may') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="6">
                            {{ $t('common.months.june') }}
                        </b-form-checkbox>
                    </div>


                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="7">
                            {{ $t('common.months.july') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="8">
                            {{ $t('common.months.august') }}
                        </b-form-checkbox>
                    </div>

                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="9">
                            {{ $t('common.months.september') }}
                        </b-form-checkbox>
                    </div>


                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="10">
                            {{ $t('common.months.october') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="11">
                            {{ $t('common.months.november') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="schedulerData.selectedMonths" value="12">
                            {{ $t('common.months.december') }}
                        </b-form-checkbox>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, watch, toRefs, nextTick } from 'vue';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    selectedStep: { type: Object, default: () => ({}) },
    selectedStepIndex: { type: Number, default: 0 },
    pipelineId: { type: Number, default: 0 },
});

const emit = defineEmits(['update-step']);

const stepCopy = ref({});
const schedulerData = reactive({
    intervalDays: null,
    intervalWeeks: null,
    startDate: null,
    startTime: null,
    startDay: 1,
    selectedWeekDays: [],
    selectedFreqOpt: null,
    selectedMonths: [],
    selectAllMonths: false,
    selectedDays: [],
    executeImmediately: false,
});

const selectFreqOpt = [
    { value: null, text: t('pipeline.edit.scheduler.selectFrequency') },
    { value: 'immediately', text: t('pipeline.edit.scheduler.immediately') },
    { value: 'monthly', text: t('pipeline.edit.monthly') },
    { value: 'user', text: t('pipeline.edit.scheduler.triggeredByUser') },
];

const weekDays = [
    { value: '1', label: t('common.weekDays.sunday') },
    { value: '2', label: t('common.weekDays.monday') },
    { value: '3', label: t('common.weekDays.tuesday') },
    { value: '4', label: t('common.weekDays.wednesday') },
    { value: '5', label: t('common.weekDays.thursday') },
    { value: '6', label: t('common.weekDays.friday') },
    { value: '7', label: t('common.weekDays.saturday') },
];

const minDate = computed(() => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    return currentDate.toISOString().split('T')[0];
});

let loadingStep = false;

watch(
    () => props.selectedStep,
    (newStep) => {
        loadingStep = true;
        if (newStep.scheduling !== undefined) {
            loadStepInfo();
        } else {
            schedulerData.selectedFreqOpt = null;
            resetSelect();
        }
        stepCopy.value = JSON.parse(JSON.stringify(newStep));
        nextTick(() => { loadingStep = false; });
    },
    { immediate: true }
);

watch(
    schedulerData,
    () => {
        if (loadingStep) return;
        saveSchedulerChanges();
    },
    { deep: true }
);

function toggleAllMonths() {
    if (schedulerData.selectAllMonths) {
        schedulerData.selectedMonths = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    } else {
        schedulerData.selectedMonths = [];
    }
}

function loadStepInfo() {
    const scheduling = JSON.parse(props.selectedStep.scheduling);

    schedulerData.selectedFreqOpt = scheduling.stepSchedule.frequency;
    schedulerData.intervalDays = scheduling.stepSchedule.intervalDays;
    schedulerData.intervalWeeks = scheduling.stepSchedule.intervalWeeks;
    schedulerData.selectedWeekDays = scheduling.stepSchedule.weekDays;
    schedulerData.selectedMonths = scheduling.stepSchedule.months;
    schedulerData.selectedDays = scheduling.stepSchedule.days;
    schedulerData.executeImmediately = scheduling.stepSchedule.executeImmediately;
    schedulerData.startDay = scheduling.stepSchedule.startDay;
    schedulerData.startTime = scheduling.stepSchedule.startTime;
    schedulerData.startDate = scheduling.stepSchedule.startDateTime
        ? scheduling.stepSchedule.startDateTime.split('T')[0]
        : null;
}

function resetSelect() {
    Object.assign(schedulerData, {
        intervalDays: null,
        intervalWeeks: null,
        startDate: null,
        startTime: null,
        startDay: 1,
        selectedWeekDays: [],
        //selectedFreqOpt: null,
        selectedMonths: [],
        selectAllMonths: false,
        selectedDays: [],
        executeImmediately: false,
    });
}

function saveSchedulerChanges() {
    let dateTime = schedulerData.startDate + 'T' + schedulerData.startTime + ':00';
    if (schedulerData.startDate === null || schedulerData.startTime === null) {
        dateTime = null;
    }

    const data = {
        stepSchedule: {
            intervalDays: schedulerData.intervalDays,
            intervalWeeks: schedulerData.intervalWeeks,
            startDateTime: dateTime,
            weekDays: schedulerData.selectedWeekDays,
            months: schedulerData.selectedMonths,
            days: schedulerData.selectedDays,
            executeImmediately: schedulerData.selectedFreqOpt === 'immediately',
            frequency: schedulerData.selectedFreqOpt,
            startDay: schedulerData.startDay,
            startTime: schedulerData.startTime,
        },
    };

    stepCopy.value.scheduling = JSON.stringify(data);

    emit('update-step', stepCopy.value, props.selectedStep);
}

onMounted(() => {
    if (props.selectedStep.scheduling !== undefined) loadStepInfo();
});
</script>