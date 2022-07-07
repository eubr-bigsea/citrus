<template>
    <div class="row">
        <div class="col-12 col-sm-6 col-md-6 col-lg-4 mx-auto">
            <div class="card-wrapper">
                <div class="brand"></div>
                <div class="card fat ">
                    <div class="card-header">
                        <h4 class="card-title float-left">{{ $t('titles.login') }}</h4>
                        <div class="float-right navbar-brand logo" style="width:32px; margin:0"></div>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="login">
                            <div class="form-group">
                                <label for="email">{{ $t('common.email') }} / {{ $t('common.user.login') }}:</label>
                                <input v-model="email" required type="text" class="form-control" placeholder="Name"
                                    autofocus autocomplete="username" />
                            </div>

                            <div class="form-group">
                                <label for="password">
                                    {{ $t('common.password') }}:
                                    <router-link class="float-right" :to="{name: 'reset_password'}">
                                        {{$t('common.forgotPassword')}}</router-link>
                                </label>
                                <div style="position:relative">
                                    <input v-model="password" :type="showingPassword ? 'text' : 'password'"
                                        class="form-control" required style="padding-right: 60px;"
                                        placeholder="Password" autocomplete="current-password" />
                                    <input id="passeye-0" type="hidden" />
                                    <div class="show-password btn btn-primary btn btn-sm"
                                        @click="showingPassword = !showingPassword" v-text="passwordShowText" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label>
                                    <b-check v-model="rememberPassword">
                                        {{ $t('common.rememberMe') }}
                                    </b-check>
                                </label>
                            </div>

                            <div class="form-group no-margin text-center">
                                <button type="submit" class="btn btn-primary col-md-4">
                                    {{ $t('common.login') }}
                                </button>
                            </div>
                            <div class="margin-top20 text-center">
                                {{ $t('common.dontHaveAccount') }}
                                <br />
                                <router-link :to="{name: 'register'}">{{$t('common.createAccount')}}</router-link>
                            </div>
                        </form>
                        <div v-if="openIdEnabled">
                            <div class="or">
                                <h2><span>{{$tc('common.or').toUpperCase()}}</span></h2>
                            </div>
                            <div class="openid-logo"></div>
                            <button class="btn btn-outline-primary w-100" @click="useOpenId">ENTRAR USANDO OPEN
                                ID</button>
                        </div>
                    </div>
                </div>
                <div class="footer text-center">
                    <small>Copyright © 2017-2021 — Lemonade Project</small>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    label {
        font-size: 0.9em;
        text-align: left;
        width: 100%;
    }

    .show-password {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translate(0, -50%);
        -webkit-transform: translate(0, -50%);
        -o-transform: translate(0, -50%);
        padding: 2px 7px;
        font-size: 12px;
        cursor: pointer;
    }
</style>
<script>
    import Notifier from '../mixins/Notifier';

    export default {
        name: 'LoginView',
        mixins: [Notifier],
        data() {
            return {
                email: '',
                password: '',
                rememberPassword: false,
                showingPassword: false,
                submitted: false,
            };
        },
        computed: {
            passwordShowText() {
                return this.$t(this.showingPassword ? 'common.hide' : 'common.show');
            },
            openIdEnabled() {
                return this.$openIdService.enabled;
            }
        },
        methods: {
            useOpenId() {
                this.$openIdService.login().catch(e =>
                    this.error(e))
            },
            login: function () {
                let thornUrl = process.env.VUE_APP_THORN_URL;
                let email = this.email;
                let password = this.password;
                this.$store
                    .dispatch('login', { thornUrl, user: { email, password } })
                    .then(() => this.$router.push('/'))
                    .catch(e => {
                        this.error(e?.response?.data || e);
                        this.submit = false;
                    });
            }
        }
    };
</script>
<style scoped>
    div.or h2 {
        width: 100%;
        font-size: 12pt;
        font-weight: normal;
        text-align: center;
        border-bottom: 1px solid #aaa;
        line-height: 0.1em;
        margin: 20px 0 20px;
    }

    div.or h2 span {
        background: #fff;
        padding: 0 10px;
    }
</style>
