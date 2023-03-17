<template>
    <div v-if="editableVisualization" class="chart-builder-options">
        <b-form class="chart-properties">
            <b-form-group id="title" label="Tipo do gráfico:" label-for="title">
                <v-select v-model="editableVisualization.type.value" :options="chartTypes" label="label"
                    :reduce="(opt) => opt.name" :searchable="false" style="font-size:8pt">
                    <template #option="{ label, name }">
                        <img :src="getChartIcon(name)" style="width:20px; height: 20px" />
                        {{ label }}
                        <!--<div class="bg-chart" :class="`bg-${name}`"></div>-->
                    </template>

                    <template #selected-option="{ label, name }">
                        <div>
                            <img :src="getChartIcon(name)" style="width:20px; height: 20px" />
                            {{ label }}
                            <!--<div class="bg-chart" :class="`bg-${name}`"></div> -->
                        </div>
                    </template>
                </v-select>
            </b-form-group>
            <b-form-group>
                <label>{{ $tc('common.title') }}:</label>
                <b-form-input maxlength="50" v-model="editableVisualization.title.value" class="form-control-sm" />
            </b-form-group>

            <div class="accordion options-font" role="tablist">
                <b-card no-body class="mb-0">
                    <b-card-header header-tag="header" class="p-0" role="tab">
                        <b-button block v-b-toggle.accordion-2 variant="light" size="sm">Legenda, temas e cores
                        </b-button>
                    </b-card-header>
                    <b-collapse id="accordion-2" visible accordion="my-accordion" role="tabpanel">
                        <b-card-body class="p-2">
                            <label>Exibir legenda:</label>
                            <select v-model="editableVisualization.display_legend.value"
                                class="form-control form-control-sm">
                                <option value="HIDE">Ocultar</option>
                                <option value="AUTO">Posicionar automaticamente</option>
                                <option value="LEFT">Topo à esquerda</option>
                                <option value="RIGHT">Topo à direita</option>
                                <option value="CENTER">Topo ao centro</option>
                                <option value="BOTTOM_LEFT">Na parte inferior, à esquerda</option>
                                <option value="BOTTOM_RIGHT">Na parte inferior, à direita</option>
                                <option value="BOTTOM_CENTER">Na parte inferior, ao centro</option>
                            </select>
                            <label class="mt-2">Tema:</label>
                            <select v-model="editableVisualization.template.value"
                                class="form-control form-control-sm mb-2">
                                <option value="none">Nenhum</option>
                                <option value="ggplot2">Ggplot2</option>
                                <option value="seaborn">Seaborn</option>
                                <option value="simple_white">Branco simples</option>
                                <option value="plotly">Plotly</option>
                                <option value="plotly_white">Plotly (Branco)</option>
                                <option value="plotly_dark">Plotly (Escuro)</option>
                                <option value="presentation">Apresentação</option>
                                <option value="xgridoff">Grade desabilitada eixo X</option>
                                <option value="ygridoff">Grade desabilitada eixo Y</option>
                                <option value="gridon">Grid habilitada</option>
                            </select>

                            <label>Atributo usado para cor:</label>
                            <v-select v-model="editableVisualization.color_attribute.value" :options="attributes"
                                label="name" value="name" :append-to-body="true"></v-select>

                            <label>Atributo usado para tamanho:</label>
                            <v-select v-model="editableVisualization.size_attribute.value" :options="attributes"
                                label="name" value="name" :append-to-body="true"></v-select>
                            <!--
                                <b-dropdown dropdown size="sm" ref="axis" class="mt-2 mr-1 w-75" variant="light xsmall-dd-title" :boundary="'window'">
                                    <template #button-content>
                                        {{ editableVisualization.color_attribute.value === '*' ? 'COUNT' : editableVisualization.color_aggregation.value.toUpperCase() }}
                                        {{ editableVisualization.color_aggregation.value !== '' ? `(${editableVisualization.color_attribute.value})` : editableVisualization.color_attribute.value }}
                                    </template>
                                    <b-dropdown-form form-class="down-drop-form">
                                        <div class="row xseries-form">
                                            <div class="col-10">
                                                <b-form-group :label="$tc('common.attribute', 1) + ':'"
                                                    label-for="dropdown-form-email">
                                                    <select class="form-control form-control-sm mt-2"
                                                        v-model="editableVisualization.color_attribute.value">
                                                        <option value="*"># Total de registros</option>
                                                        <option v-for="attr in attributes" :value="attr.name">
                                                            {{ attr.name }}
                                                            ({{ attr.type }})
                                                        </option>
                                                    </select>
                                                </b-form-group>

                                                <b-form-group v-if="editableVisualization.color_atribute !== '*'"
                                                    label="Função de agregação:">
                                                    <select class="form-control form-control-sm"
                                                        v-model="editableVisualization.color_aggregation.value">
                                                        <option label="" value="">Usar valor sem agregar</option>
                                                        <option label="COUNT" value="COUNT">COUNT</option>
                                                        <option label="COUNTD" value="COUNTD">COUNT DISTINCT</option>
                                                        <option label="AVG" value="AVG">AVG</option>
                                                        <option label="SUM" value="SUM">SUM</option>
                                                        <option label="MIN" value="MIN">MIN</option>
                                                        <option label="MAX" value="MAX">MAX</option>
                                                    </select>
                                                </b-form-group>
                                            </div>
                                        </div>
                                    </b-dropdown-form>
                                </b-dropdown>-->

                            <color-palette :field="palette" :value="editableVisualization.palette.value"
                                @update="handleUpdatePalette" />
                            <color-scale v-if="true || editableVisualization.type.value === 'treemap'" :field="colorScale"
                                :value="editableVisualization.color_scale.value" @update="handleUpdateColorScale" />

                            <b-form-checkbox v-model="editableVisualization.blackWhite.value" switch>
                                Gráfico preto e branco
                            </b-form-checkbox>

                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card no-body class="mb-0">
                    <b-card-header header-tag="header" class="p-0 options-font" role="tab">
                        <b-button block v-b-toggle.accordion-1 variant="light" size="sm">Aparência</b-button>
                    </b-card-header>

                    <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
                        <b-card-body class="p-2">
                            <b-form-group label="Opacidade:" label-for="line-width">
                                <b-form-input id="title" v-model.number="editableVisualization.opacity.value" type="range"
                                    min="0" max="1" step="0.1" class="form-control-sm" />
                                <b-form-text
                                    class="text-center mt-0 mb-2">{{ editableVisualization.opacity.value * 100 }}%</b-form-text>
                            </b-form-group>
                            <b-form-group>
                                <b-form-checkbox v-model="editableVisualization.smoothing.value" switch>
                                    Suavizar
                                </b-form-checkbox>
                            </b-form-group>
                            <template v-if="editableVisualization.type.value == 'donut'">
                                <b-form-group label="Preenchimento (0 = pizza, > 0 donut)" label-for="pie-fill">
                                    <b-form-input id="title" v-model.number="editableVisualization.hole.value" type="number"
                                        min="0" max="90" step="1" class="w-50 form-control-sm" />
                                </b-form-group>
                            </template>
                            <template v-if="editableVisualization.type.value == 'scatter'">
                                <b-form-group label="Cor dos pontos">
                                    <v-select v-model="editableVisualization.scatter_color.value" :options="attributes"
                                        label="name" value="name" :append-to-body="true"></v-select>
                                </b-form-group>
                                <b-form-group label="Tamanho dos pontos">
                                    <v-select v-model="editableVisualization.scatter_size.value" :options="attributes"
                                        label="name" value="name" :append-to-body="true"></v-select>
                                </b-form-group>
                            </template>
                            <template v-if="['donut', 'pie'].indexOf(editableVisualization.type.value) > -1">
                                <b-form-group label="Posição do texto">
                                    <select v-model="editableVisualization.text_position.value"
                                        class="form-control form-control-sm">
                                        <option value="inside">Dentro</option>
                                        <option value="outside">Fora</option>
                                        <option value="auto">Automático</option>
                                        <option value="none">Sem texto</option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Informação">
                                    <select v-model="editableVisualization.text_info.value"
                                        class="form-control form-control-sm">
                                        <option value="label">Rótulo</option>
                                        <option value="label+value">Rótulo e valor</option>
                                        <option value="label+percent">Rótulo e percentual</option>
                                        <option value="value">Valor</option>
                                        <option value="value+percent">Valor e percentual</option>
                                        <option value="percent">Percentual</option>
                                    </select>
                                </b-form-group>
                            </template>
                            <template v-if="false && type.value == 'bar'">
                                <b-form-group label="Direção:">
                                    <select v-model="forms.direction.value" class="form-control form-control-sm">
                                        <option value="VERTICAL">
                                            Vertical
                                        </option>
                                        <option value="HORIZONTAL">
                                            Horizontal
                                        </option>
                                    </select>
                                </b-form-group>

                                <b-form-group>
                                    <b-form-checkbox v-model="forms.stacked.value" switch>
                                        Empilhado
                                    </b-form-checkbox>
                                </b-form-group>
                            </template>



                            <template v-if="false && type.value == 'line'">
                                <b-form-group label="Espessura da Linha:" label-for="line-width">
                                    <b-form-input v-model="forms.line_stroke.value" type="number" min="1" max="10" step="1"
                                        class="form-control form-control-sm w-50" />
                                </b-form-group>

                                <b-form-group label="Tipo de Linha:" label-for="line-width">
                                    <select v-model="forms.line_type.value" class="form-control form-control-sm">
                                        <option value="solid">
                                            Sólida
                                        </option>
                                        <option value="dot">
                                            Ponto
                                        </option>
                                        <option value="dashdot">
                                            Tracejada
                                        </option>
                                    </select>
                                </b-form-group>

                                <b-form-group label="Modo para as séries:">
                                    <select v-model="forms.mode.value" class="form-control form-control-sm">
                                        <option value="lines">
                                            Somente linhas
                                        </option>
                                        <option value="marks">
                                            Somente pontos
                                        </option>
                                        <option value="lines+marks">
                                            Linhas e pontos
                                        </option>
                                    </select>
                                </b-form-group>
                            </template>

                            <template v-if="false && forms.type.value == 'bubble'">
                                <b-form-group label="Símbolo" label-for="line-width">
                                    <b-form-select v-model="chartCustomOptions.bubbleChart.symbol" :options="[
                                        { value: 'circle', text: 'Círculo' },
                                        { value: 'square', text: 'Quadrado' },
                                        { value: 'diamond', text: 'Diamante' },
                                        { value: 'cross', text: 'Cruz' },
                                    ]" />
                                </b-form-group>
                            </template>
                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card no-body class="mb-0">
                    <b-card-header header-tag="header" class="p-0" role="tab">
                        <b-button block v-b-toggle.accordion-3 variant="light" size="sm">Margens e tamanho</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <div class="row">
                                <div class="col-6">
                                    <b-form-group label="Largura (px):">
                                        <b-form-input type="number" min="100" class="form-control form-control-sm mb-0"
                                            v-model="editableVisualization.width.value" />
                                    </b-form-group>
                                </div>
                                <div class="col-6">
                                    <b-form-group label="Altura (px):">
                                        <b-form-input type="number" min="100" class="form-control form-control-sm mb-0"
                                            v-model="editableVisualization.height.value" />
                                    </b-form-group>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 pb-2">
                                    <b-form-checkbox v-model="editableVisualization.auto_margin.value" switch>
                                        Ajustar automaticamente
                                    </b-form-checkbox>
                                </div>
                                <template v-if="!editableVisualization.auto_margin.value">
                                    <div class="offset-3 col-6">
                                        <b-form-input type="number" class="form-control form-control-sm mb-0 text-center"
                                            min="0" v-model="editableVisualization.top_margin.value" />
                                        <b-form-text class="text-center mt-0 mb-2">superior</b-form-text>
                                    </div>
                                    <div class="col-6">
                                        <b-form-input type="number" class="form-control form-control-sm mb-0 text-center"
                                            min="0" v-model="editableVisualization.left_margin.value" />
                                        <b-form-text class="text-center mt-0 mb-2">esquerda</b-form-text>
                                    </div>
                                    <div class="col-6">
                                        <b-form-input type="number" class="form-control form-control-sm mb-0 text-center"
                                            min="0" v-model="editableVisualization.right_margin.value" />
                                        <b-form-text class="text-center mt-0 mb-2">direita</b-form-text>
                                    </div>
                                    <div class="offset-3 col-6">
                                        <b-form-input type="number" class="form-control form-control-sm mb-0 text-center"
                                            min="0" v-model="editableVisualization.bottom_margin.value" />
                                        <b-form-text class="text-center mt-0 mb-2">inferior</b-form-text>
                                    </div>
                                </template>
                            </div>
                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card no-body class="mb-0">
                    <b-card-header header-tag="header" class="p-0" role="tab">
                        <b-button block v-b-toggle.accordion-4 variant="light" size="sm">Filtrar
                            dados</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <label>Limitar quantidade de registros:</label>
                            <input v-if="false && workflowObj.sample" v-model.number="workflowObj.sample.forms.value.value"
                                type="number" class="form-control form-control-sm w-50" maxlength="10" step="100">
                            <expression-editor v-if="false && workflowObj.filter" :field="filterField"
                                :value="workflowObj.filter.forms.formula.value"
                                :suggestion-event="() => attributes.map(a => a.name)" @update="handleUpdateFilter" />

                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card no-body class="mb-0">
                    <b-card-header header-tag="header" class="p-0" role="tab">
                        <b-button block v-b-toggle.accordion-5 variant="light" size="sm">Subgráficos</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-5" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <label>Subgráficos por:</label>
                            <v-select v-model="editableVisualization.subgraph.value" :options="attributes" label="name"
                                value="name" :append-to-body="true"></v-select>

                            <b-form-group label="Direção (orientação)" class="p-0 mt-3">
                                <b-form-radio v-model="editableVisualization.subgraph_orientation.value"
                                    value="v">Vertical</b-form-radio>
                                <b-form-radio v-model="editableVisualization.subgraph_orientation.value"
                                    value="h">Horizontal</b-form-radio>
                            </b-form-group>
                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card v-if="!['pie', 'donut'].includes(editableVisualization.type.value)" no-body class="mb-0">
                    <b-card-header header-tag="header" class="p-0" role="tab">
                        <b-button block v-b-toggle.accordion-6 variant="light" size="sm">Animação</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-6" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <label>Atributo usado para animação:</label>
                            <v-select v-model="editableVisualization.animation.value" :options="attributes" label="name"
                                value="name" :append-to-body="true"></v-select>
                        </b-card-body>
                    </b-collapse>
                </b-card>
            </div>
            <!--
                                <b-form-group>
                                    <label>Título:</label>
                                    <b-form-input maxlength="50" v-model="editableVisualization.title.value" class="form-control-sm"/>
                                </b-form-group>
                                
                                <b-dropdown size="sm" dropright ref="axis" class="mt-2 mr-1" variant="light small-dd-title">
                                    <template #button-content>
                                        Margens
                                    </template>
                                    <b-dropdown-form form-class="down-drop-form" style="width:300px;font-size:9pt;">
                                        <div class="row">
                                            <div class="col-6">
                                                <b-form-group label="Direita:">
                                                    <input type="number" class="form-control form-control-sm"
                                                        v-model="editableVisualization.right_margin.value" />
                                                </b-form-group>
                                                <b-form-group label="Esquerda:">
                                                    <input type="number" class="form-control form-control-sm"
                                                        v-model="editableVisualization.left_margin.value" />
                                                </b-form-group>
                                            </div>
                                            <div class="col-6">
                                                <b-form-group label="Superior:">
                                                    <input type="number" class="form-control form-control-sm"
                                                        v-model="editableVisualization.top_margin.value" />
                                                </b-form-group>
                                                <b-form-group label="Inferior:">
                                                    <input type="number" class="form-control form-control-sm"
                                                        v-model="editableVisualization.bottom_margin.value" />
                                                </b-form-group>
                                            </div>
                                        </div>
                                    </b-dropdown-form>
                                </b-dropdown>
                                <b-form-group>
                                    <label>Exibir legenda:</label>
                                    <select v-model="editableVisualization.display_legend.value" class="form-control form-control-sm">
                                        <option value="HIDE">Ocultar</option>
                                        <option value="AUTO">Posicionar automaticamente</option>
                                        <option value="LEFT">Topo à esquerda</option>
                                        <option value="RIGHT">Topo à direita</option>
                                        <option value="CENTER">Topo ao centro</option>
                                        <option value="BOTTOM_LEFT">Na parte inferior, à esquerda</option>
                                        <option value="BOTTOM_RIGHT">Na parte inferior, à direita</option>
                                        <option value="BOTTOM_CENTER">Na parte inferior, ao centro</option>
                                    </select>
                                </b-form-group>
                                <b-form-group>
                                    <b-form-checkbox v-model="editableVisualization.smoothing.value" switch>
                                        Suavizar
                                    </b-form-checkbox>
                                </b-form-group>
                                <b-form-group>
                                    <color-palette :field="palette" :value="editableVisualization.palette.value"
                                        @update="handleUpdatePalette" />
                                    <color-scale v-if="editableVisualization.type.value === 'treemap'" :field="colorScale"
                                        :value="editableVisualization.color_scale.value" @update="handleUpdateColorScale" />
                                </b-form-group>
                                -->
        </b-form>
    </div>
