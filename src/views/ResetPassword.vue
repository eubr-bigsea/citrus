<template>
  <div class="row">
    <div class="col-12 col-sm-6 col-md-6 col-lg-4 mx-auto">
      <div class="card-wrapper">
        <div class="brand"></div>
        <div class="card fat">
          <div class="card-body">
            <h4 class="card-title float-left">{{$t('titles.resetPassword')}}</h4>
            <div class="float-right navbar-brand logo"></div>

            <form v-if="!showSuccess" @submit.prevent="resetPassword">
              <div class="form-group">
                <label for="email">{{$t('common.email')}}</label>
                <input v-model="email" required type="email" class="form-control" placeholder="Email" autofocus/>
              </div>

              <div class="form-group no-margin text-center">
                <button
                  type="submit"
                  class="btn btn-primary col-md-4"
                >{{$t('common.resetPassword')}}</button>
              </div>
           </form>
            <br/>
            <div v-if="showSuccess" style="clear: both" class="mt-2 border-top" 
                    v-html="$t('messages.resetPasswordInstructions', {email: supportEmail})">
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
          </div>
        </div>
        <div class="footer text-center">Copyright © 2017-2021 — Lemonade Project</div>
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
import axios from 'axios';
import Notifier from '../mixins/Notifier';
export default {
  name: "ResetPassword",
  mixins: [Notifier],
  data() {
    return {
      email: "",
      showSuccess: false,
      supportEmail: ''
    };
  },
  methods: {
    resetPassword: function() {
      let self = this;
      let thornUrl = process.env.VUE_APP_THORN_URL;
      let email = this.email;
      let url = `${thornUrl}/password/reset`;
      let headers = { Accept: 'application/json; charset=utf-8' };
      axios({ url, data: {email}, method: 'POST', headers })
          .then(resp => {
              self.supportEmail = resp.data.supportEmail;
              self.showSuccess = true;
          })
          .catch(err => {
              self.error(err.response.data.message);
              self.showSuccess = false;
          });
    }
  }
}
</script>
