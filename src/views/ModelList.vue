<template>
    <main role="main">
        <div>
            <div class="title">
                <div class="d-flex justify-content-between align-items-center">
                    <h1>{{$tc('titles.model', 2)}}</h1>
                    <router-link :to="{name: 'addModel'}" class="btn btn-primary btn-lemonade-primary">
                        <span class="fa fa-plus" /> {{$t('actions.addItem')}}
                    </router-link>
                </div>
            </div>
            
            <v-server-table ref="listTable" :columns="columns" :options="options"
                name="modelList">
                <template slot="id" slot-scope="props">
                    <router-link :to="{name: 'editModel', params: {id: props.row.id}}">
                        {{props.row.id}}</router-link>
                </template>
                <template slot="name" slot-scope="props">
                    <router-link :to="{name: 'editModel', params: {id: props.row.id}}">
                        {{props.row.name}}</router-link>
                </template>
                <template slot="created"
                    slot-scope="props">{{props.row.created | formatJsonDate}}</template>
                <template slot="actions" slot-scope="props">
                    <button class="btn btn-sm btn-light" @click="remove(props.row.id)">
                        <font-awesome-icon icon="trash"></font-awesome-icon>
                    </button>
                </template>
            </v-server-table>
        </div>
    </main>
</template>

<script>
    import axios from 'axios';
    import Notifier from '../mixins/Notifier';

    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;

    export default {
        mixins: [Notifier],
        data() {
            return {
                columns: ['id', 'name', 'type', 'created', 'actions'],

                showSideBar: false,
                options: {
                    debounce: 800,
                    skin: 'table-sm table table-hover',
                    dateColumns: ['created'],
                    headings: {
                        id: 'ID',
                        name: this.$tc('common.name'),
                        type: this.$tc('common.type'),
                        created: this.$tc('common.created'),
                        actions: this.$tc('common.action', 2)
                    },
                    sortable: ['id', 'name', 'type', 'created'],
                    filterable: ['id', 'name', 'type', 'created'],
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
                        const self = this;
                        data.sort = data.orderBy;
                        data.asc = data.ascending === 1 ? 'true' : 'false';
                        data.size = data.limit;
                        data.q = data.query;

                        data.fields = 'id,name,created,type';

                        let url = `${limoneroUrl}/models`;

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
                                    self.$parent.error(e);
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
        /* Methods */
        methods: {
            remove(modelId) {
                const self = this;
                this.confirm(
                    this.$t('actions.delete'),
                    this.$t('messages.doYouWantToDelete'),
                    () => {
                        const url = `${limoneroUrl}/models/${modelId}`;
                        axios
                            .delete(url, {})
                            .then(resp => {
                                self.success(self.$t('messages.successDeletion',
                                    { what: this.$tc('titles.model', 1) }));
                                self.$refs.listTable.refresh();
                            })
                            .catch(e => self.error(e));
                    }
                );

            }
        }
    };
</script>