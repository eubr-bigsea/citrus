<template>
    <div>
        <div class="d-flex justify-content-between align-items-center py-2 mb-2 border-bottom">
            <h1 class="lemon-page-title">
                Metafluxo
            </h1>
            <!-- <button class="page-button-header" @click="salvar">
                <font-awesome-icon icon="fa fa-plus" /> Salvar
            </button> -->
            <div>
                <router-link :to="{name: 'lemon-history'}" class="btn btn-outline-secondary float-left ml-2">
                    <font-awesome-icon icon="fa fa-history" /> Histórico
                </router-link>
                <router-link :to="{name: 'lemon-configuration'}" class="btn btn-primary btn-lemonade-primary float-left ml-2">
                    <font-awesome-icon icon="fa fa-plus" /> Adicionar
                </router-link>
            </div>
        </div> 


        <div class="lemon-page-card">
            <div class="lemon-card-body">
                <v-client-table class="lemon-card-table" :data="tableData" :columns="columns" :options="options" />
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
                'inicio_exec',
                'intervalo',
                'fim_exec',
                'status_ultima',
                'data_cria',
                'status',
                'acoes',
            ],
            tableData: [
                { id: 100, metafluxos: "Anac", inicio_exec: '24/08/2023', intervalo: '30 dias', fim_exec: '30/12/2023', status_ultima: 'Sucesso', data_cria: '24/08/2023', status: 'Concluído', acoes: "Ordenar | Excluir" },
                { id: 101, metafluxos: "Licitações", inicio_exec: '05/10/2021', intervalo: '6 horas', fim_exec: '---', status_ultima: 'Erro', data_cria: '24/08/2023', status: 'Concluído', acoes: "Ordenar | Excluir" },
                { id: 102, metafluxos: "Copasa", inicio_exec: '13/05/2022', intervalo: '7 dias', fim_exec: '30/12/2023', status_ultima: 'Sucesso', data_cria: '24/08/2023', status: 'Não Concluído', acoes: "Ordenar | Excluir" },
                { id: 103, metafluxos: "Consumidor Gov", inicio_exec: '08/10/2010', intervalo: '3 dias', fim_exec: '30/12/2023', status_ultima: 'Sucesso', data_cria: '24/08/2023', status: 'Concluído', acoes: "Ordenar | Excluir" },
                { id: 104, metafluxos: "Endereço", inicio_exec: '07/05/2021', intervalo: '6 horas', fim_exec: '---', status_ultima: 'Sucesso', data_cria: '24/08/2023', status: 'Não Concluído', acoes: "Ordenar | Excluir" },
                { id: 105, metafluxos: "Fakenews", inicio_exec: '24/08/2023', intervalo: '30 dias', fim_exec: '---', status_ultima: 'Sucesso', data_cria: '24/08/2023', status: 'Concluído', acoes: "Ordenar | Excluir" },
                { id: 106, metafluxos: "Ibge", inicio_exec: '24/08/2023', intervalo: '30 dias', fim_exec: '30/12/2023', status_ultima: 'Pendente', data_cria: '24/08/2023', status: 'Concluído', acoes: "Ordenar | Excluir" },
                { id: 107, metafluxos: "Anac", inicio_exec: '24/08/2023', intervalo: '30 dias', fim_exec: '30/12/2023', status_ultima: 'Sucesso', data_cria: '24/08/2023', status: 'Concluído', acoes: "Ordenar | Excluir" },
                { id: 108, metafluxos: "Inss", inicio_exec: '24/08/2023', intervalo: '30 dias', fim_exec: '30/12/2023', status_ultima: 'Erro', data_cria: '24/08/2023', status: 'Concluído', acoes: "Ordenar | Excluir" },
            ],
            options: {
                // debounce: 800,
                skin: 'table-sm table table-hover',
                dateColumns: ['inicio_exec', 'fim_exec', 'data_cria'],
                columnClasses: { actions: 'th-10' },
                headings: {
                    id: 'ID',
                    metafluxos: 'Identificador',
                    inicio_exec: 'Início de Execução',
                    intervalo: 'Intervalo',
                    fim_exec: 'Fim de Execução',
                    status_ultima: 'Status da Última Execução',
                    data_cria: 'Data de Criação',
                    status: 'Status',
                    acoes: 'Ações',
                },
                sortable: ['id','metafluxos','inicio_exec','intervalo','fim_exec','status_ultima','data_cria','status','acoes'],
                filterable: ['id','metafluxos','inicio_exec','intervalo','fim_exec','status_ultima','data_cria','status','acoes'],
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
</script>

<style>
.page-header {
    border-bottom: 1px solid #dee2e6;
    /* margin-bottom: 0.5rem; */
    display: flex;
    justify-content: space-between;
}

.lemon-page-title {
    color: #333;
    /* margin: 10px 0px; */
}

.lemon-page-card {
    width: 100%;
    background-color: #fff;
    /* padding: 10px; */
    /* border: 1px solid #5f5f5f; */
    border-radius: 3px;
}

.lemon-card-body {
    border: 1px solid #dee2e6;
    padding: 16px;
    border-radius: 3px;
}

.lemon-card-table {
    background-color: #FFF;
}

.page-label {
    display: block;
    margin-bottom: 10px;
    font-size: 18px;
}

.page-input {
    width: 60%;
    height: fit-content;
    padding: 12px 20px;
    margin-bottom: 25px;
    border-radius: 16px;
    border: none;
    background-color: #eff0f6;
}

.page-textarea {
    width: 60%;
    height: fit-content;
    padding: 12px 20px;
    margin-bottom: 25px;
    border-radius: 16px;
    border: none;
    background-color: #eff0f6;
}

.page-button-header {
    background-color: transparent;
    color: #610bef;
    font-weight: bold;
    border: 1px solid #610bef;
    cursor: pointer;
    border-radius: 12px;
    padding: 0px 20px;
}

.page-button-body {
    background-color: #610bef;
    color: #fff;
    padding: 12px 25px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    border-radius: 12px;
}

.page-button-header:hover {
    background-color: #d1d1d1
}

.page-button-body:hover {
    background-color: #4b08b6;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 10px;
}
</style>