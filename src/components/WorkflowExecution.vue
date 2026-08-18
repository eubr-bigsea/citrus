<template>
    <b-modal ref="modal" size="xl" :ok-only="true" scrollable
             :title="$t('titles.job', 2)" :hide-footer="true">
        <v-server-table ref="jobList" :columns="columns" :options="options" name="jobListWf">
            <template #id="props">
                <router-link :to="{ name: 'jobDetail', params: { id: props.row.id } }">
                    {{props.row.id}}
                </router-link>
            </template>
            <template #actions="props">
                <button class="btn btn-sm danger" :title="$t('actions.delete')" @click="remove(props.row)">
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
        </v-server-table>
    </b-modal>
</template>
<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';

const standUrl = import.meta.env.VITE_STAND_URL;

export default {
    mixins: [Notifier],
    props: {
        workflowId: { type: Number, default: null },

    },
    emits: ['loaded'],
    data() {
        return {
            columns: ['status', 'id', 'name', 'created'],
            options: {
                skin: 'table table-hover',
                columnsClasses: {
                    name: 'th-20',
                    description: 'th-20',
                    actions: 'th-5 text-center',
                    status: 'th-5 text-center',
                },
                descOrderColumns: ["id", "created"],
                headings: {
                    id: 'ID',
                    created: this.$t('common.created'),
                    actions: this.$t('common.action', 2),
                    name: this.$t('common.name'),
                    'user.name': this.$t('common.user.name'),
                },
                sortable: ['name', 'id', 'created'],
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ms-10',
                    up: 'sort-up',
                    down: 'sort-down'
                },
                requestFunction: this.load,
                filterable: false,
                perPageValues: [],
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
    methods: {
        show() {
            this.$refs.modal.show();
        },
        async load(params) {
            const self = this;
            params.sort = params.orderBy;
            params.asc = (params.ascending === 1 && params.orderBy) ? 'true' : 'false';
            params.size = params.limit;
            params.name = params.query;
            params.workflow_id = this.workflowId;
            params.fields = "id,name,created,status";
            try {
                const resp = await axios.get(`${standUrl}/jobs`, { params });
                self.$emit('loaded', resp.data.pagination.total);
                return { data: resp.data.data, count: resp.data.pagination.total };
            } catch (e) {
                this.error(e);
            }
        },
    }

};
</script>
