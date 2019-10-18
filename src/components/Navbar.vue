<template>
  <b-navbar id="l-navbar" toggleable="md" type="dark" variant="dark">
    <b-navbar-toggle target="nav_collapse" />

    <b-navbar-brand :to="{ name: 'home' }">
      <div class="logo" title="Lemonade" />
    </b-navbar-brand>

    <b-collapse id="nav_collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item :to="{ name: 'dataSources' }">{{
          $tc('titles.dataSource', 2)
        }}</b-nav-item>
        <b-nav-item :to="{ name: 'workflows' }">{{
          $tc('titles.workflow', 2)
        }}</b-nav-item>
        <b-nav-item :to="{ name: 'jobs' }">{{
          $tc('titles.jobs', 2)
        }}</b-nav-item>
        <b-nav-item :to="{ name: 'dashboards' }">{{
          $tc('titles.dashboard', 2)
        }}</b-nav-item>

        <b-nav-item-dropdown
          v-if="hasRoles"
          :text="$tc('titles.administration', 2)"
          right
        >
          <b-dropdown-item :to="{ name: 'AdministrationUserList' }">
            {{ $tc('titles.user', 2) }}
          </b-dropdown-item>
          <b-dropdown-item :to="{ name: 'AdministrationProjectList' }">
            {{ $tc('titles.project', 2) }}
          </b-dropdown-item>
          <b-dropdown-item :to="{ name: 'AdministrationTeamList' }">
            {{ $tc('titles.team', 2) }}
          </b-dropdown-item>
          <b-dropdown-item v-if="isAdmin" href="#">{{
            $tc('titles.cluster', 2)
          }}</b-dropdown-item>
          <b-dropdown-item v-if="isAdmin" href="#">{{
            $tc('titles.platform', 2)
          }}</b-dropdown-item>
          <b-dropdown-item v-if="isAdmin" href="#">{{
            $tc('titles.storage', 2)
          }}</b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item v-if="isAdmin" href="#">{{
            $tc('titles.template', 2)
          }}</b-dropdown-item>
          <b-dropdown-item v-if="isAdmin" href="#">{{
            $t('titles.toolboxCategory')
          }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template slot="button-content">
            <img :src="getUserAvatar()" class="avatar" />
            {{ getUserFirstName() }}
          </template>
          <b-dropdown-item to="/user/profile">{{
            $t('titles.profile')
          }}</b-dropdown-item>
          <b-dropdown-item to="/logout">{{
            $t('common.logout')
          }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LNavbar',
  components: {},
  computed: {
    ...mapGetters(['hasRoles', 'isAdmin', 'isManager', 'isMonitor'])
  },
  methods: {
    getUserFirstName() {
      return (
        this.$store.getters.user.name || this.$store.getters.user.first_name
      ).split(' ')[0];
    },
    getUserAvatar() {
      return 'data:image/jpeg;base64,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';
    },
    getUserIsAdmin() {
      return this.$store.getters.isAdmin;
    }
  }
};
</script>

<style>
#l-navbar .dropdown-divider {
  margin: 0;
}
#l-navbar a.nav-link {
  color: white;
  font-weight: 500;
  font-size: 14px;
}
#l-navbar .bg-dark {
  background-color: #24292e;
}
#l-navbar .dropdown-menu {
  font-size: 14px;
}
#l-navbar .avatar {
  width: 21px;
  height: 21px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
}
#l-navbar .navbar-toggler {
  border-width: 0;
}
#l-navbar {
  box-shadow: 0 12px 24px rgba(18, 38, 63, 0.1);
}
.dropdown-menu > li > a:hover {
  color: #007bff;
}
.dropdown-menu > li > a:active {
  color: white;
}
</style>
