<template>
    <div>
        <div class="row border-bottom border-primary">
            <div class="col-md-10">
                <h2>{{$tc('titles.jobs', 2)}}</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <v-server-table :data="tableData" :columns="columns" :options="options" name="jobList" ref="jobList">
                    <template slot="id" slot-scope="props">
                        <router-link :to="{name: 'jobDetail', params: {id: props.row.id}}">{{props.row.id}}</router-link>
                    </template>
                    <template slot="name" slot-scope="props">
                        <router-link :to="{name: 'jobDetail', params: {id: props.row.id}}">{{props.row.name}}</router-link>
                    </template>
                    <template slot="actions" slot-scope="props">
                        <button class="btn btn-sm danger" @click="remove(props.row)" :title="$t('actions.delete')">
                            <font-awesome-icon icon="trash"></font-awesome-icon>
                        </button>
                    </template>
                    <template slot="status" slot-scope="props">
                        <div :class="props.row.status.toLowerCase()">
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
                </v-server-table>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Notifier from '../mixins/Notifier'
    let standUrl = process.env.VUE_APP_STAND_URL
    export default {
        mixins: [Notifier],
        data() {
            return {
                columns: ['actions', 'status',
                    'id', 'name', 'workflow',
                    'created', 'user.name'
                ],
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
                        created: this.$t('common.created'),
                        actions: this.$tc('common.action', 2),
                        name: this.$tc('common.name'),
                        'user.name': this.$t('common.user.name'),
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
                    requestFunction: this.load
                }
            }
        },
        /* Methods */
        methods: {
            load(data) {
                data.sort = data.orderBy
                data.asc = data.ascending === 1 ? 'true' : 'false'
                data.size = data.limit
                data.name = data.query

                return axios.get(`${standUrl}/jobs`,
                    {
                        params: data
                    }).then(resp => {
                        return { data: resp.data.data, count: resp.data.pagination.total };
                    }).catch(function (e) {
                        this.dispatch('error', e);
                    }.bind(this));
            },
            remove(job) {
                this.confirm(this.$t('actions.delete'), this.$t('messages.doYouWantToDelete'), () => {
                    axios.delete(`${standUrl}/jobs/${job.id}`, {}).then(resp => {
                        this.success(this.$t('messages.successDeletion',
                            { what: this.$t('titles.job') }));
                        this.$refs.jobList.refresh();
                    }).catch(function (e) {
                        this.dispatch('error', e);
                    }.bind(this));
                })
            }
        }
    }
</script>
<style scoped>
    .completed,
    .running,
    .canceled,
    .interrupted,
    .waiting,
    .error {
        color: white;
        font-size: .7em;
        padding: 4px;
    }

    .completed {
        background-color: #2ECC40;
    }

    .running {
        background-color: #0074D9;
    }

    .interrupted {
        background-color: #111;
    }

    .canceled {
        background-color: #aaa;
    }

    .waiting {
        background-color: #FFDC00;
        color: black;
    }

    .error {
        background-color: #FF4136;
    }

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