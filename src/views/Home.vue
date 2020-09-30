<template>
    <main role="main">

        <div class="title">
            <h1>{{$t('home.recentlyUpdated')}}</h1>
        </div>

        <div class="row">
            <HomeCard v-if="listings.has('dataSources')" :type="'dataSource'" :items="dataSources"
                :total="total.dataSources"></HomeCard>
            <HomeCard v-if="listings.has('workflows')" :type="'workflow'" :items="workflows" :total="total.workflows">
            </HomeCard>
            <HomeCard v-if="listings.has('jobs')" :type="'job'" :items="jobs" :total="total.jobs"></HomeCard>
            <HomeCard v-if="listings.has('dashboards')" :type="'dashboard'" :items="dashboards"
                :total="total.dashboards"></HomeCard>
            <HomeCard v-if="listings.has('apps')" :type="'app'" :items="apps" :total="total.apps"></HomeCard>
        </div>
    </main>
</template>

<script>
    import { mapGetters } from 'vuex';
    import axios from 'axios';
    import HomeCard from '../components/home-card/HomeCard.vue';

    const tahitiUrl = process.env.VUE_APP_TAHITI_URL;
    const standUrl = process.env.VUE_APP_STAND_URL;
    const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
    const caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;

    export default {
        name: 'Home',
        components: {
            HomeCard
        },
        computed: {
            ...mapGetters(['hasFeaturePermission', 'isAdmin'])
        },
        data() {
            return {
                listings: new Map(),
                apps: [],
                workflows: [],
                dataSources: [],
                dashboards: [],
                jobs: [],
                loading: {
                    apps: true,
                    dashboards: true,
                    dataSources: true,
                    jobs: true,
                    workflows: true
                },
                total: {
                    apps: 0,
                    dashboards: 0,
                    dataSources: 0,
                    jobs: 0,
                    workflows: 0
                }
            };
        },
        mounted() {
            const self = this;
            const workflowFilters = {
                fields: 'id,name,platform,user,updated,created'
            };
            const dataSourceFilters = {
                fields: 'id,name,description,format,updated,created'
            };
            const jobFilters = {
                sort: 'created',
                fields: 'id,user,workflow,status,created,finished'
            };
            const dashboardFilters = {
                sort: 'created',
                fields: 'id,title,user,updated,created'
            };
            const appFilters = {
                track: 1,
                published: 1,
                fields: 'id,name,user,updated,created,platform,description'
            }
            const admin = this.isAdmin;
            this.listings = new Map([
                ['apps', [`${tahitiUrl}/workflows`, appFilters,
                    'APP_PERMISSIONS']],
                ['workflows', [`${tahitiUrl}/workflows`, workflowFilters,
                    'WORKFLOW_PERMISSIONS']],
                ['dataSources', [`${limoneroUrl}/datasources`, dataSourceFilters,
                    'DATA_SOURCE_PERMISSIONS']],
                ['jobs', [`${standUrl}/jobs`, jobFilters,
                    'JOB_PERMISSIONS']],
                ['dashboards', [`${caipirinhaUrl}/dashboards`, dashboardFilters,
                    'DASHBOARD_PERMISSIONS']]
            ].filter(v => admin || this.hasFeaturePermission(v[1][2])));

            const commonFilters = {
                enabled: 1,
                page: 1,
                sort: 'updated',
                asc: false,
                size: 5,
            };
            this.listings.forEach((value, key, map) => {
                self.loading[key] = true;
                const params = Object.assign({}, commonFilters, value[1]);
                axios
                    .get(value[0], { params })
                    .then(resp => {
                        self[key] = resp.data.data;
                        self.loading[key] = false;
                        self.total[key] = resp.data.pagination.total;
                    })
                    .catch(e => {
                        console.debug(e);
                        self.loading[key] = false;
                    });
            });
        }
    };
</script>