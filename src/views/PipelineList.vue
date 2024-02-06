<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom">
            <h1 class="lemonPage-title">
                Pipelines
            </h1>
            <div>
                <!-- <router-link :to="{name: 'pipelinesHistory'}" class="btn btn-outline-secondary float-left ml-2">
                    <font-awesome-icon icon="fa fa-history" /> Histórico
                </router-link> -->
                <button class="btn btn-primary btn-lemonade-primary float-left ml-2" @click="openAddModal">
                    <font-awesome-icon icon="fa fa-plus" /> Adicionar
                </button>
            </div>
        </div> 

        <ModalCreatePipeline ref="addModal" :pipeline-templates="pipelineTemplates" :template-options="templateOptions" />

        <div class="lemonPage-body">
            <div class="lemonPage-container">
                <v-server-table ref="pipelineList" :data="tableData" class="lemonPage-table" :columns="columns" 
                                :options="options" name="pipelineList">
                    <template #id="props">
                        <router-link :to="{name: 'pipelineEdit', params: {id: props.row.id}}">
                            {{props.row.id}}
                        </router-link>
                    </template>
                    <template #name="props">
                        <router-link :to="{name: 'pipelineEdit', params: {id: props.row.id}}">
                            {{props.row.name}}
                        </router-link>
                    </template>
                    <template #created="props">
                        {{props.row.created | formatJsonDate}}
                    </template>
                    <template #updated="props">
                        {{props.row.updated | formatJsonDate}}
                    </template>
                    <!-- <template #enabled="props">
                        <div class="lemonPage-enabled" :class="toString(props.row.enabled)" />
                        {{$tc(props.row.enabled ? 'common.yes': 'common.no')}}
                    </template> -->
                    <template #version="props">
                        {{props.row.version}}
                    </template>
                    <template #acoes="props">
                        <div>
                            <button class="btn btn-spinner btn-primary btn-sm" title="Exibir log" @click="openLogModal">
                                <font-awesome-icon icon="fa-eye" />
                            </button>
                            <!-- <button class="ml-2 btn btn-spinner btn-secondary btn-sm" title="Desabilitar pipeline" @click="disablePipeline(props.row.id, props.row.name)">
                                <font-awesome-icon icon="fa-ban" />
                            </button> -->
                            <button class="ml-2 btn btn-sm btn-danger" title="Excluir pipeline" @click="deletePipeline(props.row.id, props.row.name)">
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
                    </template>
                </v-server-table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { BModal } from 'bootstrap-vue';
import Notifier from '../mixins/Notifier.js';
import ModalCreatePipeline from './modal/ModalCreatePipeline.vue';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
        BModal,
        ModalCreatePipeline
    },
    mixins: [Notifier],
    data() {
        return {
            first: 'first',
            pipelineTemplates: [],
            templateOptions: [
                { value: null, text: 'Não utilizar template' },
            ],
            columns: [
                'id',
                'name',
                'created',
                'updated',
                'user_name',
                // 'enabled',
                'version',
                'acoes',
            ],
            tableData: [],
            options: {
                skin: 'table-sm table table-hover',
                dateColumns: ['prox_exec', 'ultima_exec', 'criado_em'],
                columnsClasses: {
                    id: 'text-start',
                    name: 'text-start',
                    created: 'text-start',
                    updated: 'text-start',
                    // enabled: 'text-center',
                    version: 'text-start',
                    user_name: 'text-start',
                    acoes: 'text-center',
                },
                headings: {
                    id: 'ID',
                    name: 'Nome',
                    created: 'Criado em',
                    updated: 'Atualizado em',
                    // enabled: 'Habilitado',
                    version: 'Versão',
                    user_name: 'Nome do usuário',
                    acoes: 'Ações',
                },
                sortable: ['id','name','created','updated'],
                filterable: ['id','name','created','updated'],
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
                },
                requestFunction: this.load
            }
        };
    },
    methods: {
        load(data) {
            data.sort = data.orderBy;
            data.asc = data.ascending === 1 ? 'true' : 'false';
            data.size = data.limit;
            data.name = data.query;
            data.fields = 'id,name,version,created,updated,user_name';
            data.disabled = 1;

            this.$Progress.start();
            return axios
                .get(`${tahitiUrl}/pipelines`, {
                    params: data
                })
                .then(resp => {
                    this.$Progress.finish();
                    return { data: resp.data.data, count: resp.data.pagination.total };
                })
                .catch(
                    function (e) {
                        this.$Progress.finish();
                        this.error(e);
                    }.bind(this)
                );
        },
        openAddModal() {
            this.loadTemplates();
            this.$refs.addModal.show();
        },
        openLogModal() {
            this.$refs.logModal.show();
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
        // disablePipeline(pipelineId, pipelineName) {
        //     this.confirm(
        //         `Desabilitar '${pipelineName}'`,
        //         'Tem certeza que deseja desabilitar esta pipeline?',
        //         () => {
        //             axios
        //                 .patch(`${tahitiUrl}/pipelines/${pipelineId}`, { enabled: false })
        //                 .then(() => {
        //                     this.success('Pipeline desabilitada com sucesso');
        //                     this.$refs.pipelineList.refresh();
        //                 })
        //                 .catch(
        //                     function (e) {
        //                         this.error(e);
        //                     }.bind(this)
        //                 );
        //         }
        //     );
        // },
        deletePipeline(pipelineId, pipelineName) {
            this.confirm(
                this.$t('actions.delete') + " '" + pipelineName + "'",
                this.$t('messages.doYouWantToDelete'),
                () => {
                    axios
                        .delete(`${tahitiUrl}/pipelines/${pipelineId}`, {})
                        .then(() => {
                            this.success(
                                this.$t('messages.successDeletion', {
                                    what: 'Pipeline'
                                })
                            );
                            this.$refs.pipelineList.refresh();
                        })
                        .catch(
                            function (e) {
                                this.error(e);
                            }.bind(this)
                        );
                }
            );
        }
    }
};

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