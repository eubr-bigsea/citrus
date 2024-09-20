<template>
    <div class="editPage-agendador" @change="saveSchedulerChanges">
        <div class="editPage-agendador-body">
            <div class="editPage-agendador-box">
                <p class="font-weight-bold">
                    {{ $t('pipeline.edit.scheduler.chooseSchedulerFrequency') }}
                </p>
                <b-form-select v-model="selectedFreqOpt" class="mb-2" :options="selectFreqOpt"
                    data-test="select-frequency" @change="resetSelect" />
            </div>
            <div v-if="selectedFreqOpt === 'once'">
                <div class="editPage-agendador-box" :class="radios">
                    <p class="font-weight-bold">
                        {{ $t('titles.start') }}:
                    </p>
                    <input id="iniciar-data" v-model="startDate" class="editPage-input" type="date" :min="minDate">
                    <input id="iniciar-hora" v-model="startTime" class="editPage-input" type="time">
                </div>
            </div>

            <div v-if="selectedFreqOpt === 'daily'">
                <div class="editPage-agendador-box" :class="radios">
                    <p class="font-weight-bold">
                        {{ $t('titles.start') }}:
                    </p>
                    <input id="iniciar-data" v-model="startDate" class="editPage-input" type="date" :min="minDate">
                    <input id="iniciar-hora" v-model="startTime" class="editPage-input" type="time">
                </div>
                <div class="editPage-agendador-box" :class="dias">
                    <p class="font-weight-bold">
                        {{ $t('pipeline.edit.scheduler.repetitionInterval') }} ({{ $t('common.periods.day',
                            2).toLowerCase() }}):
                    </p>
                    <input id="repetir-dias" v-model="intervalDays" class="editPage-input" :class="dias" type="number"
                        min="0">
                </div>
            </div>

            <div v-if="selectedFreqOpt === 'weekly'">
                <div class="editPage-agendador-box" :class="radios">
                    <p class="font-weight-bold">
                        {{ $t('titles.start') }}:
                    </p>
                    <input id="iniciar-data" v-model="startDate" class="editPage-input" type="date" :min="minDate">
                    <input id="iniciar-hora" v-model="startTime" class="editPage-input" type="time">
                </div>
                <div class="editPage-agendador-box" :class="dias">
                    <p class="font-weight-bold">
                        {{ $t('pipeline.edit.scheduler.repetitionInterval') }} ({{ $t('common.periods.week',
                            2).toLowerCase() }}):
                    </p>
                    <input id="repetir-semanas" v-model="intervalWeeks" class="editPage-input" :class="dias"
                        type="number" min="0">
                </div>
                <b-form-group>
                    <div class="editPage-chackbox-div" :class="diasSemana">
                        <p class="font-weight-bold mb-2">
                            {{ $t('pipeline.edit.scheduler.selectWeekDays') }}:
                        </p>
                        <b-form-checkbox v-for="day in weekDays" :key="day.value" v-model="selectedWeekDays"
                            :value="day.value">
                            {{ day.label }}
                        </b-form-checkbox>
                    </div>
                </b-form-group>
            </div>

            <div v-if="selectedFreqOpt === 'monthly'">
                <div class="editPage-agendador-box" :class="radios">
                    <p class="font-weight-bold">
                        {{ $t('titles.day') }}:
                    </p>
                    <select class="form-control form-control-sm" v-model="startDay">
                        <option v-for="i in 31" value="i" :key="i">{{ i }}</option>
                        <option value="last">Último</option>
                    </select>
                    <!--
                    <input id="iniciar-data" v-model="startDate" class="editPage-input" type="date"
                           :min="minDate">
                           -->
                    <input id="iniciar-hora" v-model="startTime" class="form-control form-control-sm" type="time">
                </div>
                <div class="row">
                    <div class="col-12">
                        <p class="font-weight-bold mb-2">
                            {{ $t('pipeline.edit.scheduler.selectMonths') }}:
                        </p>
                        <b-form-checkbox v-model="selectAllMonths" class="mb-2" @change="toggleAllMonths">
                            <span data-test="select-all-months">
                                {{ $t('pipeline.edit.scheduler.selectAll') }}
                            </span>
                        </b-form-checkbox>
                    </div>

                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="1" data-test="january">
                            {{ $t('common.months.january') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="2">
                            {{ $t('common.months.february') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="3">
                            {{ $t('common.months.march') }}
                        </b-form-checkbox>
                    </div>


                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="4">
                            {{ $t('common.months.april') }}
                        </b-form-checkbox>
                    </div>

                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="5">
                            {{ $t('common.months.may') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="6">
                            {{ $t('common.months.june') }}
                        </b-form-checkbox>
                    </div>


                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="7">
                            {{ $t('common.months.july') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="8">
                            {{ $t('common.months.august') }}
                        </b-form-checkbox>
                    </div>

                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="9">
                            {{ $t('common.months.september') }}
                        </b-form-checkbox>
                    </div>


                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="10">
                            {{ $t('common.months.october') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="11">
                            {{ $t('common.months.november') }}
                        </b-form-checkbox>
                    </div>
                    <div class="col-4">
                        <b-form-checkbox v-model="selectedMonths" value="12">
                            {{ $t('common.months.december') }}
                        </b-form-checkbox>
                    </div>
                </div>
                <!--
                <b-form-group>
                    <p class="font-weight-bold mb-2">
                        {{$t('pipeline.edit.scheduler.selectDays')}}:
                    </p>
                    <b-form-checkbox v-model="selectAllDays" class="mb-2" @change="toggleAllDays">
                        <span data-test="select-all-days">
                            {{$t('pipeline.edit.scheduler.selectAll')}}
                        </span>
                    </b-form-checkbox>
                    <div class="editPage-chackbox-div" :class="meses">
                        <div>
                            <b-form-checkbox v-model="selectedDays" value="1">
                                1
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="2">
                                2
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="3">
                                3
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="4">
                                4
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="5">
                                5
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="6">
                                6
                            </b-form-checkbox>
                        </div>
                        <div>
                            <b-form-checkbox v-model="selectedDays" value="7">
                                7
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="8">
                                8
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="9">
                                9
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="10">
                                10
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="11">
                                11
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="12">
                                12
                            </b-form-checkbox>
                        </div>
                        <div>
                            <b-form-checkbox v-model="selectedDays" value="13">
                                13
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="14">
                                14
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="15">
                                15
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="16">
                                16
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="17">
                                17
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="18">
                                18
                            </b-form-checkbox>
                        </div>
                        <div>
                            <b-form-checkbox v-model="selectedDays" value="19">
                                19
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="20">
                                20
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="21">
                                21
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="22">
                                22
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="23">
                                23
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="24">
                                24
                            </b-form-checkbox>
                        </div>
                        <div>
                            <b-form-checkbox v-model="selectedDays" value="25">
                                25
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="26">
                                26
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="27">
                                27
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="28">
                                28
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="29">
                                29
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="30">
                                30
                            </b-form-checkbox>
                        </div>
                        <div>
                            <b-form-checkbox v-model="selectedDays" value="31">
                                31
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedDays" value="ultimo">
                                Último
                            </b-form-checkbox>
                        </div>
                    </div>
                </b-form-group>
                -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        selectedStep: { type: Object, default: () => { } },
        selectedStepIndex: { type: Number, default: 0 },
        pipelineId: { type: Number, default: 0 },
    },
    emits: ['send-scheduler-changes'],
    data() {
        return {
            radios: 'radios',
            dias: 'dias',
            diasSemana: 'diasSemana',
            meses: 'meses',
            stepCopy: {},
            intervalDays: null,
            intervalWeeks: null,
            startDate: null,
            startTime: null,
            startDay: 1,
            selectedWeekDays: [],
            selectedFreqOpt: null,
            selectFreqOpt: [
                { value: null, text: this.$t('pipeline.edit.scheduler.selectFrequency') },
                //{ value: 'immediately', text: this.$t('pipeline.edit.scheduler.immediately') },
                //{ value: 'once', text: this.$t('pipeline.edit.scheduler.once') },
                //{ value: 'daily', text: this.$t('pipeline.edit.daily') },
                //{ value: 'weekly', text: this.$t('pipeline.edit.weekly') },
                { value: 'monthly', text: this.$t('pipeline.edit.monthly') },
                { value: 'user', text: this.$t('pipeline.edit.scheduler.triggeredByUser') },
            ],
            weekDays: [
                { value: '1', label: this.$t('common.weekDays.sunday') },
                { value: '2', label: this.$t('common.weekDays.monday') },
                { value: '3', label: this.$t('common.weekDays.tuesday') },
                { value: '4', label: this.$t('common.weekDays.wednesday') },
                { value: '5', label: this.$t('common.weekDays.thursday') },
                { value: '6', label: this.$t('common.weekDays.friday') },
                { value: '7', label: this.$t('common.weekDays.saturday') }
            ],
            selectedMonths: [],
            selectAllMonths: false,
            selectedDays: [],
            selectAllDays: false,
            executeImmediately: false,
        };
    },
    computed: {
        filteredSelectFreqOpt(index) {
            if (index === 0) {
                return this.selectFreqOpt.filter(option => option.value !== 'immediately');
            }
            return this.selectFreqOpt;
        },
        minDate() {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 1);
            const currentDateFormatted = currentDate.toISOString().split('T')[0];
            return currentDateFormatted;
        }
    },
    watch: {
        selectedStep(newStep, oldStep) {
            if (this.selectedStep.scheduling !== undefined) {
                this.loadStepInfo();
            } else {
                this.selectedFreqOpt = null;
                this.resetSelect();
            }

            this.stepCopy = JSON.parse(JSON.stringify(this.selectedStep));
        }
    },
    mounted() {
        if (this.selectedStep.scheduling !== undefined) this.loadStepInfo();
    },
    methods: {
        toggleAllMonths() {
            if (this.selectAllMonths) {
                this.selectedMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
            } else {
                this.selectedMonths = [];
            }
        },
        toggleAllDays() {
            if (this.selectAllDays) {
                this.selectedDays = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
            } else {
                this.selectedDays = [];
            }
        },
        loadStepInfo() {
            const scheduling = JSON.parse(this.selectedStep.scheduling);

            this.selectedFreqOpt = scheduling.stepSchedule.frequency;
            this.intervalDays = scheduling.stepSchedule.intervalDays;
            this.intervalWeeks = scheduling.stepSchedule.intervalWeeks;
            this.selectedWeekDays = scheduling.stepSchedule.weekDays;
            this.selectedMonths = scheduling.stepSchedule.months;
            this.selectedDays = scheduling.stepSchedule.days;
            this.executeImmediately = scheduling.stepSchedule.executeImmediately;

            if (scheduling.stepSchedule.startDateTime === null) {
                this.startDate = null;
                this.startTime = null;
            } else {
                this.startDate = scheduling.stepSchedule.startDateTime.split('T')[0];
                this.startTime = scheduling.stepSchedule.startDateTime.split('T')[1];
            }
        },
        resetSelect() {
            this.intervalDays = null;
            this.intervalWeeks = null;
            this.startDate = null;
            this.startTime = null;
            this.selectedWeekDays = [];
            this.selectedMonths = [];
            this.selectedDays = [];
            this.selectAllMonths = false;
            this.selectAllDays = false;
            this.executeImmediately = false;
        },
        saveSchedulerChanges() {
            let dateTime = this.startDate + 'T' + this.startTime + ':00';
            if (this.startDate === null || this.startTime === null) {
                dateTime = null;
            }

            const data = {
                "stepSchedule": {
                    "executeImmediately": this.selectedFreqOpt === 'immediately' ? true : false,
                    "frequency": this.selectedFreqOpt,
                    "startDateTime": dateTime,
                    "intervalDays": this.intervalDays,
                    "intervalWeeks": this.intervalWeeks,
                    "weekDays": this.selectedWeekDays,
                    "months": this.selectedMonths,
                    "days": this.selectedDays
                },
            };

            this.stepCopy.scheduling = JSON.stringify(data);

            this.$emit('send-scheduler-changes', this.stepCopy, this.selectedStep);
        }
    },
};

</script>