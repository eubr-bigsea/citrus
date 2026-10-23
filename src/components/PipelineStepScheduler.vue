<template>
    <div class="editPage-agendador">
        <div class="editPage-agendador-body">
            <fieldset class="editPage-agendador-box scheduler-fieldset">
                <legend class="scheduler-legend">
                    {{$t('pipeline.edit.scheduler.chooseSchedulerFrequency')}}
                </legend>
                <div class="freq-options" role="radiogroup">
                    <template v-for="opt in frequencyOptions" :key="opt.value">
                        <input :id="`step-freq-${opt.value}`" v-model="schedulerData.selectedFreqOpt" type="radio"
                               class="btn-check" name="step-frequency" :value="opt.value"
                               :data-test="`frequency-${opt.value}`" @change="resetSelect">
                        <label class="freq-card" :for="`step-freq-${opt.value}`">
                            <font-awesome-icon :icon="`fa ${opt.icon}`" fixed-width />
                            <span>{{opt.text}}</span>
                        </label>
                    </template>
                </div>
            </fieldset>
            <div v-if="schedulerData.selectedFreqOpt === 'once'">
                <div class="editPage-agendador-box radios">
                    <p class="fw-bold">
                        {{$t('titles.start')}}:
                    </p>
                    <input id="iniciar-data" v-model="schedulerData.startDate" class="editPage-input" type="date"
                           :min="minDate">
                    <input id="iniciar-hora" v-model="schedulerData.startTime" class="editPage-input" type="time">
                </div>
            </div>

            <div v-if="schedulerData.selectedFreqOpt === 'daily'">
                <div class="editPage-agendador-box radios">
                    <p class="fw-bold">
                        {{$t('titles.start')}}:
                    </p>
                    <input id="iniciar-data" v-model="schedulerData.startDate" class="editPage-input" type="date"
                           :min="minDate">
                    <input id="iniciar-hora" v-model="schedulerData.startTime" class="editPage-input" type="time">
                </div>
                <div class="editPage-agendador-box dias">
                    <p class="fw-bold">
                        {{$t('pipeline.edit.scheduler.repetitionInterval')}} ({{$t('common.periods.day',
                                                                                   2).toLowerCase()}}):
                    </p>
                    <input id="repetir-dias" v-model="schedulerData.intervalDays" class="editPage-input dias" type="number"
                           min="0">
                </div>
            </div>

            <div v-if="schedulerData.selectedFreqOpt === 'weekly'">
                <div class="editPage-agendador-box radios">
                    <p class="fw-bold">
                        {{$t('titles.start')}}:
                    </p>
                    <input id="iniciar-data" v-model="schedulerData.startDate" class="editPage-input" type="date"
                           :min="minDate">
                    <input id="iniciar-hora" v-model="schedulerData.startTime" class="editPage-input" type="time">
                </div>
                <div class="editPage-agendador-box dias">
                    <p class="fw-bold">
                        {{$t('pipeline.edit.scheduler.repetitionInterval')}} ({{$t('common.periods.week',
                                                                                   2).toLowerCase()}}):
                    </p>
                    <input id="repetir-semanas" v-model="schedulerData.intervalWeeks" class="editPage-input dias"
                           type="number" min="0">
                </div>
                <b-form-group>
                    <div class="editPage-chackbox-div diasSemana">
                        <p class="fw-bold mb-2">
                            {{$t('pipeline.edit.scheduler.selectWeekDays')}}:
                        </p>
                        <b-form-checkbox v-for="day in weekDays" :key="day.value" v-model="schedulerData.selectedWeekDays"
                                         :value="day.value">
                            {{day.label}}
                        </b-form-checkbox>
                    </div>
                </b-form-group>
            </div>

            <div v-if="schedulerData.selectedFreqOpt === 'monthly'" class="scheduler-monthly">
                <div class="row g-2">
                    <div class="col-6 col-md-4">
                        <label for="step-start-day" class="form-label small fw-bold mb-1">
                            <font-awesome-icon icon="fa fa-calendar-alt" class="text-secondary me-1" />
                            {{$t('titles.day')}}
                        </label>
                        <select id="step-start-day" v-model="schedulerData.startDay" class="form-select form-select-sm">
                            <option v-for="i in 31" :key="i" :value="i">
                                {{i}}
                            </option>
                            <option value="last">
                                {{$t('pipeline.edit.scheduler.lastDayOfMonth')}}
                            </option>
                        </select>
                    </div>
                    <div class="col-6 col-md-4">
                        <label for="iniciar-hora" class="form-label small fw-bold mb-1">
                            <font-awesome-icon icon="fa fa-clock" class="text-secondary me-1" />
                            {{$t('common.periods.hour', 1)}}
                        </label>
                        <input id="iniciar-hora" v-model="schedulerData.startTime" class="form-control form-control-sm"
                               type="time">
                    </div>
                </div>
                <fieldset class="scheduler-fieldset mt-3">
                    <legend class="scheduler-legend">
                        {{$t('pipeline.edit.scheduler.selectMonths')}}
                    </legend>
                    <b-form-checkbox v-model="schedulerData.selectAllMonths" class="mb-2" @change="toggleAllMonths">
                        <span data-test="select-all-months">
                            {{$t('pipeline.edit.scheduler.selectAll')}}
                        </span>
                    </b-form-checkbox>
                    <div class="month-grid">
                        <template v-for="month in months" :key="month.value">
                            <input :id="`step-month-${month.value}`" v-model="schedulerData.selectedMonths"
                                   type="checkbox" class="btn-check" :value="month.value"
                                   :data-test="month.key">
                            <label class="month-chip" :for="`step-month-${month.value}`">
                                {{$t(`common.months.${month.key}`)}}
                            </label>
                        </template>
                    </div>
                </fieldset>
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

const frequencyOptions = [
    { value: 'immediately', icon: 'fa-bolt', text: t('pipeline.edit.scheduler.immediately') },
    { value: 'monthly', icon: 'fa-calendar-alt', text: t('pipeline.edit.monthly') },
    { value: 'user', icon: 'fa-user', text: t('pipeline.edit.scheduler.triggeredByUser') },
];

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
    'september', 'october', 'november', 'december']
    .map((key, i) => ({ key, value: String(i + 1) }));

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

<style scoped>
.scheduler-fieldset {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
}

.scheduler-legend {
    float: none;
    width: auto;
    margin-bottom: 0.6rem;
    padding: 0;
    font-size: 0.95rem;
    font-weight: 700;
}

.freq-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    gap: 0.5rem;
}

.freq-card {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.7rem 0.9rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    background: #fff;
    font-size: 0.9rem;
    cursor: pointer;
}

.freq-card:hover {
    border-color: #6c9bd8;
}

.btn-check:checked + .freq-card {
    border-color: #0d6efd;
    background: #eef3fb;
    color: #0d6efd;
    box-shadow: 0 0 0 1px #0d6efd;
}

.btn-check:focus-visible + .freq-card,
.btn-check:focus-visible + .month-chip {
    outline: 2px solid #0d6efd;
    outline-offset: 2px;
}

.scheduler-monthly {
    width: 100%;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
}

.month-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    gap: 0.4rem;
}

.month-chip {
    padding: 0.3rem 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background: #fff;
    font-size: 0.85rem;
    text-align: center;
    cursor: pointer;
}

.month-chip:hover {
    border-color: #6c9bd8;
}

.btn-check:checked + .month-chip {
    border-color: #0d6efd;
    background: #0d6efd;
    color: #fff;
}
</style>
