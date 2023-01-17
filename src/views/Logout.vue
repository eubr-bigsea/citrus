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
            this.$router.push('/login');
        });
    }
};
</script>