<template>
  <main role="main">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card fat">
          <div class="card-header text-center bg-secondary text-white">
            {{ $t('actions.edit') }} {{ $tc('titles.team', 1) }}
          </div>
          <div class="card-body">
            <form @submit.prevent="save">
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.team.name') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="team.name"
                    type="text"
                    class="form-control"
                    required
                    autofocus
                  />
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="teamDescTextArea"
                  class="col-sm-3 col-form-label"
                >
                  {{ $t('common.team.description') }}
                </label>
                <div class="col-sm-9">
                  <textarea
                    id="teamDescTextArea"
                    v-model="team.description"
                    class="form-control"
                    rows="3"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.team.category') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="team.category"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.team.subcategory') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="team.subcategory"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
              </div>
              <div class="row text-center">
                <label class="col-sm-12 col-form-label">
                  {{ $t('common.team.managers') }}
                </label>
              </div>
              <div class="form-row text-center">
                <div class="col-sm-6">
                  <label for="userSelectBox">{{ $tc('titles.user', 2) }}</label>
                </div>
                <div class="col-sm-6">
                  <label for="managerSelectBox">
                    {{ $t('common.team.managers') }}
                  </label>
                </div>
              </div>
              <div class="form-row text-center">
                <div class="col-md-5">
                  <div class="form-group">
                    <span v-if="users">
                      <select
                        id="userSelectBox"
                        v-model="usersIdSelected"
                        class="form-control"
                        multiple
                      >
                        <option
                          v-for="user in users"
                          :key="user.id"
                          :value="user.id"
                        >
                          {{ user.full_name }} - {{ user.email }}
                        </option>
                      </select>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="row text-center mt-2">
                    <div class="col align-middle mx-auto">
                      <b-button-group vertical>
                        <b-button @click="addManager(usersIdSelected)">
                          +
                        </b-button>
                        <b-button @click="removeManager(managersIdSelected)">
                          -
                        </b-button>
                      </b-button-group>
                    </div>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="form-group">
                    <select
                      id="managerSelectBox"
                      v-model="managersIdSelected"
                      class="form-control"
                      multiple
                    >
                      <option
                        v-for="manager in team.managers"
                        :key="manager.id"
                        :value="manager"
                      >
                        {{ manager.full_name }} - {{ manager.email }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="form-group row border-top clearfix pt-3">
                <div class="col-sm-12 text-center">
                  <button type="submit" class="btn btn-primary mr-2 pr-5 pl-5">
                    {{ $t('common.ok') }}
                  </button>
                  <router-link
                    :to="{ name: 'AdministrationTeamList' }"
                    class="btn btn-secondary text-white"
                  >
                    {{ $t('actions.cancel') }}
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
  name: 'TeamAdd',
  mixins: [Notifier],
  data() {
    return {
      team: {},
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
