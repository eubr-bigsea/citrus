<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$tc('titles.storage', 2)}}</h1>
                        <router-link :to="{name: 'addStorage'}"
                                     class="btn btn-sm btn-outline-primary">
                            {{$t('actions.addItem')}}
                        </router-link>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <v-server-table ref="storageList"
                                                    :columns="columns"
                                                    :options="options"
                                                    name="storageList">
                                        <template #id="props">
                                            <router-link :to="{name: 'editStorage', params: {id: props.row.id}}">
                                                {{props.row.id}}
                                            </router-link>
                                        </template>
                                        <template #name="props">
                                            <router-link :to="{name: 'editStorage', params: {id: props.row.id}}">
                                                {{props.row.name}}
                                            </router-link>
                                        </template>
                                        <template #type="props">
                                            {{props.row.type}}
                                        </template>
                                        <template #enabled="props">
                                            {{$tc(props.row.enabled ? 'common.yes': 'common.no')}}
                                        </template>
                                        <template #actions="props">
                                            <button class="btn btn-sm btn-light"
                                                    @click="remove(props.row.id)">
                                                <font-awesome-icon icon="trash" />
                                            </button>
                                        </template>
                                    </v-server-table>
                                </div>
                            </div>
                        </div>
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

</style>
