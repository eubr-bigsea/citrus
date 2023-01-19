<template>
    <main role="main">
        <div class="title">
            <h1>{{ $t('home.recentlyUpdated') }}</h1>
        </div>

        <div class="home-card-container">
            <home-card v-if="listings.has('dataSources')" :type="'dataSource'" :items="dataSources"
                icon="fa fa-database" :total="total.dataSources" />
            <home-card v-if="listings.has('workflows')" :type="'workflow'" :items="workflows" :total="total.workflows"
                icon="fa fa-diagram-project" />
            <home-card v-if="listings.has('jobs')" :type="'job'" :items="jobs" :total="total.jobs" icon="fa fa-tasks" />
            <home-card v-if="listings.has('apps')" :type="'app'" :items="apps" :total="total.apps"
                icon="fa fa-microscope" />
            <home-card v-if="listings.has('dashboards')" :type="'dashboard'" :items="dashboards"
                :total="total.dashboards" icon="fa fa-chart-line" />
        </div>
    </main>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import HomeCard from '../components/home-card/HomeCard.vue';

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const standUrl = import.meta.env.VITE_STAND_URL;
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
const caipirinhaUrl = import.meta.env.VITE_CAIPIRINHA_URL;

export default {
    name: 'HomeView',
    components: { HomeCard },
    data() {
        return {
            listings: new Map(),
            apps: [],
            workflows: [],
            dataSources: [],
            dashboards: [],
            jobs: [],
            total: {
                apps: 0,
                dashboards: 0,
                dataSources: 0,
                jobs: 0,
                workflows: 0
            }
        };
    },
    computed: {
        ...mapGetters(['hasFeaturePermission', 'isAdmin'])
    },
    mounted() {
        const self = this;
        const workflowFilters = {
            fields: 'id,name,platform,user,updated,created',
            enabled: 1,
            types: 'WORKFLOW'
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
        this.listings.forEach(async (value, key, map) => { // eslint-disable-line no-unused-vars
            const params = Object.assign({}, commonFilters, value[1]);
            try {
                const resp = await axios.get(value[0], { params });
                self[key] = resp.data.data;
                self.total[key] = resp.data.pagination.total;
            } catch (e) {
                console.debug(e);
            }
        });
    }
};
</script>
<style>
.home-card-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    align-items: auto;
    align-content: flex-start
}
</style>