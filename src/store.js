import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);
const FEATURES_PERMISSIONS = {
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
export default new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user') || '{}')
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading';
        },
        auth_success(state, { token, user }) {
            state.status = 'success';
            state.token = token;
            state.user = user;
        },
        auth_error(state) {
            state.status = 'error';
        },
        reset_password_request(state) {
            state.status = 'loading';
        },
        reset_password_success(state) {
            state.status = 'success';
        },
        reset_password_error(state) {
            state.status = 'error';
        },
        logout(state) {
            state.status = '';
            state.token = '';
        },
        register_error(err) {
            console.error(err);
        },
        register_request(user) {
            console.info('User', user);
        },
        change_profile_success(state, { user, token }) {
            state.user.email = user.email;
            state.user.login = user.login;
            state.user.locale = user.locale;
            state.user.roles = user.roles || [];
            state.status = 'success';
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
            if (token){
                this.state.token = token;
                localStorage.setItem('token', token);
            }
        }
    },
    actions: {
        setUser({commit}, {user, token}){
            commit('change_profile_success', { user, token });
        },
        changeProfile({ commit }, params) {
            return new Promise((resolve, reject) => {
                const url = `${params.thornUrl}/users/me`;
                const headers = { Accept: 'application/json; charset=utf-8' };
                axios({ url, data: params.user, method: 'PATCH', headers })
                    .then(resp => {
                        const userData = resp.data.data[0];
                        const user = {
                            id: userData.id,
                            email: userData.email,
                            locale: userData.locale,
                            login: userData.email,
                            name: `${userData.first_name} ${userData.last_name}`.trim(),
                            roles: userData.roles
                        };
                        commit('change_profile_success', { user });
                        localStorage.setItem('user', JSON.stringify(user));
                        resolve(resp);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        changePassword({ commit }, params) {
            return new Promise((resolve, reject) => {
                commit('reset_password_request');
                let url = `${params.thornUrl}/password/reset`;
                let headers = { Accept: 'application/json; charset=utf-8' };
                axios({ url, data: params.user, method: 'PATCH', headers })
                    .then(resp => {
                        commit('reset_password_success');
                        resolve(resp);
                    })
                    .catch(err => {
                        commit('reset_password_error');
                        reject(err);
                    });
            });
        },
        resetPassword({ commit }, params) {
            return new Promise((resolve, reject) => {
                commit('reset_password_request');
                let url = `${params.thornUrl}/password/reset`;
                let headers = { Accept: 'application/json; charset=utf-8' };
                axios({ url, data: params.user, method: 'POST', headers })
                    .then(resp => {
                        commit('reset_password_success');
                        resolve(resp);
                    })
                    .catch(err => {
                        commit('reset_password_error');
                        reject(err.response.data);
                    });
            });
        },
        login({ commit }, params) {
            return new Promise((resolve, reject) => {
                commit('auth_request');
                let url = `${params.thornUrl}/auth/login`;
                let headers = { Accept: 'application/json; charset=utf-8' };
                axios({ url, data: { user: params.user }, method: 'POST', headers })
                    .then(resp => {
                        const token = resp.data.token;
                        if (token === undefined) {
                            let err = new Error('errors.invalidLoginOrPassword');
                            reject(err);
                        }

                        let user = resp.data.user;

                        axios.defaults.headers.common['Authorization'] = token;
                        axios.defaults.headers.common['X-Authentication'] = token;
                        axios.defaults.headers.common['X-User-Id'] = user.id;

                        localStorage.setItem('token', token);
                        localStorage.setItem('user', JSON.stringify(user));
                        commit('auth_success', { token, user });
                        resolve(resp);
                    })
                    .catch(err => {
                        commit('auth_error');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        reject(err);
                    });
            });
        },
        register({ commit }, params) {
            return new Promise((resolve, reject) => {
                commit('register_request');
                axios({
                    url: `${params.thornUrl}/register`,
                    data: params.data,
                    method: 'POST'
                })
                    .then(resp => {
                        commit('register_request', params.user);
                        resolve(resp);
                    })
                    .catch(err => {
                        commit('register_error', err);
                        localStorage.removeItem('token');
                        reject(err);
                    });
            });
        },
        logout({ commit }) {
            return new Promise(resolve => {
                commit('logout');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
                resolve();
            });
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        user: state => state.user || {},
        isAdmin: state => state.user?.roles?.map(r => r.name).includes('admin'),
        isManager: state => state.user.roles.map(r => r.name).includes('manager'),
        isMonitor: state => state.user.roles.map(r => r.name).includes('monitor'),
        hasRoles: state => state.user.roles.length > 0,
        userPermissions: state => state.user.roles?.flatMap(r => r.permissions.map(p => p.name)) || {},
        token: state => state.token,
        hasAnyPermission: state => permissionList => {
            const permissions = state.user.roles.flatMap(r => r.permissions.map(p => p.name));
            return permissionList.some(r => permissions.includes(r));
        },
        hasFeaturePermission: state => feature => {
            const permissions = state.user.roles?.flatMap(r => r.permissions.map(p => p.name));
            const testPermissions = FEATURES_PERMISSIONS[feature] || [];
            return testPermissions.some(r => permissions?.includes(r));
        },
        hasAnyRole: state => roleList => {
            const roles = state.user.roles.map(r => r.name);
            return roleList.some(r => roles.includes(r));
        }
    }
});
