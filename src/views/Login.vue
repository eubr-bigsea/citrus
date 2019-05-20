<template>
  <div class="row">
    <div class="col-12 col-sm-6 col-md-6 col-lg-4 mx-auto">
      <div class="card-wrapper">
        <div class="brand"></div>
        <div class="card fat">
          <div class="card-body">
            <h4 class="card-title float-left">{{$t('titles.login')}}</h4>
            <div class="float-right navbar-brand logo"></div>
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="email">{{$t('common.email')}}</label>
                <input
                  required
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="Name"
                  autofocus
                  autocomplete="username"
                >
              </div>

              <div class="form-group">
                <label for="password">
                  {{$t('common.password')}}
                  <router-link
                    class="float-right"
                    to="/reset_password"
                  >{{$t('common.forgotPassword')}}</router-link>
                </label>
                <div style="position:relative">
                  <input
                    :type="showingPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="password"
                    required
                    style="padding-right: 60px;"
                    placeholder="Password"
                    autocomplete="current-password"
                  >
                  <input type="hidden" id="passeye-0">
                  <div
                    class="show-password btn btn-primary btn btn-sm"
                    @click="showingPassword = !showingPassword"
                    v-text="passwordShowText"
                  ></div>
                </div>
              </div>

              <div class="form-group">
                <label>
                  <input type="checkbox" v-model="rememberPassword">
                  {{$t('common.rememberMe')}}
                </label>
              </div>

              <div class="form-group no-margin text-center">
                <button type="submit" class="btn btn-primary col-md-4">{{$t('common.login')}}</button>
              </div>
              <div class="margin-top20 text-center">
                {{$t('common.dontHaveAccount')}}
                <br>
                <router-link to="/register">{{$t('common.createAccount')}}</router-link>
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
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      rememberPassword: false,
      showingPassword: false
    };
  },
  computed: {
    passwordShowText() {
      return this.$t(this.showingPassword ? 'common.hide' : 'common.show');
    }
  },
  methods: {
    login: function() {
      let self = this;
      let thornUrl = process.env.VUE_APP_THORN_URL;
      let email = this.email;
      let password = this.password;
      this.$store
        .dispatch('login', { thornUrl, user: { email, password } })
        .then(() => this.$router.push('/'))
        .catch(err => {
          let msg = err.message.startsWith('errors.')
            ? self.$t(err.message)
            : err.message;
          self.$snotify.error(msg, self.$t('titles.error'));
        });
    }
  }
};
</script>