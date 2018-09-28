<template>
    <div>
        <div class="row border-bottom border-primary">
            <div class="col-md-10">
                <h2>Workflows</h2>
            </div>
            <div class="col-md-2 pull-right">
                <a href="#/data-source/add" class="btn btn-primary" role="button">
                    <font-awesome-icon icon="plus" size="1x"></font-awesome-icon> Add a new workflow</a>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <v-server-table :columns="columns" :options="options" ref="listTable" name="workflowList">
                    <template slot="id" slot-scope="props">
                        <router-link :to="{name: 'editWorkflow', params: {id: props.row.id}}">{{props.row.id}}</router-link>
                    </template>
                    <template slot="platform" slot-scope="props">
                        {{props.row.platform.name}}
                    </template>
                    <template slot="h__name">
                        Name
                    </template>
                    <div slot="afterFilter">
                        <label>Platform:</label>
                        <select class="form-control" v-model="platform">
                            <option></option>
                            <option v-for="p in platforms" v-bind:value="p.slug">{{p.name}}</option>
                        </select>
                        <button type="button" class="ml-1 btn btn-sm btn-success" @click="clearFilters">Clear filters</button>
                    </div>
                </v-server-table>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { Event } from 'vue-tables-2'
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL
    export default {
        data() {
            return {
                platform: '',
                platforms: [],
                columns: ['id', 'name', 'created', 'updated', 'platform', 'user_name', 'version'],

                showSideBar: false,
                options: {
                    headings: {
                        id: 'ID',
                        name: 'Name',
                    },
                    sortable: ['name', 'id', 'created', 'updated'],
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
                    requestFunction: function (data) {
                        data.sort = data.orderBy
                        data.asc = data.ascending === 1 ? 'true' : 'false'
                        data.size = data.limit
                        data.name = data.query

                        let url = `${tahitiUrl}/workflows`;
                        let headers = {}
                        return axios.get(url, {
                            params: data
                        }).then(resp => {
                            return { data: resp.data.data, count: resp.data.pagination.total };
                        }).catch(function (e) {
                            alert(e)
                        }.bind(this));
                    }
                }
            }
        },
        mounted() {
            let url = `${tahitiUrl}/platforms`;
            axios.get(url).then(resp => {
                this.platforms = resp.data;
            }).catch(function (e) {
                this.dispatch('error', e);
            }.bind(this));
            this.platform = this.$refs.listTable.customQueries['platform']
        },
        /* Methods */
        methods: {
            clearFilters() {
                this.$refs.listTable.setFilter('')
                this.$refs.listTable.customQueries = {}
                this.platform = ''
            }
        },
        watch: {
            platform(v) {
                Event.$emit('vue-tables.workflowList.filter::platform', v);
            }
        }
    }
</script>
<style>
    .row.border-primary {
        margin-bottom: 10px;
        padding: 15px 0;
    }
    .form-inline {
        width: 450px;
        float: left;
        display: block;
    }

    .form-inline>div {
        margin-right: 5px;
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