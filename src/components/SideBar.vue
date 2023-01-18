<template>
    <div id="sidebar-wrapper">
        <ul id="menu" class="sidebar-nav nav-pills nav-stacked">
            <li class="sidebar-brand">
                <button v-if="icon" id="btn-nav" type="button" class="navbar-toggle collapsed btn btn-sm mr-2"
                        @click="toggle">
                    <font-awesome-icon :icon="'fa ' + icon"
                                       fixed-width />
                </button>
                <img class="full_logo" src="../assets/lemonade_logo_white.svg" width="157" height="32"
                     alt="Lemonade">
                <!--img class="icon_logo" src="../assets/lemonade_icon.svg" width="25" height="32" alt="Lemonade" -->
            </li>
            <li :class="{active: path === '/home'}">
                <b-link :to="{ name: 'home' }"
                        class="text-success-2">
                    <font-awesome-icon icon="fa fa-home" size="lg" fixed-width /> {{$tc('titles.start', 2)}}
                </b-link>
            </li>
            <li class="mb-1" />
            <li :class="{active: path === '/projects'}">
                <b-link v-if="hasAnyPermission(DATA_SOURCE_PERMISSIONS) || isAdmin"
                        :to="{ name: 'projects' }"
                        class="text-success-2">
                    <font-awesome-icon icon="fa fa-shapes"
                                       size="lg"
                                       fixed-width /> {{$tc('titles.project', 2)}}
                </b-link>
            </li>
            <li :class="{active: path === '/data-sources'}">
                <b-link v-if="hasAnyPermission(DATA_SOURCE_PERMISSIONS) || isAdmin"
                        :to="{ name: 'dataSources' }"
                        class="text-success-2">
                    <font-awesome-icon icon="fa fa-database"
                                       size="lg"
                                       fixed-width /> {{$tc('titles.dataSource', 2)}}
                </b-link>
            </li>
            <li :class="{active: path === '/workflows'}">
                <b-link v-if="hasAnyPermission(WORKFLOW_PERMISSIONS) || isAdmin"
                        :to="{ name: 'workflows' }"
                        class="text-success-2">
                    <font-awesome-icon icon="fa fa-project-diagram"
                                       size="lg"
                                       fixed-width /> {{$tc('titles.workflow',
                                                            2)}}
                </b-link>
            </li>
            <li :class="{active: path === '/experiments'}">
                <b-link v-if="hasAnyPermission(APP_PERMISSIONS) || isAdmin"
                        :to="{ name: 'index-explorer' }"
                        class="text-success-2">
                    <font-awesome-icon icon="fa fa-vial"
                                       size="lg"
                                       fixed-width /> {{$tc('titles.dataExplorer', 2)}}
                </b-link>
            </li>
            <li :class="{active: path === '/apps'}">
                <b-link v-if="hasAnyPermission(APP_PERMISSIONS) || isAdmin"
                        :to="{ name: 'tracks' }"
                        class="text-success-2">
                    <font-awesome-icon icon="fa fa-microscope"
                                       size="lg"
                                       fixed-width /> {{$tc('titles.track', 2)}}
                </b-link>
            </li>
            <li :class="{active: path === '/jobs'}">
                <b-link v-if="hasAnyPermission(JOB_PERMISSIONS) || isAdmin"
                        :to="{ name: 'jobs' }"
                        class="text-success-2">
                    <font-awesome-icon icon="fa fa-tasks"
                                       size="lg"
                                       fixed-width /> {{$tc('titles.jobs', 2)}}
                </b-link>
            </li>
            <li :class="{active: path === '/dashboards'}">
                <b-link v-if="hasAnyPermission(DASHBOARD_PERMISSIONS) || isAdmin"
                        :to="{ name: 'dashboards' }"
                        class="text-success-2">
                    <font-awesome-icon icon="fa fa-chart-line"
                                       size="lg"
                                       fixed-width /> {{$tc('titles.dashboard', 2)}}
                </b-link>
            </li>
            <li class="mt-5" />

            <li :class="{active: path === '/admin'}">
                <b-link v-if="isAdmin"
                        :to="{ name: 'admin-start' }"
                        class="text-success-2">
                    <font-awesome-icon icon="fa fa-user-lock"
                                       size="lg"
                                       fixed-width /> {{$tc('titles.administration',
                                                            2)}}
                </b-link>
            </li>
            <li :class="{active: path === '/me'}">
                <b-link v-if="hasAnyPermission(DASHBOARD_PERMISSIONS) || isAdmin"
                        :to="{ name: 'dashboards' }"
                        class="text-success-2">
                    <font-awesome-icon icon="fa fa-user"
                                       size="lg"
                                       fixed-width />
                    {{user.name ? user.name.split(' ')[0]: ''}}
                </b-link>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            path: '',
            icon: '',
            APP_PERMISSIONS: ['APP_EDIT', 'APP_USE'],
            DASHBOARD_PERMISSIONS: ['DASHBOARD_EDIT', 'DASHBOARD_EDIT_ANY',
                'DASHBOARD_VIEW', 'DASHBOARD_VIEW_ANY'],
            DATA_SOURCE_PERMISSIONS: ['DATA_SOURCE_EDIT', 'DATA_SOURCE_LIST',
                'DATA_SOURCE_VIEW', 'DATA_SOURCE_EDIT_ANY', 'DATA_SOURCE_VIEW_ANY',
                'DATA_SOURCE_USE', 'DATA_SOURCE_USE_ANY'],
            DEPLOYMENT_PERMISSIONS: ['DEPLOYMENT_MANAGE'],
            JOB_PERMISSIONS: ['JOB_EDIT_ANY', 'RUN_WORKFLOW_API', 'JOB_VIEW_ANY'],
            SYSTEM_PERMISSIONS: ['ADMINISTRATOR', 'STORAGE_MANAGE', 'CLUSTER_MANAGE'],
            USER_PERMISSIONS: ['USER_MANAGE'],
            WORKFLOW_PERMISSIONS: ['WORKFLOW_EDIT', 'WORKFLOW_LIST',
                'WORKFLOW_VIEW', 'WORKFLOW_EDIT_ANY', 'WORKFLOW_VIEW_ANY',
                'WORKFLOW_EXECUTE', 'WORKFLOW_EXECUTE_ANY'],

        }
    },
    computed: {
        ...mapGetters(['hasAnyRole', 'hasAnyPermission', 'isAdmin', 'isManager', 'isMonitor', 'user'])
    },
    watch: {
        '$route'(to) {
            this.path = to.path;
            //console.debug(this.path)
        }
    },
    mounted() {
        this.toggle()
        this.icon = 'fa-bars';
    },

    methods: {
        toggle() {
            document.getElementById("wrapper").classList.toggle("toggled-2");
            this.icon = this.icon === 'fa-bars' ? 'fa-times' : 'fa-bars';
        }
    }
}
</script>
<style>
    :root {
        --color-nav: #3D9970;
        --forecolor-nav: #fff;

    }
    #btn-nav {
        color: var(--color-nav);
        background-color: #fff;
    }
    .nav-pills>li>a {
        border-radius: 0;
    }

    .text-success-2 {
        color: #3D9970;
    }

    #wrapper {
        padding-left: 0;
        -webkit-transition: all 0.5s ease;
        -moz-transition: all 0.5s ease;
        -o-transition: all 0.5s ease;
        transition: all 0.5s ease;
        overflow: hidden;
    }

    /*
    #wrapper.toggled {
        padding-left: 250px;
        overflow: hidden;
    }
    */

    #sidebar-wrapper {
        xborder-right: #3D9970 1px solid;
        z-index: 1000;
        position: absolute;
        left: 250px;
        width: 0;
        height: 100%;
        margin-left: -250px;
        overflow-y: auto;
        background:
            /*#3D9970; #222;*/
            var(--color-nav);
        -webkit-transition: all 0.5s ease;
        -moz-transition: all 0.5s ease;
        -o-transition: all 0.5s ease;
        transition: all 0.5s ease;

    }

    #wrapper.toggled-2 .full_logo {
        xdisplay: none;
    }

    #wrapper.toggled-2 .icon_logo {
        display: inline;
    }

    #wrapper .icon_logo {
        display: none;
    }

    #wrapper .full_logo {
        display: inline;
    }

    #wrapper.toggled-2 #sidebar-wrapper {
        width: 250px;
    }



    #page-content-wrapper {
        position: absolute;
        min-height: 100vh;
        width: 100%;
        overflow-x: hidden;
    }

    #wrapper.toggled #page-content-wrapper {
        position: relative;
        margin-right: 0px;
    }

    /*
    .fixed-brand {
        width: auto;
    }*/

    /* Sidebar Styles */

    .sidebar-nav {
        position: absolute;
        top: 0;
        width: 250px;
        margin: 0;
        padding: 0;
        list-style: none;
        margin-top: 2px;
    }
    .sidebar-nav li.sidebar-brand {
        text-indent: 7px;
    }
    .sidebar-nav li {
        text-indent: 4px;
        line-height: 35px;
    }

    .sidebar-nav li a {
        display: flex;
        align-items: center;
        margin: 5px -1px;
        padding-left: 12px;
        text-decoration: none;
        color: var(--forecolor-nav);
        /*#3D9970;*/
        xborder-left: #fff 2px solid;
        text-decoration: none;
    }

    .sidebar-nav li a svg {
        margin-right: 10px;
    }

    .sidebar-nav li a:hover {
        text-decoration: none;
        background: rgba(255, 255, 255, 0.2);
        border-left: #3D9970 2px solid;
    }

    .sidebar-nav li.active {
        /*border-left: 3px solid #c4ddd4;*/
        background: #258560;
    }

    .sidebar-nav li a:active,
    .sidebar-nav li a:focus {
        text-decoration: none;
    }

    .sidebar-nav>.sidebar-brand {
        height: 65px;
        font-size: 18px;
        line-height: 60px;
        text-align: left;
    }

    .sidebar-nav>.sidebar-brand a {
        color: #999999;
    }

    .sidebar-nav>.sidebar-brand a:hover {
        color: #fff;
        background: none;
    }

    .no-margin {
        margin: 0;
    }

    @media (min-width: 768px) {
        #wrapper {
            padding-left: 250px;
        }

        .fixed-brand {
            width: 250px;
        }

        /*#wrapper.toggled {
            padding-left: 0;
        }*/

        #sidebar-wrapper {
            width: 250px;
            overflow: hidden;
        }

        /*
        #wrapper.toggled #sidebar-wrapper {
            width: 250px;
        }
        */
        #wrapper.toggled-2 #sidebar-wrapper {
            width: 50px;
        }

        #wrapper.toggled-2 #sidebar-wrapper:hover {
            width: 250px;
        }

        #page-content-wrapper {
            /*padding: 20px;*/
            position: relative;
            -webkit-transition: all 0.5s ease;
            -moz-transition: all 0.5s ease;
            -o-transition: all 0.5s ease;
            transition: all 0.5s ease;
        }

        /*
        #wrapper.toggled #page-content-wrapper {
            position: relative;
            margin-right: 0;
            padding-left: 250px;
        }
        */
        #wrapper.toggled-2 #page-content-wrapper {
            position: relative;
            margin-right: 0;
            margin-left: -200px;
            -webkit-transition: all 0.5s ease;
            -moz-transition: all 0.5s ease;
            -o-transition: all 0.5s ease;
            transition: all 0.5s ease;
            width: auto;
        }
    }
</style>