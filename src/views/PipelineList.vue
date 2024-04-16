<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom">
            <h1 class="pipelineList-title">
                Pipelines
            </h1>
            <div>
                <router-link :to="{name: 'pipelineRunsList'}" class="btn btn-outline-secondary float-left ml-2">
                    <font-awesome-icon icon="fa fa-history" /> Execuções
                </router-link>
                <button class="btn btn-primary btn-lemonade-primary float-left ml-2" @click="openAddModal">
                    <font-awesome-icon icon="fa fa-plus" /> Adicionar
                </button>
            </div>
        </div> 

        <ModalCreatePipeline ref="addModal" :pipeline-templates="pipelineTemplates" :template-options="templateOptions" />

        <div class="pipelineList-body">
            <div class="pipelineList-container">
                <v-server-table ref="pipelineList" :columns="columns" :options="options" name="pipelineList">
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
                    <template #version="props">
                        {{props.row.version}}
                    </template>
                    <template #actions="props">
                        <div>
                            <button class="btn btn-sm btn-danger" title="Excluir pipeline" @click="deletePipeline(props.row.id, props.row.name)">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </div>
                    </template>
                </v-server-table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';
import ModalCreatePipeline from './modal/ModalCreatePipeline.vue';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    components: {
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
                'version',
                'actions',
            ],
            options: {
                skin: 'table-sm table table-hover',
                dateColumns: ['created', 'updated'],
                columnsClasses: {
                    id: 'text-start',
                    name: 'text-start',
                    created: 'text-start',
                    updated: 'text-start',
                    version: 'text-start',
                    user_name: 'text-start',
                    actions: 'text-center',
                },
                headings: {
                    id: 'ID',
                    name: 'Nome',
                    created: 'Criado em',
                    updated: 'Atualizado em',
                    version: 'Versão',
                    user_name: 'Nome do usuário',
                    actions: 'Ações',
                },
                sortable: ['id','name','created','updated'],
                filterable: ['name'],
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

<style lang="scss" scoped>

.pipelineList-title {
    color: #333;
    margin: 10px 0px;
}

.pipelineList-body {
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
}

.pipelineList-container {
    border: 1px solid #dee2e6;
    padding: 16px;
    border-radius: 3px;
}

</style>