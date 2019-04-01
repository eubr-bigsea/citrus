<template>
    <span></span>
</template>
<script>

    export default {
        data() {
            return {}
        },
        created: function () {
            this.$store.dispatch('logout').then(() => {
                this.$router.push('/')
            })
        }
    }
</script>