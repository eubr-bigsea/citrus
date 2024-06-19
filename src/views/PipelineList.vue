<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom" data-test="header">
            <h1 class="pipelineList-title">
                Pipelines
            </h1>
            <div>
                <router-link :to="{name: 'pipelineRunsList'}" data-test="runsButton" class="btn btn-outline-secondary float-left ml-2">
                    <font-awesome-icon icon="fa fa-history" /> {{$t('titles.runs', 2)}}
                </router-link>
                <button class="btn btn-primary btn-lemonade-primary float-left ml-2" data-test="addButton" @click="openAddModal">
                    <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                </button>
            </div>
        </div> 

        <ModalCreatePipeline ref="addModal" data-test="addModal" :pipeline-templates="pipelineTemplates" :template-options="templateOptions" />

        <div class="pipelineList-body">
            <div class="pipelineList-container">
                <v-server-table ref="pipelineList" :columns="columns" :options="options" name="pipelineList"
                                data-test="pipelines-table">
                    <template #id="props">
                        <router-link :to="{name: 'pipelineEdit', params: {id: props.row.id}}" data-test="pipeline-id">
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
                            <button class="btn btn-sm btn-danger" 
                                    :title="$t('actions.delete') + ' Pipeline'"
                                    data-test="deleteButton" 
                                    @click="deletePipeline(props.row.id, props.row.name)">
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
                { value: null, text: this.$t('pipeline.list.doNotUseTemplate') },
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
                    name: this.$tc('common.name'),
                    created: this.$tc('common.created'),
                    updated: this.$tc('common.updated'),
                    version: this.$tc('common.version'),
                    user_name: this.$tc('common.user.name'),
                    actions: this.$tc('common.action', 2)
                },
                sortable: ['id','name','created','updated'],
                filterable: ['name'],
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ml-10',
                    up: 'sort-up',
                    down: 'sort-down'
                },
                preserveState: true,
                saveState: true,
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