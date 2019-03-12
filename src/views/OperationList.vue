<template>
    <div>
        <div class="row border-bottom border-primary p-2">
            <div class="col-md-10">
                <h2 class="title text-primary">{{$tc('titles.jobs', 2)}}</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <v-server-table :data="tableData" :columns="columns" :options="options" name="jobList" ref="jobList">
                    <!--
                    <template slot="id" slot-scope="props">
                        <router-link :to="{name: 'jobDetail', params: {platform: props.row.workflow.platform.id, id: props.row.id}}">{{props.row.id}}</router-link>
                    </template>
                    <template slot="name" slot-scope="props">
                        <router-link :to="{name: 'jobDetail', params: {platform: props.row.workflow.platform.id, id: props.row.id}}">{{props.row.name}}</router-link>
                    </template>
                    <template slot="actions" slot-scope="props">
                        <button class="btn btn-sm danger" @click="remove(props.row)" :title="$t('actions.delete')">
                            <font-awesome-icon icon="trash"></font-awesome-icon>
                        </button>
                    </template>
                    <template slot="status" slot-scope="props">
                        <div class="lemonade-job" :class="props.row.status.toLowerCase()">
                            {{props.row.status}}
                        </div>
                    </template>
                    <template slot="created" slot-scope="props">
                        {{props.row.created | formatJsonDate}}
                    </template>
                    <template slot="workflow" slot-scope="props">
                        <router-link :to="{name: 'editWorkflow', params: {'id': props.row.workflow.id, platform: props.row.workflow.platform.id}}">
                            {{props.row.workflow.id}} - {{props.row.workflow.name}}
                        </router-link>
                    </template>
            -->
                    <template slot="platforms.name" slot-scope="props">
                        {{props.row.platforms.map(plat => plat.name).join(", ")}}
                    </template>
                    <template slot="enabled" slot-scope="props">
                        <div class="xtext-center">
                            <span v-if="props.row.enabled" class="fa fa-check-square"></span>
                            <span v-if="!props.row.enabled" class="fa fa-square"></span>
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
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL
    const FIELDS = ['id', 'slug', 'name', 'platforms.name', 'enabled']
    export default {
        mixins: [Notifier],
        data() {
            return {
                columns: FIELDS,
                tableData: [],
                showSideBar: false,
                options: {
                    columnsClasses: {
                        name: 'th-20',
                        description: 'th-20',
                        actions: 'th-5 text-center',
                        status: 'th-5 text-center',
                    },
                    headings: {
                        id: 'ID',
                        actions: this.$tc('common.action', 2),
                        name: this.$tc('common.name'),
                        'user.name': this.$t('common.user.name'),
                        'platforms.name': this.$tc('titles.platform', 2),
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
                    requestFunction: this.load,
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
        /* Methods */
        methods: {
            load(data) {
                data.sort = data.orderBy
                data.asc = data.ascending === 1 ? 'true' : 'false'
                data.size = data.limit;
                data.name = data.query;
                data.fields = FIELDS.join(",");
                data.disabled = 1
                this.$Progress.start();
                return axios.get(`${tahitiUrl}/operations`,
                    {
                        params: data
                    }).then(resp => {
                        this.$Progress.finish();
                        return { data: resp.data.data, count: resp.data.pagination.total };
                    }).catch(function (e) {
                        this.error(e);
                    }.bind(this));
            },
            remove(job) {
                this.confirm(this.$t('actions.delete'), this.$t('messages.doYouWantToDelete'), () => {
                    this.$Progress.start();
                    axios.delete(`${tahitiUrl}/jobs/${job.id}`, {}).then(resp => {
                        this.success(this.$t('messages.successDeletion',
                            { what: this.$t('titles.job') }));
                        this.$refs.jobList.refresh();
                        this.$Progress.finish();
                    }).catch(function (e) {
                        this.$Progress.finish()
                        this.dispatch('error', e);
                    }.bind(this));
                })
            }
        }
    }
</script>
<style scoped>
    .slide-leave-active,
    .slide-enter-active {
        transition: .5s;
    }

    .slide-enter {
        transform: translate(0, 100%);
    }

    .slide-leave-to {
        transform: translate(0, -100%);
    }
</style>