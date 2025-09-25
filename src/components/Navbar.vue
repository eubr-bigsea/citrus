<template>
    <b-navbar id="l-navbar" toggleable="md" sticky class="border-bottom">
        <b-navbar-toggle target="nav_collapse" />
        <b-navbar-brand :to="{ name: 'home' }" class="me-5">
            <img class="full_logo" src="../assets/lemonade_logo.svg" width="157" height="32" alt="Lemonade">
            <img class="icon_logo" src="../assets/lemonade_icon.svg" width="25" height="32" alt="Lemonade">
        </b-navbar-brand>
        <b-collapse id="nav_collapse" is-nav>
            <b-navbar-nav class="pt-1">
                <b-nav-item v-if="hasAnyPermission(DATA_SOURCE_PERMISSIONS) || isAdmin" :to="{ name: 'dataSources' }">
                    <font-awesome-icon icon="fa fa-database" class="text-success" :title="$t('titles.dataSource', 2)" />
                    <span class="nav-title">{{ $t('titles.dataSource', 2) }}</span>
                </b-nav-item>
                <b-nav-item v-if="hasAnyPermission(WORKFLOW_PERMISSIONS) || isAdmin" :to="{ name: 'workflows' }">
                    <font-awesome-icon icon="fa fa-flask" class="text-success" :title="$t('titles.workflow', 2)" />
                    <span class="nav-title">{{ $t('titles.workflow', 2) }}</span>
                </b-nav-item>
                <b-nav-item v-if="hasAnyPermission(WORKFLOW_PERMISSIONS) || isAdmin" :to="{ name: 'index-explorer' }"
                    data-test="experiments-menu">
                    <font-awesome-icon icon="fa fa-vial" class="text-success" :title="$t('titles.dataExplorer', 2)" />
                    <span class="nav-title">{{ $t('titles.dataExplorer', 2) }}</span>
                </b-nav-item>
                <b-nav-item v-if="hasAnyPermission(APP_PERMISSIONS) || isAdmin" :to="{ name: 'tracks' }">
                    <font-awesome-icon icon="fa fa-microscope" class="text-success" :title="$t('titles.track', 2)" />
                    <span class="nav-title">{{ $t('titles.track', 2) }}</span>
                </b-nav-item>
                <b-nav-item v-if="hasAnyPermission(JOB_PERMISSIONS) || isAdmin" :to="{ name: 'jobs' }">
                    <font-awesome-icon icon="fa fa-tasks" class="text-success" :title="$t('titles.jobs', 2)" /> <span
                        class="nav-title">{{ $t('titles.jobs', 2) }}</span>
                </b-nav-item>
                <b-nav-item v-if="hasAnyPermission(DASHBOARD_PERMISSIONS) || isAdmin" :to="{ name: 'dashboards' }">
                    <font-awesome-icon icon="fa fa-chart-line" class="text-success"
                        :title="$t('titles.dashboard', 2)" /> <span class="nav-title">{{ $t('titles.dashboard',
                            2) }}</span>
                </b-nav-item>

                <b-nav-item-dropdown v-if="hasAnyPermission(PIPELINE) || isAdmin" right data-test="pipelines-menu">
                    <template #button-content>
                        <font-awesome-icon icon="fa fa-circle-nodes" class="text-success"
                            :title="$t('titles.pipeline', 2)" />
                        <span>{{ $t('titles.pipeline', 2) }}</span>
                    </template>
                    <li>
                        <router-link :to="{ name: 'pipelines' }" data-test="pipelines-item" class="dropdown-item">
                            {{ $t('titles.pipeline', 2) }}
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'pipelineRunsList' }" data-test="pipelineRuns-item"
                            class="dropdown-item">
                            {{ $t('titles.pipelineRuns', 2) }}
                        </router-link>
                    </li>
                </b-nav-item-dropdown>
            </b-navbar-nav>

            <b-navbar-nav class="pt-1">
                <b-nav-item-dropdown v-if="isAdmin" data-test="admin-menu" right>
                    <template #button-content>
                        <font-awesome-icon icon="fa fa-lock" class="text-success" />
                        <span>&nbsp;{{ $t('titles.administration', 2) }}</span>
                    </template>
                    <li>
                        <router-link :to="{ name: 'AdministrationUserList' }" class="dropdown-item">
                            {{ $t('titles.user', 2) }}
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'AdministrationRoleList' }" class="dropdown-item">
                            {{ $t('titles.role', 2) }}
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'configuration' }" class="dropdown-item">
                            {{ $t('titles.configuration', 2) }}
                        </router-link>
                    </li>
                    <b-dropdown-divider />
                    <li>
                        <router-link :to="{ name: 'clusters' }" class="dropdown-item">
                            {{ $t('titles.cluster', 2) }}
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'storages' }" class="dropdown-item">
                            {{ $t('titles.storage', 2) }}
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'platforms' }" class="dropdown-item">
                            {{ $t('titles.platform', 2) }}
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'models' }" class="dropdown-item">
                            {{ $t('titles.model', 2) }}
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'pipelineTemplates' }" data-test="pipelineTemplates-item"
                            class="dropdown-item">
                            Template Pipeline
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'sourceCodeList' }" class="dropdown-item">
                            Biblioteca de códigos
                        </router-link>
                    </li>
                    <b-dropdown-divider />
                    <li>
                        <router-link :to="{ name: 'deployments' }" class="dropdown-item">
                            {{ $t('titles.deployment', 2) }}
                        </router-link>
                    </li>
                    <b-dropdown-divider />
                    <li>
                        <router-link :to="{ name: 'admin-openid' }" class="dropdown-item">
                            OpenId Sandbox
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'webSocketPing' }" class="dropdown-item">
                            Test Websocket
                        </router-link>
                    </li>
                    <b-dropdown-divider />
                </b-nav-item-dropdown>
            </b-navbar-nav>
            <b-navbar-nav class="ms-auto">
                <b-nav-item-dropdown ref="dropdown" right no-caret>
                    <template #button-content>
                        <font-awesome-icon icon="fa fa-user" class="text-success" />
                    </template>

                    <b-dropdown-item style="width: 400px" class="text-center" right no-caret>
                        <font-awesome-icon icon="fa fa-user" />
                        <p>
                            <strong>{{ user.name }}</strong>
                            <br>
                            <small>{{ user.email }}</small>
                        </p>
                        <div class="text-center">
                            <strong>{{ $t('titles.role', 2) }}</strong><br>
                            <div class="mt-2">
                                <span v-for="role in userRoles" :key="role.id" class="badge badge-info me-1 p-1">
                                    {{ role.label }}
                                </span>
                            </div>
                        </div>
                        <p class="border-top pt-2">
                            <b-button variant="primary" size="sm" @click="profile">
                                {{ $t('titles.profile') }}
                            </b-button>
                            <b-button variant="danger" size="sm" class="ms-2" @click="logout">
                                {{ $t('common.logout') }}
                            </b-button>
                        </p>
                    </b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown ref="dropdown" right no-caret class="ms-auto" @show="loadNotifications">
                    <template #button-content>
                        <font-awesome-icon icon="fa fa-bell" />
                        <span v-if="unreadNotifications > 0" class="badge badge-pill"
                            :class="unreadNotifications > 0 ? 'bg-danger' : 'badge-success'">
                            {{ unreadNotifications > 99 ? '99+' : unreadNotifications }}
                        </span>
                    </template>
                    <b-dropdown-item v-for="notification in sampleNotifications" :key="notification.id"
                        style="width: 400px">
                        <div class="notification border-bottom pb-2">
                            <div><font-awesome-icon v-bind="getIcon(notification)" /></div>
                            <div :class="{ 'font-weight-bold': notification.status === 'UNREAD' }"
                                v-html="notification.text.substring(0, Math.min(notification.text.length, 200)) + (notification.text.length > 200 ? '&h e llip;' : '')" />
                        </div>
                    </b-dropdown-item>
                    <b-dropdown-item
                        @click.stop="$route.name === 'notifications' ? $router.go() : $router.push({ name: 'notifications' })">
                        {{ $t('titles.allNotifications') }} {{ $route.name === 'notifications' }}
                        <font-awesome-icon icon="fa fa-angle-right" />
                    </b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import io from 'socket.io-client';

