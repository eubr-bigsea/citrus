<template>
    <draggable ghost-class="ghost" handle=".drag-handle" :list="ySeries" direction="vertical" class="draggable-area"
        @start="drag = true" @end="drag = false" @change="handleChange" item-key="id">
        <template #item="{ element, index }">
            <div :key="index" class="drag-handle" :data-test="`y-series-${index}`">
                <dropdown-button size="sm" class="mt-2 me-1 pull-right"
                    :variant="'outline-secondary small-dd-title ' + (element.enabled ? '' : 'text-decoration-line-through')" :keep-open="true">
                    <template #button-content>
                        {{ element.aggregation.toUpperCase() }}
                        {{ element.aggregation !== '' ? `(${element.attribute})` : element.attribute }}
                    </template>
                    <template #content>
                        <b-dropdown-form form-class="right-drop-form">
                            <div class="row series-form">
                                <div class="col-6">
                                    <b-form-group :label="$t('common.attribute', 1) + ':'">
                                        <chart-builder-attribute-selector
                                            :attributes="[{ name: '*', type: 'CHARACTER' }, ...attributes]"
                                            v-model="element.attribute" />
                                    </b-form-group>
                                    <b-form-group>
                                        <b-form-checkbox v-model="element.enabled">
                                            Habilitado
                                        </b-form-checkbox>
                                    </b-form-group>
                                    <b-form-group v-if="!pieFamily" label="Rótulo para legenda:">
                                        <b-form-input v-model="element.label" type="text"
                                            class="form-control form-control-sm" maxlength="100" debounce="500" />
                                    </b-form-group>

                                    <b-form-group label="Função de agregação:">
                                        <select v-model="element.aggregation" class="form-select form-select-sm">
                                            <option v-if="element.attribute !== '*'" label="" value="">
                                                Usar valor sem
                                                agregar
                                            </option>
                                            <option value="COUNT">
                                                Contar (COUNT)
                                            </option>
                                            <option value="COUNTD">
                                                Contar distintos (COUNT DISTINCT)
                                            </option>
                                            <option v-if="element.attribute !== '*'" value="AVG">
                                                Média (AVG)
                                            </option>
                                            <option v-if="element.attribute !== '*'" value="SUM">
                                                Soma (SUM)
                                            </option>
                                            <option v-if="element.attribute !== '*'" value="MIN">
                                                Mínimo (MIN)
                                            </option>
                                            <option v-if="element.attribute !== '*'" value="MAX">
                                                Máximo (MAX)
                                            </option>
                                        </select>
                                    </b-form-group>
                                    <b-form-group v-if="false" label="Computação:">
                                        <select v-model="element.compute" class="form-select form-select-sm">
                                            <option v-for="value, k in computeOptions" :key="k" :value="k">
                                                {{ value }}
                                            </option>
                                        </select>
                                    </b-form-group>
                                    <b-form-group label="Multiplicar:">
                                        <b-form-input v-model.number="element.multiplier" type="number"
                                            class="form-control form-control-sm" max="1000000000000" min="1"
                                            debounce="500" />
                                    </b-form-group>
                                    <b-form-group label="Casas decimais:">
                                        <b-form-input v-model.number="element.decimal_places" type="number"
                                            class="form-control form-control-sm w-25" max="6" min="0" debounce="500" />
                                    </b-form-group>
                                </div>
                                <div class="col-6">
                                    <b-form-group v-if="!pieFamily" label="Prefixo:">
                                        <b-form-input v-model="element.prefix" type="text"
                                            class="form-control form-control-sm" maxlength="20" debounce="500" />
                                    </b-form-group>
                                    <b-form-group v-if="!pieFamily" label="Sufixo:">
                                        <b-form-input v-model="element.suffix" type="text"
                                            class="form-control form-control-sm" maxlength="20" debounce="500" />
                                    </b-form-group>
                                    <b-form-group v-if="!['donut', 'pie'].includes(type)">
                                        <template #label>
                                            <b-form-checkbox v-model="element.custom_color">
                                                Usar cor personalizada
                                            </b-form-checkbox>
                                        </template>
                                        <b-form-input v-if="element.custom_color" v-model="element.color" type="color"
                                            class="form-control form-control-sm w-25" />
                                    </b-form-group>
                                    <b-form-group v-if="!pieFamily" label="Tipo de linha:">
                                        <v-select v-model="element.stroke"
                                            :options="['solid', 'dot', 'dash', 'longdash', 'dashdot', 'longdashdot']"
                                            :searchable="false" class="select2-small">
                                            <template #option="{ label }">
                                                <div :class="`stroke stroke-${label}`">{{ label }}</div>
                                            </template>

                                            <template #selected-option="{ label }">
                                                <div :class="`stroke stroke-${label}`">{{ label }}</div>
                                            </template>
                                        </v-select>
                                    </b-form-group>
                                    <b-form-group label="Espessura da linha:">
                                        <select v-model.number="element.strokeSize"
                                            class="form-control form-control-sm w-50">
                                            <option v-for="inx in 11" :key="inx - 1" :value="inx - 1">
                                                {{ inx - 1 }}
                                            </option>
                                        </select>
                                    </b-form-group>
                                    <b-form-group label="Cor da Linha:" label-for="line-width">
                                        <b-form-input v-model="element.line_color" type="color"
                                            class="form-control form-control-sm w-50" />
                                    </b-form-group>
                                    <b-form-group v-if="type.endsWith('bar') || type.endsWith('area')"
                                        label="Padrão de preenchimento:">
                                        <v-select v-model="element.shape" :options="shapes" label="label"
                                            :reduce="(opt) => opt.name" :searchable="false" style="font-size:10pt">
                                            <template #option="{ label, icon }">
                                                <img :src="getShapeIcon(icon)" style="width:20px; height: 20px">
                                                {{ label }}
                                                <!--<div class="bg-chart" :class="`bg-${name}`"></div>-->
                                            </template>

                                            <template #selected-option="{ label, icon }">
                                                <div>
                                                    <img :src="getShapeIcon(icon)" style="width:20px; height: 20px">
                                                    {{ label }}
                                                    <!--<div class="bg-chart" :class="`bg-${name}`"></div> -->
                                                </div>
                                            </template>
                                        </v-select>
                                    </b-form-group>
                                    <!-- FIXME 
                                    <b-form-group label="Exibir eixo:">
                                        <select class="form-control form-control-sm">
                                            <option label="LEFT" value="LEFT">Esquerda</option>
                                            <option label="DIREITA" value="DIREITA">Direita</option>
                                            <option label="HIDE" value="HIDE">Ocultar</option>
                                        </select>
                                    </b-form-group>
                                    <b-form-checkbox> Usar escala logarítmica </b-form-checkbox>
                                    <b-form-group label="Faixa de valores:">
                                        <b-form-radio> Automática </b-form-radio>
                                        <b-form-radio> Manual </b-form-radio>
                                        <input type="number" class="form-control form-control-sm mb-2" placeholder="min" />
                                        <input type="number" class="form-control form-control-sm" placeholder="max" />

                                    </b-form-group>
                                    -->
                                </div>
                                <div class="col-12 border-top pt-2 mt-2">
                                    <b-button size="sm" variant="danger" class="float-end"
                                        @click="emit('onDelete', index, element)">
                                        {{ $t('actions.delete') }}
                                    </b-button>
                                </div>
                            </div>
                        </b-dropdown-form>
                    </template>
                </dropdown-button>
                <font-awesome-icon v-if="canAddYDimension" icon="fa fa-grip-vertical" />
            </div>
        </template>
    </draggable>
