<template>
  <div class="row">
    <div class="col-12 col-sm-6 col-md-6 col-lg-4 mx-auto">
      <div class="card-wrapper">
        <div class="brand"></div>
        <div class="card fat">
          <div class="card-body">
            <div class="row">
                <div class="col-md-12">
                    <h4 class="card-title float-left">{{$t('titles.changePassword')}}</h4>
                    <div class="float-right navbar-brand logo"></div>
                </div>
            </div>
            <div v-if="tokenOk==='PENDING'" class="row mt-2 mb-2 pt-2 border-top">
                <div class="col-md-12">
                {{$t('messages.validatingToken')}}
                </div>
            </div>
            <div v-if="tokenOk==='NOK'" class="row mt-2 mb-2 pt-2 border-top">
                <div class="col-md-12">
                {{$t('messages.tokenNotFound')}}
                </div>
            </div>
            <form v-if="tokenOk==='OK'"  @submit.prevent="changePassword">
              <div class="form-group">
                <label for="password">{{$t('common.password')}}</label>
                <div style="position:relative">
                  <input
                    v-model="password"
                    :type="showingPassword ? 'text' : 'password'"
                    class="form-control"
                    required
                    style="padding-right: 60px;"
                    placeholder="Password"
                  >
                  <input id="passeye-0" type="hidden">
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
                    v-model="passwordConfirmation"
                    :type="showingPassword ? 'text' : 'password'"
                    class="form-control"
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
                >{{$t('common.ok')}}</button>
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
        <div class="footer text-center">Copyright © 2020 — Lemonade Project</div>
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
import axios from 'axios';
const thornUrl = process.env.VUE_APP_THORN_URL;

export default {
  name: 'ChangePassword',
  mixins: [Notifier],
  data() {
    return {
      password: '',
      passwordConfirmation: '',
      showingPassword: false,
      tokenOk: 'PENDING' 
    };
  },
  computed: {
    passwordShowText() {
      return this.$t(this.showingPassword ? 'common.hide' : 'common.show');
    }
  },
  mounted(){
      const self = this;
      axios.get(`${thornUrl}/password/reset`, 
        {params: this.$route.params})
      .then(resp => {
        self.tokenOk= 'OK';
      }).catch(err => {
          self.tokenOk = "NOK";
          self.error(err.response.data);
     });
  },
  methods: {
    changePassword: function() {
      let self = this;
      let thornUrl = process.env.VUE_APP_THORN_URL;
      let password = this.password;
      let password_confirmation = this.passwordConfirmation;
      let reset_password_token = this.$route.query.reset_password_token;

      if (password.length < 6) {
        let msg = self.$t('errors.passwordTooShort');
        self.$snotify.error(msg, self.$t('titles.error'));
      } else if (password !== password_confirmation) {
        let msg = self.$t('errors.passwordDontMatch');
        self.$snotify.error(msg, self.$t('titles.error'));
      } else {
        this.$store
          .dispatch('changePassword', {
            thornUrl,
            user: {
              id: self.$route.params.id,
              password,
              password_confirmation,
              token: self.$route.params.token, 
            }
          })
          .then((resp) => {
              self.success(resp.data.message);
              this.$router.push('/');
          })
          .catch(err => {
              self.error(err.response.data);
          });
      }
    }
  }
};
</script>
