<template>

    <div>
        <div class="title">
            <div class="d-flex justify-content-between align-items-center">
                <h1>{{$tc('titles.platform', 2)}}</h1>
                <router-link :to="{name: 'addPlatform'}" class="btn btn-primary btn-lemonade-primary">
                    <span class="fa fa-plus" /> {{$t('actions.addItem')}}
                </router-link>
            </div>
        </div>

        <v-server-table ref="platformList" :columns="columns" :options="options" name="platformList">
            <template slot="id" slot-scope="props">
                <router-link :to="{name: 'editPlatform', params: {id: props.row.id}}">
                    {{props.row.id}}</router-link>
            </template>
            <template slot="name" slot-scope="props">
                <router-link :to="{name: 'editPlatform', params: {id: props.row.id}}">
                    {{props.row.name}}</router-link>
            </template>
            <template slot="enabled" slot-scope="props">
                {{$tc(props.row.enabled ? 'common.yes': 'common.no')}}
            </template>
            <template slot="plugin" slot-scope="props">
                {{$tc(props.row.plugin ? 'common.yes': 'common.no')}}
            </template>
            <template slot="actions" slot-scope="props">
                <button class="btn btn-sm btn-light" @click="remove(props.row.id)">
                    <font-awesome-icon icon="trash"></font-awesome-icon>
                </button>
            </template>
            <template slot="version" slot-scope="props">{{props.row.version}}</template>
        </v-server-table>
    </div>

</template>

<script>
    import axios from 'axios';
    import { Event } from 'vue-tables-2';
    import Notifier from '../../mixins/Notifier';

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;

    export default {
        mixins: [Notifier],
        data() {
            return {
                platform: '',
                platforms: [],
                columns: ['id', 'slug', 'name', 'description', 'enabled', 'plugin', 'version'],
                options: {
                    debounce: 800,
                    skin: 'table-sm table table-hover',
                    columnClasses: { actions: 'th-10' },
                    headings: {
                        id: 'ID',
                        name: this.$tc('common.name'),
                        description: this.$tc('common.description'),
                        plugin: this.$tc('common.plugin'),
                        slug: this.$tc('common.slug'),
                        version: this.$tc('common.version'),
                        enabled: this.$tc('common.enabled'),
                        actions: this.$tc('common.action', 2)
                    },
                    sortable: ['name', 'id', 'slug',],
                    //filterable: ['name', 'id', 'description'],
                    filterable: false,
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
                    requestFunction: async function (data) {
                        data.sort = data.orderBy;
                        data.asc = data.ascending === 1 ? 'true' : 'false';
                        data.size = data.limit;
                        data.name = data.query;

                        data.fields = 'id,name,type,address,enabled,plugin,version';
                        data['all'] = 'true';

                        let url = `${tahitiUrl}/platforms`;
                        let headers = {};
                        this.$Progress.start();
                        try {
                            const resp = await axios.get(url, { params: data });
                            return resp.data;
                        } catch (e) {
                            this.error(e);
                        } finally {
                            this.$Progress.finish();
                        }

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
                this.$refs.platformList.setFilter('');
                this.$refs.platformList.customQueries = {};
                this.platform = '';
            },
            disable(platformId) {
                const self = this;
                this.confirm(
                    this.$t('actions.delete'),
                    this.$t('messages.doYouWantToDelete'),
                    () => {
                        const url = `${tahitiUrl}/platforms/${platformId}`;

                        axios
                            .delete(url, {})
                            .then(resp => {
                                self.success(
                                    self.$t('messages.successDeletion', {
                                        what: this.$tc('titles.platform', 1)
                                    })
                                );
                                self.$refs.platformList.refresh();
                            })
                            .catch(e => self.error(e));
                    }
                );
            }
        }
    };
</script>