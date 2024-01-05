<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="title">
                        <div class="d-flex justify-content-between align-items-center">
                            <h1>{{$t('titles.user', 2)}}</h1>
                            <div>
                                <router-link :to="{ name: 'AdministrationAddUser' }"
                                             class="btn btn-primary btn-lemonade-primary float-left ml-2">
                                    <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <v-server-table ref="userList"
                                    :columns="columns"
                                    :options="options"
                                    name="userList">
                        <template #id="props">
                            <router-link :to="{ name: 'AdministrationEditUser', params: { id: props.row.id } }">
                                {{props.row.id}}
                            </router-link>
                        </template>
                        <template #full_name="props">
                            <router-link :to="{ name: 'AdministrationEditUser', params: { id: props.row.id } }">
                                {{props.row.full_name}}
                            </router-link>
                        </template>

                        <template #enabled="props">
                            {{$t(props.row.enabled ? 'common.yes': 'common.no')}}
                        </template>
                        <template #email="props">
                            <router-link :to="{ name: 'AdministrationEditUser', params: { id: props.row.id } }">
                                {{props.row.email}}
                            </router-link>
                        </template>
                        <template #roles="props">
                            <router-link :to="{ name: 'AdministrationEditUser', params: { id: props.row.id } }">
                                <span v-for="role in props.row.roles"
                                      :key="role.id">
                                    <div class="badge badge-secondary p-1 mr-1">{{role.label}}</div>
                                </span>
                            </router-link>
                        </template>
                        <template #notes="props">
                            {{props.row.notes}}
                        </template>

                        <template #confirmed_at="props">
                            <div v-if="isConfirmedUser(props.row.confirmed_at)">
                                {{$filters.formatJsonDate(props.row.confirmed_at)}}
                                <font-awesome-icon icon="check" />
                            </div>
                            <button v-else
                                    class="btn btn-sm btn-success"
                                    @click="confirmUser(props.row.id)">
                                {{$t('common.confirm')}}
                            </button>
                        </template>

                        <template #actions="props">
                            <button class="btn btn-sm btn-light"
                                    @click="remove(props.row.id)">
                                <font-awesome-icon icon="trash" />
                            </button>
                        </template>
                    </v-server-table>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../../mixins/Notifier.js';
let thornUrl = import.meta.env.VITE_THORN_URL;


export default {
    mixins: [Notifier],
    data(){
        const self = this;
        return {
            platform: '',
            platforms: [],
            columns: ['id', 'full_name', 'enabled', 'email', 'notes', 'roles', 'confirmed_at', 'actions'],
            options: {
                debounce: 800,
                skin: 'table-sm table table-hover',
                dateColumns: ['updated'],
                columnClasses: {actions: 'th-10'},
                headings: {
                    id: 'ID',
                    full_name: this.$t('common.name'),
                    enabled: this.$t('common.enabled'),
                    email: this.$t('common.email'),
                    roles: this.$t('common.roles', 2),
                    notes: this.$t('common.user.notes'),
                    confirmed_at: this.$t('common.confirmed_at'),
                    actions: this.$t('common.action', 2)
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
                requestFunction: function (data){
                    data.sort = data.orderBy;
                    data.asc = data.ascending === 1 ? 'true' : 'false';
                    data.size = data.limit;
                    data.name = data.query;
                    data.fields = 'id,full_name,enabled,email,confirmed_at,roles,notes';

                    const url = `${thornUrl}/users`;
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
                            function (e){
                                self.$Progress.finish();
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
        clearFilters(){
            this.$refs.userList.setFilter('');
            this.$refs.userList.customQueries = {};
        },
        isConfirmedUser(confirmed_at){
            return confirmed_at !== undefined &&
                    confirmed_at !== null && confirmed_at !== '';
        },
        remove(userId){
            const self = this;
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    const url = `${thornUrl}/users/${userId}`;
                    axios
                        .delete(url, {})
                        .then(()=> {
                            self.success(
                                self.$t('messages.successDeletion', {
                                    what: this.$t('titles.user', 1)
                                })
                            );
                            self.$refs.userList.refresh();
                        })
                        .catch(e => self.error(e));
                }
            );
        },
        confirmUser(userId){
            const self = this;
            this.confirm(
                self.$t('actions.confirm'),
                self.$t('messages.doYouWantToConfirm'),
                () => {
                    const url = `${thornUrl}/approve/${userId}`;
                    axios
                        .post(url, {})
                        .then(()=> {
                            self.success(
                                self.$t('messages.successConfirmation', {
                                    what: this.$t('titles.user', 1)
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
