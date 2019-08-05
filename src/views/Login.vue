<template>
  <div class="row">
    <div class="col-12 col-sm-6 col-md-6 col-lg-4 mx-auto">
      <div class="card-wrapper">
        <div class="brand" />
        <div class="card fat">
          <div class="card-body">
            <h4 class="card-title float-left">{{ $t('titles.login') }}</h4>
            <div class="float-right navbar-brand logo" />
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="email">{{ $t('common.email') }}</label>
                <input
                  v-model="email"
                  required
                  type="email"
                  class="form-control"
                  placeholder="Name"
                  autofocus
                  autocomplete="username"
                >
              </div>

              <div class="form-group">
                <label for="password">
                  {{ $t('common.password') }}
                  <router-link
                    class="float-right"
                    to="/reset_password"
                  >{{ $t('common.forgotPassword') }}</router-link>
                </label>
                <div style="position:relative">
                  <input
                    :type="showingPassword ? 'text' : 'password'"
                    v-model="password"
                    class="form-control"
                    required
                    style="padding-right: 60px;"
                    placeholder="Password"
                    autocomplete="current-password"
                  >
                  <input
                    id="passeye-0"
                    type="hidden"
                  >
                  <div
                    class="show-password btn btn-primary btn btn-sm"
                    @click="showingPassword = !showingPassword"
                    v-text="passwordShowText"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>
                  <input
                    v-model="rememberPassword"
                    type="checkbox"
                  >
                  {{ $t('common.rememberMe') }}
                </label>
              </div>

              <div class="form-group no-margin text-center">
                <button
                  type="submit"
                  class="btn btn-primary col-md-4"
                >{{ $t('common.login') }}</button>
              </div>
              <div class="margin-top20 text-center">
                {{ $t('common.dontHaveAccount') }}
                <br>
                <router-link to="/register">{{ $t('common.createAccount') }}</router-link>
              </div>
            </form>
          </div>
        </div>
        <div class="footer text-center">Copyright © 2018 — Lemonade Project</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
label {
  font-size: 0.9em;
  text-align: left;
  width: 100%;
}
.show-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  -webkit-transform: translate(0, -50%);
  -o-transform: translate(0, -50%);
  padding: 2px 7px;
  font-size: 12px;
  cursor: pointer;
}
</style>
<script>
import Notifier from '../mixins/Notifier';

export default {
  name: 'Login',
  mixins: [Notifier],
  data () {
    return {
      email: '',
      password: '',
      rememberPassword: false,
      showingPassword: false
    };
  },
  computed: {
    passwordShowText () {
      return this.$t(this.showingPassword ? 'common.hide' : 'common.show');
    }
  },
  methods: {
    login: function () {
      let thornUrl = process.env.VUE_APP_THORN_URL;
      let email = this.email;
      let password = this.password;
      this.$store
        .dispatch('login', { thornUrl, user: { email, password } })
        .then(() => this.$router.push('/'))
        .catch(e => {
          var err = e
          if (e.response.data.errors[0]) {
            err = { message: `${e.response.data.errors[0].detail}` }
          }
          this.error(err);
        });
    }
  }
};
</script>