</template>
<script setup>
import { computed } from 'vue';
import ChartBuilderAttributeSelector from './ChartBuilderAttributeSelector.vue';
import Draggable from 'vuedraggable';
import DropdownButton from '@/components/DropdownButton.vue';
import vSelect from 'vue-select';
const props = defineProps({
    oldSeries: { type: Array, required: false, default: () => [] },
    attributes: { type: Array, required: true },
    type: { type: String, required: true },
    x: { type: Object, required: true },
    y: { type: Object, required: true },
})
const ySeries = defineModel('ySeries');
const emit = defineEmits(['onChange', 'onDelete']);

const shapes = [
    { name: '', label: 'Sólido', icon: 'solid' },
    { name: '/', label: 'Diagonal direita', icon: 'right-diag' },
    { name: '\\\\', label: 'Diagonal esquerda', icon: 'left-diag' },
    { name: 'x', label: 'Formato em X', icon: 'x-format' },
    { name: '-', label: 'Linha horizontal', icon: 'horizontal' },
    { name: '|', label: 'Linha vertical', icon: 'vertical' },
    { name: '+', label: 'Cruz', icon: 'crosses' },
    { name: '.', label: 'Ponto', icon: 'points' },
];
const handleChange = (args) => {
    emit('onChange', args);
}
const limitYDimension = computed(() => {
    let result = Number.MAX_SAFE_INTEGER;
    if (
        (['pie', 'donut', 'scatter', 'treemap'].includes(props.type))
        || (props.x.length >= 2)
    ) {
        result = 1;
    }
    return result;
});

const canAddYDimension = computed(() => {
    let result = true;
    result = (limitYDimension.value > props.y.length);
    return result;
});
const pieFamily = computed(() =>
    ['donut', 'pie'].includes(props.type)
);

const getShapeIcon = (type) => {
    const base = import.meta.url;
    const url = new URL(`@/assets/charts/shapes/${type}.svg`, base).href;
    return url;
};


</script>
<style scoped>
.drag-handle {
    float: left;
    margin-right: 0px;
}

.drag-handle>svg {
    margin: -5px 10px -5px -2px;
}

.ghost {
    background: #ddd;
    padding: -20px 0 0 0;
    margin: 0;
    opacity: 100%;
}
</style>