const store = useStore();
const router = useRouter();
const route = useRoute();

const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;
const thornUrl = import.meta.env.VITE_THORN_URL;

const dropdownUser = ref(null);
const dropdownNotifications = ref(null);

const namespace = ref(standNamespace);
const unreadNotifications = ref(0);
const notifications = ref([]);
const socket = ref(null);
const room = ref(null);

const APP_PERMISSIONS = ['APP_EDIT', 'APP_USE'];
const PIPELINE = ['PIPELINE', 'PIPELINE_RUN'];
const DASHBOARD_PERMISSIONS = ['DASHBOARD_EDIT', 'DASHBOARD_EDIT_ANY', 'DASHBOARD_VIEW', 'DASHBOARD_VIEW_ANY'];
const DATA_SOURCE_PERMISSIONS = ['DATA_SOURCE_EDIT', 'DATA_SOURCE_LIST', 'DATA_SOURCE_VIEW', 'DATA_SOURCE_EDIT_ANY', 'DATA_SOURCE_VIEW_ANY', 'DATA_SOURCE_USE', 'DATA_SOURCE_USE_ANY'];
const DEPLOYMENT_PERMISSIONS = ['DEPLOYMENT_MANAGE'];
const JOB_PERMISSIONS = ['JOB_EDIT_ANY', 'RUN_WORKFLOW_API', 'JOB_VIEW_ANY'];
const SYSTEM_PERMISSIONS = ['ADMINISTRATOR', 'STORAGE_MANAGE', 'CLUSTER_MANAGE'];
const USER_PERMISSIONS = ['USER_MANAGE'];
const WORKFLOW_PERMISSIONS = ['WORKFLOW_EDIT', 'WORKFLOW_LIST', 'WORKFLOW_VIEW', 'WORKFLOW_EDIT_ANY', 'WORKFLOW_VIEW_ANY', 'WORKFLOW_EXECUTE', 'WORKFLOW_EXECUTE_ANY'];

