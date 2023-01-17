<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>
                            {{add ? $t('actions.add', {type: $tc('titles.role', 1).toLowerCase()}) : $t('actions.edit')
                                + ' ' + $tc('titles.role', 1).toLowerCase()}}
                        </h1>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12 col-xg-12 mx-auto">
                            <div class="card">
                                <div class="card-body">
                                    <form @submit.prevent="save">
                                        <fieldset>
                                            <div class="row">
                                                <div class="col-md-2">
                                                    <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                                                    <input v-model="role.name" type="text" maxlength="50" required
                                                           class="form-control">
                                                </div>
                                                <div class="col-md-3">
                                                    <label class="font-weight-bold">{{$tc('common.title')}}:</label>
                                                    <input v-model="role.label" type="text" maxlength="50" required
                                                           class="form-control">
                                                </div>
                                                <div class="col-md-5">
                                                    <label class="font-weight-bold">{{$tc('common.description')}}:</label>
                                                    <input v-model="role.description" type="text" maxlength="100"
                                                           class="form-control" required>
                                                </div>
                                                <div class="col-md-2 mt-3 mb-3 mt-3">
                                                    <b-form-checkbox v-model="role.enabled">
                                                        {{$t('common.enabled')}}
                                                    </b-form-checkbox>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div class="row">
                                            <div class="col-md-6 pb-3 pt-4">
                                                <fieldset>
                                                    <h6>
                                                        {{$tc('common.permission', 2)}}:
                                                    </h6>
                                                    <div>
                                                        <b-card no-body>
                                                            <b-tabs pills card vertical>
                                                                <b-tab v-for="gp in groupedPermissions" :key="gp[0]"
                                                                       :title="$tc('assets.' + gp[0], 2)">
                                                                    <b-card-text>
                                                                        <div v-for="p in gp[1]" :key="p.id"
                                                                             class="col-md-12" :title="p.name">
                                                                            <b-form-checkbox v-model="selectedPermissions"
                                                                                             :value="p.id">
                                                                                {{p.description}}
                                                                            </b-form-checkbox>
                                                                        </div>
                                                                    </b-card-text>
                                                                </b-tab>
                                                            </b-tabs>
                                                        </b-card>
                                                    </div>
                                                </fieldset>
                                            </div>
                                            <div v-if="!role.all_user" class="col-md-6 pb-3 pt-4">
                                                <h6>
                                                    {{$tc('titles.user', 2)}}:
                                                </h6>
                                                <v-select v-model="role.users" style="font-size: .9em" :multiple="true"
                                                          :options="users" :taggable="false" :get-option-label="getUserLabel"
                                                          :close-on-select="true" label="id" @search="onSearchUsers">
                                                    <template #no-options="{ }">
                                                        {{$t('common.noResults')}}
                                                    </template>
                                                    <template #selected-option="option">
                                                        {{option.first_name}} {{option.last_name}}
                                                        &nbsp;<small>({{option.email}})</small>
                                                    </template>
                                                    <template #option="option">
                                                        <font-awesome-icon icon="fa fa-user" />
                                                        {{option.first_name}} {{option.last_name}}
                                                        &nbsp;<small>({{option.email}})</small>
                                                    </template>
                                                </v-select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12 mt-4 border-top pt-2">
                                                <button class="btn btn-primary mr-1 btn-spinner" type="submit">
                                                    <font-awesome-icon icon="spinner" pulse class="icon" />
                                                    <font-awesome-icon icon="fa fa-save" />
                                                    {{$tc('actions.save')}}
                                                </button>
                                                <router-link :to="{name: 'AdministrationRoleList'}"
                                                             class="btn btn-secondary mr-1">
                                                    {{$tc('actions.cancel')}}
                                                </router-link>
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
import VueSelect from 'vue-select';
import { debounce } from '../../util.js';

let thornUrl = import.meta.env.VITE_THORN_URL;

