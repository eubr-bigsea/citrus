<template>
  <div class="row">
    <div class="col-12 col-sm-6 col-md-6 col-lg-4 mx-auto">
      <div class="card-wrapper">
        <div class="brand"></div>
        <div class="card fat">
          <div class="card-body">
            <h4 class="card-title float-left">{{$t('titles.resetPassword')}}</h4>
            <div class="float-right navbar-brand logo"></div>
            <form @submit.prevent="resetPassword">
              <div class="form-group">
                <label for="email">{{$t('common.email')}}</label>
                <input
                  required
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="Email"
                  autofocus
                >
              </div>

              <div class="form-group no-margin text-center">
                <button
                  type="submit"
                  class="btn btn-primary col-md-4"
                >{{$t('common.resetPassword')}}</button>
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
</style>
<script>
export default {
  name: "ResetPassword",
  data() {
    return {
      email: ""
    };
  },
  methods: {
    resetPassword: function() {
      let self = this;
      let thornUrl = process.env.VUE_APP_THORN_URL;
      let email = this.email;
      this.$store
        .dispatch("resetPassword", { thornUrl, user: { email } })
        .then(() => this.$router.push("/"))
        .catch(err => {
          console.log(err.message.startsWith("errors."), err.message);

          let msg = err.message.startsWith("errors.")
            ? self.$t(err.message)
            : err.message;
          self.$snotify.error(msg, self.$t("titles.error"));
        });
    }
  }
};
</script>