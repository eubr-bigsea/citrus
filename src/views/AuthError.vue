<template>
    <div class="alert alert-danger m-3" role="alert">
        <h5 class="alert-heading">
            {{$t('errors.authErrorTitle')}}
        </h5>
        <p>{{$t('errors.authErrorMessage')}}</p>
        <template v-if="detail">
            <hr>
            <p class="mb-2">
                <code>HTTP {{status}}: {{detail}}</code>
            </p>
        </template>
        <button class="btn btn-sm btn-outline-danger me-2" @click="retry">
            {{$t('errors.oidcRetry')}}
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click="signOut">
            {{$t('common.logout')}}
        </button>
    </div>
</template>
<script>
export default {
    name: 'AuthErrorView',
    computed: {
        status() {
            return this.$route.query.status;
        },
        detail() {
            return this.$route.query.detail;
        },
    },
    methods: {
        async retry() {
            // Drop stale auth state, then start a fresh login.
            await this.$store.dispatch('logout');
            await this.$openIdService.userManager.removeUser();
            await this.$openIdService.userManager.clearStaleState();
            this.$openIdService.login();
        },
        signOut() {
            this.$openIdService.logout();
        },
    },
};
</script>
