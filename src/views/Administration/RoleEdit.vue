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
            <div v-if="role.id" class="col-md-12 col-xg-12 mx-auto">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-3">
                      <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                      <input v-model="role.name" type="text" maxlength="50" required class="form-control">
                    </div>
                    <div class="col-md-6">
                      <label class="font-weight-bold">{{$tc('common.description')}}:</label>
                      <input v-model="role.description" type="text" maxlength="100" class="form-control">
                    </div>
                    <div class="col-md-3 mt-3 mb-3 mt-3">
                      <b-form-checkbox v-model="role.enabled">{{ $t('common.enabled') }}
                      </b-form-checkbox>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                        <label class="col-form-label">
                            {{ $tc('common.permission', 2) }}:
                        </label>
                    </div>
                    <div v-for="p in permissions" :key="p.id" class="col-md-6">
                        <b-form-checkbox v-model="selectedPermissions" :value="p.id">{{p.description}}</b-form-checkbox>
                    </div>
                    <div class="col-md-12">
                        <label class="col-form-label">
                            {{ $tc('titles.user', 2) }}:
                        </label>
                        <v-select v-model="role.permissions" :options="permissions" :multiple="true" label="description" :taggable="false" :close-on-select="false">
                        </v-select>
                    </div>
                 </div>
                  <div class="row">
                    <div class="col-md-12 mt-4 border-top pt-2">
                      <button v-if="!role.system" class="btn btn-primary mr-1 btn-spinner" @click.stop="save">
                        <font-awesome-icon icon="spinner" pulse class="icon" />
                        <span class="fa fa-save"></span>
                        {{$tc('actions.save')}}
                      </button>
                      <router-link :to="{name: 'AdministrationRoleList'}" class="btn btn-secondary mr-1">
                        {{$tc('actions.cancel')}}</router-link>
                    </div>
                  </div>
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
                selectedPermissions: []
            };
        },
        computed: {},
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
            }
        },
        mounted() {
            let self = this;
            this.load().then(() => {
                Vue.nextTick(() => {
                    self.isDirty = false;
                });
                self.selectedPermissions = self.role.permissions.map(p=>p.id);
                const permissionsUrl = `${thornUrl}/permissions`;
                axios.get(permissionsUrl)
                    .then(resp => {
                        self.permissions = resp.data.data.sort((a, b) => a.description.localeCompare(b.description));
                    }).catch(function (e) {
                        self.error(e);
                    });
 
            });

        },
        /* Methods */
        methods: {
            load() {
                let self = this;
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
            save(event) {
                let self = this;
                const url = `${thornUrl}/roles/${this.role.id}`;

                event.target.setAttribute('disabled', 'disabled');
                event.target.classList.remove('btn-spinner');

                return axios
                    .patch(url, this.role)
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
