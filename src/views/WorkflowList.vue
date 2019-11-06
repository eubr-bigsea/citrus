<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$tc('titles.workflow', 2)}}</h1>
                        <div>
                            <router-link :to="{name: 'addWorkflow'}"
                                class="btn btn-sm btn-outline-primary float-left mr-1">
                                {{$t('actions.addItem')}}
                            </router-link>
                            <button @click.prevent="showImportWorkflow"
                                class="btn btn-sm btn-outline-secondary float-left">
                                {{$t('actions.import')}}
                            </button>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <v-server-table :columns="columns" :options="options" ref="workflowList"
                                        name="workflowList">
                                        <template slot="id" slot-scope="props">
                                            <router-link
                                                :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">
                                                {{props.row.id}}
                                            </router-link>
                                        </template>
                                        <template slot="name" slot-scope="props">
                                            <router-link
                                                :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">
                                                {{props.row.name}}
                                            </router-link>
                                        </template>
                                        <template slot="platform" slot-scope="props">
                                            {{props.row.platform.name}}
                                        </template>
                                        <template slot="is_template" slot-scope="props">
                                            {{$tc(props.row.is_template ? 'common.yes': 'common.no')}}
                                        </template>
                                        <template slot="user_name" slot-scope="props">
                                            {{props.row.user.name}}
                                        </template>
                                        <template slot="updated" slot-scope="props">
                                            {{props.row.updated | formatJsonDate}}
                                        </template>
                                        <div slot="afterFilter" class="ml-2">
                                            <label>{{$tc('common.platform')}}</label>
                                            <select class="form-control" v-model="platform">
                                                <option></option>
                                                <option v-for="p in platforms" v-bind:value="p.slug" v-bind:key="p.id">
                                                    {{p.name}}
                                                </option>
                                            </select>
                                            <button type="button"
                                                class="btn btn-sm btn-light btn-outline-secondary ml-2"
                                                @click="clearFilters">
                                                {{$tc('actions.clearFilters')}}
                                            </button>
                                        </div>
                                        <template slot="actions" slot-scope="props">
                                            <button class="btn btn-sm btn-light" @click="remove(props.row.id)">
                                                <font-awesome-icon icon="trash"></font-awesome-icon>
                                            </button>
                                            <button class="btn btn-sm btn-light" :title="$t('actions.download')"
                                                @click="showShareModal(props.row)">
                                                <span class="fa fa-share-alt" />
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
        <b-modal id="importModal" size="lg" :title="$t('actions.import') + ' ' + $tc('titles.workflow', 1)" ok-disabled
            ref="importModal">
            <b-form-radio-group>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <p>{{$t('import.description')}}</p>

                        <p><u>{{$t('import.review')}}</u></p>
                    </div>
                    <div class="col-md-12 mb-3">
                        <input type="file" ref="importFile" />
                    </div>
                </div>
            </b-form-radio-group>
            <div slot="modal-footer" class="w-100">
                <b-btn variant="secondary_sm" class="float-right btn-sm btn-outline-secondary" @click="closeImport">
                    {{$t('actions.cancel')}}</b-btn>
                <b-btn variant="primary" class="float-right mr-2 btn-sm " @click="importWorkflow">
                    {{$t('common.ok')}}
                </b-btn>
            </div>
        </b-modal>
        <shared-modal :resource-id="workflowId" :all-users="users" :resource-type="'workflow'" />
    </main>
</template>

