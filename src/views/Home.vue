<template>
    <div class="row lemonade">
        <div class="col-md-12 col-sm-12">
            <div class="jumbotron pt-2 pb-2">
                <h1 class="display-4">{{$t('titles.lemonadePlatform')}}</h1>
                <p class="lead text-justify">{{$t('home.aPlatformForDataScience')}}</p>
                <hr class="my-4">
                <p class="text-justify">{{$t('home.welcome')}}</p>
                <p class="lead">
                    <a class="btn btn-primary btn-lg" href="http://www.lemonade.org.br" role="button">{{$t('home.learnMore')}}</a>
                </p>
            </div>
        </div>
        <div class="col-sm-12 col-md-4 border">
            <div class="card mb-3">
                <div class="text-white card-header bg-secondary ">
                    <h5 class="card-title updated">{{$t('home.recentlyUpdated', {what: $tc('titles.workflow', 2).toLowerCase() })}}</h5>
                </div>
                <div class="card-body">
                    <div v-if="loading.workflows">
                        <font-awesome-icon icon="spinner" pulse class="fa-3x" />
                    </div>
                    <div class="table-responsive" v-else>
                        <table class="table table-sm">
                            <tr v-for="w in workflows" :key="w.id">
                                <td>
                                    <router-link :to="{name: 'editWorkflow', params: {id: w.id, platform: w.platform.id}}">
                                        {{w.id}} - {{w.name}}
                                    </router-link>
                                    <br/>
                                    <small>{{w.updated}}</small>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <span v-if="workflows.length === 0 && !loading.workflows">
                        {{$t('common.noData')}}
                    </span>
                </div>
            </div>

        </div>
        <div class="col-sm-12 col-md-4 border">
            <div class="card mb-3">
                <div class="text-white card-header bg-secondary ">
                    <h5 class="card-title updated">{{$t('home.recentlyUpdated', {what: $tc('titles.dataSource', 2).toLowerCase() })}}</h5>
                </div>
                <div class="card-body">
                    <div v-if="loading.dataSources">
                        <font-awesome-icon icon="spinner" pulse class="fa-3x" />
                    </div>
                    <div class="table-responsive" v-else>
                        <table class="table table-sm">
                            <tr v-for="d in dataSources" :key="d.id">
                                <td>
                                    <router-link :to="{name: 'editDataSource', params: {id: d.id}}">
                                        {{d.id}} - {{d.name}}
                                    </router-link>
                                    <br/>
                                    <small>{{d.updated}}</small>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <span v-if="dataSources.length === 0 && !loading.dataSources">
                        {{$t('common.noData')}}
                    </span>
                </div>
            </div>
        </div>
        <div class="col-sm-12 col-md-4 border">
            <div class="card mb-3" id="latest-jobs">
                <div class="text-white card-header bg-secondary ">
                    <h5 class="card-title updated">{{$t('home.recentlyUpdated', {what: $tc('titles.job', 2).toLowerCase() })}}</h5>
                </div>
                <div class="card-body">
                    <div v-if="loading.jobs">
                        <font-awesome-icon icon="spinner" pulse class="fa-3x" />
                    </div>
                    <div class="table-responsive" v-else>
                        <table class="table table-sm">
                            <tr v-for="j in jobs" :key="j.id">
                                <td>
                                    <router-link :to="{name: 'editJob', params: {id: j.id}}">
                                        {{j.id}} - {{j.name}}
                                    </router-link>
                                    <br/>
                                    <small>{{j.created}}</small>
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
                page: 1, sort: 'updated', asc: false, size: 5,
                fields: 'id,name,platform.id,updated'
            }
            let dataSourceFilters = {
                page: 1, sort: 'updated', asc: false, size: 5,
                fields: 'id,name,updated'
            }
            let jobFilters = {
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
        height: 85vh;
        overflow: hidden;
    }
    .lemonade>div {
        max-height: 95vh;
        overflow: auto;
    }

    .card {
        height: 98%;
    }
    .updated::first-letter {
        text-transform: uppercase;
    }
</style>