<template>
    <div v-if="editableVisualization" class="chart-builder-options">
        <b-form class="chart-properties">
            <b-form-group id="title" label="Tipo da visualização:" label-for="title">

                <v-select v-model="editableVisualization.type.value" :options="chartTypes" label="label"
                    :reduce="(opt) => opt.name" :searchable="false" style="font-size:8pt" data-test="chart-type">
                    <template #option="{ label, name }">
                        <img :src="getChartIcon(name)" class="type-icon" :data-test="`chart-type-${name}`">
                        {{label}}
                    </template>

                    <template #selected-option="{ label, name }">
                        <img :src="getChartIcon(name)" class="type-icon" data-test="selected-type">
                        {{label}}
                    </template>
                </v-select>
            </div>
            <div class="mt-2">
                <label>{{$t('common.title')}}:</label>
                <input v-model="title" class="form-control form-control-sm" maxlength="50">
            </div>

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
                                <select v-model="displayLegend" class="form-select form-select-sm"
                                        data-test="display_legend">
                                    <option v-for="opt, value in legendOptions" :key="value" :value="value">
                                        {{opt}}
                                    </option>
                                </select>
                            </template>
                            <template v-if="!mapFamily">
                                <label class="mt-2">Tema:</label>
                                <select v-model="editableVisualization.template.value" class="form-control form-control-sm mb-2"
                                    data-test="template">
                                    <option value="none">Nenhum</option>
                                    <option value="ggplot2">Ggplot2</option>
                                    <option value="seaborn">Seaborn</option>
                                    <option value="simple_white">Branco simples</option>
                                    <option value="plotly">Plotly</option>
                                    <option value="plotly_white">Plotly (Branco)</option>
                                    <option value="plotly_dark">Plotly (Escuro)</option>
                                    <option value="presentation">Apresentação</option>
                                    <!--
                                            <option value="xgridoff">Grade desabilitada eixo X</option>
                                            <option value="ygridoff">Grade desabilitada eixo Y</option>
                                            <option value="gridon">Grid habilitada</option>
                                            -->
                                </select>
                            </template>
                            <template v-if="['bubble', 'scatter', 'pointcloud'].includes(chartType)">
                                <label>Atributo usado para cor:</label>
                                <v-select v-model="colorAttribute" :options="attributes" label="name" value="name"
                                          :append-to-body="true" data-test="color_attribute" :reduce="(opt) => opt.name" />

                                <label>Atributo usado para tamanho:</label>
                                <v-select v-model="sizeAttribute" :options="attributes" label="name" value="name"
                                          :append-to-body="true" data-test="size_attribute" :reduce="(opt) => opt.name" />
                            </template>
                            <color-palette v-if="discreteColors" v-model="palette" :field="paletteField"
                                           data-test="palette" />
                            <color-scale v-if="continuousColors" v-model="colorScale" :field="colorScaleField"
                                         data-test="color_scale" />

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
                                <select v-model="numberFormat" class="form-select form-select-sm" data-test="number_format">
                                    <option v-for="opt, value in numberFormatOptions" :key="value" :value="value">
                                        {{opt}}
                                    </option>
                                </select>
                            </b-form-group>
                            <b-form-group v-if="!mapFamily" label="Opacidade do gráfico:" label-for="line-width">
                                <div class="range-selector">
                                    <b-form-input id="title" v-model.number="opacity" type="range" min="0"
                                                  max="1"
                                                  step="0.01" class="form-control-sm" data-test="opacity" />
                                    <b-form-text class="text-center mt-0">
                                        {{Math.round(opacity * 100)}}%
                                    </b-form-text>
                                </div>
                            </b-form-group>
                            <b-form-group v-if="!mapFamily" label="Opacidade do preenchimento:">
                                <div class="range-selector">
                                    <b-form-input id="title" v-model.number="fillOpacity" type="range" min="0"
                                                  max="1"
                                                  step=".01" class="form-control-sm" data-test="fill_opacity" />
                                    <b-form-text class="text-center mt-0">
                                        {{Math.round(fillOpacity * 100)}}%
                                    </b-form-text>
                                </div>
                            </b-form-group>
                            <template v-if="type == 'donut'">
                                <b-form-group label="Preenchimento (0 = pizza, > 0 donut)" label-for="pie-fill">
                                    <div class="range-selector">
                                        <b-form-input id="title" v-model.number="hole" type="range" min="0"
                                                      max="90"
                                                      step="1" class="form-control-sm" data-test="hole"
                                                      @input="emit('update-chart', 'hole')" />
                                        <b-form-text class="text-center mt-0">
                                            {{Math.round(hole)}}%
                                        </b-form-text>
                                    </div>
                                </b-form-group>
                            </template>
                            <b-form-group v-if="!pieFamily && !mapFamily">
                                <b-form-checkbox v-model="smoothing" switch data-test="smoothing">
                                    Suavizar
                                </b-form-checkbox>
                            </b-form-group>
                            <template v-if="type == 'scatter'">
                                <b-form-group label="Atributo usado para a cor dos pontos">
                                    <v-select v-model="scatterColor" :options="attributes" label="name" value="name"
                                              :append-to-body="true" data-test="scatter_color" />
                                </b-form-group>
                                <b-form-group label="Atributo usado para o tamanho dos pontos">
                                    <v-select v-model="scatterSize" :options="attributes" label="name" value="name"
                                              :append-to-body="true" data-test="scatter_size" />
                                </b-form-group>
                            </template>
                            <template v-if="mapFamily">
                                <b-form-group label="Estilo do mapa:">
                                    <select v-model="editableVisualization.style.value" class="form-control form-control-sm"
                                        data-test="style">
                                        <option value="carto-darkmatter">Carto Darkmatter</option>
                                        <option value="carto-positron">Carto Positron</option>
                                        <option value="open-street-map">Open Street Map</option>
                                        <!-- Requires token
                                        <option value="stamen-terrain">Stamen Terrain</option>
                                        <option value="stamen-toner">Stamen Toner</option>
                                        <option value="stamen-watercolor">Stamen Watercolor</option>
                                        -->
                                        <option value="white-bg">Fundo Branco (sem mapa)</option>

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
                                        {{editableVisualization.zoom.value}}
                                    </b-form-text>
                                </b-form-group>
                                <b-form-group label="Raio base (se atributo para tamanho ou magnitude):">
                                    <b-form-input type="number" class="form-control form-control-sm mb-0" min="0" step=".1"
                                        max="" v-model.number="editableVisualization.marker_size.value"
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
                                    <select v-model="textPosition" class="form-select form-select-sm"
                                            data-test="text_position">
                                        <option v-for="opt, value in textPositionOptions" :key="value" :value="value">
                                            {{opt}}
                                        </option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Informação">
                                    <select v-model="textInfo" class="form-select form-select-sm" data-test="text_info">
                                        <option v-for="opt, value in pieInformationTypeOptions" :key="value" :value="value">
                                            {{opt}}
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
                                    <b-form-input v-model="forms.line_stroke.value" type="number" min="1" max="10"
                                                  step="1"
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
                            Tamanho e margens
                        </b-button>
                    </div>
                    <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <div class="row">
                                <div class="col-6">
                                    <b-form-group label="Largura (px):">
                                        <b-form-input v-model.number="width" type="number" min="100"
                                                      class="form-control form-control-sm mb-0 w-50" data-test="width" />
                                    </b-form-group>
                                </div>
                                <div class="col-6">
                                    <b-form-group label="Altura (px):">
                                        <b-form-input v-model.number="height" type="number" min="100"
                                                      class="form-control form-control-sm mb-0 w-50" data-test="height" />
                                    </b-form-group>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 pb-2">
                                    <b-form-checkbox v-model="autoMargin" switch data-test="auto_margin">
                                        Margens automáticas
                                    </b-form-checkbox>
                                </div>
                                <template v-if="!autoMargin">
                                    <label>Informe as margens:</label>
                                    <div class="offset-3 col-6 text-center">
                                        <b-form-input v-model.number="topMargin" type="number"
                                                      class="form-control form-control-sm mb-0 text-center" min="0"
                                                      data-test="top_margin" />
                                        <b-form-text class="text-center mt-0 mb-2">
                                            superior
                                        </b-form-text>
                                    </div>
                                    <div class="col-6 text-center">
                                        <b-form-input v-model.number="leftMargin" type="number"
                                                      class="form-control form-control-sm mb-0 text-center" min="0"
                                                      data-test="left_margin" />
                                        <b-form-text class="text-center mt-0 mb-2">
                                            esquerda
                                        </b-form-text>
                                    </div>
                                    <div class="col-6 text-center">
                                        <b-form-input v-model.number="rightMargin" type="number"
                                                      class="form-control form-control-sm mb-0 text-center" min="0"
                                                      data-test="right_margin" />
                                        <b-form-text class="text-center mt-0 mb-2">
                                            direita
                                        </b-form-text>
                                    </div>
                                    <div class="offset-3 col-6 text-center">
                                        <b-form-input v-model.number="bottomMargin" type="number"
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
                            Filtrar dados
                        </b-button>
                    </div>
                    <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <label>Limitar quantidade de registros:</label>
                            <input v-model.number="limit" type="number" class="form-control form-control-sm w-50" min="1"
                                   step="100" data-test="limit">
                            <expression-editor v-model="filter" :field="filterField" :show-alias="false" :value="filter"
                                               :suggestion-event="() => attributes.map(a => a.name)" />
                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card v-if="!mapFamily" no-body class="mb-0">
                    <b-card-header header-tag="header" class="p-0" role="tab">
                        <b-button block v-b-toggle.accordion-5 variant="light" size="sm"
                            data-test="card-5">Subgráficos</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-5" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <label>Subgráficos por:</label>
                            <v-select v-model="subgraph" :options="attributes" label="name" value="name"
                                      :searchable="false"
                                      :append-to-body="true" data-test="subgraph" :reduce="(opt) => opt.name" />

                            <b-form-group v-if="subgraph" label="Direção (orientação)" class="p-0 mt-3">
                                <b-form-radio v-model="subgraphOrientation" value="v" data-test="subgraph_orientation-v">
                                    Vertical
                                </b-form-radio>
                                <b-form-radio v-model="subgraphOrientation" value="h" data-test="subgraph_orientation-h">
                                    Horizontal
                                </b-form-radio>
                            </b-form-group>
                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card v-if="!pieFamily && !mapFamily" no-body class="mb-0">
                    <b-card-header header-tag="header" class="p-0" role="tab">
                        <b-button block v-b-toggle.accordion-6 variant="light" size="sm"
                            data-test="card-6">Animação</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-6" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <label>Atributo usado para animação:</label>
                            <v-select v-model="animation" :options="attributes" label="name" value="name"
                                      :append-to-body="true" data-test="animation" :reduce="(opt) => opt.name" />
                        </b-card-body>
                    </b-collapse>
                </div>
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
import { ref, watch, defineProps, defineEmits, computed, defineModel } from "vue";
import ChartTypes from '../../views/data-explorer/vis-builder/visualizations.js';

