<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1>{{$t('titles.workflow', 2)}}</h1>
            <div>
                <button class="btn btn-outline-info float-left" @click.prevent="showImportWorkflow">
                    <font-awesome-icon icon="fa fa-download" />
                    {{$t('actions.import')}}
                </button>
                <router-link :to="{name: 'addWorkflow'}" class="btn btn-primary btn-lemonade-primary float-left ml-2">
                    <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                </router-link>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <v-server-table ref="workflowList" :columns="columns" :options="options" name="workflowList">
                    <template #id="props">
                        <router-link :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">
                            {{props.row.id}}
                        </router-link>
                    </template>
                    <template #name="props">
                        <router-link :to="{name: 'editWorkflow', params: {id: props.row.id, platform: props.row.platform.id}}">
                            {{props.row.name}}
                        </router-link>
                        <small v-if="props.row.description" class="break-word"><br>{{props.row.description}}</small>
                    </template>
                    <template #platform="props">
                        {{props.row.platform.name}}
                    </template>
                    <template #is_template="props">
                        {{$t(props.row.is_template ?
                            'common.yes':
                            'common.no')}}
                    </template>
                    <template #user_name="props">
                        {{props.row.user.name}}
                    </template>
                    <template #updated="props">
                        {{$filters.formatJsonDate(props.row.updated)}}
                    </template>
                    <template #afterFilter>
                        <div class="form-group float-left ml-3">
                            <label>{{$t('common.platform')}}</label>
                            <select v-model="platform" class="form-control">
                                <option />
                                <option v-for="p in platforms" :key="p.id" :value="p.slug">
                                    {{p.name}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group float-left ml-3 mt-4">
                            <button type="button" class="btn btn-sm btn-light btn-outline-secondary ml-2"
                                    @click="clearFilters">
                                {{$t('actions.clearFilters')}}
                            </button>
                        </div>
                    </template>
                    <template #actions="props">
                        <button class="btn btn-sm btn-danger" @click="remove(props.row.id)">
                            <font-awesome-icon icon="trash" />
                        </button>
                    </template>
                </v-server-table>
            </div>
        </div>
        <b-modal id="importModal" ref="importModal" size="lg"
                 :title="$t('actions.import') + ' ' + $t('titles.workflow', 1)" ok-disabled>
            <b-form-radio-group>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <p>{{$t('import.description')}}</p>
                        <div class="alert alert-warning" role="alert">
                            {{$t('import.review')}}
                        </div>
                    </div>
                    <div class="col-md-12 mb-3">
                        <input ref="importFile" type="file">
                    </div>
                </div>
            </b-form-radio-group>
            <template #modal-footer>
                <div class="w-100">
                    <b-btn variant="secondary_sm" class="float-right btn-sm btn-outline-secondary" @click="closeImport">
                        {{$t('actions.cancel')}}
                    </b-btn>
                    <b-btn variant="primary" class="float-right mr-2 btn-sm " @click="importWorkflow">
                        {{$t('common.ok')}}
                    </b-btn>
                </div>
            </template>
        </b-modal>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';
let tahitiUrl = import.meta.env.VITE_TAHITI_URL;
export default {
    mixins: [Notifier],
    data() {
        const self = this;
        return {
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
                    name: this.$t('common.name'),
                    updated: this.$t('common.updated'),
                    platform: this.$t('common.platform'),
                    user_name: this.$t('common.user.name'),
                    version: this.$t('common.version'),
                    is_template: this.$t('titles.template'),
                    actions: this.$t('common.action', 2)
                },
                sortable: ['name', 'id', 'updated'],
                filterable: ['name', 'id'],
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ml-10',
                    up: 'sort-up',
                    down: 'sort-down'
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
                    data.platform = self.platform;

                    data.fields = 'id,name,platform,updated,user,version,is_template,description';

                    let url = `${tahitiUrl}/workflows?enabled=1&types=WORKFLOW`;
                    return axios
                        .get(url, {
                            params: data
                        })
                        .then(resp => {
                            return {
                                data: resp.data.data,
                                count: resp.data.pagination.total
                            };
                        })
                        .catch(
                            function (e) {
                                this.error(e);
                            }.bind(this)
                        );
                },
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
    watch: {
        platform(v) {
            // This is not working
            // Event.$emit('vue-tables.workflowList.filter::platform', v);
            // Event.$emit('vue-tables.filter::platform', v);

            // This works, but it uses internal details of component
            const table = this.$refs.workflowList;
            //table.customQueries['platform'] = v;
            //table.updateState('customQueries', table.customQueries);
            table.getData();
        }
    },
    async mounted() {
        let url = `${tahitiUrl}/platforms`;
        try {
            const resp = await axios.get(url);
            this.platforms = resp.data.data;
        } catch (e) {
            this.error(e);
        }
        //this.platform = this.$refs.workflowList.customQueries['platform'];
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
                        .then(() => {
                            self.success(self.$t('messages.successDeletion',
                                { what: this.$t('titles.workflow', 1) }));
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
                            self.$refs.workflowList.refresh();
                        })
                        .catch(e => self.error(e));
                };
                reader.readAsArrayBuffer(file);
                self.closeImport();

            } else {
                this.warning(this.$t('import.selectFile'));
            }
        },
        closeImport() {
            this.$refs.importModal.hide();
        },
        showImportWorkflow() {
            this.$refs.importModal.show();
        }
    }
};
</script>