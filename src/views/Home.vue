<template>
    <div class="row lemonade">
        <div class="col-md-4 col-sm-12">
            <div class="card pt-0 pb-1 mb-0">
                <div class="card-body">
                    <h3 class="display-5">{{$t('titles.lemonadePlatform')}}</h3>
                    <p class="lead text-justify">{{$t('home.aPlatformForDataScience')}}</p>
                    <p class="text-justify">{{$t('home.welcome')}}</p>
                    <p class="lead">
                        <a class="btn btn-primary btn" href="http://www.lemonade.org.br" role="button">{{$t('home.learnMore')}}</a>
                    </p>
                </div>
            </div>
        </div>
        <div class="col-md-8 col-sm-12">
            <div class="card">
                <div class="card-header bg-white">
                    <h5 class="card-title updated">{{$t('home.recentlyUpdated')}}</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div v-if="loading.workflows">
                                <font-awesome-icon icon="spinner" pulse class="fa-3x" />
                            </div>
                            <div v-else>
                                <strong>{{$tc('titles.workflow', 2)}}</strong>
                                <table class="table">
                                    <tr v-for="w in workflows" :key="w.id">
                                        <td class="text-right">{{w.id}}</td>
                                        <td>
                                        <router-link :to="{name: 'editWorkflow', params: {id: w.id, platform: w.platform.id}}">
                                            {{w.name}}
                                        </router-link>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <span v-if="workflows.length === 0 && !loading.workflows">
                                {{$t('common.noData')}}
                            </span>
                        </div>
                        <div class="col-md-4">
                            <div v-if="loading.dataSources">
                                <font-awesome-icon icon="spinner" pulse class="fa-3x" />
                            </div>
                            <div v-else>
                                <strong>{{$tc('titles.dataSource', 2)}}</strong>
                                <table class="table">
                                    <tr v-for="d in dataSources" :key="d.id">
                                        <td class="text-right">{{d.id}}</td>
                                        <td>
                                        <router-link :to="{name: 'editDataSource', params: {id: d.id}}">
                                            {{d.name}}
                                        </router-link>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <span v-if="dataSources.length === 0 && !loading.dataSources">
                                {{$t('common.noData')}}
                            </span>
                        </div>
                        <div class="col-md-4">
                            <div v-if="loading.jobs">
                                <font-awesome-icon icon="spinner" pulse class="fa-3x" />
                            </div>
                            <div class="table-responsive" v-else>
                                <strong>{{$tc('titles.job', 2)}}</strong>
                                <table class="table">
                                    <tr v-for="j in jobs" :key="j.id">
                                        <td class="text-right">{{j.id}}</td>
                                        <td>
                                        <router-link :to="{name: 'editJob', params: {id: j.id}}">
                                            {{j.name}}
                                        </router-link>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <span v-if="jobs.length === 0 && !loading.jobs">
                                {{$t('common.noData')}}
                            </span>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    let tahitiUrl = process.env.VUE_APP_TAHITI_URL
    let standUrl = process.env.VUE_APP_STAND_URL
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    export default {
        name: 'home',
        components: {

        },
        data() {
            return {
                listings: {},
                workflows: [],
                dataSources: [],
                jobs: [],
                loading: {
                    workflows: false,
                    dataSources: true,
                    jobs: false
                }
            }
        },
        mounted() {
            let self = this;
            let workflowFilters = {
                enabled: 1,
                page: 1, sort: 'updated', asc: false, size: 5,
                fields: 'id,name,platform.id,updated'
            }
            let dataSourceFilters = {
                enabled: 1,
                page: 1, sort: 'updated', asc: false, size: 5,
                fields: 'id,name,updated'
            }
            let jobFilters = {
                enabled: 1,
                page: 1, sort: 'created', asc: false, size: 5,
                fields: 'id,name,created,workflow.name'
            }
            let listings = new Map([
                ['workflows', [`${tahitiUrl}/workflows`, workflowFilters]],
                ['dataSources', [`${limoneroUrl}/datasources`, dataSourceFilters]],
                ['jobs', [`${standUrl}/jobs`, jobFilters]],
            ]);
            this.listings = listings
            listings.forEach((value, key, map) => {
                self.loading[key] = true
                axios.get(value[0], { params: value[1] }).then(resp => {
                    self[key] = resp.data.data
                    self.loading[key] = false
                }).catch((e) => {
                    console.debug(e)
                    self.loading[key] = false
                });
            });
        }
    }
</script>
<style scoped>
    .lemonade {
        height: 80vh;
        overflow: hidden;
    }

    .lemonade>div {
        max-height: 95vh;
        overflow: auto;
    }

    .card,
    .jumbotron {
        height: 80vh;
    }

    .updated::first-letter {
        text-transform: uppercase;
    }
</style>