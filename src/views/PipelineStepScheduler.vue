<template>
    <div class="editPage-agendador">
        <div class="editPage-agendador-title">
            <font-awesome-icon icon="fa fa-calendar-alt" />
            <span class="ml-2">Agendador de etapa</span>
        </div>
        <div v-if="selectedStep === ''" class="editPage-agendador-body">
            <p class="font-weight-bold">
                Clique no ícone do relógio <button class="btn btn-sm btn-info">
                    <font-awesome-icon icon="clock" />
                </button> em uma das etapas para utilizar o agendador.
            </p>
        </div>
        <div v-else class="editPage-agendador-body">
            <div class="editPage-agendador-box">
                <div class="editPage-label">
                    Etapa: <span class="editPage-label-badge">{{selectedStep}}</span>
                </div>
            </div>
            <div class="editPage-agendador-box">
                <p class="font-weight-bold">
                    Quando deseja que sua etapa seja inicializada?
                </p>
                <b-form-select v-model="selectedFreqOpt"
                               class="mb-2" 
                               :options="selectedStepIndex === 0 ? 
                                   filteredSelectFreqOpt.slice(0, 1).concat(filteredSelectFreqOpt.slice(2)) : 
                                   filteredSelectFreqOpt" />
            </div>
            <div v-if="selectedFreqOpt === 'uma-vez'">
                <div class="editPage-agendador-box" :class="radios">
                    <p class="font-weight-bold">
                        Iniciar:
                    </p>
                    <input id="iniciar-data" class="editPage-input" type="date">
                    <input id="iniciar-hora" class="editPage-input" type="time">
                </div>
            </div>
            
            <div v-if="selectedFreqOpt === 'diariamente'">
                <div class="editPage-agendador-box" :class="radios">
                    <p class="font-weight-bold">
                        Iniciar:
                    </p>
                    <input id="iniciar-data" class="editPage-input" type="date">
                    <input id="iniciar-hora" class="editPage-input" type="time">
                </div>
                <div class="editPage-agendador-box" :class="dias">
                    <p class="font-weight-bold">
                        Intervalo de repetição (dias):
                    </p>
                    <input id="repetir-dias" class="editPage-input" :class="dias" type="number"
                           min="0">
                </div>
            </div>

            <div v-if="selectedFreqOpt === 'semanalmente'">
                <div class="editPage-agendador-box" :class="radios">
                    <p class="font-weight-bold">
                        Iniciar:
                    </p>
                    <input id="iniciar-data" class="editPage-input" type="date">
                    <input id="iniciar-hora" class="editPage-input" type="time">
                </div>
                <div class="editPage-agendador-box" :class="dias">
                    <p class="font-weight-bold">
                        Intervalo de repetição (semanas):
                    </p>
                    <input id="repetir-semanas" class="editPage-input" :class="dias" type="number"
                           min="0">
                </div>
                <b-form-group>
                    <div class="editPage-chackbox-div" :class="diasSemana">
                        <p class="font-weight-bold mb-2">
                            Selecione os dias da semana:
                        </p>
                        <b-form-checkbox v-for="day in weekDays" :key="day.value" v-model="selectedWeekDays" :value="day.value">
                            {{day.label}}
                        </b-form-checkbox>
                    </div>
                </b-form-group>
            </div>

            <div v-if="selectedFreqOpt === 'mensalmente'">
                <div class="editPage-agendador-box" :class="radios">
                    <p class="font-weight-bold">
                        Iniciar:
                    </p>
                    <input id="iniciar-data" class="editPage-input" type="date">
                    <input id="iniciar-hora" class="editPage-input" type="time">
                </div>
                <b-form-group>
                    <p class="font-weight-bold mb-2">
                        Selecione os meses:
                    </p>
                    <b-form-checkbox v-model="selectAllMonths" class="mb-2" @change="toggleAllMonths">
                        Selecionar todos
                    </b-form-checkbox>
                    <div class="editPage-chackbox-div" :class="meses">
                        <div>
                            <b-form-checkbox v-model="selectedMonths" value="janeiro">
                                Janeiro
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedMonths" value="fevereiro">
                                Fevereiro
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedMonths" value="marco">
                                Março
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedMonths" value="abril">
                                Abril
                            </b-form-checkbox>
                        </div>
                        <div>
                            <b-form-checkbox v-model="selectedMonths" value="maio">
                                Maio
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedMonths" value="junho">
                                Junho
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedMonths" value="julho">
                                Julho
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedMonths" value="agosto">
                                Agosto
                            </b-form-checkbox>
                        </div>
                        <div>
                            <b-form-checkbox v-model="selectedMonths" value="setembro">
                                Setembro
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedMonths" value="outubro">
                                Outubro
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedMonths" value="novembro">
                                Novembro
                            </b-form-checkbox>
                            <b-form-checkbox v-model="selectedMonths" value="dezembro">
                                Dezembro
                            </b-form-checkbox>
                        </div>
                    </div>
                </b-form-group>
                <b-form-group>
                    <p class="font-weight-bold mb-2">
                        Selecione os dias:
                    </p>
                    <b-form-checkbox v-model="selectAllDays" class="mb-2" @change="toggleAllDays">
                        Selecionar todos
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
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        selectedStep: { type: String, default: null },
        selectedStepIndex: { type: Number, default: 0 },
    },
    data() {
        return {
            radios: 'radios',
            dias: 'dias',
            diasSemana: 'diasSemana',
            meses: 'meses',
            selectedWeekDays: [],
            selectedFreqOpt: null,
            selectFreqOpt: [
                { value: null, text: 'Selecione a frequência' },
                { value: 'imediatamente', text: 'Imediatamente após a etapa anterior' },
                { value: 'uma-vez', text: 'Uma vez' },
                { value: 'diariamente', text: 'Diariamente' },
                { value: 'semanalmente', text: 'Semanalmente' },
                { value: 'mensalmente', text: 'Mensalmente' },
                { value: 'usuario', text: 'Disparo pelo usuário' },
            ],
            weekDays: [
                { value: 'domingo', label: 'Domingo' },
                { value: 'segunda', label: 'Segunda-feira' },
                { value: 'terca', label: 'Terça-feira' },
                { value: 'quarta', label: 'Quarta-feira' },
                { value: 'quinta', label: 'Quinta-feira' },
                { value: 'sexta', label: 'Sexta-feira' },
                { value: 'sabado', label: 'Sábado' }
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
                return this.selectFreqOpt.filter(option => option.value !== 'imediatamente');
            }
            return this.selectFreqOpt;
        },
    },
    watch: {
        selectedStep() {
            this.selectedFreqOpt = null;
        }
    },
    methods: {
        toggleAllMonths() {
            if (this.selectAllMonths) {
                this.selectedMonths = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
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
    }
};

</script>