</template>
<script setup>

import pieChart from '../../assets/charts/pie.svg';

import { getCurrentInstance } from 'vue';
import { ref, watch, defineProps, defineEmits } from "vue";

import vSelect from 'vue-select';
import ColorPalette from '../widgets/ColorPalette.vue';
import ColorScale from '../widgets/ColorScale.vue';
import ExpressionEditor from '../widgets/ExpressionEditor.vue';
import useNotifier from '../../composables/useNotifier.js';

const vm = getCurrentInstance();
const props = defineProps({
    attributes: { type: Array, required: true },
    value: { type: Object, required: true }
});
const emit = defineEmits(['input']);

const chartTypes = [
    { name: "bar", label: "Barras", },
    { name: "stacked-bar", label: "Barras Empilhadas", },
    { name: "horizontal-bar", label: "Barras Horizontais", },
    { name: "stacked-horizontal-bar", label: "Barras Horizontais Empilhada", },
    { name: "pie", label: "Pizza", },
    { name: "donut", label: "Rosca (Donut)", },
    { name: "line", label: "Linhas", },
    { name: "indicator", label: "Indicador", },
    { name: "boxplot", label: "Box plot", },
    { name: "bubble", label: "Bolhas", },
    { name: "scatter", label: "Dispersão", },
    { name: "treemap", label: "Mapa em Árvore (Treemap)", },
    /*{name: "dots",label: "Pontos",
            image: "https://images.plot.ly/plotly-documentation/thumbnail/dot-plot.jpg"
        },*/
    { name: "filled-area", label: "Área", },
    { name: "stacked-filled-area", label: "Área 100%", },

];
/* Data fields */
const toEmit = ref(true);
const editableVisualization = ref(null);
const palette = ref({ label: 'Paleta de cores' });
const colorScale = ref({ label: 'Escala de cores' });

