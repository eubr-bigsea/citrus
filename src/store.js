import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
let thornUrl = process.env.VUE_APP_THORN_URL
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
    },
    actions: {
        login ({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                let url = `${thornUrl}/thorn/api/users/sign_in`
                let headers = { 'Accept': 'application/json; charset=utf-8' }
                axios({ url, data: { user }, method: 'POST', headers })
                    .then(resp => {
                        const token = resp.data.token
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
        register ({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios({ url: 'http://localhost:3000/register', data: user, method: 'POST' })
                    .then(resp => {
                        const token = resp.data.token
                        const user = resp.data.user
                        localStorage.setItem('token', token)
                        axios.defaults.headers.common['Authorization'] = token
                        commit('auth_success', token, user)
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error', err)
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
        user: state => state.user || {}
    }
})
