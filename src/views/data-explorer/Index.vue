<template>
    <main role="main">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h1>
                    <font-awesome-icon icon="fa fa-vial" /> {{$tc('dataExplorer.tagline', 1)}}
                </h1>
            </div>
            <hr>
            <div class="card-deck ">
                <b-card class="clickable m-1" role="button">
                    <div class="row">
                        <div class="rounded-option bg-primary">
                            <font-awesome-icon icon="fa fa-table" size="3x" inverse />
                        </div>
                        <div class="col mt-2" @click="navigate('data-explorer')">
                            <h5>Analisar, tratar e transformar dados</h5>
                            <small>
                                Utilize uma interface amigável e responsiva para tratar os dados. Você poderá
                                experimentar
                                como transformar os dados, obtendo um retorno imediato (usa amostra dos dados).
                            </small>
                        </div>
                    </div>
                </b-card>
                <b-card class="clickable m-1" role="button" @click="navigate('choose-task')">
                    <div class="row">
                        <div class="rounded-option bg-success">
                            <font-awesome-icon icon="fa fa-robot" size="3x" inverse />
                        </div>
                        <div class="col">
                            <h5>Criar modelo de aprendizado de máquina</h5>
                            <small>
                                Crie modelos de aprendizado de máquina, definindo qual tarefa e algoritmos aplicar,
                                quais <em>features</em> usar e quais métricas lhe
                                darão o melhor modelo.
                            </small>
                        </div>
                    </div>
                </b-card>
                <b-card class="clickable m-1" role="button" @click="navigate('new-visualization')">
                    <div class="row">
                        <div class="rounded-option bg-danger">
                            <font-awesome-icon icon="fa fa-chart-bar" size="3x" inverse />
                        </div>
                        <div class="col mt-2">
                            <h5>Criar visualizações de dados</h5>
                            <small>
                                Monte gráficos, tabelas e outras visualizações de dados.
                                Associe-os a <em>dashboards</em> e compartilhe-os com outros usuários.
                            </small>
                        </div>
                    </div>
                </b-card>
                <!--
                <b-card class="clickable m-1">
                    <div class="row">
                        <div class="col-md-4 col-sm-12 col-lg-3">
                            <span class="fa-stack fa-2x">
                                <font-awesome-icon icon="fa fa-circle text-warning fa-stack-2x" />
                                <font-awesome-icon icon="fa fa-trophy fa-stack-1x fa-inverse" />
                            </span>
                        </div>
                        <div class="col-md-9 mt-2">
                            <h5>Aplicar ou avaliar um modelo usando um conjunto novo de dados</h5>
                            <small>
                                Utilize uma interface bla bla bla para tratar os dados. Você poderá experimentar
                                como
                                transformar bla bla
                            </small>
                        </div>
                    </div>
                </b-card>
                -->
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-12 custom-table">
                <b-card>
                    <h5>Ou você quer editar algo existente?</h5>

                    <form class="form-inline">
                        <label class="sr-only" for="type">{{$tc('common.type')}}</label>
                        <select v-model="typeFilter" class="form-control w-25 pt-0">
                            <option selected disabled>
                                {{$tc('actions.choose')}}...
                            </option>
                            <option value="DATA_EXPLORER">
                                {{$t('dataExplorer.experiments.DATA_EXPLORER')}}
                            </option>
                            <option value="MODEL_BUILDER">
                                {{$t('dataExplorer.experiments.MODEL_BUILDER')}}
                            </option>
                            <option value="VIS_BUILDER">
                                {{$t('dataExplorer.experiments.VIS_BUILDER')}}
                            </option>
                        </select>
                        <label class="sr-only" for="search">{{$tc('common.name')}}</label>
                        <input v-model="searchFilter" type="text" class="form-control m-2 w-25"
                               :placeholder="$tc('common.name')">
                        <button ref="searchBtn" class="btn btn-secondary btn-sm mb-2 btn-spinner"
                                @click.prevent="search">
                            <font-awesome-icon icon="fa fa-search default-icon" /> {{$t('actions.search')}}
                            <font-awesome-icon icon="spinner" pulse class="icon" />
                        </button>
                    </form>


                    <v-server-table v-show="totalRecords > 0" ref="workflowList" :columns="columns" :options="options"
                                    name="workflowListDataExperiments">
                        <template #id="props">
                            <router-link v-if="props.row.type === 'DATA_EXPLORER' "
                                         :to="{name: 'data-explorer-panel', params: {id: props.row.id, platform: props.row.platform.id}}">
                                {{props.row.id}}
                            </router-link>
                            <router-link v-if="props.row.type === 'MODEL_BUILDER' "
                                         :to="{name: 'model-design', params: {id: props.row.id, platform: props.row.platform.id}}">
                                {{props.row.id}}
                            </router-link>
                            <router-link v-if="props.row.type === 'VIS_BUILDER' "
                                         :to="{name: 'visualization-design', params: {id: props.row.id, platform: props.row.platform.id}}">
                                {{props.row.id}}
                            </router-link>
                        </template>
                        <template #type="props">
                            <font-awesome-icon :icon="getIcon(props.row)" />
                            {{$t(`dataExplorer.experiments.${props.row.type}`)}}
                        </template>
                        <template #user="props">
                            {{props.row.user.name}}
                        </template>
                        <template #name="props">
                            <router-link v-if="props.row.type === 'DATA_EXPLORER' "
                                         :to="{name: 'data-explorer-panel', params: {id: props.row.id, platform: props.row.platform.id}}">
                                {{props.row.name}}
                            </router-link>
                            <router-link v-if="props.row.type === 'MODEL_BUILDER' "
                                         :to="{name: 'model-design', params: {id: props.row.id, platform: props.row.platform.id}}">
                                {{props.row.name}}
                            </router-link>
                            <router-link v-if="props.row.type === 'VIS_BUILDER' "
                                         :to="{name: 'visualization-design', params: {id: props.row.id, platform: props.row.platform.id}}">
                                {{props.row.name}}
                            </router-link>
                        </template>
                        <template #updated="props">
                            {{$filters.formatJsonDate(props.row.updated)}}
                        </template>
                    </v-server-table>
                    <div v-show="totalRecords === 0">
                        {{$t('common.noData')}}
                    </div>
                </b-card>
            </div>
        </div>
    </main>
