<template>
    <main role="main">
        <div class="row header">
            <div class="title col-md">
                <h1>{{ $tc('titles.dataSource', 1) }} {{ dataSource?.name }}</h1>
            </div>
            <b-button variant="success" class="btn btn-primary" @click="$bvModal.show('modal')">
                <font-awesome-icon icon="fa fa-plus" /> {{ $t('actions.addItem') }}
            </b-button>
            <modal :attributes="attributes" @cards="addCard" />
        </div>

        <div class="row">
            <div class="col-md-2">
                <data-source-options selected="dataSourceAnalysis" />
            </div>

            <div class="col-md-10">
                <b-card>
                    <div class="mb-4">
                        <h4>{{$t('dataSource.analysis.unidimensional')}}</h4>
                        <div v-if="unidimensionalCards && unidimensionalCards.length" class="analysisBox scroll-area">
                            <data-source-card v-for="card, inx in unidimensionalCards" :key="inx" :info="card"
                                @action="deleteCard" />
                        </div>
                        <div v-else>
                            <small>{{$t('dataSource.analysis.noAnalysis')}}</small>
                        </div>
                    </div>
                    <div class="mb-4">
                        <h4>{{$t('dataSource.analysis.bidimensional')}}</h4>
                        <div v-if="bidimensionalCards && bidimensionalCards.length" class="analysisBox scroll-area">
                            <data-source-card v-for="card, inx in bidimensionalCards" :key="inx" :info="card"
                                @action="deleteCard" />
                        </div>
                        <div v-else>
                            <small>{{$t('dataSource.analysis.noAnalysis')}}</small>
                        </div>
                    </div>
                    <div class="mb-4">
                        <h4>{{$t('dataSource.analysis.multidimensional')}}</h4>
                        <div v-if="multidimensionalCards && multidimensionalCards.length" class="analysisBox scroll-area">
                            <data-source-card v-for="card, inx in multidimensionalCards" :key="inx" :info="card"
                                @action="deleteCard" />
                        </div>
                        <div v-else>
                            <small>{{$t('dataSource.analysis.noAnalysis')}}</small>
                        </div>
                    </div>
                </b-card>
            </div>
        </div>
    </main>
</template>
<script>
import axios from 'axios';
import DataSourceOptions from '../../components/data-source/DataSourceOptions.vue';
import DataSourceCard from '../../components/data-source/DataSourceAnalysisCard.vue';
import Modal from '../../views/modal/ModalDataSourceAnalysis.vue';
import Notifier from '../../mixins/Notifier.js';
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

function compare(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}



export default {
    mixins: [Notifier],
    components: {
        DataSourceOptions,
        DataSourceCard,
        Modal
    },
    data() {
        return {
            dataSource: null,
            choice: null,
            unidimensionalCards: [],
            bidimensionalCards: [],
            multidimensionalCards: [],
            attributes: null
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            const resp = await axios.get(
                `${limoneroUrl}/datasources/${this.$route.params.id}`
            );
            this.dataSource = resp.data;
            this.attributes = resp.data.attributes.sort(compare);
        },
        select(option) {
            this.choice = option;
        },
        addCard(info) {
            for (let i = 0; i < info.graphs.length; i++) {
                let card = {
                    type: info.analysisType,
                    attribute: info.attribute,
                    analysis: info.graphs[i]
                };
                if (card.type == 'unidimensional') {
                    this.unidimensionalCards.push(card);
                }
                if (card.type == 'bidimensional') {
                    this.bidimensionalCards.push(card);
                }
                if (card.type == 'multidimensional') {
                    this.multidimensionalCards.push(card);
                }
            }
        },
        deleteCard(card) {
            this.confirm(this.$t('actions.delete'), 'Excluir esta análise?',
                () => {
                    switch (card.type) {
                        case 'unidimensional':
                            this.unidimensionalCards.splice(this.unidimensionalCards.indexOf(card), 1);
                            break;
                        case 'bidimensional':
                            this.bidimensionalCards.splice(this.bidimensionalCards.indexOf(card), 1);
                            break;
                        case 'multidimensional':
                            this.multidimensionalCards.splice(this.multidimensionalCards.indexOf(card), 1);
                            break;
                        default:
                            break;
                    }
                }
            );
        }
    },

};
</script>

<style scoped>
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 10% 0 0;
}

.analysisBox {
    display: flex;
    flex-direction: row;
    height: 60vh;
    border: 1px solid #d9dadb;
    border-radius: 4px;
    overflow: auto;
}
</style>
