<template>
  <main role="main">
    <div class="row">
      <div class="col-md-6 mx-auto">
        <div class="card fat">
          <div class="card-header text-center bg-secondary text-white">
            {{ $t('actions.new') }} {{ $tc('titles.user', 1) }}
          </div>
          <div class="card-body">
            <form @submit.prevent="save">
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.firstName') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="user.first_name"
                    type="text"
                    class="form-control"
                    required
                    autofocus
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">
                  {{ $t('common.lastName') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="user.last_name"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="inputEmail3" class="col-sm-3 col-form-label">
                  {{ $t('common.email') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="user.email"
                    type="email"
                    class="form-control"
                    required
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="inputRole" class="col-sm-3 col-form-label">
                  {{ $t('common.roles') }}
                </label>
                <div class="col-sm-9">
                  <select v-model="user.roles" class="form-control">
                    <option value="admin">{{ $t('common.adminRole') }}</option>
                    <option value="manager">{{ $t('common.managerRole') }}</option>
                    <option value="monitor">{{ $t('common.monitorRole') }}</option>
                    <option value="user">{{ $t('common.userRole') }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword3" class="col-sm-3 col-form-label">
                  {{ $t('common.password') }}
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="user.password"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="inputEmail3" class="col-sm-3 col-form-label">
                  {{ $t('common.language') }}
                </label>
                <div class="col-sm-9">
                  <select v-model="user.locale" class="form-control">
                    <option value="en">English/Inglês</option>
                    <option value="pt">Português/Portuguese</option>
                  </select>
                </div>
              </div>
              <div class="form-group row border-top clearfix pt-3">
                <div class="col-sm-12 text-center">
                  <button type="submit" class="btn btn-primary mr-2 pr-5 pl-5">
                    {{ $t('common.ok') }}
                  </button>
                  <router-link
                    :to="{ name: 'AdministrationUserList' }"
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

let thornUrl = process.env.VUE_APP_THORN_URL;

export default {
  name: 'UserAdd',
  mixins: [Notifier],
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    save() {
      const self = this;
      let url = `${thornUrl}/administration/users`;
      let user = self.user;
      console.log(user);

      this.$Progress.start();
      return axios
        .post(url, { user })
        .then(resp => {
          this.$Progress.finish();
          this.$router.push({ name: 'AdministrationUserList' });
        })
        .catch(
          function(e) {
            var err = e;
            this.$Progress.finish();
            if (e.response.data.errors[0]) {
              let pointer = e.response.data.errors[0].source.pointer;
              let detail = e.response.data.errors[0].source.detail;

              err = {
                message: `${pointer} ${detail}`
              };
            }

            this.error(err);
          }.bind(this)
        );
    }
  }
};
</script>
