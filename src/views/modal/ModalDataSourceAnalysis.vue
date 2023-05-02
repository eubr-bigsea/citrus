<template>
    <b-modal id="modal" title="Adicionar Análise">
        <label for="exampleFormControlSelect1">Atributos</label>
        <select id="exampleFormControlSelect1" v-model="atributte" class="form-control">
            <option v-for="attr in atributtes" :key="attr.name" :value="attr.name">
                {{attr.name}}
            </option>
        </select>
        <label for="exampleFormControlSelect1">Tipo</label>
        <select id="analysis_type" v-model="type" class="form-control">
            <option value="unidimensional">
                Unidimensional
            </option>
            <option value="bidimensional">
                Bidimensional
            </option>
            <option value="multidimensional">
                Multidimensional
            </option>
            <option value="testes_estatisticos">
                Testes Estatísticos
            </option>
            <option value="ajustar_fit">
                Ajustar (fit) a uma distribuição
            </option>
            <option value="series_temporais">
                Séries temporais
            </option>
        </select>
        <b-form-group v-if="type != null" label="Análises:">
            <b-form-checkbox-group v-model="graphs" stacked>
                <b-form-checkbox v-for="option in selectedAnalysisOptions" :key="option" :value="option">
                    {{option}}
                </b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>
        <template #modal-footer>
            <b-button variant="primary" @click="[addCard(), $bvModal.hide('modal')]">
                Ok
            </b-button>
            <b-button variant="secondary" @click="$bvModal.hide('modal')">
                Cancel
            </b-button>
        </template>
    </b-modal>
</template>

<script>

export default {
    props: {
        atributtes: {
            type: Array,
            default: null
        }
    },
    emits: ['cards'],
    data() {
        return {
            type: null,
            atributte: null,
            graphs: [],
            analysisTypes: {
                unidimensional: ['Histograma', 'Quantile Table', 'Frequency Table', 'Summary Stats', 'Box Plot', 'Cumulative distribution function'],
                bidimensional: ['Mosaic Plot', 'Scatter Plot', 'Histogram', 'Frequency Table', 'Box Plot', 'Summary Test'],
                multidimensional: ['PCA', 'Correlação', '...']
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
                atributte: this.atributte,
                graphs: this.graphs
            };
            this.$emit('cards', cardInfo);
            //Reset Modal
            this.type = null;
            this.atributte = null;
            this.graphs = [];
        }
    }
};
</script>

