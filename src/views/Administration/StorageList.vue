<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$t('titles.storage', 2)}}</h1>
                        <router-link :to="{name: 'addStorage'}"
                                     class="btn btn-sm btn-outline-primary">
                            {{$t('actions.addItem')}}
                        </router-link>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <v-server-table ref="storageList"
                                                    :columns="columns"
                                                    :options="options"
                                                    name="storageList">
                                        <template #id="props">
                                            <router-link :to="{name: 'editStorage', params: {id: props.row.id}}">
                                                {{props.row.id}}
                                            </router-link>
                                        </template>
                                        <template #name="props">
                                            <router-link :to="{name: 'editStorage', params: {id: props.row.id}}">
                                                {{props.row.name}}
                                            </router-link>
                                        </template>
                                        <template #type="props">
                                            {{props.row.type}}
                                        </template>
                                        <template #enabled="props">
                                            {{$t(props.row.enabled ? 'common.yes': 'common.no')}}
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
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../../mixins/Notifier.js';

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    mixins: [Notifier],
    data(){
        const self = this;
        return {
            platform: '',
            platforms: [],
            columns: ['id', 'name', 'type', 'enabled', 'actions'],
            options: {
                debounce: 800,
                skin: 'table table-hover',
                columnClasses: {actions: 'th-10'},
                headings: {
                    id: 'ID',
                    name: this.$t('common.name'),
                    type: this.$t('common.type'),
                    enabled: this.$t('common.enabled'),
                    actions: this.$t('common.action', 2)
                },
                sortable: ['name', 'id', 'type'],
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
                requestFunction: function (data){
                    data.sort = data.orderBy;
                    data.asc = data.ascending === 1 ? 'true' : 'false';
                    data.size = data.limit;
                    data.name = data.query;

                    data.fields = 'id,name,type,enabled';

                    let url = `${limoneroUrl}/storages?enabled=true`;
                    return axios
                        .get(url, {params: data})
                        .then(resp => {
                            return {
                                data: resp.data.data,
                                count: resp.data.pagination.total
                            };
                        })
                        .catch(
                            function (e){
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
    /* Methods */
    methods: {
        clearFilters(){
            this.$refs.storageList.setFilter('');
        },
        remove(storageId){
            const self = this;
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    const url = `${limoneroUrl}/storages/${storageId}`;

                    axios
                        .delete(url, {})
                        .then(()=> {
                            self.success(
                                self.$t('messages.successDeletion', {
                                    what: this.$t('titles.storage', 1)
                                })
                            );
                            self.$refs.storageList.refresh();
                        })
                        .catch(e => self.error(e));
                }
            );
        }
    }
};
</script>