import vSelect from 'vue-select';
import ColorPalette from '@/components/widgets/ColorPalette.vue';
import ColorScale from '@/components/widgets/ColorScale.vue';
import ExpressionEditor from '@/components/widgets/ExpressionEditor.vue';

/* Used in selects */
const legendOptions = {
    HIDE: 'Ocultar', AUTO: 'Posicionar automaticamente',
    LEFT: 'Topo à esquerda', RIGHT: 'Topo à direita',
    CENTER: 'Topo ao centro', BOTTOM_LEFT: 'Na parte inferior, à esquerda',
    BOTTOM_RIGHT: 'Na parte inferior, à direita',
    BOTTOM_CENTER: 'Na parte inferior, ao centro'
};
const themeOptions = {
    none: 'Nenhum',
    ggplot2: 'Ggplot2',
    seaborn: 'Seaborn',
    simple_white: 'Branco simples',
    plotly: 'Plotly',
    plotly_white: 'Plotly (Branco)',
    plotly_dark: 'Plotly (Escuro)',
    presentation: 'Apresentação',
};
const numberFormatOptions = {
    ',.': '1.234,56',
    '.,': '1,234.56',
    '",': '1 234,56',
    '".': '1 234.56',
};
const textPositionOptions = {
    inside: 'Dentro',
    outside: 'Fora',
    auto: 'Automático',
    none: 'Sem texto'
};
const pieInformationTypeOptions = {
    "label": "Rótulo",
    "label+value": "Rótulo e valor",
    "label+percent": "Rótulo e percentual",
    "value": "Valor",
    "value+percent": "Valor e percentual",
    "percent": "Percentual",
    "label+value+percent": "Rótulo, valor e percentual",
};

