<template>
    <div>
        <div class="title">
            <div class="d-flex justify-content-between align-items-center">
                <h1>{{$t('titles.platform', 2)}}</h1>
                <router-link :to="{name: 'addPlatform'}" class="btn btn-primary btn-lemonade-primary">
                    <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                </router-link>
            </div>
        </div>

        <v-server-table ref="platformList" :columns="columns" :options="options"
                        name="platformList">
            <template #id="props">
                <router-link :to="{name: 'editPlatform', params: {id: props.row.id}}">
                    {{props.row.id}}
                </router-link>
            </template>
            <template #name="props">
                <router-link :to="{name: 'editPlatform', params: {id: props.row.id}}">
                    {{props.row.name}}
                </router-link>
            </template>
            <template #enabled="props">
                {{$t(props.row.enabled ? 'common.yes': 'common.no')}}
            </template>
            <template #plugin="props">
                {{$t(props.row.plugin ? 'common.yes': 'common.no')}}
            </template>
            <template #actions="props">
                <button class="btn btn-sm btn-light" @click="remove(props.row.id)">
                    <font-awesome-icon icon="trash" />
                </button>
            </template>
            <template #version="props">
                {{props.row.version}}
            </template>
        </v-server-table>
    </div>
</template>

<script>
import axios from 'axios';
import Notifier from '../../mixins/Notifier.js';

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;

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
                    name: this.$t('common.name'),
                    description: this.$t('common.description'),
                    plugin: this.$t('common.plugin'),
                    slug: this.$t('common.slug'),
                    version: this.$t('common.version'),
                    enabled: this.$t('common.enabled'),
                    actions: this.$t('common.action', 2)
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
                    try {
                        const resp = await axios.get(url, { params: data });
                        return resp.data;
                    } catch (e) {
                        this.error(e);
                    }

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
                        .then(() => {
                            self.success(
                                self.$t('messages.successDeletion', {
                                    what: this.$t('titles.platform', 1)
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