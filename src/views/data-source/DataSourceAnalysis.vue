<template>
    <main role="main">
        <div class="row header">
            <div class="title col-md-3">
                <h1>{{$tc('titles.dataSource', 1)}}</h1>
            </div>
            <div>{{dataSource.name}}</div>
            <b-button variant="success" class="btn btn-primary" @click="$bvModal.show('modal')">
                Adicionar...
            </b-button>
            <modal :atributtes="atributtes" @cards="addCard" />
        </div>

        <div class="row">
            <div class="col-md-2">
                <data-source-options selected="dataSourceAnalysis" />
            </div>

            <div class="col-md-8">
                <div>
                    <h4>Unidimensional</h4>
                    <div class="analysisBox">
                        <data-source-card v-for="card in unidimensionalCards" 
                                          :key="card" 
                                          :info="card"
                                          @action="deleteCard" />
                    </div>
                </div>
                <div>
                    <h4>Bidimensional</h4>
                    <div class="analysisBox">
                        <data-source-card v-for="card in bidimensionalCards" 
                                          :key="card" 
                                          :info="card"
                                          @action="deleteCard" />
                    </div>
                </div>
                <div>
                    <h4>Multidimensional</h4>
                    <div class="analysisBox">
                        <data-source-card v-for="card in multidimensionalCards" 
                                          :key="card" 
                                          :info="card"
                                          @action="deleteCard" />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import axios from 'axios';
import DataSourceOptions from '../../components/data-source/DataSourceOptions.vue';
import DataSourceCard from '../../components/data-source/DataSourceAnalysisCard.vue';
import Modal from '../../views/modal/ModalDataSourceAnalysis.vue';
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

function compare( a, b ) {
    if ( a.name < b.name ){
        return -1;
    }
    if ( a.name > b.name ){
        return 1;
    }
    return 0;
}



export default {
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
            atributtes: null
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
            this.atributtes = resp.data.attributes.sort(compare);
        },
        select(option) {
            this.choice = option;
        },
        addCard(info) {
            for (let i = 0; i < info.graphs.length; i++) {
                let card = {
                    type: info.analysisType,
                    atributte: info.atributte,
                    analysis: info.graphs[i]
                };
                if (card.type == 'unidimensional')
                {
                    this.unidimensionalCards.push(card);
                }
                if (card.type == 'bidimensional')
                {
                    this.bidimensionalCards.push(card);
                }
                if (card.type == 'multidimensional')
                {
                    this.multidimensionalCards.push(card);
                }
            }
        },
        deleteCard(card) {
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
