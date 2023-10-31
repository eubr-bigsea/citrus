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
                    <template #coletor="props">
                        <router-link :to="{name: 'lemon-edit', params: {id: props.row.id}}">
                            {{props.row.coletor}}
                        </router-link>
                    </template>
                    <template #status="props">
                        <div class="lemonPage-status-ultima" :class="props.row.status.toLowerCase()">
                            {{props.row.status}}
                        </div>
                    </template>
                    <template #log>
                        <div class="btn-group" role="group">
                            <button class="btn btn-spinner btn-primary btn-sm">
                                <font-awesome-icon icon="fa-eye" />
                            </button>
                        </div>
                    </template>
                </v-client-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            columns: [
                'id',
                'coletor',
                'ultima_exec',
                'status',
                'log',
            ],
            data: getData(),
            options: {
                // debounce: 800,
                skin: 'table-sm table table-hover',
                dateColumns: ['ultima_exec'],
                columnClasses: { actions: 'th-10' },
                headings: {
                    id: 'ID',
                    coletor: 'Coletor',
                    ultima_exec: 'Última Execução',
                    status: 'Status',
                    log: 'Log de Execução',
                },
                sortable: ['id','coletor','ultima_exec','status','log'],
                filterable: ['id','coletor','ultima_exec','status','log'],
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ml-10',
                    up: 'sort-up',
                    down: 'sort-down'
                },
                // preserveState: true,
                // saveState: true,
                // customFilters: false,
                // filterByColumn: false,
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
        historico() {
            alert("Histórico.");
        }
    }
};

function getData() {
    return [
        { 
            id: 100, 
            coletor: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 101, 
            coletor: "Licitações", 
            ultima_exec: '05/10/2021',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 102, 
            coletor: "Copasa", 
            ultima_exec: '13/05/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 103, 
            coletor: "Consumidor Gov", 
            ultima_exec: '08/10/2010',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 104, 
            coletor: "Endereço", 
            ultima_exec: '07/05/2021',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 105, 
            coletor: "Fakenews", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 106, 
            coletor: "Ibge", 
            ultima_exec: '24/08/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 107, 
            coletor: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 108, 
            coletor: "Inss", 
            ultima_exec: '24/08/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 100, 
            coletor: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 101, 
            coletor: "Licitações", 
            ultima_exec: '05/10/2021',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 102, 
            coletor: "Copasa", 
            ultima_exec: '13/05/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 103, 
            coletor: "Consumidor Gov", 
            ultima_exec: '08/10/2010',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 104, 
            coletor: "Endereço", 
            ultima_exec: '07/05/2021',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 105, 
            coletor: "Fakenews", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 106, 
            coletor: "Ibge", 
            ultima_exec: '24/08/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 107, 
            coletor: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 108, 
            coletor: "Inss", 
            ultima_exec: '24/08/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 100, 
            coletor: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 101, 
            coletor: "Licitações", 
            ultima_exec: '05/10/2021',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 102, 
            coletor: "Copasa", 
            ultima_exec: '13/05/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 103, 
            coletor: "Consumidor Gov", 
            ultima_exec: '08/10/2010',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 104, 
            coletor: "Endereço", 
            ultima_exec: '07/05/2021',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 105, 
            coletor: "Fakenews", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 106, 
            coletor: "Ibge", 
            ultima_exec: '24/08/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 107, 
            coletor: "Anac", 
            ultima_exec: '24/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 108, 
            coletor: "Inss", 
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

</style>