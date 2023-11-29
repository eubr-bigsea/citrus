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
                        <router-link :to="{name: 'lemon-edit', params: {id: props.row.id, identificador: props.row.identificador, descricao: props.row.descricao, prox_exec: props.row.prox_exec, ultima_exec: props.row.ultima_exec, status_ultima: props.row.status_ultima, criado_em: props.row.criado_em, habilitado: props.row.habilitado}}">
                            {{props.row.id}}
                        </router-link>
                    </template>
                    <template #identificador="props">
                        <router-link :to="{name: 'lemon-edit', params: {id: props.row.id, identificador: props.row.identificador, descricao: props.row.descricao, prox_exec: props.row.prox_exec, ultima_exec: props.row.ultima_exec, status_ultima: props.row.status_ultima, criado_em: props.row.criado_em, habilitado: props.row.habilitado}}">
                            {{props.row.identificador}}
                        </router-link>
                    </template>
                    <template #status_ultima="props">
                        <div class="lemonPage-status-ultima" :class="props.row.status_ultima.toLowerCase()">
                            {{props.row.status_ultima}}
                        </div>
                    </template>
                    <template #habilitado="props">
                        <div class="lemonPage-habilitado" :class="props.row.habilitado.toLowerCase()" />
                    </template>
                    <template #acoes>
                        <div>
                            <button class="btn btn-spinner btn-primary btn-sm" title="Exibir log" @click="abrirLogModal">
                                <font-awesome-icon icon="fa-eye" />
                            </button>
                            <button class="ml-2 btn btn-spinner btn-secondary btn-sm" title="Desabilitar pipeline" @click="openDisablePipelineModal">
                                <font-awesome-icon icon="fa-ban" />
                            </button>
                            <button class="ml-2 btn btn-sm btn-danger" title="Excluir pipeline" @click="abrirDeleteModal">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </div>
                        <b-modal ref="logModal" size="lg" title="Log de execução da pipeline" hide-footer>
                            <b-card class="lemonPage-logCard">
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                                <p>2023-01-01 00:00:00 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui at aliquam optio? Obcaecati, odit?.</p>
                            </b-card>
                        </b-modal>
                        <b-modal ref="disableModal" title="Desabilitar pipeline">
                            <p>Deseja desabilitar esta pipeline?</p>
                        </b-modal>
                        <b-modal ref="deleteModal" title="Confirmar exclusão">
                            <p>Deseja excluir esta pipeline?</p>
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
            wizardStep: 1,
            first: 'first',
            ordem: 'ordem',
            ident: 'ident',
            acoes: 'acoes',
            subtitle: 'subtitle',
            selectedTemplate: null,
            selectTemplates: [
                { value: null, text: 'Não utilizar template' },
                { value: '1', text: 'Template Teste' },
                { value: '2', text: 'Template 1' },
                { value: '3', text: 'Template Lemon' },
                { value: '4', text: 'Template para Pipeline' },
                { value: '5', text: 'Template Lemonade' },
            ],
            selectedStep: null,
            selectSteps: [
                { value: null, text: 'Selecione a etapa' },
                { value: '1', text: 'Landing Zone' },
                { value: '2', text: 'Raw' },
                { value: '3', text: 'Stage_1' },
                { value: '4', text: 'Dataset' },
                { value: '5', text: 'MDM' },
            ],
            etapasPipeline: [
                { id: 1, nome: 'Landing Zone', descricao: 'Descrição Landing Zone' },
                { id: 2, nome: 'Raw', descricao: 'Descrição Raw' },
                { id: 3, nome: 'Stage_1', descricao: 'Descrição Stage_1' },
                { id: 4, nome: 'Dataset', descricao: 'Descrição Dataset' },
                { id: 5, nome: 'MDM', descricao: 'Descrição MDM' },
            ],
            selectedFreqOpt: null,
            selectFreqOpt: [
                { value: null, text: 'Selecione a frequência' },
                { value: 'imediatamente', text: 'Imediatamente após a etapa anterior' },
                { value: 'uma-vez', text: 'Uma vez' },
                { value: 'diariamente', text: 'Diariamente' },
                { value: 'semanalmente', text: 'Semanalmente' },
                { value: 'mensalmente', text: 'Mensalmente' },
            ],
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            },
            columns: [
                'id',
                'identificador',
                'prox_exec',
                'ultima_exec',
                'status_ultima',
                'criado_em',
                'habilitado',
                'acoes',
            ],
            data: getData(),
            options: {
                skin: 'table-sm table table-hover',
                dateColumns: ['prox_exec', 'ultima_exec', 'criado_em'],
                columnsClasses: {
                    id: 'text-start',
                    identificador: 'text-start',
                    prox_exec: 'text-left',
                    ultima_exec: 'text-left',
                    status_ultima: 'text-left',
                    habilitado: 'text-center',
                    acoes: 'text-center',
                },
                headings: {
                    id: 'ID',
                    identificador: 'Identificador',
                    prox_exec: 'Próxima execução',
                    ultima_exec: 'Última execução',
                    status_ultima: 'Status da última execução',
                    criado_em: 'Criado em',
                    habilitado: 'Habilitado',
                    acoes: 'Ações',
                },
                sortable: ['id','identificador','prox_exec','ultima_exec','criado_em'],
                filterable: ['id','identificador','prox_exec','ultima_exec','criado_em'],
                sortIcon: {
                    base: 'fa fas',
                    is: 'fa-sort ml-10',
                    up: 'fa-sort-amount-up',
                    down: 'fa-sort-amount-down'
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
        abrirAddModal() {
            this.wizardStep = 1;
            this.$refs.addModal.show();
        },
        closeAddModal() {
            this.$refs.addModal.hide();
            this.$router.push({ name: 'lemon-edit', params: {id: 103, identificador: 'Consumidor Gov', prox_exec: '08/10/2010 00:00', ultima_exec: '30/12/2023', status_ultima: 'sucesso', criado_em: '24/08/2023', habilitado: 'Sim'}});
            this.selectedTemplate = null;
            this.wizardStep = 0;
        },
        abrirDeleteModal() {
            this.$refs.deleteModal.show();
        },
        abrirLogModal() {
            this.$refs.logModal.show();
        },
        openDisablePipelineModal() {
            this.$refs.disableModal.show();
        },
        openAddStepModal() {
            this.$refs.addStepModal.show();
        },
    }
};

