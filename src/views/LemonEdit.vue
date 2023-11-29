<template>
    <div class="editPage-page">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="mt-2">
                <h6 class="editPage-pretitle">
                    Pipeline #{{$route.params.id}}
                </h6>
                <h1 class="editPage-title">
                    <InputHeader v-model="$route.params.identificador" />
                </h1> 
            </div>
            <div>
                <button class="btn btn-primary btn-lemonade-primary ml-2" @click="salvar">
                    <font-awesome-icon icon="fa fa-check" /> Salvar
                </button>
                <b-modal ref="addStepModal" title="Adicionar etapa">
                    <div class="configPage-card-modal">
                        <div>
                            <label class="editPage-label" for="identificador">Identificador</label>
                            <input id="identificador" class="editPage-input" type="text"
                                   placeholder="Identificador da etapa">
                        </div>

                        <div>
                            <label class="editPage-label" for="descricao">Descrição</label>
                            <textarea id="descricao" class="editPage-textarea" type="text"
                                      placeholder="Descrição da etapa" />
                        </div>
                    </div>
                </b-modal>
            </div>
        </div>

        <div class="editPage-body">
            <div class="editPage-container">
                <div>
                    <div v-b-toggle.collapse-1 class="editPage-collapse-trigger">
                        Informações da Pipeline
                    </div>
                    <b-card class="editPage-infos">
                        <div class="editPage-infos-body">
                            <div class="editPage-infos-body-column">
                                <span class="left">ID</span> | <span class="right">{{$route.params.id}}</span>
                            </div>
                            <div class="editPage-infos-body-column">
                                <span class="left">Identificador</span> | <span class="right-identifier">{{$route.params.identificador}}</span>
                            </div>
                            <div class="editPage-infos-body-column">
                                <span class="left">Criado em</span> | <span class="right">{{$route.params.criado_em}}</span>
                            </div>
                            <div class="editPage-infos-body-column">
                                <span class="left">Próxima execução</span> | <span class="right">{{$route.params.prox_exec}}</span>
                            </div>
                            <div class="editPage-infos-body-column">
                                <span class="left">Última execução</span> | <span class="right">{{$route.params.ultima_exec}}</span>
                            </div>
                        </div>
                        <!-- <div class="editPage-infos-body-column" :class="radios">
                            <span class="left">Descrição</span> | <span class="right">{{$route.params.descricao}}</span>
                        </div> -->
                    </b-card>
                </div>
                <div>
                    <div aria-controls="collapse-2"
                         :class="collapseVisible2 ? null : 'collapsed'" 
                         :aria-expanded="collapseVisible2 ? 'true' : 'false'" 
                         class="editPage-collapse-trigger" 
                         @click="collapseVisible2 = !collapseVisible2">
                        Etapas da Pipeline
                        <font-awesome-icon v-if="collapseVisible2" icon="fa fa-chevron-up" />
                        <font-awesome-icon v-else icon="fa fa-chevron-down" />
                    </div>
                    <b-collapse id="collapse-2" v-model="collapseVisible2" visible>
                        <b-card class="editPage-stepsDiv">
                            <div class="editPage-collapse-div">
                                <div class="editPage-tabs">
                                    <div class="editPage-etapas-header">
                                        <button id="popover-trigger" class="editPage-tab-button">
                                            <font-awesome-icon icon="info-circle" />
                                        </button>
                                        <b-popover target="popover-trigger" triggers="hover">
                                            Segure e arraste as etapas abaixo para reordená-las.
                                        </b-popover>
                                        <div class="editPage-etapas-header-column">
                                            Ordem da Etapa
                                        </div>
                                        <div class="editPage-etapas-header-column">
                                            Identificador
                                        </div>
                                        <div class="editPage-etapas-header-column">
                                            Status
                                        </div>
                                        <div class="editPage-etapas-header-column" :class="acoesDrag">
                                            Ações
                                        </div>
                                    </div>
                                    <draggable v-model="etapasPipeline" :options="dragOptions">
                                        <div v-for="(etapa, index) in etapasPipeline" :key="etapa.id" class="editPage-dragDiv" :class="selectedStep == etapa.nome ? 'editPage-dragDiv-selected' : null">
                                            <font-awesome-icon class="editPage-dragIcon" icon="fa fa-grip-vertical" />
                                            <div class="editPage-drag-column" :class="ordem">
                                                # {{index + 1}}
                                            </div>
                                            <div class="editPage-drag-column" :class="ident">
                                                <router-link class="editPage-stepButton" :to="{name: 'editWorkflow', params: {id: etapa.id, platform: etapa.id}}">
                                                    {{etapa.nome}}
                                                </router-link>
                                            </div>
                                            <div class="editPage-drag-column">
                                                <font-awesome-icon v-if="etapa.status == 'concluido'" 
                                                                   icon="check-circle"
                                                                   class="text-success" 
                                                                   title="Concluído" 
                                                                   size="lg" />
                                                <font-awesome-icon v-if="etapa.status == 'erro'" 
                                                                   icon="xmark-circle" 
                                                                   class="text-danger" 
                                                                   title="Erro" 
                                                                   size="lg" />
                                                <font-awesome-icon v-if="etapa.status == 'executando'" 
                                                                   icon="spinner" 
                                                                   spin 
                                                                   class="text-secondary" 
                                                                   title="Executando" 
                                                                   size="lg" />
                                                <font-awesome-icon v-if="etapa.status == 'pendente'" 
                                                                   icon="exclamation-circle" 
                                                                   class="text-warning" 
                                                                   title="Pendente" 
                                                                   size="lg" />
                                            </div>
                                            <div class="editPage-drag-column" :class="acoes">
                                                <div>
                                                    <button class="btn btn-sm btn-primary" title="Executar etapa">
                                                        <font-awesome-icon icon="play" />
                                                    </button>
                                                    <button class="ml-2 btn btn-sm btn-info" title="Agendar execução" @click="setSelectedStep(etapa.nome, index)">
                                                        <font-awesome-icon icon="clock" />
                                                    </button>
                                                    <button class="ml-2 btn btn-sm btn-secondary" title="Editar etapa" @click="abrirEditModal">
                                                        <font-awesome-icon icon="pen" />
                                                    </button>
                                                    <button class="ml-2 btn btn-sm btn-danger" title="Excluir etapa" @click="abrirDeleteModal">
                                                        <font-awesome-icon icon="trash" />
                                                    </button>
                                                    <button class="ml-2 btn btn-sm btn-warning" title="Adicionar etapa" @click="abrirAddStepModal">
                                                        <font-awesome-icon icon="plus" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </draggable>
                                    <b-modal ref="modal" title="Título do Modal">
                                        <p>Conteúdo do Modal</p>
                                    </b-modal>
                                    <b-modal ref="editStepModal" title="Editar etapa">
                                        <div class="configPage-card-modal">
                                            <div>
                                                <label class="editPage-label" for="identificador">Identificador</label>
                                                <input id="identificador" class="editPage-input" type="text"
                                                       placeholder="Identificador da etapa">
                                            </div>

                                            <div>
                                                <label class="editPage-label" for="descricao">Descrição</label>
                                                <textarea id="descricao" class="editPage-textarea" type="text"
                                                          placeholder="Descrição da etapa" />
                                            </div>
                                        </div>
                                    </b-modal>
                                    <b-modal ref="deleteModal" title="Confirmar exclusão" @ok="respostaUsuario">
                                        <p>Deseja excluir esta etapa?</p>
                                    </b-modal>
                                </div>
                                <div class="editPage-agendador">
                                    <div class="editPage-agendador-title">
                                        <font-awesome-icon icon="fa fa-calendar-alt" />
                                        <span class="ml-2">Agendador de etapa</span>
                                    </div>
                                    <div v-if="selectedStep === ''" class="editPage-agendador-body">
                                        <p class="font-weight-bold">
                                            Clique no ícone do relógio <button class="btn btn-sm btn-info">
                                                <font-awesome-icon icon="clock" />
                                            </button> em uma das etapas para utilizar o agendador.
                                        </p>
                                    </div>
                                    <div v-else class="editPage-agendador-body">
                                        <div class="editPage-agendador-box">
                                            <div class="editPage-label">
                                                Etapa: <span class="editPage-label-badge">{{selectedStep}}</span>
                                            </div>
                                        </div>
                                        <div class="editPage-agendador-box">
                                            <p class="font-weight-bold">
                                                Quando deseja que sua etapa seja inicializada?
                                            </p>
                                            <b-form-select v-model="selectedFreqOpt"
                                                           class="mb-2" 
                                                           :options="selectedStepIndex === 0 ? 
                                                               filteredSelectFreqOpt.slice(0, 1).concat(filteredSelectFreqOpt.slice(2)) : 
                                                               filteredSelectFreqOpt" />
                                        </div>
                                        <div v-if="selectedFreqOpt === 'uma-vez'">
                                            <div class="editPage-agendador-box" :class="radios">
                                                <p class="font-weight-bold">
                                                    Iniciar:
                                                </p>
                                                <input id="iniciar-data" class="editPage-input" type="date">
                                                <input id="iniciar-hora" class="editPage-input" type="time">
                                            </div>
                                        </div>
                                        
                                        <div v-if="selectedFreqOpt === 'diariamente'">
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
            
                                        <div v-if="selectedFreqOpt === 'semanalmente'">
                                            <div class="editPage-agendador-box" :class="radios">
                                                <p class="font-weight-bold">
                                                    Iniciar:
                                                </p>
                                                <input id="iniciar-data" class="editPage-input" type="date">
                                                <input id="iniciar-hora" class="editPage-input" type="time">
                                            </div>
                                            <div class="editPage-agendador-box" :class="dias">
                                                <p class="font-weight-bold">
                                                    Intervalo de repetição (semanas):
                                                </p>
                                                <input id="repetir-semanas" class="editPage-input" :class="dias" type="number"
                                                       min="0">
                                            </div>
                                            <b-form-group>
                                                <div class="editPage-chackbox-div" :class="diasSemana">
                                                    <p class="font-weight-bold mb-2">
                                                        Selecione os dias da semana:
                                                    </p>
                                                    <b-form-checkbox v-for="day in weekDays" :key="day.value" v-model="selectedWeekDays" :value="day.value">
                                                        {{day.label}}
                                                    </b-form-checkbox>
                                                </div>
                                            </b-form-group>
                                        </div>
            
                                        <div v-if="selectedFreqOpt === 'mensalmente'">
                                            <div class="editPage-agendador-box" :class="radios">
                                                <p class="font-weight-bold">
                                                    Iniciar:
                                                </p>
                                                <input id="iniciar-data" class="editPage-input" type="date">
                                                <input id="iniciar-hora" class="editPage-input" type="time">
                                            </div>
                                            <b-form-group>
                                                <p class="font-weight-bold mb-2">
                                                    Selecione os meses:
                                                </p>
                                                <b-form-checkbox v-model="selectAllMonths" class="mb-2" @change="toggleAllMonths">
                                                    Selecionar todos
                                                </b-form-checkbox>
                                                <div class="editPage-chackbox-div" :class="meses">
                                                    <div>
                                                        <b-form-checkbox v-model="selectedMonths" value="janeiro">
                                                            Janeiro
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedMonths" value="fevereiro">
                                                            Fevereiro
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedMonths" value="marco">
                                                            Março
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedMonths" value="abril">
                                                            Abril
                                                        </b-form-checkbox>
                                                    </div>
                                                    <div>
                                                        <b-form-checkbox v-model="selectedMonths" value="maio">
                                                            Maio
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedMonths" value="junho">
                                                            Junho
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedMonths" value="julho">
                                                            Julho
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedMonths" value="agosto">
                                                            Agosto
                                                        </b-form-checkbox>
                                                    </div>
                                                    <div>
                                                        <b-form-checkbox v-model="selectedMonths" value="setembro">
                                                            Setembro
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedMonths" value="outubro">
                                                            Outubro
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedMonths" value="novembro">
                                                            Novembro
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedMonths" value="dezembro">
                                                            Dezembro
                                                        </b-form-checkbox>
                                                    </div>
                                                </div>
                                            </b-form-group>
                                            <b-form-group>
                                                <p class="font-weight-bold mb-2">
                                                    Selecione os dias:
                                                </p>
                                                <b-form-checkbox v-model="selectAllDays" class="mb-2" @change="toggleAllDays">
                                                    Selecionar todos
                                                </b-form-checkbox>
                                                <div class="editPage-chackbox-div" :class="meses">
                                                    <div>
                                                        <b-form-checkbox v-model="selectedDays" value="1">
                                                            1
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="2">
                                                            2
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="3">
                                                            3
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="4">
                                                            4
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="5">
                                                            5
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="6">
                                                            6
                                                        </b-form-checkbox>
                                                    </div>
                                                    <div>
                                                        <b-form-checkbox v-model="selectedDays" value="7">
                                                            7
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="8">
                                                            8
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="9">
                                                            9
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="10">
                                                            10
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="11">
                                                            11
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="12">
                                                            12
                                                        </b-form-checkbox>
                                                    </div>
                                                    <div>
                                                        <b-form-checkbox v-model="selectedDays" value="13">
                                                            13
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="14">
                                                            14
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="15">
                                                            15
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="16">
                                                            16
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="17">
                                                            17
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="18">
                                                            18
                                                        </b-form-checkbox>
                                                    </div>
                                                    <div>
                                                        <b-form-checkbox v-model="selectedDays" value="19">
                                                            19
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="20">
                                                            20
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="21">
                                                            21
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="22">
                                                            22
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="23">
                                                            23
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="24">
                                                            24
                                                        </b-form-checkbox>
                                                    </div>
                                                    <div>
                                                        <b-form-checkbox v-model="selectedDays" value="25">
                                                            25
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="26">
                                                            26
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="27">
                                                            27
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="28">
                                                            28
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="29">
                                                            29
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="30">
                                                            30
                                                        </b-form-checkbox>
                                                    </div>
                                                    <div>
                                                        <b-form-checkbox v-model="selectedDays" value="31">
                                                            31
                                                        </b-form-checkbox>
                                                        <b-form-checkbox v-model="selectedDays" value="ultimo">
                                                            Último
                                                        </b-form-checkbox>
                                                    </div>
                                                </div>
                                            </b-form-group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-card>
                    </b-collapse>
                </div>
                <div>
                    <div v-b-toggle.collapse-3 class="editPage-collapse-trigger" @click="collapseVisible3 = !collapseVisible3">
                        Histórico de Execuções
                        <font-awesome-icon v-if="collapseVisible3" icon="fa fa-chevron-up" />
                        <font-awesome-icon v-else icon="fa fa-chevron-down" />
                    </div>
                    <b-collapse id="collapse-3">
                        <b-card class="editPage-historico-body">
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
                                        <button class="btn btn-spinner btn-primary btn-sm" title="Exibir log" @click="abrirLogModal">
                                            <font-awesome-icon icon="fa-eye" />
                                        </button>
                                    </div>
                                    <b-modal ref="logModal" size="lg" title="Log de execução da etapa" hide-footer>
                                        <b-card class="editPage-logCard">
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
                        </b-card>
                    </b-collapse>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import { BModal } from 'bootstrap-vue';
