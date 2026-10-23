<template>
    <span />
</template>
<script>
export default {
    name: 'LogoutView',
    data() {
        return {};
    },
    created: function () {
        this.$store.dispatch('logout').then(() => {
            this.$router.push({ name: 'login', query: { loggedOut: 1 } });
        });
    }
};
</script>