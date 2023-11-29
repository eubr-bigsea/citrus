<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom">
            <h1 class="historyPage-title">
                Histórico de Execuções
            </h1>
        </div> 


        <div class="historyPage-body">
            <div class="historyPage-container">
                <v-client-table v-model="data" class="historyPage-table" :columns="columns" :options="options">
                    <template #id="props">
                        <router-link :to="{name: 'lemon-edit', params: {id: props.row.id}}">
                            {{props.row.id}}
                        </router-link>
                    </template>
                    <template #pipeline="props">
                        <router-link :to="{name: 'lemon-edit', params: {id: props.row.id}}">
                            {{props.row.pipeline}}
                        </router-link>
                    </template>
                    <template #status="props">
                        <div class="historyPage-status" :class="props.row.status.toLowerCase()">
                            {{props.row.status}}
                        </div>
                    </template>
                    <template #log>
                        <div class="btn-group" role="group">
                            <button class="btn btn-spinner btn-primary btn-sm" title="Exibir Log" @click="abrirLogModal">
                                <font-awesome-icon icon="fa-eye" />
                            </button>
                        </div>
                        <b-modal ref="logModal" size="lg" title="Log de execução da pipeline" hide-footer>
                            <b-card class="historyPage-logCard">
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                            </b-card>
                        </b-modal>
                    </template>
                </v-client-table>
            </div>
        </div>
    </div>
</template>

<script>
import { BModal } from 'bootstrap-vue';

export default {
    components: {
        BModal
    },
    data() {
        return {
            columns: [
                'id',
                'pipeline',
                'ultima_exec',
                'status',
                'log',
            ],
            data: getData(),
            options: {
                skin: 'table-sm table table-hover',
                dateColumns: ['ultima_exec'],
                columnsClasses: { 
                    id: 'text-start',
                    pipeline: 'text-start',
                    ultima_exec: 'text-start',
                    status: 'text-start',
                    log: 'text-start',
                },
                headings: {
                    id: 'ID',
                    pipeline: 'Pipeline',
                    ultima_exec: 'Última execução',
                    status: 'Status',
                    log: 'Log de execução',
                },
                sortable: ['id','pipeline','ultima_exec'],
                filterable: ['id','pipeline','ultima_exec'],
                sortIcon: {
                    base: 'fa fas',
                    is: 'fa-sort ml-10',
                    up: 'fa-sort-amount-up',
                    down: 'fa-sort-amount-down'
                },
                texts: {
                    filter: this.$tc('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
                }
            }
        };
    },
    methods: {
        abrirLogModal() {
            this.$refs.logModal.show();
        },
    }
};

function getData() {
    return [
        { 
            id: 100, 
            pipeline: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 101, 
            pipeline: "Licitações", 
            ultima_exec: '05/10/2021',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 102, 
            pipeline: "Copasa", 
            ultima_exec: '13/05/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 103, 
            pipeline: "Consumidor Gov", 
            ultima_exec: '08/10/2010',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 104, 
            pipeline: "Endereço", 
            ultima_exec: '07/05/2021',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 105, 
            pipeline: "Fakenews", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 106, 
            pipeline: "Ibge", 
            ultima_exec: '24/08/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 107, 
            pipeline: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 108, 
            pipeline: "Inss", 
            ultima_exec: '24/08/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 100, 
            pipeline: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 101, 
            pipeline: "Licitações", 
            ultima_exec: '05/10/2021',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 102, 
            pipeline: "Copasa", 
            ultima_exec: '13/05/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 103, 
            pipeline: "Consumidor Gov", 
            ultima_exec: '08/10/2010',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 104, 
            pipeline: "Endereço", 
            ultima_exec: '07/05/2021',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 105, 
            pipeline: "Fakenews", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 106, 
            pipeline: "Ibge", 
            ultima_exec: '24/08/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 107, 
            pipeline: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 108, 
            pipeline: "Inss", 
            ultima_exec: '24/08/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 100, 
            pipeline: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 101, 
            pipeline: "Licitações", 
            ultima_exec: '05/10/2021',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 102, 
            pipeline: "Copasa", 
            ultima_exec: '13/05/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 103, 
            pipeline: "Consumidor Gov", 
            ultima_exec: '08/10/2010',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 104, 
            pipeline: "Endereço", 
            ultima_exec: '07/05/2021',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 105, 
            pipeline: "Fakenews", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 106, 
            pipeline: "Ibge", 
            ultima_exec: '24/08/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 107, 
            pipeline: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 108, 
            pipeline: "Inss", 
            ultima_exec: '24/08/2023',   
            status: 'Erro',   
            log: "" 
        },
    ];
}
</script>

<style>

.historyPage-title {
    color: #333;
    margin: 10px 0px;
}

.historyPage-body {
    width: 100%;
    background-color: #fff;
    /* padding: 10px; */
    /* border: 1px solid #5f5f5f; */
    border-radius: 3px;
}

.historyPage-container {
    border: 1px solid #dee2e6;
    padding: 16px;
    border-radius: 3px;
}

.historyPage-table {
    background-color: #FFF;
}

.historyPage-logCard {
    background-color: #f6f6f6;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: #767676;
    text-align: justify;
}

</style>