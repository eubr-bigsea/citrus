<template>
    <b-modal ref="scheduleModal" title="Agendar pipeline" button-size="sm"
    @ok="confirm" @cancel="handleCancel" :ok-disabled="testFormOk" size="lg">

        <h6>{{ id }} - {{ name }}</h6>
        <p>
            Informe o mês de referência de agendamento da pipeline.
            Atualmente, você deve usar esta função apenas se a periodicidade
            da pipline é mensal. Desta forma, informe como data inicial e a
            data final como o primeiro e último dias do mês, respectivamente.

        </p>
        <div class="row">
            <div class="col-6">
                <select class="form-control form-control-sm" v-model.number="month">
                    <option></option>
                    <option v-for="m, i in getMonthNames" :value="i + 1">
                        {{ m }}
                    </option>
                </select>
            </div>
            <div class="col-3">
                <select class="form-control form-control-sm" v-model.number="year">
                    <option></option>
                    <option v-for="year in getYears" :value="year">
                        {{ year }}
                    </option>
                </select>

            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <label>Variáveis de contexto</label>
                <div class="contextData">
                    <div v-if="contextData" v-for="(pair, index) in contextData" :key="index" class="d-flex align-items-center mb-2">
                        <input
                            type="text"
                            class="form-control form-control-sm mr-2"
                            v-model="pair.key"
                            placeholder="nome"
                            maxlength="50"
                        />
                        <input
                            type="text"
                            class="form-control form-control-sm mr-2"
                            v-model="pair.value"
                            placeholder="valor"
                            maxlength="200"
                        />
                        <button
                            type="button"
                            class="btn btn-sm btn-danger ml-2"
                            @click="removeContextData(index)"
                        >
                            <font-awesome-icon icon="fa fa-trash" />
                        </button>
                    </div>
                    <div v-if="contextData.length === 0" class="text-center">
                        Nenhum dado de contexto adicionado.
                    </div>
                </div>
                <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    @click="addContextData"
                >
                    Adicionar
                </button>
            </div>
        </div>
        <!--
        <b-form-group>
            <label>Data inicial de referência</label>
            <b-form-datepicker :date-disabled-fn="dateDisabled('first')" locale="pt" />
        </b-form-group>
        <b-form-group>
            <label>Data final de referência</label>
            <b-form-datepicker :date-disabled-fn="dateDisabled('last')" locale="pt" />
        </b-form-group>
        -->
    </b-modal>
</template>

<script setup>
import { ref, computed, defineExpose } from 'vue';
import { BModal } from 'bootstrap-vue';
import { pt } from 'date-fns/locale';
import { format } from 'date-fns';

const month = ref(null);
const year = ref(null);
const name = ref(null);
const id = ref(null);
const scheduleModal = ref(null);

const getMonthNames = computed(() => {
    const monthNames = [];
    for (let i = 0; i < 12; i++) {
        const date = new Date(2021, i, 1); // Using any year, 2021 here
        const monthName = format(date, 'MMMM', { locale: pt });
        monthNames.push(monthName);
    }
    return monthNames;
});

const getYears = computed(() => {
    const years = [];
    let currentYear = new Date().getYear();
    let maxYears = 5;
    years.push(currentYear + 1901); // First year in JS is 1900! Add next year
    do {
        years.push(currentYear + 1900);
        currentYear--;
        maxYears--;
    } while (maxYears > 0);
    return years;
});

const show = (modalRef, modalId, modalName) => {
    id.value = modalId;
    name.value = modalName;
    scheduleModal.value.show();
};
const testFormOk = computed(() => {
    console.debug(!month.value, !year.value , contextData.value.some(data => !data.key || !data.value))
    return (!month.value || !year.value || contextData.value.some(data => !data.key || !data.value))
});
const confirm = (emit) => {
    emit('on-schedule-pipeline', id.value,
        // In JS, months start from 0 !!!
        new Date(year.value, month.value - 1, 1),
        new Date(year.value, month.value, 0));
};

const handleCancel = () => {
    contextData.value = [];
    scheduleModal.value.hide();
};
const dateDisabled = (type) => {
    return (ymd, date) => {
        const day = date.getDate();
        const month = date.getMonth();
        if (type === 'first') {
            return day !== 1;
        } else if (type === 'last') {
            const nextDay = new Date(date.getTime());
            nextDay.setDate(nextDay.getDate() + 1);
            return (nextDay.getMonth() === month);
        }
    };
};
const contextData = ref([]);
const addContextData = () => {
    contextData.value.push({ key: '', value: '' });
};
const removeContextData = (index) => {
    contextData.value.splice(index, 1);
};
defineExpose({
    show,
});
</script>

<style scoped>
.contextData {
    height: 200px;
    overflow-y: auto;
    border: 1px solid #ccc;
    text-align: left;
    margin: 2px 0px;
    padding: 5px;
}
</style>