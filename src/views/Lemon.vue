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
                <button class="btn btn-primary btn-lemonade-primary float-left ml-2" @click="abrirAddModal">
                    <font-awesome-icon icon="fa fa-plus" /> Adicionar
                </button>
            </div>
        </div> 

        <b-modal ref="addModal" title="Criação de pipeline" size="lg" hide-footer
                 scrollable @hidden="closeAddModal">
            <div class="lemonPage-wizard">
                <div v-if="wizardStep === 1" class="lemonPage-wizard-stepBox">
                    <div class="lemonPage-wizard-header">
                        <div class="lemonPage-wizard-title">
                            <font-awesome-icon class="mr-1" icon="fa fa-file" />
                            Informações gerais
                        </div>
                        <div>
                            Etapa 1 de 2
                        </div>
                    </div>
                    <div class="position-relative">
                        <label class="lemonPage-label" for="identificador">Nome</label>
                        <input id="identificador" 
                               v-model="pipelineName" 
                               class="lemonPage-input"
                               type="text"
                               maxlength="100" 
                               placeholder="Nome da pipeline" 
                               @input="handleInput">
                        <div v-if="invalidInputLength" class="lemonPage-invalid-length">
                            - Nome da pipeline deve ter pelo menos 3 caracteres.
                        </div>
                    </div>

                    <label class="lemonPage-label" for="descricao">Descrição</label>
                    <textarea id="descricao" 
                              v-model="pipelineDescription"
                              class="lemonPage-textarea" 
                              type="text"
                              maxlength="200" 
                              placeholder="Descrição da pipeline" />

                    <div class="lemonPage-wizard-stepBox-buttons" :class="first">
                        <b-button size="sm" variant="secondary" @click="firstWizardStep">
                            Avançar
                        </b-button>
                    </div>
                </div>
                <div v-if="wizardStep === 2" class="lemonPage-wizard-stepBox">
                    <div class="lemonPage-wizard-header">
                        <div class="lemonPage-wizard-title">
                            <font-awesome-icon class="mr-1" icon="fa fa-folder" />
                            Template
                        </div>
                        <div>
                            Etapa 2 de 2
                        </div>
                    </div>
                    
                    Deseja utilizar algum template de pipeline?
                    <b-form-select v-model="selectedTemplate" :options="templateOptions" class="mt-1 mb-1" />

                    <div v-if="selectedTemplate !== null">
                        <b-card class="lemonPage-infos">
                            <div class="lemonPage-infos-body">
                                <div class="lemonPage-infos-body-column">
                                    <span class="left">Identificador:</span><span class="right">{{findTemplate().name}}</span>
                                </div>
                                <div class="lemonPage-infos-body-column">
                                    <span class="left">Descrição:</span><span class="right-description">{{findTemplate().description}}</span>
                                </div>
                                <div class="lemonPage-infos-body-column">
                                    <span class="left">Etapas:</span> 
                                    <b-container class="lemonPage-etapas-table">
                                        <b-row class="lemonPage-etapas-header">
                                            <b-col>
                                                Ordem da Etapa
                                            </b-col>
                                            <b-col>
                                                Identificador
                                            </b-col>
                                            <b-col>
                                                Descrição
                                            </b-col>
                                        </b-row>
                                        <b-row v-for="(etapa, index) in findTemplate().steps" :key="etapa.id" class="lemonPage-dragDiv">
                                            <b-col>
                                                # {{index + 1}}
                                            </b-col>
                                            <b-col>
                                                {{etapa.name}}
                                            </b-col>
                                            <b-col>
                                                {{etapa.description}}
                                            </b-col>
                                        </b-row>
                                    </b-container>
                                </div>
                            </div>
                        </b-card>
                    </div>
    
                    <div class="lemonPage-wizard-stepBox-buttons">
                        <b-button size="sm" variant="secondary" @click="wizardStep = 1">
                            Voltar
                        </b-button>
                        <b-button size="sm" variant="secondary" @click="secondWizardStep">
                            Finalizar
                        </b-button>
                    </div>
                </div>
                <div v-if="wizardStep === 3" class="lemonPage-wizard-stepBox">
                    <div class="lemonPage-wizard-header">
                        <div class="lemonPage-wizard-title">
                            <font-awesome-icon class="mr-1" icon="fa fa-square-check" />
                            Processo de criação da pipeline finalizada.
                        </div>
                    </div>
    
                    <div>
                        Ao fechar este modal, você será redirecionado para a página da pipeline criada.
                    </div>
    
                    <div class="lemonPage-wizard-stepBox-buttons">
                        <b-button size="sm" variant="primary" @click="closeAddModal">
                            Fechar
                        </b-button>
                    </div>
                </div>
            </div>
        </b-modal>

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
import axios from 'axios';
import { BModal } from 'bootstrap-vue';
import Notifier from '../mixins/Notifier.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        BModal
    },
    mixins: [Notifier],
    data() {
        return {
            wizardStep: 1,
            first: 'first',
            pipelineName: '',
            pipelineDescription: '',
            pipelineTemplates: [],
            selectedTemplate: null,
            createdPipelineId: null,
            invalidInputLength: true,
            pipelineData: {
                name: '',
                description: '',
                enabled: true,
                steps: [],
            },
            templateOptions: [
                { value: null, text: 'Não utilizar template' },
            ],
            selectedStep: null,
            selectedFreqOpt: null,
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
            this.loadTemplates();
            this.$refs.addModal.show();
        },
        closeAddModal() {
            if (this.wizardStep === 3) this.$router.push({ name: 'lemon-edit', params: {id: this.createdPipelineId}});
            this.$refs.addModal.hide();
            this.pipelineName = '';
            this.pipelineDescription = '';
            this.invalidInputLength = true;
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
        findTemplate() {
            const selectedTemplate = this.pipelineTemplates.find(template => template.id == this.selectedTemplate);
            return selectedTemplate ? { ...selectedTemplate } : null;
        },
        loadTemplates() {
            if (this.templateOptions.length >= 2) return;
            axios
                .get(`${tahitiUrl}/pipeline-templates`)
                .then((resp) => {
                    this.pipelineTemplates.push(...resp.data.data);
                    this.pipelineTemplates.map(template => {
                        let aux = { value: template.id, text: template.name };
                        this.templateOptions.push(aux);
                    });
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );
        },
        firstWizardStep() {
            if (this.invalidInputLength) return;
            else this.wizardStep = 2;
        },
        secondWizardStep() {
            this.wizardStep = 3;
            this.pipelineData.name = this.pipelineName;
            this.pipelineData.description = this.pipelineDescription;
            if (this.selectedTemplate !== null) this.pipelineData.steps = JSON.parse(JSON.stringify(this.findTemplate().steps, (key, value) => (key === 'id' ? undefined : value)));
            this.createPipeline();
        },
        handleInput() {
            this.invalidInputLength = this.pipelineName.length < 3;
        },
        createPipeline() {
            axios
                .post(`${tahitiUrl}/pipelines`, this.pipelineData)
                .then((resp) => {
                    this.createdPipelineId = resp.data.id;
                    this.success('Pipeline criada com sucesso');})
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );
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
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
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

.lemonPage-wizard {
    min-height: 500px;
    position: relative;
}

.lemonPage-wizard-header {
    padding: 5px 10px;
    background-color: #6c757d;
    border-radius: 0.25rem;
    font-weight: 700;
    font-size: 15px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 10px 10px;
}

.lemonPage-wizard-title {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: #fff;
    text-align: justify;
}

.lemonPage-wizard-stepBox {
    display: flex;
    flex-direction: column;
}

.lemonPage-wizard-stepBox-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    position: absolute;
    width: 100%;
    bottom: 0px;

    &.first {
        justify-content: end;
    }
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
    margin-left: 40px;
}

.lemonPage-etapas-header {
    margin-bottom: -2px;
    border: 2px solid #dfdfdf;
    padding: 3px 0px;
    font-weight: 700;
    background-color: #FFF;
    text-align: center;
}

.lemonPage-dragDiv {
    justify-content: space-between;
    border: 2px solid #dfdfdf;
    padding: 10px 0px;
    background-color: #FFF;
    margin-bottom: -2px;
    text-align: center;
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
        font-size: 14px;
    }
}

.lemonPage-invalid-length {
    color: red;
    font-size: 12px;
    position: absolute;
    top: 4px;
    display: flex;
    justify-content: end;
    width: 100%;
}

</style>