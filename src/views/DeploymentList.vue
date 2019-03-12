<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <h1>{{$tc('titles.deployment', 2)}}</h1>
            <router-link :to="{name: 'addDeployment'}" class="btn btn-sm btn-outline-primary">
                {{$t('actions.addItem')}}
            </router-link>
        </div>
        <hr />
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <v-server-table :data="tableData" :columns="columns" :options="options" name="deploymentList"
                            ref="deploymentList">
                            <template slot="id" slot-scope="props">
                                <router-link :to="{name: 'editDeployment', params: {id: props.row.id}}">{{props.row.id}}</router-link>
                            </template>
                            <template slot="workflow" slot-scope="props">
                                {{props.row.workflow.id}} - {{props.row.workflow.name}}
                            </template>
                            <template slot="actions" slot-scope="props">
                                <button class="btn btn-sm danger mr-1" @click="remove(props.row.id)" :title="$t('actions.delete')">
                                    <font-awesome-icon icon="trash"></font-awesome-icon>
                                </button>
                                <button class="btn btn-sm mr-1" @click="restart(props.row)" :title="$t('actions.restart')">
                                    <span class="fa fa-sync-alt"></span>
                                </button>
                                <button class="btn btn-sm mr-1" @click="stop(props.row)" :title="$t('actions.stop')">
                                    <span class="fa fa-stop"></span>
                                </button>
                                <button class="btn btn-sm mr-1" @click="start(props.row)" :title="$t('actions.stop')">
                                    <span class="fa fa-play"></span>
                                </button>
                            </template>
                            <template slot="target" slot-scope="props">
                                <div v-if="props.row.target">
                                    {{props.row.target.name}} ({{props.row.target.target_type}})
                                </div>
                            </template>
                            <template slot="updated" slot-scope="props">
                                {{props.row.updated | formatJsonDate}}
                            </template>
                        </v-server-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Notifier from '../mixins/Notifier'
    let seedUrl = process.env.VUE_APP_SEED_URL
    export default {
        mixins: [Notifier],
        data() {
            return {
                columns: ['id', 'workflow', 'target', 'updated', 'user.name', 'actions',],
                tableData: [],
                showSideBar: false,
                options: {
                    skin: 'table-sm table table-striped',
                    columnsClasses: {
                        name: 'th-20',
                        description: 'th-20',
                        actions: 'th-10 text-center'
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
                        description: this.$tc('common.description', 1),
                        target: this.$tc('deployment.target', 1),
                        created: this.$t('common.created'),
                        'user.name': this.$t('common.user.name'),
                    },
                    sortable: ['name', 'id', 'created'],
                    sortIcon: {
                        base: 'fa fas',
                        is: 'fa-sort ml-10',
                        up: 'fa-sort-up',
                        down: 'fa-sort-down'
                    },
                    preserveState: true,
                    saveState: true,
                    filterable: ['name', 'album'],
                    requestFunction: function (data) {
                        const self = this;
                        data.sort = data.orderBy
                        data.asc = data.ascending === 1 ? 'true' : 'false'
                        data.size = data.limit
                        this.$Progress.start();
                        return axios.get(`${seedUrl}/deployments`,
                            {
                                params: data
                            }).then(resp => {
                                this.$Progress.finish();
                                return { data: resp.data.data, count: resp.data.pagination.total };
                            }).catch(function (e) {
                                this.$Progress.finish();
                                self.$parent.error(e);
                            }.bind(this));
                    }
                }
            }
        },
        /* Methods */
        methods: {
            reload(deploymentId) {
                this.warn('Under development')
            },
            stop(deploymentId) {
                this.warn('Under development')
            },
            start(deploymentId) {
                this.warn('Under development')
            },
            remove(deploymentId) {
                const self = this;
                this.confirm(
                    this.$t('actions.delete'),
                    this.$t('messages.doYouWantToDelete'),
                    () => {
                        const url = `${seedUrl}/deployments/${deploymentId}`
                        axios.delete(url, {})
                            .then((resp) => {
                                self.$refs.deploymentList.refresh();
                            }).catch((e) => self.error(e))
                    });
            }
        },
    }
</script>
<style scoped>

</style>