<script>
    import axios from 'axios';
    import { Event } from 'vue-tables-2';
    import Notifier from '../mixins/Notifier';
    import { deserialize } from 'jsonapi-deserializer';
    import SharedModal from '../components/ShareModal';

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    const thornUrl = process.env.VUE_APP_THORN_URL;

    export default {
        components: {
            'shared-modal': SharedModal
        },
        mixins: [Notifier],
        data() {
            return {
                workflowId: 0,
                users: [],
                platform: '',
                platforms: [],
                columns: [
                    'id',
                    'name',
                    'updated',
                    'platform',
                    'user_name',
                    'version',
                    'is_template',
                    'actions'
                ],
                options: {
                    debounce: 800,
                    skin: 'table-sm table table-hover',
                    dateColumns: ['updated'],
                    columnClasses: { actions: 'th-10' },
                    headings: {
                        id: 'ID',
                        name: this.$tc('common.name'),
                        updated: this.$tc('common.updated'),
                        platform: this.$tc('common.platform'),
                        user_name: this.$tc('common.user.name'),
                        version: this.$tc('common.version'),
                        is_template: this.$tc('titles.template'),
                        actions: this.$tc('common.action', 2)
                    },
                    sortable: ['name', 'id', 'updated'],
                    filterable: ['name', 'id'],
                    sortIcon: {
                        base: 'fa fas',
                        is: 'fa-sort ml-10',
                        up: 'fa-sort-amount-up',
                        down: 'fa-sort-amount-down'
                    },
                    preserveState: true,
                    saveState: true,
                    customFilters: ['platform'],
                    filterByColumn: false,
                    requestFunction: function (data) {
                        data.sort = data.orderBy;
                        data.asc = data.ascending === 1 ? 'true' : 'false';
                        data.size = data.limit;
                        data.name = data.query;

                        data.fields = 'id,name,platform,updated,user,version,is_template';

                        let url = `${tahitiUrl}/workflows?enabled=1`;
                        let headers = {};
                        this.$Progress.start();
                        return axios
                            .get(url, {
                                params: data
                            })
                            .then(resp => {
                                this.$Progress.finish();
                                return {
                                    data: resp.data.data,
                                    count: resp.data.pagination.total
                                };
                            })
                            .catch(
                                function (e) {
                                    this.$Progress.finish();
                                    this.error(e);
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
                    }
                }
            };
        },
        mounted() {
            this.getAvailableUsers();
            let url = `${tahitiUrl}/platforms`;
            this.$Progress.start();
            axios
                .get(url)
                .then(resp => {
                    this.platforms = resp.data.sort((a, b) => a.name.localeCompare(b.name));
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                )
                .finally(() => {
                    this.$Progress.finish();
                });
            this.platform = this.$refs.workflowList.customQueries['platform'];
        },
        /* Methods */
        methods: {
            clearFilters() {
                this.$refs.workflowList.setFilter('');
                this.$refs.workflowList.customQueries = {};
                this.platform = '';
            },
            remove(workflowId) {
                const self = this;
                this.confirm(
                    this.$t('actions.delete'),
                    this.$t('messages.doYouWantToDelete'),
                    () => {
                        const url = `${tahitiUrl}/workflows/${workflowId}`;
                        axios
                            .delete(url, {})
                            .then(resp => {
                                self.success(self.$t('messages.successDeletion',
                                    { what: this.$tc('titles.workflow', 1) }));
                                self.$refs.workflowList.refresh();
                            })
                            .catch(e => self.error(e));
                    }
                );
            },
            importWorkflow() {
                const self = this;
                const file = self.$refs.importFile.files.length
                    ? self.$refs.importFile.files[0]
                    : null;
                if (file !== null) {
                    var content;
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const headers = { 'Content-Type': 'application/json' };
                        const url = `${tahitiUrl}/workflows/import`;
                        content = new TextDecoder("utf-8").decode(event.target.result);
                        const payload = { content };
                        axios.post(url, payload, { headers }).then(
                            (resp) => {
                                self.success(self.$t('messages.successImport',
                                    { what: resp.data.workflow }));
                            })
                            .catch(e => self.error(e));
                    };
                    reader.readAsArrayBuffer(file);
                    self.closeImport();

                } else {
                    this.warning(this.$tc('import.selectFile'));
                }
            },
            closeImport() {
                this.$refs.importModal.hide();
            },
            showImportWorkflow() {
                this.$refs.importModal.show();
            },
            getAvailableUsers() {
                let url = `${thornUrl}/api/users/available`;

                this.$Progress.start();
                return axios
                    .get(url)
                    .then(resp => {
                        this.$Progress.finish();
                        this.users = deserialize(resp.data);
                        return deserialize(resp.data);
                    })
                    .catch(
                        function (e) {
                            this.$Progress.finish();
                            this.error(e);
                        }.bind(this)
                    );
            },
            showShareModal(workflow) {
                this.workflowId = workflow.id;
                this.$root.$emit('bv::show::modal', 'share-modal', '#btnShow');
            },
        },
        watch: {
            platform(v) {
                // This is not working
                // Event.$emit('vue-tables.workflowList.filter::platform', v);
                // Event.$emit('vue-tables.filter::platform', v);

                // This works, but use internal details of component
                const table = this.$refs.workflowList;
                table.customQueries['platform'] = v;
                table.updateState('customQueries', table.customQueries);
                table.getData();
            }
        }
    };
</script>