import InputHeader from '../components/InputHeader.vue';

export default {
    components: {
        draggable,
        BModal,
        InputHeader
    },
    data() {
        return {
            deleteResponse: null,
            radios: 'radios',
            dias: 'dias',
            ordem: 'ordem',
            ident: 'ident',
            acoes: 'acoes',
            acoesDrag: 'acoesDrag',
            meses: 'meses',
            diasSemana: 'diasSemana',
            strong: 'strong',
            selectedStep: '',
            selectedStepIndex: '',
            collapseVisible2: true,
            collapseVisible3: false,
            etapasPipeline: [
                { id: 1, nome: 'Landing Zone', status: 'concluido' },
                { id: 2, nome: 'Raw', status: 'erro' },
                { id: 3, nome: 'Stage_1', status: 'executando' },
                { id: 4, nome: 'Dataset', status: 'pendente' },
                { id: 5, nome: 'MDM', status: 'pendente' },
            ],
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            },
            selectedWeekDays: [],
            selectedFreqOpt: null,
            selectFreqOpt: [
                { value: null, text: 'Selecione a frequência' },
                { value: 'imediatamente', text: 'Imediatamente após a etapa anterior' },
                { value: 'uma-vez', text: 'Uma vez' },
                { value: 'diariamente', text: 'Diariamente' },
                { value: 'semanalmente', text: 'Semanalmente' },
                { value: 'mensalmente', text: 'Mensalmente' },
            ],
            weekDays: [
                { value: 'domingo', label: 'Domingo' },
                { value: 'segunda', label: 'Segunda-feira' },
                { value: 'terca', label: 'Terça-feira' },
                { value: 'quarta', label: 'Quarta-feira' },
                { value: 'quinta', label: 'Quinta-feira' },
                { value: 'sexta', label: 'Sexta-feira' },
                { value: 'sabado', label: 'Sábado' }
            ],
            selectedMonths: [],
            selectAllMonths: false,
            selectedDays: [],
            selectAllDays: false,
            executeImmediately: false,
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
                columnsClasses: {
                    id: 'text-start',
                    etapa: '',
                    data_exec: 'text-start',
                    status: ' text-start',
                    log: 'text-start'
                },
                dateColumns: ['data_exec'],
                headings: {
                    id: 'ID',
                    etapa: 'Etapa',
                    data_exec: 'Data da execução',
                    status: 'Status',
                    log: 'Log de execução',
                },
                sortable: ['id','etapa','data_exec'],
                filterable: ['id','etapa','data_exec'],
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
    computed: {
        filteredSelectFreqOpt(index) {
            if (index === 0) {
                return this.selectFreqOpt.filter(option => option.value !== 'imediatamente');
            }
            return this.selectFreqOpt;
        }
    },
    methods: {
        salvar() {
            alert("Salvo.");
        },
        abrirAddStepModal() {
            this.collapseVisible2 = true;
            this.$refs.addStepModal.show();
        },
        abrirModal() {
            this.$refs.modal.show();
        },
        abrirEditModal() {
            this.$refs.editStepModal.show();
        },
        abrirDeleteModal() {
            this.$refs.deleteModal.show();
        },
        respostaUsuario() {
            // Lógica para capturar a resposta do usuário
            console.log('Resposta do usuário: ' + this.deleteResponse);
        },
        setSelectedStep(stepName, index) {
            this.selectedStep = stepName;
            this.selectedStepIndex = index;
            this.selectedFreqOpt = null;

            console.log(index);
        },
        abrirLogModal() {
            this.$refs.logModal.show();
        },
        toggleAllMonths() {
            if (this.selectAllMonths) {
                this.selectedMonths = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
            } else {
                this.selectedMonths = [];
            }
        },
        toggleAllDays() {
            if (this.selectAllDays) {
                this.selectedDays = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
            } else {
                this.selectedDays = [];
            }
        },
    },
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
            etapa: 'Raw', 
            data_exec: '07/05/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 3, 
            etapa: 'Raw', 
            data_exec: '15/10/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 4, 
            etapa: 'Landing', 
            data_exec: '24/10/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 5, 
            etapa: 'Stage_1', 
            data_exec: '10/08/2023',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 6, 
            etapa: 'MDM', 
            data_exec: '07/05/2023',   
            status: 'Erro',   
            log: "" 
        },
        { 
            id: 7, 
            etapa: 'MDM', 
            data_exec: '15/10/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 8, 
            etapa: 'Stage_1', 
            data_exec: '24/10/2023',   
            status: 'Erro',   
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
            etapa: 'Raw',  
            data_exec: '15/10/2022',   
            status: 'Sucesso',   
            log: "" 
        },
        { 
            id: 12,
            etapa: 'Raw',  
            data_exec: '24/10/2023',   
            status: 'Sucesso',   
            log: "" 
        },
    ];
}
</script>

