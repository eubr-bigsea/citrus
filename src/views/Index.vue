<template>
    <div v-if="error" class="alert alert-danger m-3" role="alert">
        <h5 class="alert-heading">
            {{$t('errors.oidcTokenTitle')}}
        </h5>
        <p>{{$t('errors.oidcTokenMessage')}}</p>
        <hr>
        <p class="mb-2">
            <code>{{error}}</code>
        </p>
        <button class="btn btn-sm btn-outline-danger" @click="retry">
            {{$t('errors.oidcRetry')}}
        </button>
    </div>
    <span v-else />
</template>
<script>
import axios from 'axios';
let thornUrl = import.meta.env.VITE_THORN_URL;
export default {
    name: 'IndexView',
    data() {
        return { error: null };
    },
    mounted() {
        const q = this.$route.query;
        const self = this;
        if (q?.code) {
            this.query = q;
            this.$openIdService.handleLoginRedirect().then(async function (user) {  
                await self.getThornProfile();
                self.$router.push({ name: 'home' });
            }).catch(function (err) {
                // Do not redirect to home: the guard would call login() again and loop.
                console.error(err);
                self.error = [err?.error, err?.error_description || err?.message].filter(Boolean).join(': ') || String(err);
            });
            // The callback reads the URL synchronously above; drop code/state so a reload does not replay it
            // (the stored state is consumed on first read, and a replay fails with "No matching state").
            window.history.replaceState(window.history.state, '', window.location.pathname);
        } else if (q?.sp && q?.error_description !== "End User denied the logout request") { //logout
            self.$store.dispatch('logout');
            self.$router.push({ name: 'home' });
        } else {
            self.$router.push({ name: 'home' });
        }

    },
    methods: {
        async retry() {
            await this.$store.dispatch('logout');
            await this.$openIdService.userManager.removeUser();
            await this.$openIdService.userManager.clearStaleState();
            this.$openIdService.login();
        },
        async getThornProfile() {
            //const user = await this.$openIdService.getProfile(); // eslint-disable-line no-unused-vars
            const token = await this.$openIdService.getAccessToken();
            //const headers = { 'Authorization': token };
            const headers = {};
            const resp = await axios.get(`${thornUrl}/users/me`, { headers });
            this.$store.dispatch('setUser', { user: resp.data.data[0], token });
        },
    },
};
</script>
