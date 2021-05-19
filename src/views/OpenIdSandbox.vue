<template>
    <div class="row">
        <div class="col-md-12">
            <h2>Open Id Tester</h2>
            <button class="btn btn-primary btn-sm" @click="goLogin">Go to login</button>
        </div>
        <div class="col-md-12" v-if="query">
            <h4>Query</h4>
            {{query}}
            |{{user}}|
        </div>
        <div class="col-md-12">
            <button class="btn btn-success btn-sm" @click="getUser">Get user info</button>
            <div v-if="user">{{user}}
                <strong>{{token}}</strong>
            </div>
        </div>
        <div class="col-md-12 mt-2">
            <button class="btn btn-secondary btn-sm" @click="callApi">Test API call</button>
        </div>
        <div class="col-md-12 mt-2">
            <button class="btn btn-danger btn-sm" @click="logout">Logout</button>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import { openIdService } from '../openid-auth.js';
    import { UserManager, WebStorageStateStore } from 'oidc-client';
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
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
                token: null
            }
        },
        mounted() {
            this.authService = openIdService;
            const q = this.$route.query;
            const self = this;
            if (q?.code) {
                this.query = q;
                const mgr = new UserManager({
                    response_mode: 'query',
                    userStore: new WebStorageStateStore()
                }).signinRedirectCallback().then(function (user) {
                    console.log("signin response success", user);
                    console.debug(self.authService.getProfile())
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
                this.authService.getAccessToken().then(token => this.token = new Date(parseJwt(token).exp * 1000));
            },
            callApi(){
                axios.get('/api/v1/thorn/configurations').then(resp =>{
                    console.debug(resp);
                }).catch(error =>{
                    console.debug('Error', error);
                })
            },
            logout(){
                this.authService.logout();
            }
        }
    }
</script>