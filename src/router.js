import Vue from 'vue';
import Router from 'vue-router';

import Administration from './views/Administration.vue';

// import ProjectList from './views/Administration/ProjectList.vue';
// import ProjectAdd from './views/Administration/ProjectAdd.vue';
// import ProjectShow from './views/Administration/ProjectShow.vue';
// import ProjectEdit from './views/Administration/ProjectEdit.vue';

// import TeamList from './views/Administration/TeamList.vue';
// import TeamShow from './views/Administration/TeamShow.vue';

import ChangePassword from './views/ChangePassword.vue';
import Login from './views/Login.vue';
import Logout from './views/Logout.vue';
import Register from './views/Register.vue';
import ResetPassword from './views/ResetPassword.vue';

import DataSourceList from './views/DataSourceList.vue';
import DataSourceEdit from './views/DataSourceEdit.vue';
import DataSourceAdd from './views/DataSourceAdd.vue';

import JobList from './views/JobList.vue';
import JobDetail from './views/JobDetail.vue';

import WorkflowList from './views/WorkflowList.vue';
import WorkflowEdit from './views/WorkflowEdit.vue';
import WorkflowAdd from './views/WorkflowAdd.vue';

import TrackList from './views/TrackList.vue';

import NotebookEdit from './views/NotebookEdit.vue';

import OperationList from './views/OperationList.vue';
import Profile from './views/Profile.vue';
import About from './views/About.vue';

import PageNotFound from './views/PageNotFound.vue';

// Lazy routes
const Home =  () => import(/* webpackChunkName: "group-global" */ './views/Home.vue');
const Index =  () => import(/* webpackChunkName: "group-global" */ './views/Index.vue');
const TermsOfService = () => import(/* webpackChunkName: "group-global" */ './views/TermsOfService.vue');
const Welcome = () => import(/* webpackChunkName: "group-global" */ './views/Welcome.vue');

const ConfigurationList = () => import(/* webpackChunkName: "group-configuration" */ './views/ConfigurationList.vue');

const RoleList = () => import(/* webpackChunkName: "group-role" */ './views/Administration/RoleList.vue');
const RoleEdit = () => import(/* webpackChunkName: "group-app" */ './views/Administration/RoleEdit.vue');

const UserList = () => import(/* webpackChunkName: "group-user" */ './views/Administration/UserList.vue');
const UserAdd = () => import(/* webpackChunkName: "group-user" */ './views/Administration/UserAdd.vue');
const UserEdit = () => import(/* webpackChunkName: "group-user" */ './views/Administration/UserEdit.vue');

const ClusterList = () => import(/* webpackChunkName: "group-cluster" */ './views/Administration/ClusterList.vue');
const ClusterEdit = () => import(/* webpackChunkName: "group-cluster" */ './views/Administration/ClusterEdit.vue');

const StorageList = () => import(/* webpackChunkName: "group-storage" */ './views/Administration/StorageList.vue');
const StorageEdit = () => import(/* webpackChunkName: "group-storage" */ './views/Administration/StorageEdit.vue');

const ModelList = () => import(/* webpackChunkName: "group-model" */ './views/ModelList.vue');
const ModelAdd = () => import(/* webpackChunkName: "group-model" */ './views/ModelAdd.vue');
const ModelEdit = () => import(/* webpackChunkName: "group-model" */ './views/ModelEdit.vue');

const DashboardList = () => import(/* webpackChunkName: "group-dashboard" */ './views/DashboardList.vue');
const DashboardDetail = () => import(/* webpackChunkName: "group-dashboard" */ './views/DashboardDetail.vue');
const DashboardBuilder = () => import(/* webpackChunkName: "group-dashboard" */ './views/DashboardBuilder.vue');
const WebSocketPing = () => import(/* webpackChunkName: "group-util" */'./views/WebSocketPing.vue');
const JsPlumbSandbox = () => import(/* webpackChunkName: "group-util" */'./views/JsPlumbSandbox.vue');
const OpenIdSandbox = () => import(/* webpackChunkName: "group-util" */'./views/OpenIdSandbox.vue');
const QueryEdit = () => import(/* webpackChunkName: "group-util" */ './views/query/QueryEdit.vue');

const NotificationList = () => import(/* webpackChunkName: "group-notification" */ './views/NotificationList.vue');

