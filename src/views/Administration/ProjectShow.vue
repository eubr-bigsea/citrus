<template>
  <main role="main">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card fat">
          <div class="card-header text-center bg-secondary text-white">
            {{ $t('actions.show') }} {{ $tc('titles.project', 1) }}
          </div>
          <div class="card-body">
            <form @submit.prevent="save">
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.project.name') }}
                </label>
                <div class="col-sm-9">
                  <input v-model="project.name" class="form-control" disabled />
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="projectDescTextArea"
                  class="col-sm-3 col-form-label"
                >
                  {{ $t('common.project.description') }}
                </label>
                <div class="col-sm-9">
                  <textarea
                    id="projectDescTextArea"
                    v-model="project.description"
                    class="form-control"
                    rows="3"
                    disabled
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.project.category') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="project.category"
                    type="text"
                    class="form-control"
                    disabled
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.project.subcategory') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="project.subcategory"
                    type="text"
                    class="form-control"
                    disabled
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.project.managers') }}
                </label>
                <div v-if="project.managers" class="col-sm-9">
                  <router-link
                    v-for="manager in project.managers"
                    :key="manager.id"
                    :to="{
                      name: 'AdministrationEditUser',
                      params: { id: manager.id }
                    }"
                    style="display:block;"
                  >
                    {{ manager.full_name }} - {{ manager.email }}
                  </router-link>
                </div>
              </div>

              <div class="form-group row border-top clearfix pt-3">
                <div class="col-sm-12 text-center">
                  <router-link
                    :to="{ name: 'AdministrationProjectList' }"
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
  name: 'ProjectAdd',
  mixins: [Notifier],
  data() {
    return {
      project: {},
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
          var found = this.project.managers.find(manager => {
            return manager.id === userObject.id;
          });
          if (found) {
            return;
          } else {
            this.project.managers.push(userObject);
          }
        });
      }
    },
    removeManager(managersChoosed) {
      if (this.project.managers && managersChoosed) {
        managersChoosed.forEach(manager => {
          let index = this.project.managers.indexOf(manager);
          this.project.managers.splice(index, 1);
        });
      }
    },
    load() {
      let self = this;
      let projectId = this.$route.params.id;
      const url = `${thornUrl}/administration/projects/${projectId}`;

      return new Promise((resolve, reject) => {
        axios
          .get(url)
          .then(resp => {
            self.project = deserialize(resp.data);
            if (!self.project.managers) {
              self.project.managers = [];
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
      let projectId = this.$route.params.id;
      const url = `${thornUrl}/administration/projects/${projectId}`;
      let project = self.project;
      let managers_ids = self.project.managers.map(users => {
        return users.id.toString();
      });
      delete self.project.managers;
      self.project.managers_ids = managers_ids;

      this.$Progress.start();
      return axios
        .put(url, { project })
        .then(resp => {
          this.$Progress.finish();
          this.$router.push({ name: 'AdministrationProjectList' });
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
