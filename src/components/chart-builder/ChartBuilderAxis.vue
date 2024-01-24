<template>
    <div>
        <b-card class="mt-1">
            <template v-if="mapFamily">
                <chart-builder-map-axis v-model:latitude="latitude" v-model:longitude="longitude" v-model:colorAttribute="colorAttribute"
                                        v-model:sizeAttribute="sizeAttribute" v-model:textAttribute="textAttribute"
                                        :attributes="attributes" />
            </template>
            <template v-else>
                <div class="clearfix">
                    <chart-builder-y-axis v-if="hasAxis" v-model:yLabel="yLabel" v-model:yLowerBound="yLowerBound"
                                          v-model:yUpperBound="yUpperBound" v-model:yLogScale="yLogScale" v-model:yDisplay="yDisplay"
                                          v-model:yDisplayLabel="yDisplayLabel" v-model:yPrefix="yPrefix" v-model:ySuffix="ySuffix"
                                          :has-axis="hasAxis" />
                    <div v-else class="axis-label">
                        Exibir
                    </div>
                    <div>
                        <chart-builder-y-series v-model="ySeries" :attributes="attributes" :type="type" :x="x"
                                                :y="y" 
                                                @on-move="handleYAxisDrag" @on-change="handleYAxisDragEnd" @on-delete="handleDeleteY" />
                      
                        <b-button v-if="canAddYDimension" size="sm" variant="success small-dd-title"
                                  class="mt-2 float-start" data-test="add-y" @click="handleAddY">
                            <font-awesome-icon prefix="fa" icon="plus" />
                        </b-button>
                    </div>
                </div>
                <div class="clearfix">
                    <chart-builder-x-axis v-if="hasAxis" v-model:xLabel="xLabel" v-model:xLowerBound="xLowerBound"
                                          v-model:xUpperBound="xUpperBound" v-model:xLogScale="xLogScale" v-model:xDisplay="xDisplay"
                                          v-model:xDisplayLabel="xDisplayLabel" v-model:xPrefix="xPrefix" v-model:xSuffix="xSuffix"
                                          :has-axis="hasAxis" />
                    <div v-else class="axis-label">
                        Por
                    </div>
                    <div>
                        <chart-builder-x-series v-model="xSeries" :attributes="attributes" :type="type" :x="x"
                                                :y="y" 
                                                @on-delete="handleDeleteX" />
                        <b-button v-if="canAddXDimension" size="sm" variant="success small-dd-title"
                                  class="mt-2 float-start clearfix" data-test="add-x" @click="handleAddX">
                            <font-awesome-icon prefix="fa" icon="plus" />
                        </b-button>
                    </div>
                </div>
            </template>
        </b-card>
    </div>
</template>
<script setup>
import { XDimension, YDimension } from '@/views/data-explorer/entities.js';
import { computed, defineEmits, defineModel, defineProps } from "vue";
import ChartBuilderMapAxis from './ChartBuilderMapAxis.vue';
import ChartBuilderXAxis from './ChartBuilderXAxis.vue';
import ChartBuilderXSeries from './ChartBuilderXSeries.vue';
import ChartBuilderYAxis from './ChartBuilderYAxis.vue';
import ChartBuilderYSeries from './ChartBuilderYSeries.vue';

const yLabel = defineModel('yLabel');
const yLowerBound = defineModel('yLowerBound');
const yUpperBound = defineModel('yUpperBound');
const yLogScale = defineModel('yLogScale');
const yDisplay = defineModel('yDisplay');
const yDisplayLabel = defineModel('yDisplayLabel');
const yPrefix = defineModel('yPrefix');
const ySuffix = defineModel('ySuffix');

const xLabel = defineModel('xLabel');
const xLowerBound = defineModel('xLowerBound');
const xUpperBound = defineModel('xUpperBound');
const xLogScale = defineModel('xLogScale');
const xDisplay = defineModel('xDisplay');
const xDisplayLabel = defineModel('xDisplayLabel');
const xPrefix = defineModel('xPrefix');
const xSuffix = defineModel('xSuffix');

const x = defineModel('x');
const y = defineModel('y');
// Map
const latitude = defineModel('latitude');
const longitude = defineModel('longitude');

const colorAttribute = defineModel('colorAttribute');
const sizeAttribute = defineModel('sizeAttribute');
const textAttribute = defineModel('textAttribute');

const emit = defineEmits(['input']);

