<template>
    <div>
        <vue-snotify />
        <l-navbar v-if="isLoggedIn" />
        <div class="container-fluid main-container">
            <router-view />

            <vue-progress-bar />
            <l-footer v-if="isLoggedIn" />
        </div>
    </div>
</template>

<script>
    import Navbar from './components/Navbar.vue';
    import Footer from './components/Footer.vue';
    import axios from 'axios';

    const thornUrl = process.env.VUE_APP_THORN_URL;

    export default {
        name: 'App',
        components: {
            'l-navbar': Navbar,
            'l-footer': Footer
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.isLoggedIn;
            },
            user() {
                return this.$store.getters.user;
            }
        },

        mounted() {
            this.checkAuth();
        },
        methods: {
            checkAuth: function () {
                let self = this;

                if (self.isLoggedIn) {
                    let url = `${thornUrl}/api/tokens`;
                    let headers = { Accept: 'application/json; charset=utf-8' };
                    axios({
                        url,
                        data: { data: { id: self.user.id } },
                        method: 'POST',
                        headers
                    }).catch(err => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        axios.defaults.headers.common['Authorization'] = null;
                        axios.defaults.headers.common['X-Authentication'] = null;
                        axios.defaults.headers.common['X-User-Id'] = null;
                        self.$router.push({ name: 'logout' });
                    });
                }
            }
        }
    };
</script>

<style>
    body {
        background-color: #f8f9fa !important;
    }

    .app-container {
        height: calc(100% - 45px);
    }

    .main-container {
        padding-top: 15px;
        height: calc(100% - 60px);
    }
</style>
