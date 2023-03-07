<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="row">
                        <div class="title col-md-2">
                            <h1>{{ $t('titles.dataSource', 1) }}</h1>
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

                                    <!-- <v-server-table ref="validationList" :columns="columns" :options="options" name="validationList"> -->
                                    <v-client-table ref="validationList" :data="validations" :columns="columns" :options="options" name="validationList">
                                        <template #name="props">
                                            {{props.row.name}}
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
                                            <!-- also create this one in the messages.js
                                            <label>{{$tc('common.situation')}}</label> -->
                                            <label>Situação</label>
                                            <select v-model="situation" class="form-control">
                                                <option />
                                                <option v-for="sit in situations" :key="sit.id" :value="sit.slug">
                                                    {{sit.name}}
                                                </option>
                                            </select>

                                            <button type="button" class="btn btn-sm btn-light btn-outline-secondary ml-2"
                                                    @click="clearFilters">
                                                {{$t('actions.clearFilters')}}
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
                                    <!-- </v-server-table> -->
                                    </v-client-table>
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
            situation: '',
            situations: [],
            validations: [],
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
                    name: this.$t('common.name'),
                    status: this.$t('common.status'),
                    // create this messages in the messages.js
                    // last_executed: this.$tc('common.last_executed'),
                    // situation: this.$tc('common.situation'),
                    // schedule: this.$tc('common.schedule'),
                    last_executed: 'Última execução',
                    situation: 'Situação',
                    schedule: 'Agendamento',
                    actions: this.$t('common.action', 2),
                },
                sortable: ['name', 'last_executed'],
                filterable: ['name'],
                sortIcon: {
                    base: 'fa fas',
                    is: 'fa-sort ml-10',
                    up: 'fa-sort-amount-up',
                    down: 'fa-sort-amount-down'
                },
                preserveState: true,
                saveState: true,
                // customFilters: ['situation'],
                customFilters: [{
                    name: 'situation',
                    callback: function (row, query) {
                        return row.name[0] == query;
                    }
                }],
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
                    filter: this.$t('common.filter'),
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
        situation(query) {
            // // This doesnt work
            // Event.$emit('vue-tables.validationList.filter::situation', v);
            // Event.$emit('vue-tables.filter::situation', v);

            // // This works, but it uses internal details of component
            // const table = this.$refs.validationList;
            // table.customQueries['situation'] = v;
            // //table.updateState('customQueries', table.customQueries);
            // table.getData();
            
            // Also not working 
            Event.$emit('vue-tables.filter::situation', query);
        }
    },
    // async mounted() {
    //     let url = `${limoneroUrl}/situations`;
    //     this.$Progress.start();
    //     try {
    //         const resp = await axios.get(url);
    //         this.situations = resp.data.data;
    //     } catch (e) {
    //         this.error(e);
    //     } finally {
    //         this.$Progress.finish();
    //     }
    //     this.situation = this.$refs.validationList.customQueries['situation'];
    // },
    mounted() {
        this.validations = this.loadData();
        this.load();
    },
    methods: {
        async load() {
            const resp = await axios.get(
                `${limoneroUrl}/datasources/${this.$route.params.id}`);
            this.dataSource = resp.data;
        },
        loadData() {
            let validations = [
                {
                    'id': '1000' , 'name': 'Validação 1', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite'
                },
                {
                    'id': '1001' , 'name': 'Validação 2', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Falha',
                    'schedule' : 'Todo dia, 9h da noite'
                },
                {
                    'id': '1002' , 'name': 'Validação 3', 'status': 'Desabilitado',
                    'last_executed': '', 'situation': 'Falha',
                    'schedule' : 'Todo dia, 9h da noite'
                },
                {
                    'id': '1003' , 'name': 'Validação 4', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite'
                },
                {
                    'id': '1300' , 'name': 'Validação 5', 'status': 'Desabilitado',
                    'last_executed': '', 'situation': 'Falha',
                    'schedule' : 'Todo dia, 9h da noite'
                },
                {
                    'id': '2000' , 'name': 'Validação 6', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Falha',
                    'schedule' : 'Todo dia, 9h da noite'
                },
                {
                    'id': '1004' , 'name': 'Validação 7', 'status': 'Desabilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite'
                },
                {
                    'id': '1005' , 'name': 'Validação 8', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite'
                },
                {
                    'id': '1006' , 'name': 'Validação 19', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite'
                },
                {
                    'id': '1007' , 'name': 'Validação 20', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite'
                },
                {
                    'id': '1010' , 'name': 'Validação 11', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Falha',
                    'schedule' : 'Todo dia, 9h da noite'
                },
            ];
            return validations;
        },
        clearFilters() {
            this.$refs.validationList.setFilter('');
            this.$refs.validationList.customQueries = {};
            this.situation = '';
        },
        edit(validationId) {

        },
        remove(validationId) {
            // const self = this;
            // this.confirm(
            //     this.$t('actions.delete'),
            //     this.$t('messages.doYouWantToDelete'),
            //     () => {
            //         const url = `${limoneroUrl}/validations/${validationId}`;
            //         axios
            //             .delete(url, {})
            //             .then(() => {
            //                 self.success(self.$t('messages.successDeletion',
            //                     { what: this.$tc('titles.validation', 1) }));
            //                 self.$refs.validationList.refresh();
            //             })
            //             .catch(e => self.error(e));
            //     }
            // );
        },
        execute(validationId) {

        },
    },
}
</script>