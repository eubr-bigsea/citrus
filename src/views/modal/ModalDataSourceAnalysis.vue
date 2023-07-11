<template>
    <b-modal id="modal" title="Adicionar Análise">
        <label>{{ $tc('common.attribute', 1) }}:</label>
        <select v-model="attribute" class="form-control" @change="analysis = []">
            <option v-for="attr in attributes" :key="attr.name" :value="attr">
                {{ attr.name }}
            </option>
        </select>
        <label for="exampleFormControlSelect1">{{ $tc('common.type') }}:</label>
        <select id="analysis_type" v-model="type" class="form-control">
            <option value="univariate">
                {{ $t('dataSource.analysis.univariate') }}
            </option>
            <option value="bivariate">
                {{ $t('dataSource.analysis.bivariate') }}
            </option>
            <option value="multivariate">
                {{ $t('dataSource.analysis.multivariate') }}
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
            <b-form-checkbox-group v-model="analysis" stacked>
                <b-form-checkbox v-for="option in selectedAnalysisOptions"
                    :disabled="!(currentAttributeIsNumeric && option.numeric || !currentAttributeIsNumeric && option.categorical)" 
                        :key="option.name" :value="option.name">
                    {{ $t(`dataSource.analysis.${option.name}`) }}
                </b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>
        <template #modal-footer>
            <b-button :disabled="analysis.length === 0" variant="primary" size="sm"
                @click="[addCard(), $bvModal.hide('modal')]">
                {{ $t('common.ok') }}
            </b-button>
            <b-button variant="secondary" size="sm" @click="$bvModal.hide('modal')">
                {{ $t('actions.cancel') }}
            </b-button>
        </template>
    </b-modal>
</template>

<script>
import { isNumeric } from '../../data-types.js';

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
            analysis: [],
            analysisTypes: {
                univariate: [
                    { numeric: true, categorical: true, name: 'histogram' },
                    { numeric: true, categorical: false, name: 'quantile_table' },
                    { numeric: false, categorical: true, name: 'frequency_table' },
                    { numeric: true, categorical: true, name: 'summary_stats' },
                    { numeric: true, categorical: false, name: 'box_plot' },
                    { numeric: true, categorical: false, name: 'cdf' }
                ],
                bivariate: [
                    {numeric: true, categorical: true, name: 'mosaic_plot'},
                    {numeric: false, categorical: false, name: 'scatter_plot'},
                    {numeric: true, categorical: true, name: 'histogram'},
                    {numeric: true, categorical: true, name: 'frequency_table'},
                    {numeric: false, categorical: false, name: 'box_plot'},
                    {numeric: false, categorical: false, name: 'summary_test'},
                ],
                multivariate: [
                    {numeric: true, categorical: false, name: 'pca'},
                    {numeric: true, categorical: false, name: 'correlation'},
                ]
            }
        };
    },
    computed: {
        currentAttributeIsNumeric() {
            return this.attribute !== null && isNumeric(this.attribute.type);
        },
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
                analysis: this.analysis
            };
            this.$emit('cards', cardInfo);
            //Reset Modal
            this.type = null;
            this.attribute = null;
            this.analysis = [];
        }
    }
};
</script>

