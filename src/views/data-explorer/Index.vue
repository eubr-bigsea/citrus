<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center">
            <h1>
                <font-awesome-icon icon="fa fa-vial" /> {{$t('dataExplorer.experimentsPage.whatToDo')}}
            </h1>
        </div>
        <hr>
        <h2 class="h6 text-uppercase text-muted">
            {{$t('dataExplorer.experimentsPage.createNew')}}
        </h2>
        <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-3 mb-4">
            <div v-for="(t, type) in types" :key="type" class="col">
                <b-card class="clickable h-100 type-card" role="button" tabindex="0" :style="{ '--type-color': t.color }"
                        @click="create(t)" @keydown.enter="create(t)">
                    <div class="d-flex align-items-center">
                        <div class="type-icon me-3">
                            <font-awesome-icon :icon="`fa ${t.icon}`" size="lg" inverse />
                        </div>
                        <div>
                            <h5 class="mb-1">
                                {{$t(`dataExplorer.experiments.${type}`)}}
                            </h5>
                            <small class="text-muted">{{$t(`dataExplorer.experimentsPage.desc.${type}`)}}</small>
                        </div>
                    </div>
                </b-card>
            </div>
        </div>

        <div class="custom-table">
            <b-card>
                <h2 class="h5">
                    {{$t('dataExplorer.experimentsPage.yourExperiments')}}
                </h2>
                <form class="row g-2 align-items-center mb-2" @submit.prevent="search">
                    <div class="col-12 col-md-3">
                        <label class="visually-hidden" for="type">{{$t('common.type')}}</label>
                        <select id="type" v-model="typeFilter" class="form-select">
                            <option value="">
                                {{$t('dataExplorer.experimentsPage.allTypes')}}
                            </option>
                            <option v-for="(t, type) in types" :key="type" :value="type">
                                {{$t(`dataExplorer.experiments.${type}`)}}
                            </option>
                        </select>
                    </div>
                    <div class="col-12 col-md-4">
                        <label class="visually-hidden" for="search">{{$t('common.name')}}</label>
                        <input id="search" v-model="searchFilter" type="text" class="form-control"
                               :placeholder="$t('common.name')">
                    </div>
                    <div class="col-12 col-md-auto">
                        <button ref="searchBtn" type="submit" class="btn btn-secondary btn-sm btn-spinner">
                            <font-awesome-icon icon="fa fa-search default-icon" /> {{$t('actions.search')}}
                            <font-awesome-icon icon="spinner" pulse class="icon" />
                        </button>
                        <button type="button" class="btn btn-link btn-sm" @click="clearFilters">
                            {{$t('actions.clearFilters')}}
                        </button>
                    </div>
                </form>

                <div v-if="loading && totalRecords !== null" class="text-muted small mb-2" role="status">
                    <font-awesome-icon icon="spinner" pulse /> {{$t('common.loading')}}
                </div>
                <v-server-table v-show="totalRecords === null || totalRecords > 0" ref="workflowList" :aria-busy="loading" :class="{ 'is-loading': loading && totalRecords !== null }"
                                :columns="columns" :options="options"
                                name="workflowListDataExperiments">
                    <template #type="props">
                        <span class="type-badge" :style="{ '--type-color': types[props.row.type]?.color }">
                            <font-awesome-icon :icon="`fa ${types[props.row.type]?.icon}`" />
                            {{$t(`dataExplorer.experiments.${props.row.type}`)}}
                        </span>
                    </template>
                    <template #user="props">
                        {{props.row.user.name}}
                    </template>
                    <template #name="props">
                        <router-link v-if="types[props.row.type]"
                                     :to="{ name: types[props.row.type].designRoute, params: { id: props.row.id } }">
                            {{props.row.name}}
                        </router-link>
                    </template>
                    <template #actions="props">
                        <button type="button" class="btn btn-sm btn-danger" :title="$t('actions.delete')"
                                :aria-label="$t('actions.delete')" @click="remove(props.row)">
                            <font-awesome-icon icon="trash" />
                        </button>
                    </template>
                    <template #updated="props">
                        {{$filters.formatJsonDate(props.row.updated)}}
                    </template>
                </v-server-table>
                <div v-if="!loading && totalRecords === 0" class="text-muted py-3">
                    <template v-if="typeFilter || searchFilter">
                        {{$t('common.noData')}}
                        <button type="button" class="btn btn-link btn-sm" @click="clearFilters">
                            {{$t('actions.clearFilters')}}
                        </button>
                    </template>
                    <template v-else>
                        <p>{{$t('dataExplorer.experimentsPage.emptyCta')}}</p>
                        <button v-for="(t, type) in types" :key="type" type="button"
                                class="btn btn-sm text-white me-2 mb-2" :style="{ background: t.color }"
                                @click="create(t)">
                            <font-awesome-icon :icon="`fa ${t.icon}`" /> {{$t(`dataExplorer.experiments.${type}`)}}
                        </button>
                    </template>
                </div>
            </b-card>
        </div>
    </main>
