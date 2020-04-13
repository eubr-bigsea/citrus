<template>
  <main role="main">
    <div class="row">
      <div class="col-12">
        <h1>{{$t('home.recentlyUpdated')}}</h1>
      </div>
      <hr>
    </div>

    <div class="row">
      <HomeCard :type="'dataSource'" :items="dataSources" :total="total.dataSources"></HomeCard>
      <HomeCard :type="'workflow'" :items="workflows" :total="total.workflows"></HomeCard>
      <HomeCard :type="'job'" :items="jobs" :total="total.jobs"></HomeCard>
      <HomeCard :type="'dashboard'" :items="dashboards" :total="total.dashboards"></HomeCard>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import HomeCard from '../components/home-card/HomeCard.vue';

let tahitiUrl = process.env.VUE_APP_TAHITI_URL;
let standUrl = process.env.VUE_APP_STAND_URL;
let limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
let caipirinhaUrl = process.env.VUE_APP_CAIPIRINHA_URL;

export default {
  name: 'Home',
  components: {
    HomeCard
  },
  data() {
    return {
      listings: {},
      workflows: [],
      dataSources: [],
      dashboards: [],
      jobs: [],
      loading: {
        dashboards: true,
        dataSources: true,
        jobs: true,
        workflows: true
      },
      total: {
        dashboards: 0,
        dataSources: 0,
        jobs: 0,
        workflows: 0
      }
    };
  },
  mounted() {
    let self = this;
    let workflowFilters = {
      enabled: 1,
      page: 1,
      sort: 'updated',
      asc: false,
      size: 5,
      fields: 'id,name,platform,user,updated,created'
    };
    let dataSourceFilters = {
      enabled: 1,
      page: 1,
      sort: 'updated',
      asc: false,
      size: 5,
      fields: 'id,name,description,format,updated,created'
    };
    let jobFilters = {
      enabled: 1,
      page: 1,
      sort: 'created',
      asc: false,
      size: 5,
      fields: 'id,user,workflow,status,created,finished'
    };
    let dashboardFilters = {
      enabled: 1,
      page: 1,
      sort: 'created',
      asc: false,
      size: 5,
      fields: 'id,title,user,updated,created'
    };
    let listings = new Map([
      ['workflows', [`${tahitiUrl}/workflows`, workflowFilters]],
      ['dataSources', [`${limoneroUrl}/datasources`, dataSourceFilters]],
      ['jobs', [`${standUrl}/jobs`, jobFilters]],
      ['dashboards', [`${caipirinhaUrl}/dashboards`, dashboardFilters]]
    ]);
    this.listings = listings;
    listings.forEach((value, key, map) => {
      self.loading[key] = true;
      axios
        .get(value[0], { params: value[1] })
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
