<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="title">
                        <div class="d-flex justify-content-between align-items-center">
                            <h1>{{$tc('titles.track', 2)}}</h1>
                            <div>
                                <router-link :to="{name: 'addTrack'}"
                                             class="btn btn-primary btn-lemonade-primary float-left ml-2">
                                    <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <v-server-table ref="workflowList" :columns="columns" :options="options" name="workflowList">
                        <template #id="props">
                            <router-link :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">
                                {{props.row.id}}
                            </router-link>
                        </template>
                        <template #name="props">
                            <router-link :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">
                                {{props.row.name}}
                            </router-link>
                            <small v-if="props.row.description" class="break-word"><br>{{props.row.description}}</small>
                        </template>
                        <template #publishing_status="props">
                            <span v-if="props.row.publishing_status">
                                {{$t('track.' + props.row.publishing_status)}}
                            </span>
                        </template>
                        <template #updated="props">
                            {{props.row.updated | formatJsonDate}}
                        </template>
                        <div slot="afterFilter" class="ml-2 mt-4">
                            <button type="button" class="btn btn-sm btn-light btn-outline-secondary ml-2"
                                    @click="clearFilters">
                                {{$tc('actions.clearFilters')}}
                            </button>
                        </div>
                    </v-server-table>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';
let tahitiUrl = import.meta.env.VITE_TAHITI_URL;
export default {
    mixins: [Notifier],
    data() {
        const self = this;
        return {
            columns: [
                'id',
                'name',
                'publishing_status',
                'updated',
                'version',
            ],
            options: {
                debounce: 800,
                skin: 'table-sm table table-hover',
                dateColumns: ['updated'],
                headings: {
                    id: 'ID',
                    name: this.$tc('common.name'),
                    publishing_status: this.$tc('track.status'),
                    updated: this.$tc('common.updated'),
                    version: this.$tc('common.version'),
                },
                sortable: ['name', 'id', 'updated'],
                filterable: ['name', 'id'],
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
                    data.sort = data.orderBy;
                    data.asc = data.ascending === 1 ? 'true' : 'false';
                    data.size = data.limit;
                    data.name = data.query;

                    data.fields = 'id,name,platform,updated,user,version,description,publishing_status';

                    let url = `${tahitiUrl}/workflows?enabled=1&track=1`;
                    //this.$Progress.start();
                    return axios
                        .get(url, {
                            params: data
                        })
                        .then(resp => {
                            //this.$Progress.finish();
                            return {
                                data: resp.data.data,
                                count: resp.data.pagination.total
                            };
                        })
                        .catch(
                            function (e) {
                                //this.$Progress.finish();
                                self.error(e);
                            }.bind(this)
                        );
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
        clearFilters() {
            this.$refs.workflowList.setFilter('');
            this.$refs.workflowList.customQueries = {};
        },
    },
};
</script>