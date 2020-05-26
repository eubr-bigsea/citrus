<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div class>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{ $tc('titles.dataSource', 2) }}</h1>
                        <router-link :to="{ name: 'addDataSource' }" class="btn btn-sm btn-outline-primary">
                            {{ $t('actions.addItem') }}
                        </router-link>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <v-server-table ref="dataSourceList" :data="tableData" :columns="columns"
                                        :options="options" name="dataSourceList">
                                        <template slot="id" slot-scope="props">
                                            <router-link :to="{ name: 'editDataSource', params: { id: props.row.id } }">
                                                {{ props.row.id }}
                                            </router-link>
                                        </template>
                                        <template slot="name" slot-scope="props">
                                            <router-link :to="{ name: 'editDataSource', params: { id: props.row.id } }">
                                                {{ props.row.name }}
                                            </router-link>
                                        </template>
                                        <template slot="actions" slot-scope="props">
                                            <div class="text-nowrap">
                                                <button v-if="loggedUserIsOwnerOrAdmin(props.row)"
                                                    class="btn btn-sm btn-light" @click="remove(props.row.id)">
                                                    <font-awesome-icon icon="trash" />
                                                </button>
                                                <button class="btn btn-sm btn-light" :title="$t('actions.download')"
                                                    @click="download(props.row)">
                                                    <span class="fa fa-download" />
                                                </button>
                                                <button v-if="visualizable(props.row)" :title="$t('common.preview')"
                                                    class="btn btn-spinner btn-light btn-sm"
                                                    @click.stop="preview(props.row.id)">
                                                    <font-awesome-icon icon="spinner" pulse class="icon" />
                                                    <span class="fa fa-eye"></span>
                                                </button>
                                            </div>
                                        </template>
                                        <template slot="created" slot-scope="props">
                                            {{ props.row.created | formatJsonDate }}
                                        </template>
                                        <template slot="tags" slot-scope="props">
                                            <div v-if="props.row.tags">
                                                <div v-for="tag in (props.row.tags || '').split(',')" :key="tag"
                                                    class="badge badge-info mr-1">
                                                    {{ tag }}
                                                </div>
                                            </div>
                                        </template>
                                    </v-server-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ModalPreviewDataSource ref="preview"/>
    </main>
</template>

<script>
    import axios from 'axios';
    import Notifier from '../mixins/Notifier';
    import { deserialize } from 'jsonapi-deserializer';
    import SharedModal from '../components/ShareModal';
    import ModalPreviewDataSource from './modal/ModalPreviewDataSource';

    let thornUrl = process.env.VUE_APP_THORN_URL;
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL;

    export default {
        components: {
        },
        mixins: [Notifier],
        components: {
            ModalPreviewDataSource
        },
        data() {
            return {
                dataSourceId: 1,
                dataSourceName: '',
                columns: [
                    'id',
                    'name',
                    'description',
                    'format',
                    'created',
                    'user_name',
                    'tags',
                    'actions'
                ],
                tableData: [],
                showSideBar: false,
                options: {
                    skin: 'table-sm table table-hover',
                    columnsClasses: {
                        name: 'th-20',
                        description: 'th-20',
                        actions: 'th-15'
                    },
                    texts: {
                        filter: this.$tc('common.filter'),
                        count: this.$t('common.pagerShowing'),
                        limit: this.$t('common.limit'),
                        noResults: this.$t('common.noData'),
                        loading: this.$t('common.loading'),
                        filterPlaceholder: this.$t('common.filterPlaceholder')
                    },
                    headings: {
                        actions: this.$tc('common.action', 2),
                        id: 'ID',
                        name: this.$tc('common.name', 1),
                        description: this.$tc('common.description', 1),
                        format: this.$tc('dataSource.format', 1),
                        created: this.$t('common.created'),
                        tags: this.$t('common.tags'),
                        user_name: this.$t('common.user.name')
                    },
                    sortable: ['name', 'id', 'created'],
                    sortIcon: {
                        base: 'fa fas',
                        is: 'fa-sort ml-10',
                        up: 'fa-sort-amount-up',
                        down: 'fa-sort-amount-down'
                    },
                    preserveState: true,
                    saveState: true,
                    filterable: ['name', 'album'],
                    requestFunction: function (data) {
                        data.sort = data.orderBy;
                        data.asc = data.ascending === 1 ? 'true' : 'false';
                        data.size = data.limit;
                        this.$Progress.start();
                        return axios
                            .get(`${limoneroUrl}/datasources?enabled=true&simple=true`, {
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
                                    this.$Progress.finish();
                                    this.dispatch('error', e);
                                }.bind(this)
                            );
                    }
                }
            };
        },
        mounted() {
        },
        /* Methods */
        methods: {
            preview(dataSource){
                this.$refs.preview.show(dataSource);
            },
            loggedUserIsOwnerOrAdmin(dataSource) {
                const user = this.$store.getters.user;
                return dataSource.user_id === user.id || user.roles.indexOf('admin') >= 0;
            },
            getPermissions(permissions) {
                return (
                    (permissions || [])
                        .map(p => {
                            return p.permission;
                        })
                        .join(', ') || 'ALL'
                );
            },
            infer(id) {
                let self = this;
                let headers = {};
                let params = {};
                const url = `${limoneroUrl}/datasources/infer-schema/${id}`;
                Vue.http.post(url, params, { headers }).then(
                    response => {
                        self.$root.$refs.toastr.s('Success');
                    },
                    error => {
                        self.$root.$refs.toastr.e(error.body.message);
                    }
                );
            },
            download(dataSource) {
                axios({
                    url: `${limoneroUrl}/datasources/${dataSource.id}/download`,
                    method: 'GET',
                    responseType: 'blob' // important
                }).then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute(
                        'download',
                        `${dataSource.name}.${dataSource.format.toLowerCase()}`
                    );
                    document.body.appendChild(link);
                    link.click();
                });
            },
            remove(dataSourceId) {
                const self = this;
                this.confirm(
                    this.$t('actions.delete'),
                    this.$t('messages.doYouWantToDelete'),
                    () => {
                        const url = `${limoneroUrl}/datasources/${dataSourceId}`;
                        axios
                            .delete(url, {})
                            .then(resp => {
                                self.success(
                                    self.$t('messages.successDeletion', {
                                        what: this.$tc('titles.dataSource', 1)
                                    })
                                );
                                self.$refs.dataSourceList.refresh();
                            })
                            .catch(e => self.error(e));
                    }
                );
            },
            visualizable(ds) {
                return ['JDBC', 'CSV', 'HIVE'].includes(ds.format);
            }
        }
    };
</script>
<style>
    .VueTables .form-inline label {
        display: block !important;
        font-weight: bold;
    }

    /* issue: Search and Limit Fields not inline when using latest Bootstrap4
    https://github.com/matfish2/vue-tables-2/issues/486
    The code below solve the problem.
    TODO: Remove the code When the problem is resolved.
*/
    .VueTables__search {
        width: auto !important;
    }

    .VueTables__limit {
        width: auto !important;
    }
</style>