<template>
    <div>
        <div class="row border-bottom border-primary">
            <div class="col-md-10">
                <h2>{{$tc('titles.dataSource', 2)}}</h2>
            </div>
            <div class="col-md-2 pull-right">
                <a href="#/data-source/add" class="btn btn-primary" role="button">
                    <font-awesome-icon icon="plus" size="1x"></font-awesome-icon> {{$t('actions.add', {type: $tc('titles.dataSource').toLowerCase()})}}</a>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <v-server-table :data="tableData" :columns="columns" :options="options" name="dataSourceList">
                    <template slot="id" slot-scope="props">
                        <router-link :to="{name: 'editDataSource', params: {id: props.row.id}}">{{props.row.id}}</router-link>
                    </template>
                    <template slot="name" slot-scope="props">
                        <router-link :to="{name: 'editDataSource', params: {id: props.row.id}}">{{props.row.name}}</router-link>
                        <br/>
                        <em>{{props.row.description}}</em>
                    </template>
                    <template slot="actions" slot-scope="props">
                        <button class="btn btn-sm mr-2">
                            <font-awesome-icon icon="edit"></font-awesome-icon>
                        </button>
                        <button class="btn btn-sm danger">
                                <font-awesome-icon icon="trash"></font-awesome-icon>
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
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    export default {
        data() {
            return {
                columns: ['actions', 'id', 'name', 'format', 'created', 'user_name', 'tags'],
                tableData: [],
                showSideBar: false,
                options: {
                    columnsClasses: {
                        name: 'th-20',
                        description: 'th-20',
                        actions: 'th-10'
                    },
                    texts: {
                        count: this.$t('common.pagerShowing'),
                        filter: this.$t('common.filter'),
                        limit: this.$t('common.limit'),
                    },
                    headings: {
                        id: 'ID',
                        name: this.$tc('common.name', 1),
                        description: this.$tc('common.description', 1),
                        format: this.$tc('dataSource.format', 1),
                        created: this.$t('common.created'),
                        tags: this.$t('common.tags'),
                        user: this.$t('common.user'),
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

                        return axios.get(`${limoneroUrl}/datasources?enabled=true&simple=true`,
                            {
                                params: data
                            }).then(resp => {
                                return { data: resp.data.data, count: resp.data.pagination.total };
                            }).catch(function (e) {
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
                let url = `${limoneroUrl}/datasources/infer-schema/${id}`
                Vue.http.post(url, params, { headers }).then(
                    (response) => {
                        self.$root.$refs.toastr.s('Success');
                    },
                    (error) => {
                        self.$root.$refs.toastr.e(error.body.message);
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
        float: right;
    }
</style>