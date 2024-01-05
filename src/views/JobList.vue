<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1>{{$t('titles.jobs', 2)}}</h1>
        </div>
        <div class="card">
            <div class="card-body">
                <v-server-table ref="jobList" :data="tableData" :columns="columns" :options="options"
                                name="jobList">
                    <template #id="props">
                        <router-link v-if="props.row.type !== 'MODEL_BUILDER'"
                                     :to="{name: 'jobDetail', params: {platform: props.row.workflow.platform.id, id: props.row.id}}">
                            {{props.row.id}}
                        </router-link>
                        <span v-else>{{props.row.id}}</span>
                    </template>
                    <template #name="props">
                        <router-link v-if="props.row.type !== 'MODEL_BUILDER'"
                                     :to="{name: 'jobDetail', params: {platform: props.row.workflow.platform.id, id: props.row.id}}">
                            {{props.row.name}}
                        </router-link>
                        <span v-else>{{props.row.name}}</span>
                    </template>
                    <template #actions="props">
                        <button v-if="props.row.status === 'RUNNING' || props.row.status === 'PENDING' || props.row.status === 'WAITING' "
                                class="btn btn-sm btn-outline-danger mr-1" :title="$t('actions.stop')"
                                @click="stop(props.row)">
                            <font-awesome-icon icon="stop" />
                        </button>

                        <button class="btn btn-sm btn-danger" :title="$t('actions.delete')" @click="remove(props.row)">
                            <font-awesome-icon icon="trash" />
                        </button>
                    </template>
                    <template #status="props">
                        <div class="lemonade-job" :class="props.row.status.toLowerCase()">
                            {{props.row.status}}
                        </div>
                    </template>
                    <template #created="props">
                        {{$filters.formatJsonDate(props.row.created)}}
                    </template>
                    <template #workflow="props">
                        <router-link v-if="props.row.type !== 'MODEL_BUILDER'"
                                     :to="{name: 'editWorkflow', params: {'id': props.row.workflow.id, platform: props.row.workflow.platform.id}}">
                            {{props.row.workflow.id}} - {{props.row.workflow.name}}
                        </router-link>
                        <router-link v-else :to="{name: 'model-design', params: {'id': props.row.workflow.id}}">
                            {{props.row.workflow.id}} - {{props.row.workflow.name}}
                        </router-link>
                    </template>
                </v-server-table>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';

let standUrl = import.meta.env.VITE_STAND_URL;

export default {
    mixins: [Notifier],
    data() {
        return {
            columns: [
                'status',
                'id',
                'name',
                'workflow',
                'created',
                'user.name',
                'actions'
            ],
            tableData: [],
            showSideBar: false,
            options: {
                skin: 'table-sm table table-hover',
                columnsClasses: {
                    name: 'th-20',
                    description: 'th-20',
                    actions: 'th-5 text-center',
                    status: 'th-5 text-center'
                },
                headings: {
                    id: 'ID',
                    created: this.$t('common.created'),
                    actions: this.$t('common.action', 2),
                    name: this.$t('common.name'),
                    'user.name': this.$t('common.user.name')
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
                requestFunction: this.load,
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
    /* Methods */
    methods: {
        load(data) {
            data.sort = data.orderBy;
            data.asc = data.ascending === 1 ? 'true' : 'false';
            data.size = data.limit;
            data.name = data.query;
            return axios
                .get(`${standUrl}/jobs`, {
                    params: data
                })
                .then(resp => {
                    return { data: resp.data.data, count: resp.data.pagination.total };
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );
        },
        stop(job) {
            this.confirm(
                this.$t('actions.stop'),
                this.$t('messages.doYouWantToStop'),
                () => {
                    axios
                        .post(`${standUrl}/jobs/${job.id}/stop`, {})
                        .then(() => {
                            this.success(
                                this.$t('messages.successStop', {
                                    what: this.$t('titles.job', 1)
                                })
                            );
                            this.$refs.jobList.getData();
                        })
                        .catch(
                            function (e) {
                                this.dispatch('error', e);
                            }.bind(this)
                        );
                }
            );
        },
        remove(job) {
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    axios
                        .delete(`${standUrl}/jobs/${job.id}`, {})
                        .then(() => {
                            this.success(
                                this.$t('messages.successDeletion', {
                                    what: this.$t('titles.job', 1)
                                })
                            );
                            this.$refs.jobList.getData();
                        })
                        .catch(
                            function (e) {
                                this.dispatch('error', e);
                            }.bind(this)
                        );
                }
            );
        }
    }
};
</script>