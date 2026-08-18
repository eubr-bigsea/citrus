<template>
    <div class="row">
        <div class="col-md-12 border-bottom mb-2">
            <h2>Open Id Tester</h2>
        </div>
        <div class="col-md-12 mb-5">
            <button class="btn btn-primary btn-sm" @click="goLogin">
                1 - Go to login
            </button>
            <div v-if="query">
                <h4>Query</h4>
                {{query}}
            </div>
        </div>
        <div class="col-md-12 mb-5">
            <button class="btn btn-success btn-sm" @click="getUser">
                2 - Get user info
            </button>
            <div v-if="header">
                Header: <br>
                {{header}}
            </div>
            <div v-if="user && user.sub">
                User: <br>
                {{user}}
            </div>
            <div v-if="token">
                Token: <br>
                {{token}}
            </div>
            <div v-if="parsedToken">
                Parsed Token: <br>
                {{parsedToken}}
            </div>
        </div>
        <div class="col-md-12 mt-2">
            <button class="btn btn-secondary btn-sm" @click="callApi">
                3 - Test API call
            </button>
            <div v-if="api">
                {{api}}
            </div>
        </div>
        <div class="col-md-12 mt-2">
            <button class="btn btn-danger btn-sm" @click="logout">
                4 - Logout
            </button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { openIdService } from '../openid-auth.js';
import { UserManager, WebStorageStateStore } from 'oidc-client';
const thornUrl = import.meta.env.VITE_THORN_URL;
const parseJwt = (token) => {
    try {
        const parts = token.split('.');
        return [
            JSON.parse(atob(parts[0])),
            JSON.parse(atob(parts[1]))
        ];
    } catch (e) {
        return null;
    }
};
export default {
    data() {
        return {
            authService: null,
            query: null,
            user: {},
            token: null,
            header: null,
            parsedToken: null,
            api: null
        };
    },
    mounted() {
        this.authService = openIdService;
        const q = this.$route.query;
        const self = this;
        if (q?.code) {
            this.query = q;
            new UserManager({
                response_mode: 'query',
                userStore: new WebStorageStateStore()
            }).signinRedirectCallback().then(function (user) {
                console.log("signin response success", user);
                console.debug(self.authService.getProfile());
                //window.location.href = '../';
            }).catch(function (err) {
                console.log(err);
            });
        }
    },
    methods: {
        goLogin() {
            this.authService.login();
        },
        getUser() {
            this.authService.getProfile().then((user) => this.user = user);
            this.authService.getAccessToken().then(token => {
                [this.header, this.parsedToken] = parseJwt(token);
                this.token = token;
            });
        },
        callApi() {
            const headers = { 'Authorization': this.token };
            axios.get(`${thornUrl}/api/v1/thorn/users/me`, { headers }).then(resp => {
                this.api = JSON.stringify(resp.data);
            }).catch(error => {
                console.debug('Error', error);
            });
        },
        logout() {
            this.authService.logout();
            this.token = null;
            this.user = null;
            this.query = null;
        }
    }
};
</script>
