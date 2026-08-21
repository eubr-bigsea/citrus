<template>
    <main role="main">
        <div>
            <div class="title">
                <div class="d-flex justify-content-between align-items-center">
                    <h1>{{ $t('titles.deployment', 2) }}</h1>
                    <router-link :to="{ name: 'addDeployment' }" class="btn btn-primary btn-lemonade-primary">
                        <font-awesome-icon icon="fa fa-plus" /> {{ $t('actions.addItem') }}
                    </router-link>
                </div>
            </div>
            <v-server-table ref="listTable" :columns="columns" :options="options" name="deploymentList">
                <template #id="props">
                    <router-link :to="{ name: 'editDeployment', params: { id: props.row.id } }">
                        {{ props.row.id }}
                    </router-link>
                </template>
                <template #name="props">
                    <router-link :to="{ name: 'editDeployment', params: { id: props.row.id } }"
                        :title="props.row.description">
                        {{ props.row.name }}
                    </router-link>
                </template>
                <template #address="props">
                    {{ props.row.base_service_url }}:{{ props.row.port }}
                </template>
                <template #current_status="props">
                    <font-awesome-icon icon="circle" :class="getDeploymentClass(props.row)" />
                    {{ $t(`model.status_${props.row.current_status}`) }}
                </template>
                <template #updated="props">
                    {{ $filters.formatJsonDate(props.row.updated) }}
                </template>
                <template #actions="props">
                    <div v-if="loggedUserIsOwnerOrAdmin(props.row)">
                        <button
                            v-if="['PENDING', 'DEPLOYED_OLD', 'PENDING_UNDEPLOY', 'UNDEPLOYED', 'ERROR', 'SUSPENDED'].indexOf(props.row.current_status) > -1"
                            class="ms-1 btn btn-sm btn-success" :title="$t('actions.deploy')"
                            @click="deployOrUndeploy(props.row.id, true)">
                            <font-awesome-icon icon="power-off" />
                        </button>
                        <button v-if="['PENDING', 'DEPLOYED', 'DEPLOYED_OLD'].indexOf(props.row.current_status) > -1"
                            class="ms-1 btn btn-sm btn-danger" :title="$t('actions.undeploy')"
                            @click="deployOrUndeploy(props.row.id, false)">
                            <font-awesome-icon icon="power-off" />
                        </button>
                        <button class="ms-1 btn btn-sm btn-outline-info" :title="$t('actions.info')"
                            @click="showInfo(props.row)">
                            <font-awesome-icon icon="list-alt" />
                            {{ $t('deployment.log', 2) }}
                        </button>
                        <button class="ms-2 btn btn-sm btn-outline-danger" @click="remove(props.row.id)">
                            <font-awesome-icon icon="trash" />
                        </button>
                    </div>
                </template>
            </v-server-table>
            <b-modal v-if="currentRow" ref="modalInfo" size="xl" :title="currentRow.name" :ok-only="true">
                <div class="row">
                    <div class="col-12 small">
                        <strong>{{ $t('common.description') }}: </strong> {{ currentRow.description }} <br>
                        <strong>{{ $t('deployment.model') }}:</strong> {{ currentRow.model_name }} <br>
                        <strong>{{ $t('common.created') }}:</strong> {{ $filters.formatJsonDate(currentRow.created) }}<br>
                        <strong>{{ $t('common.updated') }}:</strong> {{ $filters.formatJsonDate(currentRow.updated) }}<br>
                    </div>
                </div>
                <div class="col-12 mt-4">
                    <table class="table table-sm small">
                        <thead>
                            <th>{{ $t('common.date') }}</th>
                            <th>{{ $t('common.status') }}</th>
                            <th>{{ $t('titles.error') }}</th>
                        </thead>
                        <tbody>
                            <tr v-for="log in logs" :key="log.id">
                                <td class="text-nowrap">
                                    {{ $filters.formatJsonDate(log.date) }}
                                </td>
                                <td>{{ log.status }}</td>
                                <td>{{ log.log }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </b-modal>
        </div>
    </main>
</template>


<script>
import { ref, reactive, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import axios from 'axios';
import io from 'socket.io-client';
import Notifier from '../notifier.js';

const seedUrl = import.meta.env.VITE_SEED_URL;
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;

export default {
    setup() {
        const router = useRouter();
        const store = useStore();
        const { t } = useI18n();
        const notifier = new Notifier(inject('snotify'), t, router);

        const currentRow = ref(null);
        const logs = ref([]);
        const listTable = ref(null);

        const columns = ['id', 'name', 'model_name', 'current_status', 'updated', 'user_name', 'address', 'actions'];

        const getDeploymentClass = (item) => {
            switch (item.current_status) {
                case 'NOT_DEPLOYED': return 'text-secondary';
                case 'DEPLOYED': return 'text-success';
                case 'PENDING': return 'text-warning';
                case 'ERROR': return 'text-danger';
                default: return '';
            }
        };

        const loggedUserIsOwnerOrAdmin = deployment => {
            const user = store.getters.user;
            return deployment.user_id === user.id || user.roles.includes('admin');
        };

        const refresh = () => {
            listTable.value && listTable.value.refresh();
        };

        const showInfo = async row => {
            currentRow.value = row;
            const resp = await axios.get(`${seedUrl}/logs?size=10&deployment=${row.id}`);
            logs.value = resp.data.data;
            listTable.value.$refs.modalInfo.show();
        };

        const deployOrUndeploy = (deploymentId, deploy) => {
            const confirmMsg = deploy ? t('deployment.confirmDeploy') : t('deployment.confirmUndeploy');
            notifier.confirm(
                t('titles.deployment'),
                confirmMsg,
                () => {
                    const params = deploy ? { deploy: true } : { undeploy: true };
                    axios.patch(`${seedUrl}/deployments/${deploymentId}`, params)
                        .then(resp => { notifier.success(resp.message); refresh(); })
                        .catch(e => notifier.error(e));
                }
            );
        };

        const remove = (deploymentId) => {
            notifier.confirm(
                t('actions.delete'),
                `${t('messages.doYouWantToDelete')} ${t('deployment.deleteNotice')}`,
                () => {
                    axios.delete(`${seedUrl}/deployments/${deploymentId}`)
                        .then(() => {
                            notifier.success(t('messages.successDeletion', { what: t('titles.deployment', 1) }));
                            refresh();
                        })
                        .catch(e => notifier.error(e));
                }
            );
        };

        const options = reactive({
            debounce: 800,
            skin: 'table table-hover',
            dateColumns: ['updated'],
            columnsClasses: { actions: 'text-center' },
            headings: {
                id: 'ID',
                name: t('common.name'),
                current_status: t('deployment.deployment_status'),
                type: t('common.type'),
                user_name: t('common.user.name'),
                model_name: t('deployment.model'),
                address: t('deployment.address'),
                created: t('common.created'),
                updated: t('common.updated'),
                actions: t('common.action', 2)
            },
            sortable: ['id', 'name', 'type', 'created', 'updated', 'current_status'],
            filterable: ['id', 'description', 'type', 'created'],
            sortIcon: { base: 'sort-base', is: 'sort-is ms-10', up: 'sort-up', down: 'sort-down' },
            preserveState: true,
            saveState: true,
            filterByColumn: false,
            requestFunction: async function (data) {
                data.sort = data.orderBy;
                data.asc = data.ascending === 1 ? 'true' : 'false';
                data.size = data.limit;
                data.q = data.query;
                data.fields = 'id,current_status,user_name,user_id,description,created,updated,model_name,name,base_service_url,port';

                try {
                    const resp = await axios.get(`${seedUrl}/deployments?enabled=true`, { params: data });
                    return { data: resp.data.data, count: resp.data.pagination.total };
                } catch (e) {
                    notifier.error(e);
                    return { data: [], count: 0 }; // <<< garante que sempre retorne objeto
                }
            },

            texts: {
                filter: t('common.filter'),
                count: t('common.pagerShowing'),
                limit: t('common.limit'),
                noResults: t('common.noData'),
                loading: t('common.loading'),
                filterPlaceholder: t('common.filterPlaceholder')
            }
        });

        onMounted(() => {
            const socket = io(standNamespace, { upgrade: true });
            const room = `deployment.list.${store.getters.user.id}`;

            socket.on('connect', () => socket.emit('join', { room }));
            socket.on('refresh', () => refresh());
        });

        return {
            t,
            columns,
            options,
            currentRow,
            logs,
            listTable,
            getDeploymentClass,
            loggedUserIsOwnerOrAdmin,
            showInfo,
            deployOrUndeploy,
            remove,
            refresh
        };
    }
};
</script>