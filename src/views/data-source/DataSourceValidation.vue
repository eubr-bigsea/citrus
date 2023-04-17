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
                        
                        <div class="col-md-6">
                            <div class="row d-flex flex-row-reverse mx-1">
                                <button class="btn btn-primary btn-lemonade-primary" @click.prevent="add">
                                    <font-awesome-icon icon="fa fa-plus" />
                                    {{$t('actions.addItem')}}
                                </button>
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
                                    <h4 v-if="failedValidations() > 0" class="text-danger">{{ failedValidations() }} de {{ totalValidations() }} validações falhando</h4>
                                    <h4 v-else-if="failedValidations() === 0" class="text-success">Todas as {{ totalValidations() }} validações passando</h4>

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
                                            <p v-if="props.row.situation === 'Sucesso'" class="text-success">{{props.row.situation}}</p>
                                            <p v-else-if="props.row.situation === 'Falha'" class="text-danger">{{props.row.situation}}</p>
                                        </template>
                                        <template #schedule="props">
                                            {{props.row.schedule}}
                                        </template>
                                        <template #category_and_validation="props">
                                            {{props.row.category}} / {{props.row.validation}}
                                        </template>
                                        
                                        <template #actions="props">
                                            <button class="btn btn-sm btn-primary" @click.prevent="edit(props.row)">
                                                <font-awesome-icon icon="fa fa-edit" />
                                            </button>
                                            <button class="btn btn-sm btn-danger" @click.prevent="remove(props.row)">
                                                <font-awesome-icon icon="fa fa-trash" />
                                            </button>
                                            <button class="btn btn-sm btn-info" @click.prevent="execute(props.row)">
                                                <font-awesome-icon icon="fa fa-play" />
                                            </button>
                                        </template>
                                    <!-- </v-server-table> -->
                                    </v-client-table>

                                    <modal-edit-validation ref="editWindow" id="edit-window" :validation="validationToEdit"/>
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
// import VueCronEditorBuefy from 'vue-cron-editor-buefy';
import DataSourceOptions from '../../components/data-source/DataSourceOptions.vue';
import ModalEditValidation from '../modal/ModalEditValidation.vue';

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    mixins: [Notifier],
    components: {
        DataSourceOptions,
        ModalEditValidation,
    },
    data() {
        return {
            dataSource: [],
            editWindow: null,
            validations: [],
            validationToEdit: null,
            columns: [
                'name',
                'status',
                'last_executed',
                'situation',
                'schedule',
                'category_and_validation',
                'actions',
            ],
            options: {
                debounce: 800,
                skin: 'table-sm table table-hover align="center"',
                dateColumns: ['last_executed'],
                columnClasses: { actions: 'th-10' },
                headings: {
                    name: this.$t('common.name'),
                    status: this.$t('common.status'),
                    last_executed: 'Última execução',
                    situation: 'Situação',
                    schedule: 'Agendamento',
                    category_and_validation: this.$t('common.category') + ' / ' + this.$t('titles.validation'),
                    actions: this.$t('common.action', 2),
                },
                sortable: ['name', 'last_executed', 'status', 'situation'],
                filterable: ['name'],
                sortIcon: {
                    base: 'fa fas',
                    is: 'fa-sort ml-10',
                    up: 'fa-sort-amount-up',
                    down: 'fa-sort-amount-down'
                },
                preserveState: true,
                saveState: true,
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
                    'last_executed': '', 'situation': 'Falha',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1001' , 'name': 'Validação 2', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': 'Categoria Teste 1', 'validation': 'Validação Teste',
                },
                {
                    'id': '1002' , 'name': 'Validação 3', 'status': 'Desabilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1003' , 'name': 'Validação 4', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1300' , 'name': 'Validação 5', 'status': 'Desabilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '2000' , 'name': 'Validação 6', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1004' , 'name': 'Validação 7', 'status': 'Desabilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1005' , 'name': 'Validação 8', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Falha',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1006' , 'name': 'Validação 19', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1007' , 'name': 'Validação 20', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1010' , 'name': 'Validação 11', 'status': 'Desabilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1011' , 'name': 'Validação 12', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1012' , 'name': 'Validação 22', 'status': 'Desabilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1013' , 'name': 'Validação 23', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Falha',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '1014' , 'name': 'Validação 24', 'status': 'Desabilitado',
                    'last_executed': '', 'situation': 'Sucesso',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
                {
                    'id': '10100' , 'name': 'Validação 25', 'status': 'Habilitado',
                    'last_executed': '', 'situation': 'Falha',
                    'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                },
            ];
            return validations;
        },
        clearFilters() {
            this.$refs.validationList.setFilter('');
            this.$refs.validationList.customQueries = {};
        },
        edit(validation) {
            this.validationToEdit = validation;
            this.$bvModal.show('edit-window');

            // I have to run the insertValidation method only after the modal is closed, it is running before!
            // this.insertValidation();
        },
        add() {
            this.validationToEdit = {
                'id': '' , 'name': '', 'status': 'Desabilitado',
                'last_executed': '', 'situation': 'Falha',
                'schedule' : '', 'category': '', 'validation': '',
            };
            this.$bvModal.show('edit-window');
            
            // I have to run the insertValidation method only after the modal is closed, it is running before!
            // And it should only run if we closed the modal with ok, so i have to use emit there
            // this.insertValidation();
        },
        insertValidation() {
            alert(this.validationToEdit.name);

            // Here I send to the api the editted validation (it is on validationToEdit)
            // (with the id the api will decide if it is a new validation
            // to insert or an existing one to edit)
            //...

            // And then I clear validationToEdit so that the next modal call doesnt have trash
            // this.validationToEdit = {};
        },
        remove(validation) {
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

            const self = this;
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    for(var i = 0; i < self.validations.length; i++) {
                        if ( self.validations[i].id === validation.id) {
                            self.validations.splice(i, 1);
                        }
                    }
                    self.success(self.$t('messages.successDeletion',
                        { what: this.$tc('titles.validation', 1) }));
                    self.$refs.validationList.refresh();
                },
            );
            // The confirm dialog is not closing after the deletion!
            // I think it will work when I use the api
        },
        execute(validation) {
            // Implement this
        },
        failedValidations() {
            return this.validations.filter(x => x.situation === 'Falha').length;
        },
        totalValidations() {
            return this.validations.length;
        },
    },
}
</script>