<style lang="scss">

.editPage-pretitle {
    color: black;
    font-family: sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.6px;
    margin-bottom: 0;
    padding: 0px 4px;
    text-transform: uppercase;
}

.editPage-title {
    color: #333;
    margin: 0px 0px;
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

.editPage-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
}

.editPage-collapse-trigger {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    padding: 10px 5px;
    font-size: 24px;
    border-bottom: 1px solid #9c9c9c;

    &:hover {
        background-color: #f8f9f9;
        cursor: pointer;
    }
}

.editPage-collapse-div {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 40px;
    background-color: #f8f9f9;
}

.editPage-stepsDiv {
    border: 0px solid #dfdfdf;
    background-color: #f8f9f9;
    border-radius: 0px;
}

.editPage-infos {
    display: flex;
    width: 100%;
    border: 0px solid #dfdfdf;
    background-color: #f8f9f9;
    border-radius: 0px;
}

.editPage-infos-title {
    font-weight: 400;
    font-size: 24px;
    margin-bottom: 10px;
}

.editPage-infos-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    font-size: 18px;
}

.editPage-infos-body-column {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span.left {
        color: black;
        font-family: sans-serif;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.6px;
        margin-bottom: 0;
        padding: 0px 4px;
        text-transform: uppercase;
        margin-right: 15px;
    }

    span.right {
        margin-left: 15px;
    }

    span.right-identifier {
        margin-left: 15px;
        max-width: 250px;
    }

    &.radios {
        justify-content: start;
        margin-top: 10px;
        width: 450px;
        text-align: justify;
    }
}


