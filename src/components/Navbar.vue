<template>
    <b-navbar id="l-navbar" toggleable="md" sticky>
        <b-navbar-toggle target="nav_collapse" />
        <b-navbar-brand :to="{ name: 'home' }">
            <img class="full_logo" src="../assets/lemonade_logo.svg" width="157" height="32" alt="Lemonade">
            <img class="icon_logo" src="../assets/lemonade_icon.svg" width="25" height="32" alt="Lemonade">
        </b-navbar-brand>
        <b-collapse id="nav_collapse" is-nav>
            <b-navbar-nav class="pt-1">
                <b-nav-item v-if="hasAnyPermission(DATA_SOURCE_PERMISSIONS) || isAdmin" :to="{ name: 'dataSources' }">
                    <font-awesome-icon icon="fa fa-database" class="text-success" /> {{ $tc('titles.dataSource', 2) }}
                </b-nav-item>
                <b-nav-item v-if="hasAnyPermission(WORKFLOW_PERMISSIONS) || isAdmin" :to="{ name: 'workflows' }">
                    <font-awesome-icon icon="fa fa-flask" class="text-success" /> {{ $tc('titles.workflow', 2) }}
                </b-nav-item>
                <b-nav-item v-if="hasAnyPermission(APP_PERMISSIONS) || isAdmin" :to="{ name: 'index-explorer' }">
                    <font-awesome-icon icon="fa fa-vial" class="text-success" /> {{ $tc('titles.dataExplorer', 2) }}
                </b-nav-item>
                <b-nav-item v-if="hasAnyPermission(APP_PERMISSIONS) || isAdmin" :to="{ name: 'tracks' }">
                    <font-awesome-icon icon="fa fa-microscope" class="text-success" /> {{ $tc('titles.track', 2) }}
                </b-nav-item>
                <b-nav-item v-if="hasAnyPermission(JOB_PERMISSIONS) || isAdmin" :to="{ name: 'jobs' }">
                    <font-awesome-icon icon="fa fa-tasks" class="text-success" /> {{ $tc('titles.jobs', 2) }}
                </b-nav-item>
                <b-nav-item v-if="hasAnyPermission(DASHBOARD_PERMISSIONS) || isAdmin" :to="{ name: 'dashboards' }">
                    <font-awesome-icon icon="fa fa-chart-line" class="text-success" /> {{ $tc('titles.dashboard', 2) }}
                </b-nav-item>

                <b-nav-item-dropdown v-if="isAdmin" right>
                    <template v-slot:button-content>
                        <font-awesome-icon icon="fa fa-user-lock" class="text-success" />
                        {{$tc('titles.administration', 2)}}
                    </template>
                    <b-dropdown-item :to="{ name: 'AdministrationUserList' }">
                        {{ $tc('titles.user', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-item :to="{ name: 'AdministrationRoleList' }">
                        {{ $tc('titles.role', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-item :to="{ name: 'configuration' }">
                        {{ $tc('titles.configuration', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item :to="{ name: 'clusters' }">
                        {{ $tc('titles.cluster', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-item :to="{ name: 'storages' }">
                        {{ $tc('titles.storage', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-item :to="{ name: 'platforms' }">
                        {{ $tc('titles.platform', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-item :to="{ name: 'models' }">
                        {{ $tc('titles.model', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item :to="{ name: 'deployments' }">
                        {{ $tc('titles.deployment', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item :to="{ name: 'admin-openid' }">
                        OpenId Sandbox
                    </b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <!--
                <b-nav-item-dropdown right ref="dropdown" @show="loadNotifications">
                    <template slot="button-content">
                        <font-awesome-icon icon="fa fa-bell" />

                        <span class="badge badge-pill"
                            :class="unreadNotifications > 0 ? 'badge-danger': 'badge-success'">
                            {{unreadNotifications > 99 ? '99+': unreadNotifications}}
                        </span>
                    </template>
                    <div class="notification-container">
                        <b-dropdown-item v-for="notification in notifications" style="width: 300px"
                            :key="notification.id">
                            <div class="notification border-bottom pb-2">
                                <span class="badge"
                                    :class="{'badge-success': notification.type === 'INFO', 'badge-warning': notification.type === 'WARNING', 'badge-danger': notification.type === 'ERROR'}">
                                    &nbsp;{{$t('titles.' + notification.type.toLowerCase()).toUpperCase()}}
                                </span>
                                <span class="notification" :class="{'unread': notification.status === 'UNREAD'}">
                                    {{notification.created|formatJsonDate}}
                                </span>
                                <div class="notification" :class="{'unread': notification.status === 'UNREAD'}"
                                    v-html="notification.text.substring(0, Math.min(notification.text.length, 500))">
                                </div>
                            </div>
                        </b-dropdown-item>
                    </div>
                    <b-dropdown-item :to="{ name: 'notifications' }" class="border-top pt-2">
                        {{ $t('titles.allNotifications') }}
                        <font-awesome-icon icon="fa fa-angle-right" />
                    </b-dropdown-item>
                </b-nav-item-dropdown>
            -->
            </b-navbar-nav>
            <b-navbar-nav class="pt-1">
                <b-nav-item-dropdown ref="dropdown" right>
                    <template slot="button-content">
                        <font-awesome-icon icon="fa fa-user"  class="text-success"/>
                        {{ user.name ? user.name.split(' ')[0]: '' }}
                    </template>

                    <b-dropdown-form style="width: 300px" class="text-center">
                        <font-awesome-icon icon="fa fa-user" />
                        <p>
                            <strong>{{user.name}}</strong>
                            <br />
                            <small>{{user.email}}</small>
                        </p>
                        <div class="text-center">
                            <strong>{{$tc('titles.role', 2)}}</strong><br />
                            <div class="mt-2">
                                <span v-for="role in user.roles" :key="role.id" class="badge badge-info mr-1 p-1">
                                    {{role.label}}
                                </span>
                            </div>
                        </div>
                        <p class="border-top pt-2">
                            <b-button variant="primary" size="sm" @click="profile">{{ $t('titles.profile') }}</b-button>
                            <b-button variant="danger" size="sm" class="ml-2" @click="logout">
                                {{ $t('common.logout') }}</b-button>
                        </p>
                    </b-dropdown-form>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    import { mapGetters } from 'vuex';

    import axios from 'axios';
    const standNamespace = process.env.VUE_APP_STAND_NAMESPACE;
    const thornUrl = process.env.VUE_APP_THORN_URL;

    export default {
        name: 'LNavbar',
        components: {},
        data() {
            return {
                namespace: standNamespace,
                unreadNotifications: 0,
                notifications: [],
                socket: null,
                room: null,
                APP_PERMISSIONS: ['APP_EDIT', 'APP_USE'],
                DASHBOARD_PERMISSIONS: ['DASHBOARD_EDIT', 'DASHBOARD_EDIT_ANY',
                    'DASHBOARD_VIEW', 'DASHBOARD_VIEW_ANY'],
                DATA_SOURCE_PERMISSIONS: ['DATA_SOURCE_EDIT', 'DATA_SOURCE_LIST',
                    'DATA_SOURCE_VIEW', 'DATA_SOURCE_EDIT_ANY', 'DATA_SOURCE_VIEW_ANY',
                    'DATA_SOURCE_USE', 'DATA_SOURCE_USE_ANY'],
                DEPLOYMENT_PERMISSIONS: ['DEPLOYMENT_MANAGE'],
                JOB_PERMISSIONS: ['JOB_EDIT_ANY', 'RUN_WORKFLOW_API', 'JOB_VIEW_ANY'],
                SYSTEM_PERMISSIONS: ['ADMINISTRATOR', 'STORAGE_MANAGE', 'CLUSTER_MANAGE'],
                USER_PERMISSIONS: ['USER_MANAGE'],
                WORKFLOW_PERMISSIONS: ['WORKFLOW_EDIT', 'WORKFLOW_LIST',
                    'WORKFLOW_VIEW', 'WORKFLOW_EDIT_ANY', 'WORKFLOW_VIEW_ANY',
                    'WORKFLOW_EXECUTE', 'WORKFLOW_EXECUTE_ANY'],

            }
        },
        computed: {
            ...mapGetters(['hasAnyRole', 'hasAnyPermission', 'isAdmin', 'isManager', 'isMonitor', 'user'])
        },
        mounted() {
            this.room = `user:${this.user.id}`;
            this.room = "user:1"
            /*
            const socket = io(this.namespace, {
                upgrade: true,
            });
            self.socket = socket;
            socket.on('connect', () => {
                console.debug("Notification connected to room " + this.room);
                console.debug(socket.emit('join', { room: this.room }));
                self.socket = socket;
            });
            socket.on('notifications', (msg) => {
                console.debug(msg)
                this.unreadNotifications = msg.unread;
            });
            socket.on('connect_error', () => {
                console.debug('Web socket server offline');
            });

            socket.on('disconnect', () => {
                console.debug('You are not connected');
            });

            socket.on('response', (msg) => {
                console.debug(msg)
            });
            axios.get(`${thornUrl}/notifications/summary`)
                .then(resp => {
                    this.unreadNotifications = resp.data.unread;
                });
            */
        },
        beforeDestroy() {
            if (this.socket) {
                this.socket.emit('leave', { room: this.room });
                this.socket.close();
            }
        },
        methods: {
            logout() {
                if (this.$openIdService.enabled) {
                    this.$openIdService.logout();
                } else {
                    this.$router.push({ name: 'logout' });
                }
            },
            profile() {
                this.$refs.dropdown.hide(true);
                this.$router.push({ name: 'profile' });
            },
            loadNotifications() {
                const params = {
                    page: 1,
                    size: 10,
                    sort: 'created',
                    asc: 'false',
                };
                axios.get(`${thornUrl}/notifications`, { params })
                    .then(resp => {
                        this.notifications = resp.data.data;
                    });
            }
        },

    };
</script>

<style lang="scss">
    #l-navbar {
        background-color: #fff;
        box-shadow: 0 0 8px rgba(0, 0, 0, .16);
    }

    #l-navbar .dropdown-divider {
        margin: 0;
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

        @media (max-width: 1140px) {


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
        }
    }

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

    .navbar .nav-item .nav-link:hover {
        border-bottom-color: var(--secondary-color);
    }

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
    }

    .notification p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 75ch;
    }
</style>