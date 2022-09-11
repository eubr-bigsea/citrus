<template>
  <div class="row">
    <div class="col-12 col-sm-6 col-md-6 col-lg-5 mx-auto">
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
                <div class="form-group col-md-4">
                    <label for="firstName">{{ $tc('common.firstName') }}:</label>
                    <input
                      v-model="firstName"
                      required
                      class="form-control"
                      autofocus="true"
                    />
                </div>
                <div class="form-group col-md-8">
                    <label for="lastName">{{ $tc('common.lastName') }}:</label>
                    <input
                      v-model="lastName"
                      required
                      class="form-control"
                      autofocus="true"
                    />
                </div>
                <div class="col-md-12">
                  <label for="email">{{ $t('common.email') }}:</label>
                  <input
                    v-model="email"
                    required
                    type="email"
                    class="form-control"
                  />
                </div>
                <div class="form-group col-md-6">
                  <label for="password">{{ $t('common.password') }}:</label>
                  <div style="position:relative">
                    <input v-model="password" type="password" class="form-control" required minlength="5"/>
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <label for="confirmPassword">{{ $t('common.confirmPassword') }}:</label>
                  <div style="position:relative">
                    <input
                      v-model="confirmPassword"
                      type="password"
                      class="form-control"
                      required
                    />
                  </div>
                </div>
                <div class="form-group col-md-12">
                  <label for="confirmPassword">{{
                    $t('common.description')
                  }}:</label>
                  <div style="position:relative">
                    <textarea v-model="notes" class="form-control" rows="2"/>
                    <small>{{$t('messages.notesDescription')}}</small>
                  </div>
                </div>

              </div>
              <div class="form-group no-margin text-center">
                <label>
                  <b-check v-model="accepted">
                    <i18n path="messages.acceptTerms" tag="span">
                        <router-link to="/conditions">{{ $t('messages.acceptTerms0') }}</router-link>
                    </i18n>
                  </b-check>
                </label>
              </div>
              <div class="form-group no-margin text-center">
                <button type="submit" class="btn btn-primary col-md-4" :disabled="!accepted">
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
          Copyright © 2016-2022  — Lemonade Project
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      notes: '',
      password: '',
      confirmPassword: '',
      accepted: false
    };
  },
  methods: {
    register: function() {
      let self = this;
      if (!this.accepted) {
         self.$snotify.warning(
          self.$t('errors.acceptTerms'),
          self.$t('common.attention')
        );
          return false;
      }
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
        password: this.password,
        notes: this.notes,
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
          const json = err.response.data;
          self.$snotify.error(json.message || err, self.$t('errors.sendingData'));
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
