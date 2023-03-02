<template>
    <div v-if="editableVisualization" class="chart-builder-options">
        <b-form class="chart-properties">
            <b-form-group id="title" label="Tipo do gráfico:" label-for="title">
                <v-select v-model="editableVisualization.type.value" :options="chartTypes" label="label"
                    :reduce="(opt) => opt.name">
                    <template #option="{ label, name }">
                        {{ label }}
                        <!--<div class="bg-chart" :class="`bg-${name}`">
                                                                                                    </div>-->
                    </template>

                    <template #selected-option="{ label, name }">
                        <div>
                            {{ label }}
                            <!--<div class="bg-chart" :class="`bg-${name}`">
                                                                                                        </div> -->
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
                        <b-button block v-b-toggle.accordion-3 variant="light" size="sm">Margens</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                        <b-card-body>
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
                                    <!--
                                                    <div class="col-6">
                                                        <b-form-group label="Superior:">
                                                            <input type="number" class="form-control form-control-sm" max="10" min="0"
                                                                v-model="editableVisualization.top_margin.value" />
                                                        </b-form-group>
                                                        <b-form-group label="Inferior:">
                                                            <input type="number" class="form-control form-control-sm" max="10" min="0"
                                                                v-model="editableVisualization.bottom_margin.value" />
                                                        </b-form-group>
                                                    </div>
                                                -->
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
<script>

import vSelect from 'vue-select';
import palettes from '../widgets/util/palettes.js';
import ColorPalette from '../widgets/ColorPalette.vue';
import ColorScale from '../widgets/ColorScale.vue';
import ExpressionEditor from '../widgets/ExpressionEditor.vue';
import ChartBuilderColumnAggregate from './ChartBuilderColumnAggregate.vue';

export default {
    components: {
        vSelect, ColorPalette, ColorScale,
        'column-aggregate': ChartBuilderColumnAggregate,
        ExpressionEditor
    },
    props: {
        attributes: { type: Array, required: true },
        value: { type: Object, required: true }
    },
    data() {
        return {
            toEmit: true,
            editableVisualization: null,
            form: {
                title: {
                    text: ""
                },
                showlegend: false,
                pallete: 0
            },
            chartType: "bar",

            chartCustomOptions: {
                barOptions: {
                    stacked: false,
                    horizontal: false
                },
                pieOptions: {
                    hole: 1
                },
                lineOptions: {
                    line: {
                        dash: 'solid',
                        width: 1,
                        shape: 'linear'
                    }
                },
                bubbleChart: {
                    symbol: 'circle'
                }
            },
            chartTypes: [
                {
                    name: "bar",
                    label: "Gráfico de Barras",
                },
                {
                    name: "stacked-bar",
                    label: "Gráfico de Barras Empilhadas",
                },
                {
                    name: "horizontal-bar",
                    label: "Gráfico de Barras Horizontais",
                },
                {
                    name: "stacked-horizontal-bar",
                    label: "Gráfico de Barras Horizontais Empilhada",
                },
                {
                    name: "pie",
                    label: "Gráfico de Pizza",
                },
                {
                    name: "donut",
                    label: "Gráfico de Rosca (Donut)",
                },
                {
                    name: "line",
                    label: "Gráfico de Linhas",
                },
                {
                    name: "indicator",
                    label: "Indicador",
                },
                /*
                    {
                        name: "bubble",
                        label: "Gráfico de Bolhas",
                    },
                    */
                {
                    name: "scatter",
                    label: "Gráfico de Dispersão",
                },
                {
                    name: "treemap",
                    label: "Mapa em Árvore (Treemap)",
                },
                /*{
                        name: "dots",
                        label: "Gráfico de Pontos",
                        image: "https://images.plot.ly/plotly-documentation/thumbnail/dot-plot.jpg"
                    },*/
                {
                    name: "filled-area",
                    label: "Gráfico de Área",
                },
                {
                    name: "stacked-filled-area",
                    label: "Gráfico de Área 100%",
                },
            ],
            palette: { label: 'Paleta de cores' },
            colorScale: { label: 'Escala de cores' },
        }
    },
    computed: {
        palettes: () => palettes.map(v => v[0]).reduce((prev, cur, i) => [...prev, { value: i, text: cur }], []),
        multipleY() {
            return this.chartType !== 'pie';
        }
    },
    methods: {
        getIcon(attr) {
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
        },
        getIcon2(name) {
            if (this.attributes.length > 0) {
                return this.getIcon(this.attributes.find(attr => attr.name === name));
            } else {
                return "";
            }
        },
        changeOptions() {

            let options = { ...this.form };

            options.colorway = palettes[this.form.pallete][1];
            /*
            switch (this.chartType) {
                case "bar":
                    if (this.chartCustomOptions.barOptions.stacked) options.barmode = 'stack';
                    if (this.chartCustomOptions.barOptions.horizontal) options.orientation = 'h';
                    break;
                case "pie":
                    options.hole = 1 - this.chartCustomOptions.pieOptions.hole;
                    break;
                case "line":
                    options.line = this.chartCustomOptions.lineOptions.line;
                    break;
                case "bubble":
                    options.symbol = this.chartCustomOptions.bubbleChart.symbol;
                    break;
            }

            this.$root.$emit('chartBuilderUpdateChart', {
                type: "layout",
                value: options
            });*/
        },
        updateChart(data) {
            if (data.type == "type") {
                this.chartType = data.value;
            }
        },
        handleUpdatePalette(field, value) {
            this.editableVisualization.palette.value = value;
        },
        handleUpdateColorScale(field, value) {
            this.editableVisualization.color_scale.value = value;
        },
        handleSelect(name) { // eslint-disable-line no-unused-vars
            /*const item = this.y_axis.find((v) => v.attribute === name);
                console.debug(item)*/

        },
        // reduceYAxis(opt) {
        //     return { attribute: opt.name, f: 'count', alias: `count_${opt.name}` };
        // }
    },
    watch: {
        editableVisualization: {
            deep: true,
            handler(value) {
                if (this.toEmit) {
                    this.$emit('input', value);
                }
                if (!value.color_scale) {
                    value.color_scale = { value: null }
                }
                this.toEmit = true;
                //console.debug('handler')
            }
        },
        value: {
            immediate: true,
            deep: true,
            handler(value) {
                if (!value.display_legend) {
                    value.display_legend = { value: 'HIDE' }
                }
                const tests = ['color_scale', 'hole', 'text_info', 'text_position',
                    'left_margin', 'right_margin', 'top_margin', 'bottom_margin',
                    'auto_margin'];
                tests.forEach(t => {
                    if (!value[t]) {
                        value[t] = { value: null };
                    }
                });

                this.editableVisualization = structuredClone(value);
                this.toEmit = false;
            }
        },
    }
}
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
