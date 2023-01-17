<template>
    <main role="main">
        <div>
            <v-server-table ref="listTable" :columns="columns" :options="options" name="modelList">
                <template #id="props">
                    <router-link :to="{name: 'editModel', params: {id: props.row.id}}">
                        {{props.row.id}}
                    </router-link>
                </template>
                <template #name="props">
                    <router-link :to="{name: 'editModel', params: {id: props.row.id}}">
                        {{props.row.name}}
                    </router-link>
                </template>
                <template #deployment_status="props">
                    <font-awesome-icon icon="circle" :class="getDeploymentClass(props.row)" />
                    {{$t(`model.status_${props.row.deployment_status}`)}}
                </template>
                <template #created="props">
                    {{props.row.created | formatJsonDate}}
                </template>
                <template #actions="props">
                    <button v-if="loggedUserIsOwnerOrAdmin(props.row)" class="btn btn-sm btn-danger"
                            :title="$t('actions.delete')" @click="remove(props.row.id)">
                        <font-awesome-icon icon="trash" />
                    </button>
                    <button v-if="loggedUserIsOwnerOrAdmin(props.row) && props.row.type === 'MLEAP' && props.row.deployment_status === 'NOT_DEPLOYED' "
                            class="ml-1 btn btn-sm btn-success" :title="$t('actions.deploy')" @click="remove(props.row.id)">
                        <font-awesome-icon icon="server" />
                    </button>
                    <button v-if="loggedUserIsOwnerOrAdmin(props.row) && props.row.type === 'MLEAP' && ['DEPLOYED', 'RUNNING'].indexOf(props.row.deployment_status) > -1"
                            class="ml-1 btn btn-sm btn-warning" :title="$t('actions.undeploy')"
                            @click="remove(props.row.id)">
                        <font-awesome-icon icon="server" />
                    </button>
                </template>
            </v-server-table>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    mixins: [Notifier],
    data() {
        return {
            columns: ['id', 'name', 'deployment_status', 'type', 'created', 'user_name', 'class_name', 'actions',],

            showSideBar: false,
            options: {
                debounce: 800,
                skin: 'table-sm table table-hover',
                dateColumns: ['created'],
                columnsClasses: { 'actions': 'text-center' },
                headings: {
                    id: 'ID',
                    name: this.$tc('common.name'),
                    class_name: this.$tc('common.class'),
                    deployment_status: this.$tc('model.deployment_status'),
                    type: this.$tc('common.type'),
                    user_name: this.$t('common.user.name'),
                    created: this.$tc('common.created'),
                    actions: this.$tc('common.action', 2)
                },
                sortable: ['id', 'name', 'type', 'created', 'deployment_status'],
                filterable: ['id', 'name', 'type', 'created'],
                sortIcon: {
                    base: 'fa fas',
                    is: 'fa-sort ml-10',
                    up: 'fa-sort-amount-up',
                    down: 'fa-sort-amount-down'
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

                    data.fields = 'id,name,created,type,class_name,user_name,user_id,deployment_status';

                    let url = `${limoneroUrl}/models`;

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
                }
            }
        };
    },
    /* Methods */
    methods: {
        getDeploymentClass(item) {
            switch (item.deployment_status) {
            case 'NOT_DEPLOYED':
                return 'text-secondary';
            case 'DEPLOYED':
                return 'text-success';
            case 'PENDING':
                return 'text-warning'
            }
        },
        loggedUserIsOwnerOrAdmin(model) {
            const user = this.$store.getters.user;
            return model.user_id === user.id || user.roles.indexOf('admin') >= 0;
        },
        remove(modelId) {
            const self = this;
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete'),
                () => {
                    const url = `${limoneroUrl}/models/${modelId}`;
                    axios
                        .delete(url, {})
                        .then(() => {
                            self.success(self.$t('messages.successDeletion',
                                { what: this.$tc('titles.model', 1) }));
                            self.$refs.listTable.refresh();
                        })
                        .catch(e => self.error(e));
                }
            );

        }
    }
};
</script>