export default {
    components: {
        'v-select': VueSelect,
    },
    props: {
        add: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isDirty: false,
            role: {},
            idsPermissions: [],
            groupedPermissions: [],
            permissions: [],
            users: [],
            selectedPermissions: [],
            selectedUsers: [],
        };
    },
    computed: {},
    watch: {
        '$route.params.id': function () {
            this.load().then(() => {
                Vue.nextTick(() => {
                    this.isDirty = false;
                });
            });
        },
        selectedPermissions(v) {
            this.role.permissions = this.permissions.filter(
                p => v.includes(p.id));
        },
        selectedUsers() {
            this.role.users = this.selectedUsers;
        }

    },
    mounted() {
        let self = this;
        this.load().then(() => {
            Vue.nextTick(() => {
                self.isDirty = false;
            });
            self.selectedPermissions = self.role.permissions.map(p => p.id);

        });
        const permissionsUrl = `${thornUrl}/permissions?size=1000`;
        axios.get(permissionsUrl)
            .then(resp => {
                let data = resp.data.data.sort((a, b) => {
                    if (a.applicable_to === b.applicable_to) {
                        return a.description.localeCompare(b.description);
                    } else {
                        return a.applicable_to.localeCompare(b.applicable_to);
                    }
                }
                );
                self.permissions = data;
                this.role.permissions = this.permissions.filter(
                    p => this.selectedPermissions.includes(p.id));

                self.groupedPermissions = data.reduce(
                    (entryMap, e) => entryMap.set(e.applicable_to,
                        [...entryMap.get(e.applicable_to) || [], e]),
                    new Map());

            }).catch(function (e) {
                self.error(e);
            });

    },
    /* Methods */
    methods: {
        load() {
            let self = this;
            if (!self.add) {
                return new Promise((resolve, reject) => {
                    axios
                        .get(`${thornUrl}/roles/${this.$route.params.id}`)
                        .then(resp => {
                            self.role = resp.data.data[0];
                            resolve();
                        })
                        .catch(function (e) {
                            self.error(e);
                            reject();
                        });
                });
            } else {
                return new Promise(() => {
                    self.role = { id: '', enabled: false };
                });
            }
        },
        success(msg) {
            this.$snotify.success(msg, this.$t('titles.success'));
        },
        error(e) {
            if (e.name === 'NetworkError') {
                this.$snotify.error(
                    this.$t('errors.disconnected'),
                    this.$t('titles.error')
                );
            } else if (e.response && e.response.data) {
                this.$snotify.error(e.response.data.message, this.$t('titles.error'));
            } else {
                this.$snotify.error(e.message, this.$t('titles.error'));
            }
        },
        onSearchUsers(search, loading) {
            loading(true);
            this.searchUsers(loading, search, this);
        },
        getUserLabel(opt) {
            return `${opt.first_name}|${opt.last_name}|${opt.email}`;
        },
        searchUsers: debounce((loading, search, vm) => {
            const url = `${thornUrl}/users?fields=id,first_name,last_name,email`;
            const params = { enabled: 1, query: search, size: 10, fields: 'id,first_name,last_name,email' };
            axios.get(url, { params })
                .then(resp => {
                    vm.users = resp.data.data;
                    loading(false);
                })
                .catch(() => {
                    vm.error(vm.data);
                })
        }, 350),
        save(event) {
            let self = this;
            let url = `${thornUrl}/roles/${this.role.id}`;
            let axiosCall = axios.patch
            if (self.add) {
                url = `${thornUrl}/roles`;
                axiosCall = axios.post
            }

            event.target.setAttribute('disabled', 'disabled');
            event.target.classList.remove('btn-spinner');

            return axiosCall(url, this.role)
                .then(resp => {
                    self.role = resp.data;
                    Vue.nextTick(() => {
                        self.isDirty = false;
                    });
                    self.success(
                        this.$t('messages.savedWithSuccess', {
                            what: this.$tc('titles.role', 1)
                        })
                    );
                    this.$router.push({ name: 'AdministrationRoleList' });
                })
                .catch(e => {
                    self.error(e);
                })
                .finally(() => {
                    event.target.removeAttribute('disabled');
                    event.target.classList.add('btn-spinner');
                });
        }
    }
};
</script>