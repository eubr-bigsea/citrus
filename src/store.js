import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Keycloak from 'keycloak-js';
import router from './router'

const keycloak = new Keycloak({
  realm: 'thorn',
  url: 'http://localhost:9080/auth',
  'ssl-required': 'external',
  clientId: 'vue-client',
  'public-client': true,
  'confidential-port': 0
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    keycloak: keycloak
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, { token, user, keycloak }) {
      state.status = 'success';
      state.token = token;
      state.user = user;
      state.keycloak = keycloak;
    },
    auth_error(state) {
      state.status = 'error';
      state.token = '';
      state.user = {};
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
        const url = `${params.thornUrl}/api/users/${params.user.attributes.id}`;
        const headers = { Accept: 'application/json; charset=utf-8' };
        axios({ url, data: { data: params.user }, method: 'PATCH', headers })
          .then(resp => {
            commit('change_profile_success', { user: resp.data.data });
            resolve(resp);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    login({ commit }) {
      commit('auth_request');
      this.getters.keycloak
        .init({ onLoad: 'login-required', responseMode: 'query' })
        .success(() => {
          keycloak.loadUserProfile().success(profile => {
            const token = 'Bearer ' + keycloak.token;
            const user = {
              id: keycloak.subject,
              email: profile.email,
              locale: profile.locale,
              login: profile.email,
              name: `${profile.firstName} ${profile.lastName}`
            };

            axios.defaults.headers.common['Authorization'] = token;
            axios.defaults.headers.common['X-Authentication'] = token;
            axios.defaults.headers.common['X-User-Id'] = keycloak.subject;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            commit('auth_success', { token, user, keycloak });
            router.push('/home')
          });
        })
        .error(function() {
          commit('auth_error');
        });
    },
    register({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('register_request');
        axios({
          url: `${params.thornUrl}/api/users`,
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
      this.getters.keycloak.init()
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.getters.keycloak.logout();
      commit('logout');
      router.push('/landing-page')

    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    user: state => state.user || {},
    token: state => state.token,
    keycloak: state => state.keycloak
  }
});
