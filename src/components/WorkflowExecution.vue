<template>
    <v-server-table :data="jobs" :columns="columns" :options="options" name="jobList" ref="jobList">
        <template slot="id" slot-scope="props">
            <router-link :to="{name: 'jobDetail', params: {id: props.row.id}}">{{props.row.id}}</router-link>
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
    </v-server-table>
</template>
<script>
    import Vue from 'vue'
    import axios from 'axios'
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import Notifier from '../mixins/Notifier'

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    const standUrl = process.env.VUE_APP_STAND_URL

    export default {
        mixins: [Notifier],
        data() {
            return {
                jobs: [],
                jobsTotal: 0,
                initialSort: true, // in order to force sorting by id desc
                columns: ['status', 'id', 'created'],
                options: {
                    columnsClasses: {
                        name: 'th-20',
                        description: 'th-20',
                        actions: 'th-5 text-center',
                        status: 'th-5 text-center',
                    },
                    descOrderColumns: ['id'],
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
                    requestFunction: this.load,
                    filterable: [],
                    perPageValues: [],
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
        props: {
            workflowId: null,
        },
        mounted() {
            // this.load({});
        },
        methods: {
            load(params) {
                this.$Progress.start();
                params.sort = params.orderBy
                params.asc = params.ascending === 1 ? 'true' : 'false'
                if (this.initialSort) {
                    params.asc = false;
                    this.initialSort = false;
                }
                params.size = params.limit
                params.name = params.query
                params.workflow_id = this.workflowId
                params.fields = "id,created,status"

                return axios.get(`${standUrl}/jobs`, { params })
                    .then(resp => {
                        this.$Progress.finish();
                        return { data: resp.data.data, count: resp.data.pagination.total };
                    }).catch(function (e) {
                        this.error(e);
                    }.bind(this));
            },
        }

    }
</script>