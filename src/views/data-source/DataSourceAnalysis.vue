<template>
    <main role="main">
        <div class="row header">
            <div class="title col-md">
                <h1>{{ $tc('titles.dataSource', 1) }} {{ dataSource?.name }}</h1>
            </div>
            <b-button :disabled="loading" variant="success" class="btn btn-primary" @click="$bvModal.show('modal')">
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
                        <h4>{{ $t('dataSource.analysis.univariate') }}</h4>
                        <div v-if="univariateCards && univariateCards.length" class="analysisBox scroll-area">
                            <data-source-card v-for="[attr, value] in groupedUnivariate" :key="attr.name"
                                :info="{ attr, value }" @action="deleteCard" />
                        </div>
                        <div v-else>
                            <small>{{ $t('dataSource.analysis.noAnalysis') }}</small>
                        </div>
                    </div>
                    <div class="mb-4">
                        <h4>{{ $t('dataSource.analysis.bivariate') }}</h4>
                        <div v-if="bivariateCards && bivariateCards.length" class="analysisBox scroll-area">
                            <data-source-card v-for="card, inx in bivariateCards" :key="inx" :info="card"
                                @action="deleteCard" />
                        </div>
                        <div v-else>
                            <small>{{ $t('dataSource.analysis.noAnalysis') }}</small>
                        </div>
                    </div>
                    <div class="mb-4">
                        <h4>{{ $t('dataSource.analysis.multivariate') }}</h4>
                        <div v-if="multivariateCards && multivariateCards.length" class="analysisBox scroll-area">
                            <data-source-card v-for="card, inx in multivariateCards" :key="inx" :info="card"
                                @action="deleteCard" />
                        </div>
                        <div v-else>
                            <small>{{ $t('dataSource.analysis.noAnalysis') }}</small>
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
            loading: false,
            univariateCards: [],
            bivariateCards: [],
            multivariateCards: [],
            attributes: null
        };
    },
    computed: {
        groupedUnivariate() {
            return this.univariateCards.reduce(
                (entryMap, e) => entryMap.set(e.attribute, [...entryMap.get(e.attribute) || [], e]),
                new Map()
            );
        }
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
            for (let i = 0; i < info.analysis.length; i++) {
                let card = {
                    type: info.analysisType,
                    attribute: info.attribute,
                    analysis: info.analysis[i]
                };
                if (card.type == 'univariate') {
                    this.univariateCards.push(card);
                } else if (card.type == 'bivariate') {
                    this.bivariateCards.push(card);
                } else if (card.type == 'multivariate') {
                    this.multivariateCards.push(card);
                }
            }
        },
        deleteCard(card) {
            this.confirm(this.$t('actions.delete'), 'Excluir esta análise?',
                () => {
                    switch (card.type) {
                        case 'univariate':
                            this.univariateCards.splice(this.univariateCards.indexOf(card), 1);
                            break;
                        case 'bivariate':
                            this.bivariateCards.splice(this.bivariateCards.indexOf(card), 1);
                            break;
                        case 'multivariate':
                            this.multivariateCards.splice(this.multivariateCards.indexOf(card), 1);
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
    /*height: 60vh;*/
    border: 1px solid #d9dadb;
    border-radius: 4px;
    overflow: auto;
}
</style>
