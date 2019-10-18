<template>
  <main role="main">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card fat">
          <div class="card-header text-center bg-secondary text-white">
            {{ $t('actions.show') }} {{ $tc('titles.team', 1) }}
          </div>
          <div class="card-body">
            <form @submit.prevent="save">
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.team.name') }}
                </label>
                <div class="col-sm-9">
                  <input v-model="team.name" class="form-control" disabled />
                </div>
              </div>
              <div class="form-group row">
                <label for="teamDescTextArea" class="col-sm-3 col-form-label">
                  {{ $t('common.team.description') }}
                </label>
                <div class="col-sm-9">
                  <textarea
                    id="teamDescTextArea"
                    v-model="team.description"
                    class="form-control"
                    rows="3"
                    disabled
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $tc('titles.project') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="team.project.name"
                    type="text"
                    class="form-control"
                    disabled
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.team.leaders') }}
                </label>
                <div v-if="team.leaders" class="col-sm-9">
                  <router-link
                    v-for="leader in team.leaders"
                    :key="leader.id"
                    :to="{
                      name: 'AdministrationEditUser',
                      params: { id: leader.id }
                    }"
                    style="display:block;"
                  >
                    {{ leader.full_name }} - {{ leader.email }}
                  </router-link>
                </div>
              </div>
              <div class="form-group row">
                <div class="col">
                  <div class="row text-center">
                    <label class="col-sm-12 col-form-label strong">
                      {{ $tc('titles.user', 2) }}
                    </label>
                  </div>
                  <table v-if="team.users" class="table">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">{{ $tc('common.name') }}</th>
                        <th scope="col">{{ $tc('common.email') }}</th>
                        <th scope="col">{{ $tc('common.confirmed_at') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in team.users" :key="user.id">
                        <th scope="row">
                          <router-link
                            :to="{
                              name: 'AdministrationEditUser',
                              params: { id: user.id }
                            }"
                          >
                            {{ user.id }}
                          </router-link>
                        </th>
                        <td>
                          <router-link
                            :to="{
                              name: 'AdministrationEditUser',
                              params: { id: user.id }
                            }"
                          >
                            {{ user.full_name }}
                          </router-link>
                        </td>
                        <td>
                          <router-link
                            :to="{
                              name: 'AdministrationEditUser',
                              params: { id: user.id }
                            }"
                          >
                            {{ user.email }}
                          </router-link>
                        </td>
                        <td>
                          <div v-if="isConfirmedUser(user.confirmed_at)">
                            {{ user.confirmed_at | formatJsonDate }}
                            <font-awesome-icon icon="check" />
                          </div>
                          <button
                            v-else
                            class="btn btn-sm btn-success"
                            @click="confirmUser(user.id)"
                          >
                            {{ $t('common.confirm') }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="form-group row border-top clearfix pt-3">
                <div class="col-sm-12 text-center">
                  <router-link
                    :to="{ name: 'AdministrationTeamList' }"
                    class="btn btn-primary mr-2 pr-5 pl-5"
                  >
                    {{ $t('common.ok') }}
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
import Notifier from '../../mixins/Notifier';
import { deserialize } from 'jsonapi-deserializer';
import Vue from 'vue';

let thornUrl = process.env.VUE_APP_THORN_URL;

export default {
  name: 'TeamShow',
  mixins: [Notifier],
  data() {
    return {
      team: { project: {} },
      usersIdSelected: [],
      managersIdSelected: [],
      users: []
    };
  },
  mounted() {
    let self = this;
    this.load().then(() => {
      Vue.nextTick(() => {
        self.isDirty = false;
      });
    });
    this.loadUsers().then(() => {
      Vue.nextTick(() => {
        self.isDirty = false;
      });
    });
  },
  methods: {
    isConfirmedUser(confirmed_at) {
      return confirmed_at !== null;
    },
    confirmUser(userId) {
      const self = this;
      this.confirm(
        self.$t('actions.confirm'),
        self.$t('messages.doYouWantToConfirm'),
        () => {
          const url = `${thornUrl}/administration/users/${userId}/confirm`;
          axios
            .post(url, {})
            .then(resp => {
              self.success(
                self.$t('messages.successConfirmation', {
                  what: this.$tc('titles.user', 1)
                })
              );
              self.$refs.userList.refresh();
            })
            .catch(e => self.error(e));
        }
      );
    },
    addManager(usersIds) {
      if (usersIds) {
        usersIds.forEach(userId => {
          let userObject = this.users.find(element => {
            return element.id === userId;
          });
          var found = this.team.managers.find(manager => {
            return manager.id === userObject.id;
          });
          if (found) {
            return;
          } else {
            this.team.managers.push(userObject);
          }
        });
      }
    },
    removeManager(managersChoosed) {
      if (this.team.managers && managersChoosed) {
        managersChoosed.forEach(manager => {
          let index = this.team.managers.indexOf(manager);
          this.team.managers.splice(index, 1);
        });
      }
    },
    load() {
      let self = this;
      let teamId = this.$route.params.id;
      const url = `${thornUrl}/administration/teams/${teamId}`;

      return new Promise((resolve, reject) => {
        axios
          .get(url)
          .then(resp => {
            self.team = deserialize(resp.data);
            if (!self.team.managers) {
              self.team.managers = [];
            }
            resolve();
          })
          .catch(function(e) {
            self.error(e);
          });
      });
    },
    loadUsers() {
      let self = this;
      let usersAttributes = null;
      const url = `${thornUrl}/administration/users`;

      return new Promise((resolve, reject) => {
        axios
          .get(url)
          .then(resp => {
            usersAttributes = deserialize(resp.data);
            usersAttributes.forEach(user => {
              let info = {};
              info.id = Number(user.id);
              info.full_name = user.full_name;
              info.email = user.email;

              self.users.push(info);
            });
            resolve();
          })
          .catch(function(e) {
            self.error(e);
          });
      });
    },
    save() {
      const self = this;
      let teamId = this.$route.params.id;
      const url = `${thornUrl}/administration/teams/${teamId}`;
      let team = self.team;
      let managers_ids = self.team.managers.map(users => {
        return users.id.toString();
      });
      delete self.team.managers;
      self.team.managers_ids = managers_ids;

      this.$Progress.start();
      return axios
        .put(url, { team })
        .then(resp => {
          this.$Progress.finish();
          this.$router.push({ name: 'AdministrationTeamList' });
        })
        .catch(
          function(e) {
            var err = e;
            self.$Progress.finish();
            if (e.response.data.errors[0]) {
              let pointer = e.response.data.errors[0].source.pointer;
              let detail = e.response.data.errors[0].source.detail;

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

<style scoped>
</style>