const props = defineProps({
    workflow: { type: Object, required: true },
    attributes: { type: Array, required: true },
    value: {
        type: Object, required: true,
        default: () => ({
            x_axis: { value: {} }, y_axis: { value: {} },
            x: { value: {} }, y: { value: {} },
            color_attribute: { value: null }, text_attribute: { value: null }, size_attribute: { value: null },
            latitude_attribute: { value: null }, longitude_attribute: { value: null }
        })
    },
    type: { type: String, required: false, default: null }
});

/* Computed */

const mapFamily = computed(() =>
    ['scattermapbox'].includes(props.type)
);

const hasAxis = computed(() => {
    return !['pie', 'donut', 'indicator'].includes(props.type);
}
);
const xSeries = computed(() =>
    //FIXME x.value.slice(0, limitXDimension.value)
    x.value.slice(0, limitXDimension.value)
);
const ySeries = computed({
    get: () =>
        y.value.slice(0, limitYDimension.value), //.map((item) => ({ ...item, id: item.id || generateId() }))
    set: (newValue) => {
        y.value = newValue;
    }
});
const limitXDimension = computed(() => {
    let result = Number.MAX_SAFE_INTEGER;
    if (['pie', 'donut', 'scatter'].includes(props.type)) {
        result = 1;
    } else if (x.value.length >= 2 && props.type !== 'treemap') {
        result = 2;
    }
    return result;
});
const limitYDimension = computed(() => {
    let result = Number.MAX_SAFE_INTEGER;
    if (
        (['pie', 'donut', 'scatter', 'treemap'].includes(props.type))
        || (x.value.length >= 2)
    ) {
        result = 1;
    }
    return result;
});
const canAddXDimension = computed(() => {
    let result = true;
    result = (limitXDimension.value > x.value.length);
    return result;
});
const canAddYDimension = computed(() => {
    let result = true;
    result = (limitYDimension.value > y.value.length);
    return result;
});

/* Methods */
const handleYAxisDrag = (info, evt) => { return true; };
const handleYAxisDragEnd = (info) => {
    const { moved } = info;
    if (moved && false) {
        const draggedIndex = moved.oldIndex;
        const index = moved.newIndex;
        const draggedItem = y.value[draggedIndex];
        y.value.splice(draggedIndex, 1);
        y.value.splice(index, 0, draggedItem);
        console.debug(draggedIndex, '=>', index);
    }
    return true;
};

const handleAddY = () => y.value.push(new YDimension({}));
const handleAddX = () => x.value.push(new XDimension({}));
const handleDeleteY = (index, element, ev) => {
    const idx = y.value.indexOf(element);
    console.debug('index', index, idx);
    y.value.splice(idx, 1);
    document.body.click(); // to close the dialog
};
const handleDeleteX = (index, element, ev) => {
    const idx = x.value.indexOf(element);
    x.value.splice(idx, 1);
};
</script>
<style>
.small-dd-title {
    font-size: 8pt;
    /* padding-top: 6px;
    padding-bottom: 7px; */
}

.axis-form {

    zoom: .8;
    width: 480px;
}

.series-form {
    width: 640px;
    zoom: .8;
}
</style>
<style scoped>
.half-series-form {
    width: 260px;
    zoom: .8;
}


.axis-label {
    float: left;
    width: 60px;
    margin-top: 8px;
}


.stroke-dashdot {
    width: 124px;
    height: 32px;
    background: url('@/assets/stroke.png') -156px -62px;
}

.stroke-dot {
    width: 124px;
    height: 32px;
    background: url('@/assets/stroke.png') -10px -114px;
}


.stroke-dash {
    width: 124px;
    height: 32px;
    background: url('@/assets/stroke.png') -154px -114px;
}

.stroke-longdashdot {
    width: 126px;
    height: 32px;
    background: url('@/assets/stroke.png') -10px -10px;
}

.stroke-longdash {
    width: 126px;
    height: 32px;
    background: url('@/assets/stroke.png') -10px -62px;
}

.stroke-longdashdotdot {
    width: 126px;
    height: 32px;
    background: url('@/assets/stroke.png') -156px -10px;
}

.stroke-solid {
    width: 124px;
    height: 32px;
    background: url('@/assets/stroke.png') -10px -166px;
}

.stroke {
    margin-top: 0px;
    padding-right: 200px;
    text-wrap: nowrap;
    background-position-x: 80px;
    background-repeat: no-repeat;
}
</style>
