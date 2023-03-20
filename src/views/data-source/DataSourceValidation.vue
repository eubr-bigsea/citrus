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
                                <button class="btn btn-primary btn-lemonade-primary" @click.stop="add">
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
                                            <button class="btn btn-sm btn-primary" @click.stop="edit(props.row.id)">
                                                <font-awesome-icon icon="fa fa-edit" />
                                            </button>
                                            <button class="btn btn-sm btn-danger" @click.stop="remove(props.row.id)">
                                                <font-awesome-icon icon="fa fa-trash" />
                                            </button>
                                            <button class="btn btn-sm btn-info" @click.stop="execute(props.row.id)">
                                                <font-awesome-icon icon="fa fa-play" />
                                            </button>
                                        </template>
                                    <!-- </v-server-table> -->
                                    </v-client-table>

                                    

                                    <b-modal ref="editWindow" size="xl" :title="$t('actions.edit')" no-stacking button-size="sm" header-bg-variant="dark" 
                                            header-text-variant="light" @ok="handleEditOk" @show="resetEditModal" @hidden="resetEditModal">
                                        <!-- {{this.validationToEdit}} -->

                                        <form ref="editForm" @submit.stop.prevent="handleEditSubmit">
                                            <div class="row" align-v="center">
                                                <div class="col-md-10">
                                                    <b-form-group :label="$t('common.name')" label-for="name-input" :invalid-feedback="$t('errors.missingRequiredValue')" :state="nameState">
                                                        <b-form-input
                                                            id="name-input"
                                                            v-model="name"
                                                            type="text"
                                                            :state="nameState"
                                                            required>
                                                        </b-form-input>
                                                    </b-form-group>
                                                </div>

                                                <div class="col-md-2">
                                                    <b-form-checkbox
                                                        id="status-checkbox"
                                                        v-model="status"
                                                        name="status"
                                                        value="Habilitado"
                                                        unchecked-value="Desabilitado"
                                                    >{{ $t('common.enabled') }}</b-form-checkbox>
                                                </div>
                                            </div>

                                            <b-form-group label="Agendamento" label-for="schedule-input" :invalid-feedback="$t('errors.missingRequiredValue')" :state="scheduleState">
                                                <b-form-input
                                                    id="schedule-input"
                                                    v-model="schedule"
                                                    type="text"
                                                    :state="scheduleState"
                                                    required>
                                                </b-form-input>
                                            </b-form-group>

                                        </form>



                                        <!-- Just to see the results -->
                                        <br><br>
                                        {{ this.name }}<br>
                                        {{ this.status }}<br>
                                        {{ this.schedule }}<br>

                                    </b-modal>
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

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    mixins: [Notifier],
    components: {
        DataSourceOptions,
    },
    data() {
        return {
            dataSource: [],
            previewWindow: null,
            validations: [],
            validationToEdit: null,
            name: '',
            nameState: null,
            status: 'Desabilitado',
            schedule: '',
            scheduleState: null,
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
                // {
                //     'id': '1000' , 'name': 'Validação 1', 'status': 'Habilitado',
                //     'last_executed': Date('2020-03-21'), 'situation': 'Falha',
                //     'schedule' : 'Todo dia, 9h da noite', 'category': '', 'validation': '',
                // },
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
        edit(validationId) {
            this.validationToEdit = this.validations.filter(x => x.id === validationId);
            this.$refs.editWindow.show();
        },
        resetEditModal() {
            this.name = '';
            this.nameState = null;
            this.schedule = '';
            this.scheduleState = null;
            this.status = 'Desabilitado';
        },
        handleEditOk(bvModalEvent) {
            bvModalEvent.preventDefault();
            this.handleEditSubmit();
        },
        handleEditSubmit() {
            if (!this.checkEditFormValidity()) {
                return;
            }
            // Here I send the editted validation to the api
            //...

            this.$nextTick(() => {
                this.$refs.editWindow.hide();
            })
        },
        checkEditFormValidity() {
            const valid = this.$refs.editForm.checkValidity();
            if(valid == true) {
                this.nameState = valid;
                this.scheduleState = valid;
            }
            else {
                this.nameState = ((this.name == '') ? valid : !valid);
                this.scheduleState = ((this.schedule == '') ? valid : !valid);
            }
            return valid;
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
            alert("Dado excluído com sucesso!");
        },
        execute(validationId) {
            // Do this
        },
        failedValidations() {
            return this.validations.filter(x => x.situation === 'Falha').length;
        },
        totalValidations() {
            return this.validations.length;
        },
        add() {
            // Implement a modal like the edit modal
        },
    },
}
</script>