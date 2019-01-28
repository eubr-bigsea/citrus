<template>
    <div>
        <div class="row border-bottom border-primary p-2">
            <div class="col-md-10">
                <h2 class="title text-primary">{{$tc('titles.workflow', 2)}}</h2>
            </div>
            <div class="col-md-2 pull-right text-right">
                <a href="#/workflows/add" class="btn btn-primary btn-sm" role="button">
                    <font-awesome-icon icon="plus" size="1x"></font-awesome-icon> {{$t('actions.add', {type:
                    $tc('titles.workflow').toLowerCase()})}}
                </a>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <v-server-table :columns="columns" :options="options" ref="workflowList" name="workflowList">
                    <template slot="id" slot-scope="props">
                        <router-link :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">{{props.row.id}}</router-link>
                    </template>
                    <template slot="name" slot-scope="props">
                        <router-link :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">{{props.row.name}}</router-link>
                    </template>

                    <template slot="platform" slot-scope="props">
                        {{props.row.platform.name}}
                    </template>
                    <template slot="user_name" slot-scope="props">
                        {{props.row.user.name}}
                    </template>
                    <template slot="created" slot-scope="props">
                        {{props.row.created | formatJsonDate}}
                    </template>
                    <template slot="updated" slot-scope="props">
                        {{props.row.updated | formatJsonDate}}
                    </template>
                    <div slot="afterFilter">
                        <label>{{$tc('common.platform')}}:</label>
                        <select class="form-control" v-model="platform">
                            <option></option>
                            <option v-for="p in platforms" v-bind:value="p.slug" v-bind:key="p.id">{{p.name}}</option>
                        </select>
                        <button type="button" class="ml-1 btn btn-sm btn-success" @click="clearFilters">{{$tc('actions.clearFilters')}}</button>
                    </div>
                    <template slot="actions" slot-scope="props">
                        <button class="btn btn-sm danger mr-2">
                            <font-awesome-icon icon="trash" @click="remove(props.row.id)"></font-awesome-icon>
                        </button>
                    </template>
                </v-server-table>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { Event } from 'vue-tables-2'
    import Notifier from '../mixins/Notifier'
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL
    export default {
        mixins: [Notifier],
        data() {
            return {
                platform: '',
                platforms: [],
                columns: ['id', 'name', 'created', 'updated', 'platform', 'user_name', 'version', 'actions'],
                showSideBar: false,
                options: {
                    skin: 'table-sm table table-striped',
                    dateColumns: ['created', 'updated'],
                    columnClasses: {actions: 'th-10'},
                    headings: {
                        id: 'ID',
                        name: this.$tc('common.name'),
                        created: this.$tc('common.created'),
                        updated: this.$tc('common.updated'),
                        platform: this.$tc('common.platform'),
                        user_name: this.$tc('common.user.name'),
                        version: this.$tc('common.version'),
                        actions: this.$tc('common.action', 2),
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

                        data.fields = 'id,name,platform,created,updated,user,version';

                        let url = `${tahitiUrl}/workflows?enabled=1`;
                        let headers = {}
                        this.$Progress.start()
                        return axios.get(url, {
                            params: data
                        }).then(resp => {
                            this.$Progress.finish()
                            return { data: resp.data.data, count: resp.data.pagination.total };
                        }).catch(function (e) {
                            this.$Progress.finish()
                            this.error(e);
                        }.bind(this));
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
            }
        },
        mounted() {
            let url = `${tahitiUrl}/platforms`;
            this.$Progress.start();
            axios.get(url).then(resp => {
                this.platforms = resp.data.sort((a, b) => a.name.localeCompare(b.name));
            }).catch(function (e) {
                this.error(e);
            }.bind(this)).finally(() => {
                this.$Progress.finish()
            });
            this.platform = this.$refs.workflowList.customQueries['platform']
        },
        /* Methods */
        methods: {
            clearFilters() {
                this.$refs.workflowList.setFilter('')
                this.$refs.workflowList.customQueries = {}
                this.platform = ''
            },
            remove(workflowId) {
                const self = this;
                this.confirm(
                    this.$t('actions.delete'),
                    this.$t('messages.doYouWantToDelete'),
                    () => {
                        const url = `${tahitiUrl}/workflows/${workflowId}`
                        axios.delete(url, { })
                            .then((resp) => {
                                self.$refs.workflowList.refresh();
                            }).catch((e) => self.error(e))
                    });
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
        width: 650px;
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
        float: left;
        margin-right: 5px
    }
</style>