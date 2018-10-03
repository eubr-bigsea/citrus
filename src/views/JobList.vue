<template>
    <div>
        <div class="row border-bottom border-primary">
            <div class="col-md-10">
                <h2>{{$tc('titles.jobs', 2)}}</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <v-server-table :data="tableData" :columns="columns" :options="options" name="jobList">
                    <template slot="id" slot-scope="props">
                        <router-link :to="{name: 'showJob', params: {id: props.row.id}}">{{props.row.id}}</router-link>
                    </template>

                    <template slot="actions" slot-scope="props">
                        <button class="btn btn-sm danger">
                            <font-awesome-icon icon="trash"></font-awesome-icon>
                        </button>
                    </template>
                    <template slot="status" slot-scope="props">
                        <div :class="props.row.status.toLowerCase()">
                            {{props.row.status}}
                        </div>
                    </template>

                    <template slot="workflow" slot-scope="props">
                        <router-link :to="{name: 'editWorkflow', params: {'id': props.row.workflow.id}}">
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
    let standUrl = process.env.VUE_APP_STAND_URL
    export default {
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

                        return axios.get(`${standUrl}/jobs`,
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

        },
    }
</script>
<style scoped>
    .completed, .running, .canceled, .interrupted, .waiting, .error {
        color: white;
        font-size: .7em;
        padding: 4px;
    }
    .completed {
        background-color: #2ECC40;
    }

    .running {
        background-color:#0074D9;
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
</style>