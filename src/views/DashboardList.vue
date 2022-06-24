<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div class="title">
                    <h1>{{$tc('titles.dashboard', 2)}}</h1>
                </div>
                <v-server-table ref="listTable" :columns="columns" :options="options" name="dashboardList">
                    <template slot="id" slot-scope="props">
                        <router-link :to="{name: 'dashboardDetail', params: {id: props.row.id}}">
                            {{props.row.id}}</router-link>
                    </template>
                    <template slot="is_public" slot-scope="props">
                        <div v-if="props.row.is_public">
                            <a :href="`${origin}/public/dashboard/${props.row.hash}`" target="_blank">
                                {{$t('common.publicLink')}}
                            </a>
                        </div>
                    </template>
                    <template slot="title" slot-scope="props">
                        <router-link :to="{name: 'dashboardDetail', params: {id: props.row.id}}">
                            {{props.row.title}}</router-link>
                    </template>
                    <template slot="updated" slot-scope="props">{{props.row.updated | formatJsonDate}}</template>
                    <template slot="actions" slot-scope="props">
                        <div>
                            <button v-if="loggedUserIsOwnerOrAdmin(props.row)" class="ml-2 btn btn-sm btn-danger"
                                @click="remove(props.row.id, props.row.title)">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </div>
                    </template>
                </v-server-table>
            </div>
        </div>
    </main>
</template>

<script>
    import axios from 'axios';
    import Notifier from '../mixins/Notifier';

    let capirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;

    export default {
        mixins: [Notifier],
        data() {
            return {
                columns: ['id', 'title', 'is_public', 'user.name', 'updated', 'actions'],

                showSideBar: false,
                options: {
                    skin: 'table-sm table table-hover',
                    dateColumns: ['updated'],
                    headings: {
                        id: 'ID',
                        is_public: this.$tc('dashboard.public'),
                        title: this.$tc('common.title'),
                        'user.name': this.$tc('common.user.name'),
                        updated: this.$tc('common.updated'),
                        actions: this.$tc('common.action', 2)
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
                        data.sort = data.orderBy;
                        data.asc = data.ascending === 1 ? 'true' : 'false';
                        data.size = data.limit;
                        data.q = data.query;

                        data.fields = 'id,title,updated,user,is_public,hash';

                        let url = `${capirinhaUrl}/dashboards`;

                        this.$Progress.start();
                        const self = this;
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
                                    self.$Progress.finish();
                                    self.error(e);
                                }.bind(this)
                            );
                    }.bind(this),
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
        computed: {
            origin(){
                return window.location.origin;
            }
        },
        /* Methods */
        methods: {
            loggedUserIsOwnerOrAdmin(dashboard) {
                const permissions = this.$store.getters.userPermissions;
                const user = this.$store.getters.user;
                return dashboard.user.id === user.id || permissions.indexOf('ADMINISTRATOR') >= 0;
            },
            clearFilters() {
                this.$refs.listTable.setFilter('');
                this.$refs.listTable.customQueries = {};
            },
            remove(dashboardId, name) {
                const self = this;
                this.confirm(
                    this.$t('actions.delete') + " '" + name + "'",
                    this.$t('messages.doYouWantToDelete'),
                    function () {
                        const url = `${capirinhaUrl}/dashboards/${dashboardId}`;
                        axios
                            .delete(url, {})
                            .then(()=> {
                                self.success(self.$t('messages.successDeletion',
                                    { what: self.$tc('titles.dashboard', 1) }));
                                self.$refs.listTable.getData();
                            })
                            .catch(e => self.error(e));
                    }
                );

            }
        }
    };
</script>
