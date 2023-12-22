<template>
    <main role="main">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h1>
                    <font-awesome-icon icon="fa fa-vial" /> {{ $tc('dataExplorer.tagline', 1) }}
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
                <b-card class="clickable m-1" role="button">
                    <div class="row">
                        <div class="rounded-option bg-warning">
                            <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" width="50px" height="50px"
                                viewBox="0 0 550.801 550.801" xml:space="preserve">
                                <g>
                                    <g>
                                        <path d="M277.425,402.116c-20.208,0-31.87,19.833-31.87,44.317c-0.2,24.88,11.853,43.934,31.681,43.934
			c20.018,0,31.683-18.858,31.683-44.508C308.918,421.949,297.644,402.116,277.425,402.116z" />
                                        <path d="M475.095,131.992c-0.032-2.526-0.833-5.021-2.568-6.993L366.324,3.694c-0.021-0.034-0.062-0.045-0.084-0.076
			c-0.633-0.707-1.36-1.29-2.141-1.804c-0.232-0.15-0.475-0.285-0.718-0.422c-0.675-0.366-1.382-0.67-2.13-0.892
			c-0.19-0.058-0.38-0.14-0.58-0.192C359.87,0.114,359.037,0,358.203,0H97.2C85.292,0,75.6,9.693,75.6,21.601v507.6
			c0,11.913,9.692,21.601,21.6,21.601H453.6c11.908,0,21.601-9.688,21.601-21.601V133.202
			C475.2,132.796,475.137,132.398,475.095,131.992z M147.382,513.691c-14.974,0-29.742-3.892-37.125-7.979l6.022-24.485
			c7.963,4.082,20.216,8.164,32.843,8.164c13.613,0,20.799-5.643,20.799-14.196c0-8.169-6.21-12.825-21.956-18.457
			c-21.766-7.583-35.962-19.644-35.962-38.687c0-22.354,18.668-39.461,49.57-39.461c14.776,0,25.661,3.111,33.431,6.613
			l-6.613,23.904c-5.244-2.521-14.575-6.207-27.4-6.207c-12.836,0-19.045,5.822-19.045,12.63c0,8.358,7.38,12.05,24.289,18.463
			c23.127,8.553,34.024,20.608,34.024,39.076C200.253,495.023,183.336,513.691,147.382,513.691z M332.237,534.284
			c-18.657-5.442-34.204-11.074-51.701-18.468c-2.911-1.16-6.022-1.745-9.134-1.936c-29.542-1.936-57.14-23.715-57.14-66.482
			c0-39.261,24.877-68.808,63.942-68.808c40.047,0,62.006,30.322,62.006,66.087c0,29.742-13.796,50.735-31.104,58.504v0.785
			c10.115,2.922,21.39,5.253,31.684,7.378L332.237,534.284z M441.492,511.745h-81.833V380.737h29.742V486.86h52.091V511.745z
			 M97.2,366.752V21.601h250.203v110.515c0,5.961,4.831,10.8,10.8,10.8H453.6l0.011,223.836H97.2z" />
                                        <path d="M334.114,171.171c0.475-1.308,0.812-2.647,0.812-4.063c0-17.386-37.568-26.765-72.924-26.765
			c-35.321,0-72.879,9.379-72.879,26.765c0,1.416,0.33,2.761,0.81,4.074l-0.188,0.335c-1.616,2.932-2.415,5.89-2.415,8.801v21.513
			c0,3.312,1.042,6.492,2.89,9.498l-0.242,0.411c-1.762,3.056-2.647,6.151-2.647,9.208v21.508c0,3.208,0.983,6.286,2.731,9.208
			l-0.084,0.134c-1.762,3.051-2.647,6.152-2.647,9.202v21.51c0,19.122,32.801,34.093,74.672,34.093
			c41.916,0,74.717-14.971,74.717-34.093v-21.51c0-3.056-0.886-6.162-2.669-9.208l-0.073-0.118c1.734-2.927,2.742-6.004,2.742-9.218
			v-21.508c0-3.061-0.886-6.167-2.669-9.218l-0.231-0.396c1.846-3.011,2.9-6.186,2.9-9.508v-21.513c0-2.911-0.812-5.877-2.415-8.81
			L334.114,171.171z M328.715,282.509c0,12.351-27.38,26.093-66.712,26.093c-39.295,0-66.68-13.742-66.68-26.093v-20.231
			c12.263,11.232,37.492,18.396,66.68,18.396c29.228,0,54.456-7.169,66.712-18.407V282.509z M328.715,242.455
			c0,12.34-27.38,26.093-66.712,26.093c-39.295,0-66.68-13.753-66.68-26.093v-20.234c12.263,11.227,37.492,18.398,66.68,18.398
			c29.228,0,54.456-7.172,66.712-18.409V242.455z M328.715,201.825c0,12.34-27.38,26.093-66.712,26.093
			c-39.295,0-66.68-13.748-66.68-26.093v-17.9c11.984,10.156,39.772,15.422,66.68,15.422c26.944,0,54.72-5.266,66.712-15.422
			V201.825z" />
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div class="col mt-2" @click="navigate('data-explorer', {sql: true})">
                            <h5>Usar SQL para analisar, tratar e transformar dados</h5>
                            <small>
                                Utilize o poder da SQL para tratar os dados. Você terá liberdade para escrever 
                                comandos SQL que consultam ou mesmo alteram dados.
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
                        <label class="sr-only" for="type">{{ $tc('common.type') }}</label>
                        <select v-model="typeFilter" class="form-control w-25 pt-0">
                            <option selected disabled>
                                {{ $tc('actions.choose') }}...
                            </option>
                            <option value="DATA_EXPLORER">
                                {{ $t('dataExplorer.experiments.DATA_EXPLORER') }}
                            </option>
                            <option value="MODEL_BUILDER">
                                {{ $t('dataExplorer.experiments.MODEL_BUILDER') }}
                            </option>
                            <option value="VIS_BUILDER">
                                {{ $t('dataExplorer.experiments.VIS_BUILDER') }}
                            </option>
                            <option value="SQL">
                                {{ $t('dataExplorer.experiments.SQL') }}
                            </option>
                        </select>
                        <label class="sr-only" for="search">{{ $tc('common.name') }}</label>
                        <input v-model="searchFilter" type="text" class="form-control m-2 w-25"
                            :placeholder="$tc('common.name')">
                        <button ref="searchBtn" class="btn btn-secondary btn-sm mb-2 btn-spinner" @click.prevent="search">
                            <font-awesome-icon icon="fa fa-search default-icon" /> {{ $t('actions.search') }}
                            <font-awesome-icon icon="spinner" pulse class="icon" />
                        </button>
                    </form>


                    <v-server-table v-show="totalRecords > 0" ref="workflowList" :columns="columns" :options="options"
                        name="workflowListDataExperiments">
                        <template #id="props">
                            <router-link v-if="props.row.type === 'DATA_EXPLORER'"
                                :to="{ name: 'data-explorer-panel', params: { id: props.row.id, platform: props.row.platform.id } }">
                                {{ props.row.id }}
                            </router-link>
                            <router-link v-if="props.row.type === 'MODEL_BUILDER'"
                                :to="{ name: 'model-design', params: { id: props.row.id, platform: props.row.platform.id } }">
                                {{ props.row.id }}
                            </router-link>
                            <router-link v-if="props.row.type === 'VIS_BUILDER'"
                                :to="{ name: 'visualization-design', params: { id: props.row.id, platform: props.row.platform.id } }">
                                {{ props.row.id }}
                            </router-link>
                            <router-link v-if="props.row.type === 'SQL'"
                                :to="{ name: 'visualization-design', params: { id: props.row.id } }">
                                {{ props.row.id }}
                            </router-link>
                        </template>
                        <template #type="props">
                            <font-awesome-icon :icon="getIcon(props.row)" />
                            {{ $t(`dataExplorer.experiments.${props.row.type}`) }}
                        </template>
                        <template #user="props">
                            {{ props.row.user.name }}
                        </template>
                        <template #name="props">
                            <router-link v-if="props.row.type === 'DATA_EXPLORER'"
                                :to="{ name: 'data-explorer-panel', params: { id: props.row.id, platform: props.row.platform.id } }">
                                {{ props.row.name }}
                            </router-link>
                            <router-link v-if="props.row.type === 'MODEL_BUILDER'"
                                :to="{ name: 'model-design', params: { id: props.row.id, platform: props.row.platform.id } }">
                                {{ props.row.name }}
                            </router-link>
                            <router-link v-if="props.row.type === 'VIS_BUILDER'"
                                :to="{ name: 'visualization-design', params: { id: props.row.id, platform: props.row.platform.id } }">
                                {{ props.row.name }}
                            </router-link>
                            <router-link v-if="props.row.type === 'SQL'"
                                :to="{ name: 'sql-workflow', params: { id: props.row.id } }">
                                {{ props.row.name }}
                            </router-link>
                        </template>
                        <template #updated="props">
                            {{ props.row.updated | formatJsonDate }}
                        </template>
                    </v-server-table>
                    <div v-show="totalRecords === 0">
                        {{ $t('common.noData') }}
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
                    data.name = self.searchFilter //data.query;
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
            this.$refs.workflowList.refresh()
        },
        navigate(name, query) {
            this.$router.push({ name, query })
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
}
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