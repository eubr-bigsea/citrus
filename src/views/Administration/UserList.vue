<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{ $tc('titles.user', 2) }}</h1>
                        <router-link :to="{ name: 'AdministrationAddUser' }" class="btn btn-sm btn-outline-primary">
                            {{ $t('actions.addItem') }}
                        </router-link>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <v-server-table ref="userList" :columns="columns" :options="options"
                                        name="userList">
                                        <template slot="id" slot-scope="props">
                                            <router-link :to="{ name: 'AdministrationEditUser', params: { id: props.row.id } }">
                                                {{ props.row.id }}
                                            </router-link>
                                        </template>
                                        <template slot="full_name" slot-scope="props">
                                            <router-link :to="{ name: 'AdministrationEditUser', params: { id: props.row.id } }">
                                                {{ props.row.full_name }}
                                            </router-link>
                                        </template>
                                        <template slot="email" slot-scope="props">
                                            <router-link :to="{ name: 'AdministrationEditUser', params: { id: props.row.id } }">
                                                {{ props.row.email }}
                                            </router-link>
                                        </template>
                                        <template slot="roles" slot-scope="props">
                                            <router-link :to="{ name: 'AdministrationEditUser', params: { id: props.row.id } }">
                                                {{ props.row.roles[0] && $t(`roles.${props.row.roles[0]}`) }}
                                            </router-link>
                                        </template>
                                        <template slot="confirmed_at" slot-scope="props">
                                            <div v-if="isConfirmedUser(props.row.confirmed_at)">
                                                {{ props.row.confirmed_at | formatJsonDate }}
                                                <font-awesome-icon icon="check" />
                                            </div>
                                            <button v-else class="btn btn-sm btn-success"
                                                @click="confirmUser(props.row.id)">
                                                {{ $t('common.confirm') }}
                                            </button>
                                        </template>

                                        <template slot="actions" slot-scope="props">
                                            <router-link class="btn btn-sm btn-light" :to="{ name: 'AdministrationEditUser', params: { id: props.row.id } }">
                                                <font-awesome-icon icon="user-edit" />
                                            </router-link>
                                            <button class="btn btn-sm btn-light" @click="remove(props.row.id)">
                                                <font-awesome-icon icon="trash" />
                                            </button>
                                        </template>
                                    </v-server-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    import axios from 'axios';
    import Notifier from '../../mixins/Notifier';
    import { deserialize } from 'jsonapi-deserializer';

    let thornUrl = process.env.VUE_APP_THORN_URL;

    export default {
        mixins: [Notifier],
        data() {
            return {
                platform: '',
                platforms: [],
                columns: ['id', 'full_name', 'email', 'roles', 'confirmed_at', 'actions'],
                options: {
                    debounce: 800,
                    skin: 'table-sm table table-hover',
                    dateColumns: ['updated'],
                    columnClasses: { actions: 'th-10' },
                    headings: {
                        id: 'ID',
                        name: this.$tc('common.name'),
                        email: this.$tc('common.email'),
                        roles: this.$tc('common.roles'),
                        confirmed_at: this.$tc('common.confirmed_at'),
                        actions: this.$tc('common.action', 2)
                    },
                    sortable: ['full_name', 'id', 'email', 'confirmed_at'],
                    filterable: ['full_name', 'id', 'email'],
                    sortIcon: {
                        base: 'fa fas',
                        is: 'fa-sort ml-10',
                        up: 'fa-sort-amount-up',
                        down: 'fa-sort-amount-down'
                    },
                    preserveState: true,
                    saveState: true,
                    customFilters: ['platform'],
                    filterByColumn: false,
                    requestFunction: function (data) {
                        var sort_opt =
                            data.orderBy == undefined ? 'confirmed_at' : data.orderBy;
                        data.sorted_by = {};
                        data.sorted_by[sort_opt] = data.ascending === 1 ? 'asc' : 'desc';
                        data.asc = data.ascending === 1 ? 'true' : 'false';
                        data.per_page = data.limit;
                        data.search_by = data.query;

                        data.fields = 'id,full_name,email,confirmed_at';

                        let url = `${thornUrl}/administration/users`;
                        this.$Progress.start();
                        return axios
                            .get(url, {
                                params: data
                            })
                            .then(resp => {
                                this.$Progress.finish();
                                return {
                                    data: deserialize(resp.data),
                                    count: resp.data.meta.pagination.total_objects
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
        methods: {
            clearFilters() {
                this.$refs.userList.setFilter('');
                this.$refs.userList.customQueries = {};
            },
            isConfirmedUser(confirmed_at) {
                return confirmed_at !== null;
            },
            remove(userId) {
                const self = this;
                this.confirm(
                    this.$t('actions.delete'),
                    this.$t('messages.doYouWantToDelete'),
                    () => {
                        const url = `${thornUrl}/administration/users/${userId}`;
                        axios
                            .delete(url, {})
                            .then(resp => {
                                self.success(
                                    self.$t('messages.successDeletion', {
                                        what: this.$tc('titles.user', 1)
                                    })
                                );
                                self.$refs.userList.refresh();
                            })
                            .catch(e => self.error(e));
                    }
                );
            },
            confirmUser(userId) {
                const self = this;
                this.confirm(
                    self.$t('actions.confirm'),
                    self.$t('messages.doYouWantToConfirm'),
                    () => {
                        const url = `${thornUrl}/administration/users/${userId}/confirm`;
                        axios
                            .post(url, {})
                            .then(resp => {
                                self.success(
                                    self.$t('messages.successConfirmation', {
                                        what: this.$tc('titles.user', 1)
                                    })
                                );
                                self.$refs.userList.refresh();
                            })
                            .catch(e => self.error(e));
                    }
                );
            }
        }
    };
</script>