const hasAnyPermission = computed(() => (permissions) => store.getters.hasAnyPermission(permissions));
const isAdmin = computed(() => store.getters.isAdmin);
const user = computed(() => store.getters.user);
const sampleNotifications = computed(() => notifications.value.length > 5 ? notifications.value.slice(0, 5) : notifications.value);
const userRoles = computed(() => Object.values(user.value.roles.reduce((acc, role) => {
    acc[role.id] = role;
    return acc;
}, {})));

const getIcon = (notification) => {
    switch (notification.type) {
        case 'INFO':
            return { icon: 'fa-info-circle', class: 'text-success' };
        case 'WARNING':
            return { icon: 'fa-exclamation-triangle', class: 'text-warning' };
        default:
            return { icon: 'fa-exclamation-circle', class: 'text-danger' };
    }
};

const logout = () => {
    if (window.$openIdService?.enabled) {
        window.$openIdService.logout();
    } else {
        router.push({ name: 'logout' });
    }
};

const profile = () => {
    if (dropdownUser.value) {
        dropdownUser.value.hide(); 
    }
    router.push({ name: 'profile' });
};

const loadNotifications = async () => {
    const params = {
        page: 1,
        size: 10,
        sort: 'created',
        asc: 'false',
    };
    try {
        const resp = await axios.get(`${thornUrl}/notifications`, { params });
        notifications.value = resp.data.data;
    } catch (error) {
        console.error('Failed to load notifications:', error);
    }
};

