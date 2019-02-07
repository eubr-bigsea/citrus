<template>
    <div>
        <div class="row border-bottom border-primary p-3 d-flex justify-content-between">
            <h2 class="title text-primary">{{$tc('titles.dataSource', 2)}}</h2>
            <router-link :to="{name: 'addDataSource'}" class="btn btn-primary btn-sm">
                <font-awesome-icon icon="plus" size="1x"></font-awesome-icon> {{$t('actions.add', {type:
                $tc('titles.dataSource').toLowerCase()})}}
            </router-link>
        </div>
        <div class="row">
            <div class="col-md-12">
                <v-server-table :data="tableData" :columns="columns" :options="options" name="dataSourceList" ref="dataSourceList">
                    <template slot="id" slot-scope="props">
                        <router-link :to="{name: 'editDataSource', params: {id: props.row.id}}">{{props.row.id}}</router-link>
                    </template>
                    <template slot="name" slot-scope="props">
                        <router-link :to="{name: 'editDataSource', params: {id: props.row.id}}">{{props.row.name}}</router-link>
                    </template>
                    <template slot="actions" slot-scope="props">
                        <button class="btn btn-sm danger mr-2" @click="remove(props.row.id)">
                            <font-awesome-icon icon="trash"></font-awesome-icon>
                        </button>
                        <button class="btn btn-sm ml-1" @click="download(props.row)" :title="$t('actions.download')">
                            <span class="fa fa-download"></span>
                        </button>
                    </template>
                    <template slot="created" slot-scope="props">
                        {{props.row.created | formatJsonDate}}
                    </template>
                    <template slot="tags" slot-scope="props">
                        <div v-if="props.row.tags">
                            <div v-for="tag in (props.row.tags || '').split(',')" class="badge badge-info mr-1" :key="tag">
                                {{tag}}
                            </div>
                        </div>
                    </template>
                </v-server-table>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Notifier from '../mixins/Notifier'
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    export default {
        mixins: [Notifier],
        data() {
            return {
                columns: ['id', 'name', 'description', 'format', 'created', 'user_name', 'tags', 'actions',],
                tableData: [],
                showSideBar: false,
                options: {
                    skin: 'table-sm table table-striped',
                    columnsClasses: {
                        name: 'th-20',
                        description: 'th-20',
                        actions: 'th-10'
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
                        user_name: this.$t('common.user.name'),
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
                        data.sort = data.orderBy
                        data.asc = data.ascending === 1 ? 'true' : 'false'
                        data.size = data.limit
                        this.$Progress.start();
                        return axios.get(`${limoneroUrl}/datasources?enabled=true&simple=true`,
                            {
                                params: data
                            }).then(resp => {
                                this.$Progress.finish();
                                return { data: resp.data.data, count: resp.data.pagination.total };
                            }).catch(function (e) {
                                this.$Progress.finish();
                                this.dispatch('error', e);
                            }.bind(this));
                    }
                }
            }
        },
        /* Methods */
        methods: {
            getPermissions(permissions) {
                return (permissions || []).map((p) => {
                    return p.permission;
                }).join(', ') || 'ALL';
            },
            download(id) {
                let self = this;
                let headers = {};
                let params = {}
                let url = `${limoneroUrl}/datasources/infer-schema/${id}`
                Vue.http.post(url, params, { headers }).then(
                    (response) => {
                        self.$root.$refs.toastr.s('Success');
                    },
                    (error) => {
                        self.$root.$refs.toastr.e(error.body.message);
                    });
            },
            infer(id) {
                let self = this;
                let headers = {};
                let params = {}
                const url = `${limoneroUrl}/datasources/infer-schema/${id}`
                Vue.http.post(url, params, { headers }).then(
                    (response) => {
                        self.$root.$refs.toastr.s('Success');
                    },
                    (error) => {
                        self.$root.$refs.toastr.e(error.body.message);
                    });
            },
            download(dataSource) {
                axios({
                    url: `${limoneroUrl}/datasources/${dataSource.id}/download`,
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${dataSource.name}.${dataSource.format.toLowerCase()}`);
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
                        const url = `${limoneroUrl}/datasources/${dataSourceId}`
                        axios.delete(url, { })
                            .then((resp) => {
                                self.$refs.dataSourceList.refresh();
                            }).catch((e) => self.error(e))
                    });
            }
        },
    }
</script>
<style scoped>
    em {
        font-size: .8em;
    }

    .th-5 {
        width: 5%;
    }

    .th-10 {
        width: 10%;
    }

    .th-20 {
        width: 20%;
    }

    .form-inline {
        width: 450px;
        float: left;
        display: block;
    }

    .form-inline label {
        display: block !important;
        font-weight: bold;
    }

    .VueTables__sort-icon {
        display: block;
        float: left;
    }
</style>