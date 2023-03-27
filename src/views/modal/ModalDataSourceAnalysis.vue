<template>
    <b-modal id="modal" title="Adicionar Análise">
        <label for="exampleFormControlSelect1">Atributos</label>
        <select id="exampleFormControlSelect1" class="form-control">
            <option v-for="attr in atributtes" :key="attr.name" :value="attr.name">
                {{attr.name}}
            </option>
        </select>
        <label for="exampleFormControlSelect1">Tipo</label>
        <select id="analysis_type" class="form-control" v-model="selected">
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
        <b-form-group label="Análises:">
            <b-form-checkbox-group stacked>
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
            type: Object,
            default: null
        }
    },
    emits: ['cards'],
    data() {
        return {
            selected: 'unidimensional',
            analysis_options: {
                unidimensional: ['Histograma', 'Quantile Table', 'Frequency Table', 'Summary Stats', 'Box Plot', 'Cumulative distribution function'],
                bidimensional: ['Mosaic Plot', 'Scatter Plot', 'Histogram', 'Frequency Table', 'Box Plot', 'Summary Test'],
                multidimensional: ['PCA', 'Correlação', '...']
            }
        };
    },
    computed: {
        selectedAnalysisOptions() {
            if (this.selected) {
                return this.analysis_options[this.selected];
            }
            else {
                return [];
            }
        }
    },
    methods: {
        addCard() {
            this.$emit('cards', true);
        }
    }
};
</script>

