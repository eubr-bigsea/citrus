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
    change_profile_success(state, { user }) {
      user.email = user.attributes.email;
      user.locale = user.attributes.locale;
      state.status = 'success';
      state.user = user;
    }
  },
  actions: {
    changeProfile({ commit }, params) {
      return new Promise((resolve, reject) => {
        const url = `${params.thornUrl}/api/users`;
        const headers = { Accept: 'application/json; charset=utf-8' };
        axios({ url, data: { user: params.user }, method: 'PATCH', headers })
          .then(resp => {
            commit('change_profile_success', { user: resp.data.data });
            let userData = resp.data.data.attributes;
            const user = {
              id: userData.id,
              email: userData.email,
              locale: userData.locale,
              login: userData.email,
              name: userData.full_name,
              roles: userData.roles
            };
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
        let url = `${params.thornUrl}/api/users/password`;
        let headers = { Accept: 'application/json; charset=utf-8' };
        axios({ url, data: { user: params.user }, method: 'PATCH', headers })
          .then(resp => {
            commit('reset_password_success');
            resolve(resp);
          })
          .catch(err => {
            commit('reset_password_error');
            let errors = err.response.data.errors;
            let key = Object.keys(errors)[0];
            let message = 'errors.' + _.camelCase(`${key} ${errors[key]}`);
            reject({ message });
          });
      });
    },
    resetPassword({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('reset_password_request');
        let url = `${params.thornUrl}/api/users/password`;
        let headers = { Accept: 'application/json; charset=utf-8' };
        axios({ url, data: { user: params.user }, method: 'POST', headers })
          .then(resp => {
            commit('reset_password_success');
            resolve(resp);
          })
          .catch(err => {
            commit('reset_password_error');
            let errors = err.response.data.errors;
            let key = Object.keys(errors)[0];
            let message = 'errors.' + _.camelCase(`${key} ${errors[key]}`);
            reject({ message });
          });
      });
    },
    login({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        let url = `${params.thornUrl}/api/users/sign_in`;
        let headers = { Accept: 'application/json; charset=utf-8' };
        axios({ url, data: { user: params.user }, method: 'POST', headers })
          .then(resp => {
            const token = resp.headers.authorization;
            if (token === undefined) {
              let err = new Error('errors.invalidLoginOrPassword');
              reject(err);
            }

            let userData = resp.data.data.attributes;

            axios.defaults.headers.common['Authorization'] = token;
            axios.defaults.headers.common['X-Authentication'] = token;
            axios.defaults.headers.common['X-User-Id'] = userData.id;

            const user = {
              id: userData.id,
              email: userData.email,
              locale: userData.locale,
              login: userData.email,
              name: userData.full_name,
              roles: userData.roles
            };
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
          url: `${params.thornUrl}/api/users`,
          data: { user: params.data },
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
    isAdmin: state => state.user.roles && state.user.roles.includes('admin'),
    token: state => state.token
  }
});
