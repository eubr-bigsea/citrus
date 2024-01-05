<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="row border-bottom border-primary p-2">
                        <div class="col-md-10">
                            <h2 class="title text-primary">
                                {{$t('titles.jobs', 2)}}
                            </h2>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <v-server-table ref="jobList" :data="tableData" :columns="columns" :options="options"
                                            name="jobList">
                                <template #platforms="props">
                                    {{props.row.platforms.map(plat => plat.name).join(", ")}}
                                </template>
                                <template #enabled="props">
                                    <div class="xtext-center">
                                        <font-awesome-icon v-if="props.row.enabled" icon="fa fa-check-square" />
                                        <font-awesome-icon v-if="!props.row.enabled" icon="fa fa-square" />
                                    </div>
                                </template>
                            </v-server-table>
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
let tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const FIELDS = ['id', 'slug', 'name', 'platforms.name', 'enabled'];
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
                    status: 'th-5 text-center'
                },
                headings: {
                    id: 'ID',
                    actions: this.$t('common.action', 2),
                    name: this.$t('common.name'),
                    'user.name': this.$t('common.user.name'),
                    'platforms.name': this.$t('titles.platform', 2)
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
            data.fields = FIELDS.join(',');
            data.disabled = 1;
            this.$Progress.start();
            return axios
                .get(`${tahitiUrl}/operations`, {
                    params: data
                })
                .then(resp => {
                    this.$Progress.finish();
                    return { data: resp.data.data, count: resp.data.pagination.total };
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );
        },
        remove(job) {
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    this.$Progress.start();
                    axios
                        .delete(`${tahitiUrl}/jobs/${job.id}`, {})
                        .then(() => {
                            this.success(
                                this.$t('messages.successDeletion', {
                                    what: this.$t('titles.job')
                                })
                            );
                            this.$refs.jobList.refresh();
                            this.$Progress.finish();
                        })
                        .catch(
                            function (e) {
                                this.$Progress.finish();
                                this.dispatch('error', e);
                            }.bind(this)
                        );
                }
            );
        }
    }
};
</script>
<style scoped>
.slide-leave-active,
.slide-enter-active {
    transition: 0.5s;
}

.slide-enter {
    transform: translate(0, 100%);
}

.slide-leave-to {
    transform: translate(0, -100%);
}
</style>