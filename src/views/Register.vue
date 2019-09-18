<template>
  <div class="row">
    <div class="col-12 col-sm-6 col-md-6 col-lg-4 mx-auto">
      <div class="card-wrapper">
        <div class="brand" />
        <div class="card fat">
          <div class="card-body">
            <div class="border-bottom clearfix mb-3 pb-3">
              <h4 class="card-title float-left">{{ $t('titles.register') }}</h4>
              <div class="float-right navbar-brand logo" />
            </div>
            <div class="clearfix" />
            <form @submit.prevent="register">
              <div class="row clear">
                <div class="form-group col-md-6">
                  <div class="form-group">
                    <label for="firstName">{{ $tc('common.firstName') }}</label>
                    <input
                      v-model="firstName"
                      required
                      class="form-control"
                      autofocus="true"
                    />
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <div class="form-group">
                    <label for="lastName">{{ $tc('common.lastName') }}</label>
                    <input
                      v-model="lastName"
                      required
                      class="form-control"
                      autofocus="true"
                    />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="email">{{ $t('common.email') }}</label>
                <input
                  v-model="email"
                  required
                  type="email"
                  class="form-control"
                />
              </div>
              <div class="row">
                <div class="form-group col-md-6">
                  <label for="password">{{ $t('common.password') }}</label>
                  <div style="position:relative">
                    <input
                      v-model="password"
                      type="password"
                      class="form-control"
                      required
                    />
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <label for="confirmPassword">{{
                    $t('common.confirmPassword')
                  }}</label>
                  <div style="position:relative">
                    <input
                      v-model="confirmPassword"
                      type="password"
                      class="form-control"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="form-group no-margin text-center">
                <label>
                  <input v-model="accepted" type="checkbox" />&nbsp;&nbsp;
                  <span v-html="$t('messages.acceptTerms')"></span>
                </label>
              </div>
              <div class="form-group no-margin text-center">
                <button type="submit" class="btn btn-primary col-md-4">
                  {{ $t('titles.register') }}
                </button>
              </div>

              <div class="margin-top20 border-top text-center">
                {{ $t('common.alreadyHaveAccount') }}
                <br />
                <router-link to="/login">{{ $t('common.login') }}</router-link>
              </div>
            </form>
          </div>
        </div>
        <div class="footer text-center">
          Copyright © 2019 — Lemonade Project
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      accepted: false
    };
  },
  methods: {
    register: function() {
      let self = this;
      if (this.password !== self.confirmPassword) {
        self.$snotify.warning(
          self.$t('errors.passwordDontMatch'),
          self.$t('common.attention')
        );
        return;
      }
      let thornUrl = process.env.VUE_APP_THORN_URL;
      let data = {
        first_name: self.firstName,
        last_name: self.lastName,
        email: this.email,
        password: this.password
      };
      this.$store
        .dispatch('register', { thornUrl, data })
        .then(() => {
          self.$snotify.success(
            self.$t('messages.registeredWithSuccess'),
            self.$t('titles.success')
          );
          this.$router.push('/');
        })
        .catch(err => {
          const json = JSON.parse(err.request.responseText);
          const emailTaken = json['email'] === 'has already been taken';
          let msg = '';
          if (emailTaken) {
            msg = self.$tc('errors.loginInUse');
          } else {
            msg = self.$tc('errors.missingRequiredValue');;
          }
          self.$snotify.error(msg, self.$t('errors.sendingData'));
        });
    }
  }
};
</script>
<style scoped>
label {
  font-size: 0.9em;
  text-align: left;
  width: 100%;
}
</style>
