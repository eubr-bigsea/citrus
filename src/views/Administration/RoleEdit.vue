<template>
  <main role="main">
    <div class="row">
      <div class="col">
        <div>
          <div class="d-flex justify-content-between align-items-center">
            <h1>{{$tc('titles.role', 1)}}</h1>
          </div>
          <hr>
          <div class="row">
            <div class="col-md-12 col-xg-12 mx-auto">
              <div class="card">
                <div class="card-body">
                  <form @submit.prevent="save">
                  <div class="row">
                    <div class="col-md-3">
                      <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                      <input v-model="role.name" type="text" maxlength="50" required class="form-control">
                    </div>
                    <div class="col-md-6">
                      <label class="font-weight-bold">{{$tc('common.description')}}:</label>
                      <input v-model="role.description" type="text" maxlength="100" class="form-control" required>
                    </div>
                    <div class="col-md-3 mt-3 mb-3 mt-3">
                      <b-form-checkbox v-model="role.enabled">{{ $t('common.enabled') }}
                      </b-form-checkbox>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-8">
                        <label class="col-form-label">
                            {{ $tc('common.permission', 2) }}:
                        </label>
					    <div class="row">
                            <div v-for="p in permissions" :key="p.id" class="col-md-6" :title="p.name">
                                <b-form-checkbox v-model="selectedPermissions" :value="p.id">{{p.description}} 
								</b-form-checkbox>
                            </div>
						</div>
					</div>
                    <div v-if="!role.all_user" class="col-md-4">
                        <label class="col-form-label">
                            {{ $tc('titles.user', 2) }}:
                        </label>
                        <v-select style="font-size: .9em" v-model="role.users" :multiple="true" :options="users" @search="onSearchUsers" :taggable="false" 
							:get-option-label="getUserLabel" :close-on-select="true" label="id">
							<template #no-options="{ search, searching, loading }">
								{{$t('common.noResults')}}
                            </template>
                           <template slot="selected-option" slot-scope="option">
                               {{ option.first_name}} {{option.last_name}} &nbsp;<small>({{option.email}})</small>
                           </template>
                           <template slot="option" slot-scope="option">
                               <span class="fa fa-user"></span>
                               {{ option.first_name}} {{option.last_name}} &nbsp;<small>({{option.email}})</small>
                           </template>
                        </v-select>
                    </div>
                 </div>
                  <div class="row">
                    <div class="col-md-12 mt-4 border-top pt-2">
                      <button v-if="!role.system" class="btn btn-primary mr-1 btn-spinner" type="submit">
                        <font-awesome-icon icon="spinner" pulse class="icon" />
                        <span class="fa fa-save"></span>
                        {{$tc('actions.save')}}
                      </button>
                      <router-link :to="{name: 'AdministrationRoleList'}" class="btn btn-secondary mr-1">
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
    import VueSelect from 'vue-select';
    import SwitchComponent from '../../components/widgets/Switch.vue';

    let thornUrl = process.env.VUE_APP_THORN_URL;

    export default {
        components: {
            'v-select': VueSelect,
            SwitchComponent
        },
        data() {
            return {
                isDirty: false,
                role: {},
                idsPermissions: [],
                permissions: [],
				users: [],
                selectedPermissions: [],
				selectedUsers: [],
            };
        },
        computed: {},
        props: {
            add: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            '$route.params.id': function (id) {
                this.load().then(() => {
                    Vue.nextTick(() => {
                        this.isDirty = false;
                    });
                });
            },
            selectedPermissions(v){
                const self = this
                self.role.permissions = self.permissions.filter(
                         p => v.includes(p.id));
            },
            selectedUsers(v){
                this.role.users = this.selectedUsers;
            }

        },
        mounted() {
            let self = this;
            this.load().then(() => {
                Vue.nextTick(() => {
                    self.isDirty = false;
                });
                self.selectedPermissions = self.role.permissions.map(p=>p.id);

            });
            const permissionsUrl = `${thornUrl}/permissions?size=1000`;
            axios.get(permissionsUrl)
                .then(resp => {
                    self.permissions = resp.data.data.sort((a, b) => a.description.localeCompare(b.description));
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
                    return new Promise((resolve, reject) => {
                        self.role = {id: '', enabled: false};
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
			onSearchUsers(search, loading){
				loading(true);
				this.searchUsers(loading, search, this);
			},
			getUserLabel(opt){
				return `${opt.first_name}|${opt.last_name}|${opt.email}`; 
			},
			searchUsers: _.debounce((loading, search, vm) => {
				const url = `${thornUrl}/users`;
				const params = {enabled: 1, query: search, size: 10, fields: 'id,first_name,last_name,email'};
				axios.get(url, {params})
					.then(resp => {
						vm.users = resp.data.data;
						loading(false);
					})
					.catch(resp => {
						vm.error(vm.data);
					})
			}, 350),
            save(event) {
                let self = this;
                let url = `${thornUrl}/roles/${this.role.id}`;
                let axiosCall = axios.patch
                if (self.add){
                    url = `${thornUrl}/roles`;
                    axiosCall = axios.post
                }

                event.target.setAttribute('disabled', 'disabled');
                event.target.classList.remove('btn-spinner');

                return axiosCall(url, this.role)
                    .then(resp => {
                        event.target.removeAttribute('disabled');
                        event.target.classList.add('btn-spinner');
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
