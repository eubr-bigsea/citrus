<template>
    <span />
</template>
<script>
import axios from 'axios';
import { UserManager, WebStorageStateStore } from 'oidc-client';

export default {
    name: 'IndexView',
    mounted() {
        const q = this.$route.query;
        const self = this;
        if (q?.code) {
            this.query = q;
            new UserManager({
                response_mode: 'query',
                userStore: new WebStorageStateStore()
            }).signinRedirectCallback().then(async function (user) { // eslint-disable-line no-unused-vars
                await self.getThornProfile();
                self.$router.push({ name: 'home' });
            }).catch(function (err) {
                console.log(err);
                self.$router.push({ name: 'home' });
            });
        } else if (q?.sp && q?.error_description !== "End User denied the logout request") { //logout
            self.$store.dispatch('logout');
            self.$router.push({ name: 'home' });
        } else {
            self.$router.push({ name: 'home' });
        }

    },
    methods: {
        async getThornProfile() {
            const user = await this.$openIdService.getProfile(); // eslint-disable-line no-unused-vars
            const token = await this.$openIdService.getAccessToken();
            const headers = { 'Authorization': token };
            const resp = await axios.get('/api/v1/thorn/users/me', { headers });
            this.$store.dispatch('setUser', { user: resp.data.data[0], token });
        },
    },
};
</script>