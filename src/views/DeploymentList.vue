<template>
    <main role="main">
        <div>
            <div class="title">
                <div class="d-flex justify-content-between align-items-center">
                    <h1>{{$tc('titles.deployment', 2)}}</h1>
                    <router-link :to="{name: 'addDeployment'}" class="btn btn-primary btn-lemonade-primary">
                        <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                    </router-link>
                </div>
            </div>
            <v-server-table ref="listTable" :columns="columns" :options="options" name="deploymentList">
                <template #id="props">
                    <router-link :to="{name: 'editDeployment', params: {id: props.row.id}}">
                        {{props.row.id}}
                    </router-link>
                </template>
                <template #name="props">
                    <router-link :to="{name: 'editDeployment', params: {id: props.row.id}}"
                                 :title="props.row.description">
                        {{props.row.name}}
                    </router-link>
                </template>
                <template #address="props">
                    {{props.row.base_service_url}}:{{props.row.port}}
                </template>
                <template #current_status="props">
                    <font-awesome-icon icon="circle" :class="getDeploymentClass(props.row)" />
                    {{$t(`model.status_${props.row.current_status}`)}}
                </template>
                <template #updated="props">
                    {{props.row.updated | formatJsonDate}}
                </template>
                <template #actions="props">
                    <div v-if="loggedUserIsOwnerOrAdmin(props.row)">
                        <button v-if="['PENDING', 'DEPLOYED_OLD', 'PENDING_UNDEPLOY', 'UNDEPLOYED', 'ERROR', 'SUSPENDED'].indexOf(props.row.current_status) > -1"
                                class="ml-1 btn btn-sm btn-success" :title="$t('actions.deploy')"
                                @click="deployOrUndeploy(props.row.id, true)">
                            <font-awesome-icon icon="power-off" />
                        </button>
                        <button v-if="['PENDING', 'DEPLOYED', 'DEPLOYED_OLD'].indexOf(props.row.current_status) > -1"
                                class="ml-1 btn btn-sm btn-danger" :title="$t('actions.undeploy')"
                                @click="deployOrUndeploy(props.row.id, false)">
                            <font-awesome-icon icon="power-off" />
                        </button>
                        <button class="ml-1 btn btn-sm btn-outline-info" :title="$t('actions.info')"
                                @click="showInfo(props.row)">
                            <font-awesome-icon icon="list-alt" />
                            {{$tc('deployment.log', 2)}}
                        </button>
                        <button class="ml-2 btn btn-sm btn-outline-danger" @click="remove(props.row.id)">
                            <font-awesome-icon icon="trash" />
                        </button>
                    </div>
                </template>
            </v-server-table>
            <b-modal v-if="currentRow" ref="modalInfo" size="xl" :title="currentRow.name"
                     :ok-only="true">
                <div class="row">
                    <div class="col-12 small">
                        <strong>{{$tc('common.description')}}: </strong> {{currentRow.description}} <br>
                        <strong>{{$tc('deployment.model')}}:</strong> {{currentRow.model_name}} <br>
                        <strong>{{$tc('common.created')}}:</strong> {{currentRow.created | formatJsonDate}}<br>
                        <strong>{{$tc('common.updated')}}:</strong> {{currentRow.updated | formatJsonDate}}<br>
                    </div>
                </div>
                <div class="col-12 mt-4">
                    <table class="table table-sm small">
                        <thead>
                            <th>{{$t('common.date')}}</th>
                            <th>{{$t('common.status')}}</th>
                            <th>{{$t('titles.error')}}</th>
                        </thead>
                        <tbody>
                            <tr v-for="log in logs" :key="log.id">
                                <td class="text-nowrap">
                                    {{log.date | formatJsonDate}}
                                </td>
                                <td>{{log.status}}</td>
                                <td>{{log.log}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </b-modal>
        </div>
    </main>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';

const seedUrl = import.meta.env.VITE_SEED_URL;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;

export default {
    mixins: [Notifier],
    data() {
        return {
            currentRow: null,
            logs: [],

            columns: ['id', 'name', 'model_name', 'current_status', 'updated', 'user_name', 'address', 'actions',],

            //showSideBar: false,
            options: {
                debounce: 800,
                skin: 'table-sm table table-hover',
                dateColumns: ['updated'],
                columnsClasses: { 'actions': 'text-center' },
                headings: {
                    id: 'ID',
                    name: this.$tc('common.name'),
                    current_status: this.$tc('deployment.deployment_status'),
                    type: this.$tc('common.type'),
                    user_name: this.$t('common.user.name'),
                    model_name: this.$tc('deployment.model'),
                    address: this.$tc('deployment.address'),
                    created: this.$tc('common.created'),
                    updated: this.$tc('common.updated'),
                    actions: this.$tc('common.action', 2)
                },
                sortable: ['id', 'name', 'type', 'created', 'updated', 'current_status'],
                filterable: ['id', 'description', 'type', 'created'],
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

                    data.fields = 'id,current_status,user_name,user_id,description,created,updated,model_name,name,base_service_url,port';

                    this.$Progress.start();
                    return axios
                        .get(`${seedUrl}/deployments?enabled=true`, {
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
            },
        };
    },
    mounted() {
        const self = this;
        const socket = io(standNamespace, { upgrade: true, });
        const room = `deployment.list.${this.$store.getters.user.id}`;

        socket.on('connect', () => {
            socket.emit('join', { room });
        });
        socket.on('refresh', () => {
            self.refresh();
        });
    },
    methods: {
        async showInfo(row) {
            this.currentRow = row;
            const resp = await axios.get(`${seedUrl}/logs?size=10&deployment=${row.id}`);
            this.logs = resp.data.data;
            this.$refs.modalInfo.show();
        },
        getDeploymentClass(item) {
            switch (item.current_status) {
            case 'NOT_DEPLOYED':
                return 'text-secondary';
            case 'DEPLOYED':
                return 'text-success';
            case 'PENDING':
                return 'text-warning'
            case 'ERROR':
                return 'text-danger'
            }
        },
        loggedUserIsOwnerOrAdmin(deployment) {
            const user = this.$store.getters.user;
            return deployment.user_id === user.id || user.roles.indexOf('admin') >= 0;
        },
        refresh() {
            this && this.$refs && this.$refs.listTable && this.$refs.listTable.refresh();
        },
        deployOrUndeploy(deploymentId, deploy) {
            const self = this;
            let confirmMsg = this.$t('deployment.confirmDeploy');
            if (!deploy) {
                confirmMsg = this.$t('deployment.confirmUndeploy');
            }
            this.confirm(
                this.$tc('titles.deployment'),
                confirmMsg,
                () => {
                    const params = deploy ? { deploy: true } : { undeploy: true };

                    const url = `${seedUrl}/deployments/${deploymentId}`;
                    axios
                        .patch(url, params)
                        .then(resp => {
                            self.success(resp.message);
                            self.refresh();
                        })
                        .catch(e => self.error(e));
                }
            );
        },
        remove(deploymentId) {
            const self = this;
            this.confirm(
                this.$t('actions.delete'),
                this.$t('messages.doYouWantToDelete') + ' '
                    + this.$t('deployment.deleteNotice'),
                () => {
                    const url = `${seedUrl}/deployments/${deploymentId}`;
                    axios
                        .delete(url, {})
                        .then(() => {
                            self.success(self.$t('messages.successDeletion',
                                { what: this.$tc('titles.deployment', 1) }));
                            self.$refs.listTable.refresh();
                        })
                        .catch(e => self.error(e));
                }
            );

        }
    }
};
</script>