const title = defineModel('title');
const type = defineModel('type');
const displayLegend = defineModel('displayLegend');
const template = defineModel('template');
const palette = defineModel('palette');
const colorAttribute = defineModel('colorAttribute');
const sizeAttribute = defineModel('sizeAttribute');
const colorScale = defineModel('colorScale');
const numberFormat = defineModel('numberFormat');
const opacity = defineModel('opacity');
const fillOpacity = defineModel('fillOpacity');
const hole = defineModel('hole');
const smoothing = defineModel('smoothing');
const scatterColor = defineModel('scatterColor');
const scatterSize = defineModel('scatterSize');
//Map
const textPosition = defineModel('textPosition');
const textInfo = defineModel('textInfo');

const width = defineModel('width');
const height = defineModel('height');
const autoMargin = defineModel('autoMargin');
const topMargin = defineModel('topMargin');
const leftMargin = defineModel('leftMargin');
const rightMargin = defineModel('rightMargin');
const bottomMargin = defineModel('bottomMargin');

const limit = defineModel('limit');
const filter = defineModel('filter');

const subgraph = defineModel('subgraph');
const subgraphOrientation = defineModel('subgraphOrientation');
const animation = defineModel('animation');

const props = defineProps({
    attributes: { type: Array, required: true },
    modelValue: { type: Object, required: true },
    chartType: { type: String, required: false, default: null },
});
const chartType2 = ref(null);
const emit = defineEmits(['input', 'update-chart', 'update:title']);

