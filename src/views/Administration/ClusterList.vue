<template>
    <main role="main">
        <div>
            <div class="title">
                <div class="d-flex justify-content-between align-items-center">
                    <h1>{{$tc('titles.cluster', 2)}}</h1>
                    <router-link :to="{name: 'addCluster'}" class="btn btn-primary btn-lemonade-primary">
                        <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                    </router-link>
                </div>
            </div>

            <v-server-table ref="clusterList" :columns="columns" :options="options" name="clusterList">
                <template #id="props">
                    <router-link :to="{name: 'editCluster', params: {id: props.row.id}}">
                        {{props.row.id}}
                    </router-link>
                </template>
                <template #name="props">
                    <router-link :to="{name: 'editCluster', params: {id: props.row.id}}">
                        {{props.row.name}}
                    </router-link>
                </template>
                <template #type="props">
                    {{props.row.type}}
                </template>
                <template #enabled="props">
                    {{$tc(props.row.enabled ? 'common.yes': 'common.no')}}
                </template>
                <template #actions="props">
                    <button class="btn btn-sm btn-light" @click="remove(props.row.id)">
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

const standUrl = import.meta.env.VITE_STAND_URL;

export default {
    mixins: [Notifier],
    data(){
        return {
            platform: '',
            platforms: [],
            columns: ['id', 'name', 'type', 'enabled', 'actions'],
            options: {
                debounce: 800,
                skin: 'table-sm table table-hover',
                columnClasses: {actions: 'th-10'},
                headings: {
                    id: 'ID',
                    name: this.$tc('common.name'),
                    type: this.$tc('common.type'),
                    enabled: this.$tc('common.enabled'),
                    actions: this.$tc('common.action', 2)
                },
                sortable: ['name', 'id', 'type'],
                filterable: ['name', 'id'],
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

                    data.fields = 'id,name,type,enabled';

                    let url = `${standUrl}/clusters`;
                    this.$Progress.start();
                    return axios
                        .get(url, {params: data})
                        .then(resp => {
                            this.$Progress.finish();
                            return {
                                data: resp.data.data,
                                count: resp.data.pagination.total
                            };
                        })
                        .catch(
                            function (e){
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
    watch: {
        // platform(v) {
        //     // This is not working
        //     // Event.$emit('vue-tables.clusterList.filter::platform', v);
        //     // Event.$emit('vue-tables.filter::platform', v);
        //     // This works, but use internal details of component
        //     const table = this.$refs.clusterList;
        //     table.customQueries['platform'] = v;
        //     table.updateState('customQueries', table.customQueries);
        //     table.getData();
        // }
    },
    mounted(){ },
    /* Methods */
    methods: {
        clearFilters(){
            this.$refs.clusterList.setFilter('');
            this.$refs.clusterList.customQueries = {};
            this.platform = '';
        },
        remove(clusterId){
            const self = this;
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    const url = `${standUrl}/clusters/${clusterId}`;

                    axios
                        .delete(url, {})
                        .then(() => {
                            self.success(
                                self.$t('messages.successDeletion', {
                                    what: this.$tc('titles.cluster', 1)
                                })
                            );
                            self.$refs.clusterList.refresh();
                        })
                        .catch(e => self.error(e));
                }
            );
        }
    }
};
</script>