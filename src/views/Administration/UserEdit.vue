<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$tc('titles.user', 1)}}</h1>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12 col-xg-12 mx-auto" xxv-if="user.id">
                            <div class="card">
                                <div class="card-body">
                                    <form @submit.prevent="save">
                                        <div class="form-group row">
                                            <div class="col-sm-3">
                                                <label class="col-form-label">
                                                    {{ $t('common.firstName') }}:
                                                </label>
                                                <input v-model="user.first_name" type="text" class="form-control" required
                                                    autofocus maxlength="50"/>
                                            </div>
                                            <div class="col-sm-3">
                                                <label class="col-form-label">
                                                    {{ $t('common.lastName') }}:
                                                </label>
                                                <input v-model="user.last_name" type="text" class="form-control" required maxlength="50"/>
                                            </div>
                                            <div class="col-sm-3">
                                                <label for="inputEmail3" class="col-sm-3 col-form-label">
                                                    {{ $t('common.email') }}:
                                                </label>
                                                <input v-model="user.email" type="email" class="form-control" required maxlength="100"/>
                                            </div>
                                            <div class="col-sm-3">
                                                 <label for="login" class=" col-form-label">
                                                     {{ $t('common.user.login') }}:
                                                 </label>
                                                <input name="login" v-model="user.login" type="text" class="form-control" required maxlength="100"/>
                                            </div>
 
                                       </div>
                                        <div class="form-group row">
                                            <div class="col-sm-3">
                                                 <label for="inputEmail3" class=" col-form-label">
                                                     {{ $t('common.language') }}:
                                                 </label>
                                                <select v-model="user.locale" class="form-control">
                                                    <option value="en">English/Inglês</option>
                                                    <option value="pt">Português/Portuguese</option>
                                                </select>
                                            </div>
 
                                           <div class="col-sm-3">
                                                <label for="inputPassword3" class="col-form-label">
                                                    {{ $t('common.password') }}:
                                                </label>
                                                <input v-model="user.password" type="text" class="form-control" maxlength="50"/>
                                            </div>
                                            <div class="col-sm-3">
                                                <label class="col-form-label">
                                                    {{ $t('common.user.authenticationType') }}:
                                                </label>
                                                <select v-model="user.authentication_type" class="form-control">
                                                    <option value="INTERNAL">{{ $t('common.user.authenticationInternal') }}</option>
                                                    <option value="AD">{{ $t('common.user.authenticationAd') }}</option>
                                                    <option value="LDAP">{{ $t('common.user.authenticationLdap') }}</option>
                                                </select>
                                            </div>
                                            <div class="col-sm-3">
                                                <b-form-checkbox v-model="user.enabled">{{ $t('common.enabled') }}
                                                </b-form-checkbox>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-sm-3">
                                                <label class="col-form-label">
                                                    {{ $tc('common.roles', 2) }}:
                                                    {{user.roles}}
                                                </label>
                                                <select v-model="user.roles" class="form-control" multiple>
                                                    <option value="admin">{{ $t('roles.admin') }}</option>
                                                    <option value="monitor">{{ $t('roles.monitor') }}</option>
                                                </select>
                                            </div>
                                            <div class="col-sm-6">
                                                <label class="col-form-label">
                                                    {{ $tc('common.user.notes', 2) }}:
                                                </label>
                                                <textarea rows="4" class="form-control" v-model="user.notes"></textarea>
                                            </div>
                                        </div>
                                    <div class="row">
                                        <div class="col-md-12 mt-4 border-top pt-2">
                                            <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save">
                                                <font-awesome-icon icon="spinner" pulse class="icon" />
                                                <span class="fa fa-save"></span>
                                                {{$tc('actions.save')}}
                                            </button>
                                            <router-link :to="{name: 'AdministrationUserList'}" class="btn btn-secondary mr-1">
                                                {{$tc('actions.cancel')}}</router-link>
                                        </div>
                                    </div>
                                    </form>
                                    </div>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import Notifier from '../../mixins/Notifier';
    import { mapGetters } from 'vuex';
    import { deserialize } from 'jsonapi-deserializer';

    let thornUrl = process.env.VUE_APP_THORN_URL;

    export default {
        name: 'UserAdd',
        mixins: [Notifier],
        data() {
            return {
                user: {}
            };
        },
        computed: {
            ...mapGetters(['isAdmin'])
        },
        mounted() {
            let self = this;
            this.load().then(() => {
                Vue.nextTick(() => {
                    self.isDirty = false;
                });
            });
        },
        methods: {
            load() {
                const self = this;
                const userId = this.$route.params.id;
                const url = `${thornUrl}/users/${userId}`;

                return new Promise((resolve, reject) => {
                    axios
                        .get(url)
                        .then(resp => {
                            self.user = resp.data.data[0];
                            if (self.user.roles === undefined){
                                self.user.roles = [];
                            }
                            resolve();
                        })
                        .catch(function (e) {
                            self.error(e);
                        });
                });
            },
            save(event) {
                const self = this;
                let userId = this.$route.params.id;
                const url = `${thornUrl}/users/${userId}`;
                let user = self.user;

                event.target.setAttribute('disabled', 'disabled');
                event.target.classList.remove('btn-spinner');

                this.$Progress.start();
                return axios
                    .patch(url, user)
                    .then(resp => {
                        event.target.removeAttribute('disabled');
                        event.target.classList.add('btn-spinner');
                        this.$Progress.finish();
                        this.$router.push({ name: 'AdministrationUserList' });
                        self.success(
                            this.$t('messages.savedWithSuccess', {
                                what: this.$tc('titles.user', 1)
                            })
                        );

                    })
                    .catch(
                        function (e) {
                            var err = e;
                            self.$Progress.finish();
                            if (e.response.data.errors[0]) {
                                let pointer = e.response.data.errors[0].source.pointer;
                                let detail = e.response.data.errors[0].detail;

                                err = {
                                    message: `${pointer} ${detail}`
                                };
                            }

                            self.error(err);
                        }.bind(this)
                    );
            }
        }
    };
</script>