</template>
<script>
import axios from 'axios';
import Notifier from '../../mixins/Notifier.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const META_PLATFORM_SLUG = 'meta';
export default {
    name: 'IndexComponent',
    mixins: [Notifier],
    data() {
        const self = this;
        return {
            totalRecords: 0,
            searchFilter: null,
            typeFilter: null,
            columns: [
                'id',
                'name',
                'user',
                'type',
                'updated',
                'version',
            ],
            options: {
                hidePerPageSelect: true,
                perPage: 5,
                perPageValues: [],
                debounce: 800,
                skin: 'table-sm table table-hover',

                dateColumns: ['updated'],
                headings: {
                    id: 'ID',
                    name: this.$tc('common.name'),
                    user: this.$tc('common.user.name'),
                    type: this.$tc('common.type'),
                    updated: this.$tc('common.updated'),
                    version: this.$tc('common.version'),
                },
                sortable: ['name', 'id', 'updated'],
                //filterable: ['name', 'id'],
                filterable: false,
                sortIcon: {
                    base: 'fa fas',
                    is: 'fa-sort ml-10',
                    up: 'fa-sort-amount-up',
                    down: 'fa-sort-amount-down'
                },
                preserveState: true,
                saveState: true,
                filterByColumn: false,

                requestFunction: function (data) {
                    self.$refs.searchBtn.classList.remove('btn-spinner');
                    data.sort = data.orderBy;
                    data.asc = data.ascending === 1 ? 'true' : 'false';
                    data.size = 10;
                    data.name = self.searchFilter; //data.query;
                    data.platform = META_PLATFORM_SLUG;
                    if (self.typeFilter) {
                        data.types = self.typeFilter;
                    } else {
                        data.types = 'experiment';
                    }

                    data.fields = 'id,name,platform,updated,user,version,description,type';
                    data.enabled = 1;

                    let url = `${tahitiUrl}/workflows`;
                    self.$Progress.start();
                    return axios
                        .get(url, {
                            params: data
                        })
                        .then(resp => {
                            self.$Progress.finish();
                            self.totalRecords = resp.data.pagination.total;
                            return {
                                data: resp.data.data,
                                count: resp.data.pagination.total
                            };
                        })
                        .catch(
                            function (e) {
                                self.$Progress.finish();
                                self.error(e);
                            }.bind(this)
                        ).finally(() => self.$refs.searchBtn.classList.add('btn-spinner'));
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
        search() {
            this.$refs.workflowList.refresh();
        },
        navigate(name) {
            this.$router.push({ name });
        },
        clearFilters() {
            this.$refs.workflowList.setFilter('');
            this.$refs.workflowList.customQueries = {};
        },
        getIcon(row) {
            return {
                'DATA_EXPLORER': 'fa-table',
                'MODEL_BUILDER': 'fa-robot',
                'VIS_BUILDER': 'fa-chart-bar',
            }[row.type];
        }
    },
};
</script>
<style scoped>
    .custom-table>>>.VueTables .row:first-child {
        margin: initial !important;
        background-color: white;
        padding-top: 0;
    }

    .rounded-option {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        width: 80px;
        height: 80px;
        border-radius: 40px;
    }
</style>