function getData() {
    return [
        { 
            id: 100, 
            identificador: "Anac",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 18:30', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 101, 
            identificador: "Licitações",
            descricao: "Descrição da pipeline.", 
            prox_exec: '05/10/2021 09:15', 
            ultima_exec: '---', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 102, 
            identificador: "Copasa",
            descricao: "Descrição da pipeline.", 
            prox_exec: '13/05/2022 10:00', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Não', 
            acoes: "" 
        },
        { 
            id: 103, 
            identificador: "Consumidor Gov", 
            descricao: "Descrição da pipeline.",
            prox_exec: '08/10/2010 00:00', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 104, 
            identificador: "Endereço",
            descricao: "Descrição da pipeline.", 
            prox_exec: '07/05/2021 22:20', 
            ultima_exec: '---', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Não', 
            acoes: "" 
        },
        { 
            id: 105, 
            identificador: "Fakenews",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 08:30', 
            ultima_exec: '---',
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 106, 
            identificador: "Ibge",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 11:50', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Pendente', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 107, 
            identificador: "Anac",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 17:10', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 108, 
            identificador: "Inss",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 14:30', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            habilitado: 'Não', 
            acoes: "" 
        },
        { 
            id: 100, 
            identificador: "Anac",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 18:30', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 101, 
            identificador: "Licitações",
            descricao: "Descrição da pipeline.", 
            prox_exec: '05/10/2021 09:15', 
            ultima_exec: '---', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 102, 
            identificador: "Copasa",
            descricao: "Descrição da pipeline.", 
            prox_exec: '13/05/2022 10:00', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Não', 
            acoes: "" 
        },
        { 
            id: 103, 
            identificador: "Consumidor Gov", 
            descricao: "Descrição da pipeline.",
            prox_exec: '08/10/2010 00:00', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 104, 
            identificador: "Endereço",
            descricao: "Descrição da pipeline.", 
            prox_exec: '07/05/2021 22:20', 
            ultima_exec: '---', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Não', 
            acoes: "" 
        },
        { 
            id: 105, 
            identificador: "Fakenews",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 08:30', 
            ultima_exec: '---',
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 106, 
            identificador: "Ibge",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 11:50', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Pendente', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 107, 
            identificador: "Anac",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 17:10', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 108, 
            identificador: "Inss",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 14:30', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            habilitado: 'Não', 
            acoes: "" 
        },
        { 
            id: 100, 
            identificador: "Anac",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 18:30', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 101, 
            identificador: "Licitações",
            descricao: "Descrição da pipeline.", 
            prox_exec: '05/10/2021 09:15', 
            ultima_exec: '---', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 102, 
            identificador: "Copasa",
            descricao: "Descrição da pipeline.", 
            prox_exec: '13/05/2022 10:00', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Não', 
            acoes: "" 
        },
        { 
            id: 103, 
            identificador: "Consumidor Gov",
            descricao: "Descrição da pipeline.", 
            prox_exec: '08/10/2010 00:00', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 104, 
            identificador: "Endereço",
            descricao: "Descrição da pipeline.", 
            prox_exec: '07/05/2021 22:20', 
            ultima_exec: '---', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Não', 
            acoes: "" 
        },
        { 
            id: 105, 
            identificador: "Fakenews",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 08:30', 
            ultima_exec: '---', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 106, 
            identificador: "Ibge",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 11:50', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Pendente', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 107, 
            identificador: "Anac",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 17:10', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Sucesso', 
            criado_em: '24/08/2023', 
            habilitado: 'Sim', 
            acoes: "" 
        },
        { 
            id: 108, 
            identificador: "Inss",
            descricao: "Descrição da pipeline.", 
            prox_exec: '24/08/2023 14:30', 
            ultima_exec: '30/12/2023', 
            status_ultima: 'Erro', 
            criado_em: '24/08/2023', 
            habilitado: 'Não', 
            acoes: "" 
        },
    ];
}
</script>

