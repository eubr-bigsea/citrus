<template>
  <div class="row">
    <div class="col-sm-3 col-md-3 col-lg-3 mx-auto">
      <div class="card-wrapper">
        <div class="brand"></div>
        <div class="card fat">
          <div class="card-body">
            <h4 class="card-title float-left">{{$t('titles.changePassword')}}</h4>
            <div class="float-right navbar-brand logo"></div>
            <form @submit.prevent="changePassword">
              <div class="form-group">
                <label for="password">{{$t('common.password')}}</label>
                <div style="position:relative">
                  <input
                    :type="showingPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="password"
                    required
                    style="padding-right: 60px;"
                    placeholder="Password"
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
                <label for="password-confirmation">{{$t('common.confirmPassword')}}</label>
                <div style="position:relative">
                  <input
                    :type="showingPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="passwordConfirmation"
                    required
                    style="padding-right: 60px;"
                    placeholder="Password"
                  >
                </div>
              </div>

              <div class="form-group no-margin text-center">
                <button
                  type="submit"
                  class="btn btn-primary col-md-4"
                >{{$t('common.changePassword')}}</button>
              </div>
              <div class="margin-top20 border-top text-center">
                {{$t('common.alreadyHaveAccount')}}
                <br>
                <router-link to="/login">{{$t('common.login')}}</router-link>
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
  name: "ChangePassword",
  data() {
    return {
      password: "",
      passwordConfirmation: "",
      showingPassword: false
    };
  },
  computed: {
    passwordShowText() {
      return this.$t(this.showingPassword ? "common.hide" : "common.show");
    }
  },
  methods: {
    changePassword: function() {
      let self = this;
      let thornUrl = process.env.VUE_APP_THORN_URL;
      let password = this.password;
      let password_confirmation = this.passwordConfirmation;
      let reset_password_token = this.$route.query.reset_password_token;

      if (password.length < 6) {
        let msg = self.$t("errors.passwordTooShort");
        self.$snotify.error(msg, self.$t("titles.error"));
      } else if (password !== password_confirmation) {
        let msg = self.$t("errors.passwordDontMatch");
        self.$snotify.error(msg, self.$t("titles.error"));
      } else {
        this.$store
          .dispatch("changePassword", {
            thornUrl,
            user: {
              password,
              password_confirmation,
              reset_password_token
            }
          })
          .then(() => this.$router.push("/"))
          .catch(err => {
            let msg = err.message.startsWith("errors.")
              ? self.$t(err.message)
              : err.message;
            self.$snotify.error(msg, self.$t("titles.error"));
          });
      }
    }
  }
};
</script>