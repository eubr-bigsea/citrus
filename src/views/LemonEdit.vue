<template>
    <div class="editPage-page">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom">
            <h1 class="editPage-title">
                Metafluxo
            </h1>
            <div>
                <!-- <button class="btn btn-outline-secondary float-left ml-2" @click="agendamentos">
                    <font-awesome-icon icon="fa fa-clock" /> Agendamentos
                </button> -->
                <button class="btn btn-outline-secondary float-left ml-2" @click="abrirHistoryModal">
                    <font-awesome-icon icon="fa fa-history" /> Execuções
                </button>
                <button class="btn btn-primary btn-lemonade-primary float-left ml-2" @click="salvar">
                    <font-awesome-icon icon="fa fa-check" /> Salvar
                </button>
            </div>
            <b-modal ref="historyModal" title="Histórico de Execuções" ok-only
                     size="xl" scrollable>
                <div class="editPage-historico-body">
                    <v-client-table v-model="data" class="editPage-historico-table" :columns="columns" :options="options">
                        <template #id="props">
                            {{props.row.id}}
                        </template>
                        <template #status="props">
                            <div class="editPage-status" :class="props.row.status.toLowerCase()">
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
            </b-modal>
        </div>

        <div class="editPage-body">
            <div class="editPage-container">
                <div class="editPage-tabs">
                    <b-tabs nav-class="custom-lemon-tabs mb-0">
                        <b-tab active class="editPage-tab" :title="$tc('titles.metafluxo')">
                            <div class="editPage-tab-header">
                                <b-button class="editPage-tab-button" variant="dark" @click="abrirAddOpModal">
                                    <font-awesome-icon icon="fa fa-plus" />
                                    Adicionar operação
                                </b-button>
                                <b-button class="editPage-tab-button" variant="dark" @click="abrirAddSourceModal">
                                    <font-awesome-icon icon="fa fa-clock" />
                                    Adicionar fonte de dados
                                </b-button>
                            </div>
                            <b-modal ref="addOpModal" title="Adicionar operação">
                                <p>Conteúdo do Modal</p>
                            </b-modal>
                            <b-modal ref="addSourceModal" title="Adicionar fonte de dados">
                                <p>Conteúdo do Modal</p>
                            </b-modal>
                            <draggable v-model="etapasMetafluxo" :options="dragOptions">
                                <div v-for="(etapa, index) in etapasMetafluxo" :key="etapa.id" class="editPage-dragDiv">
                                    <font-awesome-icon class="editPage-dragIcon" icon="fa fa-grip-vertical" />
                                    # {{index + 1}} -
                                    <button class="editPage-stepButton" @click="abrirModal">
                                        {{etapa.nome}}
                                    </button>


                                    <button class="editPage-trashIcon ml-2 btn btn-sm btn-danger" @click="abrirDeleteModal">
                                        <font-awesome-icon icon="trash" />
                                    </button>
                                </div>
                            </draggable>
                            <b-modal ref="modal" title="Título do Modal">
                                <p>Conteúdo do Modal</p>
                            </b-modal>
                            <b-modal ref="deleteModal" title="Confirmação de exclusão" @ok="respostaUsuario">
                                <p>Deseja excluir esta etapa?</p>
                            </b-modal>
                        </b-tab>
                        <b-tab class="editPage-tab" :title="$tc('titles.landingZone')">
                            Landing Zone
                        </b-tab>
                        <b-tab class="editPage-tab" :title="$tc('titles.raw')">
                            Raw
                        </b-tab>
                        <b-tab class="editPage-tab" :title="$tc('titles.stage')">
                            Stage
                        </b-tab>
                        <b-tab class="editPage-tab" :title="$tc('titles.dataset')">
                            Dataset
                        </b-tab>
                    </b-tabs>
                </div>
                <div class="editPage-agendador">
                    <div class="editPage-agendador-title">
                        <font-awesome-icon class="editPage-agendadorIcon" icon="fa fa-calendar-alt" />
                        <span class="ml-2">Agendador de fluxo</span>
                    </div>
                    <div class="editPage-agendador-body">
                        <div class="editPage-agendador-box">
                            <div class="editPage-agendador-group">
                                <label class="editPage-label" for="descricao">Descrição: </label>
                                <textarea id="descricao" class="editPage-textarea" type="text"
                                          placeholder="Text area label" />
                            </div>
                        </div>
                        <div class="editPage-agendador-box">
                            <p class="font-weight-bold">
                                Quando deseja que seu fluxo seja inicializado?
                            </p>
                            <b-form-radio-group>
                                <b-form-radio value="uma-vez">
                                    Uma vez
                                </b-form-radio>
                                <b-form-radio value="diariamente">
                                    Diariamente
                                </b-form-radio>
                                <b-form-radio value="semanalmente">
                                    Semanalmente
                                </b-form-radio>
                                <b-form-radio value="mensalmente">
                                    Mensalmente
                                </b-form-radio>
                            </b-form-radio-group>
                        </div>
                        <div class="editPage-agendador-box" :class="radios">
                            <p class="font-weight-bold">
                                Iniciar:
                            </p>
                            <input id="iniciar-data" class="editPage-input" type="date">
                            <input id="iniciar-hora" class="editPage-input" type="time">
                        </div>
                        <div class="editPage-agendador-box" :class="dias">
                            <p class="font-weight-bold">
                                Intervalo de repetição (dias):
                            </p>
                            <input id="repetir-dias" class="editPage-input" :class="dias" type="number"
                                   min="0">
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import { BModal } from 'bootstrap-vue';

