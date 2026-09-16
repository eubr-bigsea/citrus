<template>
    <b-modal ref="scheduleModal" :title="$t('pipeline.schedule.scheduleTitle')" button-size="sm" @ok="confirm" @cancel="handleCancel"
        :ok-disabled="testFormOk" size="lg">

        <h6>{{ id }} - {{ name }}</h6>
        <p>
            {{$t('pipeline.schedule.scheduleInstructions')}}
        </p>
        <div class="row">
            <div class="col-6">
                <select v-model.number="month" class="form-select form-control-sm">
                    <option />
                    <option v-for="m, i in getMonthNames" :key="m" :value="i + 1">
                        {{m}}
                    </option>
                </select>
            </div>
            <div class="col-3">
                <select v-model.number="year" class="form-select form-control-sm">
                    <option />
                    <option v-for="y in getYears" :key="y" :value="y">
                        {{y}}
                    </option>
                </select>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <label>{{$t('pipeline.schedule.contextData')}}</label>
                <div class="contextData">
                    <template v-if="contextData.length">
                        <div v-for="(pair, index) in contextData" :key="index"
                            class="d-flex align-items-center mb-2">
                            <input type="text" class="form-control form-control-sm me-2" v-model="pair.name"
                                :placeholder="$t('pipeline.schedule.contextName')" maxlength="50" />
                            <input type="text" class="form-control form-control-sm me-2" v-model="pair.value"
                                :placeholder="$t('pipeline.schedule.contextValue')" maxlength="200" />
                            <button type="button" class="btn btn-sm btn-danger ms-2" @click="removeContextData(index)">
                                <font-awesome-icon icon="fa fa-trash" />
                            </button>
                        </div>
                    </template>
                    <div v-else class="text-center">
                        {{$t('pipeline.schedule.noContextData')}}
                    </div>
                </div>
                <button type="button" class="btn btn-sm btn-primary" @click="addContextData">
                    {{$t('pipeline.schedule.addContextData')}}
                </button>
            </div>
        </div>
    </b-modal>
</template>

<script setup>
import { ref, computed } from 'vue';
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

const show = (modalId, modalName) => {

    id.value = modalId;
    name.value = modalName;
    scheduleModal.value.show();
};
const testFormOk = computed(() => {
    return (!month.value || !year.value || contextData.value.some(data => !data.name || !data.value))
});
const emit = defineEmits(['on-schedule-pipeline']);
const confirm = () => {
    emit('on-schedule-pipeline', id.value,
        // In JS, months start from 0 !!!
        new Date(year.value, month.value - 1, 1),
        new Date(year.value, month.value, 0),
        contextData.value
    );
};

const handleCancel = () => {
    contextData.value = [];
    scheduleModal.value.hide();
};
const contextData = ref([]);
const addContextData = () => {
    contextData.value.push({ name: '', value: '' });
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