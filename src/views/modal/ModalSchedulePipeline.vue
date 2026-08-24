<template>
    <b-modal ref="scheduleModal" :title="$t('pipeline.schedule.scheduleTitle')" button-size="sm" @ok="confirm" @cancel="handleCancel"
        :ok-disabled="testFormOk" size="lg">

        <h6>{{ id }} - {{ name }}</h6>
        <p>
            {{$t('pipeline.schedule.scheduleInstructions')}}
        </p>
        <div class="row">
            <div class="col-6">
                <input v-model="monthYear" type="month" class="form-control form-control-sm">
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <label>{{$t('pipeline.schedule.contextData')}}</label>
                <div class="contextData">
                    <div v-if="contextData" v-for="(pair, index) in contextData" :key="index"
                        class="d-flex align-items-center mb-2">
                        <input type="text" class="form-control form-control-sm mr-2" v-model="pair.name"
                            :placeholder="$t('pipeline.schedule.contextName')" maxlength="50" />
                        <input type="text" class="form-control form-control-sm mr-2" v-model="pair.value"
                            :placeholder="$t('pipeline.schedule.contextValue')" maxlength="200" />
                        <button type="button" class="btn btn-sm btn-danger ml-2" @click="removeContextData(index)">
                            <font-awesome-icon icon="fa fa-trash" />
                        </button>
                    </div>
                    <div v-if="contextData.length === 0" class="text-center">
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

const monthYear = ref('');
const name = ref(null);
const id = ref(null);
const scheduleModal = ref(null);

const show = (modalId, modalName) => {

    id.value = modalId;
    name.value = modalName;
    scheduleModal.value.show();
};
const testFormOk = computed(() => {
    return (!monthYear.value || contextData.value.some(data => !data.name || !data.value))
});
const emit = defineEmits(['on-schedule-pipeline']);
const confirm = () => {
    const [year, month] = monthYear.value.split('-').map(Number);
    emit('on-schedule-pipeline', id.value,
        // In JS, months start from 0 !!!
        new Date(year, month - 1, 1),
        new Date(year, month, 0),
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