<template>
    <draggable ghost-class="ghost" handle=".drag-handle" :list="xSeries" direction="horizontal" class="draggable-area"
        @start="drag = true" @end="drag = false" item-key="id">
        <template #item="{ element, index }">
            <div :key="index" class="drag-handle">
                <dropdown-button :id="`x-series-${index}`" ref="setXDimensionDDRef" size="sm small-dd-title"
                    class="mt-2 me-1 pull-right" :variant="element.attribute ? 'outline-secondary' : 'outline-danger'"
                    :keep-open="true">
                    <template #button-content>
                        {{ getDisplayXDimensionLabel(element, 'Selecione...', 'grupos', 'tamanho',
                            'Categórico')
                        }}
                    </template>
                    <template #content>
                        <b-dropdown-form form-class="right-drop-form">
                            <div class="row series-form">
                                <div class="col-6">
                                    <b-form-group :label="$t('common.attribute', 1) + ':'">
                                        <chart-builder-attribute-selector :attributes="attributes"
                                            v-model="element.attribute" />
                                    </b-form-group>
                                    <b-form-group v-if="!pieFamily" label="Rótulo para legenda:">
                                        <b-form-input v-model="element.displayLabel" type="text"
                                            class="form-control form-control-sm" maxlength="100" debounce="500" />
                                    </b-form-group>

                                    <div v-if="isNumeric(element.attribute)">
                                        <b-form-group label="Agrupamento (bins):">
                                            <select v-model="element.binning" tabindex="-1"
                                                class="form-select form-select-sm">
                                                <option v-for="value, k in binningOptions" :key="k" :value="k">
                                                    {{ value }}
                                                </option>
                                            </select>
                                        </b-form-group>
                                        <b-form-group v-if="element.binning === 'EQUAL_INTERVAL'"
                                            label="Número de grupos (bins):">
                                            <b-form-input v-model.number="element.bins" type="number"
                                                class="form-control form-control-sm w-25" max="1000" min="1"
                                                debounce="500" />
                                        </b-form-group>
                                        <b-form-group v-if="element.binning === 'FIXED_SIZE'" label="Tamanho dos grupos:">
                                            <b-form-input v-model.number="element.bin_size" type="number"
                                                class="form-control form-control-sm w-25" max="1000" min="1"
                                                debounce="500" />
                                        </b-form-group>
                                        <b-form-group v-if="element.binning === 'QUANTILES'"
                                            label="Quantis (inteiros separados por vírgula):">
                                            <b-form-input v-model="element.quantiles" type="text"
                                                class="form-control form-control-sm w-100" max="1000" min="1"
                                                debounce="500" />
                                        </b-form-group>

                                        <b-form-group v-if="false" label="Computação:">
                                            <select v-model="element.compute" class="form-select form-select-sm">
                                                <option></option>
                                                <option v-for="value, k in computeOptions" :key="k" :value="k">
                                                    {{ value }}
                                                </option>
                                            </select>
                                        </b-form-group>
                                        <b-form-group v-if="!pieFamily" label="Multiplicar:">
                                            <b-form-input v-model.number="element.multiplier" type="number"
                                                class="form-control form-control-sm w-25" max="1000000000000" min="1"
                                                debounce="500" />
                                        </b-form-group>
                                        <b-form-group label="Casas decimais:">
                                            <b-form-input v-model.number="element.decimal_places" type="number"
                                                class="form-control form-control-sm w-25" max="6" min="0" debounce="500" />
                                        </b-form-group>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <b-form-group v-if="!pieFamily" label="Tratar valores vazios:">
                                        <select class="form-select form-select-sm" v-model="element.handleEmpty">
                                            <option v-for="value, k in handleEmptyOptions" :key="k" :value="k">
                                                {{ value }}
                                            </option>
                                        </select>
                                    </b-form-group>
                                    <b-form-group label="Ordenação:">
                                        <select v-model="element.sorting" class="form-select form-select-sm">
                                            <option v-for="value, k in sorting" :key="k" :value="k">
                                                {{ value }}
                                            </option>
                                        </select>
                                    </b-form-group>

                                    <b-form-group label="Limitar qtde. de valores:">
                                        <input v-model.number="element.max_displayed" type="number"
                                            class="form-control form-control-sm">
                                    </b-form-group>
                                    <b-form-group v-if="element.max_displayed !== 0">
                                        <b-form-checkbox v-model="element.group_others">
                                            Agrupar os outros valores
                                        </b-form-checkbox>
                                    </b-form-group>
                                    <b-form-group v-if="element.max_displayed !== 0 && element.group_others"
                                        label="Nome para 'outros valores'">
                                        <input v-model="element.label_others" type="text"
                                            class="form-control form-control-sm">
                                    </b-form-group>
                                    <template v-if="!pieFamily">
                                        <b-form-group label="Prefixo:">
                                            <b-form-input v-model="element.prefix" type="text"
                                                class="form-control form-control-sm" maxlength="20" debounce="500" />
                                        </b-form-group>
                                        <b-form-group v-if="!pieFamily" label="Sufixo:">
                                            <b-form-input v-model="element.suffix" type="text"
                                                class="form-control form-control-sm" maxlength="20" debounce="500" />
                                        </b-form-group>
                                    </template>
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
                                <div class="col-12">
                                    <b-button size="sm" variant="danger" class="float-end mt-2"
                                        @click="emit('onDelete', element, index, $event)">
                                        {{ $t('actions.delete') }}
                                    </b-button>
                                </div>
                            </div>
                        </b-dropdown-form>
                    </template>
                </dropdown-button>
                <font-awesome-icon v-if="canAddXDimension" icon="fa fa-grip-vertical" />
            </div>
        </template>
    </draggable>
