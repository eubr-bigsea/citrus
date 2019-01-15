<template>
    <div>
        <vue-snotify></vue-snotify>
        <div class="container-fluid">
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <router-link :to="{name: 'home'}" class="navbar-brand">
                    <div class="navbar-brand logo">
                        <img/>
                    </div>
                    <span>Lemonade Citrus</span>
                </router-link>
                <!--
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse"
                aria-expanded="false" aria-label="Toggle navigation" v-if="isLoggedIn">
                <span class="navbar-toggler-icon"></span>
            </button>
            <button type="button" @click="toggleSideBar" v-if="isLoggedIn">
                <span class="navbar-toggler-icon"></span>
            </button>
        -->
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav mr-auto" v-if="isLoggedIn">
                        <li class="divider-vertical nav-item"></li>
                        <li class="nav-item">
                            <router-link :to="{name: 'dataSources'}" class="nav-link">{{$tc('titles.dataSource', 2)}}</router-link>
                        </li>
                        <li class="divider-vertical nav-item"></li>
                        <li class="nav-item">
                            <router-link :to="{name: 'workflows'}" class="nav-link">{{$tc('titles.workflow', 2)}}</router-link>
                        </li>
                        <li class="divider-vertical nav-item"></li>
                        <li class="nav-item">
                            <router-link :to="{name: 'jobs'}" class="nav-link">{{$tc('titles.jobs', 2)}}</router-link>
                        </li>
                        <li class="divider-vertical nav-item"></li>
                        <li class="nav-item">
                            <router-link :to="{name: 'dashboards'}" class="nav-link">{{$tc('titles.dashboard', 2)}}</router-link>
                        </li>
                        <!-- <li class="divider-vertical nav-item"></li>
                        <li class="nav-item">
                            <router-link :to="{name: 'administration'}" class="nav-link">{{$tc('titles.administration', 2)}}</router-link>
                        </li> -->
                        <!--
                        <li class="divider-vertical nav-item"></li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">{{$tc('titles.whatIfModel', 1)}}</a>
                        </li>
                        -->
                        <li class="divider-vertical nav-item"></li>
                            <b-nav-item-dropdown class="mb-1">
                                <!-- Using button-content slot -->
                                <template slot="button-content">
                                    {{$tc('titles.administration', 1)}}
                                </template>
                                <b-dropdown-item to="/user/profile"><span class="fa fa-user"></span> {{$tc('titles.user', 2)}}</b-dropdown-item>
                                <b-dropdown-divider></b-dropdown-divider>
                                <b-dropdown-item to="/user/profile"><span class="fa fa-user"></span> {{$tc('titles.cluster', 2)}}</b-dropdown-item>
                                <b-dropdown-item to="/user/profile">{{$tc('titles.platform', 2)}}</b-dropdown-item>
                                <b-dropdown-item to="/user/profile"><span class="fa fa-database"></span> {{$tc('titles.storage', 2)}}</b-dropdown-item>
                                <b-dropdown-divider></b-dropdown-divider>
                                <b-dropdown-item to="/user/profile">{{$tc('titles.template', 2)}}</b-dropdown-item>
                                <b-dropdown-divider></b-dropdown-divider>
                                <b-dropdown-item to="/user/profile">{{$t('titles.toolboxCategory')}}</b-dropdown-item>
                                <b-dropdown-divider></b-dropdown-divider>
                            </b-nav-item-dropdown>
                    </ul>
                </div>
                
                <ul class="nav navbar-nav navbar-right" v-if="isLoggedIn">
                    <b-nav-item-dropdown right>
                        <!-- Using button-content slot -->
                        <template slot="button-content">
                            <font-awesome-icon icon="user" size="1x"></font-awesome-icon>
                            &nbsp;
                            <em>{{user.email}}</em>
                        </template>
                        <b-dropdown-item to="/user/profile">{{$t('titles.profile')}}</b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item to="/logout">{{$t('common.logout')}}</b-dropdown-item>
                    </b-nav-item-dropdown>

                </ul>
            </nav>

            <main>
                <div ref="sideBar" class="sidenav" v-if="isLoggedIn && false">
                    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
                    <a href="#">
                        <font-awesome-icon icon="coffee" size="1x"></font-awesome-icon> About</a>
                    <a href="#">
                        <font-awesome-icon icon="home"></font-awesome-icon> Project</a>
                    <a href="#">
                        <font-awesome-icon icon="home"></font-awesome-icon> Data set</a>
                    <a href="#">
                        <font-awesome-icon icon="home"></font-awesome-icon> Deployment</a>
                    <a href="#">
                        <font-awesome-icon icon="home"></font-awesome-icon> Environment</a>
                    <a href="#">
                        <font-awesome-icon icon="home"></font-awesome-icon> Notebook</a>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <router-view></router-view>
                    </div>
                    <!--
                    <div class="col-md-12 ">
                        <v-client-table :data="tableData" :columns="columns" :options="options">
                            <template slot="symbol" slot-scope="props">
                                <span v-html="props.row.symbol" /> 
                            </template>
                        </v-client-table>
                    </div>
                -->
                </div>
            </main>
            <footer>

            </footer>
            <vue-progress-bar></vue-progress-bar>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        components: {
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
                columns: ['code', 'symbol', 'rate'],
                tableData: [],
                showSideBar: false,
                options: {
                    xtemplates: {
                        symbol: function (row) {
                            return row.symbol
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
            }
        },
        methods: {
            toggleSideBar() {
                let sideBar = this.$refs.sideBar
                let width = this.showSideBar ? '48px' : '250px'
                this.showSideBar = !this.showSideBar
                sideBar.style.width = width
            },
        },
        mounted() {
            // this.axios.get('https://api.coindesk.com/v1/bpi/currentprice.json').then(res => {
            //     this.tableData = Object.values(res.data.bpi)
            // })
        }
    }
</script>

<style>
    .dropdown-divider {
        margin: 0 !important;
    }
</style>