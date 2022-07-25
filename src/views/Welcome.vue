<template>
  <div class="row">
    <div class="col-12 col-sm-6 col-md-6 col-lg-5 mx-auto">
      <div class="card-wrapper">
        <div class="brand" />
        <div class="card fat">
          <div class="card-body">
            <div class="border-bottom clearfix mb-3 pb-3">
              <h4 class="card-title float-left">{{ $t('titles.welcome') }}</h4>
              <div class="float-right navbar-brand logo" />
            </div>
            <div>
                <span v-html="$tc('messages.welcome')"></span>
            </div>
            <div class="border-top mt-2 pt-2">
                <router-link to="/login" class="btn btn-sm btn-primary">{{ $t('common.login') }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'WelcomeComponent'
}