.editPage-tabs {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.editPage-tab-button {
    background-color: #FFF;
    border: 0px;
    color: black;
    position: absolute;
}

.editPage-etapas-header {
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: -2px;
    border: 2px solid #dfdfdf;
    padding: 3px 0px;
    font-weight: 700;
    background-color: #FFF;
}

.editPage-etapas-header-column {
    display: flex;
    width: 25%;
    justify-content: center;
}

.editPage-dragDiv {
    display: flex;
    position: relative;
    justify-content: space-between;
    border: 2px solid #dfdfdf;
    padding: 15px 0px;
    background-color: #FFF;

    margin-bottom: -2px;
    font-weight: 700;
    border-radius: 4px;

    &:hover {
        cursor: grab;
    }
}

.editPage-dragDiv-selected {
    background-color: #eeeeee;
}

.editPage-drag-column {
    display: flex;
    width: 25%;
    justify-content: center;
    align-items: center;

    &.ident {
        justify-content: start;
        padding-left: 6.5%;
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
    left: 8px;
    top: 22px;
    color: #212529;
    width: 12px;
}

.editPage-agendador {
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 50%;
    margin-top: 0px;
}

.editPage-agendador-title {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: #86B94B;
    padding: 20px;
    font-weight: 700;
    font-size: 1rem;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.editPage-agendador-body {
    display: flex;
    flex-direction: column;
    padding: 20px;
    padding-bottom: 10px;
    align-items: start;
    gap: 10px;
    border: 1px solid #cccccc;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #FFF;
}

.editPage-agendador-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;

    &.radios {
        flex-direction: row;
        gap: 20px;
    }

    &.dias {
        flex-direction: row;
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
    border: 0px;
    background-color: #f8f9f9;
    border-radius: 0px;
}

.editPage-historico-table {
    width: 100%;
    background-color: #FFF;
}

.editPage-chackbox-div {
    display: flex;
    flex-direction: row;
    width: 100%;

    &.diasSemana {
        flex-direction: column;
    }

    &.meses {
        justify-content: space-between;
    }
}

.editPage-label {
    display: block;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
}

.editPage-label-badge {
    padding: 5px 10px;
    background-color: #17a2b8;
    border-radius: 0.25rem;
    font-weight: 700;
    font-size: 15px;
    color: white;
}

.editPage-input {
    width: 100%;
    height: fit-content;
    padding: 12px 10px;
    margin-bottom: 25px;
    border-radius: 4px;
    border: none;
    background-color: #eff0f6;

    &.dias {
        width: 5.625rem;
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

.editPage-inputHeader {
    input {
        font-size: 18px;    
    }
    display: flex;
    margin-bottom: 17px;
}

.editPage-logCard {
    background-color: #f6f6f6;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: #767676;
    text-align: justify;
}

</style>