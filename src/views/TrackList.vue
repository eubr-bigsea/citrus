<template>
    <div class="row">
        <div class="col">
            <div>
                <div class="d-flex justify-content-between align-items-center">
                    <h1>{{$tc('titles.track', 2)}}</h1>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-body">
                                <v-server-table :columns="columns" :options="options" ref="workflowList"
                                    name="workflowList">
                                    <template slot="id" slot-scope="props">
                                        <router-link
                                            :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">
                                            {{props.row.id}}</router-link>
                                        </template>
                                        <template slot="name" slot-scope="props">
                                            <router-link
                                            :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">
                                            {{props.row.name}}</router-link>
                                            <small v-if="props.row.description" class="break-word"><br/>{{props.row.description}}</small>
                                    </template>
                                    <template slot="updated"
                                        slot-scope="props">{{props.row.updated | formatJsonDate}}</template>
                                    <div slot="afterFilter" class="ml-2 mt-4">
                                        <button type="button"
                                            class="btn btn-sm btn-light btn-outline-secondary ml-2"
                                            @click="clearFilters">{{$tc('actions.clearFilters')}}</button>
                                    </div>
                                </v-server-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Notifier from '../mixins/Notifier';
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    export default {
        mixins: [Notifier],
        data() {
            return {
                columns: [
                    'id',
                    'name',
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

                        data.fields = 'id,name,platform,updated,user,version,description';

                        let url = `${tahitiUrl}/workflows?enabled=1&track=1`;
                        this.$Progress.start();
                        return axios
                            .get(url, {
                                params: data
                            })
                            .then(resp => {
                                this.$Progress.finish();
                                return {
                                    data: resp.data.data,
                                    count: resp.data.pagination.total
                                };
                            })
                            .catch(
                                function (e) {
                                    this.$Progress.finish();
                                    this.error(e);
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
        mounted() {
        },
        /* Methods */
        methods: {
            clearFilters() {
                this.$refs.workflowList.setFilter('');
                this.$refs.workflowList.customQueries = {};
            },
        },
    };
</script>
