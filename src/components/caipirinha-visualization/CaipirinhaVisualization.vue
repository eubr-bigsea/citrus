<template>
    <div class="xmyview" style="margin-top: 15px;">
        <p v-if="loading">
            <font-awesome-icon icon="spinner" pulse class="icon"></font-awesome-icon> {{$t('common.loading')}}
        </p>

        <div v-if="error">
            <div class="alert alert-danger" role="alert">{{ errorMessage }}</div>
            {{$t('visualization.tryRefresh')}}
        </div>

        <component class="myview" v-bind:is="visualizationComponent" :visualization-data="visualizationData"
            :public-route="publicRoute" :height="height"></component>
    </div>
</template>

<style>
    div.myview {
        height: 95%;
        margin: 0 1px;
        width: 98% !important;
    }
</style>

<script>
    import axios from "axios"
    import Highcharts from 'highcharts'

    import CaipirinhaVisualizationHtml from "./CaipirinhaVisualizationHtml"
    import CaipirinhaVisualizationMarkdown from "./CaipirinhaVisualizationMarkdown"
    import CaipirinhaVisualizationTable from "./CaipirinhaVisualizationTable"
    import CaipirinhaVisualizationLine from "./CaipirinhaVisualizationLine"
    import CaipirinhaVisualizationBar from "./CaipirinhaVisualizationBar"
    import CaipirinhaVisualizationBoxPlot from "./CaipirinhaVisualizationBoxPlot"
    import CaipirinhaVisualizationHistogram from "./CaipirinhaVisualizationHistogram"
    import CaipirinhaVisualizationPie from "./CaipirinhaVisualizationPie"
    import CaipirinhaVisualizationArea from "./CaipirinhaVisualizationArea"
    import CaipirinhaVisualizationScatter from "./CaipirinhaVisualizationScatter"
    import CaipirinhaVisualizationMap from "./CaipirinhaVisualizationMap"
    import CaipirinhaVisualizationDonut from "./CaipirinhaVisualizationDonut"

    import BarChart from "../visualization/BarChart";
    import BubbleChart from "../visualization/BubbleChart";
    import ForceDirectGraph from "../visualization/ForceDirectGraph";
    import Heatmap from "../visualization/Heatmap";
    import IFrame from "../visualization/IFrame";
    import Indicator from "../visualization/Indicator";
    import LineChart from "../visualization/LineChart";
    import Markdown from "../visualization/Markdown";
    import PieChart from "../visualization/PieChart";
    import Treemap from "../visualization/Treemap";

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
        name: "caipirinha-visualization",
        props: {
            dataSourceType: { default: 'caipirinha' },
            publicRoute: { default: true },
            task: null,
            url: {},
            height: { default: 450 }
        },
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
        methods: {
            getVisualizationComponent(typeId) {
                switch (typeId) {
                    case 1:
                        return "caipirinha-visualization-html";
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
                        this.visualizationData = getVisualizationData(response.data);
                        this.loading = false;
                    })
                    .catch(response => {
                        this.error = true;
                        this.errorMessage = response.message;
                        this.loading = false;
                    });
            }
        }
    };
</script>