const chartTypes = ChartTypes.types;
/* Data fields */
const x = 34211;
const toEmit = ref(true);
const editableVisualization = ref(null);
const paletteField = ref({ label: 'Paleta de cores' });
const colorScaleField = ref({ label: 'Escala de cores' });
const filterField = ref({ label: 'Filtros' });
editableVisualization.value = JSON.parse(JSON.stringify(props.modelValue)); //structuredClone(toRaw(props.modelValue));


/* Computed */
const mapFamily = computed(() =>
    ['scattermapbox', 'densitymapbox', 'choropleth'].includes(props.chartType)
);
const pieFamily = computed(() =>
    ['donut', 'pie'].includes(type.value)
);
const continuousColors = computed(() => {
    return ['sunburst', 'treemap', 'histogram2dcontour', 'parcoords',
        'scattergeo', 'densitymapbox', 'choropleth',
        'histogram2d'].includes(props.chartType);
});
const discreteColors = computed(() => {
    return !continuousColors.value;
});
const supportsLegend = computed(() =>
    !['treemap', 'densitymapbox'].includes(props.chartType)
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
/*
const handleUpdateFilter = (field, valueList) => {
    filterField.value.value = valueList;
    filterField.value.displayValue = valueList;
    editableVisualization.value.filter.value = valueList;
};
*/
const getChartIcon = (type) => {
    return new URL(`../../assets/charts/${type}.svg`, import.meta.url).href;
};
/*
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

*/
const updateChart = (property) => {
    emit('update-chart', property);
};

</script>

<style scoped lang="scss">
.options-font {
    font-size: 10pt;
}

.options-font button.collapsed {
    font-size: 10pt;
}

.type-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.range-selector {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>
