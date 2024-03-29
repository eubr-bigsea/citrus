<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{ $tc('titles.notification', 2) }}</h1>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <v-server-table ref="listTable" :columns="columns" :options="options"
                                        name="notificationList">
                                        <template #type="props">
                                            <span class="badge"
                                                :class="{ 'badge-success': props.row.type === 'INFO', 'badge-warning': props.row.type === 'WARNING', 'badge-danger': props.row.type === 'ERROR' }">
                                                &nbsp;{{ $t('titles.' + props.row.type.toLowerCase()).toUpperCase() }}
                                            </span>
                                        </template>
                                        <template #text="props">
                                            <span :class="{ 'font-weight-bold': props.row.status === 'UNREAD' }"
                                                v-html="props.row.text" />
                                        </template>
                                        <template #created="props">
                                            <div style="width:100px">{{ props.row.created | timeFromNow(user.locale) }}</div>
                                        </template>
                                        <template #actions="props">
                                            <div class="btn-group" role="group">
                                                <button class="btn btn-sm btn-danger " @click="remove(props.row.id)">
                                                    <font-awesome-icon icon="trash" />
                                                </button>
                                                <button v-if="props.row.status === 'UNREAD'"
                                                    class="btn btn-secondary btn-sm btn-success "
                                                    @click="markAsRead(props.row.id)">
                                                    <font-awesome-icon icon="check" />
                                                </button>
                                                <a v-if="props.row.link" :href="props.row.link"
                                                    class="btn btn-sm btn-light btn-outline-secondary ">
                                                    <font-awesome-icon icon="fa fa-external-link-alt" />
                                                </a>
                                            </div>
                                        </template>
                                    </v-server-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';
import { mapGetters } from 'vuex';
const thornUrl = import.meta.env.VITE_THORN_URL;

export default {
    mixins: [Notifier],
    data() {
        return {
            notifications: [],
            columns: ['type', 'text', 'created', 'actions'],
            showSideBar: false,
            options: {
                debounce: 800,
                skin: 'table-sm table table-hover',
                dateColumns: ['created'],
                headings: {
                    text: this.$tc('common.text'),
                    type: this.$tc('common.type'),
                    created: this.$tc('common.created'),
                    status: this.$tc('common.status'),
                    actions: this.$tc('common.action', 2)
                },
                sortable: ['created'],
                filterable: ['text', 'type', 'status'],
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ml-10',
                    up: 'sort-up',
                    down: 'sort-down'
                },
                preserveState: true,
                saveState: true,
                filterByColumn: false,
                requestFunction: function (data) {
                    const self = this;
                    data.sort = data.orderBy;
                    data.asc = data.ascending === 1 ? 'true' : 'false';
                    data.size = data.limit;
                    data.q = data.query;

                    data.fields = 'id,text,status,created,type,link';

                    this.$Progress.start();
                    return axios
                        .get(`${thornUrl}/notifications`, {
                            params: data
                        })
                        .then(resp => {
                            self.$Progress.finish();

                            return {
                                data: resp.data.data,
                                count: resp.data.pagination.total
                            };
                        })
                        .catch(
                            function (e) {
                                self.$Progress.finish();
                                self.$parent.error(e);
                            }.bind(this)
                        );
                },
                texts: {
                    filter: this.$tc('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
                },
            }
        };
    },
    computed: {
        ...mapGetters(['user']),
    },
    /* Methods */
    methods: {
        markAsRead(notificationId) {
            const self = this;
            const url = `${thornUrl}/notifications/${notificationId}`;
            axios
                .patch(url, { status: 'READ' })
                .then(() => {
                    self.$refs.listTable.refresh();
                })
                .catch(e => self.error(e));

        },
        remove(notificationId) {
            const self = this;
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    const url = `${thornUrl}/notifications/${notificationId}`;
                    axios
                        .delete(url, {})
                        .then(() => {
                            self.success(self.$t('messages.successDeletion',
                                { what: this.$tc('titles.notification', 1) }));
                            self.$refs.listTable.refresh();
                        })
                        .catch(e => self.error(e));
                }
            );

        }
    }
};
</script>