<template>
    <main role="main">
        <div class="row">
            <div class="col-md-6 mx-auto">
                <div class="card fat">
                    <div class="card-header text-center bg-secondary text-white">
                        {{$t('titles.profile')}}
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="save">
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">{{$t('common.firstName')}}:</label>
                                <div class="col-sm-9">
                                    <input v-model="user.first_name" type="text" class="form-control" required
                                           autofocus>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">{{$t('common.lastName')}}:</label>
                                <div class="col-sm-9">
                                    <input v-model="user.last_name" type="text" class="form-control" required>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="inputEmail3" class="col-sm-3 col-form-label">{{$t('common.email')}}:</label>
                                <div class="col-sm-9">
                                    <input v-model="user.email" type="email" class="form-control" required
                                           autocomplete="email">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="inputEmail3" class="col-sm-3 col-form-label">{{$t('common.language')}}:</label>
                                <div class="col-sm-9">
                                    <select v-model="user.locale" class="form-select">
                                        <option value="en">
                                            English/Inglês
                                        </option>
                                        <option value="pt">
                                            Português/Portuguese
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div v-if="isPasswordChangeable" class="form-group row">
                                <label for="inputPassword3" class="col-sm-3 col-form-label">{{$t('common.current_password')}}:</label>
                                <div class="col-sm-9">
                                    <input v-model="user.current_password" type="password" class="form-control" required
                                           autocomplete="current-password">
                                </div>
                            </div>
                            <div class="form-group row">
                                <div v-if="isPasswordChangeable" class="col-md-12">
                                    <b-link v-b-toggle.changePassword class="float-end">
                                        {{$t('profile.alsoChangePassword')}}
                                    </b-link>
                                </div>
                                <div class="col-md-12">
                                    <b-collapse id="changePassword">
                                        <div class="form-group row">
                                            <label for="inputPassword3" class="col-sm-3 col-form-label">{{$t('common.new_password')}}:</label>
                                            <div class="col-sm-9">
                                                <div class="col-sm-9">
                                                    <input v-model="user.password" type="password" class="form-control"
                                                           autocomplete="new-password">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="inputPassword3" class="col-sm-3 col-form-label">{{$t('common.new_password_confirmation')}}:</label>
                                            <div class="col-sm-9">
                                                <div class="col-sm-9">
                                                    <input v-model="user.password_confirmation" type="password"
                                                           class="form-control" autocomplete="new-password">
                                                </div>
                                            </div>
                                        </div>
                                    </b-collapse>
                                </div>
                            </div>
                            <div class="form-group row border-top clearfix pt-3">
                                <div class="col-sm-12 text-center">
                                    <button type="submit" class="btn btn-primary me-2 pe-5 ps-5">
                                        {{$t('common.ok')}}
                                    </button>
                                    <router-link :to="{name: 'home'}" class="btn btn-secondary text-white">
                                        {{$t('actions.cancel')}}
                                    </router-link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier.js';

export default {
    name: 'ProfileView',
    mixins: [Notifier],
    data() {
        return {
            changePassword: false,
            user: {}
        };
    },
    computed: {
        isPasswordChangeable() {
            return this.user.authentication_type !== 'LDAP'
                    && this.user.authentication_type !== 'OPENID';
        },
    },
    mounted() {
        let thornUrl = import.meta.env.VITE_THORN_URL;
        let url = `${thornUrl}/users/me`;
        let self = this;
        axios
            .get(url)
            .then(resp => {
                self.user = resp.data.data[0];
            })
            .catch(
                function () {
                    self.error(
                        self.$t('errors.sendingData'),
                        self.$t('titles.error')
                    );
                }.bind(this)
            );
    },
    methods: {

        save() {
            const self = this;
            let thornUrl = import.meta.env.VITE_THORN_URL;
            this.$store
                .dispatch('changeProfile', { thornUrl, user: this.user })
                .then(() => {
                    self.success(
                        self.$t('profile.updated'),
                        self.$t('titles.success')
                    );
                    self.$root.$i18n.locale = self.user.attributes ? self.user.attributes.locale : self.user.locale;
                    this.$router.push('/');
                })
                .catch(e => {
                    if (e.response) {
                        self.error({ message: e.response.data.message });
                    } else {
                        self.error(e);
                    }

                });
        }
    }
};
</script>