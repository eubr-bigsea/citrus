<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom">
            <h1 class="page-title">
                Configuração do Lemon
            </h1>
            <!-- <button class="page-button-header" @click="salvar">
                <font-awesome-icon icon="fa fa-plus" /> Salvar
            </button> -->
            <button class="btn btn-primary btn-lemonade-primary float-left ml-2" @click="salvar">
                <font-awesome-icon icon="fa fa-plus" /> Salvar
            </button>
        </div>

        <div class="page-body">
            <div class="page-card-1">
                <div>
                    <label class="page-label" for="identificador">Identificador</label>
                    <input id="identificador" v-model="identificador" class="page-input" type="text"
                           placeholder="Text input label">
                </div>

                <div>
                    <label class="page-label" for="descricao">Descrição</label>
                    <textarea id="descricao" v-model="descricao" class="page-textarea" type="text"
                              placeholder="Text area label" />
                </div>

                <!-- <button class="page-button-body" @click="adicionar">
                    <font-awesome-icon icon="fa fa-plus" /> {{$tc('titles.add', 2)}}
                </button> -->
                <button class="btn btn-primary btn-lemonade-primary float-left ml-2" @click="adicionar">
                    <font-awesome-icon icon="fa fa-plus" /> Adicionar
                </button>
            </div>
            <div class="page-card-2">
                <div class="card-body">
                    <v-client-table class="card-table" :data="tableData" :columns="columns" :options="options" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            columns: [
                'ordem_da_etapa',
                'identificador',
                'acoes'
            ],
            tableData: [
                { ordem_da_etapa: 1, identificador: "Landing Zone", acoes: "Ordenar | Excluir" },
                { ordem_da_etapa: 2, identificador: "Raw", acoes: "Ordenar | Excluir" },
                { ordem_da_etapa: 3, identificador: "Stage", acoes: "Ordenar | Excluir" },
                { ordem_da_etapa: 4, identificador: "Dataset", acoes: "Ordenar | Excluir" },
                { ordem_da_etapa: 5, identificador: "MDM", acoes: "Ordenar | Excluir" },
            ],
            options: {
                // debounce: 800,
                skin: 'table-sm table table-hover',
                columnClasses: { actions: 'th-10' },
                headings: {
                    ordem_da_etapa: 'Ordem da Etapa',
                    identificador: 'Identificador',
                    acoes: 'Ações',
                },
                sortable: ['ordem_da_etapa', 'identificador', 'acoes'],
                filterable: false,
                limitable: false,
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
                // texts: {
                //     filter: this.$tc('common.filter'),
                //     count: this.$t('common.pagerShowing'),
                //     limit: this.$t('common.limit'),
                //     noResults: this.$t('common.noData'),
                //     loading: this.$t('common.loading'),
                //     filterPlaceholder: this.$t('common.filterPlaceholder')
                // }
            }
        };
    },
    methods: {
        adicionar() {
            alert("Adicionar.");
        },

        salvar() {
            alert("Salvo.");
        }
    }
};
</script>

<style>
.page-main {
    background-color: #d9d9d9;
}

.page-header {
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
}

.page-title {
    color: #333;
    margin: 10px 0px;
}

.page-body {
    background-color: #d9d9d9;
    padding: 30px;
    border-radius: 3px;
    border: 1px solid #e1e1e1;
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.page-card-1 {
    width: 40%;
    background-color: #fff;
    padding: 30px;
    border: 1px solid #5f5f5f;
    border-radius: 3px;
}

.page-card-2 {
    width: 60%;
    padding: 30px;
}

.card-table {
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