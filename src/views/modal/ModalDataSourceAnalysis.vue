<template>
    <b-modal id="modal" title="Adicionar Análise">
        <label for="exampleFormControlSelect1">{{ $tc('common.type') }}:</label>
        <select id="analysis_type" v-model="type" class="form-control">
            <option value="unidimensional">
                {{ $t('dataSource.analysis.unidimensional') }}
            </option>
            <option value="bidimensional">
                {{ $t('dataSource.analysis.bidimensional') }}
            </option>
            <option value="multidimensional">
                {{ $t('dataSource.analysis.multidimensional') }}
            </option>
            <!--
            <option value="testes_estatisticos">
                {{$t('dataSource.analysis.statisticalTests')}}
            </option>
            <option value="ajustar_fit">
                {{$t('dataSource.analysis.fitCurvesAndDistributions')}}
            </option>
            <option value="series_temporais">
                {{$t('dataSource.analysis.timeSeriesAnalysis')}}
            </option>
        -->
        </select>
        <b-form-group v-if="type != null" :label="`${$tc('titles.analysis', 2)}:`">
            <b-form-checkbox-group v-model="graphs" stacked>
                <b-form-checkbox v-for="option in selectedAnalysisOptions" :key="option" :value="option">
                    {{ $t(`dataSource.analysis.${option}`)}}
                </b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>
        <label for="exampleFormControlSelect1">{{ $tc('common.attribute', 2) }}:</label>
        {{ attribute }}
        <select id="exampleFormControlSelect1" v-model="attribute" class="form-control">
            <option v-for="attr in attributes" :key="attr.name" :value="attr.name">
                {{ attr.name }}
            </option>
        </select>
        <template #modal-footer>
            <b-button variant="primary" size="sm" @click="[addCard(), $bvModal.hide('modal')]">
                {{ $t('common.ok') }}
            </b-button>
            <b-button variant="secondary" size="sm" @click="$bvModal.hide('modal')">
                {{ $t('actions.cancel') }}
            </b-button>
        </template>
    </b-modal>
</template>

<script>

export default {
    props: {
        attributes: {
            type: Array,
            default: null
        }
    },
    emits: ['cards'],
    data() {
        return {
            type: null,
            attribute: null,
            graphs: [],
            analysisTypes: {
                unidimensional: [
                    'histogram', 'quantile_table', 'frequency_table',
                    'summary_stats', 'box_plot', 'cdf'],
                bidimensional: ['mosaic_plot', 'scatter_plot', 'histogram',
                    'frequency_table', 'box_plot', 'summary_test'],
                multidimensional: ['pca', 'correlation']
            }
        };
    },
    computed: {
        selectedAnalysisOptions() {
            if (this.type) {
                return this.analysisTypes[this.type];
            }
            else {
                return [];
            }
        }
    },
    methods: {
        addCard() {
            let cardInfo = {
                analysisType: this.type,
                attribute: this.attribute,
                graphs: this.graphs
            };
            this.$emit('cards', cardInfo);
            //Reset Modal
            this.type = null;
            this.attribute = null;
            this.graphs = [];
        }
    }
};
</script>

