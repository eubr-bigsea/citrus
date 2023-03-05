<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="row">
                        <div class="title col-md-2">
                            <h1>{{ $tc('titles.dataSource', 1) }}</h1>
                        </div>

                        <div class="col-md-4">
                            <div class="row d-flex align-items-center text-secondary bg-light border rounded mx-1 p-2">
                                {{ dataSource.name }}
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-2">
                            <data-source-options selected="dataSourceValidation" />
                        </div>
                        <div class="col-md-10">
                            <div class="card">
                                <div class="card-body">
                                    <div>X validações falhando</div>

                                    <v-server-table ref="ValidationList" :columns="columns" :options="options" name="ValidationList">
                                        <template #name="props">
                                            <small v-if="props.row.description" class="break-word"><br>{{props.row.description}}</small>
                                        </template>
                                        <template #status="props">
                                            {{props.row.status}}
                                        </template>
                                        <template #last_executed="props">
                                            {{props.row.last_executed |
                                                formatJsonDate}}
                                        </template>
                                        <template #situation="props">
                                            {{props.row.situation}}
                                        </template>
                                        <template #schedule="props">
                                            {{props.row.schedule}}
                                        </template>

                                        <div slot="afterFilter" class="ml-2">
                                            <label>{{$tc('common.situation')}}</label>
                                            <select v-model="situation" class="form-control">
                                                <option />
                                                <option v-for="sit in situations" :key="sit.name" :value="sit.slug">
                                                    {{sit.name}}
                                                </option>
                                            </select>

                                            <button type="button" class="btn btn-sm btn-light btn-outline-secondary ml-2"
                                                    @click="clearFilters">
                                                {{$tc('actions.clearFilters')}}
                                            </button>
                                        </div>
                                        
                                        <template #actions="props">
                                            <button class="btn btn-sm btn-primary" @click="edit(props.row.name)">
                                                <font-awesome-icon icon="fa fa-edit" />
                                            </button>
                                            <button class="btn btn-sm btn-danger" @click="remove(props.row.name)">
                                                <font-awesome-icon icon="fa fa-trash" />
                                            </button>
                                            <button class="btn btn-sm btn-info" @click="execute(props.row.name)">
                                                <font-awesome-icon icon="fa fa-play" />
                                            </button>
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
import Notifier from '../../mixins/Notifier.js';
import DataSourceOptions from '../../components/data-source/DataSourceOptions.vue';

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    mixins: [Notifier],
    components: {
        DataSourceOptions
    },
    data() {
        return {
            dataSource: null,
            status: '',
            statuses: [],
            columns: [
                'name',
                'status',
                'last_executed',
                'situation',
                'schedule',
                'actions'
            ],
            options: {
                debounce: 800,
                skin: 'table-sm table table-hover',
                dateColumns: ['last_executed'],
                columnClasses: { actions: 'th-10' },
                headings: {
                    name: this.$tc('common.name'),
                    status: this.$tc('common.status'),
                    last_executed: this.$tc('common.last_executed'),
                    situation: this.$tc('common.situation'),
                    schedule: this.$tc('common.schedule'),
                    actions: this.$tc('common.action', 2),
                },
                sortable: ['name', 'last_executed'],
                filterable: ['name', 'status'],
                sortIcon: {
                    base: 'fa fas',
                    is: 'fa-sort ml-10',
                    up: 'fa-sort-amount-up',
                    down: 'fa-sort-amount-down'
                },
                preserveState: true,
                saveState: true,
                customFilters: ['status'],
                filterByColumn: false,
                // requestFunction: function (data) {
                //     data.sort = data.orderBy;
                //     data.asc = data.ascending === 1 ? 'true' : 'false';
                //     data.size = data.limit;
                //     data.name = data.query;

                //     data.fields = 'name,status,last_executed,situation,schedule';

                //     let url = `${limoneroUrl}/validations?enabled=1&types=VALIDATION`;
                //     this.$Progress.start();
                //     return axios
                //         .get(url, {
                //             params: data
                //         })
                //         .then(resp => {
                //             this.$Progress.finish();
                //             return {
                //                 data: resp.data.data,
                //                 count: resp.data.pagination.total
                //             };
                //         })
                //         .catch(
                //             function (e) {
                //                 this.$Progress.finish();
                //                 this.error(e);
                //             }.bind(this)
                //         );
                // },
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
    watch: {
        status(v) {
            // This works, but it uses internal details of component
            const table = this.$refs.validationList;
            table.customQueries['status'] = v;
            //table.updateState('customQueries', table.customQueries);
            table.getData();
        }
    },
    // async mounted() {
    //     let url = `${limoneroUrl}/statuses`;
    //     this.$Progress.start();
    //     try {
    //         const resp = await axios.get(url);
    //         this.statuses = resp.data.data;
    //     } catch (e) {
    //         this.error(e);
    //     } finally {
    //         this.$Progress.finish();
    //     }
    //     this.status = this.$refs.validationList.customQueries['status'];
    // },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            const resp = await axios.get(
                `${limoneroUrl}/datasources/${this.$route.params.id}`);
            this.dataSource = resp.data;
        },
        clearFilters() {
            this.$refs.validationList.setFilter('');
            this.$refs.validationList.customQueries = {};
            this.status = '';
        },
        edit(validationName) {

        },
        remove(validationName) {
            const self = this;
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    const url = `${limoneroUrl}/validations/${validationName}`;
                    axios
                        .delete(url, {})
                        .then(() => {
                            self.success(self.$t('messages.successDeletion',
                                { what: this.$tc('titles.validation', 1) }));
                            self.$refs.validationList.refresh();
                        })
                        .catch(e => self.error(e));
                }
            );
        },
        execute(validationName) {

        },
    },
}
</script>