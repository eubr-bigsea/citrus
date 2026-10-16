<template>
    <b-modal ref="scheduleModal" :title="$t('pipeline.schedule.scheduleTitle')" button-size="sm" @ok="confirm" @cancel="handleCancel"
        :ok-disabled="testFormOk" size="lg">

        <h6>{{ id }} - {{ name }}</h6>
        <p>
            {{$t('pipeline.schedule.scheduleInstructions')}}
        </p>
        <div class="row">
            <div class="col-4">
                <label>{{$t('pipeline.schedule.startDate')}}</label>
                <input v-model="start" type="date" class="form-control form-control-sm" :max="end || undefined">
            </div>
            <div class="col-4">
                <label>{{$t('pipeline.schedule.endDate')}}</label>
                <input v-model="end" type="date" class="form-control form-control-sm" :min="start || undefined">
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <label>{{$t('titles.comment')}}</label>
                <textarea v-model="comment" class="form-control form-control-sm" rows="2" maxlength="200" />
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

const start = ref(null);
const end = ref(null);
const comment = ref('');
const name = ref(null);
const id = ref(null);
const scheduleModal = ref(null);

const show = (modalId, modalName) => {

    id.value = modalId;
    name.value = modalName;
    scheduleModal.value.show();
};
const testFormOk = computed(() => {
    return (!start.value || !end.value || start.value > end.value
        || contextData.value.some(data => !data.name || !data.value))
});
const emit = defineEmits(['on-schedule-pipeline']);
const confirm = () => {
    emit('on-schedule-pipeline', id.value,
        new Date(`${start.value}T00:00:00`),
        new Date(`${end.value}T00:00:00`),
        contextData.value,
        comment.value || null
    );
};

const handleCancel = () => {
    contextData.value = [];
    comment.value = '';
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