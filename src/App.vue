<template>
    <div>
        <!--web-socket / -->
        <vue-snotify />
        <l-navbar v-if="isLoggedIn" />
        <div id="wrapperx">
            <!--<side-bar ref="sidebar" />-->
            <div id="page-content-wrapperx">
                <div class="container-fluid main-container">
                    <router-view />

                    <vue-progress-bar />
                    <l-footer v-if="isLoggedIn" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import axios from 'axios';


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
        //this.checkAuth();
    },
    methods: {
        checkAuth: function () {
            let self = this;

            if (self.isLoggedIn) {
                const url = '/tokens';
                let headers = { Accept: 'application/json; charset=utf-8' };
                axios({
                    url,
                    data: { data: { id: self.user.id } },
                    method: 'POST',
                    headers
                }).catch(() => {
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