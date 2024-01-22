<template>
    <div v-if="editableVisualization" class="chart-builder-options">
        <b-form class="chart-properties">
            <b-form-group id="title" label="Tipo da visualização:" label-for="title">
                |{{chartType}}| {{editableVisualization.type.value}}| {{chartType2}}|
                <v-select xv-model="editableVisualization.type.value" :options="chartTypes" label="label"
                    :reduce="(opt) => opt.name" :searchable="false" style="font-size:8pt" data-test="chart-type"
                    xinput="emit('update-chart', $event, 'type')"
                    :value="chartType" @input="notify($event, 'chartType')"
                    >
                    <template #option="{ label, name }">
                        <img :src="getChartIcon(name)" style="width:20px; height: 20px; margin-right: 5px" :data-test="`chart-type-${name}`">
                        {{ label }}
                    </template>

                    <template #selected-option="{ label, name }">
                        <img :src="getChartIcon(name)" style="width:20px; height: 20px; margin-right: 5px" data-test="selected-type">
                        {{ label }}
                    </template>
                </v-select>

                <label>{{ $t('common.title') }}:</label>
                <b-form-input xv-model="editableVisualization.title.value" maxlength="50" class="form-control-sm"
                spellcheck="false" data-chart-layout="title" name="title"
                xinput="emit('update-chart', $event, ['title', 'text'])" 
                
                />
                |{{title}}|||
                    <input :input="title" @input="$emit('update:title', $event.target.value)" class="form-control form-control-sm"/>
            </b-form-group>

            <div class="accordion options-font" role="tablist">
                <div>
                    <div class="mt-1" role="tab">
                        <b-button v-b-toggle.accordion-2 variant="light" size="sm" data-test="card-1"
                            class="w-100 border border-gray">
                            Legenda, temas e cores
                        </b-button>
                    </div>
                    <b-collapse id="accordion-2" visible accordion="my-accordion" role="tabpanel">
                        <b-card-body class="p-2">
                            <template v-if="supportsLegend">
                                <label>Exibir legenda:</label>
                                <select v-model="editableVisualization.display_legend.value"
                                    class="form-control form-control-sm" data-test="display_legend"
                                    @input="emit('update-chart', 'display_legend')">
                                    <option value="HIDE">
                                        Ocultar
                                    </option>
                                    <option value="AUTO">
                                        Posicionar automaticamente
                                    </option>
                                    <option value="LEFT">
                                        Topo à esquerda
                                    </option>
                                    <option value="RIGHT">
                                        Topo à direita
                                    </option>
                                    <option value="CENTER">
                                        Topo ao centro
                                    </option>
                                    <option value="BOTTOM_LEFT">
                                        Na parte inferior, à esquerda
                                    </option>
                                    <option value="BOTTOM_RIGHT">
                                        Na parte inferior, à direita
                                    </option>
                                    <option value="BOTTOM_CENTER">
                                        Na parte inferior, ao centro
                                    </option>
                                </select>
                            </template>
                            <label class="mt-2">Tema:</label>
                            <select v-model="editableVisualization.template.value" class="form-select form-select-sm mb-2"
                                data-test="template">
                                <option value="none">
                                    Nenhum
                                </option>
                                <option value="ggplot2">
                                    Ggplot2
                                </option>
                                <option value="seaborn">
                                    Seaborn
                                </option>
                                <option value="simple_white">
                                    Branco simples
                                </option>
                                <option value="plotly">
                                    Plotly
                                </option>
                                <option value="plotly_white">
                                    Plotly (Branco)
                                </option>
                                <option value="plotly_dark">
                                    Plotly (Escuro)
                                </option>
                                <option value="presentation">
                                    Apresentação
                                </option>
                                <!--
                                        <option value="xgridoff">Grade desabilitada eixo X</option>
                                        <option value="ygridoff">Grade desabilitada eixo Y</option>
                                        <option value="gridon">Grid habilitada</option>
                                        -->
                            </select>
                            <template v-if="['bubble', 'scatter', 'pointcloud'].includes(chartType)">
                                <label>Atributo usado para cor:</label>
                                <v-select v-model="editableVisualization.color_attribute.value" :options="attributes"
                                    label="name" value="name" :append-to-body="true" data-test="color_attribute" />

                                <label>Atributo usado para tamanho:</label>
                                <v-select v-model="editableVisualization.size_attribute.value" :options="attributes"
                                    label="name" value="name" :append-to-body="true" data-test="size_attribute" />
                            </template>
                            <color-palette v-if="discreteColors" :field="palette" data-test="palette"
                                :value="editableVisualization.palette.value" @update="handleUpdatePalette" />
                            <color-scale v-if="continuousColors" :field="colorScale" data-test="color_scale"
                                :value="editableVisualization.color_scale.value" @update="handleUpdateColorScale" />

                            <!--
                            <b-form-checkbox v-model="editableVisualization.blackWhite.value" switch>
                                Gráfico preto e branco
                            </b-form-checkbox>
                            -->
                        </b-card-body>
                    </b-collapse>
                </div>
                <div>
                    <div class="mt-1" role="tab">
                        <b-button v-b-toggle.accordion-1 variant="light" size="sm" data-test="card-2"
                            class="w-100 border border-gray">
                            Aparência
                        </b-button>
                    </div>
                    <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
                        <b-card-body class="p-2">
                            <!--
                                <b-form-group label="Cor de fundo">
                                    <b-form-input type="color" v-model="editableVisualization.paper_color.value"
                                            class="form-control form-control-sm" />
                                </b-form-group>
                                -->
                            <b-form-group v-if="!mapFamily" label="Formato dos números">
                                <select v-model="editableVisualization.number_format.value"
                                    class="form-control form-control-sm" data-test="number_format">
                                    <option value=",.">
                                        1.234,56
                                    </option>
                                    <option value=".,">
                                        1,234.56
                                    </option>
                                    <option value=",">
                                        1 234,56
                                    </option>
                                    <option value=".">
                                        1 234.56
                                    </option>
                                </select>
                            </b-form-group>
                            <b-form-group v-if="!mapFamily" label="Opacidade do gráfico:" label-for="line-width">
                                <b-form-input id="title" v-model.number="editableVisualization.opacity.value" type="range"
                                    min="0" max="1" step="0.01" class="form-control-sm" data-test="opacity" />
                                <b-form-text class="text-center mt-0">
                                    {{ Math.round(editableVisualization.opacity.value
                                        * 100) }}%
                                </b-form-text>
                            </b-form-group>
                            <b-form-group v-if="!mapFamily" label="Opacidade do preenchimento:">
                                <b-form-input id="title" v-model.number="editableVisualization.fill_opacity.value"
                                    type="range" min="0" max="1" step=".01" class="form-control-sm"
                                    data-test="fill_opacity" />
                                <b-form-text class="text-center mt-0">
                                    {{ Math.round(editableVisualization.fill_opacity.value * 100) }}%
                                </b-form-text>
                            </b-form-group>
                            <template v-if="editableVisualization.type.value == 'donut'">
                                <b-form-group label="Preenchimento (0 = pizza, > 0 donut)" label-for="pie-fill">
                                    <b-form-input id="title" v-model.number="editableVisualization.hole.value" type="range"
                                        min="0" max="90" step="1" class="form-control-sm" data-test="hole"
                                        @input="emit('update-chart', 'hole')" />
                                    <b-form-text class="text-center mt-0">
                                        {{ Math.round(editableVisualization.hole.value) }}%
                                    </b-form-text>
                                </b-form-group>
                            </template>
                            <b-form-group v-if="!pieFamily && !mapFamily">
                                <b-form-checkbox v-model="editableVisualization.smoothing.value" switch
                                    data-test="smoothing">
                                    Suavizar
                                </b-form-checkbox>
                            </b-form-group>
                            <template v-if="editableVisualization.type.value == 'scatter'">
                                <b-form-group label="Cor dos pontos">
                                    <v-select v-model="editableVisualization.scatter_color.value" :options="attributes"
                                        label="name" value="name" :append-to-body="true" data-test="scatter_color" />
                                </b-form-group>
                                <b-form-group label="Tamanho dos pontos">
                                    <v-select v-model="editableVisualization.scatter_size.value" :options="attributes"
                                        label="name" value="name" :append-to-body="true" data-test="scatter_size" />
                                </b-form-group>
                            </template>
                            <template v-if="mapFamily">
                                <b-form-group label="Estilo do mapa:">
                                    <select v-model="editableVisualization.style.value" class="form-select form-select-sm"
                                        data-test="style">
                                        <option value="carto-darkmatter">
                                            Carto Darkmatter
                                        </option>
                                        <option value="carto-positron">
                                            Carto Positron
                                        </option>
                                        <option value="open-street-map">
                                            Open Street Map
                                        </option>
                                        <option value="stamen-terrain">
                                            Stamen Terrain
                                        </option>
                                        <option value="stamen-toner">
                                            Stamen Toner
                                        </option>
                                        <option value="stamen-watercolor">
                                            Stamen Watercolor
                                        </option>
                                        <option value="white-bg">
                                            Fundo Branco (sem mapa)
                                        </option>

                                        <!-- Requires MapBox token 
                                        <option value="basic">Mapbox Básico</option>
                                        <option value="streets">Mapbox Streets</option>
                                        <option value="outdoors">Mapbox Outdoors</option>
                                        <option value="light">Mapbox Light</option>
                                        <option value="dark">Mapbox Dark</option>
                                        <option value="satellite">Mapbox Satellite</option>
                                        <option value="satellite-streets">Mapbox Streets Satellite</option>
                                        -->
                                    </select>
                                </b-form-group>
                                <b-form-group label="Exibir no mapa:">
                                    <select v-model="editableVisualization.text_info.value"
                                        class="form-control form-control-sm" data-test="text_info">
                                        <option value="markers">
                                            Marcadores
                                        </option>
                                        <option value="text">
                                            Texto
                                        </option>
                                        <option value="markers+text">
                                            Marcadores e texto
                                        </option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Exibir dica (tooltip):">
                                    <select v-model="editableVisualization.tooltip_info.value"
                                        class="form-control form-control-sm" data-test="tooltip_info">
                                        <option value="lat">
                                            Latitude
                                        </option>
                                        <option value="lon">
                                            Longitude
                                        </option>
                                        <option value="text">
                                            Texto
                                        </option>
                                        <option value="lat+lon">
                                            Latitude e longitude
                                        </option>
                                        <option value="lat+lon+text">
                                            Latitude, longitude e texto
                                        </option>
                                        <option value="none">
                                            Nenhuma
                                        </option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Zoom mapa:">
                                    <b-form-input v-model.number="editableVisualization.zoom.value" type="range" class=""
                                        min="0" step="1" max="20" data-test="zoom" />
                                    <b-form-text class="text-center mt-0">
                                        {{ editableVisualization.zoom.value }}
                                    </b-form-text>
                                </b-form-group>
                                <b-form-group label="Raio base (se atributo para tamanho):">
                                    <b-form-input v-model.number="editableVisualization.marker_size.value" type="number"
                                        class="form-control form-control-sm mb-0" min="0" step=".1" max=""
                                        data-test="marker_size" />
                                </b-form-group>
                                <b-form-group label="Centro do mapa:">
                                    <div class="row">
                                        <div class="col-6">
                                            <b-form-input v-model="editableVisualization.center_latitude.value"
                                                type="number" class="form-control form-control-sm mb-0" min="0" step="0.01"
                                                data-test="latitude" />
                                            <b-form-text class="text-center mt-0 mb-2">
                                                latitude
                                            </b-form-text>
                                        </div>
                                        <div class="col-6">
                                            <b-form-input v-model="editableVisualization.center_longitude.value"
                                                type="number" class="form-control form-control-sm mb-0" min="0" step="0.01"
                                                data-test="longitude" />
                                            <b-form-text class="text-center mt-0 mb-2">
                                                longitude
                                            </b-form-text>
                                        </div>
                                    </div>
                                </b-form-group>
                            </template>
                            <template v-if="pieFamily">
                                <b-form-group label="Posição do texto">
                                    <select v-model="editableVisualization.text_position.value"
                                        class="form-control form-control-sm" data-test="text_position">
                                        <option value="inside">
                                            Dentro
                                        </option>
                                        <option value="outside">
                                            Fora
                                        </option>
                                        <option value="auto">
                                            Automático
                                        </option>
                                        <option value="none">
                                            Sem texto
                                        </option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Informação">
                                    <select v-model="editableVisualization.text_info.value"
                                        class="form-control form-control-sm" data-test="text_info">
                                        <option value="label">
                                            Rótulo
                                        </option>
                                        <option value="label+value">
                                            Rótulo e valor
                                        </option>
                                        <option value="label+percent">
                                            Rótulo e percentual
                                        </option>
                                        <option value="value">
                                            Valor
                                        </option>
                                        <option value="value+percent">
                                            Valor e percentual
                                        </option>
                                        <option value="percent">
                                            Percentual
                                        </option>
                                        <option value="label+value+percent">
                                            Rótulo, valor e percentual
                                        </option>
                                    </select>
                                </b-form-group>
                            </template>
                            <template v-if="false && type.value == 'bar'">
                                <b-form-group label="Direção:">
                                    <select v-model="forms.direction.value" class="form-select form-select-sm"
                                        data-test="direction">
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
                                    <select v-model="forms.line_type.value" class="form-select form-select-sm">
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
                                    <select v-model="forms.mode.value" class="form-select form-select-sm">
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
                                    ]" data-test="symbol" />
                                </b-form-group>
                            </template>
                        </b-card-body>
                    </b-collapse>
                </div>
                <div>
                    <div class="mt-1" role="tab">
                        <b-button v-b-toggle.accordion-3 variant="light" size="sm" data-test="card-3"
                            class="w-100 border border-gray">
                            Tamanho e
                            margens
                        </b-button>
                    </div>
                    <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <div class="row">
                                <div class="col-6">
                                    <b-form-group label="Largura (px):">
                                        <b-form-input v-model="editableVisualization.width.value" type="number" min="100"
                                            class="form-control form-control-sm mb-0" data-test="width" />
                                    </b-form-group>
                                </div>
                                <div class="col-6">
                                    <b-form-group label="Altura (px):">
                                        <b-form-input v-model="editableVisualization.height.value" type="number" min="100"
                                            class="form-control form-control-sm mb-0" data-test="height" />
                                    </b-form-group>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 pb-2">
                                    <b-form-checkbox v-model="editableVisualization.auto_margin.value" switch
                                        data-test="auto_margin">
                                        Margens automáticas
                                    </b-form-checkbox>
                                </div>
                                <template v-if="!editableVisualization.auto_margin.value">
                                    <div class="offset-3 col-6">
                                        <b-form-input v-model="editableVisualization.top_margin.value" type="number"
                                            class="form-control form-control-sm mb-0 text-center" min="0"
                                            data-test="top_margin" />
                                        <b-form-text class="text-center mt-0 mb-2">
                                            superior
                                        </b-form-text>
                                    </div>
                                    <div class="col-6">
                                        <b-form-input v-model="editableVisualization.left_margin.value" type="number"
                                            class="form-control form-control-sm mb-0 text-center" min="0"
                                            data-test="left_margin" />
                                        <b-form-text class="text-center mt-0 mb-2">
                                            esquerda
                                        </b-form-text>
                                    </div>
                                    <div class="col-6">
                                        <b-form-input v-model="editableVisualization.right_margin.value" type="number"
                                            class="form-control form-control-sm mb-0 text-center" min="0"
                                            data-test="right_margin" />
                                        <b-form-text class="text-center mt-0 mb-2">
                                            direita
                                        </b-form-text>
                                    </div>
                                    <div class="offset-3 col-6">
                                        <b-form-input v-model="editableVisualization.bottom_margin.value" type="number"
                                            class="form-control form-control-sm mb-0 text-center" min="0"
                                            data-test="bottom_margin" />
                                        <b-form-text class="text-center mt-0 mb-2">
                                            inferior
                                        </b-form-text>
                                    </div>
                                </template>
                            </div>
                        </b-card-body>
                    </b-collapse>
                </div>
                <div>
                    <div class="mt-1" role="tab">
                        <b-button v-b-toggle.accordion-4 variant="light" size="sm" data-test="card-4"
                            class="w-100 border border-gray">
                            Filtrar
                            dados
                        </b-button>
                    </div>
                    <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <label>Limitar quantidade de registros:</label>
                            <input v-model.number="editableVisualization.limit.value" type="number"
                                class="form-control form-control-sm w-50" min="1" step="100" data-test="limit">
                            <expression-editor :field="filterField" :value="editableVisualization.filter.value"
                                :show-alias="false" :suggestion-event="() => attributes.map(a => a.name)"
                                @update="handleUpdateFilter" />
                        </b-card-body>
                    </b-collapse>
                </div>
                <div>
                    <div class="mt-1" role="tab">
                        <b-button v-b-toggle.accordion-5 variant="light" size="sm" data-test="card-5"
                            class="w-100 border border-gray">
                            Subgráficos
                        </b-button>
                    </div>
                    <b-collapse id="accordion-5" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <label>Subgráficos por:</label>
                            <v-select v-model="editableVisualization.subgraph.value" :options="attributes" label="name"
                                value="name" :searchable="false" :append-to-body="true" data-test="subgraph" />

                            <b-form-group v-if="editableVisualization.subgraph.value" label="Direção (orientação)"
                                class="p-0 mt-3">
                                <b-form-radio v-model="editableVisualization.subgraph_orientation.value" value="v"
                                    data-test="subgraph_orientation-v">
                                    Vertical
                                </b-form-radio>
                                <b-form-radio v-model="editableVisualization.subgraph_orientation.value" value="h"
                                    data-test="subgraph_orientation-h">
                                    Horizontal
                                </b-form-radio>
                            </b-form-group>
                        </b-card-body>
                    </b-collapse>
                </div>
                <div>
                    <div class="mt-1" role="tab">
                        <b-button v-b-toggle.accordion-6 variant="light" size="sm" data-test="card-6"
                            class="w-100 border border-gray">
                            Animação
                        </b-button>
                    </div>
                    <b-collapse id="accordion-6" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <label>Atributo usado para animação:</label>
                            <v-select v-model="editableVisualization.animation.value" :options="attributes" label="name"
                                value="name" :append-to-body="true" data-test="animation" />
                        </b-card-body>
                    </b-collapse>
                </div>
            </div>
        </b-form>
    </div>
