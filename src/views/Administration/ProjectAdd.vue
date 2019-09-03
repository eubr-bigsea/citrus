<template>
  <main role="main">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card fat">
          <div class="card-header text-center bg-secondary text-white">
            {{ $t('actions.new') }} {{ $tc('titles.project', 1) }}
          </div>
          <div class="card-body">
            <form @submit.prevent="save">
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.project.name') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="project.name"
                    type="text"
                    class="form-control"
                    required
                    autofocus
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="projectDescTextArea" class="col-sm-3 col-form-label">
                  {{ $t('common.project.description') }}
                </label>
                <div class="col-sm-9">
                  <textarea
                     id="projectDescTextArea"
                     v-model="project.description"
                     class="form-control"
                     rows="3">
                  </textarea>
                </div>
              </div>

              <div class="form-group row">
                <label for="inputCategory" class="col-sm-3 col-form-label">
                  {{ $t('common.project.category') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="project.category"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="inputSubCategory" class="col-sm-3 col-form-label">
                  {{ $t('common.project.subcategory') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="project.subcategory"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
              </div>
              <div class="row text-center">
                <label class="col-sm-12 col-form-label">
                  {{ $t('common.project.managers') }}
                </label>
              </div>
              <div class="form-row text-center">
                <div class="col-sm-6">
                  <label for="userSelectBox">{{ $tc('titles.user', 2) }}</label>
                </div>
                <div class="col-sm-6">
                  <label for="managerSelectBox">{{ $t('common.project.managers')  }}</label>
                </div>
              </div>
              <div class="form-row text-center">
                <div class="col-md-5">
                  <div class="form-group">
                    <span v-if="users">
                      <select
                        id="userSelectBox"
                        class="form-control"
                        v-model="usersIdSelected" multiple>
                        <option v-for="user in users"
                        v-bind:value="user.id" :key="user.id">{{user.full_name}}</option>
                      </select>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="row text-center mt-2">
                    <div class="col align-middle mx-auto">
                    <b-button-group vertical>
                      <b-button @click="addManager(usersIdSelected)">+</b-button>
                      <b-button @click="removeManager(managersIdSelected)">-</b-button>
                    </b-button-group>
                    </div>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="form-group">
                      <select
                        id="managerSelectBox"
                        class="form-control"
                        v-model="managersIdSelected"
                        multiple>
                        <option v-for="manager in managerArray"
                                :key="manager.id" v-bind:value="manager">{{manager.full_name}}</option>
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
                    :to="{ name: 'AdministrationProjectList' }"
                    class="btn btn-secondary text-white"
                    >{{ $t('actions.cancel') }}</router-link
                  >
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

let thornUrl = process.env.VUE_APP_THORN_URL;

export default {
  name: 'UserAdd',
  mixins: [Notifier],
  data() {
    return {
      project: {},
      users: [],
      usersIdSelected: [],
      managersIdSelected: [],
      managerArray: []
    }
  },
  mounted() {
    let self = this;
    this.loadUsers().then(() => {
      Vue.nextTick(() => {
        self.isDirty = false;
      });
    });
  },
  methods: {
    addManager(usersIds) {
      if (usersIds) {
        usersIds.forEach((userId) => {
          let userObject = this.users.find((element) => {
            return element.id === userId;
          });
          var found = this.managerArray.find((manager) => {
            return manager.id === userObject.id;
          })
          if(found) {
            return;
          }
          else {
            this.managerArray.push(userObject);
          }
        });
      }
    },
    removeManager(managersChoosed) {
      if (this.managerArray && managersChoosed) {
        managersChoosed.forEach((manager) => {
          let index = this.managerArray.indexOf(manager);
          this.managerArray.splice(index, 1);
        });
      }
    },
    save() {
      const self = this;
      const url = `${thornUrl}/administration/projects`;
      let project = self.project;
      let managers_ids = self.managerArray.map((users) => {
        return users.id.toString();
      })
      self.project.managers_ids = managers_ids
      this.$Progress.start();
      return axios
        .post(url, { project })
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
            usersAttributes.forEach((user) => {
              let info = {};
              info.id = Number(user.id);
              info.full_name = user.full_name;

              self.users.push(info);
            })
            resolve();
          })
          .catch(function(e) {
            self.error(e);
          });
      });
    }
  }
};
</script>