editableVisualization.value = structuredClone(props.value);

/* Watch */
watch(
    () => editableVisualization,
    (value) => {
        if (toEmit.value) {
            emit('input', value.value);
        }
        if (!value.color_scale) {
            value.color_scale = { value: null }
        }
        toEmit.value = true;
    }, { deep: true });

watch(
    () => props.value,
    (value) => {
        if (!value.display_legend) {
            value.display_legend = { value: 'HIDE' }
        }
        const tests = ['color_scale', 'hole', 'text_info', 'text_position',
            'left_margin', 'right_margin', 'top_margin', 'bottom_margin',
            'auto_margin', 'subgraph'];
        tests.forEach(t => {
            if (!value[t]) {
                value[t] = { value: null };
            }
        });

        editableVisualization.value = structuredClone(value);
        toEmit.value = false;
    }, { deep: true, immediate: true });


/* Method */
const getChartIcon = (type) => {
    return new URL(`../../assets/charts/${type}.svg`, import.meta.url).href;
}
const getIcon = (attr) => {
    switch (attr.type) {
        case 'DECIMAL':
        case 'INTEGER':
            return 'hashtag';
        case 'CHARACTER':
            return 'font';
        case 'DATE':
            return 'calendar';
        default:
            return 'question-circle'
    }
};
const handleUpdatePalette = (field, value) => {
    editableVisualization.value.palette.value = value;
};
const handleUpdateColorScale = (field, value) => {
    editableVisualization.value.color_scale.value = value;
};

</script>

<style scoped lang="scss">
.bg-filled-area {
    width: 52px;
    height: 52px;
    background: url('chart-types.png') -8px -10px;
}

.bg-bar {
    width: 52px;
    height: 52px;
    background: url('chart-types.png') -79px -9px;
}

.bg-bubble {
    width: 52px;
    height: 52px;
    background: url('chart-types.png') -10px -78px;
}

.bg-line {
    width: 52px;
    height: 52px;
    background: url('chart-types.png') -78px -78px;
}

.bg-pie {
    width: 52px;
    height: 52px;
    background: url('chart-types.png') -146px -10px;
}

.bg-scatter {
    width: 52px;
    height: 52px;
    background: url('chart-types.png') -146px -78px;
}

.bg-chart {
    padding-left: 60px;
    padding-top: 15px;
    white-space: nowrap;
}

.right-drop-form {
    width: 600px;
}

.options-font {
    font-size: 10pt;
}

.options-font button.collapsed {
    font-size: 10pt;
}
</style>
