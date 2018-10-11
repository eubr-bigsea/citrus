import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user') || '{}'),
    },
    mutations: {
        auth_request (state) {
            state.status = 'loading'
        },
        auth_success (state, { token, user }) {
            state.status = 'success'
            state.token = token
            state.user = user
        },
        auth_error (state) {
            state.status = 'error'
        },
        logout (state) {
            state.status = ''
            state.token = ''
        },
        register_error(err){

        },
        register_request(user) {

        },
        change_profile_success(state, {user}){
            user.email = user.attributes.email
            user.locale = user.attributes.locale
            state.status = 'success'
            state.user = user
        }
    },
    actions: {
        changeProfile({commit}, params){
            return new Promise((resolve, reject) => {
                let url = `${params.thornUrl}/api/users/${params.user.attributes.id}`
                let headers = { 'Accept': 'application/json; charset=utf-8' }
                axios({ url, data: {data: params.user}, method: 'PATCH', headers })
                    .then(resp => {
                        commit('change_profile_success', {user: resp.data.data})
                        resolve(resp)
                    }).catch((err) => {
                        reject(err)
                    })
            });
        },
        login ({ commit }, params) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                let url = `${params.thornUrl}/api/users/sign_in`
                let headers = { 'Accept': 'application/json; charset=utf-8' }
                axios({ url, data: { user: params.user }, method: 'POST', headers })
                    .then(resp => {
                        const token = resp.data.token
                        if (token === undefined) {
                            let err = new Error("errors.invalidLoginOrPassword")
                            reject(err)
                        }
                        const user = { id: resp.data.userId, email: resp.data.email, locale: resp.data.locale }
                        let finalToken = `Token token="${token}", email="${user.email}"`
                        localStorage.setItem('token', finalToken)
                        localStorage.setItem('user', JSON.stringify(user))
                        axios.defaults.headers.common['Authorization'] = finalToken
                        axios.defaults.headers.common['X-Authentication'] = finalToken
                        axios.defaults.headers.common['X-User-Id'] = user['id']
                        commit('auth_success', { token, user })
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error')
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                        reject(err)
                    })
            })
        },
        register ({ commit }, params) {
            return new Promise((resolve, reject) => {
                commit('register_request')
                axios({ url: `${params.thornUrl}/api/users`, data: params.data, 
                    method: 'POST' })
                    .then(resp => {
                        commit('register_request', params.user)
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('register_error', err)
                        localStorage.removeItem('token')
                        reject(err)
                    })
            })
        },
        logout ({ commit }) {
            return new Promise((resolve) => {
                commit('logout')
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                delete axios.defaults.headers.common['Authorization']
                resolve()
            })
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        user: state => state.user || {},
        token: state => state.token
    }
})