</template>
<script>
import axios from 'axios';
import Notifier from '@/mixins/Notifier.js';
import { EXPERIMENT_TYPES } from './experiment-types.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const META_PLATFORM_SLUG = 'meta';
export default {
    name: 'IndexComponent',
    mixins: [Notifier],
    data() {
        const self = this;
        return {
            types: EXPERIMENT_TYPES,
            totalRecords: null,
            loading: true,
            searchFilter: null,
            typeFilter: null,
            columns: [
                'id',
                'name',
                'user',
                'type',
                'updated',
                'version',
                'actions',
            ],
            options: {
                hidePerPageSelect: true,
                perPage: 10,
                perPageValues: [],
                debounce: 800,
                skin: 'table-sm table table-hover',

                dateColumns: ['updated'],
                headings: {
                    id: 'ID',
                    name: this.$t('common.name'),
                    user: this.$t('common.user.name'),
                    type: this.$t('common.type'),
                    updated: this.$t('common.updated'),
                    version: this.$t('common.version'),
                    actions: this.$t('common.action', 2),
                },
                orderBy: { column: 'updated', ascending: false },
                sortable: ['id', 'name', 'updated'],
                //filterable: ['name', 'id'],
                filterable: false,
                preserveState: true,
                saveState: true,
                filterByColumn: false,

                requestFunction: function (data) {
                    self.loading = true;
                    self.$refs.searchBtn.classList.remove('btn-spinner');
                    data.sort = data.orderBy;
                    data.asc = data.ascending === 1 ? 'true' : 'false';
                    data.size = 10;
                    data.name = self.searchFilter; //data.query;
                    data.platform = META_PLATFORM_SLUG;

                    if (self.typeFilter && self.typeFilter.length) {
                        data.types = self.typeFilter;
                    } else {
                        data.types = 'experiment';
                    }

                    data.fields = 'id,name,platform,updated,user,version,description,type';
                    data.enabled = 1;

                    let url = `${tahitiUrl}/workflows`;
                    return axios
                        .get(url, {
                            params: data
                        })
                        .then(resp => {
                            self.totalRecords = resp.data.pagination.total;
                            return {
                                data: resp.data.data,
                                count: resp.data.pagination.total
                            };
                        })
                        .catch(
                            function (e) {
                                self.error(e);
                            }.bind(this)
                        ).finally(() => {
                            self.loading = false;
                            self.$refs.searchBtn.classList.add('btn-spinner');
                        });
                },
                texts: {
                    filter: this.$t('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
                }
            }
        };
    },
    beforeMount() {
        this.typeFilter = localStorage.getItem('experiments:list:type') || '';
        this.searchFilter = localStorage.getItem('experiments:list:search') || '';
    },
    methods: {
        search() {
            localStorage.setItem('experiments:list:type', this.typeFilter);
            localStorage.setItem('experiments:list:search', this.searchFilter);

            this.$refs.workflowList.refresh();
        },
        create(t) {
            this.$router.push({ name: t.route, query: t.query });
        },
        remove(row) {
            const what = this.$t('dataExplorer.experimentsPage.what');
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDeleteM', { what: `${what} "${row.name}"` }),
                () => axios.delete(`${tahitiUrl}/workflows/${row.id}`)
                    .then(() => {
                        this.success(this.$t('messages.successDeletionM', { what }));
                        this.$refs.workflowList.refresh();
                    })
                    .catch(e => this.error(e))
            );
        },
        clearFilters() {
            this.typeFilter = '';
            this.searchFilter = '';
            this.search();
        }
    }
};
</script>
<style scoped>
.custom-table :deep(.VueTables .row:first-child) {
    margin: initial !important;
    background-color: white;
    padding-top: 0;
}

.type-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: var(--type-color);
}

.type-card {
    border-left: 4px solid var(--type-color);
}

.type-card:hover,
.type-card:focus-visible {
    box-shadow: 0 0 0 2px var(--type-color);
    outline: none;
}

.is-loading {
    opacity: 0.5;
    pointer-events: none;
}

.type-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.85em;
    color: #fff;
    background: var(--type-color);
}
</style>