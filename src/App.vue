<template>
  <div>
    <vue-snotify></vue-snotify>
    <l-navbar v-if="isLoggedIn"></l-navbar>
    <div class="container-fluid main-container">
      <router-view></router-view>

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
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.getters.user;
    }
  },
  data() {
    return {
      columns: ['code', 'symbol', 'rate'],
      tableData: [],
      options: {
        xtemplates: {
          symbol: function(row) {
            return row.symbol;
          }
        },
        headings: {
          code: 'ID',
          symbol: 'Symbol',
          rate: 'Rate'
        },
        sortable: ['name', 'album'],
        filterable: ['name', 'album']
      }
    };
  }
};
</script>

<style>
body {
  background-color: #f8f9fa !important;
}
.main-container {
    padding-top: 15px;
  }
</style>