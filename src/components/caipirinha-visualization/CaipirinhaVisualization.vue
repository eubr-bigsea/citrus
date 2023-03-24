<template>
    <div class="xmyview" style="margin-top: 15px;">
        <p v-if="loading">
            <font-awesome-icon icon="spinner" pulse class="icon" /> {{ $t('common.loading') }}
        </p>

        <div v-if="error">
            <div class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>
            {{ $t('visualization.tryRefresh') }}
        </div>

        <component v-if="visualizationComponent !== 'plotly'" :is="visualizationComponent"
            :visualization-data="visualizationData" :public-route="publicRoute" :height="height" />
        <plotly v-else :data="visualizationData.data.data" :options="{ responsive: true }" :display-mode-bar="false"
            :auto-resize="true" :layout="{ ...visualizationData.data.layout, autosize: true, height: this.height }" />
    </div>
</template>

<script>
import axios from "axios"
import Highcharts from 'highcharts'

import CaipirinhaVisualizationHtml from "./CaipirinhaVisualizationHtml.vue"
import CaipirinhaVisualizationMarkdown from "./CaipirinhaVisualizationMarkdown.vue"
import CaipirinhaVisualizationTable from "./CaipirinhaVisualizationTable.vue"
import CaipirinhaVisualizationBoxPlot from "./CaipirinhaVisualizationBoxPlot.vue"
import CaipirinhaVisualizationHistogram from "./CaipirinhaVisualizationHistogram.vue"
import CaipirinhaVisualizationArea from "./CaipirinhaVisualizationArea.vue"
import CaipirinhaVisualizationScatter from "./CaipirinhaVisualizationScatter.vue"
import CaipirinhaVisualizationMap from "./CaipirinhaVisualizationMap.vue"
import CaipirinhaVisualizationDonut from "./CaipirinhaVisualizationDonut.vue"

import BarChart from "../visualization/BarChart.vue";
import BubbleChart from "../visualization/BubbleChart.vue";
import ForceDirectGraph from "../visualization/ForceDirectGraph.vue";
import Heatmap from "../visualization/Heatmap.vue";
import IFrame from "../visualization/IFrame.vue";
import Indicator from "../visualization/Indicator.vue";
import LineChart from "../visualization/LineChart.vue";
import Markdown from "../visualization/Markdown.vue";
import PieChart from "../visualization/PieChart.vue";
import Treemap from "../visualization/Treemap.vue";
import Html from '../visualization/Html.vue';
import Plotly from '../visualization/Plotly.vue';


let highchartsDefaultLang = undefined;

const highchartsPtLang = {
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    contextButtonTitle: 'Opções Avançadas',
    decimalPoint: ',',
    thousandsSep: '.',
    downloadJPEG: 'Salvar como JPEG',
    downloadPDF: 'Salvar como PDF',
    downloadPNG: 'Salvar como PNG',
    downloadSVG: 'Salvar como SVG',
    downloadCSV: 'Salvar como CSV',
    downloadXLS: 'Salvar como XLS',
    loading: 'Aguarde...',
    noData: 'Sem dados para exibir',
    viewData: 'Visualizar em tabela',
    printChart: 'Imprimir',
    resetZoom: 'Desfazer zoom',
    resetZoomTitle: 'Voltar zoom 1:1',
    openInCloud: "Abrir no Highcharts Cloud"
};



const getVisualizationData = function (responseData) {
    if (responseData.x && responseData.x.type == "time") {
        responseData.data = responseData.data.map(serie => ({
            ...serie,
            values: serie.values.map(value => ({
                ...value,
                x: Date.parse(value.x)
            }))
        }))
    }
    return responseData;
}

export default {
    name: "CaipirinhaVisualization",
    components: {
        CaipirinhaVisualizationHtml,
        CaipirinhaVisualizationMarkdown,
        CaipirinhaVisualizationTable,
        // CaipirinhaVisualizationLine,
        CaipirinhaVisualizationLine: LineChart,
        //CaipirinhaVisualizationBar,
        "CaipirinhaVisualizationBar": BarChart,
        "caipirinha-visualization-boxplot": CaipirinhaVisualizationBoxPlot,
        "caipirinha-visualization-histogram": CaipirinhaVisualizationHistogram,
        // CaipirinhaVisualizationPie,
        CaipirinhaVisualizationPie: PieChart,
        CaipirinhaVisualizationArea,
        CaipirinhaVisualizationScatter,
        CaipirinhaVisualizationMap,
        CaipirinhaVisualizationDonut,
        'bubble-chart': BubbleChart,
        'force-direct': ForceDirectGraph,
        'heatmap': Heatmap,
        'indicator': Indicator,
        'iframe-panel': IFrame,
        'markdown': Markdown,
        'treemap': Treemap,
        'html-display': Html,
        'plotly': Plotly,
    },
    props: {
        dataSourceType: { default: () => 'caipirinha', type: String },
        publicRoute: { default: () => true, type: Boolean },
        task: { default: () => null, type: Object },
        url: { default: () => null, type: String },
        height: { default: 450, type: Number }
    },
    data() {
        return {
            loading: true,
            error: false,
            errorMessage: false,
            visualizationData: null,
            visualizationComponent: null
        };
    },
    created() {
        this.loading = true;
        this.error = false;

        this.setLang();
        if (this.dataSourceType === 'caipirinha') {
            axios
                .get(this.url)
                .then(response => {
                    this.visualizationComponent = this.getVisualizationComponent(
                        response.data.type.id
                    );
                    if (response.data.type.id === 145) {
                        this.visualizationData = getVisualizationData(response);
                    } else {
                        this.visualizationData = getVisualizationData(response.data);
                    }
                    this.loading = false;
                })
                .catch(response => {
                    this.error = true;
                    this.errorMessage = response.message;
                    this.loading = false;
                });
        }
    },
    methods: {
        getVisualizationComponent(typeId) {
            switch (typeId) {
                case 1:
                    return "html-display";
                case 35:
                    return "caipirinha-visualization-table";
                case 68:
                    return "caipirinha-visualization-line";
                case 69:
                    return "caipirinha-visualization-bar";
                case 70:
                    return "caipirinha-visualization-pie";
                case 71:
                    return "caipirinha-visualization-area";
                case 72:
                    return "caipirinha-visualization-markdown";
                case 87:
                    return "caipirinha-visualization-scatter";
                case 88:
                    return "caipirinha-visualization-map";
                case 89:
                    return "caipirinha-visualization-donut";
                case 123:
                    return "caipirinha-visualization-boxplot";
                case 124:
                    return "caipirinha-visualization-histogram";
                case 130:
                    return "indicator";
                case 131:
                    return "markdown";
                case 133:
                    return "heatmap";
                case 134:
                    return "bubble-chart";
                case 1350:
                    return "force-direct";
                case 136:
                    return "iframe-panel";
                case 137:
                    return "treemap";
                case 145:
                    return "plotly";
                default:
                    throw new TypeError(this.$t("errors.invalidVisualizationId"));
            }
        },
        setLang() {
            if (highchartsDefaultLang === undefined)
                highchartsDefaultLang = {
                    ...Highcharts.getOptions().lang
                };

            if (this.$locale == 'pt')
                Highcharts.setOptions({
                    lang: highchartsPtLang
                });

            else
                Highcharts.setOptions({
                    lang: highchartsDefaultLang
                });
        }
    }
};
</script>

<style>
div.myview {
    height: 95%;
    margin: 0 1px;
    width: 98% !important;
}
</style>