onMounted(() => {
    room.value = `users/${user.value.id}`;

    // Lógica do WebSocket
    if (false) { // A condição 'if(false)' faz com que o código do WebSocket não seja executado
        const opts = { upgrade: true };
        if (standSocketIoPath !== '') {
            opts.path = standSocketIoPath;
        }
        const newSocket = io(`${standSocketServer}${standNamespace}`, opts);
        socket.value = newSocket;

        newSocket.on('connect', () => {
            newSocket.emit('join', { room: room.value });
        });

        newSocket.on('notifications', (msg) => {
            unreadNotifications.value = msg.unread;
            msg.notification && notifications.value.unshift(msg.notification);
        });

        newSocket.on('connect_error', () => {
            console.debug('Web socket server offline');
        });

        newSocket.on('disconnect', () => {
            console.debug('You are not connected');
        });
    }

    axios.get(`${thornUrl}/notifications/summary`)
        .then(resp => {
            unreadNotifications.value = resp.data.unread;
        })
        .catch(error => {
            console.error('Failed to load notification summary:', error);
        });
});

onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.emit('leave', { room: room.value });
        socket.value.close();
    }
});
</script>

<style lang="scss">
/*
#l-navbar {
    background-color: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, .16);
}

#l-navbar .dropdown-divider {
    margin: 0;
}
*/
.nav-item a,
.nav-item .btn-group {
    margin-top: 1px;
    font-size: .9em;
}

.nav-item span {
    margin-left: 5px;

}

@media (max-width: 1250px) {
    a.nav-link {
        margin: 5px 0px 0 1px;
        background: #fcfcfc;

    }

    .nav-item .btn-group {
        margin: 5px 0px 0 1px;
        background: fcfcfc;
    }

    .nav-item svg {
        zoom: 160%;
    }

    .nav-item .btn-group svg {
        zoom: 160%;
    }

    .nav-item span {
        display: none
    }

    .full_logo {
        display: none;
    }

    .icon_logo {
        display: block;
    }
}

@media (max-width: 768px) {
    .full_logo {
        display: block;
    }

    .icon_logo {
        display: none;
    }

    .nav-item span {
        display: inline
    }
}

.navbar-brand {
    text-align: center;

    .full_logo {
        display: block;
    }

    .icon_logo {
        display: none;
    }

    margin-right: 0 !important;

    @media (max-width: 1140px) {}

    @media (max-width: 768px) {
        .full_logo {
            display: block;
        }

        .icon_logo {
            display: none;
        }

        .nav-item span {
            display: block
        }
    }
}

/*
#l-navbar a.nav-link {
    font-weight: 500;
    font-size: 14px;
}

#l-navbar a.nav-link span {
    color: var(--primary-color);
}

#l-navbar .bg-dark {
    background-color: #24292e;
}

#l-navbar .dropdown-menu {
    font-size: 14px;
}

.navbar .nav-item {
    margin: 0;
    padding: 0;
}
.navbar .nav-item .nav-link {
    line-height: calc(60px - 4px);
    padding: 0 .5rem;
    border-bottom: solid 4px #FFFFFF00;
    white-space: nowrap;

    @media (max-width: 1000px) {
        padding: 0 .5rem;

        span {
            xdisplay: none;
        }
    }

    @media (max-width: 870px) {
        //padding: 0 .25rem;
    }
}

*/


.badge {
    color: #FFF !important;
    transform: translate(-3px, -9px);
}

/*@media (max-width: 1140px) {

        .navbar .nav-item .nav-link span {
            display: none;
        }
        .navbar .nav-item .nav-link span {
            display: none;
        }
    }
    */

/*
@media (min-width: 768px) {
    .navbar-collapse {
        height: 60px;
        margin: -0.5rem 0;
    }

    .navbar-nav {
        height: 100%;
    }
}

#l-navbar .avatar,
.large-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #888;
    margin-right: 5px;
    vertical-align: middle;
}

.large-avatar {
    width: 48px;
    height: auto;
}

#l-navbar .navbar-toggler {
    border-width: 0;
}

.dropdown-menu>li>a:hover {
    color: #007bff;
}

.dropdown-menu>li>a:active {
    color: white;
}
*/

.unread {
    font-weight: bold;
}

.notification-container {
    height: 300px;
    overflow: auto;
}

.notification {
    white-space: break-spaces !important;
    font-size: .9em;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
}

.notification p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 75ch;
}

.navbar-nav .nav-link:hover {
    border-bottom: 2px solid var(--secondary-color);
    border-radius: 0;
}

.navbar-nav .nav-link {
    border-bottom: 2px solid transparent;
}
</style>