</template>
<script setup>
import { computed, onBeforeMount } from 'vue';
import ChartBuilderAttributeSelector from './ChartBuilderAttributeSelector.vue';
import Draggable from 'vuedraggable';
import DropdownButton from '@/components/DropdownButton.vue';

const attributesMap = {};

onBeforeMount(() =>
    props.attributes.forEach(a => attributesMap[a.name] = a)
);

const props = defineProps({
    attributes: { type: Array, required: true },
    type: { type: String, required: true },
    x: { type: Object, required: true },
    y: { type: Object, required: true },
})

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

const sorting = {
    NATURAL: 'Ordenação natural',
    Y_ASC: 'Valor do eixo Y (ascendente)',
    Y_DESC: 'Valor do eixo Y (descendente)'
};
const handleEmptyOptions = {
    ZEROS: 'Substituir por zeros',
    AVERAGE: 'Ligar pontos vizinhos',
    DASHED: 'Interromper linha',
};
const computeOptions = {
    'NORMAL': 'NORMAL',
    'PERCENTAGE SCALE': 'PERCENTAGE SCALE',
    'CUMULATIVE': 'CUMULATIVE',
    'CUMULATIVE_PERCENTAGE': 'CUMULATIVE_PERCENTAGE'
};
const binningOptions = {
    EQUAL_INTERVAL: 'Número fixo de grupos com intervalos iguais',
    FIXED_SIZE: 'Grupos com comprimento de intervalo fixo',
    NONE: 'Nenhuma transformação',
    QUANTILES: 'Quantis (em %)',
    CATEGORICAL: 'Tratar valores como categóricos',
}

const xSeries = defineModel('xSeries');
const emit = defineEmits(['onChange', 'onDelete']);

const handleChange = (args) => {
    emit('onChange', args);
}
const isNumeric = (attributeName) => {
    const b = !!props.attributes && attributesMap[attributeName] &&
        attributesMap[attributeName].numeric;
    return b;
};

const limitXDimension = computed(() => {
    let result = Number.MAX_SAFE_INTEGER;
    if (['pie', 'donut', 'scatter', ].includes(props.type)) {
        result = 1;
    } else if (props.x.length >= 2 && props.type !== 'treemap') {
        result = 2;
    }
    return result;
});
const canAddXDimension = computed(() => {
    let result = true;
    result = (limitXDimension.value > props.x.length);
    return result;
});

const pieFamily = computed(() =>
    ['donut', 'pie'].includes(props.type)
);

const getDisplayXDimensionLabel = (obj, defaultValue, bins, size, categorical) => {
    if (!obj.attribute) {
        return defaultValue;
    }
    if (!isNumeric(obj.attribute)) {
        return obj.attribute;
    }
    switch (obj.binning) {
        case 'EQUAL_INTERVAL':
            return `${obj.attribute} (${obj.bins} ${bins})`;
        case 'FIXED_SIZE':
            return `${obj.attribute} (${bins} ${size} ${obj.bin_size} )`;
        case 'QUANTILES':
            return `${obj.attribute} (quantis informados)`;
        case 'NONE':
            return obj.attribute;
        case 'CATEGORICAL':
            return `${obj.attribute} (${categorical})`;
        default:
            return obj.attribute;
    }
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