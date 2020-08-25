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
                                            <div class="col-sm-2">
                                                <label class="col-form-label">
                                                    {{ $t('common.firstName') }}:
                                                </label>
                                                <input v-model="user.first_name" type="text" class="form-control"
                                                    required autofocus maxlength="50" />
                                            </div>
                                            <div class="col-sm-3">
                                                <label class="col-form-label">
                                                    {{ $t('common.lastName') }}:
                                                </label>
                                                <input v-model="user.last_name" type="text" class="form-control"
                                                    required maxlength="50" />
                                            </div>
                                            <div class="col-sm-4">
                                                <label for="inputEmail3" class="col-sm-3 col-form-label">
                                                    {{ $t('common.email') }}:
                                                </label>
                                                <input v-model="user.email" type="email" class="form-control" required
                                                    maxlength="100" />
                                            </div>
                                            <div class="col-sm-3">
                                                <label for="login" class=" col-form-label">
                                                    {{ $t('common.user.login') }}:
                                                </label>
                                                <input v-model="user.login" name="login" type="text"
                                                    class="form-control" required maxlength="100" />
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
                                                <input v-model="user.password" type="password" class="form-control"
                                                    maxlength="50" />
                                            </div>
                                            <div class="col-sm-3">
                                                <label class="col-form-label">
                                                    {{ $t('common.user.authenticationType') }}:
                                                </label>
                                                <select v-model="user.authentication_type" class="form-control">
                                                    <option value="INTERNAL">
                                                        {{ $t('common.user.authenticationInternal') }}</option>
                                                    <option value="AD">{{ $t('common.user.authenticationAd') }}</option>
                                                    <option value="LDAP">{{ $t('common.user.authenticationLdap') }}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-sm-3">
                                                <b-form-checkbox v-model="user.enabled">{{ $t('common.enabled') }}
                                                </b-form-checkbox>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <label>{{ $tc('common.user.apiToken') }}</label>
                                                <div class="input-group mb-3">
                                                    <input type="text" class="form-control" disabled
                                                        :value="user.api_token ? user.api_token : $t('titles.undefined')" />
                                                    <div class="input-group-append">
                                                        <button class="btn btn-outline-danger" type="button"
                                                            @click="update">
                                                            {{$t('actions.update')}}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-sm-6">
                                                <label class="col-form-label">
                                                    {{ $tc('common.user.notes', 2) }}:
                                                </label>
                                                <textarea v-model="user.notes" rows="4" class="form-control"></textarea>
                                            </div>
                                            <div class="col-sm-6">
                                                <label class="col-form-label">
                                                    {{ $tc('common.roles', 2) }}:
                                                </label>
                                                <v-select v-model="user.roles" :options="roles" :multiple="true"
                                                    label="label" :taggable="false" :close-on-select="false">
                                                </v-select>
                                                <label class="mt-3">{{$t('common.user.globalRoles')}}:</label>
                                                <div>
                                                    <div v-for="gr in globalRoles" :key="gr.id"
                                                        class="badge badge-info mr-1">{{gr.label}}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12 mt-4 border-top pt-2">
                                                <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save">
                                                    <font-awesome-icon icon="spinner" pulse class="icon" />
                                                    <span class="fa fa-save"></span>
                                                    {{$tc('actions.save')}}
                                                </button>
                                                <router-link :to="{name: 'AdministrationUserList'}"
                                                    class="btn btn-secondary mr-1">
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
    import axios from 'axios';
    import Notifier from '../../mixins/Notifier';
    import { mapGetters } from 'vuex';
    import vSelect from "vue-select";

    let thornUrl = process.env.VUE_APP_THORN_URL;

    export default {
        name: 'UserAdd',
        components: {
            'v-select': vSelect,
        },
        mixins: [Notifier],
        data() {
            return {
                user: {},
                roles: [],
                globalRoles: [],
                teste: [{ description: "Funciona" }]
            };
        },
        computed: {
            ...mapGetters(['isAdmin'])
        },
        mounted() {
            const self = this;
            this.load().then(() => {
                const rolesUrl = `${thornUrl}/roles`;
                const params = { 'fields': 'id,label,all_user' };
                axios.get(rolesUrl, { params })
                    .then(resp => {
                        self.roles = resp.data.data.filter(r => !r.all_user);
                        self.globalRoles = resp.data.data.filter(r => r.all_user);
                    }).catch(function (e) {
                        self.error(e);
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
                            if (self.user.roles === undefined) {
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
                        this.$router.push({ name: 'AdministrationUserList' });
                        self.success(
                            this.$t('messages.savedWithSuccess', {
                                what: this.$tc('titles.user', 1)
                            })
                        );

                    })
                    .catch(
                        function (e) {
                            self.error(e);
                        }.bind(this)
                    ).finally(() => {
                        event.target.removeAttribute('disabled');
                        event.target.classList.add('btn-spinner');
                        this.$Progress.finish();
                    });
            },
            update(event) {
                const self = this;
                event.target.setAttribute('disabled', 'disabled');
                event.target.classList.remove('btn-spinner');
                if (confirm(this.$t('common.user.apiTokenWarning'))) {
                    const url = `${thornUrl}/token/${this.user.id}`;
                    axios.post(url)
                        .then(resp => {
                            this.user.api_token = resp.data.token;
                        })
                        .catch(
                            function (e) {
                                self.error(e);
                            }.bind(this)
                        ).finally(() => {
                            event.target.removeAttribute('disabled');
                            event.target.classList.add('btn-spinner');
                            this.$Progress.finish();
                        });
                }
            }
        }
    };
</script>