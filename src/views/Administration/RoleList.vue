<template>
    <main role="main">
        <div>
            <div class="title">
                <div class="d-flex justify-content-between align-items-center">
                    <h1>{{$tc('titles.role', 2)}}</h1>
                    <router-link :to="{ name: 'AdministrationAddRole' }" class="btn btn-primary btn-lemonade-primary">
                        <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                    </router-link>
                </div>
            </div>

            <v-server-table ref="roleList" :columns="columns" :options="options" name="roleList">
                <template #id="props">
                    <router-link :to="{ name: 'AdministrationEditRole', params: { id: props.row.id } }">
                        {{props.row.id}}
                    </router-link>
                </template>
                <template #name="props">
                    <router-link :to="{ name: 'AdministrationEditRole', params: { id: props.row.id } }">
                        {{props.row.name}}
                    </router-link>
                </template>
                <template #enabled="props">
                    {{$tc(props.row.enabled ? 'common.yes': 'common.no')}}
                </template>
                <template #system="props">
                    {{$tc(props.row.system? 'common.yes': 'common.no')}}
                </template>
                <template #actions="props">
                    <button v-if="!props.row.system" class="btn btn-sm btn-light" @click="remove(props.row.id)">
                        <font-awesome-icon icon="trash" />
                    </button>
                </template>
            </v-server-table>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../../mixins/Notifier.js';
let thornUrl = import.meta.env.VITE_THORN_URL;


export default {
    mixins: [Notifier],
    data() {
        const self = this;
        return {
            platform: '',
            platforms: [],
            columns: ['id', 'name', 'label', 'description', 'enabled', 'system', 'actions'],
            options: {
                debounce: 800,
                skin: 'table-sm table table-hover',
                dateColumns: ['updated'],
                columnClasses: { actions: 'th-2' },
                headings: {
                    id: 'ID',
                    name: this.$tc('common.name'),
                    description: this.$tc('common.description'),
                    label: this.$tc('common.label'),
                    enabled: this.$tc('common.enabled'),
                    system: this.$tc('common.system'),
                    actions: this.$tc('common.action', 2)
                },
                sortable: ['name', 'id'],
                filterable: ['name', 'id', 'description', 'label'],
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
                    data.sort = data.orderBy;
                    data.asc = data.ascending === 1 ? 'true' : 'false';
                    data.size = data.limit;
                    data.name = data.query;
                    data.fields = 'id,name,label,description,enabled,system';

                    const url = `${thornUrl}/roles`;
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
                                self.$Progress.finish();
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
            this.$refs.roleList.setFilter('');
            this.$refs.roleList.customQueries = {};
        },
        isConfirmedRole(confirmed_at) {
            return confirmed_at !== null;
        },
        remove(roleId) {
            const self = this;
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    const url = `${thornUrl}/roles/${roleId}`;
                    axios
                        .delete(url, {})
                        .then(() => {
                            self.success(
                                self.$t('messages.successDeletion', {
                                    what: this.$tc('titles.role', 1)
                                })
                            );
                            self.$refs.roleList.refresh();
                        })
                        .catch(e => self.error(e));
                }
            );
        },
        confirmRole(roleId) {
            const self = this;
            this.confirm(
                self.$t('actions.confirm'),
                self.$t('messages.doYouWantToConfirm'),
                () => {
                    const url = `${thornUrl}/roles/${roleId}/confirm`;
                    axios
                        .post(url, {})
                        .then(() => {
                            self.success(
                                self.$t('messages.successConfirmation', {
                                    what: this.$tc('titles.role', 1)
                                })
                            );
                            self.$refs.roleList.refresh();
                        })
                        .catch(e => self.error(e));
                }
            );
        }
    }
};
</script>