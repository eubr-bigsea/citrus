import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user') || '{}')
    },
    mutations: {
        auth_request (state) {
            state.status = 'loading';
        },
        auth_success (state, { token, user }) {
            state.status = 'success';
            state.token = token;
            state.user = user;
        },
        auth_error (state) {
            state.status = 'error';
        },
        reset_password_request (state) {
            state.status = 'loading';
        },
        reset_password_success (state) {
            state.status = 'success';
        },
        reset_password_error (state) {
            state.status = 'error';
        },
        logout (state) {
            state.status = '';
            state.token = '';
        },
        register_error (err) {
            console.error(err);
        },
        register_request (user) {
            console.info('User', user);
        },
        change_profile_success (state, { user }) {
            user.email = user.email;
            user.login = user.login;
            user.locale = user.locale;
            user.roles = user.roles || [];
            state.status = 'success';
            state.user = user;
        }
    },
    actions: {
        changeProfile ({ commit }, params) {
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
                        commit('change_profile_success', { user});
                        localStorage.setItem('user', JSON.stringify(user));
                        resolve(resp);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        changePassword ({ commit }, params) {
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
        resetPassword ({ commit }, params) {
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
        login ({ commit }, params) {
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

                        let user= resp.data.user;

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
        register ({ commit }, params) {
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
        logout ({ commit }) {
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
        isAdmin: state => state.user.roles.includes('admin'),
        isManager: state => state.user.roles.includes('manager'),
        isMonitor: state => state.user.roles.includes('monitor'),
        hasRoles: state => state.user.roles.length > 0,
        token: state => state.token
    }
});
