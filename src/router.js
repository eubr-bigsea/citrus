import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import Administration from './views/Administration.vue';

import userList from './views/Administration/UserList.vue';
import userAdd from './views/Administration/UserAdd.vue';
import userEdit from './views/Administration/UserEdit.vue';

import ProjectList from './views/Administration/ProjectList.vue';
import ProjectAdd from './views/Administration/ProjectAdd.vue';
import ProjectShow from './views/Administration/ProjectShow.vue';
import ProjectEdit from './views/Administration/ProjectEdit.vue';

import TeamList from './views/Administration/TeamList.vue';
import TeamShow from './views/Administration/TeamShow.vue';

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

import DashboardList from './views/DashboardList.vue';
import DashboardDetail from './views/DashboardDetail.vue';

import OperationList from './views/OperationList.vue';

import Profile from './views/Profile.vue';

import About from './views/About.vue';

import store from './store.js';

Vue.use(Router);

let router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/administration',
      name: 'administration',
      component: Administration,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    },
    {
      path: '/administration/users',
      name: 'AdministrationUserList',
      component: userList,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    },
    {
      path: '/administration/users/new',
      name: 'AdministrationAddUser',
      component: userAdd,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    },
    {
      path: '/administration/users/:id/edit',
      name: 'AdministrationEditUser',
      component: userEdit,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    },
    {
      path: '/administration/projects',
      name: 'AdministrationProjectList',
      component: ProjectList,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    },
    {
      path: '/administration/projects/new',
      name: 'AdministrationAddProject',
      component: ProjectAdd,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    },
    {
      path: '/administration/projects/:id',
      name: 'AdministrationShowProject',
      component: ProjectShow,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    },
    {
      path: '/administration/projects/:id/edit',
      name: 'AdministrationEditProject',
      component: ProjectEdit,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    },
    {
      path: '/administration/teams',
      name: 'AdministrationTeamList',
      component: TeamList,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    },
    {
      path: '/administration/teams/:id',
      name: 'AdministrationShowTeam',
      component: TeamShow,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    },
    {
      path: '/administration/projects/:id/edit',
      name: 'AdministrationEditProject',
      component: ProjectEdit,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    },
    {
      path: '/data-sources',
      name: 'dataSources',
      component: DataSourceList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/data-sources/add',
      name: 'addDataSource',
      component: DataSourceAdd,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/data-sources/:id',
      name: 'editDataSource',
      component: DataSourceEdit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/jobs/:platform/:id',
      name: 'jobDetail',
      component: JobDetail,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/workflows',
      name: 'workflows',
      component: WorkflowList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/workflows/:platform/:id',
      name: 'editWorkflow',
      component: WorkflowEdit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/workflows/add',
      name: 'addWorkflow',
      component: WorkflowAdd,
      meta: {
        requiresAuth: true
      }
    },
    // start dashboards
    {
      path: '/dashboards',
      name: 'dashboards',
      component: DashboardList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboards/:id',
      name: 'dashboardDetail',
      component: DashboardDetail,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user/profile',
      name: 'profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/change_password',
      name: 'change_password',
      component: ChangePassword
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/reset_password',
      name: 'reset_password',
      component: ResetPassword
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/admin/operations',
      name: 'operations',
      component: OperationList,
      meta: {
        requiresAuth: true,
        requiresRole: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      if (to.matched.some(record => record.meta.requiresRole)) {
        if (store.getters.hasRoles) {
          next();
          return;
        } else {
          next('/');
        }
      }
      next();
      return;
    }
    next('/login');
  } else {
    next();
  }
});

export default router;
