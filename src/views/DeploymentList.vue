<template>
    <main role="main">
        <div>
            <div class="title">
                <div class="d-flex justify-content-between align-items-center">
                    <h1>{{$tc('titles.deployment', 2)}}</h1>
                    <router-link :to="{name: 'addDeployment'}" class="btn btn-primary btn-lemonade-primary">
                        <span class="fa fa-plus"></span> {{$t('actions.addItem')}}
                    </router-link>
                </div>
            </div>
            <v-server-table ref="listTable" :columns="columns" :options="options" name="deploymentList">
                <template slot="id" slot-scope="props">
                    <router-link :to="{name: 'editDeployment', params: {id: props.row.id}}">
                        {{props.row.id}}</router-link>
                </template>
                <template slot="name" slot-scope="props">
                    <router-link :to="{name: 'editDeployment', params: {id: props.row.id}}"
                        :title="props.row.description">
                        {{props.row.name}}</router-link>
                </template>
                <template slot="address" slot-scope="props">
                    {{props.row.base_service_url}}:{{props.row.port}}
                </template>
                <template slot="current_status" slot-scope="props">
                    <font-awesome-icon icon="circle" :class="getDeploymentClass(props.row)" />
                    {{$t(`model.status_${props.row.current_status}`)}}
                </template>
                <template slot="updated" slot-scope="props">{{props.row.updated | formatJsonDate}}</template>
                <template slot="actions" slot-scope="props">
                    <button
                        v-if="loggedUserIsOwnerOrAdmin(props.row) && ['PENDING', 'DEPLOYED_OLD', 'PENDING_UNDEPLOY', 'UNDEPLOYED', 'ERROR', 'SUSPENDED'].indexOf(props.row.current_status) > -1"
                        class="ml-1 btn btn-sm btn-success" @click="deploy(props.row.id)" :title="$t('actions.deploy')">
                        <font-awesome-icon icon="power-off" />
                    </button>
                    <button
                        v-if="loggedUserIsOwnerOrAdmin(props.row) && ['DEPLOYED', 'DEPLOYED_OLD'].indexOf(props.row.current_status) > -1"
                        class="ml-1 btn btn-sm btn-danger" @click="undeploy(props.row.id)"
                        :title="$t('actions.undeploy')">
                        <font-awesome-icon icon="power-off" />
                    </button>
                    <button v-if="loggedUserIsOwnerOrAdmin(props.row)" class="ml-1 btn btn-sm btn-outline-info"
                        @click="showInfo(props.row)" :title="$t('actions.info')">
                        {{$tc('deployment.log', 2)}}
                    </button>
                </template>
            </v-server-table>
            <b-modal v-if="currentRow" ref="modalInfo" size="xl" :title="currentRow.name" :okOnly="true">
                <div class="row">
                    <div class="col-12 small">
                        <strong>{{$tc('common.description')}}: </strong> {{currentRow.description}} <br />
                        <strong>{{$tc('deployment.model')}}:</strong> {{currentRow.model_name}} <br />
                        <strong>{{$tc('common.created')}}:</strong> {{currentRow.created | formatJsonDate }}<br />
                        <strong>{{$tc('common.updated')}}:</strong> {{currentRow.updated | formatJsonDate }}<br />
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
                                <td class="text-nowrap">{{log.date | formatJsonDate}}</td>
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
    import Notifier from '../mixins/Notifier';

    const seedUrl = process.env.VUE_APP_SEED_URL;
    const standNamespace = process.env.VUE_APP_STAND_NAMESPACE;

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
                            .get(`${seedUrl}/deployments`, {
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

            socket.on('disconnect', () => {
                console.debug('You are not connected');
            });
            socket.on('connect', () => {
                console.debug('Connecting to room "' + room + '"');
                socket.emit('join', { room });
            });
            socket.on('connect_error', () => {
                console.debug('Web socket server offline');
            });
            socket.on('refresh', self.refresh);
            socket.on('response', (msg) => {
                console.debug(msg)
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
            refresh(){
                this && this.$refs && this.$refs.listTable && this.$refs.listTable.refresh();
            },
            deploy(deploymentId) {
                const self = this;
                this.confirm(
                    this.$tc('titles.deployment'),
                    this.$t('deployment.confirmDeploy'),
                    () => {
                        const url = `${seedUrl}/deployments/${deploymentId}?deploy=true`;
                        axios
                            .patch(url, { deploy: true })
                            .then(resp => {
                                self.success(resp.message);
                                self.refresh();
                            })
                            .catch(e => self.error(e));
                    }
                );
            },
            undeploy(deploymentId) {
                const self = this;
                this.confirm(
                    this.$tc('titles.deployment'),
                    this.$t('deployment.confirmUndeploy'),
                    () => {
                        const url = `${seedUrl}/deployments/${deploymentId}?undeploy=true`;
                        axios
                            .patch(url, { undeploy: true })
                            .then(resp => {
                                self.success(resp.message);
                                self.refresh();
                            })
                            .catch(e => self.error(e));
                    }
                );
            },
            /*
            remove(deploymentId) {
                const self = this;
                this.confirm(
                    this.$t('actions.delete'),
                    this.$t('messages.doYouWantToDelete'),
                    () => {
                        const url = `${seedUrl}/deployments/${deploymentId}`;
                        axios
                            .delete(url, {})
                            .then(resp => {
                                self.success(self.$t('messages.successDeletion',
                                    { what: this.$tc('titles.deployment', 1) }));
                                self.$refs.listTable.refresh();
                            })
                            .catch(e => self.error(e));
                    }
                );

            }*/
        }
    };
</script>