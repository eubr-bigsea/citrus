<template>
    <b-navbar id="l-navbar" toggleable="md" sticky>
        <b-navbar-toggle target="nav_collapse" />
        <b-navbar-brand :to="{ name: 'home' }">
            <img src="../assets/lemonade_logo.svg" width="157" height="32" alt="Lemonade">
        </b-navbar-brand>
        <b-collapse id="nav_collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item :to="{ name: 'dataSources' }">
                    <span class="fa fa-database"></span> {{ $tc('titles.dataSource', 2) }}
                </b-nav-item>
                <b-nav-item :to="{ name: 'workflows' }">
                    <span class="fa fa-flask"></span> {{ $tc('titles.workflow', 2) }}
                </b-nav-item>
                <b-nav-item :to="{ name: 'jobs' }">
                    <span class="fa fa-tasks"></span> {{ $tc('titles.jobs', 2) }}
                </b-nav-item>
                <b-nav-item :to="{ name: 'dashboards' }">
                    <span class="fa fa-chart-line"></span> {{ $tc('titles.dashboard', 2) }} 
                </b-nav-item>
                <b-nav-item-dropdown v-if="hasRoles" right>
                    <template v-slot:button-content>
                        <span class="fa fa-user-lock"></span>
                        {{$tc('titles.administration', 2)}}
                    </template>
                    <b-dropdown-item :to="{ name: 'AdministrationUserList' }">
                        {{ $tc('titles.user', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-item :to="{ name: 'AdministrationRoleList' }">
                        {{ $tc('titles.role', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-item :to="{ name: 'configuration' }">
                        {{ $tc('titles.configuration', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item v-if="isAdmin" :to="{ name: 'clusters' }">
                        {{ $tc('titles.cluster', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-item v-if="isAdmin" :to="{ name: 'platforms' }">
                        {{ $tc('titles.platform', 2) }}
                    </b-dropdown-item>
                    <b-dropdown-item :to="{ name: 'models' }">
                        {{ $tc('titles.model', 2) }}
                    </b-dropdown-item>
               </b-nav-item-dropdown>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right ref="dropdown">
                    <template slot="button-content">
                        <v-gravatar :email="user.email" class="avatar" />
                        {{ user.name ? user.name.split(' ')[0]: '' }}
                    </template>

                    <b-dropdown-form style="width: 300px" class="text-center">
                        <v-gravatar :email="user.email" class="large-avatar" />
                        <p>
                            <strong>{{user.name}}</strong>
                            <br />
                            <small>{{user.email}}</small>
                        </p>
                        <p class="text-center">
                            <strong>{{$tc('titles.role', 2)}}</strong><br/>
                            <span class="badge badge-info mr-1 p-1" v-for="role in user.roles" :key="role.id">
                                {{role.label}}
                            </span>
                        </p>
                        <p class="border-top pt-2">
                            <b-button variant="primary" size="sm" @click="profile">{{ $t('titles.profile') }}</b-button>
                            <router-link :to="{name: 'logout'}" class="ml-2 btn btn-sm btn-danger">
                                {{ $t('common.logout') }}</router-link>
                        </p>
                    </b-dropdown-form>
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
            ...mapGetters(['hasRoles', 'isAdmin', 'isManager', 'isMonitor', 'user'])
        },
        data() {
            return { xuser: {} }
        },
        mounted() {
            //this.user = this.$store.getters.user;
        },
        methods: {
            profile(evt) {
                this.$refs.dropdown.hide(true);
                this.$router.push({ name: 'profile' });
            }
        }
    };
</script>

<style>

    #l-navbar {
        background-color: #fff;
        box-shadow: 0 0 8px rgba(0, 0, 0, .16);
    }

    #l-navbar .dropdown-divider {
        margin: 0;
    }

    .navbar-brand {
        margin-right: 3rem!important;
    }

    #l-navbar a.nav-link {
        font-weight: 500;
        font-size: 14px;
    }

    #l-navbar a.nav-link span {
        color: var(--primary-color);
    }

    #l-navbar .bg-dark {
        background-color: #24292e;
    }

    #l-navbar .dropdown-menu {
        font-size: 14px;
    }

    .navbar .nav-item {
        margin: 0 .5rem;
    }

    .navbar .nav-item .nav-link{
        line-height: calc(60px - 4px);
        padding: 0;
        border-bottom: solid 4px #FFFFFF00;
    }
    
    .navbar .nav-item .nav-link:hover {
        border-bottom-color: var(--secondary-color);
    }

    @media (min-width: 768px) {
        .navbar-collapse {
            height: 60px;
            margin: -0.5rem 0;
        }

        .navbar-nav {
            height: 100%;
        }
    }

    #l-navbar .avatar,
    .large-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid #888;
        margin-right: 5px;
        vertical-align: middle;
    }

    .large-avatar {
        width: 48px;
        height: auto;
    }

    #l-navbar .navbar-toggler {
        border-width: 0;
    }

    .dropdown-menu>li>a:hover {
        color: #007bff;
    }

    .dropdown-menu>li>a:active {
        color: white;
    }
</style>