export default {
    components: {
        draggable,
        BModal
    },
    data() {
        return {
            deleteResponse: null,
            radios: 'radios',
            dias: 'dias',
            etapasMetafluxo: [
                { id: 1, nome: 'Landing Zone' },
                { id: 2, nome: 'Raw' },
                { id: 3, nome: 'Stage_1' },
                { id: 4, nome: 'Dataset' },
                { id: 5, nome: 'MDM' },
            ],
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            },
            columns: [
                'id',
                'etapa',
                'data_exec',
                'status',
                'log',
            ],
            data: getData(),
            options: {
                skin: 'table-sm table table-hover',
                dateColumns: ['data_exec'],
                columnClasses: { actions: 'th-10' },
                headings: {
                    id: 'ID',
                    etapa: 'Etapa',
                    data_exec: 'Data da execução',
                    status: 'Status',
                    log: 'Log de execução',
                },
                sortable: ['id','etapa','data_exec','status','log'],
                filterable: ['id','etapa','data_exec','status','log'],
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ml-10',
                    up: 'sort-up',
                    down: 'sort-down'
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
        salvar() {
            alert("Salvo.");
        },
        abrirAddOpModal() {
            this.$refs.addOpModal.show();
        },
        abrirAddSourceModal() {
            this.$refs.addSourceModal.show();
        },
        abrirModal() {
            this.$refs.modal.show();
        },
        abrirDeleteModal() {
            this.$refs.deleteModal.show();
        },
        abrirHistoryModal() {
            this.$refs.historyModal.show();
        },
        respostaUsuario() {
            // Lógica para capturar a resposta do usuário
            console.log('Resposta do usuário: ' + this.deleteResponse);
        },
    }
};

function getData() {
    return [
        { 
            id: 1, 
            etapa: 'Landing', 
            data_exec: '10/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 2, 
            etapa: 'Landing', 
            data_exec: '07/05/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 3, 
            etapa: 'Landing', 
            data_exec: '15/10/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 4, 
            etapa: 'Landing', 
            data_exec: '24/10/2023',   
            status: 'Em_execucao',   
            log: "" 
        },
        { 
            id: 5, 
            etapa: 'Landing', 
            data_exec: '10/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 6, 
            etapa: 'Landing', 
            data_exec: '07/05/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 7, 
            etapa: 'Landing', 
            data_exec: '15/10/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 8, 
            etapa: 'Landing', 
            data_exec: '24/10/2023',   
            status: 'Em_execucao',   
            log: "" 
        },
        { 
            id: 9, 
            etapa: 'Landing', 
            data_exec: '10/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 10,
            etapa: 'Landing',  
            data_exec: '07/05/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 11,
            etapa: 'Landing',  
            data_exec: '15/10/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 12,
            etapa: 'Landing',  
            data_exec: '24/10/2023',   
            status: 'Em_execucao',   
            log: "" 
        },
    ];
}
</script>

<style lang="scss">

.editPage-title {
    color: #333;
    margin: 10px 0px;
}

.editPage-page {
    height: 80vh;
}

.editPage-body {
    display: flex;
    flex-direction: row;
    gap: 40px;
    height: fit-content;
    padding-bottom: 20px;
}

.editPage-tabs {
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: fit-content;
    min-height: 400px;
    border: 1px solid #cccccc;
    border-radius: 5px;
}

.editPage-tab {
    display: flex;
    position: relative;
    padding: 20px;
}

.editPage-tab-header {
    display: flex;
    flex-direction: row;
    gap: 5px;
    margin-bottom: 10px;
    border-bottom: 2px solid #dfdfdf;
    padding-bottom: 10px;
}

.editPage-tab-button {
    background-color: #86B94B;
    border: 0px;

    &:hover {
        background-color: #618c31;
    }
}

.editPage-dragDiv {
    display: flex;
    position: relative;
    border: 2px solid #dfdfdf;
    padding: 15px 30px;
    margin-bottom: -2px;
    font-weight: 700;
    border-radius: 3px;

    &:hover {
        cursor: grab;
    }
}

.editPage-stepButton {
    background-color: transparent;
    border: 0px;
    color: #007bff;
    font-weight: 700;

    &:hover {
        color: #0056b3;
    }
}

.editPage-dragIcon {
    position: absolute;
    left: 4px;
    top: 4px;
    color: #212529;
    width: 8px;
}

.editPage-trashIcon {
    position: absolute;
    right: 8px;
    top: 12px;
}

.editPage-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    /* padding: 20px; */
    gap: 20px;
    width: 100%;
}