</template>
<script setup>
import { ref, watch, defineProps, defineEmits, computed } from "vue";
import ChartTypes from '../../views/data-explorer/vis-builder/visualizations.js';

import vSelect from 'vue-select';
import ColorPalette from '@/components/widgets/ColorPalette.vue';
import ColorScale from '@/components/widgets/ColorScale.vue';
import ExpressionEditor from '@/components/widgets/ExpressionEditor.vue';

const props = defineProps({
    attributes: { type: Array, required: true },
    modelValue: { type: Object, required: true },
    chartType: { type: String, required: false, default: null },
    //
    title: { type: String, required: false, default: null },

});
const chartType2 = ref(null);
const emit = defineEmits(['input', 'update-chart', 'update:title']);

const chartTypes = ChartTypes.types;
/* Data fields */
const toEmit = ref(true);
const editableVisualization = ref(null);
const palette = ref({ label: 'Paleta de cores' });
const colorScale = ref({ label: 'Escala de cores' });
const filterField = ref({ label: 'Filtros' });
editableVisualization.value = JSON.parse(JSON.stringify(props.modelValue)); //structuredClone(toRaw(props.modelValue));


/* Computed */
const mapFamily = computed(() =>
    ['scattermapbox'].includes(props.chartType)
);
const pieFamily = computed(() =>
    ['donut', 'pie'].includes(props.chartType)
);
const continuousColors = computed(() => {
    return ['sunburst', 'treemap', 'histogram2dcontour', 'parcoords', 'scattergeo', 'histogram2d'].includes(props.chartType);
});
const discreteColors = computed(() => {
    return !continuousColors.value;
});
const supportsLegend = computed(() =>
    !['treemap'].includes(props.chartType)
);
/* Watch */
watch(
    () => editableVisualization,
    (value) => {
        if (toEmit.value) {
            emit('input', value.value);
        }
        if (!value.color_scale) {
            value.color_scale = { value: null };
        }
        toEmit.value = true;
    }, { deep: true });

