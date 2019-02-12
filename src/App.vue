<template>
  <div>
    <vue-snotify></vue-snotify>
    <l-navbar v-if="isLoggedIn"></l-navbar>
    <div class="container-fluid">
      <main role="main">
          <div class="row">
            <div class="col">
                <router-view></router-view>
            </div>
        </div>
      </main>
        
      <vue-progress-bar></vue-progress-bar>
      <l-footer v-if="isLoggedIn"></l-footer>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';


export default {
  name: 'app',
  components: {
    'l-navbar': Navbar,
    'l-footer': Footer
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },
    user() {
      return this.$store.getters.user
    },
  },
  data() {
    return {
    }
  }
}
</script>

<style>
  body {
    background-color: #f8f9fa !important;
  }
</style>