<template>
    <div>
        <div class="row border-bottom border-primary p-2">
            <div class="col-md-10">
                <h2 class="title text-primary">{{$tc('titles.dashboard', 2)}}</h2>
            </div>
            <div class="col-md-2 pull-right text-right">
                <a href="#/dashboards/add" class="btn btn-primary btn-sm" role="button">
                    <font-awesome-icon icon="plus" size="1x"></font-awesome-icon>  {{$t('actions.add', {type: $tc('titles.dashboard').toLowerCase()})}}
                </a>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <v-server-table :columns="columns" :options="options" ref="listTable" name="dashboardList">
                    <template slot="id" slot-scope="props">
                        <router-link :to="{name: 'dashboardDetail', params: {id: props.row.id}}">{{props.row.id}}</router-link>
                    </template>
                    <template slot="updated" slot-scope="props">
                        {{props.row.updated | formatJsonDate}}
                    </template>
                </v-server-table>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Notifier from '../mixins/Notifier'

    let capirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL

    export default {
        mixins: [Notifier],
        data() {
            return {
                columns: ['id', 'title', 'user.name', 'updated'],
                
                showSideBar: false,
                options: {
                    dateColumns: ['updated'],
                    headings: {
                        id: 'ID',
                        title: this.$tc('common.title'),
                        'user.name': this.$tc('common.user.name'),
                        updated: this.$tc('common.updated'),
                    },
                    sortable: ['id', 'title', 'updated', 'user.name'],
                    filterable: ['id', 'title', 'updated', 'user.name'],
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
                        data.sort = data.orderBy
                        data.asc = data.ascending === 1 ? 'true' : 'false'
                        data.size = data.limit
                        data.q = data.query

                        data.fields = 'id,title,updated,user';

                        let url = `${capirinhaUrl}/dashboards`;

                        this.$Progress.start()
                        return axios.get(url, {
                            params: data
                        }).then(resp => {
                            this.$Progress.finish()
                            return { data: resp.data.data, count: resp.data.pagination.total };
                        }).catch(function (e) {
                            this.$Progress.finish()
                            this.error(e);
                        }.bind(this));
                    },
                    texts:{
                        filter: this.$tc('common.filter'),
                        count: this.$t('common.pagerShowing'),
                        limit: this.$t('common.limit'),
                        noResults: this.$t('common.noData'),
                        loading: this.$t('common.loading'),
                        filterPlaceholder: this.$t('common.filterPlaceholder')
                    }
                }
            }
        },
        /* Methods */
        methods: {
            clearFilters() {
                this.$refs.listTable.setFilter('')
                this.$refs.listTable.customQueries = {}
            }
        }
    }
</script>
<style>
    .row.border-primary {
        margin-bottom: 10px;
        padding: 15px 0;
    }
    .form-inline {
        width: 650px;
        float: left;
        display: block;
    }

    .form-inline>div {
        margin-right: 5px;
    }

    .form-inline label {
        display: block !important;
        font-weight: bold;
    }
    .VueTables__sort-icon {
        display: block;
        float: left;
        margin-right: 5px
    }
</style>