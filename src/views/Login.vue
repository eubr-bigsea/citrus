<template>
  <span></span>
</template>
<script>
export default {
  data() {
    return {};
  },
  created: function() {
    if (this.$store.getters.isLoggedIn) {
      this.$router.push("/");
    } else {
      this.$store.dispatch("login");
    }
  }
};
</script>