const PlatformList = () => import(/* webpackChunkName: "group-platform" */ './views/Administration/PlatformList.vue');
const PlatformAdd = () => import(/* webpackChunkName: "group-platform" */ './views/Administration/PlatformAdd.vue');
const PlatformEdit = () => import(/* webpackChunkName: "group-platform" */ './views/Administration/PlatformEdit.vue');

const TrackPanel = () => import(/* webpackChunkName: "group-app" */ './views/TrackPanel.vue');
const Track = () => import(/* webpackChunkName: "group-app" */'./views/Track.vue');
const TrackAdd = () => import(/* webpackChunkName: "group-app" */'./views/TrackAdd.vue');

const DisplayHtml = () => import(/* webpackChunkName: "group-app" */'./views/DisplayHtml.vue');


Vue.use(Router);

let router = new Router({
    //mode: 'hash',
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
            meta: {
                requiresAuth: false,
                title: ['titles.home', 1]
            }
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            meta: {
                requiresAuth: true,
                title: ['titles.home', 1]
            }
        },
        {
            path: '/query',
            name: 'queryEdit',
            component: QueryEdit,
            meta: {
                requiresAuth: true,
                title: ['titles.query', 1]
            }
        },

        {
            path: '/administration',
            name: 'administration',
            component: Administration,
            meta: {
                requiresAuth: true,
                requiresRole: true,
                title: ['titles.administration', 1]
            }
        },
        {
            path: '/administration/roles',
            name: 'AdministrationRoleList',
            component: RoleList,
            meta: {
                requiresAuth: true,
                requiresRole: true,
                title: ['titles.role', 2]
            }
        },
        {
            path: '/administration/roles/new',
            name: 'AdministrationAddRole',
            component: RoleEdit,
            props: { add: true },
            meta: {
                requiresAuth: true,
                requiresRole: true,
                title: ['titles.role', 2]
            }
        },
        {
            path: '/administration/roles/:id/edit',
            name: 'AdministrationEditRole',
            component: RoleEdit,
            meta: {
                requiresAuth: true,
                requiresRole: true,
                title: ['titles.role', 2]
            }
        },

        {
            path: '/administration/users',
            name: 'AdministrationUserList',
            component: UserList,
            meta: {
                requiresAuth: true,
                requiresRole: true,
                title: ['titles.user', 2]
            }
        },
        {
            path: '/administration/users/new',
            name: 'AdministrationAddUser',
            component: UserAdd,
            meta: {
                requiresAuth: true,
                requiresRole: true,
                title: ['titles.user', 1]
            }
        },
        {
            path: '/administration/users/:id/edit',
            name: 'AdministrationEditUser',
            component: UserEdit,
            meta: {
                requiresAuth: true,
                requiresRole: true,
                title: ['titles.user', 1]
            }
        },
        // {
        //   path: '/administration/projects',
        //   name: 'AdministrationProjectList',
        //   component: ProjectList,
        //   meta: {
        //     requiresAuth: true,notebook
        //     requiresRole: truenotebook
        //   }notebook
        // },notebook
        // {notebook
        //   path: '/administrationotebookn/projects/new',
        //   name: 'AdministrationnotebookAddProject',
        //   component: ProjectAddnotebook,
        //   meta: {
        //     requiresAuth: true,
        //     requiresRole: true
        //   }
        // },
        // {
        //   path: '/administration/projects/:id',
        //   name: 'AdministrationShowProject',
        //   component: ProjectShow,
        //   meta: {
        //     requiresAuth: true,
        //     requiresRole: true
        //   }
        // },
        // {
        //   path: '/administration/projects/:id/edit',
        //   name: 'AdministrationEditProject',
        //   component: ProjectEdit,
        //   meta: {
        //     requiresAuth: true,
        //     requiresRole: true
        //   }
        // },
        // {
        //   path: '/administration/teams',
        //   name: 'AdministrationTeamList',
        //   component: TeamList,
        //   meta: {
        //     requiresAuth: true,
        //     requiresRole: true
        //   }
        // },
        // {
        //   path: '/administration/teams/:id',
        //   name: 'AdministrationShowTeam',
        //   component: TeamShow,
        //   meta: {
        //     requiresAuth: true,
        //     requiresRole: true
        //   }
        // },
        //
        {
            path: '/administration/configuration',
            name: 'configuration',
            component: ConfigurationList,
            meta: {
                title: ['titles.configuration', 1],
                requiresAuth: true,
            }
        },

        {
            path: '/data-sources',
            name: 'dataSources',
            component: DataSourceList,
            meta: {
                requiresAuth: true,
                title: ['titles.dataSource', 2]
            }
        },
        {
            path: '/data-sources/add',
            name: 'addDataSource',
            component: DataSourceAdd,
            meta: {
                requiresAuth: true,
                title: ['titles.dataSource', 1]
            }
        },
        {
            path: '/data-sources/:id',
            name: 'editDataSource',
            component: DataSourceEdit,
            meta: {
                requiresAuth: true,
                title: ['titles.dataSource', 1]
            }
        },
        {
            path: '/display/:id',
            name: 'displayHtml',
            component: DisplayHtml,
            meta: {
                requiresAuth: true,
            }
        },

        {
            path: '/models',
            name: 'models',
            component: ModelList,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/models/add',
            name: 'addModel',
            component: ModelAdd,
            meta: {
                requiresAuth: true,
                title: ['titles.model', 2]
            }
        },
        {
            path: '/model/:id',
            name: 'editModel',
            component: ModelEdit,
            meta: {
                requiresAuth: true,
                title: ['titles.model', 1]
            }
        },
        {
            path: '/notifications',
            name: 'notifications',
            component: NotificationList,
            meta: {
                requiresAuth: true,
                title: ['titles.notification', 2]
            }
        },
        {
            path: '/jobs',
            name: 'jobs',
            component: JobList,
            meta: {
                requiresAuth: true,
                title: ['titles.job', 2]
            }
        },
        {
            path: '/jobs/:platform/:id',
            name: 'jobDetail',
            component: JobDetail,
            meta: {
                requiresAuth: true,
                title: ['titles.job', 1]
            }
        },
        {
            path: '/apps',
            name: 'tracks',
            component: TrackPanel,
            meta: {
                requiresAuth: true,
                title: ['titles.track', 2]
            }
        },
        {
            path: '/apps/add',
            name: 'addTrack',
            component: TrackAdd,
            meta: {
                requiresAuth: true,
                title: ['titles.track', 2]
            }
        },
        {
            path: '/apps/params/:id',
            name: 'trackParameter',
            component: Track,
            meta: {
                requiresAuth: true,
                title: ['titles.track', 2]
            }
        },
        /*{
            path: '/apps/panel',
            name: 'apps',
            component: TrackList,
            meta: {
                requiresAuth: true,
                title: ['titles.track', 2]
            }
        },*/
        {
            path: '/workflows',
            name: 'workflows',
            component: WorkflowList,
            meta: {
                requiresAuth: true,
                title: ['titles.workflow', 2]
            }
        },
        {
            path: '/workflows/:platform/:id',
            name: 'editWorkflow',
            component: WorkflowEdit,
            meta: {
                requiresAuth: true,
                title: ['titles.workflow', 1]
            }
        },
        {
            path: '/workflows/add',
            name: 'addWorkflow',
            component: WorkflowAdd,
            meta: {
                requiresAuth: true,
                title: ['titles.workflow', 1]
            }
        },
        {
            path: '/notebook/:platform/:id',
            name: 'editNotebook',
            component: NotebookEdit,
            meta: {
                requiresAuth: true,
                title: ['titles.notebook', 1]
            }
        },
        // start dashboards
        {
            path: '/dashboards',
            name: 'dashboards',
            component: DashboardList,
            meta: {
                requiresAuth: true,
                title: ['titles.dashboard', 2]
            }
        },
        {
            path: '/dashboards/detail/:id',
            name: 'dashboardDetail',
            component: DashboardDetail,
            meta: {
                requiresAuth: true,
                title: ['titles.dashboard', 1]
            }
        },
        {
            path: '/public/dashboard/:hash',
            name: 'publicDashboard',
            component: DashboardDetail,
            meta: {
                requiresAuth: false,
                title: ['titles.dashboard', 1]
            }
        },
        {
            path: '/dashboards/builder',
            name: 'dashboardBuilder',
            component: DashboardBuilder,
            meta: {
                requiresAuth: false,
                title: ['titles.dashboard', 1]
            }
        },
        {
            path: '/user/profile',
            name: 'profile',
            component: Profile,
            meta: {
                requiresAuth: true,
                title: ['titles.profile', 1]
            }
        },
        {
            path: '/change-password/:id/:token',
            name: 'change_password',
            component: ChangePassword,
            meta: {
                title: ['titles.changePassword', 1]
            }
        },
        {
            path: '/auth/login',
            name: 'login',
            component: Login,
            meta: {
                title: ['titles.login', 1],
                requiresAuth: false
            }
        },
        {
            path: '/logout',
            name: 'logout',
            component: Logout
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
            meta: {
                title: ['titles.register', 1]
            }
        },
        {
            path: '/welcome',
            name: 'welcome',
            component: Welcome,
            meta: {
                title: ['titles.welcome', 1]
            }
        },

        {
            path: '/reset-password',
            name: 'reset_password',
            component: ResetPassword,
            meta: {
                title: ['titles.resetPassword', 2]
            }
        },
        {
            path: '/about',
            name: 'about',
            component: About,
            meta: {
                title: ['titles.lemonade', 1]
            }
        },
        {
            path: '/administration/operations',
            name: 'operations',
            component: OperationList,
            meta: {
                requiresAuth: true,
                requiresRole: true
            }
        },
        {
            path: '/administration/clusters',
            name: 'clusters',
            component: ClusterList,
            meta: {
                requiresAuth: true,
                title: ['titles.cluster', 2]
            }
        },
        {
            path: '/administration/clusters/add',
            name: 'addCluster',
            props: { add: true },
            component: ClusterEdit,
            meta: {
                requiresAuth: true,
                title: ['titles.cluster', 1]
            }
        },
        {
            path: '/administration/clusters/:id',
            name: 'editCluster',
            component: ClusterEdit,
            meta: {
                requiresAuth: true,
                title: ['titles.cluster', 1]
            }
        },
        {
            path: '/administration/storages',
            name: 'storages',
            component: StorageList,
            meta: {
                requiresAuth: true,
                title: ['titles.storage', 2]
            }
        },
        {
            path: '/administration/storages/add',
            name: 'addStorage',
            props: { add: true },
            component: StorageEdit,
            meta: {
                requiresAuth: true,
                title: ['titles.storage', 1]
            }
        },
        {
            path: '/administration/storages/:id',
            name: 'editStorage',
            component: StorageEdit,
            meta: {
                requiresAuth: true,
                title: ['titles.storage', 1]
            }
        },

        {
            path: '/administration/platforms',
            name: 'platforms',
            component: PlatformList,
            meta: {
                requiresAuth: true,
                title: ['titles.platform', 2]
            }
        },
        {
            path: '/administration/platform/add',
            name: 'addPlatform',
            component: PlatformAdd,
            meta: {
                requiresAuth: true,
                title: ['titles.platform', 1]
            }
        },
        {
            path: '/administration/platform/:id',
            name: 'editPlatform',
            component: PlatformEdit,
            meta: {
                requiresAuth: true,
                title: ['titles.platform', 1]
            }
        },
        {
            path: '/conditions',
            name: 'conditions',
            component: TermsOfService,
            meta: {
                title: ['titles.termsOfService', 2]
            }
        },
        {
            path: '/admin/ws-ping',
            name: 'webSocketPing',
            component: WebSocketPing,
            meta: {
                requiresAuth: true,
                title: ['titles.admin', 1]
            }
        },
        {
            path: '/admin/sandbox',
            name: 'jsplumb-sandbox',
            component: JsPlumbSandbox,
            meta: {
                requiresAuth: true,
                title: ['titles.admin', 1]
            }
        },
        {
            path: '/admin/openid',
            name: 'admin-openid',
            component: OpenIdSandbox,
            meta: {
                requiresAuth: false,
                title: ['titles.admin', 1]
            }
        },
        {
            path: '*',
            name: 'not-found',
            component: PageNotFound,
            meta: {
                title: ['titles.notFound']
            }
        }
    ]
});
router.onError(error => {
    if (/loading chunk \d* failed./i.test(error.message)) {
        window.location.reload()
    }
});
export default router;
