<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom">
            <h1 class="lemonPage-title">
                Pipelines
            </h1>
            <div>
                <router-link :to="{name: 'lemon-history'}" class="btn btn-outline-secondary float-left ml-2">
                    <font-awesome-icon icon="fa fa-history" /> Histórico
                </router-link>
                <router-link :to="{name: 'lemon-configuration'}" class="btn btn-primary btn-lemonade-primary float-left ml-2">
                    <font-awesome-icon icon="fa fa-plus" /> Adicionar
                </router-link>
            </div>
        </div> 


        <div class="lemonPage-body">
            <div class="lemonPage-container">
                <v-client-table v-model="data" class="lemonPage-table" :columns="columns" :options="options">
                    <template #id="props">
                        <router-link :to="{name: 'lemon-edit', params: {id: props.row.id}}">
                            {{props.row.id}}
                        </router-link>
                    </template>
                    <template #metafluxos="props">
                        <router-link :to="{name: 'lemon-edit', params: {id: props.row.id}}">
                            {{props.row.metafluxos}}
                        </router-link>
                    </template>
                    <template #status_ultima="props">
                        <div class="lemonPage-status-ultima" :class="props.row.status_ultima.toLowerCase()">
                            {{props.row.status_ultima}}
                        </div>
                    </template>
                    <template #status="props">
                        <div class="lemonPage-status" :class="props.row.status.toLowerCase()" />
                    </template>
                    <template #acoes>
                        <div class="btn-group" role="group">
                            <button class="btn btn-spinner btn-primary btn-sm" title="Exibir log">
                                <font-awesome-icon icon="fa-eye" />
                            </button>
                            <button class="btn btn-spinner btn-secondary btn-sm" title="Parar execução">
                                <font-awesome-icon icon="fa-ban" />
                            </button>
                            <button class="btn btn-sm btn-danger" title="Excluir pipeline">
                                <font-awesome-icon icon="trash" />
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
                'metafluxos',
                'prox_exec',
                'ultima_exec',
                'status_ultima',
                'criado_em',
                'status',
                'acoes',
            ],
            data: getData(),
            options: {
                skin: 'table-sm table table-hover',
                dateColumns: ['prox_exec', 'ultima_exec', 'criado_em'],
                columnClasses: { actions: 'th-10' },
                headings: {
                    id: 'ID',
                    metafluxos: 'Identificador',
                    prox_exec: 'Próxima Execução',
                    ultima_exec: 'Última Execução',
                    status_ultima: 'Status da Última Execução',
                    criado_em: 'Criado Em',
                    status: 'Status',
                    acoes: 'Ações',
                },
                sortable: ['id','metafluxos','prox_exec','ultima_exec','status_ultima','criado_em','status','acoes'],
                filterable: ['id','metafluxos','prox_exec','ultima_exec','status_ultima','criado_em','status','acoes'],
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
    }
};

function getData() {
    return [
        { 
            id: 100, 
            metafluxos: "Anac", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 101, 
            metafluxos: "Licitações", 
            prox_exec: '05/10/2021', 
            ultima_exec: '---', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 102, 
            metafluxos: "Copasa", 
            prox_exec: '13/05/2022', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'nao_concluido', 
            acoes: "" 
        },
        { 
            id: 103, 
            metafluxos: "Consumidor Gov", 
            prox_exec: '08/10/2010', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 104, 
            metafluxos: "Endereço", 
            prox_exec: '07/05/2021', 
            ultima_exec: '---', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'nao_concluido', 
            acoes: "" 
        },
        { 
            id: 105, 
            metafluxos: "Fakenews", 
            prox_exec: '24/08/2023', 
            ultima_exec: '---', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 106, 
            metafluxos: "Ibge", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Pendente', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 107, 
            metafluxos: "Anac", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 108, 
            metafluxos: "Inss", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            status: 'nao_concluido', 
            acoes: "" 
        },
        { 
            id: 100, 
            metafluxos: "Anac", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 101, 
            metafluxos: "Licitações", 
            prox_exec: '05/10/2021', 
            ultima_exec: '---', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 102, 
            metafluxos: "Copasa", 
            prox_exec: '13/05/2022', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'nao_concluido', 
            acoes: "" 
        },
        { 
            id: 103, 
            metafluxos: "Consumidor Gov", 
            prox_exec: '08/10/2010', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 104, 
            metafluxos: "Endereço", 
            prox_exec: '07/05/2021', 
            ultima_exec: '---', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'nao_concluido', 
            acoes: "" 
        },
        { 
            id: 105, 
            metafluxos: "Fakenews", 
            prox_exec: '24/08/2023', 
            ultima_exec: '---', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 106, 
            metafluxos: "Ibge", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Pendente', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 107, 
            metafluxos: "Anac", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 108, 
            metafluxos: "Inss", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            status: 'nao_concluido', 
            acoes: "" 
        },
        { 
            id: 100, 
            metafluxos: "Anac", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 101, 
            metafluxos: "Licitações", 
            prox_exec: '05/10/2021', 
            ultima_exec: '---', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 102, 
            metafluxos: "Copasa", 
            prox_exec: '13/05/2022', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'nao_concluido', 
            acoes: "" 
        },
        { 
            id: 103, 
            metafluxos: "Consumidor Gov", 
            prox_exec: '08/10/2010', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 104, 
            metafluxos: "Endereço", 
            prox_exec: '07/05/2021', 
            ultima_exec: '---', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'nao_concluido', 
            acoes: "" 
        },
        { 
            id: 105, 
            metafluxos: "Fakenews", 
            prox_exec: '24/08/2023', 
            ultima_exec: '---', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 106, 
            metafluxos: "Ibge", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Pendente', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 107, 
            metafluxos: "Anac", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            status: 'concluido', 
            acoes: "" 
        },
        { 
            id: 108, 
            metafluxos: "Inss", 
            prox_exec: '24/08/2023', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            status: 'nao_concluido', 
            acoes: "" 
        },
    ];
}
</script>

<style>

.lemonPage-title {
    color: #333;
    margin: 10px 0px;
}

.lemonPage-body {
    width: 100%;
    background-color: #fff;
    /* padding: 10px; */
    /* border: 1px solid #5f5f5f; */
    border-radius: 3px;
}

.lemonPage-container {
    border: 1px solid #dee2e6;
    padding: 16px;
    border-radius: 3px;
}

.lemonPage-table {
    background-color: #FFF;
}

</style>