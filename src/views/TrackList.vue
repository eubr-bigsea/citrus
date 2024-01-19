<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="title">
                        <div class="d-flex justify-content-between align-items-center">
                            <h1>{{$t('titles.track', 2)}}</h1>
                            <div>
                                <router-link :to="{ name: 'addTrack' }"
                                             class="btn btn-primary btn-lemonade-primary float-start ms-2">
                                    <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <v-server-table ref="workflowList" :columns="columns" :options="options" name="workflowList">
                        <template #id="props">
                            <router-link :to="{ name: 'editWorkflow', params: { id: props.row.id, platform: props.row.platform.id } }">
                                {{props.row.id}}
                            </router-link>
                        </template>
                        <template #name="props">
                            <router-link :to="{ name: 'editWorkflow', params: { id: props.row.id, platform: props.row.platform.id } }">
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
                            {{$filters.formatJsonDate(props.row.updated)}}
                        </template>
                        <template #afterFilters>
                            <div class="ms-2 mt-4">
                                <button type="button" class="btn btn-sm btn-light btn-outline-secondary ms-2"
                                        @click="clearFilters">
                                    {{$t('actions.clearFilters')}}
                                </button>
                            </div>
                        </template>
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
                skin: 'table table-hover',
                dateColumns: ['updated'],
                headings: {
                    id: 'ID',
                    name: this.$t('common.name'),
                    publishing_status: this.$t('track.status'),
                    updated: this.$t('common.updated'),
                    version: this.$t('common.version'),
                },
                sortable: ['name', 'id', 'updated'],
                filterable: ['name', 'id'],
                sortIcon: {
                   base: 'sort-base',
                    is: 'sort-is ms-10',
                    up: 'sort-up',
                    down: 'sort-down'
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
                    return axios
                        .get(url, {
                            params: data
                        })
                        .then(resp => {
                            return {
                                data: resp.data.data,
                                count: resp.data.pagination.total
                            };
                        })
                        .catch(
                            function (e) {
                                self.error(e);
                            }.bind(this)
                        );
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
    methods: {
        clearFilters() {
            this.$refs.workflowList.setFilter('');
            this.$refs.workflowList.customQueries = {};
        },
    },
};
</script>