watch(
    () => props.modelValue,
    (value) => {
        if (!value.display_legend) {
            value.display_legend = { value: 'HIDE' };
        }
        const tests = ['color_scale', 'hole', 'text_info', 'text_position',
            'left_margin', 'right_margin', 'top_margin', 'bottom_margin',
            'auto_margin', 'subgraph'];
        tests.forEach(t => {
            if (!value[t]) {
                value[t] = { value: null };
            }
        });

        editableVisualization.value = JSON.parse(JSON.stringify(value));//structuredClone(toRaw(value));
        toEmit.value = false;
    }, { deep: true, immediate: true });


/* Method */
const handleUpdateFilter = (field, valueList) => {
    filterField.value.value = valueList;
    filterField.value.displayValue = valueList;
    editableVisualization.value.filter.value = valueList;
};
const getChartIcon = (type) => {
    return new URL(`../../assets/charts/${type}.svg`, import.meta.url).href;
};
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
            return 'question-circle';
    }
};
const handleUpdatePalette = (field, value) => {
    editableVisualization.value.palette.value = value;
};
const handleUpdateColorScale = (field, value) => {
    editableVisualization.value.color_scale.value = value;
};

const updateChart = (property) => {
    emit('update-chart', property);
};

const notify = (prop, value) => {
    console.debug(prop, value);
    emit(`update:${prop}`, value);
};
</script>

<style scoped lang="scss">
.options-font {
    font-size: 10pt;
}

.options-font button.collapsed {
    font-size: 10pt;
}
</style>