<style lang="scss">

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

.lemonPage-label {
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 500;
}

.lemonPage-input {
    width: 100%;
    height: fit-content;
    padding: 12px 20px;
    margin-bottom: 25px;
    border-radius: 2px;
    border: none;
    background-color: #eff0f6;
}

.lemonPage-textarea {
    width: 100%;
    height: 100px;
    max-height: 150px;
    padding: 12px 20px;
    border-radius: 2px;
    border: none;
    background-color: #eff0f6;
}

.lemonPage-tab-button {
    background-color: #FFF;
    border: 0px;
    color: black;
    position: absolute;
}

.lemonPage-etapas-table {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.lemonPage-etapas-header {
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: -2px;
    border: 2px solid #dfdfdf;
    padding: 3px 0px;
    font-weight: 700;
    background-color: #FFF;
    text-align: center;
    width: 50%;
    margin: 0 auto -2px auto;
    width: 90%;
}

.lemonPage-etapas-header-column {
    display: flex;
    width: 50%;
    justify-content: center;
}

.lemonPage-dragDiv {
    width: 90%;
    display: flex;
    position: relative;
    justify-content: space-between;
    border: 2px solid #dfdfdf;
    padding: 15px 0px;
    background-color: #FFF;
    margin-bottom: -2px;
    font-weight: 400;
    border-radius: 4px;
    margin: 0 auto -2px auto;
    gap: 10px;
}

.lemonPage-drag-column {
    display: flex;
    width: 50%;
    justify-content: center;
    align-items: center;

    &.ident {
        justify-content: start;
        /* padding-left: 17%; */
    }
}

.lemonPage-stepButton {
    background-color: transparent;
    border: 0px;
    color: #007bff;
    font-weight: 700;

    &:hover {
        color: #0056b3;
    }
}

.lemonPage-dragIcon {
    position: absolute;
    left: 8px;
    top: 22px;
    color: #212529;
    width: 12px;
}

.lemonPage-logCard {
    background-color: #f6f6f6;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: #767676;
    text-align: justify;
}

.lemonPage-infos {
    display: flex;
    flex-direction: row;
    border: 0px solid #dfdfdf;
    background-color: #f8f9f9;
    border-radius: 3px;
    max-height: 300px;
    overflow-y: auto;
}

.lemonPage-infos-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 14px;
    padding-bottom: 16px;
}

.lemonPage-infos-body-column {
    display: flex;

    span.left {
        color: black;
        font-family: sans-serif;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.6px;
        margin-bottom: 0;
        padding: 0px 4px;
        text-transform: uppercase;
        margin-right: 10px;
        width: 19%;
    }

    span.right {
        margin-left: 10px;
        font-size: 14px;
    }

    span.right-description {
        margin-left: 10px;
        /* max-width: 200px; */
        font-size: 14px;
    }
}

</style>