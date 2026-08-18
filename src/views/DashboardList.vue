<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1>{{$t('titles.dashboard', 2)}}</h1>
        </div>
        <div class="card">
            <div class="card-body">
                <v-server-table ref="listTable" :columns="columns" :options="options" name="dashboardList">
                    <template #id="props">
                        <router-link :to="{ name: 'dashboardDetail', params: { id: props.row.id } }">
                            {{props.row.id}}
                        </router-link>
                    </template>
                    <template #is_public="props">
                        <a v-if="props.row.is_public" :href="`${origin}/public/dashboard/${props.row.hash}`"
                           target="_blank">
                            {{$t('common.publicLink')}}
                        </a>
                        <span v-else>{{$t('common.no')}}</span>
                    </template>
                    <template #title="props">
                        <router-link :to="{ name: 'dashboardDetail', params: { id: props.row.id } }">
                            {{props.row.title}}
                        </router-link>
                    </template>
                    <template #updated="props">
                        {{$filters.formatJsonDate(props.row.updated)}}
                    </template>
                    <template #actions="props">
                        <button v-if="loggedUserIsOwnerOrAdmin(props.row)" class="ms-2 btn btn-sm btn-danger"
                                @click="remove(props.row.id, props.row.title)">
                            <font-awesome-icon icon="trash" />
                        </button>
                    </template>
                </v-server-table>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';

let capirinhaUrl = import.meta.env.VITE_CAIPIRINHA_URL;

export default {
    mixins: [Notifier],
    data() {
        return {
            columns: ['id', 'title', 'is_public', 'user.name', 'updated', 'actions'],

            showSideBar: false,
            options: {
                skin: 'table table-hover',
                dateColumns: ['updated'],
                headings: {
                    id: 'ID',
                    is_public: this.$t('dashboard.public'),
                    title: this.$t('common.title'),
                    'user.name': this.$t('common.user.name'),
                    updated: this.$t('common.updated'),
                    actions: this.$t('common.action', 2)
                },
                sortable: ['id', 'title', 'updated', 'user.name'],
                filterable: ['id', 'title', 'updated', 'user.name'],
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
                    data.q = data.query;

                    data.fields = 'id,title,updated,user,is_public,hash';

                    let url = `${capirinhaUrl}/dashboards`;

                    const self = this;
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
                }.bind(this),
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
    computed: {
        origin() {
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
                        .then(() => {
                            self.success(self.$t('messages.successDeletion',
                                { what: self.$t('titles.dashboard', 1) }));
                            self.$refs.listTable.getData();
                        })
                        .catch(e => self.error(e));
                }
            );

        }
    }
};
</script>