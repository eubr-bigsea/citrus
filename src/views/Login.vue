<template>
    <div class="row">
        <div class="col-sm-3 col-md-3 col-lg-3 mx-auto">
            <div class="card-wrapper">
                <div class="brand">
                    <img src="img/logo.jpg">
                </div>
                <div class="card fat">
                    <div class="card-body">
                        <h4 class="card-title">Login</h4>
                        <form @submit.prevent="login">

                            <div class="form-group">
                                <label for="email">E-Mail Address</label>
                                <input required v-model="email" type="email" class="form-control" 
                                    placeholder="Name" autofocus="">
                            </div>

                            <div class="form-group">
                                <label for="password">Password
                                    <a href="forgot.html" class="float-right">
                                        Forgot Password?
                                    </a>
                                </label>
                                <div style="position:relative">
                                    <input type="password" class="form-control" v-model="password" 
                                        required style="padding-right: 60px;" placeholder="Password">
                                    <input type="hidden" id="passeye-0">
                                    <div class="btn btn-primary btn-sm" id="passeye-toggle-0" style="position:absolute;right:10px;top:50%;transform:translate(0,-50%);-webkit-transform:translate(0,-50%);-o-transform:translate(0,-50%);padding: 2px 7px;font-size:12px;cursor:pointer;">Show</div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>
                                    <input type="checkbox" v-model="rememberPassword"> Remember Me
                                </label>
                            </div>

                            <div class="form-group no-margin text-center ">
                                <button type="submit" class="btn btn-primary col-md-4">
                                    Login
                                </button>
                            </div>
                            <div class="margin-top20 text-center">
                                Don't have an account?
                                <router-link to="/register">Create One</router-link>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="footer">
                    Copyright © 2018 — Lemonade Project
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    label {
        font-size: .9em;
        text-align: left;
        width: 100%;
    }
</style>
<script>
    export default {
        name: 'Login',
        data() {
            return {
                email: "waltersf@gmail.com",
                password: "zooropa",
                rememberPassword: false
            }
        },
        methods: {
            login: function () {
                let email = this.email
                let password = this.password
                this.$store.dispatch('login', { email, password })
                    .then(() => this.$router.push('/'))
                    .catch(err => console.log(err))
            }
        }
    }
</script>