.editPage-agendador {
    display: flex;
    flex-direction: column;
    height: fit-content;
}

.editPage-agendador-title {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: #86B94B;
    padding: 20px;
    font-weight: 700;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.editPage-agendador-body {
    display: flex;
    flex-direction: column;
    padding: 30px 30px;
    align-items: start;
    gap: 40px;
    border: 1px solid #cccccc;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.editPage-agendador-box {
    display: flex;
    flex-direction: column;
    width: 100%;

    &.radios {
        flex-direction: row;
        gap: 20px;
        align-items: center;
    }

    &.dias {
        flex-direction: row;
        align-items: center;
        gap: 20px;
    }
}

.editPage-agendador-group {
    display: flex;
    flex-direction: row;
    gap: 30px;
    width: 100%;
}

.editPage-historico {
    display: flex;
    flex-direction: column;
    height: fit-content;
}

.editPage-historico-title {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #86B94B;
    padding: 20px;
    font-weight: 700;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.editPage-historico-body {
    display: flex;
    width: 100%;
    flex-direction: row;
    padding: 5px;
    align-items: start;
}

.editPage-historico-table {
    width: 100%;
}

.editPage-historico-table th {
    text-align: center;
}

.editPage-historico-table td {
    text-align: center;
    /* border-left: 1px solid black; */
}

.editPage-label {
    display: block;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
}

.editPage-input {
    width: 100%;
    height: fit-content;
    padding: 12px 20px;
    margin-bottom: 25px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;

    &.dias {
        width: 90px;
    }
}

.editPage-textarea {
    width: 100%;
    max-height: 150px;
    height: fit-content;
    padding: 12px 20px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;
}

</style>