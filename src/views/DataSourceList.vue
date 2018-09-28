<template>
    <div>
        <div class="row border-bottom border-primary">
            <div class="col-md-10">
                <h2>{{$tc('titles.dataSource', 2)}}</h2>
            </div>
            <div class="col-md-2 pull-right">
                <a href="#/data-source/add" class="btn btn-primary" role="button">
                    <font-awesome-icon icon="plus" size="1x"></font-awesome-icon> Add/configure a new data source</a>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <v-server-table :data="tableData" :columns="columns" :options="options" name="dataSourceList">
                    <template slot="id" slot-scope="props">
                        <router-link :to="{name: 'editDataSource', params: {id: props.row.id}}">{{props.row.id}}</router-link>
                    </template>

                    <template slot="actions" slot-scope="props">
                        <button class="btn btn-sm mr-2">
                            <font-awesome-icon icon="edit"></font-awesome-icon>
                        </button>
                        <button class="btn btn-sm danger">
                                <font-awesome-icon icon="trash"></font-awesome-icon>
                            </button>
                    </template>

                    <template slot="tags" slot-scope="props">
                        <div v-if="props.row.tags">
                            <div v-for="tag in (props.row.tags || '').split(',')" class="badge badge-info mr-1">
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
                columns: ['actions', 'id', 'name', 'description', 'format', 'created', 'user_name', 'tags'],
                tableData: [],
                showSideBar: false,
                options: {
                    headings: {
                        id: 'ID',
                        name: 'Name',
                        description: 'Description'
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
<style>
    tr th:nth-child(1) {
        width: 100px;
    }
    tr th:nth-child(2) {
        width: 5%;
    }

    tr th:nth-child(3) {
        width: 25%;
    }

    tr th:nth-child(4) {
        width: 35%;
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